import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { ContactSubmission } from "./types";
import {
  putFileToGitHub,
  getFileFromGitHub,
  isGitHubEnabled,
} from "./github";

const SUBMISSIONS_PATH = path.join(process.cwd(), "data", "submissions.json");

function useGitHub(): boolean {
  return isGitHubEnabled();
}

function ensureFile(): void {
  try {
    if (!fs.existsSync(SUBMISSIONS_PATH)) {
      fs.writeFileSync(SUBMISSIONS_PATH, "[]", "utf-8");
    }
  } catch {
    // Best-effort; callers handle failures gracefully.
  }
}

function readLocal(): ContactSubmission[] {
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

function writeLocal(all: ContactSubmission[]): boolean {
  try {
    ensureFile();
    fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(all, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export function getSubmissions(): ContactSubmission[] {
  // When GitHub is the source of truth (serverless hosts), read from there,
  // falling back to the local file if the remote is unavailable.
  if (useGitHub()) {
    const remote = getFileFromGitHub("submissions.json");
    if (Array.isArray(remote)) return remote as ContactSubmission[];
  }
  return readLocal();
}

export async function addSubmission(
  submission: Omit<ContactSubmission, "id" | "created_at">
): Promise<{ entry: ContactSubmission; persisted: boolean }> {
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

  let persisted = writeLocal(all);

  if (useGitHub()) {
    const result = await putFileToGitHub(
      "submissions.json",
      all,
      "Add contact submission via site form"
    );
    persisted = result.success || persisted;
  }

  return { entry, persisted };
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const all = getSubmissions();
  const next = all.filter((s) => s.id !== id);
  if (next.length === all.length) return false;

  let persisted = writeLocal(next);

  if (useGitHub()) {
    const result = await putFileToGitHub(
      "submissions.json",
      next,
      "Delete contact submission via admin panel"
    );
    persisted = result.success || persisted;
  }

  return persisted;
}
