import { NextRequest, NextResponse } from "next/server";
import { addSubmission } from "@/lib/submissions";

export const dynamic = "force-dynamic";

function isValid(body: unknown): body is {
  name: string;
  email: string;
  subject: string;
  message: string;
} {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    typeof b.email === "string" &&
    typeof b.subject === "string" &&
    typeof b.message === "string"
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!isValid(body)) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const { entry, persisted } = await addSubmission(body);
  if (!persisted) {
    return NextResponse.json(
      { error: "Could not save your message. Please try again later." },
      { status: 500 }
    );
  }
  const res = NextResponse.json({ ok: true, id: entry.id });
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}
