import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /**
   * "default" (het bestaande, vaste --container, 1280px) blijft de norm
   * voor alle bestaande pagina's. "narrow"/"wide" gebruiken de
   * --container-narrow/--container-wide-tokens uit globals.css (Fase 3:
   * gedefinieerd maar tot Fase 4 nergens toegepast) — narrow voor
   * smalle, editorial leeskolommen (bv. EditorialIntro.tsx), wide voor
   * brede, fotografie-gedreven content die net binnen full-bleed blijft.
   */
  width?: "default" | "narrow" | "wide";
};

const maxWidthByWidth: Record<NonNullable<ContainerProps["width"]>, string> = {
  default: "max-w-[var(--container)]",
  narrow: "max-w-narrow",
  wide: "max-w-wide",
};

export default function Container({ children, className, width = "default" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-5 md:px-6 ${maxWidthByWidth[width]}${
        className ? ` ${className}` : ""
      }`}
    >
      {children}
    </div>
  );
}
