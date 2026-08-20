import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {SplitHorizontalIcon} from '@sanity/icons/SplitHorizontal'

/**
 * Eén blok in wedding.storyBlocks (Fase 4): pure witruimte, geen content
 * — een bewuste adempauze tussen twee delen van het verhaal.
 */
export const storySpacer = defineType({
  name: 'storySpacer',
  title: 'Witruimte',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    defineField({
      name: 'size',
      title: 'Grootte',
      type: 'string',
      options: {
        list: [
          {title: 'Middel', value: 'md'},
          {title: 'Groot', value: 'lg'},
          {title: 'Extra groot', value: 'xl'},
        ],
      },
      initialValue: 'lg',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {subtitle: 'size'},
    prepare({subtitle}) {
      return {title: 'Witruimte', subtitle}
    },
  },
})
