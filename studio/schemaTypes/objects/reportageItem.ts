import {defineField, defineType} from 'sanity'

/** Spiegelt ReportageItem in types/blocks.ts. Eén reportage: hoofdfoto, verhaal, kleine galerij. */
export const reportageItem = defineType({
  name: 'reportageItem',
  title: 'Reportage',
  type: 'object',
  fields: [
    defineField({
      name: 'names',
      title: 'Namen van het bruidspaar',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'location',
      title: 'Locatie',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'text',
      title: 'Verhaal',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(250),
    }),
    defineField({
      name: 'mainImage',
      title: 'Hoofdfoto',
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
      name: 'gallery',
      title: 'Fotogalerij',
      type: 'array',
      of: [
        {
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
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Link naar volledige reportage',
      type: 'ctaLink',
    }),
  ],
  preview: {
    select: {title: 'names', subtitle: 'location', media: 'mainImage'},
  },
})
