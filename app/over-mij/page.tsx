import type { Metadata } from "next";
import SectionRenderer from "@/components/SectionRenderer";
import { overMijPage } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: overMijPage.seo.title,
  description: overMijPage.seo.description,
};

export default function OverMijPage() {
  return (
    <SectionRenderer sections={overMijPage.sections} overrides={{ faq: { columns: 1, compact: false } }} />
  );
}
