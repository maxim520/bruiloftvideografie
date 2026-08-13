import {defineField, defineType} from 'sanity'

/** Spiegelt FaqItem in types/blocks.ts. Eén vraag-antwoordpaar. */
export const faqItem = defineType({
  name: 'faqItem',
  title: 'Vraag',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Vraag',
      type: 'string',
      validation: (Rule) => Rule.required().max(150),
    }),
    defineField({
      name: 'answer',
      title: 'Antwoord',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(600),
    }),
  ],
  preview: {
    select: {title: 'question', subtitle: 'answer'},
  },
})
