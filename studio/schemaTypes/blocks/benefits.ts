import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {CheckmarkCircleIcon} from '@sanity/icons/CheckmarkCircle'

/**
 * Spiegelt BenefitsBlock in types/blocks.ts. Lijst van voordelen of
 * kernwaarden, optioneel met begeleidende tekst, knop en/of beeld.
 * Komt voor op: home ("waarom ons"), over mij ("mijn aanpak"),
 * fotografie (introductie-voordelen).
 */
export const benefits = defineType({
  name: 'benefits',
  title: 'Voordelen',
  type: 'object',
  icon: CheckmarkCircleIcon,
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
      title: 'Voordelen',
      type: 'array',
      of: [{type: 'benefitItem'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', items: 'items', media: 'image'},
    prepare({title, items, media}) {
      return {
        title: title || 'Voordelen',
        subtitle: Array.isArray(items) ? `${items.length} voordelen` : undefined,
        media,
      }
    },
  },
})
