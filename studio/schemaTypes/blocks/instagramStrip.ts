import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {ImagesIcon} from '@sanity/icons/Images'

/**
 * Spiegelt InstagramStripBlock in types/blocks.ts. Strip met
 * Instagram-achtige foto's en link naar het profiel.
 * Komt voor op: home.
 */
export const instagramStrip = defineType({
  name: 'instagramStrip',
  title: 'Instagramstrip',
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
      description: 'Bijvoorbeeld de link naar het Instagramprofiel.',
      type: 'ctaLink',
    }),
    defineField({
      name: 'images',
      title: "Foto's",
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
