import {defineField, defineType} from 'sanity'

/** Spiegelt StatItem in types/blocks.ts. Bijv. "500+" met label "Bruiloften vastgelegd". */
export const statItem = defineType({
  name: 'statItem',
  title: 'Statistiek',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Cijfer',
      description: 'Bijv. "500+" of "8+"',
      type: 'string',
      validation: (Rule) => Rule.required().max(10),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
  ],
  preview: {
    select: {title: 'value', subtitle: 'label'},
  },
})
