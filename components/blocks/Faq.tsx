"use client";

import { useId, useState } from "react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import type { FaqBlock, FaqItem } from "@/types/blocks";

type FaqProps = {
  block: FaqBlock;
  /**
   * Kolomindeling en triggerstijl zijn plaatsingskeuzes van de pagina die
   * dit blok neerzet, geen contentvelden: over mij en contact hebben
   * identiek gevormde FaqBlocks (allebei 6 items, allebei eyebrow +
   * heading), dus er is geen veld in FaqBlock zelf dat dit kan afleiden
   * — vandaar deze twee props op het component in plaats van op het
   * datamodel.
   */
  columns?: 1 | 2;
  /**
   * false (standaard) = over mij: grote font-display-vraag met een
   * ronde plus/kruis-badge. true = contact: kleinere gewone tekst met
   * een chevron die 180° draait.
   */
  compact?: boolean;
};

function chunk<T>(items: T[], parts: number): T[][] {
  const size = Math.ceil(items.length / parts);
  return Array.from({ length: parts }, (_, i) => items.slice(i * size, i * size + size));
}

type FaqListProps = {
  items: FaqItem[];
  startIndex: number;
  baseId: string;
  openIndexes: Set<number>;
  onToggle: (index: number) => void;
  compact: boolean;
  topBorderClassName?: string;
};

function FaqList({
  items,
  startIndex,
  baseId,
  openIndexes,
  onToggle,
  compact,
  topBorderClassName = "border-t",
}: FaqListProps) {
  return (
    <div className={`${topBorderClassName} border-border`}>
      {items.map((item, offset) => {
        const index = startIndex + offset;
        const isOpen = openIndexes.has(index);
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question} className="border-b border-border">
            <h3 className="m-0">
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(index)}
                className={
                  compact
                    ? "flex w-full items-center justify-between gap-5 py-[22px] text-left text-[15.5px] font-medium leading-[1.4] text-text transition-colors hover:text-copper"
                    : "flex w-full items-center justify-between gap-6 py-6 text-left font-display text-[21px] leading-[1.3] text-text transition-colors hover:text-copper"
                }
              >
                {item.question}
                {compact ? (
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`flex-none text-charcoal-muted transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-copper" : ""
                    }`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                ) : (
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border transition-[transform,background-color,border-color,color] duration-[250ms] ${
                      isOpen
                        ? "rotate-45 border-copper bg-copper text-white"
                        : "border-border text-copper"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                )}
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`grid transition-[grid-template-rows] duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={
                    compact
                      ? "max-w-[56ch] pb-6 text-base leading-[1.8] text-text-muted"
                      : "max-w-[62ch] pb-[26px] text-base leading-[1.8] text-text-muted"
                  }
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Faq({ block, columns = 1, compact = false }: FaqProps) {
  const { eyebrow, heading, items } = block;
  const baseId = useId();
  // Referentiegedrag: alles staat standaard dicht, precies zoals in
  // _reference/. Zes tegelijk open ondermijnt het scanbare overzicht dat
  // een accordeon juist moet bieden.
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (items.length === 0) return null;

  if (columns === 2) {
    const [firstHalf, secondHalf] = chunk(items, 2);

    return (
      <section className="bg-surface py-[68px] md:py-20 lg:py-[112px]">
        <Container>
          <Reveal>
            <div className="mb-10">
              {eyebrow && (
                <p className="mb-5 text-eyebrow font-semibold uppercase tracking-[.22em] text-copper-text">
                  {eyebrow}
                </p>
              )}
              {heading && <h2 className="text-h2">{heading}</h2>}
            </div>
            <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-2">
              <FaqList
                items={firstHalf}
                startIndex={0}
                baseId={baseId}
                openIndexes={openIndexes}
                onToggle={toggle}
                compact={compact}
              />
              <FaqList
                items={secondHalf}
                startIndex={firstHalf.length}
                baseId={baseId}
                openIndexes={openIndexes}
                onToggle={toggle}
                compact={compact}
                topBorderClassName="border-t-0 lg:border-t"
              />
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-background py-[68px] md:py-20 lg:py-[112px]">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,34fr)_minmax(0,66fr)] lg:gap-16">
            <div>
              {eyebrow && (
                <p className="mb-5 text-eyebrow font-semibold uppercase tracking-[.22em] text-copper-text">
                  {eyebrow}
                </p>
              )}
              {heading && (
                <h2 className="max-w-[12ch] text-[clamp(1.75rem,2.9vw,2.5rem)]">{heading}</h2>
              )}
            </div>
            <FaqList
              items={items}
              startIndex={0}
              baseId={baseId}
              openIndexes={openIndexes}
              onToggle={toggle}
              compact={compact}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
