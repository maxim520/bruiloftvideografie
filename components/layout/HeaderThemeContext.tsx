"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";

/**
 * Sectie "Header/navigatie moet automatisch contrasteren" (Fase 7):
 * "light" = lichte (witte) headertekst, voor gebruik boven donkere media.
 * "dark"  = donkere headertekst, voor gebruik boven lichte achtergronden.
 * Namen verwijzen bewust naar de TEKSTKLEUR, niet de achtergrondkleur —
 * zelfde semantiek als letterlijk gevraagd in de brief, om verwarring
 * tussen die twee te voorkomen.
 *
 * "light" is de default: elke bestaande hero (Hero.tsx, WeddingHero.tsx)
 * is een foto met donkere overlay, dus dat is verreweg het vaakst
 * voorkomende geval. Alleen paginas die ergens ánders mee openen (zoals
 * /verhalen, met een lichte achtergrond bovenaan) hoeven expliciet
 * <SetHeaderTheme theme="dark" /> te renderen — zie hieronder.
 */
export type HeaderTheme = "light" | "dark";

const HeaderThemeContext = createContext<{
  theme: HeaderTheme;
  setTheme: (theme: HeaderTheme) => void;
} | null>(null);

export function HeaderThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<HeaderTheme>("light");
  return (
    <HeaderThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </HeaderThemeContext.Provider>
  );
}

export function useHeaderTheme() {
  const ctx = useContext(HeaderThemeContext);
  if (!ctx) throw new Error("useHeaderTheme moet binnen HeaderThemeProvider gebruikt worden.");
  return ctx.theme;
}

/**
 * Door een pagina als eerste element gerenderd om af te wijken van de
 * "light"-default. `useLayoutEffect` (i.p.v. useEffect) zet de waarde
 * vóór de volgende browser-paint, zodat er geen zichtbare flits van het
 * verkeerde thema ontstaat tussen hydratie en het echte resultaat. Zet
 * bij unmount (routewissel) terug naar "light", zodat een volgende
 * pagina zonder eigen SetHeaderTheme altijd weer de juiste default heeft
 * i.p.v. het thema van de vorige pagina te "erven".
 */
export function SetHeaderTheme({ theme }: { theme: HeaderTheme }) {
  const ctx = useContext(HeaderThemeContext);
  if (!ctx) throw new Error("SetHeaderTheme moet binnen HeaderThemeProvider gebruikt worden.");
  const { setTheme } = ctx;

  useLayoutEffect(() => {
    setTheme(theme);
    return () => setTheme("light");
  }, [theme, setTheme]);

  return null;
}
