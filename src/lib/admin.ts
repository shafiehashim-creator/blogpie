import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Pastikan pengguna semasa log masuk DAN berperanan admin (semakan profiles.role).
 * Panggil di setiap halaman admin, tindakan pelayan dan route handler.
 * RLS dalam pangkalan data ialah lapisan kedua: tanpa peranan admin, tulis akan ditolak juga.
 */
export async function requireAdmin() {
  let supabase;
  try {
    supabase = await createServerSupabase();
  } catch {
    redirect("/admin/login");
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/admin/login?ralat=akses");
  return { supabase, user: data.user };
}
