<?php

/**
 * Ruimt oude rate-limit-bestanden op (server-private/rate-limits/*.json,
 * één bestand per sha256-hash van een bezoekers-IP — zie de toelichting
 * bij rate_limit_file_path() in public/api/contact.php).
 *
 * Bedoeld om via een cronjob te draaien, NIET via HTTP: dit bestand
 * staat expres buiten public_html/, dus is sowieso niet webbereikbaar,
 * en de check hieronder weigert bovendien alles wat niet via de
 * command line komt. Voorbeeld-cronregel (eenmaal per dag, 04:00):
 *
 *   0 4 * * * php /pad/naar/server-private/cleanup-rate-limits.php >> /pad/naar/server-private/cleanup.log 2>&1
 *
 * Een bestand dat langer dan het rate-limit-venster niet is aangeraakt
 * kan alleen nog verlopen timestamps bevatten — elke nieuwe aanvraag van
 * dat IP herschrijft (en "touched") het bestand immers. Zulke bestanden
 * worden dus verwijderd zonder de inhoud te hoeven lezen.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit;
}

const RATE_LIMIT_DIR = __DIR__ . '/rate-limits';
const RATE_LIMIT_WINDOW_SECONDS = 3600;

if (!is_dir(RATE_LIMIT_DIR)) {
    echo "Geen rate-limits-map gevonden op " . RATE_LIMIT_DIR . ", niets te doen.\n";
    exit(0);
}

$cutoff = time() - RATE_LIMIT_WINDOW_SECONDS;
$checked = 0;
$removed = 0;

$entries = scandir(RATE_LIMIT_DIR);
if ($entries === false) {
    fwrite(STDERR, "Kan " . RATE_LIMIT_DIR . " niet lezen.\n");
    exit(1);
}

foreach ($entries as $entry) {
    if ($entry === '.' || $entry === '..') {
        continue;
    }

    $path = RATE_LIMIT_DIR . '/' . $entry;
    if (!is_file($path)) {
        continue;
    }

    $checked++;
    $mtime = filemtime($path);
    if ($mtime !== false && $mtime < $cutoff) {
        unlink($path);
        $removed++;
    }
}

echo "Gecontroleerd: $checked bestand(en), verwijderd: $removed verlopen bestand(en).\n";
