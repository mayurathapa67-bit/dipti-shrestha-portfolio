import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPost } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { TableOfContents } from "@/components/TableOfContents";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const rendered = Markdown({ content: post.content });

  return (
    <div className="container-editorial py-14 md:py-20">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-teal-dark"
      >
        <Icon name="arrow" className="rotate-180" width={16} height={16} />
        Back to blog
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_240px]">
        <article className="min-w-0">
          <div className="flex items-center gap-3 text-xs text-ink-soft">
            <span className="tag tag-teal">{post.category}</span>
            <span className="font-mono">{post.read_time}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-7 text-ink-soft">{post.excerpt}</p>
          {post.featured_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.featured_image}
              alt={post.title}
              className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          ) : null}

          <div className="hairline my-10" />

          {rendered.node}

          <div className="mt-12 flex justify-center">
            <Link href="/contact" className="btn btn-accent">
              Work with me
              <Icon name="arrow" />
            </Link>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <TableOfContents items={rendered.toc} />
        </aside>
      </div>
    </div>
  );
}
