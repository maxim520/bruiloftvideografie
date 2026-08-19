"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import type { NavLink as NavLinkItem, CtaLink } from "@/types/blocks";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  logoName: string;
  logoSubline: string;
  navLinks: NavLinkItem[];
  headerCta: CtaLink;
  activeHref: string;
};

export default function MobileMenu({
  open,
  onClose,
  triggerRef,
  logoName,
  logoSubline,
  navLinks,
  headerCta,
  activeHref,
}: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, triggerRef]);

  const handleClose = () => {
    onClose();
    triggerRef.current?.focus();
  };

  return (
    <div
      id="mobile-menu"
      // Buiten beeld (translate) betekent niet buiten de taborde: inert
      // voorkomt dat toetsenbordgebruikers in het dichte menu belanden.
      inert={!open}
      className={`fixed inset-0 z-[70] flex flex-col bg-ink px-6 pb-8 pt-[22px] transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        open ? "translate-y-0 visible" : "-translate-y-full invisible"
      }`}
    >
      <div className="mb-9 flex items-center justify-between">
        <span className="block text-white">
          <span className="block font-display text-[21px] font-medium uppercase leading-[1.1] tracking-[.16em]">
            {logoName}
          </span>
          {logoSubline && (
            <span className="mt-[5px] block pl-0.5 text-[9px] font-medium uppercase tracking-[.42em] text-white/[0.62]">
              {logoSubline}
            </span>
          )}
        </span>
        <button
          type="button"
          aria-label="Menu sluiten"
          onClick={handleClose}
          className="flex h-[46px] w-[46px] items-center justify-center text-white"
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
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav aria-label="Mobiele navigatie" className="flex flex-col">
        {/* Zie Header.tsx voor waarom "#"-items hier gefilterd worden. */}
        {navLinks
          .filter((link) => link.href && link.href !== "#")
          .map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            ref={index === 0 ? firstLinkRef : undefined}
            aria-current={link.href === activeHref ? "page" : undefined}
            onClick={handleClose}
            className={`border-b border-white/[0.08] py-[13px] font-display text-[28px] ${
              link.href === activeHref ? "text-copper-hover" : "text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Button
        href={headerCta.href}
        variant="primary"
        onClick={handleClose}
        className="mt-auto w-full"
      >
        {headerCta.label}
      </Button>
    </div>
  );
}
