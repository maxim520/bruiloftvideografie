import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import type { Supplier } from "@/types/blocks";

type SuppliersProps = {
  suppliers?: Supplier[];
};

/** Sectie 12: subtiele lijst, alleen als er echt leveranciers zijn ingevuld. */
export default function Suppliers({ suppliers }: SuppliersProps) {
  if (!suppliers || suppliers.length === 0) return null;

  return (
    <section className="border-t border-border bg-background py-16 md:py-20">
      <Container width="narrow">
        <Reveal>
          <h2 className="mb-8 text-center font-body text-eyebrow font-semibold uppercase tracking-[.22em] text-text-muted">
            Team achter de dag
          </h2>
          <dl className="mx-auto grid max-w-[520px] grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {suppliers.map((supplier) => (
              <div key={`${supplier.role}-${supplier.name}`} className="flex flex-col">
                <dt className="text-caption uppercase tracking-[.1em] text-text-muted">
                  {supplier.role}
                </dt>
                <dd className="m-0 text-small text-text">
                  {supplier.url ? (
                    <a
                      href={supplier.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-copper"
                    >
                      {supplier.name}
                    </a>
                  ) : (
                    supplier.name
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
