import {defineField, defineType} from 'sanity'
import {iconOptions} from './iconOptions'

/** Spiegelt ContactFormPerk in types/blocks.ts. Eén voordeel naast het contactformulier. */
export const contactFormPerk = defineType({
  name: 'contactFormPerk',
  title: 'Voordeel',
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
      type: 'string',
      options: {list: [...iconOptions]},
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'text'},
  },
})
