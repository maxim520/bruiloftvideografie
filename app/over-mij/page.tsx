import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/SectionRenderer";
import { getPageBySlug } from "@/lib/sanity/queries";
import { resolvePageMetadata } from "@/lib/sanity/metadata";

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
  const page = await getPageBySlug(SLUG);
  if (!page) notFound();

  return (
    <SectionRenderer sections={page.sections} overrides={{ faq: { columns: 1, compact: false } }} />
  );
}
