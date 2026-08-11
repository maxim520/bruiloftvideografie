import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import type { PortfolioGridBlock } from "@/types/blocks";

type PortfolioGridProps = {
  block: PortfolioGridBlock;
};

/**
 * Aspect ratio per foto is afgeleid uit de positie, net als in de
 * referentie: de eerste foto is de "lead" (volle breedte + 4:3 op
 * mobiel), de eerste drie zijn portret (4:5), de rest is 4:3.
 */
export default function PortfolioGrid({ block }: PortfolioGridProps) {
  const { eyebrow, heading, cta, images } = block;

  if (images.length === 0) return null;

  return (
    <section className="bg-background py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4">
            <SectionHeading
              eyebrow={eyebrow}
              heading={heading}
              cta={cta}
              className="col-span-2 flex flex-col justify-center pb-6 md:col-span-1 md:py-1.5 md:pr-10 [&_h2]:max-w-[11ch] [&_h2]:text-[clamp(2rem,3.4vw,2.875rem)]"
            />
            {images.map((image, index) => {
              const isLead = index === 0;
              const isPortrait = index < 3;
              return (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-[3px] bg-surface ${
                    isLead
                      ? "col-span-2 aspect-[4/3] md:col-span-1 md:aspect-[4/5]"
                      : isPortrait
                        ? "aspect-[4/5]"
                        : "aspect-[4/3]"
                  }`}
                >
                  <SafeImage
                    image={image}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.6,0.2,1)] hover:scale-[1.025]"
                  />
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
