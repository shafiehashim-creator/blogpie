import { requireAdmin } from "@/lib/admin";

const csv = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("subscribers").select("email,source,created_at").order("created_at", { ascending: false });
  const rows = (data ?? []).map((r) => [csv(r.email), csv(r.source), csv(r.created_at)].join(","));
  return new Response(["email,sumber,tarikh", ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="pelanggan.csv"',
      "Cache-Control": "no-store",
    },
  });
}
