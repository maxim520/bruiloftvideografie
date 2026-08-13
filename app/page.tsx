import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/SectionRenderer";
import { getPageBySlug } from "@/lib/sanity/queries";
import { resolvePageMetadata } from "@/lib/sanity/metadata";

const SLUG = "/";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  if (!page) notFound();

  return resolvePageMetadata(page, {
    title: "North & Oak Photo & Film",
    description:
      "Tijdloze trouwfotografie en trouwfilms voor bruidsparen in heel Nederland en Europa.",
  });
}

export default async function HomePage() {
  const page = await getPageBySlug(SLUG);
  if (!page) notFound();

  return <SectionRenderer sections={page.sections} />;
}
