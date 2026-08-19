# Deployment

Dit document bevat alle stappen die **niet** door de GitHub Actions-workflow
(`.github/workflows/deploy.yml`) zelf gedaan worden — dingen die je één keer
(of periodiek) zelf moet instellen, op GitHub, in Sanity en bij TransIP. Zie
`BOUWPLAN.md` voor het grotere plaatje (het schema met Sanity → GitHub
Actions → TransIP).

Doorloop de stappen in deze volgorde: een latere stap gaat er soms van uit
dat een eerdere al staat (de webhook heeft bijvoorbeeld het GitHub-token uit
stap 1 nodig).

## 1. GitHub — Secrets en Variables

Settings → Secrets and variables → Actions, op de repository. Twee
tabbladen: **Secrets** (nooit zichtbaar na opslaan, ook niet voor jezelf —
gebruik voor wachtwoorden/tokens) en **Variables** (gewoon leesbaar, gebruik
voor niet-geheime configuratie).

### Secrets

| Naam | Waarde |
|---|---|
| `DEPLOY_HOST` | Hostnaam van de FTPS/SFTP-server (TransIP-controlepaneel → Hosting → jouw pakket → FTP-toegang) |
| `DEPLOY_USERNAME` | FTP/SFTP-gebruikersnaam |
| `DEPLOY_PASSWORD` | FTP/SFTP-wachtwoord. Vermijd een komma hierin — die botst met hoe de workflow gebruikersnaam en wachtwoord aan elkaar plakt |
| `DEPLOY_SFTP_HOST_KEY` | **Alleen invullen als je `DEPLOY_PROTOCOL=sftp` gebruikt** (zie hieronder). Output van `ssh-keyscan -t ed25519,rsa <DEPLOY_HOST>`, gedraaid vanaf je eigen machine. Zonder dit weigert de workflow de host-key en faalt de deploy — met opzet, want zonder host-key-verificatie zou de upload onopgemerkt naar een andere server omgeleid kunnen worden |
| `SANITY_AUTH_TOKEN` | Nodig voor de wekelijkse back-up (`.github/workflows/backup.yml`), zie stap 6. **Viewer**-rechten zijn genoeg — dit token doet alleen lezen, nooit schrijven |

### Variables

| Naam | Waarde | Verplicht? |
|---|---|---|
| `SANITY_PROJECT_ID` | `5o909qb6` | Ja — zonder deze twee faalt `next build` hard (zie `lib/sanity/client.ts`) |
| `SANITY_DATASET` | `production` | Ja |
| `DEPLOY_PROTOCOL` | `ftps` of `sftp` | Nee, valt terug op `ftps`. TransIP-webhosting (het gedeelde pakket, geen VPS) biedt doorgaans alleen FTP/FTPS aan — controleer bij stap 5 of jouw pakket daadwerkelijk SFTP ondersteunt voor je dit op `sftp` zet |
| `DEPLOY_PORT` | bv. `21` (ftps) of `22` (sftp) | Nee, lftp gebruikt anders het protocol-standaardpoort |
| `DEPLOY_REMOTE_DIR` | bv. `public_html` | Nee, valt terug op `.` (de map waar de FTP-login je al in zet). Sommige TransIP-accounts loggen al direct in `public_html/` in, andere in de accountroot ervoor — test dit één keer handmatig met een FTP-cliënt voordat je de workflow draait |

### Fine-grained token voor de Sanity-webhook

Nodig in stap 4, maar maak 'm hier alvast aan zodat je 'm niet kwijtraakt
(GitHub toont een token maar één keer):

1. https://github.com/settings/personal-access-tokens/new
2. **Resource owner**: je eigen account. **Repository access**: "Only select
   repositories" → alleen deze repo.
3. **Permissions** → **Repository permissions** → **Contents**: **Read and
   write**. Niets anders aanvinken — dit is de minimale scope waarmee de
   GitHub API een `repository_dispatch`-event accepteert.
4. Expiration: kies een redelijke termijn (bv. 1 jaar) en zet in je agenda
   dat 'm dan te vervangen — een verlopen token laat de webhook stilletjes
   falen (Sanity toont dan een 401 in de webhook-log, de site bouwt niet meer
   opnieuw na publiceren, zonder dat iemand het meteen merkt).
5. Genereer, kopieer de token-waarde meteen (begint met `github_pat_`). Deze
   plak je zo in Sanity's webhook-configuratie (stap 4) — hij hoeft nergens
   in GitHub zelf als secret opgeslagen te worden, want Sanity is degene die
   'm gebruikt om GitHub aan te roepen, niet andersom.

