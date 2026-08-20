import Container from "@/components/layout/Container";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import type { TrustBarBlock } from "@/types/blocks";

type TrustBarProps = {
  block: TrustBarBlock;
};

export default function TrustBar({ block }: TrustBarProps) {
  if (block.items.length === 0) return null;

  return (
    <section aria-label="Waar wij voor staan" className="border-b border-border bg-surface-light">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 py-2 md:grid-cols-4 md:py-[34px]">
            {block.items.map((item, index) => (
              <div
                key={item.title}
                className={`flex items-center gap-4 border-border py-5 md:px-[30px] md:py-1 ${
                  index === 0
                    ? "border-t-0 md:border-l-0 md:pl-0"
                    : "border-t md:border-t-0 md:border-l"
                }`}
              >
                <Icon name={item.icon} size={30} className="shrink-0 text-charcoal-muted" />
                <div>
                  <div className="text-small font-semibold tracking-[.01em]">{item.title}</div>
                  <div className="text-caption text-text-muted">{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
