import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {ImagesIcon} from '@sanity/icons/Images'

/**
 * Spiegelt PortfolioGridBlock in types/blocks.ts. Introductietekst met
 * een raster uitgelichte portfoliofoto's.
 * Komt voor op: home.
 */
export const portfolioGrid = defineType({
  name: 'portfolioGrid',
  title: 'Portfoliogrid',
  type: 'object',
  icon: ImagesIcon,
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
      name: 'cta',
      title: 'Knop',
      type: 'ctaLink',
    }),
    defineField({
      name: 'images',
      title: "Foto's",
      description:
        'De eerste foto is de uitgelichte foto; de volgorde van de rest bepaalt de plek in het raster.',
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
  ],
  preview: {
    select: {title: 'heading', media: 'images.0'},
  },
})
