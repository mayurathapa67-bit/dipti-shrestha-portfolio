import { NextRequest, NextResponse } from "next/server";
import { getSubmissions, deleteSubmission } from "@/lib/submissions";
import { isAuthenticated } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submissions = getSubmissions();
  const res = NextResponse.json({ submissions });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const deleted = deleteSubmission(id);
  const res = NextResponse.json({ ok: deleted });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}
