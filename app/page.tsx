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

  return (
    <>
      <SectionRenderer sections={page.sections} />
      <FeaturedWeddings weddings={featuredWeddings} />
    </>
  );
}
