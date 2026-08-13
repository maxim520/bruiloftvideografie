<?php

/**
 * Contactformulier-endpoint voor Behind Every Wedding.
 *
 * Dit is het enige uitvoerbare bestand op de server: de rest van de site
 * is een statische export (next build, output: "export") die via FTPS
 * naar TransIP-hosting gaat. Dat betekent dat dit bestand direct vanaf
 * het publieke internet bereikbaar is, zonder framework, zonder
 * middleware, zonder iets dat ertussen zit — vijandig terrein. Elke
 * regel hieronder gaat uit van een aanvaller die de client-code niet
 * gebruikt en rechtstreeks POST't.
 *
 * Verwachte serverstructuur (zie ook server-private/config.example.php):
 *
 *   <account-root>/
 *     public_html/            <- webroot; hier komt de inhoud van out/
 *       api/
 *         contact.php         <- dit bestand
 *     server-private/         <- NIET onder public_html, dus nooit via HTTP bereikbaar
 *       config.php            <- Resend-key + adressen, zie config.example.php
 *       contact-error.log     <- wordt hieronder aangemaakt
 *       rate-limits/          <- wordt hieronder aangemaakt; één bestand per IP-hash
 *       cleanup-rate-limits.php  <- los script, via een cronjob te draaien (zie dat bestand)
 *
 * Pas PRIVATE_DIR hieronder aan als de daadwerkelijke mapstructuur op
 * TransIP hiervan afwijkt. dirname(__DIR__, 2) gaat van public_html/api/
 * naar public_html/, en dan één laag hoger, naar de map naast public_html/.
 */

declare(strict_types=1);

// ---------------------------------------------------------------------
// Bootstrap: foutafhandeling eerst, vóór al het overige. Als hierna nog
// iets misgaat — ook iets onverwachts, ook een bug in dit bestand zelf —
// mag dat nooit als ruwe PHP-foutmelding (met bestandspaden en
// stacktraces) naar de client lekken. (Vereiste 10, 11)
// ---------------------------------------------------------------------

define('PRIVATE_DIR', dirname(__DIR__, 2) . '/server-private');

ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', PRIVATE_DIR . '/contact-error.log');
error_reporting(E_ALL);

/** Onverwachte PHP-fouten (warnings/notices) ook via de eigen exception-flow afhandelen. */
set_error_handler(function (int $severity, string $message, string $file, int $line): bool {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

final class RateLimitExceededException extends RuntimeException
{
}

// ---------------------------------------------------------------------
// Configuratie & constanten
// ---------------------------------------------------------------------

/**
 * Whitelist van toegestane herkomst. Vereiste 2: een mismatch hier
 * betekent dat de aanvraag niet van de eigen site komt (of een
 * aanvrager die Origin/Referer expres weglaat) en wordt geweigerd,
 * ongeacht wat de rest van de aanvraag verder bevat.
 */
const ALLOWED_ORIGINS = [
    'https://behindeverywedding.nl',
    'https://www.behindeverywedding.nl',
];

/** Vereiste 4: maximale totale body-grootte, geweigerd vóór enige verwerking. */
const MAX_BODY_BYTES = 24 * 1024;

/** Vereiste 4: maximale lengte per veld — ruim boven wat een legitieme aanvraag ooit nodig heeft. */
const FIELD_MAX_LENGTHS = [
    'names' => 120,
    'email' => 254,
    'phone' => 40,
    'weddingDate' => 20,
    'weddingLocation' => 200,
    'service' => 60,
    'message' => 5000,
    'website' => 200,
    'renderedAt' => 30,
];

/** Zelfde vaste opties als SERVICE_OPTIONS in ContactForm.tsx. */
const SERVICE_OPTIONS = [
    'Fotografie',
    'Videografie',
    'Fotografie & videografie',
    'Destination wedding',
    'Nog niet zeker',
];

/** Vereiste 8: minimale invultijd. */
const MIN_FILL_TIME_MS = 3000;

/** Vereiste 6: rate limiting. */
const RATE_LIMIT_WINDOW_SECONDS = 3600;
const RATE_LIMIT_MAX_REQUESTS = 5;

// ---------------------------------------------------------------------
// Kleine hulpfuncties voor consistente, generieke responses
// ---------------------------------------------------------------------

/**
 * Stuurt een generieke foutmelding naar de client (vereiste 11: nooit
 * stacktraces of paden) en logt het echte, specifieke detail alleen
 * server-side (vereiste 10).
 */
function fail(int $status, string $clientMessage, ?string $logDetail = null): never
{
    if ($logDetail !== null) {
        error_log("contact.php [$status]: $logDetail");
    }
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => $clientMessage]);
    exit;
}

