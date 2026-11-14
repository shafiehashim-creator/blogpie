# Shafie Hashim — laman personal branding

Next.js 15 (App Router, TypeScript) · Tailwind · Supabase (Auth, Postgres, Storage) · Vercel.
Rujukan UI: `docs/prototype.html`.

## Status fasa
- **Fasa 1 (blog) — siap dibina:** artikel dalam Supabase, editor admin Tiptap (login), kategori, carian, benam video YouTube/Vimeo, langganan emel, SEO (metadata, OG, JSON-LD, sitemap, robots), mod gelap, bar tab mobile, A−/A+ dan bar kemajuan baca.
- **Fasa 2 (Kelas) / Fasa 3 (Kedai):** hanya halaman pratonton dengan data placeholder `RM XX`. **Skema pangkalan data sudah lengkap** (courses, lessons, enrollments, lesson_progress, products, product_files, orders, order_items). Integrasi bayaran, Mux/Cloudflare dan EasyParcel belum dibina.

## Persediaan
1. Cipta projek Supabase (ada kos mengikut pelan anda, jadi dibuat oleh anda sendiri).
2. Jalankan fail dalam `supabase/migrations/` mengikut urutan (SQL Editor atau `supabase db push`).
3. Auth → matikan **Allow new users to sign up** (hanya admin perlu log masuk).
4. Cipta pengguna admin di Auth → Users, kemudian:
   `update public.profiles set role = 'admin' where id = '<uuid pengguna>';`
5. Salin `.env.example` ke `.env.local` dan isi URL + anon key Supabase, serta `NEXT_PUBLIC_SITE_URL`.
6. `npm install && npm run dev` → `/admin/login`.
7. Vercel: import repo, tetapkan tiga pemboleh ubah env yang sama.

## Keselamatan
- RLS dihidupkan pada semua jadual. Pengguna biasa/anon hanya baca post `published` (dan `published_at <= now()`).
- `subscribers`: sesiapa boleh INSERT sahaja; senarai hanya boleh dibaca admin.
- Pengguna tidak boleh menaikkan `profiles.role` (hanya `full_name` boleh dikemas kini).
- Pendaftaran kelas dan pesanan hanya boleh ditulis oleh server (service role/webhook) pada Fasa 2/3.
- HTML artikel dibersihkan (sanitize-html) semasa simpan dan semasa papar; iframe hanya YouTube-nocookie/Vimeo.

## Belum dibuat / perlu keputusan
- Penghantaran PDF "Nota Keputusan" dan emel blast: perlu penyedia emel (cth. Resend/Mailchimp). Buat masa ini emel hanya disimpan.
- Had kadar (rate limit) borang langganan: guna Vercel Firewall / Turnstile bila trafik bermula.
- Semua teks `[XX]` ialah placeholder, bukan fakta.
