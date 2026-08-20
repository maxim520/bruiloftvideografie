import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {ImagesIcon} from '@sanity/icons/Images'

/** Eén blok in wedding.storyBlocks (Fase 4): twee foto's naast elkaar. */
export const storyImagePair = defineType({
  name: 'storyImagePair',
  title: 'Fotoduo',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: "Foto's",
      description: 'Precies twee foto\'s, naast elkaar.',
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
      validation: (Rule) => Rule.required().length(2),
    }),
    defineField({
      name: 'layout',
      title: 'Verhouding',
      type: 'string',
      options: {
        list: [
          {title: 'Gelijk (50/50)', value: 'even'},
          {title: 'Asymmetrisch (60/40)', value: 'asymmetric'},
        ],
      },
      initialValue: 'even',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {media: 'images.0', subtitle: 'layout'},
    prepare({media, subtitle}) {
      return {title: 'Fotoduo', media, subtitle}
    },
  },
})