function succeed(): never
{
    http_response_code(200);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => true]);
    exit;
}

// ---------------------------------------------------------------------
// Vereiste 1: alleen POST
// ---------------------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail(405, 'Methode niet toegestaan.', 'methode was ' . ($_SERVER['REQUEST_METHOD'] ?? '(onbekend)'));
}

// ---------------------------------------------------------------------
// Vereiste 2: Origin/Referer tegen whitelist
// ---------------------------------------------------------------------

/**
 * Checkt Origin eerst (betrouwbaarder, door de browser gezet en niet
 * door JS te overschrijven); valt terug op het schema+host van Referer
 * als Origin ontbreekt. Ontbreken beide, dan is dat zelf al verdacht
 * genoeg voor een browser-fetch vanaf de eigen site — weigeren.
 */
function origin_is_allowed(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? null;
    if ($origin !== null) {
        return in_array($origin, ALLOWED_ORIGINS, true);
    }

    $referer = $_SERVER['HTTP_REFERER'] ?? null;
    if ($referer !== null) {
        $parts = parse_url($referer);
        if ($parts !== false && isset($parts['scheme'], $parts['host'])) {
            $refererOrigin = $parts['scheme'] . '://' . $parts['host'];
            if (isset($parts['port'])) {
                $refererOrigin .= ':' . $parts['port'];
            }
            return in_array($refererOrigin, ALLOWED_ORIGINS, true);
        }
    }

    return false;
}

if (!origin_is_allowed()) {
    fail(
        403,
        'Niet toegestaan.',
        'origin/referer buiten whitelist: origin=' . ($_SERVER['HTTP_ORIGIN'] ?? '(geen)') .
            ' referer=' . ($_SERVER['HTTP_REFERER'] ?? '(geen)'),
    );
}

// ---------------------------------------------------------------------
// Vereiste 6: rate limiting op IP, opgeslagen buiten de webroot
// ---------------------------------------------------------------------

/**
 * REMOTE_ADDR (het daadwerkelijke TCP-verbindingsadres) i.p.v. een
 * X-Forwarded-For-achtige header: dat laatste stuurt de client zelf mee
 * en is dus triviaal te vervalsen, tenzij bekend is dat de hosting via
 * een vertrouwde proxy loopt die zo'n header zelf overschrijft. Dat is
 * voor deze TransIP-hosting niet geverifieerd, dus wordt hier bewust
 * niet op vertrouwd.
 */
function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? 'onbekend';
}

const RATE_LIMIT_DIR = PRIVATE_DIR . '/rate-limits';

/**
 * Eén bestand per IP i.p.v. één gedeeld bestand voor iedereen: bij het
 * eerdere ontwerp las/herschreef élke aanvraag — van elke bezoeker — het
 * complete bestand onder één exclusive lock, dus alle aanvragen
 * serialiseerden op elkaar en het bestand groeide met elk uniek IP. Nu
 * raakt een aanvraag alleen nog het bestand van zijn eigen IP; aanvragen
 * van verschillende bezoekers lopen elkaar niet meer in de weg.
 *
 * De bestandsnaam is een sha256-hash van het IP, nooit het IP zelf: een
 * hash is altijd een vaste-lengte hexstring en kan dus per definitie geen
 * pad-traversal of ander onverwacht teken bevatten, ongeacht wat er
 * binnenkomt — dat is waarom dit geen "gebruikersinvoer in een
 * bestandsnaam" is. Opruiming van bestanden voor IP's die niet
 * terugkomen gebeurt niet hier (dat zou weer een groeiende, bij elke
 * aanvraag te doorzoeken map betekenen) maar in het aparte
 * server-private/cleanup-rate-limits.php, bedoeld om periodiek via een
 * cronjob te draaien.
 */
