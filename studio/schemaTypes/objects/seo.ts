import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {SearchIcon} from '@sanity/icons/Search'

/** Spiegelt Seo in types/blocks.ts. */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'SEO-titel',
      description: 'Verschijnt in het browsertabblad en in zoekresultaten. Maximaal ~70 tekens.',
      type: 'string',
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: 'description',
      title: 'SEO-omschrijving',
      description: 'De korte tekst onder de titel in zoekresultaten. Maximaal ~160 tekens.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Deelafbeelding (social media)',
      description: 'Getoond wanneer deze pagina gedeeld wordt op bijv. Facebook of WhatsApp.',
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
    select: {title: 'title', subtitle: 'description'},
  },
})
