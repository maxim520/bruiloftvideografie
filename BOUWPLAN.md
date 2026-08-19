# Behind Every Wedding — Bouwplan

## Wat we bouwen

Een trouwfotografie-website voor Behind Every Wedding. Next.js (App
Router, TypeScript, Tailwind), statisch geëxporteerd en gehost op TransIP.
Content komt straks uit Sanity CMS; tot die fase toe draait de site op
tijdelijke, hardgecodeerde content zodat layout en componenten eerst kunnen
rijpen.

```
Sanity Studio (behindeverywedding.sanity.studio)
        │  redacteur bewerkt en publiceert
        │  webhook
        ▼
GitHub Actions
        │  npm run build  →  out/
        │  FTPS-upload
        ▼
TransIP webhosting
        │  statische HTML + CSS + JS
        ▼
Bezoeker
```

Beelden komen uit de Sanity CDN. Het contactformulier post naar één
PHP-bestand op TransIP (Next.js zelf heeft geen server nodig).

**Kernprincipe:** de redacteur kiest welke blokken op een pagina staan en wat
erin staat. Niet hoe ze eruitzien. Kleur, spacing en typografie zitten vast
in code. Dat voelt in gebruik als een builder, maar de site kan niet scheef
komen te staan.

## Visuele bron

`_reference/` bevat vier volledig uitgewerkte HTML-bestanden
(`home.html`, `over-mij.html`, `fotografie.html`, `contact.html`) met een
gedeeld stylesheet (`_reference/assets/style.css`). Dit is de visuele
waarheid: kleuren, spacing, typografie en responsive gedrag worden
hieruit overgenomen, niet opnieuw bedacht. Er zijn geen aparte
mockup-afbeeldingen — de HTML-bestanden zelf zijn de volledige specificatie
en kunnen direct in de browser geopend worden.

Designtokens (uit `_reference/assets/style.css`, onder `:root`):

| Token | Waarde | Gebruik |
|---|---|---|
| `--background` | `#1b1410` | paginafond |
| `--surface` | `#241a15` | kaarten, hover-vlakken |
| `--surface-light` | `#2f231c` | lichtere vlakken op surface |
| `--brown-dark` | `#3a2b21` | donkere accenten, gradients |
| `--brown` | `#5c4433` | gradients, borders |
| `--brown-medium` | `#8a6a52` | gradients, secundaire tekst op donker |
| `--copper` | `#c17a4e` | primaire accentkleur, links, knoppen |
| `--copper-hover` | `#d68f5f` | hoverstatus van copper |
| `--text` | `#f3ece4` | primaire tekst |
| `--text-muted` | `#b8a999` | secundaire tekst |
| `--border` | `rgba(243,236,228,0.12)` | dunne lijnen, scheidingen |

Fonts: **Cormorant Garamond** (500/600, incl. italic) als display-font voor
koppen, **Manrope** (400/500/600) als body-font. Geladen via
`next/font/google` met `display: swap`.

Foto's in de referentie zijn duotone gradient-placeholders (er is nog geen
echt fotomateriaal) — de layout, aspect ratios en grid-opbouw zijn wel
definitief.

## Werkafspraken

- Nooit meer dan één fase tegelijk uitvoeren
- Nooit bestanden aanmaken die niet gevraagd zijn
- Nooit content hardcoden in componenten, alles via props
- Geen externe UI-bibliotheken
- Server components als standaard, client components alleen bij interactie
- Geen `any` in TypeScript
- Na elke ronde: `npm run dev` draaien en controleren, dan pas committen

## Fasen

### Fase 0 — Project opzetten
Next.js-project scaffolden (App Router, TypeScript, Tailwind, ESLint),
`_reference/` en dit bouwplan behouden.

### Fase 1 — Fundament
Designtokens en fonts overnemen uit `_reference/assets/style.css`:
`app/globals.css` (CSS-variabelen, reset, focus-visible),
`app/layout.tsx` (fonts via `next/font/google`), `tailwind.config.ts`
(kleuren en fontfamilies onder `theme.extend`).

### Fase 2 — Layoutcomponenten
Herbruikbare, contentloze componenten op basis van de vier referentiepagina's:
`Header` (met mobiel menu), `Footer`, `Button`, `Eyebrow`, `PhotoPlaceholder`,
`Section`. Alles puur presentationeel, content via props.

### Fase 3 — Pagina's met tijdelijke content
De vier pagina's (`/`, `/over-mij`, `/fotografie`, `/contact`) opbouwen uit de
componenten uit Fase 2, met tijdelijke (hardgecodeerde) content die exact
overeenkomt met `_reference/`. Doel: de site is visueel compleet en klikbaar
vóór er CMS-koppeling bijkomt.

### Fase 4 — Sanity Studio en schema's
Sanity-project opzetten, schema's voor pagina's en herbruikbare content-
blokken (hero, statement, tekst-met-foto, diensten, galerij, testimonial,
cta-band, FAQ) zodat een redacteur blokken kan kiezen en vullen — niet
vormgeven.

### Fase 5 — Content koppelen
Pagina's laten renderen vanuit Sanity-data in plaats van hardgecodeerde
content. Blok-naar-component mapping. Afbeeldingen via Sanity CDN met
`next/image` of een statische equivalent.

### Fase 6 — Contactformulier
Formulier in `/contact` koppelen aan een PHP-eindpunt op TransIP (los van de
Next.js-build), met clientside validatie en verzendbevestiging.

### Fase 7 — Deployment
GitHub Actions-workflow: bij webhook vanuit Sanity of push op `main` een
`next build` met statische export draaien en het resultaat via FTPS naar
TransIP uploaden.

### Fase 8 — Pre-launch controle
Performance (Lighthouse), toegankelijkheid (focus-states, contrast,
alt-teksten), responsive gedrag op alle vier pagina's, 404-pagina, favicon
en metadata, formulier end-to-end getest op de live hosting.

## Als iets misgaat

Sla nooit een controle over — een fout uit een vroege fase kost verderop een
veelvoud aan tijd om te vinden. Ga bij twijfel terug naar de laatste
werkende commit in plaats van door te bouwen op een fase die niet klopte.
