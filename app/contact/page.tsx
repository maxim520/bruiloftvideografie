import type { Metadata } from "next";
import SectionRenderer from "@/components/SectionRenderer";
import { contactPage } from "@/lib/mock-data";
import type { SanityImage } from "@/types/blocks";

function resolveImageSrc(image: SanityImage): string {
  return "url" in image ? image.url : "";
}

const { ogImage } = contactPage.seo;

export const metadata: Metadata = {
  title: contactPage.seo.title,
  description: contactPage.seo.description,
  ...(ogImage && {
    openGraph: {
      images: [{ url: resolveImageSrc(ogImage), alt: ogImage.alt }],
    },
  }),
};

export default function ContactPage() {
  return (
    <SectionRenderer
      sections={contactPage.sections}
      overrides={{ faq: { columns: 2, compact: true } }}
    />
  );
}
