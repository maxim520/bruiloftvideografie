<?php

/**
 * Sjabloon voor het echte configbestand van public/api/contact.php.
 *
 * Dit bestand hoort NOOIT binnen public/ (dus nooit in out/, dus nooit
 * op de webroot van de server) te staan — het bevat straks een geheime
 * API-key. Kopieer dit bestand op de server naar de map die
 * contact.php's PRIVATE_DIR-constante verwacht (zie de toelichting
 * bovenaan contact.php), hernoem het naar config.php, en vul de echte
 * waarden in. Commit config.php zelf nooit naar git.
 *
 * Verwachte serverstructuur (pas PRIVATE_DIR in contact.php aan als jouw
 * TransIP-hosting hiervan afwijkt — zie DEPLOY.md §5 voor hoe je dat per
 * account controleert):
 *
 *   <account-root>/
 *     subsites/
 *       behindeverywedding.nl/  <- webroot van deze site; hier komt out/
 *         api/
 *           contact.php
 *     server-private/         <- naast subsites/, dus nooit via HTTP bereikbaar
 *       config.php            <- dit bestand, ingevuld
 *       contact-error.log     <- wordt aangemaakt door contact.php
 *       rate-limit.json       <- wordt aangemaakt door contact.php
 */

return [
    // Resend API-key. Aanmaken op https://resend.com/api-keys.
    'resend_api_key' => 'CHANGE_ME',

    // Vast, eigen domein-adres waar aanvragen vandaan lijken te komen.
    // Moet een op Resend geverifieerd verzenddomein zijn — pas dit domein
    // aan naar wat je daadwerkelijk in Resend verifieert, dat hoeft niet
    // per se behindeverystory.nl te zijn (kan ook behindeverywedding.nl).
    'from_email' => 'Behind Every Wedding <aanvragen@behindeverystory.nl>',

    // Waar de aanvraag naartoe gestuurd wordt — de eigen inbox.
    'to_email' => 'info@behindeverystory.nl',
];
