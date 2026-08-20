import { cache } from "react";
import { groq } from "next-sanity";
import type { Page, SiteSettings, Wedding, WeddingCard } from "@/types/blocks";
import { client } from "./client";

/**
 * GROQ-projecties die stuk voor stuk de vorm van types/blocks.ts volgen,
 * zodat elk veld traceerbaar is naar zijn TypeScript-tegenhanger. Geen
 * kale `...`-spread: expliciet opsommen maakt zichtbaar welk veld bij
 * welk bloktype hoort en voorkomt dat een toekomstige schemawijziging
 * stilzwijgend meegaat in de queryresultaten.
 */

/**
 * Projectie voor een SanityImage. Bevat bewust de rauwe asset-referentie
 * (geen `asset->` dereference) plus hotspot/crop, zodat lib/sanity/image.ts
 * de uiteindelijke URL kan opbouwen met respect voor een ingestelde
 * hotspot.
 */
const image = groq`{
  _type,
  alt,
  asset,
  hotspot,
  crop
}`;

const sectionsProjection = groq`
  _type == "hero" => {
    _type,
    eyebrow,
    heading,
    headingLine2,
    subheading,
    image${image},
    primaryCta,
    secondaryCta,
    size,
    showScrollIndicator
  },
  _type == "trustBar" => {
    _type,
    items[]{
      title,
      text,
      icon
    }
  },
  _type == "portfolioGrid" => {
    _type,
    eyebrow,
    heading,
    cta,
    images[]${image}
  },
  _type == "filmSection" => {
    _type,
    eyebrow,
    heading,
    cta,
    films[]{
      names,
      label,
      image${image},
      href
    }
  },
  _type == "benefits" => {
    _type,
    eyebrow,
    heading,
    text,
    cta,
    items[]{
      title,
      text,
      icon
    },
    image${image}
  },
  _type == "reviews" => {
    _type,
    eyebrow,
    heading,
    reviews[]{
      quote,
      name,
      avatar${image}
    },
    cta
  },
  _type == "process" => {
    _type,
    eyebrow,
    heading,
    text,
    cta,
    backgroundImage${image},
    steps[]{
      title,
      text,
      icon,
      image${image}
    }
  },
  _type == "instagramStrip" => {
    _type,
    eyebrow,
    heading,
    cta,
    images[]${image}
  },
  _type == "stats" => {
    _type,
    eyebrow,
    heading,
    text,
    cta,
    items[]{
      value,
      label
    }
  },
  _type == "quote" => {
    _type,
    quote,
    attribution
  },
  _type == "reportageList" => {
    _type,
    eyebrow,
    heading,
    cta,
    reportages[]{
      names,
      location,
      text,
      mainImage${image},
      gallery[]${image},
      cta
    }
  },
  _type == "faq" => {
    _type,
    eyebrow,
    heading,
    items[]{
      question,
      answer
    }
  },
  _type == "contactForm" => {
    _type,
    eyebrow,
    heading,
    intro,
    submitLabel,
    perks[]{
      title,
      text,
      icon
    },
    directHeading,
    phone,
    email,
    location,
    successHeading,
    successText,
    successCta
  },
  _type == "finalCta" => {
    _type,
    heading,
    text,
    image${image},
    cta,
    size
  },
  _type == "storyIntro" => {
    _type,
    eyebrow,
    heading,
    paragraphs,
    signatureName,
    signatureRole,
    images[]${image}
  },
  _type == "pricing" => {
    _type,
    eyebrow,
    heading,
    items[]{
      name,
      description,
      startingPrice,
      features,
      cta
    }
  }
`;

/**
 * Eén pagina op slug. Filtert expliciet concepten (drafts) eruit, ook al
 * heeft de Next-app geen token en dus toch al geen toegang tot concepten —
 * dit maakt de bedoeling in de query zelf zichtbaar en houdt de query
 * correct als er ooit wel met een token gebouwd wordt.
 */
export const PAGE_BY_SLUG_QUERY = groq`
  *[
    _type == "page" &&
    slug.current == $slug &&
    !(_id in path("drafts.**"))
  ][0]{
    title,
    slug,
    seo{
      title,
      description,
      ogImage${image}
    },
    sections[]{
      ${sectionsProjection}
    }
  }
`;

/** Site-brede instellingen (header, footer, bedrijfsgegevens). Singleton. */
export const SITE_SETTINGS_QUERY = groq`
  *[
    _type == "siteSettings" &&
    !(_id in path("drafts.**"))
  ][0]{
    logoName,
    logoSubline,
    mainNav,
    headerCta,
    footer{
      aboutText,
      socials,
      navLinks,
      legalLinks
    },
    business
  }
`;

/**
 * Voor de "featured weddings"-sectie op de homepage — kaartweergave, dus
 * alleen de velden die die kaart nodig heeft (zie WeddingCard). Geen limiet
 * op het aantal: `featured` is een bewuste keuze per document in Studio, de
 * component zelf begrenst hoeveel er getoond worden.
 */
const FEATURED_WEDDINGS_QUERY = groq`
  *[
    _type == "wedding" &&
    featured == true &&
    !(_id in path("drafts.**"))
  ] | order(date desc){
    coupleNames,
    slug,
    venue,
    city,
    region,
    heroImage${image}
  }
`;

