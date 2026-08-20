import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import type { WeddingTestimonial } from "@/types/blocks";

type TestimonialQuoteProps = {
  testimonial?: WeddingTestimonial;
};

/**
 * Sectie 11: een grote editorial quote, geen standaard review-kaart —
 * qua uitvoering vergelijkbaar met components/blocks/Quote.tsx (dezelfde
 * font-display-quote-cursief-behandeling), maar zonder het aanhalingsteken-
 * icoon: dat past bij een los, herhaald sitewide blok, hier is dit een
 * eenmalig, persoonlijk moment in het verhaal van déze twee mensen.
 */
export default function TestimonialQuote({ testimonial }: TestimonialQuoteProps) {
  if (!testimonial?.quote) return null;

  return (
    <section className="bg-surface py-20 text-center md:py-28">
      <Container width="narrow">
        <Reveal>
          <blockquote className="m-0">
            <p className="mx-auto max-w-[32ch] font-display-quote text-[clamp(1.75rem,3.4vw,2.75rem)] italic leading-[1.32] text-text">
              “{testimonial.quote}”
            </p>
            {testimonial.name && (
              <cite className="mt-7 block text-eyebrow font-semibold not-italic uppercase tracking-[.2em] text-text-muted">
                {testimonial.name}
              </cite>
            )}
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}
