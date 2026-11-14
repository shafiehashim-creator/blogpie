-- =====================================================================
-- FASA 3: Kedai (products, orders, order_items) + bayaran/kurier
-- Jadual disediakan awal; UI kedai dan integrasi dibina dalam Fasa 3.
-- Semua nilai wang dalam sen (integer) untuk elak ralat titik terapung.
-- =====================================================================

create table public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name            text not null,
  description     text,
  kind            text not null check (kind in ('digital', 'physical')),
  price_cents     int check (price_cents is null or price_cents >= 0),
  currency        text not null default 'MYR',
  stock           int check (stock is null or stock >= 0),     -- null = tidak dijejak (digital)
  weight_grams    int check (weight_grams is null or weight_grams > 0),  -- untuk kadar EasyParcel
  cover_url       text,
  status          text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table public.products enable row level security;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- Fail produk digital dipisahkan supaya laluannya tidak bocor melalui products (yang awam).
-- Pautan muat turun dijana (signed URL) oleh server selepas bayaran.
create table public.product_files (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products (id) on delete cascade,
  storage_path text not null,            -- dalam bucket peribadi 'product-files'
  created_at   timestamptz not null default now()
);
alter table public.product_files enable row level security;

create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references public.profiles (id) on delete set null,  -- null = tetamu
  email             text not null,
  status            text not null default 'pending'
                    check (status in ('pending', 'paid', 'failed', 'cancelled', 'fulfilled', 'refunded')),
  currency          text not null default 'MYR',
  subtotal_cents    int not null default 0 check (subtotal_cents >= 0),
  shipping_cents    int not null default 0 check (shipping_cents >= 0),
  total_cents       int not null default 0 check (total_cents >= 0),
  payment_provider  text,                -- 'stripe' | 'billplz'
  payment_ref       text,                -- ID transaksi di penyedia
  shipping_address  jsonb,
  courier           text,                -- cth. nama kurier dari EasyParcel
  tracking_no       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table public.orders enable row level security;
create index orders_user_idx on public.orders (user_id);
create unique index orders_payment_ref_key on public.orders (payment_provider, payment_ref)
  where payment_ref is not null;     -- webhook idempoten
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders (id) on delete cascade,
  item_type        text not null check (item_type in ('product', 'course')),
  product_id       uuid references public.products (id) on delete set null,
  course_id        uuid references public.courses (id) on delete set null,
  name             text not null,                       -- salinan nama semasa pembelian
  unit_price_cents int not null check (unit_price_cents >= 0),
  quantity         int not null default 1 check (quantity > 0),
  created_at       timestamptz not null default now(),
  check ((item_type = 'product' and product_id is not null and course_id is null)
      or (item_type = 'course'  and course_id  is not null and product_id is null)
      or (product_id is null and course_id is null))   -- baris lama selepas produk dipadam
);
alter table public.order_items enable row level security;
create index order_items_order_idx on public.order_items (order_id);

alter table public.enrollments
  add constraint enrollments_order_fk foreign key (order_id) references public.orders (id) on delete set null;

-- ---- RLS ----
create policy "products: baca yang aktif" on public.products
  for select using (status = 'active');
create policy "products: admin urus" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "product_files: admin sahaja" on public.product_files
  for all using (public.is_admin()) with check (public.is_admin());

-- Pesanan: pembeli baca pesanan sendiri sahaja. Pesanan dicipta dan dikemas kini oleh server
-- (service role) selepas harga disahkan di server, jadi tiada polisi insert/update untuk pengguna.
create policy "orders: baca sendiri atau admin" on public.orders
  for select using (user_id = (select auth.uid()) or public.is_admin());
create policy "orders: admin urus" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

create policy "order_items: baca melalui pesanan sendiri" on public.order_items
  for select using (
    public.is_admin()
    or exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid()))
  );
create policy "order_items: admin urus" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

-- Bucket peribadi untuk fail digital (tiada polisi untuk pengguna biasa; akses melalui signed URL).
insert into storage.buckets (id, name, public)
values ('product-files', 'product-files', false)
on conflict (id) do nothing;

create policy "product-files: admin urus" on storage.objects
  for all to authenticated
  using (bucket_id = 'product-files' and public.is_admin())
  with check (bucket_id = 'product-files' and public.is_admin());
