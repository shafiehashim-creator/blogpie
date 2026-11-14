import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";

export default async function NewPostPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return (
    <>
      <h1 className="mb-6 font-serif text-4xl font-medium">Artikel baharu</h1>
      <PostForm categories={(data ?? []) as Category[]} />
    </>
  );
}
