import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getContent, getPortfolioItem } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { TableOfContents } from "@/components/TableOfContents";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItem(slug);
  if (!item) return { title: "Sample not found" };
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPortfolioItem(slug);
  if (!item) notFound();

  const content = await getContent();
  const rendered = Markdown({ content: item.content });
  const testimonials = Array.isArray(content.testimonials)
    ? content.testimonials
    : [];
  const featured = testimonials[0] ?? null;

  const tags = Array.isArray(item.tech_stack) ? item.tech_stack : [];

  return (
    <div className="container-editorial py-14 md:py-20">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-teal-dark"
      >
        <Icon name="arrow" className="rotate-180" width={16} height={16} />
        Back to samples
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_260px]">
        <article className="min-w-0">
          <span className="tag tag-teal">{item.category}</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
            {item.title}
          </h1>
          <p className="mt-4 text-lg leading-7 text-ink-soft">
            {item.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="pin" width={15} height={15} />
              {item.client}
            </span>
            <span aria-hidden>·</span>
            <span>
              Published {new Date(item.published_date).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </span>
          </div>

          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="hairline my-10" />

          {rendered.node}

          <div className="mt-12 flex flex-wrap gap-3">
            {item.download_link && item.download_link !== "#" ? (
              <a
                href={item.download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent"
              >
                <Icon name="download" width={16} height={16} />
                Download PDF
              </a>
            ) : (
              <span className="btn btn-ghost opacity-60">
                <Icon name="download" width={16} height={16} />
                PDF available on request
              </span>
            )}
            <Link href="/contact" className="btn btn-ghost">
              Request similar docs
            </Link>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <TableOfContents items={rendered.toc} />

          {featured && (
            <div className="card mt-8 bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                Client says
              </p>
              <p className="mt-3 text-sm italic leading-6 text-ink-soft">
                “{featured.quote}”
              </p>
              <p className="mt-3 text-sm font-semibold">{featured.name}</p>
              <p className="text-xs text-ink-soft">
                {featured.role}, {featured.company}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
