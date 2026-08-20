import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import type { StoryIntroBlock } from "@/types/blocks";

type StoryIntroProps = {
  block: StoryIntroBlock;
};

/**
 * De referentie gebruikt hier een los "handschrift"-lettertype
 * (--font-script, "Petit Formal Script") voor de handtekening. Dat is in
 * Fase 1 bewust niet geladen ("laad alleen deze gewichten, niets extra's"
 * gold voor Cormorant Garamond + Manrope). De handtekening leent daarom
 * font-display-quote (de cursieve 400-instantie, zie app/layout.tsx) in
 * plaats van een derde font te introduceren.
 */
export default function StoryIntro({ block }: StoryIntroProps) {
  const { eyebrow, heading, paragraphs, signatureName, signatureRole, images } = block;

  if (!heading) return null;

  const hasImages = images.length > 0;

  return (
    <section className="bg-surface-light py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <div
            className={
              hasImages
                ? "grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:gap-[72px]"
                : undefined
            }
          >
            <div>
              {eyebrow && (
                <p className="mb-5 text-eyebrow font-semibold uppercase tracking-[.22em] text-charcoal-muted">
                  {eyebrow}
                </p>
              )}
              <h2 className="mb-7 max-w-[16ch] text-h2">
                {heading}
              </h2>
              {paragraphs.length > 0 && (
                <div className="flex flex-col gap-[18px]">
                  {paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base leading-[1.8] text-text-muted lg:max-w-[44ch]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {(signatureName || signatureRole) && (
                <div className="mt-8 lg:mt-10">
                  {signatureName && (
                    <div className="font-display-quote text-[38px] font-normal italic leading-none text-charcoal">
                      {signatureName}
                    </div>
                  )}
                  {signatureRole && (
                    <div className="mt-3 text-eyebrow font-semibold uppercase tracking-[.2em] text-copper-text">
                      {signatureRole}
                    </div>
                  )}
                </div>
              )}
            </div>

            {hasImages && (
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-[1.15fr_1fr] md:gap-3.5">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-lg bg-surface ${
                      index === 0
                        ? "col-span-2 aspect-[4/3] md:col-span-1 md:row-span-2 md:aspect-[4/5]"
                        : "aspect-square md:aspect-[4/3]"
                    }`}
                  >
                    <SafeImage
                      image={image}
                      sizes="(min-width: 1024px) 29vw, (min-width: 768px) 45vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
