import Link from "next/link";
import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { PostGrid } from "@/components/PostCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import { ButtonLink, Badge, Eyebrow } from "@/components/ui";
import { listPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteUrl } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — Penerbit, penulis, pemimpin` },
  description: SITE_DESCRIPTION,
};

const STATS = ["tahun dalam penerbitan", "tajuk diterbitkan", "[fakta ketiga yang boleh disahkan]"];

const PROJECTS = [
  { n: "01", name: "Ihya' Turats", text: "[Satu ayat tentang siri karya klasik Islam ini dan kenapa ia penting.]" },
  { n: "02", name: "Aplikasi komuniti", text: "[Satu ayat tentang kedai, kelas dan pembantu AI untuk pembaca.]" },
  { n: "03", name: "PBAKL", text: "[Satu ayat tentang penyertaan tahunan di Pesta Buku Antarabangsa Kuala Lumpur.]" },
];

const WAYS = [
  { href: "/tulisan", badge: "Fasa 1 · Aktif", active: true, title: "Tulisan", text: "Artikel dan video tentang keputusan, pengajaran dan pandangan industri." },
  { href: "/kelas", badge: "Fasa 2 · Pratonton", active: false, title: "Kelas", text: "Kelas rakaman. Bayar sekali, belajar mengikut rentak sendiri." },
  { href: "/kedai", badge: "Fasa 3 · Pratonton", active: false, title: "Kedai", text: "Produk digital dan fizikal, dihantar terus ke rumah anda." },
];

const h2 = "font-serif text-[27px] font-medium tracking-tight sm:text-4xl";

export default async function HomePage() {
  const { posts } = await listPosts({ limit: 3 });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: siteUrl(),
    jobTitle: "Penerbit",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="flex flex-wrap items-center gap-12 pb-[72px] pt-14">
        <div className="min-w-0 flex-[1_1_460px]">
          <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-accent">
            <span className="mr-3 inline-block h-0.5 w-7 bg-gold align-middle" aria-hidden="true" />
            {SITE_TAGLINE}
          </p>
          <h1 className="mb-6 font-serif text-4xl font-medium leading-[1.12] tracking-[-0.02em] sm:text-6xl sm:leading-[1.06]">
            Aku menulis tentang keputusan yang membentuk sebuah penerbitan.
          </h1>
          <p className="mb-8 max-w-[520px] text-lg text-muted">
            Pengajaran, kesilapan dan pandangan tentang dunia buku, daripada kerusi pemimpin yang bergerak pantas.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="#lead" className="inline-flex min-h-[52px] items-center rounded-full bg-accent px-[26px] font-medium text-on hover:opacity-90">
              Dapatkan Nota Keputusan · percuma
            </a>
            <Link href="/tulisan" className="flex min-h-[44px] items-center font-medium underline underline-offset-4">
              Atau baca tulisan &rarr;
            </Link>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-6">
            {STATS.map((label) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="m-0 font-serif text-[32px] font-medium leading-[1.1]">[XX]</dd>
                <div className="text-[13px] text-muted" aria-hidden="true">{label}</div>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex aspect-[4/5] w-full min-w-[240px] max-w-[340px] flex-[0_1_340px] items-end rounded-[28px] border border-line bg-soft p-5">
          <span className="text-xs text-muted">[Foto potret]</span>
        </div>
      </section>

      {/* Apa yang aku bina */}
      <section className="pb-[72px]">
        <Eyebrow>Apa yang aku bina</Eyebrow>
        <h2 className={`${h2} mb-7 max-w-[640px]`}>Tiga projek yang aku pimpin sekarang.</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
          {PROJECTS.map((p) => (
            <div key={p.n} className="rounded-[20px] border border-line bg-surface p-7">
              <div className="text-[13px] text-muted">{p.n}</div>
              <div className="mt-3 font-serif text-2xl font-medium">{p.name}</div>
              <p className="mt-2 text-[15px] text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tulisan terbaru */}
      <section className="pb-[72px]">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className={h2}>Tulisan terbaru</h2>
          <Link href="/tulisan" className="flex min-h-[44px] items-center font-medium text-accent">
            Semua tulisan &rarr;
          </Link>
        </div>
        {posts.length > 0 ? (
          <PostGrid posts={posts} />
        ) : (
          <p className="text-muted">Tulisan pertama akan terbit tidak lama lagi. Langgan emel untuk dimaklumkan.</p>
        )}
      </section>

      {/* Tiga cara untuk bersama */}
      <section className="pb-[72px]">
        <h2 className={`${h2} mb-7`}>Tiga cara untuk bersama</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
          {WAYS.map((w) => (
            <Link key={w.href} href={w.href} className="block rounded-[20px] border border-line bg-surface p-7 transition hover:bg-soft">
              <Badge active={w.active}>{w.badge}</Badge>
              <span className="mt-4 block font-serif text-[26px] font-medium">{w.title}</span>
              <span className="mt-1.5 block text-muted">{w.text}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Surat */}
      <section className="flex flex-wrap gap-x-16 gap-y-6 pb-[72px]">
        <div className="min-w-[200px] flex-[0_1_240px]">
          <Eyebrow>Surat daripada Shafie</Eyebrow>
        </div>
        <div className="min-w-0 max-w-[680px] flex-[1_1_460px]">
          <p className="mb-4 font-serif text-2xl leading-[1.45] sm:text-[26px]">
            [Tiga atau empat ayat peribadi: kenapa kau menulis, apa yang pembaca akan dapat di sini, dan siapa tulisan ini untuk.]
          </p>
          <p className="font-serif text-[22px] italic">— Shafie</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="flex flex-wrap gap-x-16 gap-y-6 pb-[72px]">
        <div className="min-w-[200px] flex-[0_1_240px]">
          <Eyebrow>Soalan lazim</Eyebrow>
        </div>
        <div className="min-w-0 max-w-[720px] flex-[1_1_460px]">
          <Faq />
        </div>
      </section>

      {/* Magnet percuma */}
      <section id="lead" className="flex scroll-mt-6 flex-wrap items-center gap-x-12 gap-y-6 rounded-[28px] border border-line bg-soft px-8 py-12">
        <div className="min-w-0 flex-[1_1_320px]">
          <Eyebrow>Hadiah percuma</Eyebrow>
          <h2 className="mb-2 font-serif text-[32px] font-medium leading-tight">Nota Keputusan Pemimpin (PDF)</h2>
          <p className="text-muted">
            [Satu ayat tentang apa dalam nota ini.] Dapatkannya di emel anda, bersama tulisan baharu bila ada. Tiada spam.
          </p>
        </div>
        <div className="min-w-0 flex-[1_1_340px]">
          <SubscribeForm id="email-home" source="magnet" cta="Hantar kepada saya" />
        </div>
      </section>
    </>
  );
}
