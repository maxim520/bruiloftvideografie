import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import type { InstagramStripBlock } from "@/types/blocks";

type InstagramStripProps = {
  block: InstagramStripBlock;
};

/**
 * Kop en cta staan op desktop naast elkaar (niet gestapeld zoals
 * SectionHeading dat doet), dus hier los opgebouwd. Op mobiel verhuist de
 * cta naar onder de strip (insta__foot in de referentie) — met dezelfde
 * Button, twee keer gerenderd en met display toggled per breakpoint,
 * zodat er maar één label-bron is.
 */
export default function InstagramStrip({ block }: InstagramStripProps) {
  const { eyebrow, heading, cta, images } = block;

  if (images.length === 0) return null;

  return (
    <section className="bg-background py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          {(eyebrow || heading || cta) && (
            <div className="mb-[18px] flex flex-col items-start gap-[18px] md:mb-[26px] md:flex-row md:items-end md:justify-between md:gap-6">
              <div>
                {eyebrow && (
                  <p className="mb-5 text-[11px] font-semibold uppercase tracking-[.22em] text-copper">
                    {eyebrow}
                  </p>
                )}
                {heading && (
                  <h2 className="text-[clamp(1.625rem,2.4vw,2.125rem)]">{heading}</h2>
                )}
              </div>
              {cta && (
                <div className="hidden md:block">
                  <Button href={cta.href} variant="text-link">
                    {cta.label}
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="-mx-5 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-6 md:overflow-visible md:px-0 md:pb-0">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square w-[42%] flex-none snap-start overflow-hidden rounded-[3px] bg-surface md:w-auto"
              >
                <SafeImage image={image} sizes="(min-width: 768px) 16vw, 42vw" className="object-cover" />
              </div>
            ))}
          </div>

          {cta && (
            <div className="mt-[22px] md:hidden">
              <Button href={cta.href} variant="text-link">
                {cta.label}
              </Button>
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
