import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import type { QuoteBlock } from "@/types/blocks";

type QuoteProps = {
  block: QuoteBlock;
};

export default function Quote({ block }: QuoteProps) {
  const { quote, attribution } = block;

  if (!quote) return null;

  return (
    <section className="bg-ink py-[76px] text-center text-white md:py-[104px]">
      <Container>
        <Reveal>
          <blockquote className="m-0">
            <span className="mb-7 inline-block text-[#c08f68] opacity-[0.85]" aria-hidden="true">
              <svg width="34" height="26" viewBox="0 0 34 26" fill="currentColor">
                <path d="M0 26V13.4C0 6.4 4.3 1.2 12 0l1.3 3.7C9 5 6.7 7.6 6.6 11.4H12V26zm20 0V13.4C20 6.4 24.3 1.2 32 0l1.3 3.7c-4.3 1.3-6.6 3.9-6.7 7.7H32V26z" />
              </svg>
            </span>
            <p className="mx-auto max-w-[16ch] font-display-quote text-[clamp(1.625rem,3.2vw,2.625rem)] font-normal italic leading-[1.32] md:max-w-[20ch]">
              {quote}
            </p>
            {attribution && (
              <cite className="mt-[34px] block font-body text-[11px] font-semibold not-italic uppercase tracking-[.2em] text-white/50">
                {attribution}
              </cite>
            )}
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}
