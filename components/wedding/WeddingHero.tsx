import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import type { Wedding } from "@/types/blocks";

type WeddingHeroProps = {
  wedding: Wedding;
};

/**
 * Sectie 3/4 van de Fase 4-brief: de bezoeker zit al midden in het
 * verhaal (komt via /verhalen of de homepage "Uitgelicht"-sectie) —
 * geen grote CTA hier, alleen de metadata-regel, namen en een korte
 * intro. Zelfde LCP-behandeling als Hero.tsx (preload + fetchPriority
 * high, zie SafeImage.tsx/scripts/fetch-hero-images.mjs): dit beeld is
 * op elke reportagepagina het LCP-element.
 */
export default function WeddingHero({ wedding }: WeddingHeroProps) {
  const { coupleNames, venue, city, region, country, heroImage } = wedding;

  // "VENUE · PLAATS" als beide er zijn; internationale locaties tonen het
  // land i.p.v. een (vaak leeg) Nederlandse regio — zie de Julia & Mees-
  // data (Comomeer, Italië: geen stad/regio ingevuld, wel land).
  const locationParts = [venue, city || (country && country !== "Nederland" ? country : region)]
    .filter(Boolean);

  return (
    <section className="relative flex min-h-[560px] items-end overflow-hidden bg-ink md:min-h-[86vh] md:items-center">
      <div className="absolute inset-0">
        <SafeImage
          image={heroImage}
          preload
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(180deg,rgba(20,14,11,.5) 0%,rgba(20,14,11,.22) 34%,rgba(20,14,11,.84) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg,rgba(20,14,11,.72) 0%,rgba(20,14,11,.36) 50%,rgba(20,14,11,.14) 100%)",
        }}
      />

      <Container className="relative z-[2] w-full pt-24 pb-20 md:pb-24">
        <Reveal className="max-w-[680px] text-white">
          {locationParts.length > 0 && (
            <p className="mb-5 text-eyebrow font-semibold uppercase tracking-[.22em] text-[#c08f68]">
              {locationParts.join(" · ")}
            </p>
          )}
          <h1 className="text-[clamp(2.5rem,7vw,5rem)]">{coupleNames}</h1>
        </Reveal>
      </Container>
    </section>
  );
}
