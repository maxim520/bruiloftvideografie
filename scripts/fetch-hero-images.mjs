#!/usr/bin/env node
/**
 * Prebuild-stap (zie package.json's "prebuild"-script, dat npm automatisch
 * vóór "build" draait): haalt elke pagina's hero-foto vooraf op bij
 * Sanity's CDN en zet 'm lokaal neer in public/_hero-cache/, in dezelfde
 * breedtes die next/image toch al zou aanvragen (Next's default
 * deviceSizes). lib/sanity/imageLoader.ts geeft daarna, alleen server-
 * side (build-time), de lokale variant terug in plaats van de
 * cdn.sanity.io-URL — voor alle andere afbeeldingen (galerijen, reviews,
 * etc.) verandert er niets.
 *
 * Waarom dit bestaat: de hero-foto is op elke pagina het LCP-element.
 * Gemeten (Lighthouse, mobiel, throttled, tegen de live site): 74% van de
 * LCP-tijd ging op aan het opzetten van een nieuwe verbinding naar
 * cdn.sanity.io (DNS+TCP+TLS), niet aan de daadwerkelijke downloadtijd
 * (de bestanden zelf zijn maar een paar KB). Een preconnect-hint
 * (app/layout.tsx) hielp wél, maar kon dat verbindingsopzet nooit
 * volledig wegnemen. Door de hero-foto vanaf hetzelfde domein als de HTML
 * te serveren, is er geen nieuwe verbinding meer nodig — de browser heeft
 * die toch al open voor het HTML-document zelf.
 *
 * Bewust geen losse library (bv. tsx om lib/sanity/queries.ts te
 * hergebruiken) voor dit ene, kleine scriptje — gewone fetch() + een paar
 * regels regex volstaan.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PROJECT_ID = "5o909qb6";
const DATASET = "production";
// Next's default images.deviceSizes (geen override in next.config.ts) —
// dit script moet exact dezelfde breedtes cachen die next/image met
// sizes="100vw" ook daadwerkelijk aanvraagt, anders wordt er voor niets
// gedownload of mist er alsnog een breedte (en valt de loader terug op
// het cdn.sanity.io-origineel).
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const OUT_DIR = path.resolve(process.cwd(), "public/_hero-cache");
// Zelfde formaat-onderhandeling als een moderne browser: cdn.sanity.io's
// auto=format kijkt naar deze header om AVIF/WebP/JPEG te kiezen. Zonder
// dit zou dit script (Node's fetch stuurt standaard geen Accept-header
// die AVIF/WebP aangeeft) een zwaardere JPEG binnenhalen dan de browser
// van een echte bezoeker zou krijgen — dat zou dus een regressie zijn,
// geen optimalisatie.
const BROWSER_ACCEPT = "image/avif,image/webp,image/apng,image/*,*/*;q=0.8";

async function queryHeroImages() {
  const query = `*[_type == "page" && defined(sections[_type == "hero"][0].image.asset._ref)]{ "ref": sections[_type == "hero"][0].image.asset._ref }`;
  const url = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sanity-query voor hero-afbeeldingen mislukt: ${res.status}`);
  }
  const { result } = await res.json();
  return [...new Set(result.map((r) => r.ref).filter(Boolean))];
}

/**
 * "image-<hash>-<w>x<h>-<ext>" -> { hash, dims, ext }. De CDN-bestandsnaam
 * heeft de originele afmetingen nodig ("Invalid filename" zonder — leeg
 * getest); alleen de hash is niet genoeg.
 */
function parseAssetRef(ref) {
  const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) {
    throw new Error(`onverwacht Sanity asset-ref-formaat: ${ref}`);
  }
  return { hash: match[1], dims: match[2], ext: match[3] };
}

function cdnUrl(hash, dims, ext, width) {
  return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${hash}-${dims}.${ext}?auto=format&q=78&w=${width}`;
}

/** Sanity's auto=format kan bij dezelfde extensie-vraag toch webp/avif terugsturen — bepaal de echte extensie uit de Content-Type i.p.v. aan te nemen dat het bronformaat blijft. */
function extFromContentType(contentType) {
  if (!contentType) return "jpg";
  if (contentType.includes("avif")) return "avif";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("png")) return "png";
  return "jpg";
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const refs = await queryHeroImages();
  if (refs.length === 0) {
    console.log("fetch-hero-images: geen hero-afbeeldingen gevonden, niets te cachen.");
    return;
  }

  const manifest = {};
  let downloaded = 0;

  for (const ref of refs) {
    const { hash, dims, ext } = parseAssetRef(ref);
    // Sleutel op "<hash>-<dims>": exact het pad-segment dat ook in de
    // cdn.sanity.io-URL staat (vóór de extensie) — dat is precies wat de
    // loader straks uit een <Image>-aanroep kan lezen, in tegenstelling
    // tot de oorspronkelijke Sanity asset-ref met "image-"-prefix.
    const assetKey = `${hash}-${dims}`;
    manifest[assetKey] = {};
    for (const width of DEVICE_SIZES) {
      // Extensie staat pas na de download vast (auto=format kan een ander
      // formaat teruggeven dan het origineel) — dus altijd ophalen en dan
      // pas het bestandspad bepalen. Idempotent: opnieuw draaien
      // overschrijft gewoon met identieke content, geen probleem.
      const remoteUrl = cdnUrl(hash, dims, ext, width);
      const res = await fetch(remoteUrl, { headers: { Accept: BROWSER_ACCEPT } });
      if (!res.ok) {
        throw new Error(`Download mislukt (${res.status}): ${remoteUrl}`);
      }
      const realExt = extFromContentType(res.headers.get("content-type"));
      const filename = `${assetKey}-${width}.${realExt}`;
      const buffer = Buffer.from(await res.arrayBuffer());
      await writeFile(path.join(OUT_DIR, filename), buffer);
      downloaded += 1;

      manifest[assetKey][width] = filename;
    }
  }

  await writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  console.log(
    `fetch-hero-images: ${refs.length} hero-afbeelding(en), ${downloaded} bestand(en) gedownload.`,
  );
}

main().catch((err) => {
  console.error("fetch-hero-images MISLUKT:", err.message);
  process.exit(1);
});
