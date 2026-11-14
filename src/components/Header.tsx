"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartIcon } from "./CartIcon";
import { useCart } from "./CartProvider";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/tulisan", label: "Tulisan" },
  { href: "/kelas", label: "Kelas" },
  { href: "/kedai", label: "Kedai" },
  { href: "/tentang", label: "Tentang" },
];

export function Header() {
  const pathname = usePathname();
  const { ids } = useCart();
  return (
    <header className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-6 py-5">
      <Link href="/" aria-label="Ke laman utama" className="font-serif text-2xl font-semibold tracking-tight">
        Shafie Hashim
      </Link>
      <nav aria-label="Utama" className="flex items-center gap-x-6">
        <div className="hidden items-center gap-x-6 sm:flex">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[44px] items-center border-b-2 text-[15px] font-medium hover:text-accent ${
                  active ? "border-accent text-ink" : "border-transparent text-muted"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </div>
        <ThemeToggle />
        <Link
          href="/troli"
          aria-label={`Buka troli (${ids.length})`}
          className="hidden h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:bg-soft sm:flex"
        >
          <CartIcon />
          <span>{ids.length}</span>
        </Link>
      </nav>
    </header>
  );
}
