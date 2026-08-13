import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {ImageIcon} from '@sanity/icons/Image'
import {pagePresetOptions} from '../objects/pagePresetOptions'

/**
 * Spiegelt FinalCtaBlock in types/blocks.ts. Afsluitende call-to-action
 * met achtergrondbeeld.
 * Komt voor op: home, over mij, fotografie, contact.
 */
export const finalCta = defineType({
  name: 'finalCta',
  title: 'Afsluitende call-to-action',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: 'text',
      title: 'Tekst',
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
      name: 'cta',
      title: 'Knop',
      type: 'ctaLink',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Pagina-uitvoering',
      description:
        'Bepaalt de hoogte, koplettergrootte en foto-uitsnede — deze zijn per pagina vastgelegd in de code. Kies de pagina waarop dit blok staat.',
      type: 'string',
      options: {list: [...pagePresetOptions]},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
  },
})
