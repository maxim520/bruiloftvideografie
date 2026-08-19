import {defineField, defineType} from 'sanity'
// Subpath-import: zie objects/socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {CreditCardIcon} from '@sanity/icons/CreditCard'

/**
 * Fase 2-foundation: "Investering"/pakketten-sectie. Bewust leeg bruikbaar
 * — de Next.js-component rendert niets zolang `items` leeg is, dus dit
 * blok kan al aan een pagina toegevoegd worden zonder dat er meteen
 * (verzonnen) prijzen hoeven te staan.
 */
export const pricing = defineType({
  name: 'pricing',
  title: 'Investering / pakketten',
  type: 'object',
  icon: CreditCardIcon,
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
      title: "Diensten / pakketten",
      type: 'array',
      of: [{type: 'pricingItem'}],
    }),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare({title, items}) {
      return {
        title: title || 'Investering / pakketten',
        subtitle: Array.isArray(items) ? `${items.length} pakketten` : 'nog leeg',
      }
    },
  },
})
