import { createImageUrlBuilder } from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url";
import type { SanityImage, SanityImageHotspot } from "@/types/blocks";
import { client } from "./client";

/** De echte, Sanity-vorm van SanityImage: heeft een asset-referentie. */
export type SanityAssetImage = Extract<SanityImage, { asset: unknown }>;

/** Onderscheidt de asset-vorm van de tijdelijke url-vorm uit lib/mock-data.ts. */
export function isSanityAssetImage(image: SanityImage): image is SanityAssetImage {
  return "asset" in image;
}

const builder = createImageUrlBuilder(client);

/**
 * Bouwt een Sanity CDN-URL voor een afbeelding. Werkt alleen voor de
 * echte Sanity-vorm van SanityImage (asset-referentie), niet voor de
 * tijdelijke `url`-vorm uit lib/mock-data.ts.
 */
export function urlFor(source: SanityAssetImage): ImageUrlBuilder {
  return builder.image(source);
}

/**
 * Zet een Sanity-hotspot om in een CSS object-position. `x`/`y` zijn bij
 * Sanity al fracties (0–1) van breedte/hoogte, met dezelfde betekenis als
 * de twee getallen in object-position — vandaar de directe *100%-omzetting.
 */
export function hotspotToObjectPosition(hotspot: SanityImageHotspot): string {
  const x = Math.round(hotspot.x * 1000) / 10;
  const y = Math.round(hotspot.y * 1000) / 10;
  return `${x}% ${y}%`;
}
