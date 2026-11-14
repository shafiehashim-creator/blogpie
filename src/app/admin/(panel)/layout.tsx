import Link from "next/link";
import { logout } from "../actions";
import { requireAdmin } from "@/lib/admin";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  const link = "flex min-h-[44px] items-center text-[15px] font-medium text-muted hover:text-accent";
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-3">
        <Link href="/admin" className="font-serif text-xl font-semibold">Admin</Link>
        <nav aria-label="Admin" className="flex flex-wrap items-center gap-x-6">
          <Link href="/admin" className={link}>Artikel</Link>
          <Link href="/admin/kategori" className={link}>Kategori</Link>
          <Link href="/admin/pelanggan" className={link}>Pelanggan</Link>
          <Link href="/" target="_blank" className={link}>Lihat laman ↗</Link>
          <form action={logout}>
            <button type="submit" className={link} title={user.email ?? undefined}>Log keluar</button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
