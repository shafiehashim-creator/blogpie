import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Tentang Shafie Hashim, penerbit Islam di Kuala Lumpur.",
  alternates: { canonical: "/tentang" },
};

export default function TentangPage() {
  return (
    <section className="flex flex-wrap items-start gap-12 py-14">
      <div className="flex aspect-[4/5] w-full max-w-[320px] flex-[0_1_320px] items-end rounded-[28px] border border-line bg-soft p-5">
        <span className="text-xs text-muted">[Foto potret]</span>
      </div>
      <div className="min-w-0 max-w-[640px] flex-[1_1_420px]">
        <h1 className="mb-6 font-serif text-5xl font-medium leading-[1.1] tracking-tight">Tentang</h1>
        <p className="mb-[18px] font-serif text-2xl leading-normal">
          [Satu perenggan pengenalan anda: siapa anda, apa yang anda pimpin, dan apa yang pembaca akan dapat di sini.]
        </p>
        <p className="mb-7 text-muted">[Perenggan kedua: perjalanan, nilai dan topik yang anda tulis.]</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/tulisan" className="min-h-[48px]">Baca tulisan</ButtonLink>
          <ButtonLink href="/" variant="ghost">Laman utama</ButtonLink>
        </div>
      </div>
    </section>
  );
}
