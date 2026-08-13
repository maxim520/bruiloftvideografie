import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {StarIcon} from '@sanity/icons/Star'

/**
 * Spiegelt ReviewsBlock in types/blocks.ts. Raster met reviews van
 * bruidsparen.
 * Komt voor op: home, over mij.
 */
export const reviews = defineType({
  name: 'reviews',
  title: 'Reviews',
  type: 'object',
  icon: StarIcon,
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
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      of: [{type: 'reviewItem'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Knop',
      type: 'ctaLink',
    }),
  ],
  preview: {
    select: {title: 'heading', reviews: 'reviews'},
    prepare({title, reviews}) {
      return {
        title: title || 'Reviews',
        subtitle: Array.isArray(reviews) ? `${reviews.length} reviews` : undefined,
      }
    },
  },
})
