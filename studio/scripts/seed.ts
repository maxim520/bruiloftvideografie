/**
 * Eenmalige seed: vult de Studio met de bestaande mockdata uit
 * lib/mock-data.ts (de Next-app), zodat de content niet handmatig
 * hoeft te worden overgetypt.
 *
 * Idempotent:
 * - Documenten krijgen een vast _id (page-home, page-over-mij, ...) en
 *   worden overgeslagen als ze al bestaan, zodat een tweede run geen
 *   dubbele documenten aanmaakt en geen handmatige Studio-wijzigingen
 *   overschrijft.
 * - Afbeeldingen worden vóór upload op sha1-hash tegen bestaande
 *   Sanity-assets gecontroleerd; bij een match wordt het bestaande
 *   asset hergebruikt in plaats van opnieuw geüpload.
 *
 * Gebruik: npm run seed (vanuit studio/), of npm run studio:seed
 * vanuit de root. Vereist SANITY_SEED_TOKEN in studio/.env.local.
 */

import path from 'node:path'
import {promises as fs} from 'node:fs'
import {createHash} from 'node:crypto'
import dotenv from 'dotenv'
import {createClient} from '@sanity/client'
import type {SanityClient} from '@sanity/client'

import {
  homePage,
  overMijPage,
  fotografiePage,
  contactPage,
  siteSettings as siteSettingsMock,
} from '../../lib/mock-data'
import type {Page, SiteSettings} from '../../types/blocks'

dotenv.config({path: path.resolve(__dirname, '../.env.local')})

const PROJECT_ID = '5o909qb6' // zie studio/sanity.config.ts
const DATASET = 'production' // zie studio/sanity.config.ts
const REPO_ROOT = path.resolve(__dirname, '../..')

const counters = {
  docsCreated: 0,
  docsSkipped: 0,
  imagesUploaded: 0,
  imagesReused: 0,
}

function log(message: string): void {
  console.log(message)
}

/** Vorm van een afbeelding zoals lib/mock-data.ts die produceert (via de `img()`-helper). */
type MockImage = {_type: 'image'; url: string; alt: string}

function isMockImage(value: unknown): value is MockImage {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return (
    record._type === 'image' &&
    typeof record.url === 'string' &&
    typeof record.alt === 'string'
  )
}

/** Voorkomt dat hetzelfde bestand twee keer wordt geüpload binnen één run. */
const uploadCache = new Map<string, Promise<string>>()

function uploadImage(client: SanityClient, url: string): Promise<string> {
  if (!uploadCache.has(url)) {
    uploadCache.set(url, uploadImageUncached(client, url))
  }
  return uploadCache.get(url) as Promise<string>
}

