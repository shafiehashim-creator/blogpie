import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge, PlayIcon } from "@/components/ui";
import { PREVIEW_COURSES } from "@/lib/preview-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PREVIEW_COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = PREVIEW_COURSES.find((x) => x.slug === slug);
  return c ? { title: c.title, description: c.blurb, alternates: { canonical: `/kelas/${c.slug}` } } : {};
}

export default async function KelasDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = PREVIEW_COURSES.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <section className="py-8">
      <Link href="/kelas" className="flex min-h-[44px] items-center font-medium text-accent">&larr; Semua kelas</Link>
      <div className="mt-3"><Badge>Fasa 2 · Pratonton</Badge></div>
      <h1 className="mb-7 mt-3 font-serif text-4xl font-medium leading-[1.1] tracking-tight sm:text-[42px]">{course.title}</h1>
      <div className="flex flex-wrap items-start gap-8">
        <div className="min-w-0 flex-[999_1_560px]">
          <div className="flex aspect-video w-full flex-col justify-between rounded-[20px] bg-ink p-6 text-bg">
            <span className="text-[13px] opacity-80">Pelajaran 1</span>
            <span className="flex h-[72px] w-[72px] items-center justify-center self-center rounded-full bg-accent text-on"><PlayIcon size={24} /></span>
            <span className="font-serif text-[22px]">{course.lessons[0].title}</span>
          </div>
          <p className="mb-4 mt-5 text-muted">{course.blurb}</p>
          <button type="button" disabled className="min-h-[48px] cursor-not-allowed rounded-full bg-accent px-6 font-medium text-on opacity-60">
            Daftar kelas · {course.price}
          </button>
          <p className="mt-2 text-sm text-muted">Pendaftaran dibuka dalam Fasa 2. Belum ada bayaran sebenar.</p>
        </div>
        <aside aria-label="Senarai pelajaran" className="min-w-0 flex-[1_1_300px] rounded-[20px] border border-line bg-surface p-2">
          {course.lessons.map((l, i) => (
            <div key={l.title} className={`flex min-h-[52px] items-center gap-2.5 rounded-2xl px-3.5 py-2.5 ${i === 0 ? "bg-soft" : "text-muted"}`}>
              <span className="w-7 flex-none text-[13px] text-muted">{i + 1}</span>
              <span className="min-w-0 flex-1 text-[15px] font-medium">{l.title}</span>
              <span className="flex-none text-xs text-muted">{i === 0 ? "Pratonton" : "Terkunci"}</span>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
