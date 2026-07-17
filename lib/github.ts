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
          message: "Update portfolio content via admin panel",
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
