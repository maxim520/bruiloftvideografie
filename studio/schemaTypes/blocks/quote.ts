import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {BlockquoteIcon} from '@sanity/icons/Blockquote'

/**
 * Spiegelt QuoteBlock in types/blocks.ts. Uitgelichte quote met
 * bronvermelding.
 * Komt voor op: over mij.
 */
export const quote = defineType({
  name: 'quote',
  title: 'Quote',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'attribution',
      title: 'Bronvermelding',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
  ],
  preview: {
    select: {title: 'quote', subtitle: 'attribution'},
  },
})
