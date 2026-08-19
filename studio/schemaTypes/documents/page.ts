import {defineField, defineType} from 'sanity'
// Subpath-import: zie socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {DocumentIcon} from '@sanity/icons/Document'

/**
 * Spiegelt Page in types/blocks.ts. Eén pagina, opgebouwd uit een
 * geordende lijst blokken (sections). De groepen in het invoegmenu zijn
 * puur redactioneel gemak — de sections-array zelf blijft één platte
 * lijst, zoals in het TypeScript-model.
 */
export const page = defineType({
  name: 'page',
  title: 'Pagina',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      description: 'Interne naam van de pagina, voor herkenning in de Studio.',
      type: 'string',
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Bepaalt de URL van de pagina.',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Secties',
      type: 'array',
      of: [
        {type: 'hero'},
        {type: 'trustBar'},
        {type: 'portfolioGrid'},
        {type: 'filmSection'},
        {type: 'benefits'},
        {type: 'reviews'},
        {type: 'process'},
        {type: 'instagramStrip'},
        {type: 'stats'},
        {type: 'quote'},
        {type: 'reportageList'},
        {type: 'faq'},
        {type: 'contactForm'},
        {type: 'finalCta'},
        {type: 'storyIntro'},
        {type: 'pricing'},
      ],
      options: {
        insertMenu: {
          groups: [
            {name: 'openingEnAfsluiting', title: 'Opening & afsluiting', of: ['hero', 'finalCta']},
            {
              name: 'homeSecties',
              title: 'Homepage-secties',
              of: ['trustBar', 'portfolioGrid', 'filmSection', 'instagramStrip'],
            },
            {
              name: 'inhoudEnVerhaal',
              title: 'Inhoud & verhaal',
              of: ['benefits', 'process', 'storyIntro', 'quote', 'stats', 'pricing'],
            },
            {name: 'socialProof', title: 'Reviews & reportages', of: ['reviews', 'reportageList']},
            {name: 'vragenEnContact', title: 'Vragen & contact', of: ['faq', 'contactForm']},
          ],
          views: [{name: 'grid'}, {name: 'list'}],
        },
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})
