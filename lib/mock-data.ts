/**
 * Tijdelijke, letterlijke content uit _reference/, getypeerd volgens
 * types/blocks.ts. Vervalt zodra pagina's uit Sanity renderen (Fase 4/5
 * van BOUWPLAN.md).
 */

import type {
  Page,
  SiteSettings,
  SanityImage,
  CtaLink,
} from "@/types/blocks";

const img = (url: string, alt: string): SanityImage => ({
  _type: "image",
  url,
  alt,
});

const cta = (label: string, href: string): CtaLink => ({ label, href });

/* ==========================================================================
   Home — _reference/home.html
   ========================================================================== */

export const homePage: Page = {
  title: "Home",
  slug: { _type: "slug", current: "/" },
  seo: {
    title: "Trouwfotograaf & videograaf | Behind Every Wedding",
    description:
      "Tijdloze trouwfotografie en trouwfilms voor bruidsparen in heel Nederland en Europa.",
  },
  sections: [
    {
      _type: "hero",
      heading: "Tijdloze foto's.",
      headingLine2: "Echte emoties.",
      subheading:
        "Bruiloft fotografie & film voor bruidsparen die waarde hechten aan kwaliteit, rust en beleving.",
      image: img(
        "/images/hero-wedding.jpg",
        "Bruidspaar in een omhelzing tijdens het gouden uur in een heuvellandschap"
      ),
      primaryCta: cta("Bekijk ons werk", "#portfolio"),
      secondaryCta: cta("Vraag informatie aan", "#contact"),
      size: "home",
      showScrollIndicator: true,
    },
    {
      _type: "trustBar",
      items: [
        { title: "500+", text: "Bruiloften vastgelegd", icon: "camera" },
        { title: "Foto & video", text: "In één stijl", icon: "video" },
        { title: "Heel Nederland", text: "& Europa", icon: "globe" },
        { title: "5 sterren", text: "Gemiddelde review", icon: "star" },
      ],
    },
    {
      _type: "portfolioGrid",
      eyebrow: "Recente bruiloften",
      heading: "Verhalen die we met liefde vastleggen.",
      cta: cta("Bekijk alle reportages", "#"),
      images: [
        img(
          "/images/portfolio-couple-mountains.jpg",
          "Bruidspaar wandelt door een berglandschap"
        ),
        img(
          "/images/portfolio-rings.jpg",
          "Close-up van het bruidsboeket en de trouwringen"
        ),
        img(
          "/images/portfolio-portrait.jpg",
          "Zwart-wit portret van de bruid met sluier"
        ),
        img(
          "/images/portfolio-walk.jpg",
          "Bruidspaar wandelt hand in hand voor een landhuis"
        ),
        img(
          "/images/portfolio-ceremony.jpg",
          "Buitenceremonie tussen de bomen in het avondlicht"
        ),
        img(
          "/images/portfolio-evening.jpg",
          "Genodigden tijdens het feest bij een kasteel"
        ),
        img(
          "/images/portfolio-lake.jpg",
          "Bruidspaar aan het water tijdens het gouden uur"
        ),
      ],
    },
    {
      _type: "filmSection",
      eyebrow: "Bekijk & voel",
      heading: "Trouwfilms die jullie dag opnieuw laten beleven.",
      cta: cta("Bekijk alle films", "#"),
      films: [
        {
          names: "Julia & Mees",
          label: "Highlight film",
          image: img(
            "/images/film-julia-mees.jpg",
            "Bruidspaar tussen sterretjes tijdens het avondfeest"
          ),
          href: "#",
        },
        {
          names: "Sanne & Daan",
          label: "Highlight film",
          image: img(
            "/images/film-sanne-daan.jpg",
            "Trouwlocatie in een landschap gezien vanuit de lucht"
          ),
          href: "#",
        },
        {
          names: "Lotte & Jasper",
          label: "Highlight film",
          image: img(
            "/images/film-lotte-jasper.jpg",
            "Openingsdans onder lichtjes in de feestzaal"
          ),
          href: "#",
        },
      ],
    },
    {
      _type: "benefits",
      eyebrow: "Waarom kiezen bruidsparen voor ons",
      items: [
        {
          title: "Onopvallend aanwezig",
          text: "Jullie beleven de dag, wij vangen de momenten.",
          icon: "eye",
        },
        {
          title: "Alles in één stijl",
          text: "Foto en video zijn perfect op elkaar afgestemd.",
          icon: "camera",
        },
        {
          title: "Echt & oprecht",
          text: "Geen geposeerde momenten, maar echte emoties.",
          icon: "heart",
        },
      ],
      image: img(
        "/images/about-team.jpg",
        "Bruidspaar voor een klassieke trouwlocatie"
      ),
    },
    {
      _type: "reviews",
      eyebrow: "Lieve woorden",
      heading: "Wat bruidsparen over ons zeggen.",
      reviews: [
        {
          quote:
            "“Vanaf het eerste moment voelden we ons op ons gemak. De foto's en film zijn zo prachtig geworden dat we onze dag telkens opnieuw beleven.”",
          name: "Eva & Mark",
          avatar: img("/images/review-eva-mark.jpg", "Eva en Mark"),
        },
        {
          quote:
            "“Professioneel, creatief en vooral heel betrokken. Ze legden ieder belangrijk moment vast zonder dat we het doorhadden.”",
          name: "Sanne & Daan",
          avatar: img("/images/review-sanne-daan.jpg", "Sanne en Daan"),
        },
        {
          quote:
            "“De combinatie van foto en video was voor ons de beste keuze. Alles klopt en vormt samen één mooi verhaal.”",
          name: "Julia & Mees",
          avatar: img("/images/review-julia-mees.jpg", "Julia en Mees"),
        },
      ],
      cta: cta("Bekijk alle reviews", "#"),
    },
    {
      _type: "process",
      eyebrow: "Onze werkwijze",
      heading: "Van kennismaking tot herinnering",
      backgroundImage: img("/images/process-bg.jpg", ""),
      steps: [
        {
          title: "Kennismaking",
          text: "We leren elkaar kennen en horen alles over jullie plannen.",
          icon: "chat",
        },
        {
          title: "Offerte",
          text: "Jullie ontvangen een persoonlijke offerte op maat.",
          icon: "document",
        },
        {
          title: "Bruiloft",
          text: "Wij leggen de dag liefdevol en onopvallend vast.",
          icon: "heart",
        },
        {
          title: "Oplevering",
          text: "Binnen zes tot acht weken ontvangen jullie de foto's en film.",
          icon: "photo",
        },
      ],
    },
    {
      _type: "instagramStrip",
      eyebrow: "Volg ons op Instagram",
      heading: "@behindeverywedding",
      cta: cta("Volg ons", "#"),
      images: [
        img("/images/insta-1.jpg", "Trouwringen op een linnen doek"),
        img("/images/insta-2.jpg", "Bruid en bruidegom in close-up"),
        img("/images/insta-3.jpg", "Bruid loopt door de tuin"),
        img("/images/insta-4.jpg", "Toost tijdens het diner"),
        img("/images/insta-5.jpg", "Eerste dans in de avond"),
        img("/images/insta-6.jpg", "Gasten tijdens de borrel"),
      ],
    },
    {
      _type: "finalCta",
      heading:
        "Zijn jullie op zoek naar een trouwfotograaf en videograaf die jullie verhaal écht vastlegt?",
      text: "Controleer direct of jullie datum nog beschikbaar is.",
      image: img("/images/cta-wedding.jpg", "Bruidspaar in het avondlicht"),
      cta: cta("Vraag jullie datum aan", "#"),
      size: "home",
    },
  ],
};

