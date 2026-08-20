"use client";

import { useEffect, useRef, useState } from "react";
import SafeImage from "./SafeImage";
import type { SanityImage } from "@/types/blocks";

type HeroMediaProps = {
  image: SanityImage;
  videoUrl?: string;
  sizes: string;
  className?: string;
  preload?: boolean;
  useHotspot?: boolean;
};

/**
 * Sectie 2/8/9/10/35/36 (Fase 5): image-first, video als progressive
 * enhancement — nooit andersom. De poster (SafeImage) rendert altijd
 * meteen, exact zoals vóór deze fase: zelfde `preload`/fetchPriority,
 * zelfde responsive srcset, zelfde LCP-behandeling. De video is
 * uitsluitend een ná-hydratie, client-side toevoeging die de poster
 * NOOIT vervangt vóórdat hij daadwerkelijk speelt.
 *
 * Waarom dit geen hydration-mismatch geeft: de allereerste render (zowel
 * server als client) toont altijd alleen de poster — de video-tak hangt
 * af van `shouldAttemptVideo`, een state die pas ná mount op `true` kan
 * gaan (useEffect). Server en client renderen dus voor de hydratie-check
 * exact dezelfde HTML.
 *
 * Beslissingen die hierin verwerkt zitten (zie de Fase 5-brief):
 * - prefers-reduced-motion: reduce  -> video wordt nooit geprobeerd.
 * - navigator.connection.saveData / effective type 2g/slow-2g -> nooit.
 * - viewport < 768px (mobiel)       -> nooit; er is geen apart, lichter
 *   mobiel videobestand beschikbaar, en de poster is dan "een volwaardig
 *   resultaat" (brief, sectie 11) — geen video-vereiste op mobiel.
 * - requestIdleCallback (met setTimeout-fallback voor Safari)          -> de
 *   video-request start pas als de hoofdthread rustig is, niet meteen
 *   naast de kritieke eerste-paint-resources.
 * - autoplay geblokkeerd of een echte load/decode-fout                -> stil
 *   terugvallen op de poster, geen foutmelding (brief, sectie 9).
 */
export default function HeroMedia({
  image,
  videoUrl,
  sizes,
  className,
  preload,
  useHotspot,
}: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldAttemptVideo, setShouldAttemptVideo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    if (!videoUrl) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    if (isMobileViewport) return;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /2g/.test(connection.effectiveType)) return;

    // Safari kent geen requestIdleCallback — een korte setTimeout is daar
    // de vergelijkbare "niet meteen, maar ook niet pas heel laat"-fallback.
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(() => setShouldAttemptVideo(true));
      return () => window.cancelIdleCallback(handle);
    }
    const timeout = window.setTimeout(() => setShouldAttemptVideo(true), 200);
    return () => window.clearTimeout(timeout);
  }, [videoUrl]);

  useEffect(() => {
    if (!shouldAttemptVideo) return;
    const el = videoRef.current;
    if (!el) return;

    el.play().catch(() => {
      // Autoplay geblokkeerd (batterijbesparing, brower-beleid, ...) —
      // poster blijft gewoon staan, geen foutmelding nodig.
      setShouldAttemptVideo(false);
    });
  }, [shouldAttemptVideo]);

  return (
    <>
      <SafeImage
        image={image}
        preload={preload}
        sizes={sizes}
        className={`${className ?? ""} transition-opacity duration-700 ${videoPlaying ? "opacity-0" : "opacity-100"}`}
        useHotspot={useHotspot}
      />
      {shouldAttemptVideo && videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setVideoPlaying(true)}
          onError={() => setShouldAttemptVideo(false)}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoPlaying ? "opacity-100" : "opacity-0"
          } ${className ?? ""}`}
        />
      )}
    </>
  );
}
