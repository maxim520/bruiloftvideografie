import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {BarChartIcon} from '@sanity/icons/BarChart'

/**
 * Spiegelt StatsBlock in types/blocks.ts. Cijfers/kengetallen met
 * begeleidende tekst en knop.
 * Komt voor op: over mij ("ervaring").
 */
export const stats = defineType({
  name: 'stats',
  title: 'Cijfers',
  type: 'object',
  icon: BarChartIcon,
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
      name: 'text',
      title: 'Tekst',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'cta',
      title: 'Knop',
      type: 'ctaLink',
    }),
    defineField({
      name: 'items',
      title: 'Cijfers',
      type: 'array',
      of: [{type: 'statItem'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare({title, items}) {
      return {
        title: title || 'Cijfers',
        subtitle: Array.isArray(items) ? `${items.length} cijfers` : undefined,
      }
    },
  },
})
