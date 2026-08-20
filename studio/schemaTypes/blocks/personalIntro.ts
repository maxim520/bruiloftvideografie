import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {UserIcon} from '@sanity/icons/User'

/**
 * Spiegelt PersonalIntroBlock in types/blocks.ts. Compacte "dit is de
 * persoon achter het merk"-sectie — bewust géén tweede storyIntro
 * (die is er al, voluit, op /over-mij): één korte alinea, één foto, één
 * CTA naar /over-mij. Komt voor op: home (Fase 6, sectie 18).
 */
export const personalIntro = defineType({
  name: 'personalIntro',
  title: 'Persoonlijke introductie (compact)',
  type: 'object',
  icon: UserIcon,
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
      description: 'Bijv. "Hoi, ik ben Jeroen."',
      type: 'string',
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: 'text',
      title: 'Korte tekst',
      description: 'Eén korte alinea — dit is geen tweede Over mij-pagina.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: 'image',
      title: 'Foto',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'Knop',
      type: 'ctaLink',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
  },
})
