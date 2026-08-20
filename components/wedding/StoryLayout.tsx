import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import { autoLayoutFromGallery } from "@/lib/wedding/storyLayout";
import type { SanityImage, StoryBlock } from "@/types/blocks";

type StoryLayoutProps = {
  storyBlocks?: StoryBlock[];
  gallery: SanityImage[];
};

/**
 * Sectie 6/7: een gevarieerde editorial beeldcompositie. storyBlocks
 * (handmatig samengesteld in Studio) wint altijd; is dat leeg, dan
 * genereert autoLayoutFromGallery() dezelfde variatie automatisch uit de
 * eenvoudige fotolijst — zie dat bestand voor de precieze regels. Dat is
 * precies de situatie van alle 4 huidige weddings (nog geen storyBlocks
 * ingevuld).
 */
export default function StoryLayout({ storyBlocks, gallery }: StoryLayoutProps) {
  const blocks = storyBlocks && storyBlocks.length > 0 ? storyBlocks : autoLayoutFromGallery(gallery);

  if (blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-16 py-16 md:gap-24 md:py-24">
      {blocks.map((block) => (
        <StoryBlockRenderer key={block._key} block={block} />
      ))}
    </div>
  );
}

function StoryBlockRenderer({ block }: { block: StoryBlock }) {
  switch (block._type) {
    case "storyImage": {
      if (block.variant === "full-bleed") {
        return (
          <Reveal>
            <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[21/9]">
              <SafeImage image={block.image} sizes="100vw" className="object-cover" />
            </div>
          </Reveal>
        );
      }

      return (
        <Container width={block.variant === "small-editorial" ? "narrow" : "wide"}>
          <Reveal>
            {block.variant === "large-portrait" && (
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px] overflow-hidden rounded-[3px]">
                <SafeImage
                  image={block.image}
                  sizes="(min-width: 768px) 50vw, 90vw"
                  className="object-cover"
                />
              </div>
            )}
            {block.variant === "full-width-landscape" && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[3px]">
                <SafeImage image={block.image} sizes="100vw" className="object-cover" />
              </div>
            )}
            {block.variant === "small-editorial" && (
              <div className="relative mx-auto aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-[3px]">
                <SafeImage
                  image={block.image}
                  sizes="(min-width: 768px) 40vw, 80vw"
                  className="object-cover"
                />
              </div>
            )}
          </Reveal>
        </Container>
      );
    }

    case "storyImagePair": {
      const [first, second] = block.images;
      const asymmetric = block.layout === "asymmetric";
      return (
        <Container width="wide">
          <Reveal>
            <div
              className={`grid grid-cols-1 gap-4 md:gap-6 ${
                asymmetric ? "md:grid-cols-[3fr_2fr]" : "md:grid-cols-2"
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3px]">
                <SafeImage image={first} sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3px]">
                <SafeImage image={second} sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
              </div>
            </div>
          </Reveal>
        </Container>
      );
    }

    case "storyText": {
      return (
        <Container width="narrow">
          <Reveal>
            <div className="mx-auto max-w-[46ch] text-center">
              {block.heading && <h2 className="mb-4 text-h3">{block.heading}</h2>}
              <p className="text-base leading-[1.85] text-text-muted">{block.text}</p>
            </div>
          </Reveal>
        </Container>
      );
    }

    case "storyQuote": {
      return (
        <Container width="narrow">
          <Reveal>
            <blockquote className="mx-auto max-w-[36ch] text-center">
              <p className="font-display-quote text-[clamp(1.375rem,2.6vw,2rem)] italic leading-[1.4] text-text">
                “{block.quote}”
              </p>
              {block.attribution && (
                <cite className="mt-5 block text-eyebrow font-semibold not-italic uppercase tracking-[.2em] text-text-muted">
                  {block.attribution}
                </cite>
              )}
            </blockquote>
          </Reveal>
        </Container>
      );
    }

    case "storySpacer": {
      const heights: Record<typeof block.size, string> = {
        md: "h-4 md:h-8",
        lg: "h-8 md:h-16",
        xl: "h-16 md:h-28",
      };
      return <div aria-hidden="true" className={heights[block.size]} />;
    }

    default:
      return null;
  }
}
