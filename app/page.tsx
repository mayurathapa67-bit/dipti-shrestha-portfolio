import Link from "next/link";
import { getContent } from "@/lib/content";
import { Hero } from "@/components/Hero";
import { DocumentationCard } from "@/components/DocumentationCard";
import { ServicesGrid } from "@/components/ServicesGrid";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { ClientLogos } from "@/components/ClientLogos";
import { Icon } from "@/components/Icon";
import { CodeSnippet } from "@/components/CodeSnippet";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Clarity through technical excellence — API, SDK, and software documentation by Dipti Shrestha.",
};

export default async function HomePage() {
  const content = await getContent();
  const featured = Array.isArray(content.portfolio)
    ? content.portfolio.slice(0, 3)
    : [];
  const services = Array.isArray(content.services)
    ? content.services.slice(0, 3)
    : [];

  return (
    <>
      <Hero hero={content.hero} />

      <section className="border-b border-line bg-surface/60">
        <div className="container-editorial py-10">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-ink-soft">
            Trusted by teams at
          </p>
          <ClientLogos clients={content.clients} />
        </div>
      </section>

      <section className="container-editorial py-20">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="tag tag-teal">Featured Documentation</span>
            <h2 className="mt-4 font-display text-3xl font-semibold md:text-4xl">
              Samples that speak for themselves
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-teal-dark"
          >
            View all samples
            <Icon
              name="arrow"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <DocumentationCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-ink py-20 text-white">
        <div className="container-editorial grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="tag border-white/20 bg-white/10 text-white/80">
              Docs as a craft
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold md:text-4xl">
              Documentation should read like a great product
            </h2>
            <p className="mt-5 max-w-md leading-7 text-white/70">
              I treat every guide, reference, and release note as a piece of
              design — precise, structured, and genuinely useful to the person on
              the other side of the screen.
            </p>
            <Link
              href="/about"
              className="btn mt-8 bg-white text-ink hover:bg-white/90"
            >
              About Dipti
              <Icon name="arrow" />
            </Link>
          </div>
          <CodeSnippet
            language="typescript"
            filename="quickstart.ts"
            code={`import { Client } from "@dipti/sdk";\n\nconst client = new Client({\n  apiKey: process.env.API_KEY,\n});\n\n// Clear, copy-ready examples\nconst user = await client.users.create({\n  email: "dev@example.com",\n});\n\nconsole.log(user.id);`}
          />
        </div>
      </section>

      <section className="container-editorial py-20">
        <div className="mb-10 text-center">
          <span className="tag tag-teal">Services</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold md:text-4xl">
            What I can build for your team
          </h2>
        </div>
        <ServicesGrid services={services} />
        <div className="mt-12 text-center">
          <Link href="/services" className="btn btn-accent">
            Explore all services
            <Icon name="arrow" />
          </Link>
        </div>
      </section>

      <section className="border-t border-line bg-surface/60 py-20">
        <div className="container-editorial">
          <div className="mb-12 text-center">
            <span className="tag tag-teal">Testimonials</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold md:text-4xl">
              What clients say
            </h2>
          </div>
          <TestimonialsCarousel testimonials={content.testimonials} />
        </div>
      </section>

      <section className="container-editorial py-20">
        <div className="card flex flex-col items-center justify-between gap-6 bg-gradient-to-br from-ink to-teal-dark p-10 text-center text-white md:flex-row md:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold md:text-3xl">
              Have a documentation project in mind?
            </h2>
            <p className="mt-2 max-w-md text-white/70">
              Let&apos;s discuss how clear documentation can reduce support load
              and accelerate adoption.
            </p>
          </div>
          <Link
            href="/contact"
            className="btn shrink-0 bg-white text-ink hover:bg-white/90"
          >
            Get a Quote
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}
