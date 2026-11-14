"use client";

import { useEffect, useState } from "react";

const SIZES = [17, 19, 22]; // px, isi artikel
const LEAD = [21, 24, 28]; // px, perenggan pembuka

/**
 * Bar kemajuan baca (emas) + butang A−/A+ + isi artikel.
 * `html` telah dibersihkan di pelayan (sanitizeArticleHtml).
 */
export function ArticleReader({ html, lead, meta, video }: { html: string; lead?: string | null; meta?: React.ReactNode; video?: React.ReactNode }) {
  const [fs, setFs] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("article-fs"));
      if (saved >= 0 && saved <= 2) setFs(saved);
    } catch {}
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function change(delta: number) {
    const next = Math.min(2, Math.max(0, fs + delta));
    setFs(next);
    try {
      localStorage.setItem("article-fs", String(next));
    } catch {}
  }

  return (
    <>
      <div
        role="progressbar"
        aria-label="Kemajuan bacaan"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="fixed left-0 top-0 z-[45] h-[3px] bg-gold"
        style={{ width: `${progress}%` }}
      />
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="text-sm text-muted">{meta}</div>
      <div className="flex gap-1.5" role="group" aria-label="Saiz teks">
        <button type="button" onClick={() => change(-1)} disabled={fs === 0} aria-label="Kecilkan teks" className="h-11 w-11 rounded-full border border-line text-center text-sm font-semibold disabled:opacity-40">
          A&minus;
        </button>
        <button type="button" onClick={() => change(1)} disabled={fs === 2} aria-label="Besarkan teks" className="h-11 w-11 rounded-full border border-line text-center text-lg font-semibold disabled:opacity-40">
          A+
        </button>
      </div>
      </div>
      {lead && (
        <p className="mb-8 mt-6 font-serif leading-normal" style={{ fontSize: LEAD[fs] }}>
          {lead}
        </p>
      )}
      {video && <div className="mb-8">{video}</div>}
      <div
        className="prose-article"
        style={{ ["--article-size" as string]: `${SIZES[fs]}px` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
