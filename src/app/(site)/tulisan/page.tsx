import Link from "next/link";
import type { Metadata } from "next";
import { PostGrid } from "@/components/PostCard";
import { getCategories, listPosts } from "@/lib/posts";
import { PAGE_SIZE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tulisan",
  description: "Artikel dan video tentang keputusan, pengajaran dan pandangan industri penerbitan.",
  alternates: { canonical: "/tulisan" },
};

type Search = { q?: string; kategori?: string; halaman?: string };

function href(p: { q?: string; kategori?: string; halaman?: number }) {
  const sp = new URLSearchParams();
  if (p.q) sp.set("q", p.q);
  if (p.kategori) sp.set("kategori", p.kategori);
  if (p.halaman && p.halaman > 1) sp.set("halaman", String(p.halaman));
  const s = sp.toString();
  return s ? `/tulisan?${s}` : "/tulisan";
}

export default async function TulisanPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 80);
  const kategori = sp.kategori ?? "";
  const page = Math.max(1, parseInt(sp.halaman ?? "1", 10) || 1);

  const [categories, { posts, total }] = await Promise.all([
    getCategories(),
    listPosts({ q, category: kategori || undefined, page }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const chip = (active: boolean) =>
    `flex min-h-[44px] items-center rounded-full border px-[18px] text-sm font-medium ${
      active ? "border-ink bg-ink text-bg" : "border-line text-ink hover:bg-soft"
    }`;

  return (
    <section className="py-10">
      <h1 className="mb-2 font-serif text-5xl font-medium tracking-tight sm:text-[52px]">Tulisan</h1>
      <p className="mb-8 max-w-[560px] text-muted">
        Tentang keputusan, pengajaran dan pandangan industri. Ada yang ditulis, ada yang dirakam.
      </p>

      <div className="mb-9 flex flex-wrap items-center gap-3">
        <form action="/tulisan" role="search" className="flex-[1_1_240px] sm:max-w-[360px]">
          {kategori && <input type="hidden" name="kategori" value={kategori} />}
          <label htmlFor="cari" className="sr-only">Cari tulisan</label>
          <input
            id="cari"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Cari tulisan…"
            className="min-h-[44px] w-full rounded-full border border-line bg-surface px-[18px]"
          />
        </form>
        <div className="flex flex-wrap gap-2">
          <Link href={href({ q })} className={chip(!kategori)} aria-current={!kategori ? "true" : undefined}>
            Semua
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={href({ q, kategori: c.slug })} className={chip(kategori === c.slug)} aria-current={kategori === c.slug ? "true" : undefined}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {posts.length > 0 ? (
        <PostGrid posts={posts} showExcerpt />
      ) : (
        <p className="text-muted">
          {q || kategori ? "Tiada tulisan sepadan. Cuba kata kunci atau kategori lain." : "Belum ada tulisan diterbitkan."}
        </p>
      )}

      {pages > 1 && (
        <nav aria-label="Halaman" className="mt-12 flex items-center justify-between gap-4">
          {page > 1 ? (
            <Link href={href({ q, kategori, halaman: page - 1 })} rel="prev" className="flex min-h-[44px] items-center font-medium text-accent">&larr; Terdahulu</Link>
          ) : <span />}
          <span className="text-sm text-muted">Halaman {page} / {pages}</span>
          {page < pages ? (
            <Link href={href({ q, kategori, halaman: page + 1 })} rel="next" className="flex min-h-[44px] items-center font-medium text-accent">Seterusnya &rarr;</Link>
          ) : <span />}
        </nav>
      )}
    </section>
  );
}
