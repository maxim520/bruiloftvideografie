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

const base =
  "inline-flex items-center whitespace-nowrap text-xs font-semibold uppercase tracking-[.14em] transition-all duration-200";

/**
 * "sm" is 44px hoog, niet de 42px uit de referentie: een tikdoel onder
 * 44px is te klein op mobiel. Bewuste, kleine afwijking t.o.v. de
 * referentie voor toegankelijkheid.
 */
const filledSize: Record<ButtonSize, string> = {
  default: "min-h-12 px-[22px]",
  sm: "min-h-11 px-[18px] text-[11px]",
};

const variantClasses: Record<Exclude<ButtonVariant, "text-link">, string> = {
  primary:
    "justify-center gap-2.5 rounded-[10px] border border-copper bg-copper text-white hover:bg-copper-hover hover:border-copper-hover hover:-translate-y-px disabled:opacity-65 disabled:pointer-events-none",
  secondary:
    "justify-center gap-2.5 rounded-[10px] border border-white/70 bg-transparent text-white hover:bg-white/10 hover:border-white hover:-translate-y-px disabled:opacity-65 disabled:pointer-events-none",
  "dark-outline":
    "justify-center gap-2.5 rounded-[10px] border border-brown-dark bg-transparent text-brown-dark hover:bg-brown-dark hover:text-white hover:-translate-y-px disabled:opacity-65 disabled:pointer-events-none",
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

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} onClick={onClick} className={classes}>
        {content}
      </Link>
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
