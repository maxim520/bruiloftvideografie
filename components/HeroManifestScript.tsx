import { getHeroManifest } from "@/lib/sanity/heroManifest";

/**
 * Zet het server-gelezen hero-cache-manifest in de HTML, zodat
 * lib/sanity/imageLoader.ts er client-side (tijdens next/image's eigen
 * hydratie-herberekening) exact dezelfde data uit kan lezen als
 * server-side — zie lib/sanity/heroManifest.ts voor waarom dat moet
 * kloppen (anders: hydration mismatch + een overbodige tweede fetch naar
 * cdn.sanity.io vlak na page load).
 *
 * Rendert niets als er geen manifest is (bv. `next dev` zonder eerdere
 * `npm run build`) — de loader valt dan aan beide kanten consistent terug
 * op de normale cdn.sanity.io-URL.
 */
export default function HeroManifestScript() {
  const manifest = getHeroManifest();
  if (!manifest) return null;

  return (
    <script
      id="hero-manifest"
      type="application/json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(manifest).replace(/</g, "\\u003c"),
      }}
    />
  );
}
