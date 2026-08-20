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
  // Bewust een losse `gap-[var(--space-stack-actions)]`-string, NIET
  // direct achter een template-literal-interpolatie geplakt: Tailwind
  // scant de rauwe brontekst op class-tokens, en "gap-[...]${className"
  // (zonder spatie ertussen) werd niet als geldige, volledige class
  // herkend — er werd dus nooit een CSS-regel voor gegenereerd. Zichtbaar
  // bevestigd via computed styles (gap: normal i.p.v. de bedoelde 72px),
  // dít was de daadwerkelijke oorzaak van de te krappe hero/CTA-spacing,
  // niet de tokenwaarde zelf (die was al correct herijkt in Fase 7).
  const outerClassName = ["flex", "flex-col", "gap-[var(--space-stack-actions)]", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={outerClassName}>
      <div className="flex flex-col gap-[var(--space-stack-heading)]">
        {heading}
        {text}
      </div>
      {actions}
    </div>
  );
}
