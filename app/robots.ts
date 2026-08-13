import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Zelfde principe als app/sitemap.ts: rendert tijdens `next build` naar
 * een statisch robots.txt in out/. `dynamic = "force-static"` is bij
 * output: "export" niet optioneel: zonder deze regel weigert de build
 * zelfs een volledig statische robots()/sitemap() (geen requestgebruik,
 * geen dynamische data) met "dynamic ... not configured ... with output:
 * export" — leeg getest, dus dit is geen voorzorgsmaatregel maar een
 * daadwerkelijke buildfout die zonder deze regel optreedt.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Puur een POST-eindpunt, hoort niet in zoekresultaten — crawlers
      // doen alleen GET, dus contact.php geeft ze sowieso al 405, maar
      // dit weert het expliciet uit de crawl in plaats van dat aan die
      // bijvangst over te laten.
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
