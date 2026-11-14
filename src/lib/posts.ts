import { createPublicClient } from "@/lib/supabase/public";
import { PAGE_SIZE } from "@/lib/site";
import type { Category, Post, PostCardData } from "@/lib/types";

const CARD_COLS =
  "id,slug,title,excerpt,cover_url,video_url,published_at,reading_minutes,category:categories(slug,name)";

/** Buang aksara yang mengganggu sintaks penapis PostgREST dan wildcard LIKE. */
function cleanQuery(q: string): string {
  return q.replace(/[,()"\\%_*]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

export async function getCategories(): Promise<Category[]> {
  const db = createPublicClient();
  if (!db) return [];
  const { data } = await db.from("categories").select("*").order("sort_order").order("name");
  return (data ?? []) as Category[];
}

export async function listPosts(opts: {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ posts: PostCardData[]; total: number }> {
  const db = createPublicClient();
  if (!db) return { posts: [], total: 0 };
  const limit = opts.limit ?? PAGE_SIZE;
  const page = Math.max(1, opts.page ?? 1);

  let query = db
    .from("posts")
    .select(CARD_COLS, { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (opts.category) {
    const { data: cat } = await db.from("categories").select("id").eq("slug", opts.category).maybeSingle();
    if (!cat) return { posts: [], total: 0 };
    query = query.eq("category_id", cat.id);
  }
  const q = opts.q ? cleanQuery(opts.q) : "";
  if (q) {
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content_text.ilike.%${q}%`);
  }

  const { data, count } = await query;
  return { posts: (data ?? []) as unknown as PostCardData[], total: count ?? 0 };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const db = createPublicClient();
  if (!db) return null;
  const { data } = await db
    .from("posts")
    .select(`${CARD_COLS},content_html,seo_title,seo_description,updated_at`)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  return (data as unknown as Post) ?? null;
}

export async function getRelatedPosts(excludeId: string, limit = 3): Promise<PostCardData[]> {
  const db = createPublicClient();
  if (!db) return [];
  const { data } = await db
    .from("posts")
    .select(CARD_COLS)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as PostCardData[];
}

export async function getAllPublishedSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const db = createPublicClient();
  if (!db) return [];
  const { data } = await db
    .from("posts")
    .select("slug,updated_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());
  return (data ?? []) as { slug: string; updated_at: string }[];
}
