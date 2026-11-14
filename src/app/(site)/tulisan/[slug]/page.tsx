import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleReader } from "@/components/ArticleReader";
import { SubscribeForm } from "@/components/SubscribeForm";
import { VideoPlayer } from "@/components/VideoPlayer";
import { sanitizeArticleHtml, toEmbedUrl } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { SITE_NAME, siteUrl } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Tidak dijumpai" };
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/tulisan/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/tulisan/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
    twitter: { card: post.cover_url ? "summary_large_image" : "summary", title, description },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.id);
  const html = sanitizeArticleHtml(post.content_html);
  const embed = toEmbedUrl(post.video_url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description || post.excerpt || undefined,
    image: post.cover_url || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: SITE_NAME },
    mainEntityOfPage: `${siteUrl()}/tulisan/${post.slug}`,
    inLanguage: "ms",
  };

  return (
    <article className="mx-auto max-w-[720px] py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href="/tulisan" className="flex min-h-[44px] items-center font-medium text-accent">
        &larr; Semua tulisan
      </Link>
      {post.category && (
        <p className="mb-3 mt-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">
          <Link href={`/tulisan?kategori=${post.category.slug}`}>{post.category.name}</Link>
        </p>
      )}
      <h1 className="mb-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">{post.title}</h1>

      <ArticleReader
        html={html}
        lead={post.excerpt}
        meta={
          <>
            {SITE_NAME} · <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time> ·{" "}
            {post.reading_minutes} min baca
          </>
        }
        // Video utama dipaparkan sebelum isi.
        video={embed ? <VideoPlayer embedUrl={embed} title={post.title} /> : null}
      />

      <div className="mt-12 rounded-3xl border border-line bg-soft p-8">
        <h2 className="mb-1.5 font-serif text-[26px] font-medium">Suka tulisan ini?</h2>
        <p className="mb-[18px] text-muted">Dapatkan yang seterusnya terus dalam emel.</p>
        <SubscribeForm id="email-art" source={`artikel:${post.slug}`} />
      </div>

      {related.length > 0 && (
        <>
          <h2 className="mb-5 mt-14 font-serif text-[28px] font-medium">Baca seterusnya</h2>
          <div className="flex flex-col">
            {related.map((r) => (
              <Link key={r.id} href={`/tulisan/${r.slug}`} className="group block border-t border-line py-[18px]">
                <span className="block text-[13px] text-muted">
                  {r.category?.name ?? "Tulisan"} · {r.reading_minutes} min
                </span>
                <span className="block font-serif text-[22px] font-medium transition-colors group-hover:text-accent">{r.title}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
