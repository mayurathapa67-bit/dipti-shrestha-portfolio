import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Documentation Samples",
  description:
    "A filterable portfolio of API references, SDK guides, user manuals, release notes, and knowledge base articles.",
};

export default async function PortfolioPage() {
  const content = await getContent();
  const items = Array.isArray(content.portfolio) ? content.portfolio : [];

  return (
    <div className="container-editorial py-16 md:py-24">
      <div className="max-w-3xl">
        <span className="tag tag-teal">Portfolio</span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
          Documentation Samples
        </h1>
        <p className="mt-5 text-lg leading-8 text-ink-soft">
          A curated selection of technical documentation across APIs, SDKs,
          user guides, release notes, and knowledge base articles. Filter by
          category or search by technology.
        </p>
      </div>

      <div className="mt-14">
        <PortfolioGrid items={items} />
      </div>
    </div>
  );
}
