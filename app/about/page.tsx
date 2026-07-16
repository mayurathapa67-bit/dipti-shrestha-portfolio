import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dipti Shrestha is a Technical Writer & Documentation Architect specializing in API, SDK, and software documentation.",
};

export default async function AboutPage() {
  const content = await getContent();
  const about = content.about;
  const experience = Array.isArray(about.experience) ? about.experience : [];
  const certifications = Array.isArray(about.certifications)
    ? about.certifications
    : [];
  const tools = Array.isArray(about.tools) ? about.tools : [];
  const domains = Array.isArray(about.domains) ? about.domains : [];
  const expertise = Array.isArray(about.expertise) ? about.expertise : [];

  return (
    <div className="container-editorial py-16 md:py-24">
      <div className="max-w-3xl">
        <span className="tag tag-teal">{about.headline}</span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
          {content.hero.role}
        </h1>
        <p className="mt-6 text-lg leading-8 text-ink-soft">{about.bio}</p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold">
            Experience
          </h2>
          <div className="mt-6 space-y-8 border-l border-line pl-6">
            {experience.map((exp) => (
              <div key={`${exp.company}-${exp.role}`} className="relative">
                <span className="absolute -left-[1.6rem] top-1.5 h-3 w-3 rounded-full border-2 border-teal bg-paper" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">
                    {exp.role}
                  </h3>
                  <span className="font-mono text-xs text-ink-soft">
                    {exp.duration}
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-medium text-teal-dark">
                  {exp.company}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {Array.isArray(exp.achievements) &&
                    exp.achievements.map((a) => (
                      <li
                        key={a}
                        className="flex items-start gap-2 text-sm leading-6 text-ink-soft"
                      >
                        <Icon
                          name="check"
                          className="mt-1 shrink-0 text-teal"
                          width={15}
                          height={15}
                        />
                        <span>{a}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-10">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
              Core Expertise
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {expertise.map((e) => (
                <span key={e} className="tag">
                  {e}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
              Certifications
            </h3>
            <ul className="mt-4 space-y-2.5">
              {certifications.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-ink-soft">
                  <Icon
                    name="check"
                    className="mt-0.5 shrink-0 text-teal"
                    width={15}
                    height={15}
                  />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
              Philosophy
            </h3>
            <p className="mt-3 border-l-2 border-teal pl-4 text-sm italic leading-6 text-ink-soft">
              {about.philosophy}
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            Tools & Platforms
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {tools.map((t) => (
              <span key={t} className="tag tag-teal">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
            Technical Domains
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {domains.map((d) => (
              <span key={d} className="tag">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