/* ==========================================================================
   Over mij — _reference/over-mij.html
   ========================================================================== */

export const overMijPage: Page = {
  title: "Over mij",
  slug: { _type: "slug", current: "/over-mij" },
  seo: {
    title: "Over mij | Behind Every Wedding",
    description:
      "Maak kennis met de fotograaf achter Behind Every Wedding. Persoonlijke trouwfotografie en trouwfilms met een rustige, tijdloze stijl.",
  },
  sections: [
    {
      _type: "hero",
      eyebrow: "Over mij",
      heading: "Ik leg jullie verhaal",
      headingLine2: "vast zoals het écht was.",
      subheading:
        "Geen regie, geen standaard poses. Ik geloof dat de mooiste herinneringen ontstaan wanneer jullie volledig kunnen genieten van de dag. Alles vastleggen is mijn werk, niet dat van jullie.",
      image: img(
        "/images/hero-about.jpg",
        "Jeroen met camera in de hand tijdens het gouden uur"
      ),
      primaryCta: cta("Bekijk mijn werk", "/#portfolio"),
      secondaryCta: cta("Check beschikbaarheid", "#contact"),
      size: "over-mij",
    },
    {
      _type: "storyIntro",
      eyebrow: "Wie ik ben",
      heading: "De fotograaf achter Behind Every Wedding.",
      paragraphs: [
        "Hoi, ik ben Jeroen. Bruiloften vastleggen is voor mij veel meer dan mooie beelden maken. Het is het vertrouwen krijgen om dichtbij te mogen zijn op een van de belangrijkste dagen van jullie leven.",
        "Wat een bruiloft bijzonder maakt zijn de momenten die niemand plant. De blik van jullie vader tijdens de ceremonie, de lach die te vroeg komt, de stilte net voor de deuren opengaan. Daar ben ik voor.",
        "Met oog voor detail en gevoel voor timing werk ik rustig en onopvallend. Jullie merken nauwelijks dat ik er ben, terwijl ik zorg voor herinneringen die blijven.",
      ],
      signatureName: "Jeroen",
      signatureRole: "Fotograaf & videograaf",
      images: [
        img(
          "/images/about-portrait.jpg",
          "Portret van Jeroen voor een klassiek landhuis"
        ),
        img("/images/about-camera.jpg", "Jeroen filmt tijdens het avondfeest"),
        img(
          "/images/about-blackwhite.jpg",
          "Zwart-witbeeld van Jeroen aan het werk"
        ),
      ],
    },
    {
      _type: "benefits",
      items: [
        {
          title: "Echt & oprecht",
          text: "Ik leg de dag vast zoals hij echt was. Zonder regie, zonder gemaakte momenten.",
          icon: "heart",
        },
        {
          title: "Onopvallend aanwezig",
          text: "Rustig, discreet en altijd op de juiste plek. Zodat jullie niets missen van elkaar.",
          icon: "camera",
        },
        {
          title: "Foto & video in één stijl",
          text: "Beelden die naadloos samenkomen en samen één verhaal vertellen. Rustig en tijdloos.",
          icon: "play",
        },
        {
          title: "Kwaliteit boven alles",
          text: "Hoogwaardige apparatuur, zorgvuldige nabewerking en aandacht voor elk detail.",
          icon: "star",
        },
      ],
    },
    {
      _type: "stats",
      eyebrow: "Mijn ervaring",
      heading: "Al meer dan 8 jaar met hart en ziel.",
      text: "In al die jaren heb ik honderden liefdesverhalen mogen vastleggen, van intieme bruiloften in eigen tuin tot dagen in Toscane. Elke bruiloft is anders en dat maakt mijn werk elke keer opnieuw bijzonder.",
      cta: cta("Lees mijn verhaal", "#"),
      items: [
        { value: "500+", label: "Bruiloften vastgelegd" },
        { value: "8+", label: "Jaar ervaring" },
        { value: "2", label: "Specialisaties foto & video" },
        { value: "5/5", label: "Gemiddelde review" },
      ],
    },
    {
      _type: "process",
      eyebrow: "Zo werk ik",
      heading: "Jullie dag. Jullie tempo.",
      text: "Ik geloof dat de mooiste momenten ontstaan als jullie jezelf kunnen zijn. Daarom werk ik met een duidelijke aanpak die zorgt voor ontspanning en vertrouwen.",
      steps: [
        {
          title: "Kennismaking",
          text: "We leren elkaar kennen tijdens een vrijblijvend gesprek.",
          icon: "chat",
        },
        {
          title: "Voorbereiding",
          text: "We plannen alles rustig en stemmen jullie wensen goed af.",
          icon: "calendar",
        },
        {
          title: "De bruiloft",
          text: "Ik ben op de achtergrond aanwezig en leg alle momenten vast.",
          icon: "camera",
        },
        {
          title: "Herinneringen",
          text: "Jullie ontvangen een prachtige selectie beelden en film om te koesteren.",
          icon: "heart",
        },
      ],
    },
    {
      _type: "quote",
      quote:
        "Ik wil niet alleen laten zien hoe jullie trouwdag eruitzag. Ik wil dat jullie opnieuw voelen hoe hij was.",
      attribution: "Jeroen · Behind Every Wedding",
    },
    {
      _type: "reviews",
      eyebrow: "Lieve woorden",
      heading: "Wat bruidsparen over mij zeggen.",
      reviews: [
        {
          quote:
            "“Vanaf het eerste moment voelden we ons op ons gemak. De foto's en film zijn zo prachtig geworden dat we onze dag telkens opnieuw beleven.”",
          name: "Eva & Mark",
          avatar: img("/images/review-eva-mark.jpg", "Eva en Mark"),
        },
        {
          quote:
            "“Professioneel, creatief en vooral heel betrokken. Hij legde ieder belangrijk moment vast zonder dat we het doorhadden.”",
          name: "Sanne & Daan",
          avatar: img("/images/review-sanne-daan.jpg", "Sanne en Daan"),
        },
        {
          quote:
            "“De combinatie van foto en video was voor ons de beste keuze. Alles klopt en vormt samen één mooi verhaal.”",
          name: "Julia & Mees",
          avatar: img("/images/review-julia-mees.jpg", "Julia en Mees"),
        },
      ],
    },
    {
      _type: "faq",
      eyebrow: "Veelgestelde vragen",
      heading: "Goed om te weten.",
      items: [
        {
          question: "Waarom fotografeer je alleen?",
          answer:
            "Omdat ik geloof in een persoonlijke band. Jullie spreken vanaf het eerste gesprek met dezelfde persoon die op de dag zelf aanwezig is en die daarna de beelden bewerkt. Dat maakt de dag rustiger en de stijl consistent.",
        },
        {
          question: "Werk je ook in het buitenland?",
          answer:
            "Zeker. Destination weddings zijn een van de mooiste onderdelen van dit werk. Ik fotografeer in heel Europa en reis graag mee. De reis- en verblijfkosten reken ik transparant door in de offerte.",
        },
        {
          question: "Fotografeer je ook kleine bruiloften?",
          answer:
            "Graag zelfs. Intieme bruiloften met twintig gasten leveren vaak de meest oprechte beelden op. Er zijn kortere pakketten beschikbaar voor dagen die om minder uren vragen.",
        },
        {
          question: "Maak je ook trouwfilms?",
          answer:
            "Ja. Foto en video komen bij mij uit dezelfde hand, in dezelfde kleuren en met hetzelfde ritme. Jullie ontvangen een highlight film van vier tot zes minuten, optioneel aangevuld met een langere versie.",
        },
        {
          question: "Hoe lang ben je aanwezig?",
          answer:
            "Dat bepalen jullie zelf. De meeste bruidsparen kiezen voor acht tot tien uur, van het aankleden tot het eerste deel van het feest. Een volledige dag inclusief avondprogramma is altijd mogelijk.",
        },
        {
          question: "Wanneer ontvangen we alles?",
          answer:
            "Binnen een week krijgen jullie een korte voorproefje. De volledige galerij en de film volgen binnen zes tot acht weken, via een persoonlijke online omgeving die jullie eenvoudig kunnen delen.",
        },
      ],
    },
    {
      _type: "finalCta",
      heading: "Zijn jullie benieuwd of jullie trouwdatum nog beschikbaar is?",
      text: "Laat een bericht achter en ik neem zo snel mogelijk contact met jullie op.",
      image: img(
        "/images/cta-about.jpg",
        "Jeroen aan het fotograferen in het avondlicht"
      ),
      cta: cta("Check beschikbaarheid", "#"),
      size: "over-mij",
    },
  ],
};

