import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isAuthenticated } from "@/lib/session";

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  api_key: process.env.CLOUDINARY_API_KEY ?? "",
  api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
});

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json(
      { error: "Cloudinary not configured" },
      { status: 500 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUrl = `data:${file.type || "application/octet-stream"};base64,${buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "dipti-portfolio",
      resource_type: "auto",
    });

    const res = NextResponse.json({
      ok: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
    res.headers.set("Cache-Control", "no-store, max-age=0");
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
