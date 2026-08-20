import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Breadcrumb from "@/components/layout/Breadcrumb";
import WeddingHero from "@/components/wedding/WeddingHero";
import EditorialIntro from "@/components/wedding/EditorialIntro";
import StoryLayout from "@/components/wedding/StoryLayout";
import FilmMoment from "@/components/wedding/FilmMoment";
import TestimonialQuote from "@/components/wedding/TestimonialQuote";
import Suppliers from "@/components/wedding/Suppliers";
import VenueContext from "@/components/wedding/VenueContext";
import NextStory from "@/components/wedding/NextStory";
import WeddingCta from "@/components/wedding/WeddingCta";
import {
  getAllWeddings,
  getAllWeddingSlugs,
  getSiteSettings,
  getWeddingBySlug,
} from "@/lib/sanity/queries";
import { resolveWeddingMetadata } from "@/lib/sanity/metadata";
import {
  buildBreadcrumbJsonLd,
  buildWeddingArticleJsonLd,
  buildWeddingVideoJsonLd,
} from "@/lib/structuredData";
import { resolveNextWedding } from "@/lib/wedding/nextWedding";

type WeddingPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Bij output: "export" bepaalt dit exact welke /verhalen/[slug]-paden
 * als statisch HTML-bestand gebouwd worden — een slug die hier niet in
 * zit, bestaat na de build simpelweg niet als bestand en levert dus
 * vanzelf een echte 404 van de hostingserver op (geen aparte
 * runtime-notFound-afhandeling nodig voor dát geval).
 */
export async function generateStaticParams() {
  const slugs = await getAllWeddingSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: WeddingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const wedding = await getWeddingBySlug(slug);
  if (!wedding) notFound();

  return resolveWeddingMetadata(wedding);
}

export default async function WeddingPage({ params }: WeddingPageProps) {
  const { slug } = await params;
  const [wedding, allWeddings, siteSettings] = await Promise.all([
    getWeddingBySlug(slug),
    getAllWeddings(),
    getSiteSettings(),
  ]);

  // Vangt zowel een niet-bestaande slug op (generateStaticParams sluit
  // dit normaal al uit, maar `next dev`/preview kent die beperking niet)
  // als het ontbreken van siteSettings — zonder settings kan de rest van
  // de pagina (JSON-LD, later ook header/footer) niet zinnig renderen.
  if (!wedding || !siteSettings) notFound();

  const next = resolveNextWedding(wedding, allWeddings);

  // filmSource ontbreekt op reportages van vóór dit veld — dan gold het
  // enige toenmalige gedrag (url), zie ook de hidden-conditie in het
  // Studio-schema (wedding.ts) die om dezelfde reden dezelfde fallback hanteert.
  const film =
    (wedding.filmSource ?? "url") === "upload" && wedding.filmFileUrl
      ? ({ source: "upload", url: wedding.filmFileUrl } as const)
      : wedding.filmUrl
        ? ({ source: "url", url: wedding.filmUrl } as const)
        : null;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Verhalen", path: "/verhalen" },
          { name: wedding.coupleNames, path: `/verhalen/${slug}` },
        ])}
      />
      <JsonLd data={buildWeddingArticleJsonLd(wedding, siteSettings)} />
      {film && <JsonLd data={buildWeddingVideoJsonLd(wedding, film)} />}

      <WeddingHero wedding={wedding} />
      <Breadcrumb currentLabel={wedding.coupleNames} parent={{ label: "Verhalen", href: "/verhalen" }} />
      <EditorialIntro intro={wedding.intro} />
      <StoryLayout storyBlocks={wedding.storyBlocks} gallery={wedding.gallery} />
      {film && (
        <FilmMoment film={film} posterImage={wedding.heroImage} coupleNames={wedding.coupleNames} />
      )}
      <TestimonialQuote testimonial={wedding.testimonial} />
      <Suppliers suppliers={wedding.suppliers} />
      <VenueContext venue={wedding.venue} venueContext={wedding.venueContext} />
      <NextStory next={next} />
      <WeddingCta />
    </>
  );
}