async function uploadImageUncached(client: SanityClient, url: string): Promise<string> {
  // Mockdata-urls zijn gemodelleerd naar het /images/-pad dat de Next-app
  // ooit rechtstreeks serveerde; de bronbestanden zelf staan sinds de
  // overstap op Sanity niet meer in public/ (dat zou ze in elke build/
  // deploy meenemen terwijl de site ze niet meer gebruikt), maar in
  // _seed-images/ — alleen bedoeld om dit script te voeden.
  const filename = path.basename(url) // "hero-wedding.jpg"
  const filePath = path.join(REPO_ROOT, '_seed-images', filename)

  let buffer: Buffer
  try {
    buffer = await fs.readFile(filePath)
  } catch {
    throw new Error(
      `Kan afbeelding niet vinden: ${filePath}\n` +
        `  (verwacht op basis van "${url}" uit lib/mock-data.ts — controleer of het bestand in _seed-images/ staat)`,
    )
  }

  const sha1hash = createHash('sha1').update(buffer).digest('hex')

  const existingAssetId = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && sha1hash == $sha1hash][0]._id`,
    {sha1hash},
  )

  if (existingAssetId) {
    log(`  ↺ hergebruikt:  ${filename}`)
    counters.imagesReused += 1
    return existingAssetId
  }

  const asset = await client.assets.upload('image', buffer, {
    filename: path.basename(filePath),
  })
  log(`  ↑ geüpload:     ${filename}`)
  counters.imagesUploaded += 1
  return asset._id
}

/**
 * Doorloopt een willekeurige contentboom (page of siteSettings) en
 * vervangt elke MockImage door een echte Sanity-asset-referentie, met
 * behoud van de alt-tekst. Werkt generiek voor alle 15 bloktypes zonder
 * per bloktype upload-code te hoeven schrijven.
 */
async function resolveImages(client: SanityClient, value: unknown): Promise<unknown> {
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => resolveImages(client, item)))
  }

  if (isMockImage(value)) {
    const assetId = await uploadImage(client, value.url)
    return {
      _type: 'image',
      asset: {_type: 'reference', _ref: assetId},
      alt: value.alt,
    }
  }

  if (typeof value === 'object' && value !== null) {
    const record = value as Record<string, unknown>
    const entries = await Promise.all(
      Object.entries(record).map(
        async ([key, val]) => [key, await resolveImages(client, val)] as const,
      ),
    )
    return Object.fromEntries(entries)
  }

  return value
}

async function upsertDocument(
  client: SanityClient,
  doc: {_id: string; _type: string; [key: string]: unknown},
): Promise<void> {
  const existing = await client.getDocument(doc._id)
  if (existing) {
    log(`○ bestaat al, overgeslagen: ${doc._type} (${doc._id})`)
    counters.docsSkipped += 1
    return
  }
  await client.create(doc)
  log(`✓ aangemaakt: ${doc._type} (${doc._id})`)
  counters.docsCreated += 1
}

async function seedSiteSettings(client: SanityClient, data: SiteSettings): Promise<void> {
  log('\n→ Site-instellingen')
  const resolved = (await resolveImages(client, data)) as Record<string, unknown>
  await upsertDocument(client, {_id: 'siteSettings', _type: 'siteSettings', ...resolved})
}

async function seedPage(client: SanityClient, id: string, data: Page): Promise<void> {
  log(`\n→ Pagina: ${data.title} (${id})`)
  const resolved = (await resolveImages(client, data)) as Record<string, unknown>
  await upsertDocument(client, {_id: id, _type: 'page', ...resolved})
}

async function main(): Promise<void> {
  const token = process.env.SANITY_SEED_TOKEN

  if (!token) {
    throw new Error(
      'Geen Sanity API-token gevonden.\n\n' +
        '  Verwacht: SANITY_SEED_TOKEN in studio/.env.local\n' +
        '  Zie de instructies van Claude voor hoe je dit token aanmaakt en instelt.',
    )
  }

  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  log('Behind Every Wedding — Sanity seed')
  log(`Project: ${PROJECT_ID} · Dataset: ${DATASET}`)

  await seedSiteSettings(client, siteSettingsMock)
  await seedPage(client, 'page-home', homePage)
  await seedPage(client, 'page-over-mij', overMijPage)
  await seedPage(client, 'page-fotografie', fotografiePage)
  await seedPage(client, 'page-contact', contactPage)

  log(
    `\nKlaar. ${counters.docsCreated + counters.docsSkipped} documenten verwerkt ` +
      `(${counters.docsCreated} aangemaakt, ${counters.docsSkipped} overgeslagen), ` +
      `${counters.imagesUploaded + counters.imagesReused} afbeeldingen verwerkt ` +
      `(${counters.imagesUploaded} geüpload, ${counters.imagesReused} hergebruikt).`,
  )
}

main().catch((err: unknown) => {
  const statusCode =
    typeof err === 'object' && err !== null && 'statusCode' in err
      ? (err as {statusCode?: number}).statusCode
      : undefined

  if (statusCode === 401) {
    console.error(
      '\n✗ Het Sanity-token is ongeldig of verlopen.\n' +
        '  Maak een nieuw token aan en zet dit in studio/.env.local.',
    )
  } else if (statusCode === 403) {
    console.error(
      '\n✗ Het token heeft onvoldoende rechten voor deze actie.\n' +
        "  Het token heeft minimaal de rol 'Editor' nodig (lezen én schrijven).",
    )
  } else if (err instanceof Error) {
    console.error(`\n✗ ${err.message}`)
  } else {
    console.error('\n✗ Onbekende fout tijdens het seeden.', err)
  }

  process.exitCode = 1
})
