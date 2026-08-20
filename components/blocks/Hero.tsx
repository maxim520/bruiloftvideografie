import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import type { HeroBlock, PagePreset } from "@/types/blocks";

type HeroProps = {
  block: HeroBlock;
};

/** Sectiehoogte, exact per pagina (geen gemiddelden). */
const sizeClasses: Record<PagePreset, string> = {
  home: "min-h-[760px] md:min-h-screen",
  "over-mij": "min-h-[640px] md:min-h-[86vh]",
  fotografie: "min-h-[700px] md:h-[88vh] md:min-h-[760px]",
  contact: "min-h-[680px] md:h-[82vh] md:min-h-[700px]",
};

/** Foto-uitsnede, mobiel/desktop, exact per pagina. */
const objectPositionClasses: Record<PagePreset, string> = {
  home: "object-[62%_22%] md:object-[65%_28%]",
  "over-mij": "object-[58%_22%] md:object-[62%_30%]",
  fotografie: "object-[58%_26%] md:object-[62%_32%]",
  contact: "object-[60%_26%] md:object-[64%_32%]",
};

/**
 * Koplettergrootte/regelhoogte per pagina. Alleen home is hoofdletters
 * met extra letterspacing; de andere drie zijn zinsvorm zoals getypt.
 */
const headingClasses: Record<PagePreset, string> = {
  home: "uppercase leading-[1.08] tracking-[.02em] text-[clamp(2.375rem,10.5vw,3rem)] md:text-[clamp(2.625rem,5.2vw,4.625rem)]",
  "over-mij":
    "leading-[1.14] text-[clamp(2.125rem,9vw,2.625rem)] md:text-[clamp(2.375rem,4.6vw,3.875rem)]",
  fotografie:
    "leading-[1.1] text-[clamp(2.375rem,11vw,3.125rem)] md:text-[clamp(2.75rem,5vw,4.5rem)]",
  contact:
    "leading-[1.12] text-[clamp(2.25rem,10vw,3rem)] md:text-[clamp(2.625rem,4.8vw,4.375rem)]",
};

/**
 * De drie overlay-lagen (mobiele en desktop-variant van de primaire
 * gradient, plus de vaste vignetlaag) verschillen per pagina in exacte
 * rgba-stops. Als inline style i.p.v. Tailwind-arbitrary-classes: de
 * waarden zijn te lang/specifiek om leesbaar in bracket-notatie te zetten,
 * en dit is dezelfde aanpak als de box-shadow in Process.tsx.
 */
const overlays: Record<PagePreset, { mobile: string; desktop: string; vignette: string }> = {
  home: {
    mobile:
      "linear-gradient(180deg,rgba(20,14,11,.55) 0%,rgba(20,14,11,.25) 34%,rgba(20,14,11,.82) 100%)",
    desktop:
      "linear-gradient(90deg,rgba(20,14,11,.78) 0%,rgba(20,14,11,.42) 48%,rgba(20,14,11,.18) 100%)",
    vignette:
      "linear-gradient(180deg,rgba(20,14,11,.5) 0%,rgba(20,14,11,0) 26%,rgba(20,14,11,0) 68%,rgba(20,14,11,.45) 100%)",
  },
  "over-mij": {
    mobile:
      "linear-gradient(180deg,rgba(20,14,11,.55) 0%,rgba(20,14,11,.28) 32%,rgba(20,14,11,.86) 100%)",
    desktop:
      "linear-gradient(90deg,rgba(20,14,11,.82) 0%,rgba(20,14,11,.46) 52%,rgba(20,14,11,.2) 100%)",
    vignette:
      "linear-gradient(180deg,rgba(20,14,11,.55) 0%,rgba(20,14,11,0) 28%,rgba(20,14,11,0) 66%,rgba(20,14,11,.45) 100%)",
  },
  fotografie: {
    mobile:
      "linear-gradient(180deg,rgba(20,14,11,.5) 0%,rgba(20,14,11,.24) 34%,rgba(20,14,11,.88) 100%)",
    desktop:
      "linear-gradient(90deg,rgba(20,14,11,.82) 0%,rgba(20,14,11,.48) 46%,rgba(20,14,11,.12) 100%)",
    vignette:
      "linear-gradient(180deg,rgba(20,14,11,.5) 0%,rgba(20,14,11,0) 26%,rgba(20,14,11,0) 70%,rgba(20,14,11,.4) 100%)",
  },
  contact: {
    mobile:
      "linear-gradient(180deg,rgba(20,14,11,.5) 0%,rgba(20,14,11,.26) 34%,rgba(20,14,11,.88) 100%)",
    desktop:
      "linear-gradient(90deg,rgba(20,14,11,.84) 0%,rgba(20,14,11,.5) 48%,rgba(20,14,11,.14) 100%)",
    vignette:
      "linear-gradient(180deg,rgba(20,14,11,.5) 0%,rgba(20,14,11,0) 26%,rgba(20,14,11,0) 70%,rgba(20,14,11,.4) 100%)",
  },
};

export default function Hero({ block }: HeroProps) {
  const {
    eyebrow,
    heading,
    headingLine2,
    subheading,
    image,
    primaryCta,
    secondaryCta,
    size,
    showScrollIndicator,
  } = block;

  // Zonder titel is er niets zinnigs om als hero te tonen.
  if (!heading) return null;

  const overlay = overlays[size];

  return (
    <section
      className={`relative flex items-end overflow-hidden bg-ink md:items-center ${sizeClasses[size]}`}
    >
      <div className="absolute inset-0">
        <SafeImage
          image={image}
          preload
          sizes="100vw"
          className={`object-cover ${objectPositionClasses[size]}`}
          // Eigen, per-pagina (en per-breakpoint) object-position; zie de
          // toelichting bij SafeImage's useHotspot-prop.
          useHotspot={false}
        />
      </div>

      <div aria-hidden="true" className="absolute inset-0 md:hidden" style={{ background: overlay.mobile }} />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: overlay.desktop }}
      />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: overlay.vignette }} />

      <Container className="relative z-[2] w-full pt-24 pb-28 md:pb-24">
        <Reveal className="max-w-[640px] text-white">
          {eyebrow && (
            <p className="mb-5 text-eyebrow font-semibold uppercase tracking-[.22em] text-[#c08f68]">
              {eyebrow}
            </p>
          )}
          <h1 className={`mb-[26px] font-medium ${headingClasses[size]}`}>
            <span className="block">{heading}</span>
            {headingLine2 && <span className="block">{headingLine2}</span>}
          </h1>
          {subheading && (
            <p className="mb-7 max-w-[31em] text-base text-white/[0.84] md:mb-[38px] md:text-body">
              {subheading}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-col flex-wrap gap-3.5 md:flex-row">
              {primaryCta && (
                <Button href={primaryCta.href} variant="primary" className="w-full md:w-auto">
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button href={secondaryCta.href} variant="secondary" className="w-full md:w-auto">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </Reveal>
      </Container>

      {showScrollIndicator && (
        <span
          aria-hidden="true"
          className="absolute bottom-[42px] left-1/2 z-[2] -ml-2.5 text-white/70 motion-safe:animate-bounce md:bottom-[34px]"
        >
          <svg
            width="20"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v16M6 14l6 6 6-6" />
          </svg>
        </span>
      )}
    </section>
  );
}
