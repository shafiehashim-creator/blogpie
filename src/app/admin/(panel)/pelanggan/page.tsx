import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/format";

export default async function PelangganPage() {
  const { supabase } = await requireAdmin();
  const { data, count } = await supabase
    .from("subscribers")
    .select("email,source,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-4xl font-medium">Pelanggan <span className="text-muted">({count ?? 0})</span></h1>
        <a href="/api/admin/subscribers" className="inline-flex min-h-[44px] items-center rounded-full border border-line px-5 text-sm font-medium hover:bg-soft">Muat turun CSV</a>
      </div>
      {!data?.length ? (
        <p className="text-muted">Belum ada pelanggan.</p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {data.map((s) => (
            <li key={s.email} className="flex flex-wrap justify-between gap-2 px-5 py-3 text-sm">
              <span className="font-medium">{s.email}</span>
              <span className="text-muted">{s.source ?? "—"} · {formatDate(s.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
      {(count ?? 0) > 200 && <p className="mt-3 text-sm text-muted">Memaparkan 200 terkini. Gunakan CSV untuk senarai penuh.</p>}
    </>
  );
}
