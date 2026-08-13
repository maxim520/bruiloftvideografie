import type { ReactNode } from "react";
import Link from "next/link";
import Container from "./Container";
import Button from "@/components/ui/Button";
import type { SiteSettings } from "@/types/blocks";

type FooterProps = {
  settings: SiteSettings;
};

const socialIcons: Record<string, ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" />
    </>
  ),
  Facebook: (
    <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V11H5v4h3v6h4v-6h3l1-4h-4V7.5A.5.5 0 0 1 12.5 7H15z" />
  ),
  YouTube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.5 9.5 5 2.5-5 2.5z" />
    </>
  ),
};

export default function Footer({ settings }: FooterProps) {
  const { logoName, logoSubline, footer, business, headerCta } = settings;

  return (
    <footer className="bg-[#1b1310] pt-[78px] text-white/[0.72]">
      <Container>
        <div className="grid grid-cols-1 gap-10 pb-11 md:grid-cols-[1.6fr_1fr_1.3fr_1.2fr] md:gap-12 md:pb-14">
          <div>
            <span className="block text-white">
              <span className="block font-display text-[21px] font-medium uppercase leading-[1.1] tracking-[.16em]">
                {logoName}
              </span>
              <span className="mt-[5px] block pl-0.5 text-[9px] font-medium uppercase tracking-[.42em] text-white/[0.62]">
                {logoSubline}
              </span>
            </span>
            <p className="my-5 max-w-[30ch] text-sm leading-[1.7]">
              {footer.aboutText}
            </p>
            <div className="flex gap-2.5">
              {footer.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  aria-label={social.platform}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.16] text-white/80 transition-colors hover:border-copper hover:bg-copper hover:text-white"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {socialIcons[social.platform]}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[.2em] text-white">
              Navigatie
            </h3>
            <ul className="flex flex-col gap-[11px]">
              {footer.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[.2em] text-white">
              Populaire pagina&apos;s
            </h3>
            <ul className="flex flex-col gap-[11px]">
              {footer.popularPages.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[.2em] text-white">
              Contact
            </h3>
            <address className="mb-[22px] text-sm leading-[2] not-italic">
              <a
                href={`tel:${business.phone.replace(/\s+/g, "")}`}
                className="block transition-colors hover:text-white"
              >
                {business.phone}
              </a>
              <a
                href={`mailto:${business.email}`}
                className="block transition-colors hover:text-white"
              >
                {business.email}
              </a>
              <span className="block">
                {business.city}, {business.region}
              </span>
            </address>
            <Button href={headerCta.href} variant="primary" size="sm">
              {headerCta.label}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-[22px] text-[12.5px] text-white/50">
          <span>
            © {new Date().getFullYear()} {logoName}
          </span>
          <nav aria-label="Juridisch" className="flex gap-6">
            {footer.legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
