import "server-only";
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_CONTENT } from "./seed";
import type { SiteContent } from "./types";

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/diptishrestha/portfolio-content/main";
const LOCAL_CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.nav === "object" &&
    typeof v.hero === "object" &&
    typeof v.about === "object" &&
    typeof v.contact === "object"
  );
}

function readLocalFile(): SiteContent {
  try {
    const raw = fs.readFileSync(LOCAL_CONTENT_PATH, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (isSiteContent(parsed)) return parsed;
    return DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function getContent(): Promise<SiteContent> {
  try {
    const res = await fetch(`${GITHUB_RAW_BASE}/content.json`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const parsed: unknown = await res.json();
      if (isSiteContent(parsed)) return parsed;
    }
  } catch {
    // Network or parsing failure — fall through to local file.
  }
  return readLocalFile();
}

export function getDefaultContent(): SiteContent {
  return DEFAULT_CONTENT;
}

export async function getPortfolioItem(
  slug: string
): Promise<SiteContent["portfolio"][number] | null> {
  const content = await getContent();
  const items = Array.isArray(content.portfolio) ? content.portfolio : [];
  const match = items.find((item) => item.slug === slug);
  return match ?? null;
}

export async function getBlogPost(
  slug: string
): Promise<SiteContent["blog"][number] | null> {
  const content = await getContent();
  const posts = Array.isArray(content.blog) ? content.blog : [];
  const match = posts.find((post) => post.slug === slug);
  return match ?? null;
}
