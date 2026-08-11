import type { Metadata } from "next";
import SectionRenderer from "@/components/SectionRenderer";
import { fotografiePage } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: fotografiePage.seo.title,
  description: fotografiePage.seo.description,
};

export default function FotografiePage() {
  return <SectionRenderer sections={fotografiePage.sections} />;
}
