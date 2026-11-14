import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { PostCardData } from "@/lib/types";
import { PlayIcon } from "./ui";

export function PostCard({ post, showExcerpt = false }: { post: PostCardData; showExcerpt?: boolean }) {
  return (
    <Link href={`/tulisan/${post.slug}`} className="group block">
      <span className="relative flex h-[180px] items-end justify-between overflow-hidden rounded-[20px] border border-line bg-soft p-4 transition-transform duration-200 group-hover:-translate-y-0.5">
        {post.cover_url && (
          <Image src={post.cover_url} alt="" fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover" />
        )}
        <span className="relative z-10 rounded-full bg-surface/80 px-2 py-0.5 text-xs font-medium text-muted">
          {post.category?.name ?? "Tulisan"}
        </span>
        {post.video_url && (
          <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-on" aria-label="Ada video">
            <PlayIcon />
          </span>
        )}
      </span>
      <span className="mt-4 block text-[13px] text-muted">
        {formatDate(post.published_at)} · {post.reading_minutes} min
      </span>
      <span className="mt-1 block font-serif text-2xl font-medium leading-tight transition-colors group-hover:text-accent">
        {post.title}
      </span>
      {showExcerpt && post.excerpt && <span className="mt-2 block text-[15px] text-muted">{post.excerpt}</span>}
    </Link>
  );
}

export function PostGrid({ posts, showExcerpt = false }: { posts: PostCardData[]; showExcerpt?: boolean }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-7 gap-y-9">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} showExcerpt={showExcerpt} />
      ))}
    </div>
  );
}
