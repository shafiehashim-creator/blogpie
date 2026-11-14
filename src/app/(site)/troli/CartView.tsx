"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { btnGhost } from "@/components/ui";
import { PREVIEW_PRODUCTS } from "@/lib/preview-data";

export function CartView() {
  const { ids, remove, ready } = useCart();
  const items = PREVIEW_PRODUCTS.filter((p) => ids.includes(p.id));
  if (!ready) return <p className="text-muted">Memuatkan…</p>;

  if (items.length === 0) {
    return (
      <>
        <p className="mb-5 text-muted">Troli kosong. Layari kedai untuk menambah produk.</p>
        <Link href="/kedai" className={btnGhost}>Ke kedai</Link>
      </>
    );
  }
  const hasDigital = items.some((i) => i.kind === "Digital");
  const hasPhysical = items.some((i) => i.kind === "Fizikal");
  return (
    <>
      <ul className="flex flex-col">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between gap-3 border-t border-line py-3.5">
            <div className="min-w-0">
              <div className="font-medium">{i.name}</div>
              <div className="text-[13px] text-muted">{i.kind} · {i.price}</div>
            </div>
            <button type="button" onClick={() => remove(i.id)} className="min-h-[44px] px-2 text-sm text-muted underline">
              Buang
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col gap-1.5 rounded-2xl bg-soft p-4 text-sm text-muted">
        {hasDigital && <span>Produk digital: pautan muat turun dihantar selepas bayaran.</span>}
        {hasPhysical && <span>Produk fizikal: kos pos dikira melalui EasyParcel mengikut alamat.</span>}
      </div>
      <div className="my-5 flex justify-between font-semibold"><span>Jumlah</span><span>RM XX</span></div>
      <button type="button" disabled className="min-h-[52px] w-full cursor-not-allowed rounded-full bg-accent font-medium text-on opacity-60">
        Teruskan ke bayaran
      </button>
      <p className="mt-2 text-sm text-muted">Bayaran FPX/kad dibuka dalam Fasa 3. Tiada bayaran sebenar dibuat.</p>
    </>
  );
}
