import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
const MAX = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const { supabase } = await requireAdmin();
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Tiada fail." }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Hanya JPG, PNG, WebP atau AVIF." }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Gambar melebihi 5 MB." }, { status: 400 });

  const now = new Date();
  const path = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("post-images").upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
