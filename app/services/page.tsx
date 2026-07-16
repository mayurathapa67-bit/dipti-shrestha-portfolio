import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "API documentation, SDK guides, technical editing, documentation strategy, and CMS setup by Dipti Shrestha.",
};

export default async function ServicesPage() {
  const content = await getContent();
  const services = Array.isArray(content.services) ? content.services : [];
  const process = [
    {
      step: "01",
      title: "Discovery & Audit",
      desc: "Understand your product, audience, and existing docs to define scope and success metrics.",
    },
    {
      step: "02",
      title: "Architecture & Drafting",
      desc: "Design the information architecture, then write clear, structured documentation.",
    },
    {
      step: "03",
      title: "Review & Publish",
      desc: "Technical review, editorial polish, and delivery through your preferred pipeline.",
    },
  ];

  return (
    <div className="container-editorial py-16 md:py-24">
      <div className="max-w-3xl">
        <span className="tag tag-teal">Services</span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
          Documentation services, end to end
        </h1>
        <p className="mt-5 text-lg leading-8 text-ink-soft">
          From a single API reference to a full documentation system, I deliver
          precise, developer-friendly content with clear deliverables and
          transparent pricing.
        </p>
      </div>

      <div className="mt-14">
        <ServicesGrid services={services} />
      </div>

      <section className="mt-20 border-t border-line pt-16">
        <h2 className="font-display text-2xl font-semibold md:text-3xl">
          How we&apos;ll work together
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {process.map((p) => (
            <div key={p.step} className="card p-6">
              <span className="font-mono text-sm text-teal-dark">{p.step}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="card flex flex-col items-center justify-between gap-6 bg-gradient-to-br from-ink to-teal-dark p-10 text-center text-white md:flex-row md:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold md:text-3xl">
              Need a custom package?
            </h2>
            <p className="mt-2 max-w-md text-white/70">
              Every engagement is scoped to your product. Let&apos;s build a plan
              that fits.
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
    </div>
  );
}
