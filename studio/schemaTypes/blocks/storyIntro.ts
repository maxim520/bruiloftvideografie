import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {UserIcon} from '@sanity/icons/User'

/**
 * Spiegelt StoryIntroBlock in types/blocks.ts. Persoonlijke introductie
 * met meerdere alinea's, handtekening en een kleine fotogalerij.
 * Komt voor op: over mij ("wie ik ben").
 */
export const storyIntro = defineType({
  name: 'storyIntro',
  title: 'Persoonlijke introductie',
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
      type: 'string',
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: 'paragraphs',
      title: 'Alinea\'s',
      type: 'array',
      of: [{type: 'text', rows: 3}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'signatureName',
      title: 'Naam bij handtekening',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'signatureRole',
      title: 'Functie/rol bij handtekening',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'images',
      title: "Foto's",
      type: 'array',
      of: [
        {
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
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'images.0'},
  },
})
