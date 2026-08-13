import {defineField, defineType} from 'sanity'
import {iconOptions} from './iconOptions'

/** Spiegelt BenefitItem in types/blocks.ts. Eén voordeel/waarde met titel en toelichting. */
export const benefitItem = defineType({
  name: 'benefitItem',
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
