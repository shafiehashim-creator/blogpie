-- =====================================================================
-- FASA 1: Blog (categories, posts, subscribers) + storan gambar
-- =====================================================================

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.categories enable row level security;

create policy "categories: semua boleh baca" on public.categories
  for select using (true);
create policy "categories: admin tulis" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

create table public.posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null,
  excerpt          text,
  content_html     text not null default '',
  content_json     jsonb,                         -- dokumen Tiptap asal, untuk sunting semula
  content_text     text not null default '',      -- teks biasa, untuk carian
  cover_url        text,
  video_url        text,                          -- YouTube / Vimeo (video utama di atas artikel)
  category_id      uuid references public.categories (id) on delete set null,
  status           text not null default 'draft' check (status in ('draft', 'published')),
  published_at     timestamptz,
  reading_minutes  int not null default 1 check (reading_minutes >= 1),
  seo_title        text,
  seo_description  text,
  author_id        uuid references public.profiles (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- Artikel diterbitkan mesti ada tarikh terbit.
  constraint posts_published_has_date check (status <> 'published' or published_at is not null)
);
alter table public.posts enable row level security;

create index posts_listing_idx on public.posts (published_at desc) where status = 'published';
create index posts_category_idx on public.posts (category_id);
create index posts_title_trgm on public.posts using gin (title extensions.gin_trgm_ops);
create index posts_excerpt_trgm on public.posts using gin (excerpt extensions.gin_trgm_ops);
create index posts_text_trgm on public.posts using gin (content_text extensions.gin_trgm_ops);

create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

-- Pengguna biasa (termasuk anon) hanya nampak post yang sudah diterbitkan.
create policy "posts: baca yang diterbitkan" on public.posts
  for select using (status = 'published' and published_at <= now());
create policy "posts: admin baca semua" on public.posts
  for select using (public.is_admin());
create policy "posts: admin tulis" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

create table public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  source        text,                          -- cth. 'home', 'artikel', 'magnet'
  confirmed_at  timestamptz,                   -- diisi bila double opt-in dibina kelak
  created_at    timestamptz not null default now()
);
alter table public.subscribers enable row level security;
create unique index subscribers_email_key on public.subscribers (lower(email));

-- Sesiapa boleh melanggan (INSERT sahaja). Tiada polisi SELECT/UPDATE/DELETE untuk umum,
-- jadi senarai emel tidak boleh dibaca dari pelayar.
create policy "subscribers: sesiapa boleh langgan" on public.subscribers
  for insert to anon, authenticated with check (confirmed_at is null);
create policy "subscribers: admin urus" on public.subscribers
  for all using (public.is_admin()) with check (public.is_admin());

-- Kategori permulaan (daripada prototaip).
insert into public.categories (slug, name, sort_order) values
  ('keputusan', 'Keputusan', 1),
  ('pengajaran', 'Pengajaran', 2),
  ('pandangan-industri', 'Pandangan Industri', 3)
on conflict (slug) do nothing;

-- Storan: gambar artikel. Bucket awam (baca), hanya admin boleh muat naik.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-images', 'post-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "post-images: admin muat naik" on storage.objects
  for insert to authenticated with check (bucket_id = 'post-images' and public.is_admin());
create policy "post-images: admin kemas kini" on storage.objects
  for update to authenticated using (bucket_id = 'post-images' and public.is_admin());
create policy "post-images: admin padam" on storage.objects
  for delete to authenticated using (bucket_id = 'post-images' and public.is_admin());