/* ==========================================================================
   Fotografie — _reference/fotografie.html
   ========================================================================== */

export const fotografiePage: Page = {
  title: "Fotografie",
  slug: { _type: "slug", current: "/fotografie" },
  seo: {
    title: "Trouwfotografie | Behind Every Wedding",
    description:
      "Tijdloze trouwfotografie voor bruidsparen in Nederland en Europa. Echte momenten, natuurlijke kleuren en een complete reportage van jullie trouwdag.",
  },
  sections: [
    {
      _type: "hero",
      eyebrow: "Fotografie",
      heading: "Tijdloze beelden.",
      headingLine2: "Echte momenten.",
      subheading:
        "Bruiloft fotografie die draait om jullie verhaal. Onopvallend, puur en tot in detail vastgelegd.",
      image: img(
        "/images/photography-hero.jpg",
        "Bruidspaar tijdens zonsondergang in een heuvellandschap"
      ),
      primaryCta: cta("Bekijk mijn werk", "#reportages"),
      secondaryCta: cta("Check beschikbaarheid", "#contact"),
      size: "fotografie",
    },
    {
      _type: "benefits",
      eyebrow: "Trouwfotografie",
      heading: "Herinneringen die je voor altijd wilt bewaren.",
      text: "Ik leg jullie dag vast zoals hij écht was. Van kleine blikken tot grote momenten. Zodat jullie elke keer opnieuw terug kunnen voelen hoe bijzonder het was.",
      cta: cta("Werkwijze fotografie", "#aanpak"),
      items: [
        {
          title: "Echte momenten",
          text: "Geen geposeerde foto's, maar pure emoties.",
          icon: "camera",
        },
        {
          title: "Licht & sfeer",
          text: "Ik werk met natuurlijk licht voor een tijdloze uitstraling.",
          icon: "sun",
        },
        {
          title: "Oog voor detail",
          text: "Van de grote momenten tot de kleine details.",
          icon: "heart",
        },
        {
          title: "Volledige reportage",
          text: "Een compleet verhaal van begin tot eind.",
          icon: "gallery",
        },
      ],
    },
    {
      _type: "reportageList",
      eyebrow: "Recente bruiloften",
      heading: "Een greep uit mijn werk.",
      cta: cta("Bekijk alle reportages", "#"),
      reportages: [
        {
          names: "Sanne & Daan",
          location: "Kasteel Maurick, Vught",
          text: "Een dag vol liefde, emotie en een prachtige ceremonie in het kasteel. De herfstkleuren maakten het compleet.",
          mainImage: img(
            "/images/reportage-sanne-daan-main.jpg",
            "Bruiloft bij Kasteel Maurick in Vught"
          ),
          gallery: [
            img(
              "/images/reportage-sanne-daan-1.jpg",
              "Bruid in het licht van de kasteelvensters"
            ),
            img(
              "/images/reportage-sanne-daan-2.jpg",
              "Bruidsboeket met herfstbloemen"
            ),
            img(
              "/images/reportage-sanne-daan-3.jpg",
              "Bruidspaar in de kasteeltuin"
            ),
          ],
          cta: cta("Bekijk reportage", "#"),
        },
        {
          names: "Julia & Mees",
          location: "Italië, Comomeer",
          text: "Een intieme bruiloft aan het Comomeer. Zon, bergen en oprechte momenten.",
          mainImage: img(
            "/images/reportage-julia-mees-main.jpg",
            "Trouwreportage aan het Comomeer"
          ),
          gallery: [
            img(
              "/images/reportage-julia-mees-1.jpg",
              "Bruid op een terras met uitzicht op het meer"
            ),
            img(
              "/images/reportage-julia-mees-2.jpg",
              "Bruidspaar in een omhelzing bij het water"
            ),
            img(
              "/images/reportage-julia-mees-3.jpg",
              "Uitzicht over het Comomeer bij zonsondergang"
            ),
          ],
          cta: cta("Bekijk reportage", "#"),
        },
        {
          names: "Lotte & Jasper",
          location: "Landgoed Heerlijkheid, Gorssel",
          text: "Een ontspannen buitenbruiloft met vrienden en familie. Vol warme momenten.",
          mainImage: img(
            "/images/reportage-lotte-jasper-main.jpg",
            "Buitenbruiloft op Landgoed Heerlijkheid in Gorssel"
          ),
          gallery: [
            img(
              "/images/reportage-lotte-jasper-1.jpg",
              "Feesttent op het landgoed in de avond"
            ),
            img(
              "/images/reportage-lotte-jasper-2.jpg",
              "Bruidspaar lachend tussen de gasten"
            ),
            img(
              "/images/reportage-lotte-jasper-3.jpg",
              "Detailfoto van het bruidsboeket"
            ),
          ],
          cta: cta("Bekijk reportage", "#"),
        },
        {
          names: "Eva & Mark",
          location: "Stadhuis Utrecht",
          text: "Een stijlvolle stadsbruiloft met een ceremonie in het stadhuis van Utrecht.",
          mainImage: img(
            "/images/reportage-eva-mark-main.jpg",
            "Stadsbruiloft bij het stadhuis van Utrecht"
          ),
          gallery: [
            img(
              "/images/reportage-eva-mark-1.jpg",
              "Bruidspaar voor de gevel van het stadhuis"
            ),
            img(
              "/images/reportage-eva-mark-2.jpg",
              "Zwart-witportret van het bruidspaar"
            ),
            img(
              "/images/reportage-eva-mark-3.jpg",
              "Detail van de historische trouwzaal"
            ),
          ],
          cta: cta("Bekijk reportage", "#"),
        },
      ],
    },
    {
      _type: "process",
      eyebrow: "Mijn aanpak",
      heading: "Zo leg ik jullie dag vast.",
      text: "Ik ben niet de regisseur van jullie dag. Jullie beleven, ik observeer. Zo ontstaan beelden die écht voelen.",
      cta: cta("Meer over mijn aanpak", "/over-mij"),
      steps: [
        {
          title: "Voorbereiding",
          text: "We leren elkaar kennen en bespreken jullie wensen.",
          image: img(
            "/images/photography-process-preparation.jpg",
            "Kennismakingsgesprek aan tafel met koffie"
          ),
        },
        {
          title: "Onopvallend aanwezig",
          text: "Ik meng me tussen de gasten en leg vast wat gebeurt.",
          image: img(
            "/images/photography-process-working.jpg",
            "Fotograaf legt een spontaan moment vast tussen de gasten"
          ),
        },
        {
          title: "Echte momenten",
          text: "Van grote momenten tot kleine, ongemerkte details.",
          image: img(
            "/images/photography-process-moments.jpg",
            "Bruidspaar tijdens een intiem moment in het landschap"
          ),
        },
        {
          title: "Zorgvuldige nabewerking",
          text: "Elke foto krijgt de aandacht die het verdient.",
          image: img(
            "/images/photography-process-editing.jpg",
            "Nabewerking van de trouwfoto's op de laptop"
          ),
        },
      ],
    },
    {
      _type: "finalCta",
      heading: "Willen jullie weten of jullie datum nog vrij is?",
      text: "Ik kijk graag met jullie mee.",
      image: img(
        "/images/photography-availability-cta.jpg",
        "Fotograaf aan het werk tijdens het gouden uur"
      ),
      cta: cta("Check beschikbaarheid", "#"),
      size: "fotografie",
    },
  ],
};

