import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "dark-outline" | "text-link";
type ButtonSize = "default" | "sm";

type ButtonCommonProps = {
  variant: ButtonVariant;
  size?: ButtonSize;
  /** Alleen relevant voor variant="text-link": staat het blok op een donkere sectie-achtergrond? */
  onDark?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

type ButtonAsLink = ButtonCommonProps & {
  href: string;
  type?: never;
  disabled?: never;
};

type ButtonAsButton = ButtonCommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
};

export type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Correctieronde: knoppen oogden te zwaar/template-achtig — font-semibold
 * + 0.14em tracking + text-xs in hoofdletters las als een generieke
 * marketing-CTA i.p.v. een verfijnde editorial knop. font-medium en
 * duidelijk minder tracking geven de tekst rust; text-caption (13px, een
 * bestaand token) is een fractie groter dan de vorige 12px maar leest
 * rustiger bij minder tracking, i.p.v. drukker.
 */
const base =
  "inline-flex items-center whitespace-nowrap text-caption font-medium uppercase tracking-[.08em] transition-all duration-200";

/**
 * "default" blijft ruim boven het 44px-tikdoel (mobiel: alle default-
 * knoppen, incl. het mobiele menu). "sm" is uitsluitend de header-CTA op
 * desktop (Header.tsx: `hidden lg:inline-flex`, nooit op mobiel getoond)
 * — mag dus bewust compacter, los van het tikdoel-vraagstuk: de header
 * moet luchtig ogen, niet even zwaar als de hero-CTA's.
 */
const filledSize: Record<ButtonSize, string> = {
  default: "min-h-12 px-6",
  sm: "min-h-10 px-4",
};

const variantClasses: Record<Exclude<ButtonVariant, "text-link">, string> = {
  primary:
    "justify-center gap-2 rounded-[8px] border border-copper bg-copper text-white hover:bg-copper-hover hover:border-copper-hover hover:-translate-y-px disabled:opacity-65 disabled:pointer-events-none",
  secondary:
    "justify-center gap-2 rounded-[8px] border border-white/60 bg-transparent text-white hover:bg-white/10 hover:border-white hover:-translate-y-px disabled:opacity-65 disabled:pointer-events-none",
  "dark-outline":
    "justify-center gap-2 rounded-[8px] border border-ink/70 bg-transparent text-ink hover:bg-ink hover:text-white hover:-translate-y-px disabled:opacity-65 disabled:pointer-events-none",
};

/**
 * text-link is 12px (text-xs) — te klein voor de 3:1-uitzondering voor
 * grote tekst, dus text-copper (3.9:1) volstaat hier niet (zie ook
 * SectionHeading.tsx). Zelfde onDark-mechanisme als daar: dit blok komt
 * ook op Process' donkere home-variant en FilmSection voor. De on-dark
 * kleuren zijn exact .on-dark .text-link / :hover uit _reference/home.html,
 * niet dezelfde als de eyebrow-kleur — de referentie maakt zelf al
 * onderscheid tussen de twee.
 */
function textLinkClasses(onDark?: boolean): string {
  if (onDark) {
    return "gap-2.5 border-0 border-b border-copper-link-on-dark/35 py-1.5 text-copper-link-on-dark hover:gap-3.5 hover:text-copper-link-hover-on-dark hover:border-copper-link-hover-on-dark";
  }
  return "gap-2.5 border-0 border-b border-copper/40 py-1.5 text-copper-text hover:gap-3.5 hover:text-copper-hover hover:border-copper-hover";
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-200"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Button(props: ButtonProps) {
  const { variant, size = "default", onDark, className, children, onClick } = props;

  const classes = [
    base,
    variant === "text-link" ? textLinkClasses(onDark) : variantClasses[variant],
    variant !== "text-link" ? filledSize[size] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const content =
    variant === "text-link" ? (
      <>
        {children}
        <ArrowIcon />
      </>
    ) : (
      children
    );

  // Redesign-regel (Fase 2, sectie 8/45): een placeholder-bestemming mag
  // nooit als klikbare link renderen ("misleidende klikinteractie") — dus
  // "#" en een lege string worden hier, centraal voor elke CTA die via
  // deze component loopt, een niet-klikbaar, zichtbaar inactief element
  // i.p.v. een <Link>. Content-zijde (Sanity) hoort dit sowieso te
  // vermijden zodra een echte bestemming bestaat; dit is de vangnet-laag.
  if ("href" in props && props.href && props.href !== "#") {
    return (
      <Link href={props.href} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  if ("href" in props) {
    return (
      <span
        aria-disabled="true"
        title="Binnenkort beschikbaar"
        className={`${classes} pointer-events-none opacity-45`}
      >
        {content}
      </span>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button
      type={buttonProps.type ?? "button"}
      disabled={buttonProps.disabled}
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  );
}
