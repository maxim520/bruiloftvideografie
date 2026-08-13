import {defineField, defineType} from 'sanity'
import {iconOptions} from './iconOptions'

/**
 * Spiegelt ProcessStep in types/blocks.ts. Een stap heeft óf een icoon
 * óf een eigen foto — vul daarom maar één van de twee in.
 */
export const processStep = defineType({
  name: 'processStep',
  title: 'Stap',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'text',
      title: 'Toelichting',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'icon',
      title: 'Icoon',
      description: 'Vul dit óf de foto hieronder in, niet allebei.',
      type: 'string',
      options: {list: [...iconOptions]},
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      description: 'Vul dit óf het icoon hierboven in, niet allebei.',
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
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'text', media: 'image'},
  },
})
