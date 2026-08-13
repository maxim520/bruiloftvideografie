import Image from "next/image";
import Icon from "./Icon";
import { urlFor, hotspotToObjectPosition, isSanityAssetImage } from "@/lib/sanity/image";
import type { SanityImage } from "@/types/blocks";

type SafeImageBaseProps = {
  image?: SanityImage;
  className?: string;
  priority?: boolean;
  /**
   * Stuurt object-position op basis van de Sanity-hotspot (alleen
   * relevant voor de echte, asset-vorm van SanityImage). Standaard aan.
   * Zet dit uit waar een blok al een eigen, per-pagina object-position
   * heeft (Hero, FinalCta): die twee kunnen niet naast elkaar bestaan
   * zonder te botsen — een inline hotspot-stijl wint altijd van een
   * Tailwind-klasse, en zou de bewust per pagina (en per breakpoint)
   * afgestemde uitsnede stilzwijgend overschrijven.
   */
  useHotspot?: boolean;
};

type SafeImageProps = SafeImageBaseProps &
  (
    | { sizes: string; width?: undefined; height?: undefined }
    | {
        /**
         * Vast-formaat pad (geen `fill`/`sizes`): voor afbeeldingen die op
         * elke breakpoint dezelfde pixelgrootte hebben (bv. review-avatars,
         * 56×70px). next/image's getWidths() bouwt de srcset bij een
         * fill+sizes-combinatie alléén op basis van vw-percentages in
         * `sizes` — een vaste px-waarde zoals "56px" matcht dat patroon
         * niet en valt terug op de VOLLEDIGE breedteladder (tot 3840px),
         * puur omdat "56px" geen "vw" bevat. Met expliciete width/height
         * i.p.v. fill herkent next/image dit als vast formaat en genereert
         * het alleen de 1x/2x-kandidaten die de dichtstbijzijnde
         * geconfigureerde breedtes benaderen.
         */
        sizes?: undefined;
        width: number;
        height: number;
      }
  );

/**
 * Veilige vervanger voor next/image: een ontbrekende afbeelding crasht
 * next/image niet, maar toont een neutraal vlak met een vaag icoon. De
 * ouder bepaalt de aspect-ratio (vaste hoogte/breedte via CSS), dus de
 * layout verspringt niet.
 *
 * Ondersteunt beide vormen van SanityImage: de echte, asset-vorm (via
 * urlFor()) en de tijdelijke `url`-vorm die lib/mock-data.ts nog
 * gebruikt. De pagina's leveren voortaan alleen nog de asset-vorm; de
 * url-tak blijft bestaan omdat het type dat nog toestaat en
 * mock-data.ts als referentie blijft bestaan. De breedte-optimalisatie
 * zelf loopt via de globale loader in next.config.ts (`images.loaderFile`),
 * niet via een prop hier — zie lib/sanity/imageLoader.ts voor waarom.
 */
export default function SafeImage({
  image,
  sizes,
  width,
  height,
  className,
  priority,
  useHotspot = true,
}: SafeImageProps) {
  if (!image) {
    return <Placeholder />;
  }

  const src = isSanityAssetImage(image)
    ? urlFor(image).auto("format").quality(78).url()
    : image.url;

  if (!src) {
    return <Placeholder />;
  }

  const objectPosition =
    useHotspot && isSanityAssetImage(image) && image.hotspot
      ? hotspotToObjectPosition(image.hotspot)
      : undefined;

  if (width !== undefined && height !== undefined) {
    return (
      <Image
        src={src}
        alt={image.alt ?? ""}
        width={width}
        height={height}
        priority={priority}
        className={className}
        style={objectPosition ? { objectPosition } : undefined}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={image.alt ?? ""}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={objectPosition ? { objectPosition } : undefined}
    />
  );
}

function Placeholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-surface"
      aria-hidden="true"
    >
      <Icon name="photo" size={32} className="text-border" />
    </div>
  );
}
