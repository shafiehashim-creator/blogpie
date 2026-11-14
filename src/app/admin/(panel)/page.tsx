import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/format";

export default async function AdminHome() {
  const { supabase } = await requireAdmin();
  const { data: posts } = await supabase
    .from("posts")
    .select("id,title,slug,status,published_at,updated_at,category:categories(name)")
    .order("updated_at", { ascending: false });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-4xl font-medium">Artikel</h1>
        <Link href="/admin/posts/new" className="inline-flex min-h-[48px] items-center rounded-full bg-accent px-6 font-medium text-on">+ Artikel baharu</Link>
      </div>
      {!posts?.length ? (
        <p className="text-muted">Belum ada artikel. Mulakan yang pertama.</p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {posts.map((p) => {
            const cat = p.category as unknown as { name: string } | null;
            return (
              <li key={p.id}>
                <Link href={`/admin/posts/${p.id}`} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 hover:bg-soft">
                  <span className="min-w-0">
                    <span className="block font-medium">{p.title}</span>
                    <span className="block text-sm text-muted">{cat?.name ?? "Tiada kategori"} · /tulisan/{p.slug}</span>
                  </span>
                  <span className="text-sm text-muted">
                    <span className={`mr-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.status === "published" ? "bg-accent text-on" : "border border-line"}`}>
                      {p.status === "published" ? "Diterbitkan" : "Draf"}
                    </span>
                    {formatDate(p.published_at ?? p.updated_at)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
