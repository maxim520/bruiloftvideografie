import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import type { ReportageListBlock } from "@/types/blocks";

type ReportageListProps = {
  block: ReportageListBlock;
};

export default function ReportageList({ block }: ReportageListProps) {
  const { eyebrow, heading, cta, reportages } = block;

  if (reportages.length === 0) return null;

  return (
    <section className="bg-background py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          {(eyebrow || heading || cta) && (
            <div className="mb-9 flex flex-col items-start gap-[22px] md:mb-12 md:flex-row md:items-end md:justify-between md:gap-8">
              <div>
                {eyebrow && (
                  <p className="mb-5 text-[11px] font-semibold uppercase tracking-[.22em] text-copper-text">
                    {eyebrow}
                  </p>
                )}
                {heading && <h2 className="text-[clamp(1.875rem,3vw,2.625rem)]">{heading}</h2>}
              </div>
              {cta && (
                <Button href={cta.href} variant="dark-outline" size="sm">
                  {cta.label}
                </Button>
              )}
            </div>
          )}

          <div>
            {reportages.map((reportage, index) => (
              <article
                key={index}
                className={`grid grid-cols-1 gap-[22px] border-border py-[30px] last:pb-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)_minmax(0,4fr)] lg:items-center lg:gap-[38px] lg:py-[34px] ${
                  index === 0 ? "border-t-0 pt-0" : "border-t"
                }`}
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-[4px] bg-surface">
                  <SafeImage
                    image={reportage.mainImage}
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div>
                  {reportage.names && (
                    <h3 className="mb-2.5 text-[26px] md:text-[clamp(1.5rem,2.2vw,1.875rem)]">
                      {reportage.names}
                    </h3>
                  )}
                  {reportage.location && (
                    <div className="mb-[18px] text-[11px] font-semibold uppercase tracking-[.16em] text-copper-text">
                      {reportage.location}
                    </div>
                  )}
                  {reportage.text && (
                    <p className="mb-5 text-base leading-[1.8] text-text-muted lg:max-w-[34ch]">
                      {reportage.text}
                    </p>
                  )}
                  {reportage.cta && (
                    <Button href={reportage.cta.href} variant="text-link">
                      {reportage.cta.label}
                    </Button>
                  )}
                </div>

                {reportage.gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                    {reportage.gallery.map((image, galleryIndex) => (
                      <div
                        key={galleryIndex}
                        className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-surface"
                      >
                        <SafeImage
                          image={image}
                          sizes="(min-width: 1024px) 12vw, 30vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
