"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import Button from "@/components/ui/Button";
import { useHeaderTheme } from "./HeaderThemeContext";
import type { NavLink as NavLinkItem, CtaLink } from "@/types/blocks";

type HeaderProps = {
  logoName: string;
  logoSubline: string;
  navLinks: NavLinkItem[];
  headerCta: CtaLink;
  activeHref: string;
};

export default function Header({
  logoName,
  logoSubline,
  navLinks,
  headerCta,
  activeHref,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const ticking = useRef(false);
  const pageTheme = useHeaderTheme();

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Gescrold heeft altijd een eigen, ondoorzichtige achtergrond
  // (bg-ink/[0.86] hieronder) — ongeacht wat de pagina daaronder is, dus
  // dan wint altijd "light" (witte tekst). Alleen in de transparante,
  // niet-gescrolde stand telt het door de pagina opgegeven thema.
  const theme = scrolled ? "light" : pageTheme;
  const isLight = theme === "light";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,border-color,padding,backdrop-filter] duration-[350ms] ${
          scrolled
            ? "border-white/10 bg-ink/[0.86] py-[6px] backdrop-blur-[14px]"
            : "border-transparent py-[14px]"
        }`}
      >
        {/*
          Subtiele top-gradient, alleen actief in de transparante
          "light"-stand (witte tekst boven een foto): garandeert
          leesbaarheid ongeacht wat er toevallig bovenaan de foto staat
          (lichte trouwjurk, lichte lucht, ...) zonder een zichtbare
          zwarte balk over de fotografie te leggen. Los van elke hero's
          eigen sfeer-gradient (die is per pagina/stemming, dit is puur
          leesbaarheid) — zo geldt het automatisch voor iedere toekomstige
          hero, zonder dat elke hero dit apart hoeft te regelen.
        */}
        {!scrolled && isLight && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(0,0,0,.32)_0%,rgba(0,0,0,0)_100%)]"
          />
        )}

        <Container className="relative flex items-center justify-between gap-8">
          <Link
            href="/"
            aria-label={logoSubline ? `${logoName} ${logoSubline}, naar home` : `${logoName}, naar home`}
            className={`block transition-colors ${isLight ? "text-white" : "text-ink"}`}
          >
            <span className="block font-display text-[21px] font-medium uppercase leading-[1.1] tracking-[.16em]">
              {logoName}
            </span>
            {logoSubline && (
              <span
                className={`mt-[5px] block pl-0.5 text-[9px] font-medium uppercase tracking-[.42em] transition-colors ${
                  isLight ? "text-white/[0.62]" : "text-text-muted"
                }`}
              >
                {logoSubline}
              </span>
            )}
          </Link>

          <nav
            aria-label="Hoofdnavigatie"
            className="hidden items-center gap-[30px] lg:flex"
          >
            {/* Redesign-regel (Fase 2, sectie 8/45): geen "#"-navigatie-item
                tonen zolang de bestemming niet bestaat — hier "verbergen"
                i.p.v. "disabled tonen", passender voor een navigatiebalk. */}
            {navLinks
              .filter((link) => link.href && link.href !== "#")
              .map((link) => {
              const isActive = link.href === activeHref;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative py-2 text-xs font-medium uppercase tracking-[.13em] transition-colors ${
                    isLight
                      ? isActive
                        ? "text-white"
                        : "text-white/[0.86] hover:text-white"
                      : isActive
                        ? "text-ink"
                        : "text-text hover:text-ink"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-0 bottom-0.5 h-px origin-left bg-copper transition-transform duration-[250ms] ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <Button
            href={headerCta.href}
            variant="primary"
            size="sm"
            // Sectie 37 (Fase 8): `hidden` alleen (zonder !) verliest hier
            // van Button's eigen `base`, dat altijd een onvoorwaardelijke
            // `inline-flex` meegeeft — zelfde specificiteit, en Tailwind
            // genereert die twee niet in className-volgorde, dus welke wint
            // is niet gegarandeerd. Gevonden doordat de CTA daardoor op
            // mobiel zichtbaar bleef en de hamburger-knop letterlijk buiten
            // het viewport duwde (onbruikbare mobiele navigatie). De
            // `!`-suffix (Tailwind v4-syntax, dus áchteraan) dwingt
            // `!important` af zodat deze override altijd wint, ongeacht
            // generatievolgorde — geverifieerd via computed style na de fix.
            className="hidden! lg:inline-flex!"
          >
            {headerCta.label}
          </Button>

          <button
            ref={burgerRef}
            type="button"
            aria-label="Menu openen"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className={`flex h-[46px] w-[46px] items-center justify-center transition-colors lg:hidden ${
              isLight ? "text-white" : "text-ink"
            }`}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </Container>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={burgerRef}
        logoName={logoName}
        logoSubline={logoSubline}
        navLinks={navLinks}
        headerCta={headerCta}
        activeHref={activeHref}
      />
    </>
  );
}
