import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  // Alleen actief met ANALYZE=true npm run build — genereert
  // .next/analyze/*.html en opent die niet vanzelf, puur voor
  // inspectie, geen effect op een normale build/export.
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Statische export: geen Node-server nodig om te draaien, past bij de
  // TransIP/FTPS-deploy uit BOUWPLAN.md. trailingSlash zorgt dat elke
  // route een eigen map met index.html krijgt (/over-mij/index.html),
  // wat statische hosts zonder rewrite-regels correct kunnen serveren.
  output: "export",
  trailingSlash: true,
  images: {
    // Custom loader i.p.v. Next's eigen optimizer: urlFor() (Sanity's
    // eigen CDN-transforms) doet de breedte/formaat/kwaliteit al. Moet
    // globaal via config i.p.v. een `loader`-prop op <Image>, want een
    // functie als prop vanuit een Server Component kan niet over de
    // RSC-grens (zie lib/sanity/image.ts).
    //
    // `loader: "custom"` is hier niet optioneel naast loaderFile: de
    // custom loader werkt al zonder deze regel (Next vervangt de
    // default-loadermodule door loaderFile bij het bouwen), maar de
    // exportvalidatie in next/dist/export/index.js controleert apart de
    // string images.loader === "default" om de build te blokkeren
    // ("Image Optimization using the default loader is not compatible
    // with export"). Zonder deze expliciete override blijft die string
    // op de standaardwaarde "default" staan en faalt `next build` alsnog,
    // ook al functioneert loaderFile prima.
    loader: "custom",
    loaderFile: "./lib/sanity/imageLoader.ts",
  },
};

export default withBundleAnalyzer(nextConfig);
