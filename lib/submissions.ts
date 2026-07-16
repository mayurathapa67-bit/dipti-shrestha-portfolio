import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { ContactSubmission } from "./types";

const SUBMISSIONS_PATH = path.join(process.cwd(), "data", "submissions.json");

function ensureFile(): void {
  try {
    if (!fs.existsSync(SUBMISSIONS_PATH)) {
      fs.writeFileSync(SUBMISSIONS_PATH, "[]", "utf-8");
    }
  } catch {
    // Best-effort; callers handle failures gracefully.
  }
}

export function getSubmissions(): ContactSubmission[] {
  try {
    ensureFile();
    const raw = fs.readFileSync(SUBMISSIONS_PATH, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as ContactSubmission[];
    return [];
  } catch {
    return [];
  }
}

export function addSubmission(
  submission: Omit<ContactSubmission, "id" | "created_at">
): ContactSubmission {
  const entry: ContactSubmission = {
    ...submission,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
    created_at: new Date().toISOString(),
  };
  const all = getSubmissions();
  all.unshift(entry);
  try {
    fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(all, null, 2), "utf-8");
  } catch {
    // Swallow write errors; submission object is still returned.
  }
  return entry;
}

export function deleteSubmission(id: string): boolean {
  const all = getSubmissions();
  const next = all.filter((s) => s.id !== id);
  if (next.length === all.length) return false;
  try {
    fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(next, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}
