import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import { writeContent, mergeContent } from "@/lib/store";
import { pushContentToGitHub } from "@/lib/github";
import { isAuthenticated } from "@/lib/session";
import type { SiteContent } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getContent();
  const res = NextResponse.json(content);
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  const merged = mergeContent(body as Partial<SiteContent>);
  const saved = writeContent(merged);

  let github: { success: boolean; message: string } | null = null;
  if (saved) {
    github = await pushContentToGitHub(merged);
  }

  const res = NextResponse.json({
    ok: saved,
    github,
  });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}
