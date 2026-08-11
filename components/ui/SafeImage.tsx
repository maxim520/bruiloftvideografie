import Image from "next/image";
import Icon from "./Icon";
import type { SanityImage } from "@/types/blocks";

type SafeImageProps = {
  image?: SanityImage;
  sizes: string;
  className?: string;
  priority?: boolean;
};

function resolveImageSrc(image: SanityImage): string {
  return "url" in image ? image.url : "";
}

/**
 * Veilige vervanger voor next/image: een lege/ontbrekende src crasht
 * next/image (het vereist een niet-lege string). Als een redacteur een
 * afbeeldingsveld leegmaakt, toont dit component in plaats daarvan een
 * neutraal vlak met een vaag icoon. De ouder bepaalt de aspect-ratio
 * (vaste hoogte/breedte via CSS), dus de layout verspringt niet.
 */
export default function SafeImage({ image, sizes, className, priority }: SafeImageProps) {
  const src = image ? resolveImageSrc(image) : "";

  if (!src) {
    return (
      <div
        className="flex h-full w-full items-center justify-center bg-surface"
        aria-hidden="true"
      >
        <Icon name="photo" size={32} className="text-border" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={image?.alt ?? ""}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