/* ==========================================================================
   Contact — _reference/contact.html
   ========================================================================== */

export const contactPage: Page = {
  title: "Contact",
  slug: { _type: "slug", current: "/contact" },
  seo: {
    title: "Contact & beschikbaarheid | Behind Every Wedding",
    description:
      "Controleer jullie trouwdatum en vraag vrijblijvend informatie aan over trouwfotografie en trouwfilm van Behind Every Wedding.",
    ogImage: img(
      "/images/contact-hero.jpg",
      "Trouwfotograaf fotografeert tijdens golden hour"
    ),
  },
  sections: [
    {
      _type: "hero",
      eyebrow: "Contact",
      heading: "Laten we kennismaken.",
      headingLine2: "Ik kijk graag met jullie mee.",
      subheading:
        "Vertel mij meer over jullie plannen en wensen. Ik neem zo snel mogelijk contact met jullie op om de mogelijkheden te bespreken.",
      image: img(
        "/images/contact-hero.jpg",
        "Trouwfotograaf fotografeert tijdens golden hour"
      ),
      primaryCta: cta("Check beschikbaarheid", "#aanvraag"),
      secondaryCta: cta("Bekijk mijn werk", "/fotografie"),
      size: "contact",
    },
    {
      _type: "contactForm",
      eyebrow: "Aanvraag",
      heading: "Controleer jullie datum en vraag informatie aan.",
      intro:
        "Vul het formulier zo compleet mogelijk in. Dan kan ik jullie zo goed mogelijk helpen en gericht reageren op jullie plannen.",
      submitLabel: "Controleer beschikbaarheid",
      perks: [
        {
          title: "Snelle reactie",
          text: "Ik reageer binnen 24 uur, meestal zelfs binnen een paar uur.",
          icon: "clock",
        },
        {
          title: "Beschikbaarheid checken",
          text: "Ik kijk direct of jullie datum nog vrij is en laat het persoonlijk weten.",
          icon: "calendar-check",
        },
        {
          title: "Persoonlijk contact",
          text: "Geen standaardmail, maar persoonlijk advies op basis van jullie plannen.",
          icon: "heart",
        },
        {
          title: "Kennismaken",
          text: "We plannen een vrijblijvend gesprek om elkaar te leren kennen.",
          icon: "camera",
        },
      ],
      directHeading: "Liever direct contact?",
      phone: "+31 6 24 46 40 33",
      email: "info@behindeverystory.nl",
      location: "Delft, Zuid-Holland",
      successHeading: "Bedankt voor jullie aanvraag.",
      successText:
        "Ik heb jullie gegevens ontvangen en neem zo snel mogelijk persoonlijk contact op. Meestal reageer ik binnen 24 uur.",
      successCta: cta("Bekijk intussen mijn portfolio", "/fotografie"),
    },
    {
      _type: "faq",
      eyebrow: "Veelgestelde vragen",
      heading: "Antwoorden op de meest gestelde vragen.",
      items: [
        {
          question: "Wanneer weten we of jullie datum beschikbaar is?",
          answer:
            "Ik reageer meestal binnen 24 uur. Wanneer de datum nog vrij is, stuur ik direct meer informatie en kunnen we een vrijblijvende kennismaking plannen.",
        },
        {
          question: "Hoe verloopt een kennismaking?",
          answer:
            "We plannen een videogesprek of spreken persoonlijk af. Ik hoor graag wat jullie belangrijk vinden en vertel hoe ik op een trouwdag werk.",
        },
        {
          question: "Hoe lang van tevoren moeten we boeken?",
          answer:
            "Populaire data worden vaak twaalf tot achttien maanden vooraf geboekt. Ook voor kortere termijnen kunnen jullie altijd contact opnemen.",
        },
        {
          question: "Werk je ook in het buitenland?",
          answer:
            "Ja. Ik fotografeer en film bruiloften in heel Nederland en op bestemmingen binnen Europa. Reiskosten worden vooraf duidelijk besproken.",
        },
        {
          question: "Hoeveel uur ben je aanwezig op de bruiloft?",
          answer:
            "Dat hangt af van het gekozen pakket. De meeste reportages lopen van de voorbereidingen tot en met het feest.",
        },
        {
          question: "Wanneer ontvangen we de foto's en film?",
          answer:
            "De definitieve levertijd staat in de offerte. Jullie ontvangen vaak al kort na de bruiloft een eerste preview.",
        },
      ],
    },
    {
      _type: "finalCta",
      heading: "Is jullie datum nog beschikbaar?",
      text: "Vraag vrijblijvend jullie trouwdatum aan.",
      image: img(
        "/images/contact-availability-cta.jpg",
        "Bruidspaar kijkt uit over de bergen tijdens zonsondergang"
      ),
      cta: cta("Check beschikbaarheid", "#aanvraag"),
      size: "contact",
    },
  ],
};

