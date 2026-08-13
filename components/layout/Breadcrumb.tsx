import Link from "next/link";
import Container from "./Container";

type BreadcrumbProps = {
  currentLabel: string;
};

/**
 * Puur navigatie/wayfinding, geen editoriale content: het label is
 * altijd de paginatitel en "Home" staat altijd vast, dus er is niets
 * voor een redacteur om te kiezen of te vullen. Daarom geen Sanity-blok
 * (dat zou alleen bewerkbaar maken wat sowieso al vastligt, en een
 * editor de kans geven het abusievelijk te verplaatsen of te
 * verwijderen) maar een component die de pagina zelf plaatst, op de
 * vaste plek direct onder de hero — zie app/fotografie/page.tsx en
 * app/contact/page.tsx.
 */
export default function Breadcrumb({ currentLabel }: BreadcrumbProps) {
  return (
    <nav aria-label="Kruimelpad" className="border-b border-border bg-surface-light">
      <Container>
        <ol className="flex items-center gap-2.5 py-4 text-[11.5px] uppercase tracking-[.12em] text-text-muted">
          <li>
            <Link href="/" className="transition-colors hover:text-copper">
              Home
            </Link>
          </li>
          <li aria-hidden="true">&middot;</li>
          <li>
            <span aria-current="page" className="text-text">
              {currentLabel}
            </span>
          </li>
        </ol>
      </Container>
    </nav>
  );
}
