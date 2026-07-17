"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  SiteContent,
  PortfolioItem,
  BlogPost,
  Service,
  Testimonial,
  ContactSubmission,
} from "@/lib/types";

type Tab = "content" | "submissions" | "settings";

export function AdminDashboard({ initialContent }: { initialContent: SiteContent }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("content");
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [saved, setSaved] = useState(false);

  async function save() {
    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    }
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="container-editorial py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage portfolio content, review submissions, and configure settings.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="btn btn-accent">
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
          <button onClick={logout} className="btn btn-ghost">
            Log out
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-2 border-b border-line">
        {(["content", "submissions", "settings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "border-teal text-teal-dark"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "content" && (
          <ContentTab content={content} setContent={setContent} />
        )}
        {tab === "submissions" && <SubmissionsTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card mb-6 p-6">
      <h2 className="mb-4 font-display text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function ContentTab({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}) {
  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setContent((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      <Section title="Hero">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="field"
            value={content.hero.title}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                hero: { ...p.hero, title: e.target.value },
              }))
            }
            placeholder="Hero title"
          />
          <input
            className="field"
            value={content.hero.role}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                hero: { ...p.hero, role: e.target.value },
              }))
            }
            placeholder="Role"
          />
          <input
            className="field sm:col-span-2"
            value={content.hero.subtitle}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                hero: { ...p.hero, subtitle: e.target.value },
              }))
            }
            placeholder="Subtitle"
          />
          <input
            className="field"
            value={content.hero.cta_primary}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                hero: { ...p.hero, cta_primary: e.target.value },
              }))
            }
            placeholder="Primary CTA"
          />
          <input
            className="field"
            value={content.hero.cta_secondary}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                hero: { ...p.hero, cta_secondary: e.target.value },
              }))
            }
            placeholder="Secondary CTA"
          />
          <ImageField
            value={content.hero.image}
            onChange={(url) =>
              setContent((p) => ({
                ...p,
                hero: { ...p.hero, image: url },
              }))
            }
            label="Hero Image"
          />
        </div>
      </Section>

      <Section title="About">
        <div className="grid gap-4">
          <input
            className="field"
            value={content.about.headline}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                about: { ...p.about, headline: e.target.value },
              }))
            }
            placeholder="Headline"
          />
          <textarea
            className="field resize-none"
            rows={4}
            value={content.about.bio}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                about: { ...p.about, bio: e.target.value },
              }))
            }
            placeholder="Bio"
          />
          <textarea
            className="field resize-none"
            rows={3}
            value={content.about.philosophy}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                about: { ...p.about, philosophy: e.target.value },
              }))
            }
            placeholder="Philosophy"
          />
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid gap-4 sm:grid-cols-3">
          <input
            className="field"
            value={content.contact.email}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                contact: { ...p.contact, email: e.target.value },
              }))
            }
            placeholder="Email"
          />
          <input
            className="field"
            value={content.contact.phone}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                contact: { ...p.contact, phone: e.target.value },
              }))
            }
            placeholder="Phone"
          />
          <input
            className="field"
            value={content.contact.location}
            onChange={(e) =>
              setContent((p) => ({
                ...p,
                contact: { ...p.contact, location: e.target.value },
              }))
            }
            placeholder="Location"
          />
        </div>
      </Section>

      <ServicesManager
        services={content.services}
        onChange={(s) => update("services", s)}
      />
      <PortfolioManager
        items={content.portfolio}
        onChange={(p) => update("portfolio", p)}
      />
      <BlogManager posts={content.blog} onChange={(b) => update("blog", b)} />
      <TestimonialsManager
        testimonials={content.testimonials}
        onChange={(t) => update("testimonials", t)}
      />
    </div>
  );
}

