"use server";

import { createPublicClient } from "@/lib/supabase/public";

export type SubscribeState = { status: "idle" | "ok" | "error"; message?: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  // Perangkap bot: medan "website" disembunyikan daripada pengguna sebenar.
  if (formData.get("website")) return { status: "ok", message: "Terima kasih." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "").slice(0, 40) || null;
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: "error", message: "Sila masukkan alamat emel yang sah." };
  }

  const db = createPublicClient();
  if (!db) return { status: "error", message: "Langganan belum dibuka. Cuba lagi sebentar nanti." };

  const { error } = await db.from("subscribers").insert({ email, source });
  // 23505 = emel sudah wujud. Anggap berjaya supaya senarai emel tidak boleh diperiksa.
  if (error && error.code !== "23505") {
    return { status: "error", message: "Maaf, ada masalah. Sila cuba lagi." };
  }
  return { status: "ok", message: "Terima kasih. Emel anda telah didaftarkan." };
}
