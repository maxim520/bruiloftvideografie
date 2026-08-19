import type { SiteSettings } from "@/types/blocks";
import { SITE_URL } from "@/lib/site";

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
