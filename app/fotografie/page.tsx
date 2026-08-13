import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/SectionRenderer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { getPageBySlug } from "@/lib/sanity/queries";
import { resolvePageMetadata } from "@/lib/sanity/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/structuredData";

const SLUG = "/fotografie";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  if (!page) notFound();

  return resolvePageMetadata(page, {
    title: "Trouwfotografie | North & Oak Photo & Film",
    description:
      "Tijdloze trouwfotografie voor bruidsparen in Nederland en Europa. Echte momenten, natuurlijke kleuren en een complete reportage van jullie trouwdag.",
  });
}

export default async function FotografiePage() {
  const page = await getPageBySlug(SLUG);
  if (!page) notFound();

  const [hero, ...rest] = page.sections;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: page.title, path: SLUG },
        ])}
      />
      {hero && <SectionRenderer sections={[hero]} />}
      <Breadcrumb currentLabel={page.title} />
      <SectionRenderer sections={rest} />
    </>
  );
}
