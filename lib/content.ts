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

function resolveRepo(): { owner: string; name: string } {
  const combined = process.env.GITHUB_REPO ?? "";
  if (combined.includes("/")) {
    const [owner, name] = combined.split("/");
    return { owner, name };
  }
  return {
    owner: process.env.GITHUB_REPO_OWNER ?? "",
    name: process.env.GITHUB_REPO_NAME ?? "",
  };
}

async function readFromGitHub(): Promise<SiteContent | null> {
  const token = process.env.GITHUB_TOKEN ?? "";
  const { owner, name } = resolveRepo();
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!owner || !name) return null;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${name}/contents/content.json?ref=${branch}`,
      {
        headers: {
          Accept: "application/vnd.github.raw+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    if (!res.ok) return null;
    const parsed: unknown = await res.json();
    if (isSiteContent(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

export async function getContent(): Promise<SiteContent> {
  // GitHub is the persistent store on serverless hosts (e.g. Vercel), where
  // the local filesystem is ephemeral. Read from GitHub whenever a repo is
  // configured (and by default in production), so admin saves are durable and
  // visible across serverless instances. Uses the authenticated Contents API
  // with no-store to always get fresh data (avoids raw CDN caching).
  const useGitHub =
    process.env.USE_GITHUB_CONTENT === "true" ||
    (process.env.NODE_ENV === "production" &&
      process.env.USE_GITHUB_CONTENT !== "false");

  if (useGitHub) {
    const remote = await readFromGitHub();
    if (remote) return remote;
  }

  // Fallback: local file. Reflects admin saves immediately on the same
  // running instance (local dev, or a warm serverless instance).
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
