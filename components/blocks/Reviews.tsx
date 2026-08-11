import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import type { ReviewsBlock } from "@/types/blocks";

type ReviewsProps = {
  block: ReviewsBlock;
};

/** Vaste 5-sterrenrij: de referentie toont 'm identiek bij elke review, er is geen los ratingveld. */
function Stars() {
  return (
    <div className="mb-3 flex gap-[3px] text-copper" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.3 6.7 19.2l1.1-5.9-4.3-4.1 5.9-.8z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews({ block }: ReviewsProps) {
  const { eyebrow, heading, reviews, cta } = block;

  if (reviews.length === 0) return null;

  return (
    <section className="bg-surface py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            heading={heading}
            className="mb-11 [&_h2]:text-[clamp(2rem,3.2vw,2.75rem)]"
          />

          <div className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-6 md:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
            {reviews.map((review, index) => (
              <article
                key={index}
                className="flex w-[82%] flex-none snap-start gap-[18px] rounded-lg border border-border bg-white p-[26px] shadow-[0_1px_2px_rgba(36,27,23,0.04)] lg:w-auto"
              >
                <div className="relative h-[70px] w-14 flex-none overflow-hidden rounded-[3px] bg-surface">
                  <SafeImage image={review.avatar} sizes="56px" className="object-cover" />
                </div>
                <div>
                  <Stars />
                  <p className="mb-4 text-base leading-[1.7] text-text-muted">{review.quote}</p>
                  <div className="text-[13px] font-semibold">{review.name}</div>
                </div>
              </article>
            ))}
          </div>

          {cta && (
            <div className="mt-[34px]">
              <SectionHeading cta={cta} />
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
