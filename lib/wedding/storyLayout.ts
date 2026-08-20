import type { SanityImage, StoryBlock } from "@/types/blocks";

/**
 * Sectie 6 van de Fase 4-brief: geen simpele verticale gallery van
 * gelijke tegels, maar een gevarieerde editorial compositie — zonder dat
 * daar per reportage custom code voor nodig is. Zolang een wedding geen
 * storyBlocks heeft (de huidige 4, die alleen de eenvoudige `gallery`
 * gebruiken), genereert deze functie diezelfde variatie automatisch uit
 * de platte fotolijst, door een vast patroon van uitvoeringen te
 * doorlopen. Zodra een redacteur storyBlocks invult (StoryLayout.tsx),
 * wint dat altijd — dit is puur de fallback.
 */
const PATTERN: Array<{ variant: string; count: 1 | 2 }> = [
  { variant: "large-portrait", count: 1 },
  { variant: "pair-even", count: 2 },
  { variant: "full-width-landscape", count: 1 },
  { variant: "pair-asymmetric", count: 2 },
  { variant: "full-bleed", count: 1 },
  { variant: "small-editorial", count: 1 },
];

export function autoLayoutFromGallery(gallery: SanityImage[]): StoryBlock[] {
  const blocks: StoryBlock[] = [];
  let remaining = [...gallery];
  let patternIndex = 0;

  while (remaining.length > 0) {
    const step = PATTERN[patternIndex % PATTERN.length];
    patternIndex += 1;

    const take = Math.min(step.count, remaining.length);
    const images = remaining.slice(0, take);
    remaining = remaining.slice(take);

    if (take === 2) {
      blocks.push({
        _type: "storyImagePair",
        _key: `auto-${blocks.length}`,
        images: [images[0], images[1]],
        layout: step.variant === "pair-asymmetric" ? "asymmetric" : "even",
      });
    } else {
      const variant =
        step.variant === "pair-even" || step.variant === "pair-asymmetric"
          ? "large-portrait" // te weinig foto's over voor een duo — val terug op een enkel beeld
          : (step.variant as "large-portrait" | "full-width-landscape" | "full-bleed" | "small-editorial");
      blocks.push({
        _type: "storyImage",
        _key: `auto-${blocks.length}`,
        image: images[0],
        variant,
      });
    }
  }

  return blocks;
}
