import { deleteCategory, saveCategory } from "../../actions";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";

const input = "min-h-[44px] rounded-xl border border-line bg-surface px-3.5";

export default async function KategoriPage({ searchParams }: { searchParams: Promise<{ ralat?: string }> }) {
  const { ralat } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  const cats = (data ?? []) as Category[];

  return (
    <>
      <h1 className="mb-6 font-serif text-4xl font-medium">Kategori</h1>
      {ralat && <p role="alert" className="mb-4 text-sm text-red-700 dark:text-red-400">{ralat}</p>}
      <ul className="mb-8 space-y-3">
        {cats.map((c) => (
          <li key={c.id} className="flex flex-wrap items-end gap-2 rounded-2xl border border-line bg-surface p-4">
            <form action={saveCategory} className="flex flex-1 flex-wrap items-end gap-2">
              <input type="hidden" name="id" value={c.id} />
              <label className="text-sm">Nama<input name="name" defaultValue={c.name} required className={`${input} mt-1 block`} /></label>
              <label className="text-sm">Slug<input name="slug" defaultValue={c.slug} required className={`${input} mt-1 block`} /></label>
              <label className="text-sm">Urutan<input name="sort_order" type="number" defaultValue={c.sort_order} className={`${input} mt-1 block w-24`} /></label>
              <button type="submit" className="min-h-[44px] rounded-full border border-line px-5 text-sm font-medium hover:bg-soft">Simpan</button>
            </form>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <button type="submit" className="min-h-[44px] px-3 text-sm text-red-700 underline dark:text-red-400">Padam</button>
            </form>
          </li>
        ))}
      </ul>
      <h2 className="mb-3 font-serif text-2xl font-medium">Tambah kategori</h2>
      <form action={saveCategory} className="flex flex-wrap items-end gap-2">
        <label className="text-sm">Nama<input name="name" required className={`${input} mt-1 block`} /></label>
        <label className="text-sm">Urutan<input name="sort_order" type="number" defaultValue={cats.length + 1} className={`${input} mt-1 block w-24`} /></label>
        <button type="submit" className="min-h-[44px] rounded-full bg-accent px-6 text-sm font-medium text-on">Tambah</button>
      </form>
      <p className="mt-3 text-sm text-muted">Memadam kategori tidak memadam artikelnya; artikel itu menjadi “tiada kategori”.</p>
    </>
  );
}
