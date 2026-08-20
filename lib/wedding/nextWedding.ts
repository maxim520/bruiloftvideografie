import type { Wedding, WeddingCard } from "@/types/blocks";

/**
 * Bepaalt welke reportage de NextStory-sectie toont (Fase 4, sectie 14):
 * 1. Het eerste expliciete relatedWeddings-item, mits het niet naar de
 *    huidige reportage zelf verwijst (kan bij een verkeerd ingevulde
 *    referentie in Studio).
 * 2. Anders: de eerstvolgende in `allWeddings` (dezelfde vaste volgorde
 *    als /verhalen) na de huidige, cyclisch — zodat de laatste reportage
 *    weer naar de eerste wijst i.p.v. nergens naartoe.
 * 3. Bestaat er maar één wedding (of geen enkele andere), dan is er
 *    niets om te tonen: `null`.
 */
export function resolveNextWedding(
  current: Wedding,
  allWeddings: WeddingCard[],
): WeddingCard | null {
  const currentSlug = current.slug.current;

  const explicit = current.relatedWeddings?.[0];
  if (explicit && explicit.slug.current !== currentSlug) {
    return explicit;
  }

  const others = allWeddings.filter((w) => w.slug.current !== currentSlug);
  if (others.length === 0) return null;

  const currentIndex = allWeddings.findIndex((w) => w.slug.current === currentSlug);
  if (currentIndex === -1) return others[0];

  for (let offset = 1; offset <= allWeddings.length; offset += 1) {
    const candidate = allWeddings[(currentIndex + offset) % allWeddings.length];
    if (candidate.slug.current !== currentSlug) return candidate;
  }
  return null;
}
