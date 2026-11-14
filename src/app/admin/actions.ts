"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { htmlToText, readingMinutes, sanitizeArticleHtml, toEmbedUrl } from "@/lib/content";
import { slugify } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";

export type FormState = { error?: string };
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "");

/* ------------------------------ Auth ------------------------------ */

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").trim();
  const password = str(fd, "password");
  if (!email || !password) return { error: "Sila isi emel dan kata laluan." };

  let supabase;
  try {
    supabase = await createServerSupabase();
  } catch {
    return { error: "Supabase belum dikonfigurasi (lihat .env.example)." };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Emel atau kata laluan tidak betul." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Akaun ini tiada akses admin." };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ------------------------------ Posts ------------------------------ */

function revalidatePublic(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/tulisan");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/tulisan/${slug}`);
}

export async function savePost(_prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user } = await requireAdmin();

  const id = str(fd, "id") || null;
  const title = str(fd, "title").trim();
  if (!title) return { error: "Tajuk diperlukan." };
  const slug = slugify(str(fd, "slug") || title);
  if (!slug) return { error: "Slug tidak sah." };

  const excerpt = str(fd, "excerpt").trim().slice(0, 400) || null;
  const category_id = str(fd, "category_id") || null;

  const cover_url = str(fd, "cover_url").trim() || null;
  if (cover_url && !/^https:\/\//i.test(cover_url)) return { error: "URL gambar kaver mesti bermula dengan https://" };

  const videoRaw = str(fd, "video_url").trim();
  if (videoRaw && !toEmbedUrl(videoRaw)) return { error: "Pautan video mesti daripada YouTube atau Vimeo." };

  const status = str(fd, "status") === "published" ? "published" : "draft";

  let content_json: unknown = null;
  try {
    const raw = str(fd, "content_json");
    if (raw) content_json = JSON.parse(raw);
  } catch {
    return { error: "Kandungan editor rosak. Muat semula halaman dan cuba lagi." };
  }

  const content_html = sanitizeArticleHtml(str(fd, "content_html"));
  const content_text = htmlToText(content_html);
  if (status === "published" && !content_text && !videoRaw) {
    return { error: "Artikel kosong. Tulis sesuatu atau letak video sebelum menerbitkan." };
  }

  let existing: { published_at: string | null; slug: string } | null = null;
  if (id) {
    const { data } = await supabase.from("posts").select("published_at,slug").eq("id", id).maybeSingle();
    existing = data;
  }
  const published_at = status === "published" ? (existing?.published_at ?? new Date().toISOString()) : (existing?.published_at ?? null);

  const payload = {
    slug,
    title,
    excerpt,
    content_html,
    content_json,
    content_text,
    cover_url,
    video_url: videoRaw || null,
    category_id,
    status,
    published_at,
    reading_minutes: readingMinutes(content_text),
    seo_title: str(fd, "seo_title").trim().slice(0, 120) || null,
    seo_description: str(fd, "seo_description").trim().slice(0, 320) || null,
  };

  let savedId = id;
  if (id) {
    const { error } = await supabase.from("posts").update(payload).eq("id", id);
    if (error) return { error: error.code === "23505" ? "Slug itu sudah digunakan artikel lain." : `Gagal simpan: ${error.message}` };
  } else {
    const { data, error } = await supabase
      .from("posts")
      .insert({ ...payload, author_id: user.id })
      .select("id")
      .single();
    if (error) return { error: error.code === "23505" ? "Slug itu sudah digunakan artikel lain." : `Gagal simpan: ${error.message}` };
    savedId = data.id;
  }

  revalidatePublic(slug);
  if (existing && existing.slug !== slug) revalidatePublic(existing.slug);
  redirect(`/admin/posts/${savedId}?disimpan=${status}`);
}

export async function deletePost(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id");
  if (!id) return;
  const { data } = await supabase.from("posts").select("slug").eq("id", id).maybeSingle();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePublic(data?.slug);
  redirect("/admin");
}

/* ---------------------------- Categories ---------------------------- */

export async function saveCategory(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id") || null;
  const name = str(fd, "name").trim();
  const slug = slugify(str(fd, "slug") || name);
  if (!name || !slug) redirect("/admin/kategori?ralat=" + encodeURIComponent("Nama diperlukan."));
  const row = {
    name,
    slug,
    description: str(fd, "description").trim() || null,
    sort_order: Number.parseInt(str(fd, "sort_order"), 10) || 0,
  };
  const { error } = id
    ? await supabase.from("categories").update(row).eq("id", id)
    : await supabase.from("categories").insert(row);
  if (error) {
    redirect("/admin/kategori?ralat=" + encodeURIComponent(error.code === "23505" ? "Slug sudah digunakan." : error.message));
  }
  revalidatePublic();
  redirect("/admin/kategori");
}

export async function deleteCategory(fd: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(fd, "id");
  if (id) await supabase.from("categories").delete().eq("id", id);
  revalidatePublic();
  redirect("/admin/kategori");
}
