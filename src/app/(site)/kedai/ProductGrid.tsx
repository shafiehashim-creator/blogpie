"use client";

import { useCart } from "@/components/CartProvider";
import { PREVIEW_PRODUCTS } from "@/lib/preview-data";

export function ProductGrid() {
  const { ids, toggle } = useCart();
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,250px),1fr))] gap-6">
      {PREVIEW_PRODUCTS.map((p) => {
        const inCart = ids.includes(p.id);
        return (
          <div key={p.id} className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface">
            <div className="flex h-[180px] items-start bg-soft p-4">
              <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-semibold">{p.kind}</span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="font-serif text-[22px] font-medium leading-tight">{p.name}</span>
              <span className="mt-1.5 text-sm text-muted">{p.desc}</span>
              <span className="mb-4 mt-3.5 font-semibold">{p.price}</span>
              <button
                type="button"
                onClick={() => toggle(p.id)}
                aria-pressed={inCart}
                className={`mt-auto min-h-[48px] rounded-full border text-center font-medium ${
                  inCart ? "border-line text-ink" : "border-accent bg-accent text-on"
                }`}
              >
                {inCart ? "Dalam troli · Buang" : "Tambah ke troli"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
