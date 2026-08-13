import {defineField, defineType} from 'sanity'

/** Spiegelt ReviewItem in types/blocks.ts. Eén review van een bruidspaar. */
export const reviewItem = defineType({
  name: 'reviewItem',
  title: 'Review',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Citaat',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: 'name',
      title: 'Naam',
      description: 'Bijv. "Eva & Mark"',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'avatar',
      title: 'Foto',
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
  ],
  preview: {
    select: {title: 'name', subtitle: 'quote', media: 'avatar'},
  },
})
