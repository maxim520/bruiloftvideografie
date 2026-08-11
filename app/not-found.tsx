import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-background">
      <Container className="text-center">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[.22em] text-copper">
          Pagina niet gevonden
        </p>
        <h1 className="mb-6 text-[clamp(2.5rem,6vw,4rem)] text-text">404</h1>
        <p className="mx-auto mb-9 max-w-[46ch] text-[15.5px] leading-[1.8] text-text-muted">
          Deze pagina bestaat niet, of niet meer. Mogelijk is de link verouderd of is de pagina
          verplaatst.
        </p>
        <Button href="/" variant="primary">
          Terug naar home
        </Button>
      </Container>
    </section>
  );
}
