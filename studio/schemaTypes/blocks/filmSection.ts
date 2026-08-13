import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {PlayIcon} from '@sanity/icons/Play'

/**
 * Spiegelt FilmSectionBlock in types/blocks.ts. Sectie met uitgelichte
 * trouwfilms.
 * Komt voor op: home.
 */
export const filmSection = defineType({
  name: 'filmSection',
  title: 'Films',
  type: 'object',
  icon: PlayIcon,
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
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: 'cta',
      title: 'Knop',
      type: 'ctaLink',
    }),
    defineField({
      name: 'films',
      title: 'Films',
      type: 'array',
      of: [{type: 'filmItem'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', films: 'films'},
    prepare({title, films}) {
      return {
        title,
        subtitle: Array.isArray(films) ? `${films.length} films` : undefined,
      }
    },
  },
})
