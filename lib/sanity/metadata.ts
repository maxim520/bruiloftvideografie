import type { Metadata } from "next";
import type { Page } from "@/types/blocks";
import { urlFor, isSanityAssetImage } from "./image";

type MetadataFallback = {
  title: string;
  description: string;
};

/**
 * Zet het seo-object van een Sanity-pagina om in Next's Metadata. title
 * en description zijn verplicht in het schema, maar deze fallback vangt
 * onvolledige of handmatig aangemaakte content op zonder lege metatags
 * op te leveren. Gedeeld door alle vier de pagina's, die verder alleen
 * hun eigen fallbacktekst meegeven.
 *
 * openGraph en twitter staan altijd allebei volledig ingevuld, ook zonder
 * ogImage: zonder een eigen openGraph-object vult Next.js daar niets voor
 * in (geen automatische overname van het title/description hierboven),
 * en zonder openGraph-object slaat Next zijn eigen twitter-overname ook
 * over — dat gaf hiervoor stille, ontbrekende og:- en twitter:-tags op
 * elke pagina zonder ogImage (drie van de vier). Geverifieerd in Next's
 * eigen resolve-metadata-broncode, niet aangenomen.
 */
export function resolvePageMetadata(page: Page, fallback: MetadataFallback): Metadata {
  const { seo } = page;
  const title = seo.title || fallback.title;
  const description = seo.description || fallback.description;
  const ogImage = seo.ogImage && isSanityAssetImage(seo.ogImage) ? seo.ogImage : undefined;
  const url = page.slug.current;

  const images = ogImage
    ? [
        {
          url: urlFor(ogImage)
            .width(1200)
            .height(630)
            .fit("crop")
            .auto("format")
            .quality(78)
            .url(),
          width: 1200,
          height: 630,
          alt: ogImage.alt,
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Behind Every Wedding",
      locale: "nl_NL",
      type: "website",
      ...(images && { images }),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      ...(images && { images }),
    },
  };
}
