import Link from "next/link";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import type { WeddingCard } from "@/types/blocks";

type NextStoryProps = {
  next: WeddingCard | null;
};

/**
 * Sectie 14: precies één volgende reportage, geen raster met
 * aanbevelingen — zie lib/wedding/nextWedding.ts voor de keuzelogica
 * (expliciete relatedWeddings, anders een vaste cyclische volgorde).
 * `next` is `null` zodra er geen andere wedding is om te tonen (bv. een
 * dataset met precies één reportage) — dan rendert deze sectie niets.
 */
export default function NextStory({ next }: NextStoryProps) {
  if (!next) return null;

  const location = [next.venue, next.city || next.region].filter(Boolean).join(" · ");

  return (
    <section className="bg-ink py-20 text-white md:py-28">
      <Container>
        <Reveal>
          <Link href={`/verhalen/${next.slug.current}/`} className="group block">
            <p className="mb-8 text-center text-eyebrow font-semibold uppercase tracking-[.22em] text-copper-text-on-dark">
              Volgende verhaal
            </p>
            <div className="relative mx-auto aspect-[16/9] w-full max-w-[880px] overflow-hidden rounded-[3px]">
              <SafeImage
                image={next.heroImage}
                sizes="(min-width: 1024px) 880px, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.03]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,14,11,0)_50%,rgba(20,14,11,.7)_100%)]"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
                <h2 className="text-h2 text-white">{next.coupleNames}</h2>
                {location && (
                  <p className="mt-2 text-sm uppercase tracking-[.14em] text-white/70">{location}</p>
                )}
              </div>
            </div>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
