import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {DocumentsIcon} from '@sanity/icons/Documents'

/**
 * Spiegelt ReportageListBlock in types/blocks.ts. Lijst van uitgelichte
 * trouwreportages.
 * Komt voor op: fotografie.
 */
export const reportageList = defineType({
  name: 'reportageList',
  title: 'Reportages',
  type: 'object',
  icon: DocumentsIcon,
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
      name: 'cta',
      title: 'Knop',
      type: 'ctaLink',
    }),
    defineField({
      name: 'reportages',
      title: 'Reportages',
      type: 'array',
      of: [{type: 'reportageItem'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', reportages: 'reportages'},
    prepare({title, reportages}) {
      return {
        title: title || 'Reportages',
        subtitle: Array.isArray(reportages) ? `${reportages.length} reportages` : undefined,
      }
    },
  },
})
