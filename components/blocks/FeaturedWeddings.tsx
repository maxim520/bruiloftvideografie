import Link from "next/link";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import type { WeddingCard } from "@/types/blocks";

type FeaturedWeddingsProps = {
  weddings: WeddingCard[];
};

/**
 * Toont de losse `wedding`-documenten (Fase 2) op de homepage — los van,
 * en zonder te raken aan, page-fotografie's bestaande reportageList
 * (die twee databronnen bestaan tot een expliciete migratie, zie
 * studio/schemaTypes/documents/wedding.ts).
 *
 * Fase 4: elke kaart linkt nu naar zijn echte /verhalen/[slug]-pagina
 * (bestond nog niet in Fase 3). De sectie-CTA blijft naar /fotografie
 * wijzen ("Bekijk alle verhalen"): dat is nu een bewuste keuze — de
 * bestaande overzichtspagina daar toont de langerlopende reportageList,
 * /verhalen is het nieuwe, kleinere overzicht van losse documenten.
 */
export default function FeaturedWeddings({ weddings }: FeaturedWeddingsProps) {
  const featured = weddings.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="bg-background py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Uitgelicht"
            heading="Bruiloften die wij mochten vastleggen."
            cta={{ label: "Bekijk alle verhalen", href: "/verhalen" }}
            className="mb-11 [&_h2]:max-w-[22ch]"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((wedding) => {
              const location = [wedding.venue, wedding.city].filter(Boolean).join(", ");
              return (
                <Link
                  key={wedding.slug.current}
                  href={`/verhalen/${wedding.slug.current}/`}
                  className="group block"
                >
                  <article>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-surface">
                      <SafeImage
                        image={wedding.heroImage}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.025]"
                      />
                    </div>
                    <h3 className="mt-4 font-display text-lg">{wedding.coupleNames}</h3>
                    {location && (
                      <p className="mt-1 text-sm text-text-muted">{location}</p>
                    )}
                  </article>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
