import Link from "next/link";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import type { WeddingCard } from "@/types/blocks";

type FeaturedWeddingsProps = {
  weddings: WeddingCard[];
  eyebrow?: string;
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Hoeveel kaarten tonen — over-mij (Fase 6, sectie 17) wil er 2-3, de homepage 4. */
  limit?: number;
};

/**
 * Toont de losse `wedding`-documenten (Fase 2) — los van, en zonder te
 * raken aan, page-fotografie's bestaande reportageList (die twee
 * databronnen bestaan tot een expliciete migratie, zie
 * studio/schemaTypes/documents/wedding.ts).
 *
 * Herbruikbaar over pagina's heen (Fase 6, sectie 17: ook op /over-mij,
 * met eigen intro-copy "Zo ziet die manier van werken eruit.") — vandaar
 * de optionele eyebrow/heading/cta-overrides i.p.v. een tweede,
 * bijna-identieke component.
 *
 * Fase 4: elke kaart linkt naar zijn echte /verhalen/[slug]-pagina.
 */
export default function FeaturedWeddings({
  weddings,
  eyebrow = "Uitgelicht",
  heading = "Bruiloften die ik mocht vastleggen.",
  ctaLabel = "Bekijk de verhalen",
  ctaHref = "/verhalen",
  limit = 4,
}: FeaturedWeddingsProps) {
  const featured = weddings.slice(0, limit);

  if (featured.length === 0) return null;

  return (
    <section className="bg-background py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            heading={heading}
            cta={{ label: ctaLabel, href: ctaHref }}
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
