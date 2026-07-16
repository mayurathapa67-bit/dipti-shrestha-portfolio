"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import type { BlogPost } from "@/lib/types";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const list = useMemo(
    () => (Array.isArray(posts) ? posts : []),
    [posts]
  );
  const categories = useMemo(() => {
    const set = new Set<string>();
    list.forEach((p) => set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [list]);

  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () =>
      active === "All" ? list : list.filter((p) => p.category === active),
    [list, active]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-line pb-6">
        {categories.map((cat) => (
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

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-teal/40"
          >
            <div className="aspect-[16/9] overflow-hidden bg-surface-2">
              {post.featured_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-3 text-xs text-ink-soft">
                <span className="tag tag-teal">{post.category}</span>
                <span className="font-mono">{post.read_time}</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold leading-snug transition-colors group-hover:text-teal-dark">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-soft">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-teal-dark">
                Read article
                <Icon
                  name="arrow"
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