## 2. Cronjob voor het opruimen van rate-limit-bestanden

`contact.php` schrijft één bestand per bezoekers-IP in
`server-private/rate-limits/`. Die bestanden ruimen zichzelf niet op —
daarvoor is `server-private/cleanup-rate-limits.php`, bedoeld om periodiek
via cron te draaien (nooit via HTTP; het script weigert dat zelf ook als het
per ongeluk webbereikbaar zou zijn).

Stel in het TransIP-controlepaneel (Cronjobs) in, één keer per dag is ruim
voldoende:

```
0 4 * * * php /pad/naar/server-private/cleanup-rate-limits.php >> /pad/naar/server-private/cleanup.log 2>&1
```

Vervang `/pad/naar/` door het daadwerkelijke absolute pad van
`server-private/` op de TransIP-server (te vinden via FTP of het
bestandsbeheer in het controlepaneel). Zonder deze cronjob blijft de map
groeien met één klein bestand per uniek bezoekers-IP — geen acuut probleem,
maar wel iets om niet te vergeten in te stellen.

## 3. Contactformulier (`server-private/config.php`)

### `server-private/` naast de webroot aanmaken

`contact.php` verwacht een map **naast** `public_html/` (dus niet erin,
nooit via HTTP bereikbaar, en dus ook nooit door de deploy-workflow
aangeraakt — die schrijft alleen binnen `DEPLOY_REMOTE_DIR`/`public_html/`)
— zie de toelichting bovenaan dat bestand voor de exacte verwachte structuur
en hoe je `PRIVATE_DIR` aanpast als je account anders is ingedeeld.

