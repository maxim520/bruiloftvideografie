import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {ImageIcon} from '@sanity/icons/Image'

/**
 * Eén blok in wedding.storyBlocks (Fase 4): één foto met een gekozen
 * editorial-uitvoering. De variant bepaalt alleen de layout/uitsnede in
 * de component (components/wedding/StoryLayout.tsx) — geen los veld per
 * variant, dat zou het CMS onnodig ingewikkelder maken.
 */
export const storyImage = defineType({
  name: 'storyImage',
  title: 'Foto',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          description: 'Beschrijf wat er te zien is, niet "foto van bruiloft".',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Uitvoering',
      type: 'string',
      options: {
        list: [
          {title: 'Full-bleed (edge-to-edge)', value: 'full-bleed'},
          {title: 'Full-width landscape', value: 'full-width-landscape'},
          {title: 'Grote portrait', value: 'large-portrait'},
          {title: 'Klein, editorial (met marge)', value: 'small-editorial'},
        ],
      },
      initialValue: 'full-width-landscape',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {media: 'image', subtitle: 'variant'},
    prepare({media, subtitle}) {
      return {title: 'Foto', media, subtitle}
    },
  },
})
