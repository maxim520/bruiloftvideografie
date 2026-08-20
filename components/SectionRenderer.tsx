import type { ComponentType } from "react";
import Hero from "./blocks/Hero";
import TrustBar from "./blocks/TrustBar";
import PortfolioGrid from "./blocks/PortfolioGrid";
import FilmSection from "./blocks/FilmSection";
import Benefits from "./blocks/Benefits";
import Reviews from "./blocks/Reviews";
import Process from "./blocks/Process";
import InstagramStrip from "./blocks/InstagramStrip";
import Stats from "./blocks/Stats";
import Quote from "./blocks/Quote";
import ReportageList from "./blocks/ReportageList";
import Faq from "./blocks/Faq";
import ContactForm from "./blocks/ContactForm";
import FinalCta from "./blocks/FinalCta";
import StoryIntro from "./blocks/StoryIntro";
import Pricing from "./blocks/Pricing";
import PersonalIntro from "./blocks/PersonalIntro";
import type { Block } from "@/types/blocks";

/**
 * Eén component per bloktype. `satisfies` dwingt af dat elke `_type` uit
 * de Block-unie een renderer heeft die minstens `{ block: <dat bloktype> }`
 * accepteert — mist er één, dan geeft dit een compile-fout. Componenten
 * met extra, optionele props (zoals Faq) blijven toegestaan, want die
 * extra props zijn niet verplicht.
 */
const registry = {
  hero: Hero,
  trustBar: TrustBar,
  portfolioGrid: PortfolioGrid,
  filmSection: FilmSection,
  benefits: Benefits,
  reviews: Reviews,
  process: Process,
  instagramStrip: InstagramStrip,
  stats: Stats,
  quote: Quote,
  reportageList: ReportageList,
  faq: Faq,
  contactForm: ContactForm,
  finalCta: FinalCta,
  storyIntro: StoryIntro,
  pricing: Pricing,
  personalIntro: PersonalIntro,
} satisfies {
  [K in Block["_type"]]: ComponentType<{ block: Extract<Block, { _type: K }> }>;
};

/**
 * Extra, niet-content props per bloktype — een plaatsingskeuze van de
 * pagina die het blok neerzet, geen content. Faq's `columns`/`compact`
 * zijn hier het enige voorbeeld: over mij en contact hebben inhoudelijk
 * identiek gevormde FaqBlocks, dus er is geen veld in het datamodel dat
 * dit verschil kan dragen (zie de toelichting in components/blocks/Faq.tsx).
 * `overrides` is bewust een los, optioneel record naast `sections` in
 * plaats van een veld op Block, zodat types/blocks.ts schoon blijft.
 * Breidt vanzelf uit zodra een ander blok zulke props nodig heeft.
 */
type SectionOverrides = {
  faq?: Omit<Parameters<typeof Faq>[0], "block">;
};

type SectionRendererProps = {
  sections: Block[];
  overrides?: SectionOverrides;
};

export default function SectionRenderer({ sections, overrides }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const Component = registry[section._type] as
          | ComponentType<Record<string, unknown>>
          | undefined;

        if (!Component) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `SectionRenderer: onbekend bloktype "${section._type}", overgeslagen.`
            );
          }
          return null;
        }

        const extraProps = section._type === "faq" ? overrides?.faq : undefined;

        return <Component key={index} block={section} {...extraProps} />;
      })}
    </>
  );
}
