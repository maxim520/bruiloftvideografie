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
 * (die twee databronnen bestaan tot Fase 4 naast elkaar, zie
 * studio/schemaTypes/documents/wedding.ts).
 *
 * Geen link per kaart: /verhalen/[slug] bestaat nog niet (expliciet
 * buiten deze fase), dus een kaart die naar een reportage zou moeten
 * doorklikken heeft nog geen echte bestemming. De sectie-CTA wijst in
 * plaats daarvan naar /fotografie, de bestaande, live overzichtspagina.
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
            cta={{ label: "Bekijk alle reportages", href: "/fotografie" }}
            className="mb-11 [&_h2]:max-w-[22ch] [&_h2]:text-[clamp(2rem,3.4vw,2.875rem)]"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((wedding) => {
              const location = [wedding.venue, wedding.city].filter(Boolean).join(", ");
              return (
                <article key={wedding.slug.current}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-surface">
                    <SafeImage
                      image={wedding.heroImage}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-lg">{wedding.coupleNames}</h3>
                  {location && (
                    <p className="mt-1 text-sm text-text-muted">{location}</p>
                  )}
                </article>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
