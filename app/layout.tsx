import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";
import { siteSettings } from "@/lib/mock-data";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Zelfde domein als in de JSON-LD van _reference/fotografie.html en
  // _reference/contact.html — nodig zodat contact's og:image (een relatief
  // pad) tot een absolute URL kan worden herleid.
  metadataBase: new URL("https://northoak.nl"),
  title: "North & Oak Photo & Film",
  description:
    "Tijdloze trouwfotografie en trouwfilms voor bruidsparen in heel Nederland en Europa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl">
      <body className={`${cormorantGaramond.variable} ${manrope.variable}`}>
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
