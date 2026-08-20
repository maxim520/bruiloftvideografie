import type { SanityImage, SiteSettings, Wedding } from "@/types/blocks";
import { SITE_URL } from "@/lib/site";
import { urlFor, isSanityAssetImage } from "@/lib/sanity/image";

/**
 * Zet Nederlandse notatie ("06 12 34 56 78") om naar E.164 ("+31612345678")
 * voor schema.org's telephone-veld, dat machineleesbare notatie verwacht.
 * Puur een formaat-omzetting voor de JSON-LD-output — de waarde zelf komt
 * onveranderd uit Sanity (businessInfo.phone).
 */
function toE164(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("0")) return `+31${digits.slice(1)}`;
  return digits;
}

/**
 * Organization + LocalBusiness + ProfessionalService als één entiteit,
 * zoals _reference/fotografie.html en _reference/contact.html al deden
 * met ["LocalBusiness","ProfessionalService"] — hier uitgebreid met
 * "Organization" omdat schema.org meerdere @type-waarden op één entiteit
 * toestaat en dat precies is wat gevraagd is. Volledig gevoed uit
 * siteSettings.business (Sanity), niets hardcoded op de plek waar het om
 * de bedrijfsgegevens zelf gaat.
 */
export function buildLocalBusinessJsonLd(siteSettings: SiteSettings): object {
  const { business, logoName, footer } = siteSettings;

  const sameAs = footer.socials
    .map((social) => social.href)
    .filter((href) => /^https?:\/\//.test(href));

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#business`,
    name: logoName,
    url: SITE_URL,
    description: footer.aboutText,
    telephone: toE164(business.phone),
    email: business.email,
    // priceRange is optioneel in schema.org en beïnvloedt hoe Google de
    // prijsindicatie toont in zoekresultaten — dus alleen invullen zodra
    // er een bewuste, door de klant bevestigde positionering achter zit.
    // Weglaten kost geen SEO-waarde.
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    areaServed: ["Nederland", "Europa"],
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * Sectie 31 (Fase 6): Person-structured data voor Jeroen op /over-mij —
 * uitsluitend velden die daadwerkelijk uit Sanity komen (storyIntro's
 * naam/rol/foto, al live content, niets nieuw verzonnen). Geen `sameAs`:
 * er zijn geen echte social-URL's in siteSettings.footer.socials (leeg
 * sinds Fase 2) — die verzin ik dus niet bij.
 */
export function buildPersonJsonLd(params: {
  name: string;
  jobTitle?: string;
  image?: SanityImage;
  worksForName: string;
}): object {
  const { name, jobTitle, image, worksForName } = params;
  const imageUrl =
    image && isSanityAssetImage(image)
      ? urlFor(image).width(800).height(1000).fit("crop").auto("format").quality(78).url()
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${SITE_URL}/over-mij`,
    ...(jobTitle && { jobTitle }),
    ...(imageUrl && { image: imageUrl }),
    worksFor: {
      "@type": "Organization",
      name: worksForName,
      url: SITE_URL,
    },
  };
}

export type BreadcrumbEntry = {
  name: string;
  path: string;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbEntry[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * Sectie 17 (Fase 4): Article voor een wedding-reportagepagina — echte
 * editorial content (foto's + verhaal), geen productpagina of blogpost.
 * datePublished/dateModified komen uit Sanity's eigen _createdAt/
 * _updatedAt: er is geen apart "gepubliceerd op"-veld in het schema, en
 * dit zijn de enige daadwerkelijk beschikbare tijdstempels — geen
 * verzonnen datum.
 */
export function buildWeddingArticleJsonLd(wedding: Wedding, siteSettings: SiteSettings): object {
  const url = `${SITE_URL}/verhalen/${wedding.slug.current}/`;
  const image =
    isSanityAssetImage(wedding.heroImage) &&
    urlFor(wedding.heroImage).width(1200).height(800).fit("crop").auto("format").quality(78).url();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: wedding.seo.title,
    description: wedding.seo.description,
    url,
    datePublished: wedding._createdAt,
    dateModified: wedding._updatedAt,
    ...(image && { image: [image] }),
    author: {
      "@type": "Organization",
      name: siteSettings.logoName,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: siteSettings.logoName,
      url: SITE_URL,
    },
  };
}

/**
 * VideoObject, alleen wanneer wedding.filmUrl daadwerkelijk is ingevuld
 * (zie app/verhalen/[slug]/page.tsx — deze functie wordt niet aangeroepen
 * zonder film). uploadDate is dezelfde _createdAt-benadering als
 * hierboven: geen eigen "geüpload op"-datum bekend, _createdAt is de
 * meest eerlijke beschikbare waarde, niet verzonnen.
 */
export function buildWeddingVideoJsonLd(wedding: Wedding, filmUrl: string): object {
  const thumbnail =
    isSanityAssetImage(wedding.heroImage) &&
    urlFor(wedding.heroImage).width(1200).height(675).fit("crop").auto("format").quality(78).url();

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `Trouwfilm ${wedding.coupleNames}`,
    description: wedding.seo.description,
    uploadDate: wedding._createdAt,
    embedUrl: filmUrl,
    ...(thumbnail && { thumbnailUrl: [thumbnail] }),
  };
}
