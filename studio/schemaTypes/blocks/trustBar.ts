import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {TrendUpwardIcon} from '@sanity/icons/TrendUpward'

/**
 * Spiegelt TrustBarBlock in types/blocks.ts. Balk met korte kernfeiten
 * direct onder de hero.
 * Komt voor op: home.
 */
export const trustBar = defineType({
  name: 'trustBar',
  title: 'Vertrouwensbalk',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Kernfeiten',
      type: 'array',
      of: [{type: 'trustBarItem'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {items: 'items'},
    prepare({items}) {
      return {
        title: 'Vertrouwensbalk',
        subtitle: Array.isArray(items) ? `${items.length} kernfeiten` : undefined,
      }
    },
  },
})
