import type { Metadata } from "next";
import { ProductGrid } from "./ProductGrid";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Kedai",
  description: "Produk digital dimuat turun serta-merta. Produk fizikal dihantar melalui kurier.",
  alternates: { canonical: "/kedai" },
};

export default function KedaiPage() {
  return (
    <section className="py-10">
      <Badge>Fasa 3 · Pratonton</Badge>
      <h1 className="mb-2 mt-4 font-serif text-5xl font-medium tracking-tight sm:text-[52px]">Kedai</h1>
      <p className="mb-9 max-w-[560px] text-muted">
        Produk digital dimuat turun serta-merta. Produk fizikal dihantar melalui kurier.
      </p>
      <ProductGrid />
    </section>
  );
}