function rate_limit_file_path(string $ip): string
{
    return RATE_LIMIT_DIR . '/' . hash('sha256', $ip) . '.json';
}

function check_and_record_rate_limit(string $ip): void
{
    if (!is_dir(RATE_LIMIT_DIR)) {
        // @: onderdrukt alleen de "already exists"-waarschuwing bij een
        // race tussen twee gelijktijdige eerste aanvragen — de is_dir()
        // hieronder bepaalt het echte resultaat, niet de returnwaarde
        // van mkdir(). Dit is de enige plek in dit bestand die een
        // PHP-waarschuwing bewust onderdrukt, en wel om precies deze
        // ene, onschuldige, bekende race — nergens anders.
        if (!@mkdir(RATE_LIMIT_DIR, 0700, true) && !is_dir(RATE_LIMIT_DIR)) {
            throw new RuntimeException('kan rate-limits-map niet aanmaken: ' . RATE_LIMIT_DIR);
        }
    }

    $path = rate_limit_file_path($ip);
    $handle = fopen($path, 'c+');
    if ($handle === false) {
        throw new RuntimeException("kan rate-limit-bestand niet openen: $path");
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException('kan geen lock verkrijgen op rate-limit-bestand');
        }

        $raw = stream_get_contents($handle);
        $timestamps = $raw !== false && $raw !== '' ? json_decode($raw, true) : [];
        if (!is_array($timestamps)) {
            $timestamps = [];
        }

        $now = time();
        $windowStart = $now - RATE_LIMIT_WINDOW_SECONDS;
        $recent = array_values(array_filter(
            $timestamps,
            static fn($t): bool => is_int($t) && $t >= $windowStart,
        ));

        $exceeded = count($recent) >= RATE_LIMIT_MAX_REQUESTS;
        if (!$exceeded) {
            $recent[] = $now;
        }

        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($recent));
        fflush($handle);

        if ($exceeded) {
            throw new RateLimitExceededException('limiet bereikt voor ip-hash ' . hash('sha256', $ip));
        }
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

/**
 * Goedkope, alleen-lezende voorcontrole: is dit IP al over zijn limiet,
 * dan meteen weigeren, vóór er iets van de aanvraag gelezen of geparsed
 * wordt. Schrijft niets weg en verbruikt dus geen slot — dat gebeurt pas
 * in check_and_record_rate_limit() hierboven, na de honeypot-check.
 *
 * Zonder deze voorcontrole houdt een aanvaller wiens IP al over de
 * limiet zit een onbeperkte poort naar de duurdere stappen (body lezen,
 * JSON parsen, straks Resend aanroepen bij een geslaagde poging): elke
 * afzonderlijke afwijzing daar is op zich goedkoop, maar er staat niets
 * boven op het totale aantal per tijdseenheid. Deze functie geeft dat
 * plafond terug, vóór er iets van dat werk gebeurt.
 *
 * Shared lock (LOCK_SH) i.p.v. exclusive: alleen om te voorkomen dat we
 * een gedeeltelijk geschreven bestand lezen terwijl een andere aanvraag
 * van hetzelfde IP net aan het schrijven is (ftruncate() vóór fwrite()
 * laat het bestand heel even leeg zien) — niet om schrijvers te blokkeren,
 * want die gebruikt zelf al een exclusive lock die op deze shared lock
 * wacht.
 */
