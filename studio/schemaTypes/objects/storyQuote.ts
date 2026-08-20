import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {BlockquoteIcon} from '@sanity/icons/Blockquote'

/**
 * Eén blok in wedding.storyBlocks (Fase 4): een korte pull-quote MIDDEN
 * in het verhaal — anders dan wedding.testimonial (de grote, aparte
 * editorial quote-sectie op vaste positie, zie TestimonialQuote.tsx).
 * Bewust optioneel en los van elkaar: een reportage kan beide, één van
 * beide, of geen van beide hebben.
 */
export const storyQuote = defineType({
  name: 'storyQuote',
  title: 'Pull-quote',
  type: 'object',
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Citaat',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'attribution',
      title: 'Toeschrijving (optioneel)',
      description: 'Bijv. "Sanne & Daan" of de naam van de fotograaf.',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
  ],
  preview: {
    select: {title: 'quote', subtitle: 'attribution'},
  },
})
