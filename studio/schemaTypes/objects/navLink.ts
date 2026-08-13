import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {LinkIcon} from '@sanity/icons/Link'

/** Spiegelt NavLink in types/blocks.ts. Gebruikt in navigatie- en linklijsten. */
export const navLink = defineType({
  name: 'navLink',
  title: 'Navigatielink',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: 'href',
      title: 'Bestemming',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})