/* ==========================================================================
   Site-brede instellingen — header/footer, identiek op alle vier pagina's.

   Twee plekken waar de referentiebestanden onderling verschillen en waar
   dus één keuze gemaakt moest worden voor dit ene, gedeelde object:
   - home.html noemt het navigatie-item "Over ons"; over-mij.html,
     fotografie.html en contact.html noemen het "Over mij" (en de pagina
     zelf heet ook over-mij.html). Hier gekozen voor "Over mij".
   - De header-CTA linkt op home/over mij/fotografie naar "#contact", maar
     op contact.html zelf naar "#aanvraag" (de eigen sectie-id). Hier
     gekozen voor "#contact", conform de meerderheid van de pagina's.
   Navigatie- en footerlinks zijn verder letterlijk overgenomen uit
   contact.html (de pagina met de meeste opgeloste interne links: waar een
   pagina echt bestaat wordt naar het bestand gelinkt, anders naar "#").
   Het eigen "Contact"-item wees daar naar "#" (zelfreferentie); hier
   vervangen door de eigen route "/contact" zodat de link overal werkt.

   Alle interne hrefs zijn Next.js-routes ("/", "/over-mij", "/fotografie",
   "/contact") in plaats van de statische .html-bestandsnamen uit
   _reference/. Anker-links zoals "#aanvraag" of "#contact" zijn ongemoeid
   gelaten.
   ========================================================================== */

