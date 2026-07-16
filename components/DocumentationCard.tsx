import Link from "next/link";
import { Icon } from "./Icon";
import type { PortfolioItem } from "@/lib/types";

const CATEGORY_ACCENT: Record<string, string> = {
  API: "tag-teal",
  SDK: "tag-teal",
  "User Guide": "",
  "Release Notes": "",
  "Knowledge Base": "",
  Tutorial: "",
};

export function DocumentationCard({
  item,
}: {
  item: PortfolioItem;
}) {
  const tags = Array.isArray(item.tech_stack) ? item.tech_stack : [];
  const accent = CATEGORY_ACCENT[item.category] ?? "";

  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-teal/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        {item.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.featured_image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink to-teal-dark">
            <span className="font-display text-3xl text-white/90">
              {item.title.charAt(0)}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 tag bg-paper/90 backdrop-blur">
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-teal-dark">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-soft">
          {item.description}
        </p>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((t) => (
              <span key={t} className={`tag ${accent}`}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-teal-dark">
          <span>View Sample</span>
          <Icon
            name="arrow"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
