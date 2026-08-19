import type { ImageLoader } from "next/image";

/**
 * Entrypoint voor next.config.ts's `images.loaderFile`: Next vereist dat
 * dat bestand de loader als default export levert.
 *
 * De functie staat hier zelf in, bewust NIET (meer) ge-re-exporteerd
 * vanuit lib/sanity/image.ts: dit bestand wordt door next/image ook
 * client-side gebundeld (voor responsief herberekenen in de browser),
 * dus alles wat het importeert gaat mee naar de client. image.ts's
 * `urlFor()` importeert de Sanity-client (via ./client, uiteindelijk
 * @sanity/client + @sanity/image-url) — die had dus, puur via deze
 * re-export, ~100KB aan client-only-bedoelde code in de browserbundel
 * staan terwijl geen van beide ooit client-side wordt aangeroepen.
 * Gevonden via de bundle-analyse; deze functie zelf heeft geen van
 * beide nodig (alleen string/URL-bewerking), dus verplaatsen volstaat.
 *
 * Formaat en kwaliteit liggen al vast in de basis-URL die SafeImage via
 * urlFor() opbouwt (auto('format'), kwaliteit 78) — deze loader hoeft
 * alleen de breedte-parameter per srcset-kandidaat te zetten.
 *
 * Lokale paden (de tijdelijke url-vorm uit lib/mock-data.ts) zijn geen
 * geldige Sanity-URL en worden ongewijzigd teruggegeven — zonder
 * breedte-optimalisatie, want zodra een custom loader actief is,
 * verzorgt Next zelf geen optimalisatie meer voor wat de loader
 * teruggeeft. Dat pad is nu al niet meer bereikbaar vanuit de pagina's.
 */

/**
 * Alleen server-side (build-time): geeft, wanneer beschikbaar, het lokale
 * pad terug uit de door scripts/fetch-hero-images.mjs gevulde cache i.p.v.
 * de cdn.sanity.io-URL — zie dat script voor de volledige toelichting
 * (LCP-fix: geen nieuwe verbinding meer nodig voor de hero-foto).
 *
 * `typeof window === "undefined"` sluit de browser uit: next/image
 * bundelt deze loader ook client-side (voor responsief herberekenen bij
 * bv. een resize), en `fs` bestaat daar niet. In de browser valt dit dus
 * altijd terug op de normale cdn.sanity.io-URL hieronder — geen
 * functieverlies, alleen de allereerste, in de HTML gebakken versie van
 * de hero-foto komt lokaal vandaan, en dát is precies de LCP-request die
 * telt.
 *
 * Het manifest wordt één keer per build-proces gelezen (module-scope,
 * niet per aanroep) en ontbreekt onschadelijk tijdens `next dev` (daar
 * draait geen "prebuild"-stap) — dan is deze functie gewoon altijd `undefined`.
 */
function loadManifestOnce(): Record<string, Record<string, string>> | null {
  if (typeof window !== "undefined") return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- alleen server-side, module-scope, één keer per build
    const fs = require("node:fs") as typeof import("node:fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("node:path") as typeof import("node:path");
    const manifestPath = path.join(process.cwd(), "public/_hero-cache/manifest.json");
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  } catch {
    return null; // geen prebuild gedraaid (bv. `next dev`) — geen probleem, gewoon cdn.sanity.io gebruiken
  }
}

const heroManifest = loadManifestOnce();

const sanityImageLoader: ImageLoader = ({ src, width }) => {
  if (!/^https?:\/\//.test(src)) {
    return src;
  }

  if (heroManifest) {
    // cdn.sanity.io/images/<project>/<dataset>/<hash>-<dims>.<ext>?... —
    // hetzelfde "<hash>-<dims>"-padsegment dat het cache-script als
    // manifest-sleutel gebruikt.
    const match = src.match(/\/([a-f0-9]+-\d+x\d+)\.\w+(?:\?|$)/);
    const assetKey = match?.[1];
    const cached = assetKey ? heroManifest[assetKey]?.[String(width)] : undefined;
    if (cached) {
      return `/_hero-cache/${cached}`;
    }
  }

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  return url.toString();
};

export default sanityImageLoader;
