import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/SectionRenderer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { getPageBySlug } from "@/lib/sanity/queries";
import { resolvePageMetadata } from "@/lib/sanity/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/structuredData";

const SLUG = "/contact";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  if (!page) notFound();

  return resolvePageMetadata(page, {
    title: "Contact & beschikbaarheid | North & Oak Photo & Film",
    description:
      "Controleer jullie trouwdatum en vraag vrijblijvend informatie aan over trouwfotografie en trouwfilm van North & Oak Photo & Film.",
  });
}

export default async function ContactPage() {
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
      <SectionRenderer
        sections={rest}
        overrides={{ faq: { columns: 2, compact: true } }}
      />
    </>
  );
}
