import Container from "@/components/layout/Container";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import type { ProcessBlock } from "@/types/blocks";

type ProcessProps = {
  block: ProcessBlock;
};

function stepNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/**
 * Twee dimensies bepalen de weergave, zonder apart variantveld:
 * - `backgroundImage` gezet → donkere sectie met vervaagde achtergrondfoto
 *   en pijlen tussen de stappen (home); niet gezet → lichte sectie met een
 *   gestippelde doorlopende lijn door gevulde cirkels (over mij).
 * - een stap heeft `image` → kaart met foto en rond nummerbadge, geen
 *   verbindingslijn (fotografie); geen `image` → icoon-in-cirkel, in een
 *   van de twee lijnstijlen hierboven (home of over mij).
 *
 * De twee icoon-stappen-instanties in de referentie verschillen precies
 * langs deze as: home heeft een achtergrondfoto en gebruikt pijlen, over
 * mij heeft er geen en gebruikt de gestippelde lijn. `isDark` (afgeleid
 * van `backgroundImage`) dient dus voor beide beslissingen tegelijk —
 * er is geen apart layoutveld nodig omdat er geen derde combinatie
 * bestaat om mis te gaan.
 */
export default function Process({ block }: ProcessProps) {
  const { eyebrow, heading, text, cta, backgroundImage, steps } = block;
  const isDark = Boolean(backgroundImage);
  const usesPhotos = steps.some((step) => step.image);

  if (steps.length === 0) return null;

  return (
    <section
      className={`relative overflow-hidden py-[68px] md:py-20 lg:py-[112px] ${
        isDark ? "bg-brown-dark text-background" : "bg-surface-light text-text"
      }`}
    >
      {backgroundImage && (
        <div className="absolute inset-0 opacity-[0.14]" aria-hidden="true">
          <SafeImage image={backgroundImage} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(36,27,23,.9),rgba(36,27,23,.55))]" />
        </div>
      )}

      <Container className="relative z-[2]">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            heading={heading}
            text={text}
            cta={cta}
            onDark={isDark}
            className={`mb-9 lg:mb-14 [&_h2]:max-w-[14ch] [&_h2]:text-[clamp(1.875rem,3vw,2.625rem)] ${
              isDark ? "[&_h2]:text-white" : ""
            }`}
          />

          {usesPhotos ? (
            <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-6 md:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-[22px] lg:overflow-visible lg:px-0 lg:pb-0">
              {steps.map((step, index) => (
                <article key={index} className="w-[85%] flex-none snap-start md:w-[68%] lg:w-auto">
                  <div className="group relative mb-[30px] aspect-[4/3] overflow-hidden rounded-md bg-border">
                    <SafeImage
                      image={step.image}
                      sizes="(min-width: 1024px) 23vw, 68vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                    />
                    <span className="absolute -bottom-[18px] left-[14px] z-[2] flex h-9 w-9 items-center justify-center rounded-full border border-copper bg-surface text-[11px] font-semibold tracking-[.08em] text-copper-text">
                      {stepNumber(index)}
                    </span>
                  </div>
                  <h3 className="mb-2.5 font-body text-[15px] font-semibold">{step.title}</h3>
                  <p className="max-w-[24ch] text-[13.5px] leading-[1.7] text-text-muted">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          ) : isDark ? (
            <>
              {/* Home, mobiel/tablet: verticale tijdlijn met dunne lijn */}
              <div className="lg:hidden">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="relative grid grid-cols-[52px_1fr] gap-x-5 pb-[34px] last:pb-0"
                  >
                    {index !== steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-[26px] top-[52px] w-px bg-white/[0.16]"
                      />
                    )}
                    <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/[0.28] text-[#d6a67e]">
                      {step.icon && <Icon name={step.icon} size={22} />}
                    </span>
                    <div className="col-start-2 mt-1 text-[11px] tracking-[.2em] text-copper-text-on-dark">
                      {stepNumber(index)}.
                    </div>
                    <div className="col-start-2">
                      <h3 className="mb-2 text-[21px] text-white">{step.title}</h3>
                      <p className="text-[13.5px] leading-[1.6] text-background/[0.62]">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Home, desktop: horizontale rij met pijlen ertussen */}
              <div className="hidden items-start gap-[22px] lg:flex">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-1 items-start gap-[22px]">
                    <div className="flex-1">
                      <span className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/[0.28] text-[#d6a67e]">
                        {step.icon && <Icon name={step.icon} size={22} />}
                      </span>
                      <div className="mb-1.5 text-[11px] tracking-[.2em] text-copper-text-on-dark">
                        {stepNumber(index)}.
                      </div>
                      <h3 className="mb-2 text-[21px] text-white">{step.title}</h3>
                      <p className="max-w-[24ch] text-[13.5px] leading-[1.6] text-background/[0.62]">
                        {step.text}
                      </p>
                    </div>
                    {index !== steps.length - 1 && (
                      <span aria-hidden="true" className="mt-[14px] shrink-0 text-white/25">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 12h15M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Over mij, mobiel/tablet: verticale tijdlijn, gestippeld, gevulde cirkel */}
              <div className="lg:hidden">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="relative grid grid-cols-[54px_1fr] gap-x-[22px] pb-[34px] last:pb-0"
                  >
                    {index !== steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-[26px] top-[54px] border-l border-dashed border-border"
                      />
                    )}
                    <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-brown text-[#e2c3a9]">
                      {step.icon && <Icon name={step.icon} size={22} />}
                    </span>
                    <div className="col-start-2 mt-[5px] text-[11px] tracking-[.2em] text-copper-text">
                      {stepNumber(index)}.
                    </div>
                    <div className="col-start-2">
                      <h3 className="mb-2.5 text-[19px] text-text">{step.title}</h3>
                      <p className="text-[13.5px] leading-[1.7] text-text-muted">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Over mij, desktop: doorlopende gestippelde lijn achter gevulde cirkels */}
              <div className="relative hidden lg:grid lg:grid-cols-4 lg:gap-[26px] lg:pt-1.5">
                <span
                  aria-hidden="true"
                  className="absolute left-[8%] right-[8%] top-[27px] border-t border-dashed border-border"
                />
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    <span
                      className="relative z-[2] mb-6 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-brown text-[#e2c3a9]"
                      style={{ boxShadow: "0 0 0 6px var(--surface-light)" }}
                    >
                      {step.icon && <Icon name={step.icon} size={22} />}
                    </span>
                    <div className="mb-[5px] text-[11px] tracking-[.2em] text-copper-text">
                      {stepNumber(index)}.
                    </div>
                    <h3 className="mb-2.5 text-[19px] text-text">{step.title}</h3>
                    <p className="max-w-[24ch] text-[13.5px] leading-[1.7] text-text-muted">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
