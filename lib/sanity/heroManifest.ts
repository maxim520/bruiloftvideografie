export type HeroManifest = Record<string, Record<string, string>>;

/**
 * Server én client moeten voor dezelfde afbeelding-URL exact dezelfde
 * manifest-lookup teruggeven — anders berekent next/image's client-side
 * hydratie een andere src/srcSet dan wat er al in de server-HTML staat
 * (hydration mismatch), en swapt de browser na hydratie alsnog terug naar
 * de cdn.sanity.io-URL: precies het netwerkverkeer dat de hero-cache-fix
 * (scripts/fetch-hero-images.mjs) had moeten wegnemen.
 *
 * Server-side wordt het manifest van disk gelezen (zoals voorheen).
 * Client-side is er geen bestandssysteem — in plaats daarvan leest de
 * client de identieke data terug uit de <script id="hero-manifest">-tag
 * die app/layout.tsx in de HTML zet (zie ManifestScript hieronder), zodat
 * beide kanten met precies dezelfde data rekenen.
 */
let cached: HeroManifest | null | undefined;

export function getHeroManifest(): HeroManifest | null {
  if (cached !== undefined) return cached;

  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports -- alleen server-side, module-scope, één keer per build
      const fs = require("node:fs") as typeof import("node:fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("node:path") as typeof import("node:path");
      const manifestPath = path.join(process.cwd(), "public/_hero-cache/manifest.json");
      cached = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    } catch {
      cached = null; // geen prebuild gedraaid (bv. `next dev` zonder eerdere `npm run build`) — geen probleem
    }
  } else {
    try {
      const el = document.getElementById("hero-manifest");
      cached = el?.textContent ? JSON.parse(el.textContent) : null;
    } catch {
      cached = null;
    }
  }

  return cached ?? null;
}
