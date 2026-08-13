import type { MetadataRoute } from "next";
import { getAllPageSlugs } from "@/lib/sanity/queries";
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
  const pages = await getAllPageSlugs();

  return pages.map((page) => ({
    // Sluitende slash voor consistentie met trailingSlash: true — dat is
    // ook wat canonical/og:url elders al opleveren (geverifieerd in de
    // gebouwde HTML), dus de sitemap moet dezelfde vorm gebruiken.
    url: page.slug === "/" ? `${SITE_URL}/` : `${SITE_URL}${page.slug}/`,
    lastModified: page.updatedAt,
  }));
}
