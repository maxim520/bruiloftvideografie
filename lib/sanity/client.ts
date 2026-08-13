import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Ontbrekende Sanity-omgevingsvariabelen: NEXT_PUBLIC_SANITY_PROJECT_ID en " +
      "NEXT_PUBLIC_SANITY_DATASET zijn verplicht. Zie .env.local.example."
  );
}

/**
 * Alleen publieke, gepubliceerde content: geen token, `useCdn: true` en
 * `perspective: "published"`. Concepten (drafts) zijn zo nooit bereikbaar
 * vanuit de statisch geëxporteerde site.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
  perspective: "published",
});