function is_rate_limited(string $ip): bool
{
    $path = rate_limit_file_path($ip);
    if (!is_file($path)) {
        return false;
    }

    $handle = fopen($path, 'r');
    if ($handle === false) {
        // Niet te lezen is geen reden om te blokkeren op iets wat niet
        // te controleren viel; check_and_record_rate_limit() hierboven
        // doet dadelijk alsnog de echte, schrijvende poging.
        return false;
    }

    try {
        if (!flock($handle, LOCK_SH)) {
            return false;
        }

        $raw = stream_get_contents($handle);
        $timestamps = $raw !== false && $raw !== '' ? json_decode($raw, true) : [];
        if (!is_array($timestamps)) {
            return false;
        }

        $windowStart = time() - RATE_LIMIT_WINDOW_SECONDS;
        $recent = array_filter(
            $timestamps,
            static fn($t): bool => is_int($t) && $t >= $windowStart,
        );

        return count($recent) >= RATE_LIMIT_MAX_REQUESTS;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

// ---------------------------------------------------------------------
// Hoofdlogica, met vangnet voor werkelijk alles wat hierna nog misgaat
// ---------------------------------------------------------------------

/**
 * Vereiste 3: dezelfde regels als het Zod-schema in ContactForm.tsx.
 * `service` krijgt hier bewust wél een expliciete whitelist-check, ook
 * al toetst de Zod-kant alleen op non-empty: de echte beperking (één van
 * de vijf SERVICE_OPTIONS) zit in de client alleen in de vaste
 * <select>-opties, dus puur op UI-niveau. Vertrouw de client-validatie
 * niet betekent hier: de werkelijke regel afdwingen, niet de
 * onderspecificatie van het Zod-schema kopiëren.
 */
function validate_input(array $input): array
{
    $get = static function (array $input, string $key): string {
        $value = $input[$key] ?? null;
        if (!is_string($value)) {
            fail(400, 'Ongeldige aanvraag.', "veld '$key' ontbreekt of is geen string");
        }
        // Bytelengte (strlen), niet mb_strlen: dit is een misbruik-cap op
        // wat er maximaal binnenkomt, dus gebonden aan wat er werkelijk
        // aan geheugen/opslag gemoeid is. De min-lengte-checks hieronder
        // gebruiken wél mb_strlen, want die gaan over betekenisvolle
        // inhoud (aantal tekens), niet over een aanvalsoppervlak.
        if (strlen($value) > FIELD_MAX_LENGTHS[$key]) {
            fail(400, 'Ongeldige aanvraag.', "veld '$key' overschrijdt maximale lengte");
        }
        return $value;
    };

    $names = trim($get($input, 'names'));
    if (mb_strlen($names) < 2) {
        fail(400, 'Ongeldige aanvraag.', 'names te kort');
    }

    $email = trim($get($input, 'email'));
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        fail(400, 'Ongeldige aanvraag.', 'email ongeldig');
    }

    $phone = trim($get($input, 'phone'));

    $weddingDate = trim($get($input, 'weddingDate'));
    if ($weddingDate === '') {
        fail(400, 'Ongeldige aanvraag.', 'weddingDate leeg');
    }

    $weddingLocation = trim($get($input, 'weddingLocation'));
    if (mb_strlen($weddingLocation) < 2) {
        fail(400, 'Ongeldige aanvraag.', 'weddingLocation te kort');
    }

    $service = $get($input, 'service');
    if (!in_array($service, SERVICE_OPTIONS, true)) {
        fail(400, 'Ongeldige aanvraag.', 'service niet in whitelist');
    }

    $message = trim($get($input, 'message'));
    if (mb_strlen($message) < 20) {
        fail(400, 'Ongeldige aanvraag.', 'message te kort');
    }

    if (($input['privacy'] ?? null) !== true) {
        fail(400, 'Ongeldige aanvraag.', 'privacy niet geaccepteerd');
    }

    return [
        'names' => $names,
        'email' => $email,
        'phone' => $phone,
        'weddingDate' => $weddingDate,
        'weddingLocation' => $weddingLocation,
        'service' => $service,
        'message' => $message,
    ];
}

/**
 * Vereiste 5: geen enkele gebruikersinvoer in mail-headers. Zelfs na
 * strikte e-mailvalidatie (die CR/LF al onmogelijk maakt in een geldig
 * adres) wordt hier nog een keer expliciet gestript — de tweede,
 * onafhankelijke laag die is gevraagd, niet omdat de eerste laag
 * onvoldoende zou zijn.
 */
function sanitize_header_value(string $value): string
{
    return str_replace(["\r", "\n", "\0"], '', $value);
}

function build_email_html(array $p): string
{
    $esc = static fn(string $v): string => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');

    $rows = [
        'Namen' => $p['names'],
        'E-mail' => $p['email'],
        'Telefoon' => $p['phone'] !== '' ? $p['phone'] : '—',
        'Trouwdatum' => $p['weddingDate'],
        'Trouwlocatie' => $p['weddingLocation'],
        'Gewenste dienst' => $p['service'],
    ];

    $html = '<h2>Nieuwe aanvraag via behindeverywedding.nl</h2><table cellpadding="6">';
    foreach ($rows as $label => $value) {
        $html .= '<tr><td><strong>' . $esc($label) . '</strong></td><td>' . $esc($value) . '</td></tr>';
    }
    $html .= '</table><p><strong>Bericht</strong></p><p>' . nl2br($esc($p['message'])) . '</p>';

    return $html;
}

/**
 * Vereiste 9: verzending via de Resend API, key uit een configbestand
 * buiten de webroot. Het pad naar dat configbestand is hier een vaste,
 * nooit door gebruikersinvoer beïnvloede constante (PRIVATE_DIR is
 * hierboven hardcoded) — dit is dus geen dynamische include, ook al is
 * het pad technisch een runtime-samenstelling van twee vaste strings.
 */
function load_config(): array
{
    $path = PRIVATE_DIR . '/config.php';
    if (!is_file($path)) {
        throw new RuntimeException("configbestand ontbreekt: $path");
    }
    $config = require $path;
    if (
        !is_array($config)
        || !isset($config['resend_api_key'], $config['from_email'], $config['to_email'])
        || !is_string($config['resend_api_key'])
        || $config['resend_api_key'] === '' || $config['resend_api_key'] === 'CHANGE_ME'
    ) {
        throw new RuntimeException("configbestand heeft een ongeldige of niet-ingevulde vorm: $path");
    }
    return $config;
}

function send_via_resend(array $fields): void
{
    $config = load_config();

    $emailPayload = [
        'from' => $config['from_email'],
        'to' => [$config['to_email']],
        // Enige plek waar gebruikersinvoer in een header terechtkomt,
        // en dan alleen na strikte validatie (filter_var in
        // validate_input) én het strippen van nieuwe-regeltekens
        // hierboven. Bewust geen naam ervoor (dat zou weer
        // gebruikersinvoer in een header zijn) — alleen het kale adres.
        'reply_to' => sanitize_header_value($fields['email']),
        'subject' => 'Nieuwe aanvraag via behindeverywedding.nl',
        'html' => build_email_html($fields),
    ];

    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $config['resend_api_key'],
            'Content-Type: application/json',
        ],
        CURLOPT_POSTFIELDS => json_encode($emailPayload),
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);
    $response = curl_exec($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    // Geen curl_close($ch): sinds PHP 8.0 sluit de handle vanzelf zodra
    // $ch buiten bereik raakt (curl_close is sinds 8.5 een no-op en
    // geeft daar een deprecation-notice voor, die de eigen
    // error-handler hierboven anders alsnog als fout zou opvatten).

    if ($response === false || $statusCode < 200 || $statusCode >= 300) {
        throw new RuntimeException(
            "Resend-aanvraag mislukt (status $statusCode): " .
                ($curlError !== '' ? $curlError : (string)$response),
        );
    }
}

