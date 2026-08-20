import type { MetadataRoute } from "next";
import { getAllPageSlugs, getAllWeddings } from "@/lib/sanity/queries";
import { SITE_URL } from "@/lib/site";

/**
 * Route Handler-achtig bestand: bij output: "export" rendert dit één
 * keer tijdens `next build` naar een statisch sitemap.xml in out/, net
 * als een gewone pagina — geen server nodig om dit te blijven serveren.
 *
 * `dynamic = "force-static"` is hier geen voorzorgsmaatregel: zonder
 * deze regel weigert `next build` de export volledig, ook al gebeurt
 * alle data-ophaling hierboven al gewoon op build-time (zie app/robots.ts
 * voor de exacte foutmelding die dit voorkomt).
 */
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, weddings] = await Promise.all([getAllPageSlugs(), getAllWeddings()]);

  const pageEntries = pages.map((page) => ({
    // Sluitende slash voor consistentie met trailingSlash: true — dat is
    // ook wat canonical/og:url elders al opleveren (geverifieerd in de
    // gebouwde HTML), dus de sitemap moet dezelfde vorm gebruiken.
    url: page.slug === "/" ? `${SITE_URL}/` : `${SITE_URL}${page.slug}/`,
    lastModified: page.updatedAt,
  }));

  // Fase 4: /verhalen (overzicht) + elke /verhalen/[slug]. WeddingCard
  // heeft geen _updatedAt (die lichte kaartweergave wordt ook door de
  // homepage en /verhalen zelf gebruikt) — lastModified is optioneel in
  // Next's sitemap-type, dus simpelweg weglaten i.p.v. de query overal
  // zwaarder te maken voor één extra veld.
  const weddingEntries = [
    { url: `${SITE_URL}/verhalen/` },
    ...weddings.map((wedding) => ({
      url: `${SITE_URL}/verhalen/${wedding.slug.current}/`,
    })),
  ];

  return [...pageEntries, ...weddingEntries];
}
