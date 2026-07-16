import Link from "next/link";
import type { ContactContent, NavLink } from "@/lib/types";

export function Footer({
  contact,
  navLinks,
  logo,
}: {
  contact: ContactContent;
  navLinks: NavLink[];
  logo: string;
}) {
  const year = new Date().getFullYear();
  const links = Array.isArray(navLinks) ? navLinks : [];
  const socials = contact?.socials && Array.isArray(contact.socials) ? contact.socials : [];

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-editorial grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-tight"
          >
            {logo || "Dipti Shrestha"}
            <span className="text-teal">.</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">
            Technical Writer & Documentation Architect. Transforming complex
            information into clear, user-friendly documentation.
          </p>
          {Array.isArray(contact?.socials) && socials.length > 0 && (
            <div className="mt-5 flex gap-3">
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
          )}
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            Navigate
          </h4>
          <ul className="mt-4 space-y-2.5">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-ink-soft transition-colors hover:text-teal-dark"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            Contact
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            {contact?.email && (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="transition-colors hover:text-teal-dark"
                >
                  {contact.email}
                </a>
              </li>
            )}
            {contact?.phone && (
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="transition-colors hover:text-teal-dark"
                >
                  {contact.phone}
                </a>
              </li>
            )}
            {contact?.location && <li>{contact.location}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-editorial flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-soft sm:flex-row">
          <p>© {year} {logo || "Dipti Shrestha"}. All rights reserved.</p>
          <p>Built with clarity & precision.</p>
        </div>
      </div>
    </footer>
  );
}
