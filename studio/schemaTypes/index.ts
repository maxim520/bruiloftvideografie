import {ctaLink} from './objects/ctaLink'
import {seo} from './objects/seo'
import {navLink} from './objects/navLink'
import {socialLink} from './objects/socialLink'
import {businessInfo} from './objects/businessInfo'
import {trustBarItem} from './objects/trustBarItem'
import {benefitItem} from './objects/benefitItem'
import {filmItem} from './objects/filmItem'
import {reviewItem} from './objects/reviewItem'
import {processStep} from './objects/processStep'
import {statItem} from './objects/statItem'
import {reportageItem} from './objects/reportageItem'
import {faqItem} from './objects/faqItem'
import {contactFormPerk} from './objects/contactFormPerk'

import {hero} from './blocks/hero'
import {trustBar} from './blocks/trustBar'
import {portfolioGrid} from './blocks/portfolioGrid'
import {filmSection} from './blocks/filmSection'
import {benefits} from './blocks/benefits'
import {reviews} from './blocks/reviews'
import {process} from './blocks/process'
import {instagramStrip} from './blocks/instagramStrip'
import {stats} from './blocks/stats'
import {quote} from './blocks/quote'
import {reportageList} from './blocks/reportageList'
import {faq} from './blocks/faq'
import {contactForm} from './blocks/contactForm'
import {finalCta} from './blocks/finalCta'
import {storyIntro} from './blocks/storyIntro'

import {page} from './documents/page'
import {siteSettings} from './documents/siteSettings'

export const schemaTypes = [
  // Documenten
  page,
  siteSettings,

  // Bloktypes
  hero,
  trustBar,
  portfolioGrid,
  filmSection,
  benefits,
  reviews,
  process,
  instagramStrip,
  stats,
  quote,
  reportageList,
  faq,
  contactForm,
  finalCta,
  storyIntro,

  // Gedeelde objecttypes
  ctaLink,
  seo,
  navLink,
  socialLink,
  businessInfo,
  trustBarItem,
  benefitItem,
  filmItem,
  reviewItem,
  processStep,
  statItem,
  reportageItem,
  faqItem,
  contactFormPerk,
]
