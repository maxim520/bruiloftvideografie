import type { Metadata } from "next";
import { preconnect } from "react-dom";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/sanity/queries";
import { buildLocalBusinessJsonLd } from "@/lib/structuredData";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/**
 * Twee losse font-oproepen i.p.v. één met weight:["400","500","600"],
 * style:["normal","italic"]:
 *
 * 1. next/font/google's `preload` is alles-of-niets per oproep (geen
 *    manier om "alleen deze ene weight" te preloaden — geverifieerd in
 *    de type declaratie, geen granulariteit voorbij een boolean) én
 *    empirisch getest dat de volgorde van het weight-array géén invloed
 *    heeft op wélk bestand preload krijgt (altijd de laagste weight,
 *    ongeacht array-volgorde). Eén gecombineerde oproep zou dus altijd
 *    400 preloaden — precies de weight die alleen in de Quote hieronder
 *    de vouw voorkomt — terwijl 500 (elke h1, boven de vouw op alle vier
 *    pagina's) niet zou preloaden.
 * 2. Eén gecombineerde oproep met weight×style als cross-product
 *    declareert ook 3 nooit-gebruikte combinaties (400-normaal,
 *    500-cursief, 600-cursief) — puur CSS-declaraties, geen download,
 *    maar wel overbodig.
 *
 * Twee losse oproepen lossen beide op: cormorantGaramond (500/600,
 * rechtop, preload aan — dekt elke hero-h1, het logo en Benefits' h3)
 * en cormorantGaramondQuote (400, cursief, preload uit — alleen de
 * Quote-pull-quote en StoryIntro's handtekening, allebei verderop op de
 * pagina). Precies 3 bestanden gedeclareerd, precies 3 gebruikt.
 */
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const cormorantGaramondQuote = Cormorant_Garamond({
  variable: "--font-display-quote",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
  preload: false,
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Zelfde domein als in de JSON-LD van _reference/fotografie.html en
  // _reference/contact.html — nodig zodat relatieve og:image-paden en
  // canonical-URL's tot absolute URL's herleid kunnen worden.
  metadataBase: new URL(SITE_URL),
  title: "Behind Every Wedding",
  description:
    "Tijdloze trouwfotografie en trouwfilms voor bruidsparen in heel Nederland en Europa.",
  // public/.htaccess zette dit (en meer) via een echte HTTP-header, maar
  // dat bestand wordt op deze nginx-hosting niet gelezen (.htaccess is
  // Apache-only) — vandaar via <meta name="referrer"> hier. Dit is de
  // enige van de geplande .htaccess-headers die via HTML hetzelfde effect
  // heeft: HSTS/X-Frame-Options/X-Content-Type-Options bestaan niet als
  // meta-variant, en CSP via <meta> ondersteunt geen Report-Only-modus —
  // die blind afdwingen zonder ooit getest te hebben is een té groot
  // risico (kan hydratatie/inline styles breken). Zie DEPLOY.md voor de
  // openstaande actie: navragen bij TransIP of aangepaste HTTP-headers
  // op deze nginx-hosting mogelijk zijn.
  referrer: "strict-origin-when-cross-origin",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const siteSettings = await getSiteSettings();

  // Header/footer kunnen niet zinnig renderen zonder dit singleton-document.
  // Faalt hard i.p.v. een lege header/footer stilletjes te tonen.
  if (!siteSettings) {
    throw new Error(
      "Site-instellingen niet gevonden in Sanity (document 'siteSettings' ontbreekt). " +
        "Draai npm run studio:seed, of maak het handmatig aan in de Studio.",
    );
  }

  // Elke pagina's LCP-kandidaat (Hero) komt van dit CDN-domein — de host
  // is vast per Sanity-project, dus dit is geen per-image-URL-detail.
  // Lighthouse's eigen "uses-rel-preconnect"-audit meldt hier 0ms winst,
  // omdat de preload-hint voor de hero-afbeelding de verbinding al zo
  // vroeg mogelijk opent (zie de link[rel=preload][as=image] in <head>,
  // gegenereerd via Hero.tsx's priority-prop). Toegevoegd als goedkope,
  // onschadelijke garantie: zodra een andere pagina/afbeelding ooit als
  // eerste dit domein aanraakt vóór die preload-hint geparsed is, ligt de
  // verbinding al klaar.
  preconnect("https://cdn.sanity.io", { crossOrigin: "anonymous" });

  return (
    <html lang="nl">
      <body
        className={`${cormorantGaramond.variable} ${cormorantGaramondQuote.variable} ${manrope.variable}`}
      >
        <JsonLd data={buildLocalBusinessJsonLd(siteSettings)} />
        <SiteHeader
          logoName={siteSettings.logoName}
          logoSubline={siteSettings.logoSubline}
          navLinks={siteSettings.mainNav}
          headerCta={siteSettings.headerCta}
        />
        <main>{children}</main>
        <Footer settings={siteSettings} />
      </body>
    </html>
  );
}
