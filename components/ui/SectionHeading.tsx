import Button from "./Button";
import type { CtaLink } from "@/types/blocks";

type SectionHeadingProps = {
  eyebrow?: string;
  heading?: string;
  text?: string;
  cta?: CtaLink;
  muted?: boolean;
  /** Zet als het blok op een donkere sectie-achtergrond staat (zie Process/FilmSection). */
  onDark?: boolean;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  heading,
  text,
  cta,
  muted,
  onDark,
  className,
}: SectionHeadingProps) {
  const hasHeadingArea = Boolean(eyebrow || heading);

  return (
    <div className={className}>
      {eyebrow && (
        <p
          className={`mb-5 text-[11px] font-semibold uppercase tracking-[.22em] ${
            muted ? "text-charcoal-muted" : onDark ? "text-copper-text-on-dark" : "text-copper-text"
          }`}
        >
          {eyebrow}
        </p>
      )}
      {heading && (
        <h2 className="text-[clamp(2rem,3.4vw,2.875rem)]">{heading}</h2>
      )}
      {text && (
        <p
          className={`max-w-[38ch] text-base leading-[1.85] ${
            onDark ? "text-background/[0.72]" : "text-text-muted"
          } ${hasHeadingArea ? "mt-5" : ""}`}
        >
          {text}
        </p>
      )}
      {cta && (
        <div className={hasHeadingArea || text ? "mt-6" : undefined}>
          <Button href={cta.href} variant="text-link" onDark={onDark}>
            {cta.label}
          </Button>
        </div>
      )}
    </div>
  );
}
