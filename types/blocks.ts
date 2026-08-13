/**
 * Blokgebaseerd paginamodel voor North & Oak.
 *
 * Elk bloktype bevat uitsluitend content die een redacteur mag wijzigen:
 * teksten, afbeeldingen, knoplabels met link, en lijsten daarvan. Kleur,
 * spacing, uitlijning, breedte en andere layout zitten vast in de
 * component-code, niet in dit model.
 */

/** Focuspunt binnen een Sanity-afbeelding, gebruikt om bijsnedes te sturen. */
export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x: number;
  y: number;
  height: number;
  width: number;
};

/** Handmatige bijsnijding van een Sanity-afbeelding. */
export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top: number;
  bottom: number;
  left: number;
  right: number;
};

/**
 * Sanity-afbeelding met verplichte alt-tekst.
 *
 * Ondersteunt tijdelijk twee vormen: een echte Sanity asset-referentie
 * (met optionele hotspot/crop, aanwezig zodra een redactor die instelt —
 * elk schemaveld heeft `options: {hotspot: true}` staan), of een simpele
 * `url` (het pad uit _reference/) voor lib/mock-data.ts, zolang niet elke
 * pagina nog op Sanity is aangesloten (Fase 4/5 van BOUWPLAN.md). Zodra
 * alle content uit Sanity komt vervalt de url-vorm.
 */
export type SanityImage = {
  _type: "image";
  alt: string;
} & (
  | {
      asset: { _type: "reference"; _ref: string };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
    }
  | { url: string }
);

/** Knop of tekstlink met label en bestemming. */
export type CtaLink = {
  label: string;
  href: string;
};

/**
 * Toegestane iconen, afgeleid uit de SVG's die daadwerkelijk voorkomen in
 * trustBar, benefits, process en de contactForm-perks in de vier
 * referentiebestanden. Een redacteur kiest hieruit, en kan geen eigen
 * beeld als icoon uploaden.
 */
export type IconName =
  | "camera"
  | "video"
  | "globe"
  | "star"
  | "eye"
  | "heart"
  | "sun"
  | "photo"
  | "gallery"
  | "chat"
  | "document"
  | "calendar"
  | "calendar-check"
  | "clock"
  | "play";

/** Sanity-slug, gebruikt voor de URL van een pagina. */
export type Slug = {
  _type: "slug";
  current: string;
};

/** SEO-metadata van een pagina. */
export type Seo = {
  title: string;
  description: string;
  ogImage?: SanityImage;
};

/**
 * Welke pagina dit blok-exemplaar visueel volgt. Geen contentveld — puur
 * een sleutel naar een vast, in code vastgelegd preset (hoogte, foto-
 * uitsnede, koplettergrootte, overlay-gradients, ...) omdat de referentie
 * Hero en FinalCta op elk van de vier pagina's een eigen exacte vormgeving
 * geeft. Gedeeld door HeroBlock en FinalCtaBlock zodat beide dezelfde vier
 * waarden gebruiken in plaats van elk hun eigen unie te herhalen.
 */
export type PagePreset = "home" | "over-mij" | "fotografie" | "contact";

/**
 * Grote openingssectie met achtergrondbeeld, titel en één of twee knoppen.
 * Komt voor op: home, over mij, fotografie, contact.
 */
export type HeroBlock = {
  _type: "hero";
  eyebrow?: string;
  heading: string;
  /**
   * Tweede kopregel. De referentie breekt de titel in alle vier hero's
   * bewust in exact twee regels (twee losse <span>'s). Een vast tweede
   * veld dekt dat precies en geeft de redacteur twee simpele tekstvelden
   * in plaats van een ongebonden lijst van regels die meer breekpunten
   * zou toestaan dan het ontwerp ooit gebruikt.
   */
  headingLine2?: string;
  subheading?: string;
  image: SanityImage;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  /**
   * Bepaalt in Hero.tsx niet alleen de hoogte maar ook de foto-uitsnede
   * (object-position), de koplettergrootte/regelhoogte (alleen home is
   * hoofdletters + extra letterspacing) en de drie overlay-gradients
   * (mobiel, desktop, en de vaste vignetlaag) — de referentie geeft elk
   * van de vier pagina's hierin een eigen exacte waarde, dus geen
   * gemiddelden meer zoals in een eerdere versie van dit veld.
   */
  size: PagePreset;
  /** Bewuste bouncing pijl onderin de hero. Alleen aan op home. */
  showScrollIndicator?: boolean;
};

