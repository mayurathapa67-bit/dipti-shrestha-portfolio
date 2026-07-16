import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { BlogList } from "@/components/BlogList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on documentation best practices, tooling, API writing, and industry trends by Dipti Shrestha.",
};

export default async function BlogPage() {
  const content = await getContent();
  const posts = Array.isArray(content.blog) ? content.blog : [];

  return (
    <div className="container-editorial py-16 md:py-24">
      <div className="max-w-3xl">
        <span className="tag tag-teal">Blog</span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
          Technical Writing Insights
        </h1>
        <p className="mt-5 text-lg leading-8 text-ink-soft">
          Practical notes on documentation best practices, tools, API writing
          guides, and where the discipline is heading.
        </p>
      </div>

      <div className="mt-14">
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
