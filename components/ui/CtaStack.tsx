import type { ReactNode } from "react";

type CtaStackProps = {
  heading: ReactNode;
  text?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/**
 * Sectie 15 (Fase 5): de vaste hiërarchie voor elke hero/CTA-compositie —
 * kop → duidelijke ademruimte → ondersteunende tekst → duidelijke
 * ademruimte → CTA('s). Twee geneste flex-groepen met `gap` (niet
 * child-margins): de afstand blijft zo altijd correct, ook wanneer
 * `text` of `actions` ontbreekt (geen margin-collapsing, geen losse
 * "laatste-kind-heeft-geen-margin"-uitzonderingen nodig). Gebruikt door
 * Hero.tsx, FinalCta.tsx en WeddingCta.tsx — zie app/globals.css voor de
 * --space-stack-*-tokens.
 */
export default function CtaStack({ heading, text, actions, className }: CtaStackProps) {
  return (
    <div className={`flex flex-col gap-[var(--space-stack-actions)]${className ? ` ${className}` : ""}`}>
      <div className="flex flex-col gap-[var(--space-stack-heading)]">
        {heading}
        {text}
      </div>
      {actions}
    </div>
  );
}
