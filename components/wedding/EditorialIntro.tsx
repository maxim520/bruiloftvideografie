import Container from "@/components/layout/Container";
import Reveal from "@/components/ui/Reveal";

type EditorialIntroProps = {
  intro: string;
};

/**
 * Sectie 5: veel witruimte, één korte alinea — geen SEO-tekstmuur. De
 * intro is één enkel veld in Sanity (wedding.intro), dus geen array om
 * over te itereren; "maximaal enkele alinea's" wordt hier gehaald door
 * simpelweg niet meer tekst te vragen dan dat ene veld toelaat.
 */
export default function EditorialIntro({ intro }: EditorialIntroProps) {
  if (!intro) return null;

  return (
    <section className="bg-background py-20 md:py-[112px]">
      <Container width="narrow">
        <Reveal>
          <p className="mx-auto max-w-[46ch] text-center font-display text-[clamp(1.375rem,2.4vw,1.875rem)] leading-[1.55] text-text">
            {intro}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
