import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { StatsBlock } from "@/types/blocks";

type StatsProps = {
  block: StatsBlock;
};

export default function Stats({ block }: StatsProps) {
  const { eyebrow, heading, text, cta, items } = block;

  if (items.length === 0) return null;

  return (
    <section className="bg-background py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-11 lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:gap-[72px]">
            <SectionHeading
              eyebrow={eyebrow}
              heading={heading}
              text={text}
              cta={cta}
              className="[&_h2]:max-w-[14ch] [&_h2]:text-h2 [&_p]:max-w-none lg:[&_p]:max-w-[40ch]"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-baseline gap-[18px] border-border py-[18px] text-left md:block md:py-1 md:text-center ${
                    index === 0 ? "border-t-0" : "border-t md:border-t-0"
                  } ${index % 2 === 1 ? "md:border-l" : "md:border-l-0"} ${
                    index > 0 ? "lg:border-l" : "lg:border-l-0"
                  }`}
                >
                  <div className="min-w-[110px] font-display text-[38px] font-medium leading-none text-copper md:min-w-0 lg:text-[clamp(2.375rem,4vw,3.375rem)]">
                    {item.value}
                  </div>
                  <div className="text-[10.5px] font-semibold uppercase leading-[1.7] tracking-[.18em] text-text-muted md:mt-4">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
