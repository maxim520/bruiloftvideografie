import Link from "next/link";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import type { FilmSectionBlock } from "@/types/blocks";

type FilmSectionProps = {
  block: FilmSectionBlock;
};

export default function FilmSection({ block }: FilmSectionProps) {
  const { eyebrow, heading, cta, films } = block;

  if (films.length === 0) return null;

  return (
    <section className="bg-brown-dark py-[68px] text-background md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
            <SectionHeading
              eyebrow={eyebrow}
              heading={heading}
              cta={cta}
              onDark
              className="[&_h2]:max-w-[14ch] [&_h2]:text-[clamp(2rem,3.2vw,2.75rem)] [&_h2]:text-white"
            />

            <div className="grid grid-cols-1 gap-[26px] lg:grid-cols-3 lg:gap-[22px]">
              {films.map((film, index) => (
                <Link key={index} href={film.href} className="group block">
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-[#3a2c24] lg:aspect-[4/3]">
                    <SafeImage
                      image={film.image}
                      sizes="(min-width: 1024px) 27vw, (min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-1/2 top-1/2 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/[0.16] text-white backdrop-blur-[3px] transition-colors duration-200 group-hover:border-copper group-hover:bg-copper">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    </span>
                  </div>
                  <div className="pt-4 transition-transform duration-200 group-hover:-translate-y-0.5">
                    <div className="text-xs font-semibold uppercase tracking-[.14em] text-white">
                      {film.names}
                    </div>
                    <div className="mt-[5px] text-[10px] uppercase tracking-[.2em] text-white/50">
                      {film.label}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
