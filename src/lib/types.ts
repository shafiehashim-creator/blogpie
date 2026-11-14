export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type PostCardData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  video_url: string | null;
  published_at: string | null;
  reading_minutes: number;
  category: { slug: string; name: string } | null;
};

export type Post = PostCardData & {
  content_html: string;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
};

export type AdminPost = Post & {
  content_json: unknown;
  status: "draft" | "published";
  category_id: string | null;
};
