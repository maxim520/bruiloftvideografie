import {defineField, defineType} from 'sanity'
// Subpath-import: zie objects/socialLink.ts voor waarom (root-export verwijderd in @sanity/icons v5).
import {HeartIcon} from '@sanity/icons/Heart'

/**
 * Fase 2-redesign: losse reportagepagina per bruiloft, met eigen slug en
 * SEO — vervangt op termijn reportageList.reportages (dat array-veld
 * blijft voorlopig bestaan; zie DEPLOY.md/het Fase 2-verslag voor de
 * migratiestrategie). Elke reportage wordt straks bereikbaar op
 * /verhalen/[slug] (Fase 4: het reportage-template zelf).
 */
export const wedding = defineType({
  name: 'wedding',
  title: 'Bruiloft (reportage)',
  type: 'document',
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Interne titel',
      description: 'Voor herkenning in de Studio, bijv. "Sanne & Daan — Kasteel Maurick".',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'coupleNames',
      title: 'Namen van het bruidspaar',
      description: 'Zoals getoond op de site, bijv. "Sanne & Daan".',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Bepaalt de URL: /verhalen/deze-slug.',
      type: 'slug',
      options: {source: 'coupleNames'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Trouwdatum',
      type: 'date',
      options: {dateFormat: 'DD-MM-YYYY'},
    }),
    defineField({
      name: 'venue',
      title: 'Trouwlocatie',
      description: 'Bijv. "Kasteel Maurick".',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'city',
      title: 'Plaats',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'region',
      title: 'Provincie',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
      initialValue: 'Nederland',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'intro',
      title: 'Introductie',
      description: 'Korte tekst bovenaan de reportage, een paar zinnen.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(400),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero-foto',
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
      name: 'gallery',
      title: 'Fotogalerij',
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
    }),
    defineField({
      name: 'filmUrl',
      title: 'Film (URL)',
      description:
        'Link naar de trouwfilm (bijv. Vimeo/YouTube), indien beschikbaar. Hoe dit precies wordt weergegeven volgt in de fase waarin de filmspeler gebouwd wordt.',
      type: 'url',
    }),
    defineField({
      name: 'story',
      title: 'Verhaal',
      description: 'Het volledige verhaal bij de reportage — spaarzaam gebruiken, het beeld vertelt het grootste deel.',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial (optioneel)',
      type: 'object',
      fields: [
        defineField({name: 'quote', title: 'Citaat', type: 'text', rows: 3}),
        defineField({name: 'name', title: 'Naam', type: 'string'}),
      ],
    }),
    defineField({
      name: 'suppliers',
      title: "Leveranciers",
      type: 'array',
      of: [{type: 'supplier'}],
    }),
    defineField({
      name: 'featured',
      title: 'Uitgelicht',
      description: 'Getoond in de "Featured Weddings"-sectie op de homepage.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'relatedWeddings',
      title: 'Gerelateerde reportages',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'wedding'}]}],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'coupleNames', subtitle: 'venue', media: 'heroImage'},
  },
})
