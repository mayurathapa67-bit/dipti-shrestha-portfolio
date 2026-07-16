"use client";

import { useEffect, useState } from "react";

export type TocItem = {
  id: string;
  title: string;
  level: number;
};

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft">
        On this page
      </p>
      <ul className="space-y-1 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`toc-link -ml-px block border-l-2 border-transparent py-1.5 pl-4 transition-colors ${
                item.level > 1 ? "pl-7" : ""
              } ${
                activeId === item.id
                  ? "text-teal-dark"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