/**
 * Alle velden van storyBlocks (Fase 4) — hetzelfde per-_type-patroon als
 * sectionsProjection hierboven, om dezelfde reden: expliciet opsommen
 * i.p.v. `...` spreaden.
 */
const storyBlocksProjection = groq`
  _type == "storyImage" => {
    _type,
    _key,
    image${image},
    variant
  },
  _type == "storyImagePair" => {
    _type,
    _key,
    images[]${image},
    layout
  },
  _type == "storyText" => {
    _type,
    _key,
    heading,
    text
  },
  _type == "storyQuote" => {
    _type,
    _key,
    quote,
    attribution
  },
  _type == "storySpacer" => {
    _type,
    _key,
    size
  }
`;

/** Kaartweergave van een wedding — hetzelfde shape als FEATURED_WEDDINGS_QUERY, herbruikt voor relatedWeddings-dereferencing. */
const weddingCardProjection = groq`{
  coupleNames,
  slug,
  venue,
  city,
  region,
  heroImage${image}
}`;

/**
 * Eén volledige wedding voor de reportagedetailpagina (/verhalen/[slug]).
 * relatedWeddings wordt gedereferentieerd naar dezelfde kaartvorm als de
 * homepage gebruikt, zodat NextStory geen aparte lookup nodig heeft.
 */
export const WEDDING_BY_SLUG_QUERY = groq`
  *[
    _type == "wedding" &&
    slug.current == $slug &&
    !(_id in path("drafts.**"))
  ][0]{
    coupleNames,
    slug,
    date,
    _createdAt,
    _updatedAt,
    venue,
    city,
    region,
    country,
    intro,
    heroImage${image},
    gallery[]${image},
    storyBlocks[]{
      ${storyBlocksProjection}
    },
    filmUrl,
    venueContext,
    testimonial,
    suppliers,
    featured,
    "relatedWeddings": relatedWeddings[]->${weddingCardProjection},
    seo{
      title,
      description,
      ogImage${image}
    }
  }
`;

/** Voor generateStaticParams: elke gepubliceerde wedding-slug, voor de volledige statische export. */
const ALL_WEDDING_SLUGS_QUERY = groq`
  *[
    _type == "wedding" &&
    defined(slug.current) &&
    !(_id in path("drafts.**"))
  ]{
    "slug": slug.current
  }
`;

/**
 * Lichte kaartweergave van alle weddings, op een vaste, voorspelbare
 * volgorde — gebruikt door zowel /verhalen (overzicht) als de "volgende
 * reportage"-fallback op de detailpagina (zie lib/wedding/nextWedding.ts).
 * coalesce(date, _createdAt): date is optioneel en bij alle 4 huidige
 * weddings nog leeg, zonder fallback zou de volgorde dan willekeurig zijn.
 */
const ALL_WEDDINGS_QUERY = groq`
  *[
    _type == "wedding" &&
    !(_id in path("drafts.**"))
  ] | order(coalesce(date, _createdAt) desc)${weddingCardProjection}
`;

/**
 * Alleen slug + laatste wijzigingsdatum, voor app/sitemap.ts. Een aparte,
 * lichte query i.p.v. dit veld aan PAGE_BY_SLUG_QUERY toevoegen: geen
 * enkele pagina zelf heeft _updatedAt nodig, alleen de sitemap.
 */
const ALL_PAGE_SLUGS_QUERY = groq`
  *[
    _type == "page" &&
    !(_id in path("drafts.**"))
  ]{
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
`;

export type PageSlugEntry = {
  slug: string;
  updatedAt: string;
};

/**
 * `cache()` dedupliceert binnen één render/build-pass: generateMetadata
 * en de paginacomponent roepen dezelfde functie voor dezelfde slug aan,
 * en de GROQ-query is te groot om als GET te gaan (dus geen automatische
 * fetch-deduplicatie van Next zelf) — zonder deze wrapper zou dat een
 * dubbele netwerkaanvraag per pagina betekenen.
 */
export const getPageBySlug = cache(async (slug: string): Promise<Page | null> => {
  const page = await client.fetch<Page | null>(PAGE_BY_SLUG_QUERY, { slug });
  return page ?? null;
});

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const settings = await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY);
  return settings ?? null;
});

export const getAllPageSlugs = cache(async (): Promise<PageSlugEntry[]> => {
  return client.fetch<PageSlugEntry[]>(ALL_PAGE_SLUGS_QUERY);
});

export const getFeaturedWeddings = cache(async (): Promise<WeddingCard[]> => {
  return client.fetch<WeddingCard[]>(FEATURED_WEDDINGS_QUERY);
});

export type WeddingSlugEntry = {
  slug: string;
};

export const getWeddingBySlug = cache(async (slug: string): Promise<Wedding | null> => {
  const wedding = await client.fetch<Wedding | null>(WEDDING_BY_SLUG_QUERY, { slug });
  return wedding ?? null;
});

export const getAllWeddingSlugs = cache(async (): Promise<WeddingSlugEntry[]> => {
  return client.fetch<WeddingSlugEntry[]>(ALL_WEDDING_SLUGS_QUERY);
});

export const getAllWeddings = cache(async (): Promise<WeddingCard[]> => {
  return client.fetch<WeddingCard[]>(ALL_WEDDINGS_QUERY);
});
