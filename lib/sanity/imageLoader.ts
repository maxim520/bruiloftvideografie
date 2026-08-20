import type { ImageLoader } from "next/image";
import { getHeroManifest } from "./heroManifest";

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
 *
 * getHeroManifest() geeft server- én client-side dezelfde data terug
 * (zie lib/sanity/heroManifest.ts) — cruciaal, want next/image roept deze
 * loader ook client-side aan tijdens hydratie. Verschillende antwoorden
 * per kant gaven eerder een hydration mismatch én een overbodige tweede
 * fetch naar cdn.sanity.io vlak na het laden van de pagina, wat de hero-
 * cache-fix (scripts/fetch-hero-images.mjs) grotendeels ongedaan maakte.
 */
const sanityImageLoader: ImageLoader = ({ src, width }) => {
  if (!/^https?:\/\//.test(src)) {
    return src;
  }

  const heroManifest = getHeroManifest();
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
