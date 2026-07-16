import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Dipti Shrestha for documentation projects, quotes, and collaborations.",
};

export default async function ContactPage() {
  const content = await getContent();
  const contact = content.contact;
  const socials = Array.isArray(contact.socials) ? contact.socials : [];

  return (
    <div className="container-editorial py-16 md:py-24">
      <div className="max-w-3xl">
        <span className="tag tag-teal">Contact</span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
          Let&apos;s build clear documentation
        </h1>
        <p className="mt-5 text-lg leading-8 text-ink-soft">
          Tell me about your product and documentation goals. I typically respond
          within one business day.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-7 md:p-9">
          <ContactForm />
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
              Direct
            </h3>
            <ul className="mt-4 space-y-4 text-sm">
              {contact.email && (
                <li>
                  <span className="flex items-center gap-2 text-ink-soft">
                    <Icon name="mail" width={16} height={16} />
                    Email
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-1 block font-medium text-ink transition-colors hover:text-teal-dark"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  <span className="flex items-center gap-2 text-ink-soft">
                    <Icon name="phone" width={16} height={16} />
                    Phone
                  </span>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="mt-1 block font-medium text-ink transition-colors hover:text-teal-dark"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.location && (
                <li>
                  <span className="flex items-center gap-2 text-ink-soft">
                    <Icon name="pin" width={16} height={16} />
                    Location
                  </span>
                  <p className="mt-1 font-medium text-ink">{contact.location}</p>
                </li>
              )}
            </ul>
          </div>

          {socials.length > 0 && (
            <div className="card p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                Elsewhere
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tag hover:border-teal hover:text-teal-dark"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="card bg-gradient-to-br from-ink to-teal-dark p-6 text-white">
            <h3 className="font-display text-lg font-semibold">
              Request a quote
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Prefer email? Send your project brief and I&apos;ll return a scoped
              proposal.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
