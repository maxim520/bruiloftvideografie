import {defineField, defineType} from 'sanity'

/** Spiegelt FilmItem in types/blocks.ts. Eén trouwfilm-kaart met thumbnail en link. */
export const filmItem = defineType({
  name: 'filmItem',
  title: 'Film',
  type: 'object',
  fields: [
    defineField({
      name: 'names',
      title: 'Namen van het bruidspaar',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      description: 'Bijv. "Highlight film"',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'image',
      title: 'Thumbnail',
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
      name: 'href',
      title: 'Link naar de film',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'names', subtitle: 'label', media: 'image'},
  },
})
