"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import Button from "@/components/ui/Button";
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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,border-color,padding,backdrop-filter] duration-[350ms] ${
          scrolled
            ? "border-white/10 bg-ink/[0.86] py-[6px] backdrop-blur-[14px]"
            : "border-transparent py-[14px]"
        }`}
      >
        <Container className="flex items-center justify-between gap-8">
          <Link
            href="/"
            aria-label={logoSubline ? `${logoName} ${logoSubline}, naar home` : `${logoName}, naar home`}
            className="block text-white"
          >
            <span className="block font-display text-[21px] font-medium uppercase leading-[1.1] tracking-[.16em]">
              {logoName}
            </span>
            {logoSubline && (
              <span className="mt-[5px] block pl-0.5 text-[9px] font-medium uppercase tracking-[.42em] text-white/[0.62]">
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
                    isActive ? "text-white" : "text-white/[0.86] hover:text-white"
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
            className="hidden lg:inline-flex"
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
            className="flex h-[46px] w-[46px] items-center justify-center text-white lg:hidden"
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
