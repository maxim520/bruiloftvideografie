import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Ontbrekende Sanity-omgevingsvariabelen: NEXT_PUBLIC_SANITY_PROJECT_ID en " +
      "NEXT_PUBLIC_SANITY_DATASET zijn verplicht. Zie .env.local.example."
  );
}

/**
 * Alleen publieke, gepubliceerde content: geen token en
 * `perspective: "published"`. Concepten (drafts) zijn zo nooit bereikbaar
 * vanuit de statisch geëxporteerde site.
 *
 * `useCdn: false` is met opzet, en geen achteloze default: elke aanroep
 * hiervandaan gebeurt uitsluitend tijdens `next build` (statische export,
 * geen SSR/live traffic), dus de CDN's latency-voordeel geldt hier nooit —
 * er is geen bezoeker die op dit antwoord wacht. Wél geldt de CDN's bekende
 * propagatievertraging (tot circa 60s na een mutatie). Concreet en
 * reproduceerbaar gevonden tijdens de Fase 8-launch-QA: een `isVisible`-
 * toggle vlak vóór `npm run build` werd door app/sitemap.ts (deze client,
 * met useCdn: true) nog niet gezien — de net-verborgen pagina bleef in
 * sitemap.xml staan — terwijl scripts/remove-hidden-pages.mjs (dat een
 * eigen, altijd-verse `getCliClient()` gebruikt, geen CDN) de wijziging al
 * wél zag en de pagina fysiek uit out/ verwijderde. Twee databronnen met
 * verschillende versheid binnen dezelfde build kan sitemap/pagina-inhoud
 * laten uiteenlopen; useCdn: false maakt elke build-time aanroep hier weer
 * consistent vers, ongeacht hoe snel na een Studio-wijziging de build start.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
});
