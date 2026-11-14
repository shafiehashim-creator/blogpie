"use client";

import { useActionState, useState } from "react";
import { savePost, type FormState } from "@/app/admin/actions";
import { slugify } from "@/lib/format";
import type { AdminPost, Category } from "@/lib/types";
import { Editor } from "./Editor";

const input = "min-h-[44px] w-full rounded-xl border border-line bg-surface px-3.5";
const label = "mb-1 block text-sm font-medium";

export function PostForm({ post, categories }: { post?: AdminPost; categories: Category[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, {});
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [cover, setCover] = useState(post?.cover_url ?? "");
  const [html, setHtml] = useState(post?.content_html ?? "");
  const [json, setJson] = useState<unknown>(post?.content_json ?? null);
  const [coverMsg, setCoverMsg] = useState("");

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCoverMsg("Memuat naik…");
    const body = new FormData();
    body.set("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal");
      setCover(data.url);
      setCoverMsg("");
    } catch (err) {
      setCoverMsg(err instanceof Error ? err.message : "Gagal muat naik");
    }
  }

  const published = post?.status === "published";
  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="content_html" value={html} />
      <input type="hidden" name="content_json" value={json ? JSON.stringify(json) : ""} />

      <div className="min-w-0 space-y-5">
        <div>
          <label htmlFor="title" className={label}>Tajuk</label>
          <input
            id="title" name="title" required value={title} className={`${input} font-serif text-2xl`}
            onChange={(e) => { setTitle(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }}
          />
        </div>
        <div>
          <label htmlFor="excerpt" className={label}>Ringkasan (paragraf pembuka & huraian kad)</label>
          <textarea id="excerpt" name="excerpt" rows={3} maxLength={400} defaultValue={post?.excerpt ?? ""} className={`${input} py-2.5`} />
        </div>
        <div>
          <span className={label}>Isi</span>
          <Editor initialHtml={post?.content_html ?? ""} initialJson={post?.content_json ?? null} onChange={(h, j) => { setHtml(h); setJson(j); }} />
        </div>
      </div>

      <aside className="space-y-5">
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-4">
          <p className="text-sm text-muted">
            Status: <b className="text-ink">{published ? "Diterbitkan" : "Draf"}</b>
          </p>
          {state.error && <p role="alert" className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-900 dark:bg-red-950 dark:text-red-200">{state.error}</p>}
          <button type="submit" name="status" value="published" disabled={pending} className="min-h-[48px] w-full rounded-full bg-accent font-medium text-on disabled:opacity-60">
            {pending ? "Menyimpan…" : published ? "Kemas kini" : "Terbitkan"}
          </button>
          <button type="submit" name="status" value="draft" disabled={pending} className="min-h-[48px] w-full rounded-full border border-line font-medium hover:bg-soft disabled:opacity-60">
            {published ? "Tarik balik ke draf" : "Simpan draf"}
          </button>
          {post && published && (
            <a href={`/tulisan/${post.slug}`} target="_blank" rel="noreferrer" className="block text-center text-sm text-accent underline">Lihat di laman ↗</a>
          )}
        </div>

        <div>
          <label htmlFor="slug" className={label}>Slug (URL)</label>
          <input id="slug" name="slug" value={slug} className={input} onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} />
        </div>
        <div>
          <label htmlFor="category_id" className={label}>Kategori</label>
          <select id="category_id" name="category_id" defaultValue={post?.category_id ?? ""} className={input}>
            <option value="">— Tiada —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="video_url" className={label}>Video utama (YouTube / Vimeo)</label>
          <input id="video_url" name="video_url" type="url" defaultValue={post?.video_url ?? ""} placeholder="https://youtu.be/…" className={input} />
        </div>
        <div>
          <label htmlFor="cover_url" className={label}>Gambar kaver</label>
          <input id="cover_url" name="cover_url" type="url" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://…" className={input} />
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadCover} aria-label="Muat naik gambar kaver" className="mt-2 block w-full text-sm" />
          {coverMsg && <p className="mt-1 text-sm text-muted">{coverMsg}</p>}
        </div>

        <fieldset className="space-y-3 rounded-2xl border border-line p-4">
          <legend className="px-1 text-sm font-medium">SEO (pilihan)</legend>
          <div>
            <label htmlFor="seo_title" className={label}>Tajuk SEO</label>
            <input id="seo_title" name="seo_title" maxLength={120} defaultValue={post?.seo_title ?? ""} className={input} />
          </div>
          <div>
            <label htmlFor="seo_description" className={label}>Huraian SEO</label>
            <textarea id="seo_description" name="seo_description" rows={3} maxLength={320} defaultValue={post?.seo_description ?? ""} className={`${input} py-2.5`} />
          </div>
        </fieldset>
      </aside>
    </form>
  );
}
