"use client";

import { useEffect } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center bg-background">
      <Container className="text-center">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[.22em] text-copper">
          Er ging iets mis
        </p>
        <h1 className="mb-6 max-w-[16ch] text-[clamp(2rem,4.5vw,3rem)] text-text mx-auto">
          Deze pagina kon niet geladen worden
        </h1>
        <p className="mx-auto mb-9 max-w-[46ch] text-[15.5px] leading-[1.8] text-text-muted">
          Er is een onverwachte fout opgetreden. Probeer het opnieuw, of ga terug naar home.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Button type="button" variant="primary" onClick={reset}>
            Probeer opnieuw
          </Button>
          <Button href="/" variant="dark-outline">
            Terug naar home
          </Button>
        </div>
      </Container>
    </section>
  );
}