try {
    $ip = client_ip();

    // -------------------------------------------------------------
    // Goedkope, niet-schrijvende rate-limit-voorcontrole — vóór de
    // body-grootte-check, dus vóór er ook maar iets van de aanvraag
    // gelezen wordt. Zie is_rate_limited() voor waarom dit nodig is
    // naast de latere, wél-schrijvende check_and_record_rate_limit().
    // -------------------------------------------------------------
    if (is_rate_limited($ip)) {
        fail(
            429,
            'Te veel aanvragen. Probeer het later opnieuw.',
            'ip-hash al over de limiet (voorcontrole): ' . hash('sha256', $ip),
        );
    }

    // -------------------------------------------------------------
    // Vereiste 4 (deel 1): body-grootte, geweigerd vóór enige verdere
    // verwerking (parsen, valideren, rate limiting, versturen).
    // -------------------------------------------------------------
    $contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int)$_SERVER['CONTENT_LENGTH'] : null;
    if ($contentLength !== null && $contentLength > MAX_BODY_BYTES) {
        fail(413, 'Aanvraag te groot.', "Content-Length $contentLength boven limiet " . MAX_BODY_BYTES);
    }

    // Content-Length is een header die de client zelf opgeeft en kan
    // afwezig of onjuist zijn; het daadwerkelijke aantal gelezen bytes
    // wordt hieronder nogmaals hard begrensd, ongeacht wat de header
    // beweert.
    $rawBody = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
    if ($rawBody === false) {
        fail(400, 'Ongeldige aanvraag.', 'kon request body niet lezen');
    }
    if (strlen($rawBody) > MAX_BODY_BYTES) {
        fail(413, 'Aanvraag te groot.', 'werkelijke body-grootte boven limiet ' . MAX_BODY_BYTES);
    }

    $input = json_decode($rawBody, true);
    if (!is_array($input)) {
        fail(400, 'Ongeldige aanvraag.', 'body is geen geldig JSON-object');
    }

    // ---------------------------------------------------------------
    // Vereiste 7: honeypot, vóór de rate limiting. Stille 200, geen
    // verzending, geen signaal aan de bot dat er iets gedetecteerd is —
    // en ook geen rate-limit-slot verbruikt. Zou dit ná de rate limiting
    // staan, dan ziet een bot die telkens hetzelfde honeypot-veld invult
    // na vijf pogingen een 429 in plaats van de gebruikelijke stille 200,
    // en weet hij dus dat er iets wordt gedetecteerd.
    // ---------------------------------------------------------------
    $website = is_string($input['website'] ?? null) ? trim($input['website']) : '';
    if ($website !== '') {
        succeed();
    }

    check_and_record_rate_limit($ip);

    // ---------------------------------------------------------------
    // Vereiste 8: minimale invultijd van drie seconden.
    // ---------------------------------------------------------------
    $renderedAtRaw = $input['renderedAt'] ?? null;
    if (!is_string($renderedAtRaw) || !ctype_digit($renderedAtRaw)) {
        fail(400, 'Ongeldige aanvraag.', 'renderedAt is geen geldige timestamp');
    }
    $elapsedMs = (int)round(microtime(true) * 1000) - (int)$renderedAtRaw;
    if ($elapsedMs < MIN_FILL_TIME_MS) {
        fail(400, 'Ongeldige aanvraag.', "formulier te snel ingevuld ({$elapsedMs}ms)");
    }

    $fields = validate_input($input);
    send_via_resend($fields);
    succeed();
} catch (RateLimitExceededException $e) {
    fail(429, 'Te veel aanvragen. Probeer het later opnieuw.', $e->getMessage());
} catch (Throwable $e) {
    fail(500, 'Er is een fout opgetreden. Probeer het later opnieuw.', $e->getMessage());
}
