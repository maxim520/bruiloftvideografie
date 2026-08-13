import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {CaseIcon} from '@sanity/icons/Case'

/**
 * Spiegelt BusinessInfo in types/blocks.ts. Voedt zowel de footer/
 * contactkaart als de LocalBusiness structured data op de pagina's.
 */
export const businessInfo = defineType({
  name: 'businessInfo',
  title: 'Bedrijfsgegevens',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'phone',
      title: 'Telefoonnummer',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'email',
      title: 'E-mailadres',
      type: 'string',
      validation: (Rule) => Rule.required().email().max(80),
    }),
    defineField({
      name: 'city',
      title: 'Plaats',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'region',
      title: 'Provincie',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
  ],
  preview: {
    select: {title: 'city', subtitle: 'phone'},
  },
})
