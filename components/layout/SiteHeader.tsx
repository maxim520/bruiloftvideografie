"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import type { NavLink, CtaLink } from "@/types/blocks";

type SiteHeaderProps = {
  logoName: string;
  logoSubline: string;
  navLinks: NavLink[];
  headerCta: CtaLink;
};

/**
 * app/layout.tsx is een server component en kent de huidige route niet.
 * Header zelf blijft daarom puur prop-gestuurd (zoals gebouwd: ontvangt
 * activeHref van buitenaf, roept zelf geen routing-hooks aan). Dit dunne
 * client-component bruggetje is de enige plek die usePathname() gebruikt,
 * en geeft het resultaat door als activeHref.
 */
export default function SiteHeader(props: SiteHeaderProps) {
  const pathname = usePathname();
  return <Header {...props} activeHref={pathname} />;
}
