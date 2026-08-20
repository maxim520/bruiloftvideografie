import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { PricingBlock } from "@/types/blocks";

type PricingProps = {
  block: PricingBlock;
};

/**
 * Fase 2-foundation: "Investering"-sectie. Rendert bewust niets zolang
 * `items` leeg is (zie pricing.ts in de Studio) — dit blok kan dus al
 * aan een pagina hangen vóórdat er echte pakketten ingevuld zijn, zonder
 * ooit een placeholder-prijs te tonen. Visuele afstemming op de rest van
 * de site volgt in Fase 3; dit is de werkende basisvorm.
 */
export default function Pricing({ block }: PricingProps) {
  const { eyebrow, heading, items } = block;

  if (items.length === 0) return null;

  return (
    <section className="bg-surface-light py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={eyebrow} heading={heading} className="mb-11 text-center [&_h2]:mx-auto" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.name}
                className="flex flex-col rounded-lg border border-border bg-white p-8"
              >
                <h3 className="text-[22px]">{item.name}</h3>
                {item.description && (
                  <p className="mt-2.5 text-sm leading-[1.7] text-text-muted">
                    {item.description}
                  </p>
                )}
                {/* Geen prijsregel zolang startingPrice niet is ingevuld —
                    zie pricingItem.ts: bewust geen placeholder-bedrag. */}
                {item.startingPrice !== undefined && (
                  <p className="mt-5 text-caption font-semibold uppercase tracking-[.14em] text-copper-text">
                    Vanaf €{item.startingPrice.toLocaleString("nl-NL")}
                  </p>
                )}
                {item.features && item.features.length > 0 && (
                  <ul className="mt-6 flex flex-col gap-2.5 text-sm text-text">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="mt-[7px] h-1 w-1 flex-none rounded-full bg-copper" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                {item.cta && (
                  <div className="mt-7">
                    <Button href={item.cta.href} variant="dark-outline" size="sm">
                      {item.cta.label}
                    </Button>
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
