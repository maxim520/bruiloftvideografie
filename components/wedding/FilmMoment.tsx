"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import type { SanityImage } from "@/types/blocks";

type FilmMomentProps = {
  film: { source: "url"; url: string } | { source: "upload"; url: string };
  posterImage: SanityImage;
  coupleNames: string;
};

/**
 * Zet een YouTube/Vimeo-kijk-URL om in de bijbehorende embed-URL. Werkt
 * de ingevulde URL al als embed (bv. al .../embed/... of player.vimeo),
 * dan blijft die ongewijzigd — deze functie faalt nooit hard, in het
 * ergste geval blijft de originele URL staan (redacteur plakt dan zelf
 * al een embed-vriendelijke link, zoals het veldlabel in Studio vraagt).
 */
function toEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (host === "youtube.com" && parsed.searchParams.has("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

/**
 * Sectie 10: de film krijgt een eigen cinematografisch moment, geen los
 * technisch blok. "Deferred load": de video wordt pas aangemaakt ná een
 * klik van de bezoeker — vóór die klik is er alleen een posterfoto +
 * afspeelknop, geen enkele video-request of -script. Vandaar "use client":
 * de klik-naar-onthullen-interactie heeft state nodig, maar er wordt
 * niets opgehaald en er is niets dat server- en client-rendering kan
 * laten verschillen (de poster ziet er vóór elke interactie identiek
 * uit), dus geen hydration-risico.
 *
 * Twee bronnen, één weergave: een externe link (YouTube/Vimeo) wordt als
 * embed-iframe getoond, een eigen upload als native <video>-element met
 * bedieningselementen — dezelfde deferred-load-aanpak, alleen het
 * daadwerkelijke afspeelelement verschilt.
 */
export default function FilmMoment({ film, posterImage, coupleNames }: FilmMomentProps) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = film.source === "url" ? toEmbedUrl(film.url) : null;

  return (
    <section className="bg-ink py-20 text-white md:py-28">
      <Container>
        <Reveal>
          <p className="mb-10 text-center font-display text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.3]">
            Niet alleen zien.
            <br />
            Opnieuw beleven.
          </p>

          <div className="relative mx-auto aspect-video w-full max-w-[960px] overflow-hidden rounded-[3px] bg-black">
            {playing && film.source === "upload" ? (
              <video
                src={film.url}
                title={`Trouwfilm ${coupleNames}`}
                className="h-full w-full"
                controls
                autoPlay
                playsInline
              />
            ) : playing && embedUrl ? (
              <iframe
                src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                title={`Trouwfilm ${coupleNames}`}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 h-full w-full"
                aria-label={`Speel de trouwfilm van ${coupleNames} af`}
              >
                <SafeImage
                  image={posterImage}
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.02]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-[rgba(20,14,11,.28)] transition-colors duration-200 group-hover:bg-[rgba(20,14,11,.4)]"
                />
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/[0.16] text-white backdrop-blur-[3px] transition-colors duration-200 group-hover:border-copper group-hover:bg-copper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
