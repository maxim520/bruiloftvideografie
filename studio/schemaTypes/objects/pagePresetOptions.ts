/**
 * Gedeelde optielijst voor het `size`-veld van hero en finalCta. Spiegelt
 * PagePreset in types/blocks.ts — welke pagina dit blok-exemplaar volgt
 * voor hoogte, foto-uitsnede en koplettergrootte (geen contentveld, puur
 * een sleutel naar een vast preset in de component-code).
 */
export const pagePresetOptions = [
  {title: 'Home', value: 'home'},
  {title: 'Over mij', value: 'over-mij'},
  {title: 'Fotografie', value: 'fotografie'},
  {title: 'Contact', value: 'contact'},
] as const
