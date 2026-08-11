"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

const HIDDEN_CLASSES = ["opacity-0", "translate-y-[18px]"];
const VISIBLE_CLASSES = ["opacity-100", "translate-y-0"];

/**
 * Fade-up-bij-scroll, één keer per element. Geen framer-motion: dezelfde
 * IntersectionObserver + CSS-transitie die al in _reference/ staat
 * (.reveal / .reveal.is-visible), nu als component. De klassen worden
 * imperatief op het DOM-element geschakeld (geen React state) zodat dit
 * puur een synchronisatie met een externe observer blijft.
 * prefers-reduced-motion wordt zowel in JS (observer overslaan) als via
 * Tailwinds motion-reduce: afgedwongen.
 */
export default function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reveal = () => {
      node.classList.remove(...HIDDEN_CLASSES);
      node.classList.add(...VISIBLE_CLASSES);
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        ...HIDDEN_CLASSES,
        "transition-[opacity,transform] duration-[600ms] ease-out",
        "motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
