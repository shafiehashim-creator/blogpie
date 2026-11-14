import type { Metadata } from "next";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Troli", robots: { index: false } };

export default function TroliPage() {
  return (
    <section className="mx-auto max-w-[640px] py-10">
      <h1 className="mb-6 font-serif text-5xl font-medium tracking-tight">Troli</h1>
      <CartView />
    </section>
  );
}
