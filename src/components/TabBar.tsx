"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

const TABS = [
  { href: "/tulisan", label: "Tulisan", icon: "M5 4h14v16H5zM9 8h6M9 12h6M9 16h4" },
  { href: "/kelas", label: "Kelas", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 8.5l5 3.5-5 3.5z" },
  { href: "/kedai", label: "Kedai", icon: "M6 8h12l-1 12H7zM9 8a3 3 0 0 1 6 0" },
  { href: "/troli", label: "Troli", icon: "M6 6h15l-1.6 8.2a2 2 0 0 1-2 1.6H8.6a2 2 0 0 1-2-1.6L4.5 3H2" },
];

/** Bar tab bawah: mobile sahaja. Sasaran sentuh ≥44px. */
export function TabBar() {
  const pathname = usePathname();
  const { ids } = useCart();
  return (
    <nav
      aria-label="Menu bawah"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-surface px-2 pt-1.5 sm:hidden"
      style={{ paddingBottom: "calc(6px + env(safe-area-inset-bottom))" }}
    >
      {TABS.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        const badge = t.href === "/troli" && ids.length > 0 ? ids.length : 0;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-[52px] min-w-[64px] flex-col items-center gap-0.5 rounded-2xl px-2.5 py-1.5 text-center ${
              active ? "text-accent" : "text-muted"
            }`}
          >
            <span className="relative block h-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={t.icon} />
              </svg>
              {badge > 0 && (
                <span className="absolute -right-2.5 -top-1.5 h-[18px] min-w-[18px] rounded-full bg-accent px-1 text-center text-[11px] font-semibold leading-[18px] text-on">
                  {badge}
                </span>
              )}
            </span>
            <span className="text-xs font-medium">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
