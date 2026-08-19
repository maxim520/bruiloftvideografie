import {defineField, defineType} from 'sanity'

/**
 * Eén dienst/pakket. `startingPrice` is bewust optioneel (Fase 2-regel:
 * "verzin geen prijzen") — een pakket zonder ingevulde prijs toont in de
 * UI simpelweg geen prijsregel, in plaats van een placeholder-bedrag.
 */
export const pricingItem = defineType({
  name: 'pricingItem',
  title: 'Dienst / pakket',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      description: 'Bijv. "Trouwfotografie" of "Fotografie + film".',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'description',
      title: 'Korte omschrijving',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'startingPrice',
      title: 'Vanafprijs in euro (optioneel)',
      description:
        'Leeg laten totdat er een echte, bevestigde prijs is — dan verschijnt er geen prijsregel op de site (geen placeholder-bedrag).',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'features',
      title: 'Inbegrepen',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'cta',
      title: 'Knop',
      type: 'ctaLink',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'startingPrice'},
    prepare({title, subtitle}) {
      return {title, subtitle: subtitle ? `vanaf €${subtitle}` : 'geen prijs ingevuld'}
    },
  },
})
