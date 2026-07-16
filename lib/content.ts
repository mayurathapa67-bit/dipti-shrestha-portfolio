import "server-only";
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_CONTENT } from "./seed";
import type { SiteContent } from "./types";

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
  // When USE_GITHUB_CONTENT=true (set on the deployed host, e.g. Vercel),
  // GitHub is the persistent store: reads come from the raw file with
  // no-store so they are always fresh (no CDN caching). This is what makes
  // admin saves durable across serverless instances, since the local
  // filesystem on Vercel is ephemeral.
  if (process.env.USE_GITHUB_CONTENT === "true") {
    const owner = process.env.GITHUB_REPO_OWNER;
    const repo = process.env.GITHUB_REPO_NAME;
    if (owner && repo) {
      try {
        const res = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/${
            process.env.GITHUB_BRANCH ?? "main"
          }/content.json`,
          { cache: "no-store", next: { revalidate: 0 } }
        );
        if (res.ok) {
          const parsed: unknown = await res.json();
          if (isSiteContent(parsed)) return parsed;
        }
      } catch {
        // fall through to local
      }
    }
  }

  // Default: local file is the source of truth. This reflects admin saves
  // immediately on the same running instance (local dev, or a warm
  // serverless instance) without risking stale remote data.
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
