import type { Metadata } from "next";
import SectionRenderer from "@/components/SectionRenderer";
import { homePage } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: homePage.seo.title,
  description: homePage.seo.description,
};

export default function HomePage() {
  return <SectionRenderer sections={homePage.sections} />;
}
