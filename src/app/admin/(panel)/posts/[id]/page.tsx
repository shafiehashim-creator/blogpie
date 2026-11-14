import { notFound } from "next/navigation";
import { deletePost } from "../../../actions";
import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/admin";
import type { AdminPost, Category } from "@/lib/types";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ disimpan?: string }>;
}) {
  const { id } = await params;
  const { disimpan } = await searchParams;
  const { supabase } = await requireAdmin();

  const [{ data: post }, { data: cats }] = await Promise.all([
    supabase.from("posts").select("*, category:categories(slug,name)").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);
  if (!post) notFound();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-4xl font-medium">Sunting artikel</h1>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <button type="submit" className="min-h-[44px] rounded-full border border-line px-5 text-sm text-red-700 hover:bg-soft dark:text-red-400">Padam</button>
        </form>
      </div>
      {disimpan && (
        <p role="status" className="mb-5 rounded-xl bg-soft px-4 py-3 text-sm font-medium text-accent">
          {disimpan === "published" ? "Disimpan dan diterbitkan." : "Draf disimpan."}
        </p>
      )}
      <PostForm post={post as unknown as AdminPost} categories={(cats ?? []) as Category[]} />
    </>
  );
}
