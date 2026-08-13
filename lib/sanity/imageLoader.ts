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
const sanityImageLoader: ImageLoader = ({ src, width }) => {
  if (!/^https?:\/\//.test(src)) {
    return src;
  }
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  return url.toString();
};

export default sanityImageLoader;
