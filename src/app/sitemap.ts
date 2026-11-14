import type { MetadataRoute } from "next";
import { getAllPublishedSlugs } from "@/lib/posts";
import { PREVIEW_COURSES } from "@/lib/preview-data";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const posts = await getAllPublishedSlugs();
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tulisan`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/tentang`, priority: 0.5 },
    { url: `${base}/kelas`, priority: 0.3 },
    { url: `${base}/kedai`, priority: 0.3 },
    ...PREVIEW_COURSES.map((c) => ({ url: `${base}/kelas/${c.slug}`, priority: 0.2 })),
    ...posts.map((p) => ({ url: `${base}/tulisan/${p.slug}`, lastModified: p.updated_at, priority: 0.8 })),
  ];
}
