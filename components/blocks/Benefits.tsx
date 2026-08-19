import Container from "@/components/layout/Container";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import SectionHeading from "@/components/ui/SectionHeading";
import type { BenefitsBlock } from "@/types/blocks";

type BenefitsProps = {
  block: BenefitsBlock;
};

/**
 * Drie visuele varianten uit de referentie, afgeleid uit welke optionele
 * velden gevuld zijn — geen apart "variant"-veld nodig:
 * - `image` gezet             → home "waarom ons": tekst + grid naast een foto
 * - geen image, wel intro     → fotografie: introtekst naast een grid met
 *   (heading/text/cta)          verticale scheidingslijnen
 * - geen image, geen intro    → over mij "mijn aanpak": losstaand donker
 *                                grid met ronde icoonbadges
 */
export default function Benefits({ block }: BenefitsProps) {
  const { eyebrow, heading, text, cta, items, image } = block;

  if (items.length === 0) return null;

  if (image) {
    return (
      <section className="bg-surface-light py-[68px] md:py-20 lg:py-[112px]">
        <Container>
          <Reveal>
            <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:gap-[60px]">
              <div>
                <SectionHeading eyebrow={eyebrow} muted />
                <div className="grid grid-cols-1 gap-7 pt-2.5 lg:grid-cols-3 lg:gap-9">
                  {items.map((item) => (
                    <article key={item.title}>
                      <Icon name={item.icon} size={26} className="mb-[18px] text-copper" />
                      <h3 className="mb-2.5 text-[22px]">{item.title}</h3>
                      <p className="text-sm leading-[1.6] text-text-muted">{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[320px] overflow-hidden rounded-[3px] bg-surface lg:min-h-[400px]">
                <SafeImage image={image} sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }

  if (heading || text || cta) {
    return (
      <section className="bg-surface-light py-[68px] md:py-20 lg:py-[112px]">
        <Container>
          <Reveal>
            <div className="grid grid-cols-1 items-start gap-11 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[72px]">
              <SectionHeading
                eyebrow={eyebrow}
                heading={heading}
                text={text}
                cta={cta}
                className="[&_h2]:max-w-[14ch] [&_h2]:text-[clamp(1.875rem,3vw,2.625rem)]"
              />
              <div className="grid grid-cols-1 lg:grid-cols-4">
                {items.map((item, index) => (
                  <article
                    key={item.title}
                    className={`grid grid-cols-[34px_1fr] gap-x-5 border-border py-[22px] first:border-t-0 first:pt-0 lg:block lg:border-t-0 lg:px-[26px] lg:py-1 lg:first:border-l-0 lg:first:pl-0 ${
                      index === 0 ? "border-t-0" : "border-t lg:border-l"
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      size={30}
                      className="row-span-2 text-copper lg:mb-[26px]"
                    />
                    <h3 className="mb-[5px] text-[15px] font-semibold lg:mb-2.5">{item.title}</h3>
                    <p className="text-[13.5px] leading-[1.7] text-text-muted lg:max-w-[22ch]">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section
      aria-label="Mijn aanpak"
      className="bg-ink py-[56px] text-background md:py-[78px]"
    >
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <article
                key={item.title}
                className={`grid grid-cols-[48px_1fr] items-start gap-x-[18px] border-white/[0.12] py-[22px] text-left md:grid-cols-1 md:px-5 md:py-0 md:text-center lg:px-[34px] lg:py-2 ${
                  index === 0 ? "border-t-0 md:border-l-0" : "border-t md:border-t-0 md:border-l"
                } ${index % 2 === 1 ? "md:border-l lg:border-l" : ""}`}
              >
                <span className="row-span-2 flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.22] text-[#d6a67e] md:col-span-1 md:row-auto md:mx-auto md:mb-5">
                  <Icon name={item.icon} size={22} />
                </span>
                <h3 className="self-center text-[11px] font-semibold uppercase tracking-[.2em] text-white md:mb-3 md:self-auto">
                  {item.title}
                </h3>
                <p className="text-[13.5px] leading-[1.75] text-white/60 md:mx-auto md:max-w-[24ch]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
