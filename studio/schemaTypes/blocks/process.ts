import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {ActivityIcon} from '@sanity/icons/Activity'

/**
 * Spiegelt ProcessBlock in types/blocks.ts. Stapsgewijze uitleg van de
 * werkwijze, optioneel met achtergrondbeeld.
 * Komt voor op: home ("werkwijze"), over mij ("zo werk ik"),
 * fotografie ("mijn aanpak").
 */
export const process = defineType({
  name: 'process',
  title: 'Werkwijze',
  type: 'object',
  icon: ActivityIcon,
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
      name: 'backgroundImage',
      title: 'Achtergrondfoto',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          description:
            'Mag leeg blijven: dit achtergrondbeeld is puur decoratief (een vervaagde foto achter de stappen) en hoort door een schermlezer te worden overgeslagen.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'steps',
      title: 'Stappen',
      description:
        'Elke stap heeft óf een icoon óf een eigen foto, nooit allebei — zie de toelichting bij die velden.',
      type: 'array',
      of: [{type: 'processStep'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', steps: 'steps'},
    prepare({title, steps}) {
      return {
        title: title || 'Werkwijze',
        subtitle: Array.isArray(steps) ? `${steps.length} stappen` : undefined,
      }
    },
  },
})
