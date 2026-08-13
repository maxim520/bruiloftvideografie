import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {LinkIcon} from '@sanity/icons/Link'

/** Spiegelt CtaLink in types/blocks.ts. */
export const ctaLink = defineType({
  name: 'ctaLink',
  title: 'Knop / link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Knoptekst',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'href',
      title: 'Bestemming',
      description: 'Een pad binnen de site (bijv. /contact of #aanvraag), of een volledige URL.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
