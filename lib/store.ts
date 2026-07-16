import "server-only";
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_CONTENT } from "./seed";
import type { SiteContent } from "./types";

const LOCAL_CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export function writeContent(content: SiteContent): boolean {
  try {
    fs.writeFileSync(
      LOCAL_CONTENT_PATH,
      JSON.stringify(content, null, 2),
      "utf-8"
    );
    return true;
  } catch {
    return false;
  }
}

export function mergeContent(
  partial: Partial<SiteContent>
): SiteContent {
  const current = DEFAULT_CONTENT;
  return {
    ...current,
    ...partial,
    nav: partial.nav ?? current.nav,
    hero: partial.hero ?? current.hero,
    about: partial.about ?? current.about,
    services: partial.services ?? current.services,
    portfolio: partial.portfolio ?? current.portfolio,
    blog: partial.blog ?? current.blog,
    testimonials: partial.testimonials ?? current.testimonials,
    contact: partial.contact ?? current.contact,
    clients: partial.clients ?? current.clients,
  };
}
