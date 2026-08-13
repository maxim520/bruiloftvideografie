import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {CogIcon} from '@sanity/icons/Cog'

/**
 * Spiegelt SiteSettings in types/blocks.ts. Site-brede content: logo,
 * hoofdnavigatie, footer en bedrijfsgegevens — identiek op alle vier
 * pagina's. Bedoeld als singleton (één document); de Studio-structuur
 * die het aanmaken van een tweede exemplaar voorkomt zit niet in dit
 * schemabestand.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site-instellingen',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'logoName',
      title: 'Naam in het logo',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'logoSubline',
      title: 'Onderschrift bij het logo',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'mainNav',
      title: 'Hoofdnavigatie',
      type: 'array',
      of: [{type: 'navLink'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headerCta',
      title: 'Knop in de header',
      type: 'ctaLink',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({
          name: 'aboutText',
          title: 'Introductietekst',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.required().max(300),
        }),
        defineField({
          name: 'socials',
          title: 'Social-mediaprofielen',
          type: 'array',
          of: [{type: 'socialLink'}],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'navLinks',
          title: 'Navigatielinks',
          type: 'array',
          of: [{type: 'navLink'}],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'popularPages',
          title: "Populaire pagina's",
          type: 'array',
          of: [{type: 'navLink'}],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'legalLinks',
          title: 'Juridische links',
          description: 'Bijvoorbeeld privacybeleid en algemene voorwaarden.',
          type: 'array',
          of: [{type: 'navLink'}],
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'business',
      title: 'Bedrijfsgegevens',
      type: 'businessInfo',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'logoName'},
    prepare({title}) {
      return {title: title || 'Site-instellingen'}
    },
  },
})
