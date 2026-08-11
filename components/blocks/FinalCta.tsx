import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import type { FinalCtaBlock, PagePreset } from "@/types/blocks";

type FinalCtaProps = {
  block: FinalCtaBlock;
};

/** Eén preset per pagina, exact op de referentie — geen gemiddelden. */
const sizeClasses: Record<PagePreset, string> = {
  home: "min-h-[500px] md:min-h-[420px]",
  "over-mij": "min-h-[480px] md:min-h-[420px]",
  fotografie: "min-h-[440px] md:min-h-[360px]",
  contact: "min-h-[460px] md:min-h-[360px]",
};

/**
 * Foto-uitsnede per pagina. Home en over mij gebruiken dezelfde uitsnede
 * op elke breedte; fotografie en contact hebben een aparte mobiele stand.
 */
const objectPositionClasses: Record<PagePreset, string> = {
  home: "object-[center_30%]",
  "over-mij": "object-[center_32%]",
  fotografie: "object-[66%_30%] md:object-[70%_35%]",
  contact: "object-[62%_34%] md:object-[68%_40%]",
};

/** Koplettergrootte, max-breedte en marge, exact per pagina. */
const headingClasses: Record<PagePreset, string> = {
  home: "mb-4 max-w-[20ch] text-[clamp(1.75rem,2.9vw,2.5rem)]",
  "over-mij": "mb-4 max-w-[18ch] text-[clamp(1.75rem,2.9vw,2.5rem)]",
  fotografie: "mb-[14px] max-w-[22ch] text-[clamp(1.75rem,2.9vw,2.5rem)]",
  contact: "mb-[14px] max-w-[14ch] text-[clamp(1.75rem,3vw,2.625rem)]",
};

export default function FinalCta({ block }: FinalCtaProps) {
  const { heading, text, image, cta, size } = block;

  if (!heading) return null;

  return (
    <section
      className={`relative flex items-end overflow-hidden bg-brown-dark md:items-center ${sizeClasses[size]}`}
    >
      <div className="absolute inset-0">
        <SafeImage
          image={image}
          sizes="100vw"
          className={`object-cover ${objectPositionClasses[size]}`}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,14,11,.5)_0%,rgba(20,14,11,.35)_40%,rgba(20,14,11,.9)_100%)] md:bg-[linear-gradient(90deg,rgba(20,14,11,.88)_0%,rgba(20,14,11,.6)_55%,rgba(20,14,11,.3)_100%)]"
      />

      <Container className="relative z-[2] w-full pt-[76px] pb-[54px] md:pb-[76px]">
        <Reveal>
          <h2 className={`text-white ${headingClasses[size]}`}>{heading}</h2>
          {text && <p className="mb-[30px] text-base text-white/[0.78]">{text}</p>}
          {cta?.href && (
            <Button href={cta.href} variant="primary" className="w-full md:w-auto">
              {cta.label}
            </Button>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