function ListEditor<T extends object>({
  label,
  items,
  newItem,
  render,
  onChange,
}: {
  label: string;
  items: T[];
  newItem: () => T;
  render: (item: T, index: number, set: (v: T) => void) => React.ReactNode;
  onChange: (items: T[]) => void;
}) {
  const list = Array.isArray(items) ? items : [];
  return (
    <Section title={label}>
      <div className="space-y-4">
        {list.map((item, i) => (
          <div key={i} className="rounded-xl border border-line p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink-soft">
                {(item as { title?: string }).title || `Item ${i + 1}`}
              </span>
              <button
                onClick={() => onChange(list.filter((_, j) => j !== i))}
                className="text-xs font-medium text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
            {render(item, i, (v) =>
              onChange(list.map((x, j) => (j === i ? v : x)))
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => onChange([...list, newItem()])}
        className="btn btn-ghost mt-4 w-full"
      >
        + Add {label.replace("Manager", "").trim()}
      </button>
    </Section>
  );
}

function ServicesManager({
  services,
  onChange,
}: {
  services: Service[];
  onChange: (s: Service[]) => void;
}) {
  return (
    <ListEditor<Service>
      label="Services Manager"
      items={services}
      newItem={() => ({
        title: "New Service",
        description: "",
        icon: "code",
        price: "From $0",
        features: [],
        deliverables: [],
      })}
      render={(item, _i, set) => (
        <div className="grid gap-3">
          <input
            className="field"
            value={item.title}
            onChange={(e) => set({ ...item, title: e.target.value })}
            placeholder="Title"
          />
          <input
            className="field"
            value={item.icon}
            onChange={(e) => set({ ...item, icon: e.target.value })}
            placeholder="Icon (code, book, terminal, edit, compass, database)"
          />
          <input
            className="field"
            value={item.price}
            onChange={(e) => set({ ...item, price: e.target.value })}
            placeholder="Price"
          />
          <textarea
            className="field resize-none"
            rows={2}
            value={item.description}
            onChange={(e) => set({ ...item, description: e.target.value })}
            placeholder="Description"
          />
          <input
            className="field"
            value={item.features.join(", ")}
            onChange={(e) =>
              set({
                ...item,
                features: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Features (comma separated)"
          />
          <input
            className="field"
            value={item.deliverables.join(", ")}
            onChange={(e) =>
              set({
                ...item,
                deliverables: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Deliverables (comma separated)"
          />
        </div>
      )}
      onChange={onChange}
    />
  );
}

function PortfolioManager({
  items,
  onChange,
}: {
  items: PortfolioItem[];
  onChange: (p: PortfolioItem[]) => void;
}) {
  return (
    <ListEditor<PortfolioItem>
      label="Documentation Samples Manager"
      items={items}
      newItem={() => ({
        slug: `sample-${Date.now()}`,
        title: "New Sample",
        category: "API",
        tech_stack: [],
        description: "",
        content: "",
        client: "",
        published_date: new Date().toISOString().slice(0, 10),
        download_link: "#",
        featured_image: "",
      })}
      render={(item, _i, set) => (
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="field"
              value={item.title}
              onChange={(e) => set({ ...item, title: e.target.value })}
              placeholder="Title"
            />
            <input
              className="field"
              value={item.slug}
              onChange={(e) => set({ ...item, slug: e.target.value })}
              placeholder="slug"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="field"
              value={item.category}
              onChange={(e) =>
                set({
                  ...item,
                  category: e.target.value as PortfolioItem["category"],
                })
              }
            >
              {["API", "SDK", "User Guide", "Release Notes", "Knowledge Base", "Tutorial"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
            <input
              className="field"
              value={item.client}
              onChange={(e) => set({ ...item, client: e.target.value })}
              placeholder="Client"
            />
          </div>
          <input
            className="field"
            value={item.tech_stack.join(", ")}
            onChange={(e) =>
              set({
                ...item,
                tech_stack: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Tech stack (comma separated)"
          />
          <textarea
            className="field resize-none"
            rows={2}
            value={item.description}
            onChange={(e) => set({ ...item, description: e.target.value })}
            placeholder="Description"
          />
          <textarea
            className="field resize-none font-mono text-xs"
            rows={6}
            value={item.content}
            onChange={(e) => set({ ...item, content: e.target.value })}
            placeholder="Markdown content with ```code``` blocks"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <ImageField
              value={item.featured_image}
              onChange={(url) => set({ ...item, featured_image: url })}
            />
            <input
              className="field"
              value={item.download_link}
              onChange={(e) => set({ ...item, download_link: e.target.value })}
              placeholder="Download link"
            />
          </div>
        </div>
      )}
      onChange={onChange}
    />
  );
}

function BlogManager({
  posts,
  onChange,
}: {
  posts: BlogPost[];
  onChange: (b: BlogPost[]) => void;
}) {
  return (
    <ListEditor<BlogPost>
      label="Blog Posts Manager"
      items={posts}
      newItem={() => ({
        slug: `post-${Date.now()}`,
        title: "New Post",
        excerpt: "",
        content: "",
        published_date: new Date().toISOString().slice(0, 10),
        read_time: "5 min read",
        category: "Best Practices",
        featured_image: "",
      })}
      render={(item, _i, set) => (
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="field"
              value={item.title}
              onChange={(e) => set({ ...item, title: e.target.value })}
              placeholder="Title"
            />
            <input
              className="field"
              value={item.slug}
              onChange={(e) => set({ ...item, slug: e.target.value })}
              placeholder="slug"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              className="field"
              value={item.category}
              onChange={(e) => set({ ...item, category: e.target.value })}
              placeholder="Category"
            />
            <input
              className="field"
              value={item.read_time}
              onChange={(e) => set({ ...item, read_time: e.target.value })}
              placeholder="Read time"
            />
            <input
              className="field"
              value={item.published_date}
              onChange={(e) => set({ ...item, published_date: e.target.value })}
              placeholder="Date"
            />
          </div>
          <textarea
            className="field resize-none"
            rows={2}
            value={item.excerpt}
            onChange={(e) => set({ ...item, excerpt: e.target.value })}
            placeholder="Excerpt"
          />
          <textarea
            className="field resize-none font-mono text-xs"
            rows={6}
            value={item.content}
            onChange={(e) => set({ ...item, content: e.target.value })}
            placeholder="Markdown content"
          />
          <ImageField
            value={item.featured_image}
            onChange={(url) => set({ ...item, featured_image: url })}
          />
        </div>
      )}
      onChange={onChange}
    />
  );
}

function TestimonialsManager({
  testimonials,
  onChange,
}: {
  testimonials: Testimonial[];
  onChange: (t: Testimonial[]) => void;
}) {
  return (
    <ListEditor<Testimonial>
      label="Testimonials Manager"
      items={testimonials}
      newItem={() => ({
        quote: "",
        name: "",
        role: "",
        company: "",
        avatar: "",
      })}
      render={(item, _i, set) => (
        <div className="grid gap-3">
          <textarea
            className="field resize-none"
            rows={3}
            value={item.quote}
            onChange={(e) => set({ ...item, quote: e.target.value })}
            placeholder="Quote"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              className="field"
              value={item.name}
              onChange={(e) => set({ ...item, name: e.target.value })}
              placeholder="Name"
            />
            <input
              className="field"
              value={item.role}
              onChange={(e) => set({ ...item, role: e.target.value })}
              placeholder="Role"
            />
            <input
              className="field"
              value={item.company}
              onChange={(e) => set({ ...item, company: e.target.value })}
              placeholder="Company"
            />
          </div>
          <input
            className="field"
            value={item.avatar}
            onChange={(e) => set({ ...item, avatar: e.target.value })}
            placeholder="Avatar URL"
          />
        </div>
      )}
      onChange={onChange}
    />
  );
}

function SubmissionsTab() {
  const [subs, setSubs] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await fetch("/api/submissions", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { submissions: ContactSubmission[] };
      setSubs(Array.isArray(data.submissions) ? data.submissions : []);
    } else if (res.status === 401) {
      setMsg("Session expired. Please log in again.");
    } else {
      setMsg("Could not load submissions. Retrying…");
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, []);

  async function remove(id: string) {
    const res = await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) setSubs((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading) return <p className="text-ink-soft">Loading submissions...</p>;

  if (subs.length === 0)
    return (
      <p className="text-ink-soft">
        {msg || "No contact submissions yet."}
      </p>
    );

  if (msg) return <p className="text-ink-soft">{msg}</p>;

  return (
    <div className="space-y-4">
      {subs.map((s) => (
        <div key={s.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">{s.name}</p>
              <p className="text-sm text-ink-soft">
                {s.email} · {new Date(s.created_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => remove(s.id)}
              className="text-xs font-medium text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
          <p className="mt-2 text-sm font-medium text-teal-dark">{s.subject}</p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{s.message}</p>
        </div>
      ))}
    </div>
  );
}

function ImageField({
  value,
  onChange,
  label = "Featured Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function selectFile(next: File | null) {
    setMsg("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(next ? URL.createObjectURL(next) : null);
    setFile(next);
  }

  async function upload() {
    if (!file) return;
    setMsg("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = (await res.json()) as { url: string };
      onChange(data.url);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setFile(null);
      setMsg("Uploaded!");
    } else {
      setMsg("Upload failed. Check Cloudinary config.");
    }
  }

  return (
    <div className="grid gap-3">
      <label className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
        {label}
      </label>

      <input
        className="field font-mono text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL"
      />

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface px-4 py-6 text-center transition-colors hover:border-teal">
        <span className="text-sm font-medium text-ink">
          Choose a photo from your computer
        </span>
        <span className="text-xs text-ink-soft">PNG, JPG, GIF, WebP</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>

      {preview && (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Selected preview"
            className="aspect-video w-full rounded-xl border border-line object-cover"
          />
          {file && (
            <p className="mt-2 truncate text-xs text-ink-soft">
              {file.name} · {(file.size / 1024).toFixed(0)} KB
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={upload}
              className="btn btn-accent flex-1"
            >
              Upload &amp; use this photo
            </button>
            <button
              type="button"
              onClick={() => selectFile(null)}
              className="btn btn-ghost"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {value && !preview && (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Current image"
            className="aspect-video w-full rounded-xl border border-line object-cover"
          />
        </div>
      )}

      {msg && <p className="text-sm text-teal-dark">{msg}</p>}
    </div>
  );
}

function SettingsTab() {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function selectFile(next: File | null) {
    setFile(next);
    setMsg("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(next ? URL.createObjectURL(next) : null);
  }

  async function upload() {
    if (!file) return;
    setMsg("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = (await res.json()) as { url: string };
      setImageUrl(data.url);
      setMsg("Uploaded! URL copied below.");
    } else {
      setMsg("Upload failed. Check Cloudinary config.");
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="card p-6">
        <h2 className="font-display text-xl font-semibold">Image Upload</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Choose a photo from your computer to preview, then upload it to
          Cloudinary for use in samples and blog posts.
        </p>

        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface px-4 py-8 text-center transition-colors hover:border-teal">
          <span className="text-sm font-medium text-ink">
            Click to choose a photo
          </span>
          <span className="text-xs text-ink-soft">
            PNG, JPG, GIF, WebP — up to 10MB
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </label>

        {preview && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink-soft">
              Preview
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Selected preview"
              className="aspect-video w-full rounded-xl border border-line object-cover"
            />
            {file && (
              <p className="mt-2 truncate text-xs text-ink-soft">
                {file.name} · {(file.size / 1024).toFixed(0)} KB
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={upload}
                className="btn btn-accent flex-1"
              >
                Upload to Cloudinary
              </button>
              <button
                onClick={() => selectFile(null)}
                className="btn btn-ghost"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {imageUrl && (
          <input
            readOnly
            value={imageUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="field mt-3 font-mono text-xs"
          />
        )}
        {msg && <p className="mt-2 text-sm text-teal-dark">{msg}</p>}
      </div>

      <div className="card p-6">
        <h2 className="font-display text-xl font-semibold">GitHub Integration</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Content saves are pushed to the configured GitHub repository when
          <span className="font-mono"> GITHUB_TOKEN</span> is set. Falls back to
          local <span className="font-mono">data/content.json</span>.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-ink-soft">
          <li>• GITHUB_REPO_OWNER</li>
          <li>• GITHUB_REPO_NAME</li>
          <li>• GITHUB_BRANCH</li>
          <li>• GITHUB_TOKEN</li>
        </ul>
      </div>
    </div>
  );
}
