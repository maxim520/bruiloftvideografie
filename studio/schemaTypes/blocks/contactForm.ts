import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {EnvelopeIcon} from '@sanity/icons/Envelope'

/**
 * Spiegelt ContactFormBlock in types/blocks.ts. Contactsectie met
 * introtekst, indieningsknoplabel, voordelen, directe contactgegevens en
 * de succesmelding na verzending. De formuliervelden zelf (labels,
 * placeholders, select-opties, validatiemeldingen) zijn vast in code.
 * Komt voor op: contact.
 */
export const contactForm = defineType({
  name: 'contactForm',
  title: 'Contactformulier',
  type: 'object',
  icon: EnvelopeIcon,
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
      name: 'intro',
      title: 'Introtekst',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'submitLabel',
      title: 'Tekst op de verzendknop',
      type: 'string',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'perks',
      title: 'Voordelen naast het formulier',
      type: 'array',
      of: [{type: 'contactFormPerk'}],
    }),
    defineField({
      name: 'directHeading',
      title: 'Titel boven de directe contactgegevens',
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'phone',
      title: 'Telefoonnummer',
      type: 'string',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'email',
      title: 'E-mailadres',
      type: 'string',
      validation: (Rule) => Rule.email().max(80),
    }),
    defineField({
      name: 'location',
      title: 'Locatie',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'successHeading',
      title: 'Titel van de succesmelding',
      description: 'Wordt getoond nadat het formulier is verzonden.',
      type: 'string',
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: 'successText',
      title: 'Tekst van de succesmelding',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'successCta',
      title: 'Knop bij de succesmelding',
      type: 'ctaLink',
    }),
  ],
  preview: {
    select: {title: 'heading'},
  },
})