export const siteSettings: SiteSettings = {
  logoName: "Behind Every Wedding",
  logoSubline: "",
  mainNav: [
    { label: "Home", href: "/" },
    { label: "Over mij", href: "/over-mij" },
    { label: "Fotografie", href: "/fotografie" },
    { label: "Video", href: "#" },
    { label: "Pakketten", href: "#" },
    { label: "Reviews", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "/contact" },
  ],
  headerCta: cta("Check beschikbaarheid", "#contact"),
  footer: {
    aboutText: "Foto & video voor de mooiste dag van jullie leven.",
    socials: [
      { platform: "Instagram", href: "#" },
      { platform: "Facebook", href: "#" },
      { platform: "YouTube", href: "#" },
    ],
    navLinks: [
      { label: "Home", href: "/" },
      { label: "Over mij", href: "/over-mij" },
      { label: "Fotografie", href: "/fotografie" },
      { label: "Video", href: "#" },
      { label: "Pakketten", href: "#" },
    ],
    popularPages: [
      { label: "Trouwfotograaf Gelderland", href: "#" },
      { label: "Trouwfotograaf Utrecht", href: "#" },
      { label: "Trouwfotograaf Amsterdam", href: "#" },
      { label: "Trouwvideograaf Nederland", href: "#" },
      { label: "Destination wedding", href: "#" },
    ],
    legalLinks: [
      { label: "Privacyverklaring", href: "#" },
      { label: "Algemene voorwaarden", href: "#" },
    ],
  },
  business: {
    phone: "+31 6 24 46 40 33",
    email: "info@behindeverystory.nl",
    city: "Delft",
    region: "Zuid-Holland",
    country: "NL",
  },
};
