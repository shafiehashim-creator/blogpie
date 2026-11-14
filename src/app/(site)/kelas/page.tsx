import Link from "next/link";
import type { Metadata } from "next";
import { Badge, PlayIcon } from "@/components/ui";
import { PREVIEW_COURSES } from "@/lib/preview-data";

export const metadata: Metadata = {
  title: "Kelas",
  description: "Kelas rakaman. Bayar sekali, akses dibuka serta-merta dan kemajuan anda disimpan.",
  alternates: { canonical: "/kelas" },
};

export default function KelasPage() {
  return (
    <section className="py-10">
      <Badge>Fasa 2 · Pratonton</Badge>
      <h1 className="mb-2 mt-4 font-serif text-5xl font-medium tracking-tight sm:text-[52px]">Kelas</h1>
      <p className="mb-9 max-w-[560px] text-muted">
        Kelas rakaman. Bayar sekali, akses dibuka serta-merta dan kemajuan anda disimpan.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-7">
        {PREVIEW_COURSES.map((c) => (
          <Link key={c.slug} href={`/kelas/${c.slug}`} className="group block overflow-hidden rounded-3xl border border-line bg-surface">
            <span className="flex h-[200px] items-center justify-center bg-soft transition-transform group-hover:-translate-y-0.5">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on"><PlayIcon size={18} /></span>
            </span>
            <span className="block p-6">
              <span className="block text-[13px] text-muted">{c.lessons.length} pelajaran · rakaman</span>
              <span className="mt-1 block font-serif text-[26px] font-medium leading-tight transition-colors group-hover:text-accent">{c.title}</span>
              <span className="mt-2 block text-[15px] text-muted">{c.blurb}</span>
              <span className="mt-4 block font-semibold">{c.price}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
