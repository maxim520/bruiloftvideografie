import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { SetHeaderTheme } from "@/components/layout/HeaderThemeContext";
import JsonLd from "@/components/JsonLd";
import SafeImage from "@/components/ui/SafeImage";
import Reveal from "@/components/ui/Reveal";
import { getAllWeddings } from "@/lib/sanity/queries";
import { buildBreadcrumbJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Verhalen | Behind Every Wedding",
  description:
    "Een overzicht van bruiloftsreportages die ik mocht vastleggen — echte dagen, echte emoties.",
  alternates: { canonical: "/verhalen" },
  openGraph: {
    title: "Verhalen | Behind Every Wedding",
    description:
      "Een overzicht van bruiloftsreportages die ik mocht vastleggen — echte dagen, echte emoties.",
    url: "/verhalen",
    siteName: "Behind Every Wedding",
    locale: "nl_NL",
    type: "website",
  },
};

/**
 * Sectie 20: eenvoudig editorial overzicht van alle gepubliceerde
 * weddings — bewust geen filtering/paginering voor de huidige 4
 * reportages (zie de brief: "overengineer nu niet voor 4 weddings").
 * getAllWeddings() haalt alles op zonder limiet; zodra dat aantal
 * structureel groot wordt, is dít de plek om paginering toe te voegen.
 */
export default async function VerhalenPage() {
  const weddings = await getAllWeddings();

  return (
    <>
      {/* Sectie 1 (Fase 7): deze pagina opent met een lichte achtergrond
          (geen fotohero), dus donkere headertekst — zie HeaderThemeContext. */}
      <SetHeaderTheme theme="dark" />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Verhalen", path: "/verhalen" },
        ])}
      />

      <section className="bg-background pt-24 pb-16 md:pt-28 md:pb-20">
        <Container>
          <Reveal>
            <p className="mb-5 text-eyebrow font-semibold uppercase tracking-[.22em] text-copper-text">
              Verhalen
            </p>
            <h1 className="max-w-[18ch] text-h1">
              Bruiloften die ik mocht vastleggen.
            </h1>
          </Reveal>
        </Container>
      </section>

      <Breadcrumb currentLabel="Verhalen" />

      <section className="bg-background py-16 md:py-20">
        <Container width="wide">
          {weddings.length === 0 ? (
            <p className="text-text-muted">Nog geen reportages gepubliceerd.</p>
          ) : (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {weddings.map((wedding) => {
                const location = [wedding.venue, wedding.city || wedding.region]
                  .filter(Boolean)
                  .join(" · ");
                return (
                  <Link
                    key={wedding.slug.current}
                    href={`/verhalen/${wedding.slug.current}/`}
                    className="group block"
                  >
                    <Reveal>
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px]">
                        <SafeImage
                          image={wedding.heroImage}
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.03]"
                        />
                      </div>
                      <h2 className="mt-4 font-display text-xl">{wedding.coupleNames}</h2>
                      {location && <p className="mt-1 text-sm text-text-muted">{location}</p>}
                    </Reveal>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
