-- =====================================================================
-- Teras: profiles, peranan admin, pembantu. Dikongsi oleh semua fasa.
-- Semua jadual dalam skema public mesti ada RLS dihidupkan.
-- =====================================================================

create extension if not exists pg_trgm with schema extensions;

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Cipta profil automatik bila pengguna baharu didaftar.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Adakah pengguna semasa admin? security definer supaya tidak rekursif dalam RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Pengguna baca dan kemas kini profil sendiri sahaja; admin baca semua.
create policy "profiles: baca sendiri atau admin" on public.profiles
  for select using (id = (select auth.uid()) or public.is_admin());
create policy "profiles: kemas kini sendiri" on public.profiles
  for update using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Penting: pengguna TIDAK boleh menaikkan peranan sendiri. Hanya full_name boleh diubah.
revoke update on public.profiles from anon, authenticated;
grant update (full_name) on public.profiles to authenticated;
-- Insert/delete tiada polisi: hanya trigger di atas (dan service role) yang boleh.
