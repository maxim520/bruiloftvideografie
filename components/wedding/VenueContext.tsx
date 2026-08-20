import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";

type VenueContextProps = {
  venue?: string;
  venueContext?: string;
};

/**
 * Sectie 13: alleen tonen wanneer er daadwerkelijk locatie-specifieke
 * tekst is ingevuld (wedding.venueContext) — geen automatisch
 * gegenereerde SEO-tekst. Bij alle 4 huidige weddings is dit veld leeg,
 * dus deze sectie rendert nu nergens; zie het Fase 4-verslag.
 */
export default function VenueContext({ venue, venueContext }: VenueContextProps) {
  if (!venueContext) return null;

  return (
    <section className="bg-surface-light py-20 md:py-28">
      <Container width="narrow">
        <Reveal>
          {venue && <h2 className="mb-6 text-center text-h2">Trouwen bij {venue}</h2>}
          <p className="mx-auto max-w-[60ch] whitespace-pre-line text-base leading-[1.9] text-text-muted">
            {venueContext}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
