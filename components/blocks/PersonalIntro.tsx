import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import CtaStack from "@/components/ui/CtaStack";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import type { PersonalIntroBlock } from "@/types/blocks";

type PersonalIntroProps = {
  block: PersonalIntroBlock;
};

/**
 * Sectie 18 (Fase 6): compacte "dit is de persoon achter het merk"-
 * sectie op de homepage, vóór de laatste conversiestap. Bewust géén
 * tweede volledige Over mij-pagina — één foto, één korte alinea, één
 * CTA. Zie components/blocks/StoryIntro.tsx voor de volledige versie
 * op /over-mij.
 */
export default function PersonalIntro({ block }: PersonalIntroProps) {
  const { eyebrow, heading, text, image, cta } = block;

  if (!heading) return null;

  return (
    <section className="bg-surface-light py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] md:gap-16">
            <CtaStack
              heading={
                <>
                  {eyebrow && (
                    <p className="mb-5 text-eyebrow font-semibold uppercase tracking-[.22em] text-copper-text">
                      {eyebrow}
                    </p>
                  )}
                  <h2 className="max-w-[16ch] text-h2">{heading}</h2>
                </>
              }
              text={<p className="max-w-[46ch] text-base leading-[1.85] text-text-muted">{text}</p>}
              actions={
                cta?.href && (
                  <Button href={cta.href} variant="secondary" className="w-full self-start md:w-auto">
                    {cta.label}
                  </Button>
                )
              }
            />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] md:order-first">
              <SafeImage
                image={image}
                sizes="(min-width: 768px) 36vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