/** Eén item in de vertrouwensbalk (bijv. "500+ / Bruiloften vastgelegd"). */
export type TrustBarItem = {
  title: string;
  text: string;
  icon: IconName;
};

/**
 * Balk met korte kernfeiten direct onder de hero.
 * Komt voor op: home.
 */
export type TrustBarBlock = {
  _type: "trustBar";
  items: TrustBarItem[];
};

/**
 * Introductietekst met een raster uitgelichte portfoliofoto's.
 * Komt voor op: home.
 */
export type PortfolioGridBlock = {
  _type: "portfolioGrid";
  eyebrow?: string;
  heading: string;
  cta?: CtaLink;
  images: SanityImage[];
};

/** Eén trouwfilm-kaart met thumbnail en link naar de film. */
export type FilmItem = {
  names: string;
  label: string;
  image: SanityImage;
  href: string;
};

/**
 * Sectie met uitgelichte trouwfilms.
 * Komt voor op: home.
 */
export type FilmSectionBlock = {
  _type: "filmSection";
  eyebrow?: string;
  heading: string;
  cta?: CtaLink;
  films: FilmItem[];
};

/** Eén voordeel/waarde-item met titel en toelichting. */
export type BenefitItem = {
  title: string;
  text: string;
  icon: IconName;
};

/**
 * Lijst van voordelen of kernwaarden, optioneel met begeleidende tekst,
 * knop en/of beeld.
 * Komt voor op: home ("waarom ons"), over mij ("mijn aanpak"),
 * fotografie (introductie-voordelen).
 */
export type BenefitsBlock = {
  _type: "benefits";
  eyebrow?: string;
  heading?: string;
  text?: string;
  cta?: CtaLink;
  items: BenefitItem[];
  image?: SanityImage;
};

/** Eén review van een bruidspaar. */
export type ReviewItem = {
  quote: string;
  name: string;
  avatar: SanityImage;
};

/**
 * Raster met reviews van bruidsparen.
 * Komt voor op: home, over mij.
 */
export type ReviewsBlock = {
  _type: "reviews";
  eyebrow?: string;
  heading?: string;
  reviews: ReviewItem[];
  cta?: CtaLink;
};

/**
 * Eén stap in een werkwijze. Heeft óf een icoon (home, over mij) óf een
 * eigen foto (fotografie, met een doorlopend nummer erover dat in code
 * wordt afgeleid uit de positie in de lijst — geen apart veld nodig).
 */
export type ProcessStep = {
  title: string;
  text: string;
  icon?: IconName;
  image?: SanityImage;
};

/**
 * Stapsgewijze uitleg van de werkwijze, optioneel met achtergrondbeeld.
 * Komt voor op: home ("werkwijze"), over mij ("zo werk ik"),
 * fotografie ("mijn aanpak").
 */
export type ProcessBlock = {
  _type: "process";
  eyebrow?: string;
  heading?: string;
  text?: string;
  cta?: CtaLink;
  backgroundImage?: SanityImage;
  steps: ProcessStep[];
};

/**
 * Strip met Instagram-achtige foto's en link naar het profiel.
 * Komt voor op: home.
 */
export type InstagramStripBlock = {
  _type: "instagramStrip";
  eyebrow?: string;
  heading: string;
  cta?: CtaLink;
  images: SanityImage[];
};

/** Eén statistiek, bijv. "500+" met label "Bruiloften vastgelegd". */
export type StatItem = {
  value: string;
  label: string;
};

/**
 * Cijfers/kengetallen met begeleidende tekst en knop.
 * Komt voor op: over mij ("ervaring").
 */
export type StatsBlock = {
  _type: "stats";
  eyebrow?: string;
  heading?: string;
  text?: string;
  cta?: CtaLink;
  items: StatItem[];
};

/**
 * Uitgelichte quote met bronvermelding.
 * Komt voor op: over mij.
 */
export type QuoteBlock = {
  _type: "quote";
  quote: string;
  attribution?: string;
};

/** Eén reportage: hoofdfoto, verhaal en een kleine fotogalerij. */
export type ReportageItem = {
  names: string;
  location: string;
  text: string;
  mainImage: SanityImage;
  gallery: SanityImage[];
  cta?: CtaLink;
};

