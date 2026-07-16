"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DocumentationCard } from "@/components/DocumentationCard";
import { Icon } from "@/components/Icon";
import type { PortfolioItem, DocCategory } from "@/lib/types";

const CATEGORIES: (DocCategory | "All")[] = [
  "All",
  "API",
  "SDK",
  "User Guide",
  "Release Notes",
  "Knowledge Base",
  "Tutorial",
];

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<DocCategory | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.filter((item) => {
      const matchCat = active === "All" || item.category === active;
      const q = query.trim().toLowerCase();
      const matchQuery =
        q === "" ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (Array.isArray(item.tech_stack)
          ? item.tech_stack.join(" ").toLowerCase().includes(q)
          : false);
      return matchCat && matchQuery;
    });
  }, [items, active, query]);

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active === cat
                  ? "bg-ink text-white"
                  : "border border-line text-ink-soft hover:border-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
            width={16}
            height={16}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search samples..."
            className="field pl-9"
            aria-label="Search documentation samples"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">
          No documentation samples match your filters.
        </p>
      ) : (
        <motion.div
          layout
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((item, i) => (
            <motion.div
              key={item.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <DocumentationCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="mt-12 flex justify-center">
        <Link href="/contact" className="btn btn-accent">
          Request a custom sample
          <Icon name="arrow" />
        </Link>
      </div>
    </div>
  );
}
