/**
 * Gedeelde optielijst voor icoonvelden. Spiegelt IconName in
 * types/blocks.ts — exact deze veertien waarden, niet meer en niet
 * minder. Gebruikt door trustBarItem, benefitItem, processStep en
 * contactFormPerk (geen eigen Sanity-type, puur een gedeelde constante).
 */
export const iconOptions = [
  {title: 'Camera', value: 'camera'},
  {title: 'Video', value: 'video'},
  {title: 'Wereldbol', value: 'globe'},
  {title: 'Ster', value: 'star'},
  {title: 'Oog', value: 'eye'},
  {title: 'Hart', value: 'heart'},
  {title: 'Zon', value: 'sun'},
  {title: 'Foto', value: 'photo'},
  {title: 'Galerij', value: 'gallery'},
  {title: 'Chatballon', value: 'chat'},
  {title: 'Document', value: 'document'},
  {title: 'Kalender', value: 'calendar'},
  {title: 'Kalender met vinkje', value: 'calendar-check'},
  {title: 'Klok', value: 'clock'},
  {title: 'Afspelen', value: 'play'},
] as const
