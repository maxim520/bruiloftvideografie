import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {TextIcon} from '@sanity/icons/Text'

/**
 * Eén blok in wedding.storyBlocks (Fase 4): een kort stuk tekst tussen
 * de foto's — bewust géén portable text (rich text), want de bedoeling
 * is spaarzaam gebruik (begin van de dag, ceremonie, diner, ...), geen
 * blogachtige tekstmuur. Zie components/wedding/StoryLayout.tsx.
 */
export const storyText = defineType({
  name: 'storyText',
  title: 'Tekst',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Kopje (optioneel)',
      description: 'Bijv. "De ceremonie" of "Het diner".',
      type: 'string',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'text',
      title: 'Tekst',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(400),
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'text'},
    prepare({title, subtitle}) {
      return {title: title || 'Tekst', subtitle}
    },
  },
})
