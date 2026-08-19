import {defineField, defineType} from 'sanity'

/** Eén leverancier bij een bruiloft (bijv. locatie, bloemist, visagie). */
export const supplier = defineType({
  name: 'supplier',
  title: 'Leverancier',
  type: 'object',
  fields: [
    defineField({
      name: 'role',
      title: 'Rol',
      description: 'Bijv. "Locatie", "Bloemist", "Visagie", "Trouwjurk".',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'url',
      title: 'Website (optioneel)',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role'},
  },
})
