import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/SectionRenderer";
import FeaturedWeddings from "@/components/blocks/FeaturedWeddings";
import Breadcrumb from "@/components/layout/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { getFeaturedWeddings, getPageBySlug, getSiteSettings } from "@/lib/sanity/queries";
import { resolvePageMetadata } from "@/lib/sanity/metadata";
import { buildBreadcrumbJsonLd, buildPersonJsonLd } from "@/lib/structuredData";

const SLUG = "/over-mij";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  if (!page) notFound();

  return resolvePageMetadata(page, {
    title: "Over mij | Behind Every Wedding",
    description:
      "Maak kennis met de fotograaf achter Behind Every Wedding. Persoonlijke trouwfotografie en trouwfilms met een rustige, tijdloze stijl.",
  });
}

export default async function OverMijPage() {
  const [page, featuredWeddings, siteSettings] = await Promise.all([
    getPageBySlug(SLUG),
    getFeaturedWeddings(),
    getSiteSettings(),
  ]);
  if (!page) notFound();

  // Fase 6, sectie 17: Wedding Stories als bewijs van de werkwijze —
  // ingevoegd na "process" (zo werk ik) en vóór "quote", zodat de
  // volgorde leest als "zo werk ik -> zo ziet dat eruit -> dat vinden
  // bruidsparen ervan (reviews)". Breadcrumb blijft direct onder de hero,
  // zoals op /fotografie en /contact — vandaar de drieledige split i.p.v.
  // twee stukken.
  const [hero, ...rest] = page.sections;
  const processIndex = rest.findIndex((s) => s._type === "process");
  const sectionsBeforeStories = processIndex === -1 ? rest : rest.slice(0, processIndex + 1);
  const sectionsAfterStories = processIndex === -1 ? [] : rest.slice(processIndex + 1);

  const storyIntro = page.sections.find((s) => s._type === "storyIntro");
  const personName =
    (storyIntro && "signatureName" in storyIntro && storyIntro.signatureName) || undefined;
  const personRole =
    (storyIntro && "signatureRole" in storyIntro && storyIntro.signatureRole) || undefined;
  const personImage = storyIntro && "images" in storyIntro ? storyIntro.images[0] : undefined;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: page.title, path: SLUG },
        ])}
      />
      {personName && siteSettings && (
        <JsonLd
          data={buildPersonJsonLd({
            name: personName,
            jobTitle: personRole,
            image: personImage,
            worksForName: siteSettings.logoName,
          })}
        />
      )}

      {hero && <SectionRenderer sections={[hero]} />}
      <Breadcrumb currentLabel={page.title} />
      <SectionRenderer sections={sectionsBeforeStories} />
      <FeaturedWeddings
        weddings={featuredWeddings}
        eyebrow="Zo werkt dat in de praktijk"
        heading="Zo ziet die manier van werken eruit."
        ctaLabel="Bekijk de verhalen"
        ctaHref="/verhalen"
        limit={3}
      />
      <SectionRenderer
        sections={sectionsAfterStories}
        overrides={{ faq: { columns: 1, compact: false } }}
      />
    </>
  );
}
