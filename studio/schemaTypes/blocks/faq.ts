import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'

/**
 * Spiegelt FaqBlock in types/blocks.ts. Uitklapbare lijst met
 * veelgestelde vragen.
 * Komt voor op: over mij, contact.
 */
export const faq = defineType({
  name: 'faq',
  title: 'Veelgestelde vragen',
  type: 'object',
  icon: HelpCircleIcon,
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
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'items',
      title: 'Vragen',
      type: 'array',
      of: [{type: 'faqItem'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare({title, items}) {
      return {
        title: title || 'Veelgestelde vragen',
        subtitle: Array.isArray(items) ? `${items.length} vragen` : undefined,
      }
    },
  },
})