Kopieer `server-private/config.example.php` naar `server-private/config.php`
op de server en vul in:
- `resend_api_key` — aanmaken op [resend.com/api-keys](https://resend.com/api-keys)
- `from_email` — moet een op Resend geverifieerd verzenddomein zijn
- `to_email` — de inbox waar aanvragen naartoe gaan

Commit `config.php` nooit naar git (staat al in `.gitignore`).

## 4. Sanity-webhook (publicatie → herbouw)

Zonder dit stukje bouwt de site alleen opnieuw bij een `git push` naar
`main` — een redacteur die in de Studio publiceert, verandert geen regel
code, dus zonder deze webhook zou de live site nooit de nieuwe content laten
zien totdat er toevallig ook een keer code wordt gepusht.

Instellen op [manage.sanity.io](https://manage.sanity.io) → project
`5o909qb6` → **API** → **Webhooks** → **Create webhook**:

| Veld | Waarde |
|---|---|
| Name | bv. `GitHub deploy trigger` |
| URL | `https://api.github.com/repos/<GEBRUIKERSNAAM>/<REPO>/dispatches` — vul `<GEBRUIKERSNAAM>/<REPO>` in zodra de code op GitHub staat |
| Dataset | `production` |
| Trigger on | **Create**, **Update**, **Delete** — alle drie aan. Het onderscheid tussen "concept" en "publicatie" loopt via de Filter hieronder, niet via deze vinkjes |
| Filter (GROQ) | `!(_id in path("drafts.**"))` |
| HTTP method | `POST` (vast, niet aanpasbaar in Sanity's UI) |
| API version | laat op de nieuwste/standaardwaarde staan |
| Headers | zie hieronder |
| Projection | zie hieronder |
| Secret | leeglaten — dat veld ondertekent uitgaande Sanity-payloads voor wanneer *jouw eigen* endpoint de afzender wil verifiëren; hier is GitHub's dispatches-API de ontvanger, en die verifieert via de Authorization-header, niet via een HMAC-signature |

**Headers** (drie losse key/value-paren in Sanity's webhook-formulier):

```
Accept: application/vnd.github+json
Authorization: Bearer <de github_pat_... uit stap 1>
X-GitHub-Api-Version: 2022-11-28
```

**Projection** — dit wordt letterlijk de JSON-body die Sanity verstuurt, dus
moet exact overeenkomen met wat `.github/workflows/deploy.yml`'s
`repository_dispatch: types: [sanity-publish]` verwacht:

```groq
{"event_type": "sanity-publish"}
```

### Waarom deze filter en niet minder

Een "Publiceren"-klik in de Studio is intern een mutatie op het gepubliceerde
document (`_id` zónder `drafts.`-prefix), ook al bewerkte de redacteur tot
dat moment de `drafts.`-versie. Tussentijds opslaan van een concept
(autosave, elke paar seconden tijdens het typen) muteert alléén het
`drafts.`-document. De filter `!(_id in path("drafts.**"))` laat dus precies
door wat een echte publicatie is, en onderdrukt elke tussentijdse
conceptwijziging — zonder deze filter zou de site bij elke toetsaanslag in
de Studio een nieuwe build proberen te starten.

### Testen

Sanity's webhook-scherm heeft een "Attempts"-log met de laatste aanroepen en
hun statuscode. Publiceer een test-wijziging en controleer daar een `204`
(GitHub's antwoord op een geslaagde dispatch) — en controleer in GitHub
Actions of de workflow daadwerkelijk gestart is.

## 5. Domein bij TransIP

- **FTP/SFTP-toegang**: controleer bij het hostingpakket (niet bij het
  domein) het veld **SFTP/SSH** — bij dit account bleek SFTP gewoon
  beschikbaar op gedeelde webhosting (met "subsites"), dus ga er niet
  vanuit dat dit alleen op VPS-pakketten kan. De hostnaam heeft de vorm
  `<iets>.ssh.transip.me`. Zet `DEPLOY_PROTOCOL` (stap 1) overeenkomstig —
  nooit op plain `ftp`.
- **Bij meerdere sites op één hostingpakket ("subsites")**: TransIP kan één
  hostingpakket met meerdere domeinen laten delen, elk in een eigen map
  (bijv. via "Website toevoegen" in het paneel). Het paneel toont daarbij
  een **"Website pad"** (bijv. `/subsites/behindeverywedding.nl`) — dat pad
  is *absoluut vanaf de accountroot*, niet vanaf waar een SFTP-login je
  neerzet. Gebruik dat pad daarom **nooit letterlijk met een schuine streep
  vooraan** in `DEPLOY_REMOTE_DIR`; dat laat lftp zoeken vanaf de
  werkelijke bestandssysteem-root van de server, waar die map niet bestaat
  (foutmelding: "No such file"). Bepaal het juiste, relatieve pad zo:

  ```
  sftp jouw-sftp-gebruikersnaam@jouw-ssh-hostnaam
  pwd
  ls
  cd subsites/behindeverywedding.nl   # of het path dat bij jou past
  pwd
  ```

  Het pad ná `cd` (zonder het deel dat bij de startmap hoort) is de
  waarde voor `DEPLOY_REMOTE_DIR` — meestal gewoon zonder schuine streep
  vooraan, bijv. `subsites/behindeverywedding.nl`.

  Gebruik hiervoor de ingebouwde `sftp`-opdracht in Terminal — Finders
  "Verbind met server" (Cmd+K) ondersteunt geen `sftp://`, alleen gewone
  `ftp://`, en geeft daar een onduidelijke foutmelding op.
- **DNS**: `behindeverywedding.nl` (zie `lib/site.ts`) moet naar deze hosting wijzen.
  Als het domein al bij TransIP geregistreerd staat en de hosting er ook
  draait, regelt TransIP dit meestal automatisch bij het koppelen van domein
  aan hostingpakket in het controlepaneel; staat het domein elders
  geregistreerd, zet dan een A-record (en AAAA indien TransIP IPv6 aanbiedt)
  naar het IP-adres van je hostingpakket, te vinden in het controlepaneel.
- **TLS/HTTPS**: activeer een (gratis Let's Encrypt-)certificaat voor
  `behindeverywedding.nl` in het TransIP-controlepaneel, vóór de eerste
  deploy. Bij een subsite staat dit onder het eigen beheerscherm van die
  subsite ("SSL Overzicht"/"SSL-instellingen"), niet bij het hoofddomein.
- **Eerste handmatige controle**: verbind met `sftp` (zie hierboven) vóórdat
  je de workflow voor het eerst laat draaien, en bevestig dat de doelmap
  leeg is of alleen bestanden bevat die bij een eerdere `out/`-build horen:
  de opruimstap (fase 3 in `deploy.yml`) verwijdert alles in die map dat
  niet in de nieuwe build zit.

### Bekend gat: security-headers werken niet op nginx-hosting

`public/.htaccess` zet naast de HTTPS-redirect ook een aantal
beveiligingsheaders (HSTS, X-Frame-Options, X-Content-Type-Options,
Content-Security-Policy) en cache-headers. **`.htaccess` is Apache-specifiek
— als jouw TransIP-hosting nginx draait (te zien aan de `server:
nginx`-responseheader), wordt dit bestand genegeerd.** De HTTPS-redirect en
dotfile-blokkade bleken bij dit account toch te werken (geregeld op
TransIP-platformniveau, los van `.htaccess`), maar de overige headers en
de cache-regels niet.

`Referrer-Policy` is inmiddels via een `<meta>`-tag opgelost
(`app/layout.tsx`'s `referrer`-veld) — dat is de enige van de geplande
headers met een volwaardige HTML-vervanging. HSTS/X-Frame-Options/
X-Content-Type-Options bestaan niet als `<meta>`-variant, en CSP via
`<meta>` ondersteunt geen Report-Only-modus (dus niet zomaar af te dwingen
zonder ooit getest te zijn — dat risico is bewust niet genomen).

**Openstaande actie**: vraag TransIP-support of aangepaste HTTP-response-
headers mogelijk zijn op deze (nginx-)hosting, en zo ja, hoe. Zodra dat
duidelijk is, kunnen de resterende headers alsnog worden ingesteld.

## 6. Back-up en monitoring

Code staat in git, beeldmateriaal (in elk geval het seed-materiaal) in
`_seed-images/`. Maar teksten, structuur en verwijzingen die een redacteur
in de Studio aanpast, bestaan maar op één plek: in Sanity. Dit is dus het
enige stuk dat écht weg kan zijn als er iets misgaat — niet de code, niet de
site zelf.

### Back-up: hoe het werkt

`.github/workflows/backup.yml` draait wekelijks (zondag 03:00 UTC, en
handmatig via de "Run workflow"-knop in de Actions-tab) `sanity dataset
export production` en zet het resultaat (een `.tar.gz`) als artifact klaar
onder Actions → de workflow-run → Artifacts. GitHub bewaart artifacts
maximaal 90 dagen — bij wekelijkse export dus altijd de laatste ~12 weken
beschikbaar. Wil je verder terug kunnen dan 90 dagen, download dan af en toe
(bv. eens per kwartaal) handmatig een export en bewaar 'm ergens anders
(eigen schijf, cloudopslag) — de workflow doet dat niet automatisch.

Vereist: de `SANITY_AUTH_TOKEN`-secret (zie stap 1). Aanmaken op
[manage.sanity.io](https://manage.sanity.io) → project `5o909qb6` → **API**
→ **Tokens** → **Add API token**:
- Naam: bv. `GitHub Actions — backup (viewer)`
- Permissions: **Viewer** — dit token exporteert alleen, het hoeft nooit te
  schrijven. Gebruik hier bewust niet hetzelfde token als
  `SANITY_SEED_TOKEN` (dat heeft schrijfrechten voor het seed-script, meer
  dan een back-up nodig heeft)

De export bevat naast documenten ook een kopie van elk beeld dat via Sanity
geüpload is — inclusief namen van bruidsparen, hun foto's en eventuele
contactgegevens in de content. Behandel de artifacts dus als
persoonsgegevens: houd deze repository privé, en deel het artifact niet
zomaar met derden.

### Back-up terugzetten

1. Download het artifact (Actions → de gewenste run → Artifacts) en pak
   eventueel uit met `unzip` (GitHub verpakt artifacts altijd in een extra
   `.zip`-laag om de `.tar.gz` heen) — je houdt dan
   `sanity-backup-production-JJJJ-MM-DD.tar.gz` over.
2. Maak een token met **Editor**- of **Administrator**-rechten (niet het
   Viewer-back-uptoken hierboven — importeren is schrijven) via
   manage.sanity.io → **API** → **Tokens**.
3. **Eerst veilig bekijken, zonder productie aan te raken** (aanbevolen als
   je twijfelt of dit wel de juiste export is): importeer in een nieuw,
   tijdelijk dataset en bekijk het daar via de Studio (dataset wisselen kan
   linksonder in de Studio-UI):

   ```
   cd studio
   npx sanity dataset create restore-preview
   npx sanity dataset import ./sanity-backup-production-JJJJ-MM-DD.tar.gz restore-preview -t <editor-token>
   ```

4. **Direct terugzetten naar productie** (pas nadat je zeker weet dat dit de
   juiste versie is — dit overschrijft bestaande documenten met hetzelfde
   ID, onomkeerbaar op wat een nieuwe export daarvóór vastlegt):

   ```
   cd studio
   npx sanity dataset import ./sanity-backup-production-JJJJ-MM-DD.tar.gz production --replace -t <editor-token>
   ```

   Overweeg vlak vóórdat je dit draait handmatig een verse export te maken
   (dezelfde `sanity dataset export production`-opdracht als in
   `backup.yml`) — mocht de terugzetting zelf ongedaan gemaakt moeten
   worden, dan heb je ook daarvan een moment-opname.
5. De live site zelf loopt pas achter tot de eerstvolgende build: een
   `git push` naar `main`, of wacht op de eerstvolgende publicatie/webhook.
   Wil je de teruggezette content meteen zichtbaar, trigger dan handmatig de
   deploy-workflow (Actions → Deploy → "Run workflow").

### Gratis uptime-monitor

Twee monitors bij [UptimeRobot](https://uptimerobot.com) (gratis laag: 50
monitors, controle-interval 5 minuten):

| | Homepage | Contactformulier |
|---|---|---|
| Monitor type | HTTP(s) | HTTP(s) |
| URL | `https://behindeverywedding.nl/` | `https://behindeverywedding.nl/api/contact.php` |
| Interval | 5 minuten | 5 minuten |
| Verwachte statuscode | 200 | **405** |
| Methode | GET (standaard) | GET (standaard) |

Waarom 405 voor het contactformulier: `contact.php` accepteert uitsluitend
`POST` en wijst elke andere methode hard af met 405 (`public/api/contact.php`,
"Vereiste 1: alleen POST") — dat gebeurt vóórdat er iets anders gebeurt (geen
rate-limiting, geen e-mail, geen logica geraakt), dus een gewone GET-check
is veilig om elke 5 minuten te draaien. Een 405 op deze URL betekent dus
juist dat het endpoint léét — een 500, een timeout, of een 403 (bijvoorbeeld
als `.htaccess` per ongeluk ook dit ene toegestane PHP-bestand blokkeert)
betekent dat er iets mis is. Zet de monitor dus expliciet op "alert bij
elke afwijking van 405", niet op "alert bij alles behalve 200".

Kanttekening: elke controle laat een regel als "methode was GET" achter in
`server-private/contact-error.log` (zie stap 2/3) — bij 5 minuten interval
zo'n 288 regels per dag, onschuldig maar wel iets om te weten als dat
logbestand ooit ongewoon snel groeit.

Stel bij beide monitors een alertmethode in (e-mail is standaard, gratis)
naar het adres dat je ook voor `to_email` (stap 3) gebruikt.

### Wat gebeurt er als Sanity uitvalt

De site zelf is een statische export — eenmaal gebouwd en naar TransIP
geüpload, heeft geen enkele bezoeker-pagina op het moment van laden nog een
lopende verbinding met Sanity nodig (geen client-side fetches, zie de
"use client"-audit uit de performance-ronde). Dat bepaalt precies waar de
grens ligt:

**Blijft gewoon werken tijdens een Sanity-storing:**
- De volledige, al gepubliceerde site: alle tekst, layout, structuur.
- Het contactformulier — draait volledig los op TransIP + Resend, heeft nooit
  enige Sanity-afhankelijkheid gehad.

**Werkt niet, of mogelijk niet, tijdens de storing:**
- Inloggen en bewerken in de Studio.
- Nieuwe publicaties worden niet zichtbaar: de build die een publicatie
  normaal triggert (via de webhook) faalt gewoon hard, omdat `next build`
  de sitecontent bij Sanity ophaalt (`getSiteSettings()` in
  `app/layout.tsx`). Omdat de deploy-workflow alleen uploadt ná een
  geslaagde build (zie `deploy.yml`), gebeurt er in dat geval helemaal
  niets — de al-live site blijft ongewijzigd staan. Geen halve of kapotte
  deploy, wel geen update totdat Sanity weer bereikbaar is.
- Als specifiek Sanity's CDN (beeldlevering, `cdn.sanity.io`) geraakt is —
  dat is technisch een ander onderdeel dan de Content Lake-API die
  `next build` gebruikt — kunnen afbeeldingen op de al-live site tijdelijk
  niet laden (bezoekers zien een kapot-plaatje-icoon in plaats van de foto).
  Dat herstelt vanzelf zodra de CDN weer bereikbaar is: dezelfde URL's in de
  al gepubliceerde HTML blijven gewoon staan, er is geen nieuwe deploy voor
  nodig.

Kortom: een Sanity-storing bevriest de redactie en (in het ergste geval)
het beeldmateriaal, maar breekt nooit de live site zelf.
