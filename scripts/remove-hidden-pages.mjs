#!/usr/bin/env node
/**
 * Postbuild-stap (zie package.json's "postbuild"-script, dat npm
 * automatisch ná "build" draait): verwijdert de statisch gegenereerde
 * output van elke `page` die in Sanity als "Pagina tonen op website" =
 * uit staat.
 *
 * Waarom dit nodig is (Fase 7 — "directe URL van verborgen pagina moet
 * een echte 404 geven"): bij output: "export" genereert `next build`
 * voor een vaste (niet-dynamische) route ALTIJD een HTML-bestand, ook
 * wanneer de pagina zelf `notFound()` aanroept — het bestand krijgt dan
 * de inhoud van de not-found-pagina, maar bestáát nog steeds op die
 * URL. Een statische webserver kent geen "inhoud = not-found" en zou dit
 * dus als een gewone, geldige pagina met HTTP 200 serveren (een "soft
 * 404" — slecht voor SEO en niet wat gevraagd is). Getest en bevestigd
 * met een tijdelijke testroute vóór dit script gebouwd werd.
 *
 * De enige manier om op een statische host een écht 404-statuscode te
 * krijgen is dat er domweg geen bestand op die plek staat — vandaar dat
 * dit script het resultaat van de vorige build-stap achteraf opschoont
 * i.p.v. te proberen de generatie zelf te voorkomen (dat kan alleen via
 * generateStaticParams, en werkt niet voor deze vaste routes).
 *
 * lib/sanity/queries.ts filtert `isVisible != false` al uit elke
 * paginaquery, dus de INHOUD van een verborgen pagina lekt sowieso nooit
 * (metadata, JSON-LD, sections — allemaal al leeg/notFound() vóór dit
 * script draait). Dit script zorgt alleen nog voor het juiste
 * HTTP-statuscode-gedrag ernaast.
 */

import { readdir, rm } from "node:fs/promises";
import path from "node:path";

const PROJECT_ID = "5o909qb6";
const DATASET = "production";
const OUT_DIR = path.resolve(process.cwd(), "out");

async function queryHiddenPageSlugs() {
  const query = `*[_type == "page" && isVisible == false]{ "slug": slug.current }`;
  const url = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sanity-query voor verborgen pagina's mislukt: ${res.status}`);
  }
  const { result } = await res.json();
  return result.map((r) => r.slug).filter(Boolean);
}

/**
 * "/fotografie" -> alle out/fotografie*-bestanden (index.html + de
 * bijbehorende __next.*.txt/rsc-sidecarbestanden, zie de out/-structuur
 * die `next build` met output:"export" produceert). "/" (home) is de
 * root zelf: out/index.html + out/index.txt, geen submap.
 */
async function removeSlugOutput(slug) {
  if (slug === "/") {
    await rm(path.join(OUT_DIR, "index.html"), { force: true });
    await rm(path.join(OUT_DIR, "index.txt"), { force: true });
    return ["index.html", "index.txt"];
  }

  const dir = path.join(OUT_DIR, slug.replace(/^\//, ""));
  await rm(dir, { recursive: true, force: true });
  return [dir];
}

async function main() {
  // Anders dan scripts/fetch-hero-images.mjs (een performance-optimalisatie
  // die veilig kan overslaan bij een netwerkfout) faalt dit script bewust
  // hard als de Sanity-query niet lukt: dit stapje bestaat om te
  // garanderen dat een verborgen pagina nooit per ongeluk gepubliceerd
  // blijft staan. Stilzwijgend doorgaan zonder die garantie te kunnen
  // controleren is hier het slechtere risico dan een gefaalde build.
  const hiddenSlugs = await queryHiddenPageSlugs();

  if (hiddenSlugs.length === 0) {
    console.log("remove-hidden-pages: geen verborgen pagina's, niets te verwijderen.");
    return;
  }

  // Bestaat out/ niet (bv. een build zonder export-stap), dan is er ook
  // niets op te ruimen — geen foutmelding, gewoon overslaan.
  try {
    await readdir(OUT_DIR);
  } catch {
    console.log("remove-hidden-pages: out/ bestaat niet, niets te verwijderen.");
    return;
  }

  for (const slug of hiddenSlugs) {
    const removed = await removeSlugOutput(slug);
    console.log(`remove-hidden-pages: "${slug}" verborgen -> verwijderd: ${removed.join(", ")}`);
  }
}

main().catch((err) => {
  console.error("remove-hidden-pages MISLUKT:", err.message);
  process.exit(1);
});
