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
