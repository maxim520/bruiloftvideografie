import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

/**
 * Sectie 15: een rustige, niet-salesy afsluiting — bewust geen
 * achtergrondfoto/overlay zoals components/blocks/FinalCta.tsx (dat
 * blok is gebouwd rond vier vaste paginapresets met eigen uitsnede per
 * pagina; hier gaat het juist om rust ná een lange, beeldrijke
 * reportage). De knop zelf is wél Button.tsx, dezelfde centrale
 * CTA-component als de rest van de site.
 */
export default function WeddingCta() {
  return (
    <section className="bg-background py-20 text-center md:py-24">
      <Container width="narrow">
        <Reveal>
          <h2 className="mb-3 text-h2">Voelt dit als jullie?</h2>
          <p className="mx-auto mb-8 max-w-[40ch] text-base leading-[1.8] text-text-muted">
            Vertel me over jullie dag.
          </p>
          <Button href="/contact" variant="primary">
            Check jullie datum
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
