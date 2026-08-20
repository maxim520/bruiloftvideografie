import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {ImageIcon} from '@sanity/icons/Image'
import {pagePresetOptions} from '../objects/pagePresetOptions'

/**
 * Spiegelt HeroBlock in types/blocks.ts. Grote openingssectie met
 * achtergrondbeeld, titel en één of twee knoppen.
 * Komt voor op: home, over mij, fotografie, contact.
 */
export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (klein label boven de titel)',
      type: 'string',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'heading',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: 'headingLine2',
      title: 'Titel, tweede regel',
      description: 'De titel breekt bewust in twee regels. Laat leeg voor één regel.',
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'subheading',
      title: 'Ondertitel',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'image',
      title: 'Achtergrondfoto',
      description:
        'Verplicht, ook wanneer hieronder voor video gekozen wordt: deze foto is dan de poster (eerste render, LCP-veilig) en de fallback zodra video niet kan afspelen.',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mediaType',
      title: 'Type achtergrond',
      description:
        'De foto hierboven blijft altijd de basis (poster + fallback). Kies "Video" om die foto aan te vullen met een achtergrondvideo.',
      type: 'string',
      options: {
        list: [
          {title: 'Alleen foto', value: 'image'},
          {title: 'Video (foto blijft poster/fallback)', value: 'video'},
        ],
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'video',
      title: 'Achtergrondvideo',
      description:
        'Alleen zichtbaar op apparaten waar het technisch en gepast is (niet op mobiel, niet bij "verminderde beweging"-instellingen, niet bij een trage verbinding) — de foto blijft dan gewoon staan, dat is geen fout. Upload een al gecomprimeerd, web-geoptimaliseerd bestand: H.264 MP4, kort en in een loop af te spelen, bij voorkeur onder de ~15 MB. Sanity comprimeert dit zelf niet.',
      type: 'file',
      options: {accept: 'video/mp4,video/webm'},
      hidden: ({parent}: {parent?: {mediaType?: string}}) => parent?.mediaType !== 'video',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {mediaType?: string} | undefined;
          if (parent?.mediaType === 'video' && !value) {
            return 'Verplicht wanneer "Type achtergrond" op Video staat.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primaire knop',
      type: 'ctaLink',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secundaire knop',
      type: 'ctaLink',
    }),
    defineField({
      name: 'size',
      title: 'Pagina-uitvoering',
      description:
        'Bepaalt de hoogte, foto-uitsnede en koplettergrootte — deze zijn per pagina vastgelegd in de code. Kies de pagina waarop dit blok staat.',
      type: 'string',
      options: {list: [...pagePresetOptions]},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showScrollIndicator',
      title: 'Toon scroll-pijl',
      description: 'De knipperende pijl onderin de hero. Alleen bedoeld voor de homepage.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'eyebrow', media: 'image'},
  },
})