/**
 * Lijst van uitgelichte trouwreportages.
 * Komt voor op: fotografie.
 */
export type ReportageListBlock = {
  _type: "reportageList";
  eyebrow?: string;
  heading?: string;
  cta?: CtaLink;
  reportages: ReportageItem[];
};

/** Eén vraag-antwoordpaar. */
export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Uitklapbare lijst met veelgestelde vragen.
 * Komt voor op: over mij, contact.
 */
export type FaqBlock = {
  _type: "faq";
  eyebrow?: string;
  heading?: string;
  items: FaqItem[];
};

/** Eén voordeel getoond naast het contactformulier (bijv. "Snelle reactie"). */
export type ContactFormPerk = {
  title: string;
  text: string;
  icon: IconName;
};

/**
 * Contactsectie met introtekst, indieningsknoplabel, voordelen,
 * directe contactgegevens en de succesmelding na verzending. De
 * formuliervelden zelf (labels, placeholders, select-opties,
 * validatiemeldingen) zijn vast in code.
 * Komt voor op: contact.
 */
export type ContactFormBlock = {
  _type: "contactForm";
  eyebrow?: string;
  heading: string;
  intro?: string;
  submitLabel?: string;
  perks?: ContactFormPerk[];
  directHeading?: string;
  phone?: string;
  email?: string;
  location?: string;
  successHeading: string;
  successText: string;
  successCta?: CtaLink;
};

/**
 * Afsluitende call-to-action met achtergrondbeeld.
 * Komt voor op: home, over mij, fotografie, contact.
 */
export type FinalCtaBlock = {
  _type: "finalCta";
  heading: string;
  text?: string;
  image: SanityImage;
  cta: CtaLink;
  /**
   * Bepaalt in FinalCta.tsx de hoogte, de koplettergrootte/max-breedte en
   * de foto-uitsnede (object-position, bij fotografie/contact ook apart
   * voor mobiel) — elk van de vier pagina's heeft hierin een eigen exacte
   * referentiewaarde. Zie FinalCta.tsx voor de precieze waarden per preset.
   */
  size: PagePreset;
};

/**
 * Persoonlijke introductie met meerdere alinea's, handtekening en
 * een kleine fotogalerij.
 * Komt voor op: over mij ("wie ik ben").
 */
export type StoryIntroBlock = {
  _type: "storyIntro";
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  signatureName?: string;
  signatureRole?: string;
  images: SanityImage[];
};

/** Unie van alle bloktypes die op een pagina kunnen voorkomen. */
export type Block =
  | HeroBlock
  | TrustBarBlock
  | PortfolioGridBlock
  | FilmSectionBlock
  | BenefitsBlock
  | ReviewsBlock
  | ProcessBlock
  | InstagramStripBlock
  | StatsBlock
  | QuoteBlock
  | ReportageListBlock
  | FaqBlock
  | ContactFormBlock
  | FinalCtaBlock
  | StoryIntroBlock;

/** Eén pagina, opgebouwd uit een geordende lijst blokken. */
export type Page = {
  title: string;
  slug: Slug;
  seo: Seo;
  sections: Block[];
};

/* ==========================================================================
   Site-brede content — hoort niet bij één pagina, dus niet bij Page.sections.
   Header, footer en bedrijfsgegevens zijn op alle vier pagina's identiek.
   ========================================================================== */

/** Link met label en bestemming, gebruikt in navigatie- en linklijsten. */
export type NavLink = {
  label: string;
  href: string;
};

/** Link naar een social-mediaprofiel. */
export type SocialLink = {
  platform: string;
  href: string;
};

/**
 * Bedrijfsgegevens. Voeden zowel de footer/contactkaart als de
 * LocalBusiness JSON-LD structured data op de pagina's.
 */
export type BusinessInfo = {
  phone: string;
  email: string;
  city: string;
  region: string;
  country: string;
};

/** Site-brede content: logo, hoofdnavigatie, footer en bedrijfsgegevens. */
export type SiteSettings = {
  logoName: string;
  logoSubline: string;
  mainNav: NavLink[];
  headerCta: CtaLink;
  footer: {
    aboutText: string;
    socials: SocialLink[];
    navLinks: NavLink[];
    popularPages: NavLink[];
    legalLinks: NavLink[];
  };
  business: BusinessInfo;
};
