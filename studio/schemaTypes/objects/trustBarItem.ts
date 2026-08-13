import {defineField, defineType} from 'sanity'
import {iconOptions} from './iconOptions'

/** Spiegelt TrustBarItem in types/blocks.ts. Bijv. "500+ / Bruiloften vastgelegd". */
export const trustBarItem = defineType({
  name: 'trustBarItem',
  title: 'Kernfeit',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Cijfer of kernwoord',
      description: 'Bijv. "500+"',
      type: 'string',
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: 'text',
      title: 'Toelichting',
      description: 'Bijv. "Bruiloften vastgelegd"',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
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
