import {defineField, defineType} from 'sanity'
// @sanity/icons v5 verwijderde ShareIcon (en een handvol andere) uit de
// root-export; tsc/eslint zien dat niet (de root levert nog een
// `declare const ShareIcon: never`-stub, dus type-checkt stil), maar
// `sanity build` faalt er hard op. Subpath-import is de door het pakket
// zelf aangegeven vervanging, zonder de icoon-naam te hoeven wijzigen.
import {ShareIcon} from '@sanity/icons/Share'

/** Spiegelt SocialLink in types/blocks.ts. */
export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social-mediaprofiel',
  type: 'object',
  icon: ShareIcon,
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      description: 'Bijv. Instagram, Facebook, YouTube.',
      type: 'string',
      validation: (Rule) => Rule.required().max(30),
    }),
    defineField({
      name: 'href',
      title: 'Link naar profiel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'platform', subtitle: 'href'},
  },
})
