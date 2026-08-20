import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/SectionRenderer";
import FeaturedWeddings from "@/components/blocks/FeaturedWeddings";
import { getFeaturedWeddings, getPageBySlug } from "@/lib/sanity/queries";
import { resolvePageMetadata } from "@/lib/sanity/metadata";

const SLUG = "/";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  if (!page) notFound();

  return resolvePageMetadata(page, {
    title: "Behind Every Wedding",
    description:
      "Tijdloze trouwfotografie en trouwfilms voor bruidsparen in heel Nederland en Europa.",
  });
}

export default async function HomePage() {
  const [page, featuredWeddings] = await Promise.all([
    getPageBySlug(SLUG),
    getFeaturedWeddings(),
  ]);
  if (!page) notFound();

  // Fase 6, sectie 19: Wedding Stories (bewijs) vóór de allerlaatste
  // conversiestap (finalCta), niet erna — dezelfde
  // [hero, ...rest]-splitspatroon als app/fotografie/page.tsx, hier aan
  // het eind van de array i.p.v. het begin. finalCta staat op elke
  // pagina altijd als laatste sectie.
  const finalCta = page.sections.at(-1);
  const sectionsBeforeFinalCta = page.sections.slice(0, -1);

  return (
    <>
      <SectionRenderer sections={sectionsBeforeFinalCta} />
      <FeaturedWeddings weddings={featuredWeddings} />
      {finalCta && <SectionRenderer sections={[finalCta]} />}
    </>
  );
}
