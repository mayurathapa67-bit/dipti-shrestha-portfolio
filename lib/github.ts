import "server-only";

const GITHUB_API_BASE = "https://api.github.com";

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

const { owner: REPO_OWNER, name: REPO_NAME } = resolveRepo();
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const TOKEN = process.env.GITHUB_TOKEN ?? "";

export type GitHubFileResult = {
  success: boolean;
  message: string;
  sha?: string;
};

export function isGitHubEnabled(): boolean {
  const configured = Boolean(TOKEN && REPO_OWNER && REPO_NAME);
  if (!configured) return false;
  // Explicit opt-in via USE_GITHUB_CONTENT takes priority.
  if (process.env.USE_GITHUB_CONTENT === "true") return true;
  if (process.env.USE_GITHUB_CONTENT === "false") return false;
  // Default: use GitHub in production (serverless FS is ephemeral), local in dev.
  return process.env.NODE_ENV === "production";
}

export async function getGitHubFileSha(
  path: string
): Promise<string | null> {
  if (!TOKEN) return null;
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (data && typeof data === "object" && "sha" in data) {
      return (data as { sha: string }).sha;
    }
    return null;
  } catch {
    return null;
  }
}

export async function pushContentToGitHub(
  content: unknown
): Promise<GitHubFileResult> {
  if (!TOKEN) {
    return {
      success: false,
      message: "GitHub token not configured.",
    };
  }
  if (!REPO_OWNER || !REPO_NAME) {
    return {
      success: false,
      message:
        "GitHub repo not configured. Set GITHUB_REPO=owner/name (or GITHUB_REPO_OWNER + GITHUB_REPO_NAME).",
    };
  }
  const filePath = "content.json";
  return putFileToGitHub(filePath, content, "Update portfolio content via admin panel");
}

export async function putFileToGitHub(
  filePath: string,
  content: unknown,
  message: string
): Promise<GitHubFileResult> {
  const sha = await getGitHubFileSha(filePath);
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          content: Buffer.from(JSON.stringify(content, null, 2)).toString(
            "base64"
          ),
          branch: BRANCH,
          ...(sha ? { sha } : {}),
        }),
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    if (res.ok) {
      return { success: true, message: "Pushed to GitHub.", sha: undefined };
    }
    const data: unknown = await res.json().catch(() => ({}));
    const msg =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : "GitHub push failed.";
    return { success: false, message: msg };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "GitHub push error.",
    };
  }
}

export async function getFileFromGitHub(
  filePath: string
): Promise<unknown | null> {
  if (!TOKEN || !REPO_OWNER || !REPO_NAME) return null;
  try {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/vnd.github.raw+json",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
