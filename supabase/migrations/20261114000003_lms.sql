-- =====================================================================
-- FASA 2: LMS (courses, lessons, enrollments, lesson_progress)
-- Jadual disediakan awal; UI kelas dibina dalam Fasa 2.
-- =====================================================================

create table public.courses (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        text not null,
  description  text,
  price_cents  int check (price_cents is null or price_cents >= 0),  -- sen; null = belum ditetapkan
  currency     text not null default 'MYR',
  cover_url    text,
  status       text not null default 'draft' check (status in ('draft', 'published')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.courses enable row level security;
create trigger courses_updated_at before update on public.courses
  for each row execute function public.set_updated_at();

create table public.lessons (
  id                 uuid primary key default gen_random_uuid(),
  course_id          uuid not null references public.courses (id) on delete cascade,
  position           int not null,
  title              text not null,
  summary            text,
  duration_seconds   int check (duration_seconds is null or duration_seconds >= 0),
  video_provider     text check (video_provider in ('mux', 'cloudflare')),
  video_ref          text,                       -- playback ID di Mux / UID di Cloudflare Stream
  is_preview         boolean not null default false,  -- boleh ditonton tanpa daftar
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (course_id, position)
);
alter table public.lessons enable row level security;
create index lessons_course_idx on public.lessons (course_id, position);
create trigger lessons_updated_at before update on public.lessons
  for each row execute function public.set_updated_at();

create table public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  course_id   uuid not null references public.courses (id) on delete cascade,
  status      text not null default 'active' check (status in ('active', 'revoked')),
  order_id    uuid,                              -- FK ke orders ditambah dalam migrasi kedai
  created_at  timestamptz not null default now(),
  unique (user_id, course_id)
);
alter table public.enrollments enable row level security;
create index enrollments_user_idx on public.enrollments (user_id);

-- Kemajuan pelajaran (prototaip: "Tanda selesai").
create table public.lesson_progress (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  lesson_id     uuid not null references public.lessons (id) on delete cascade,
  completed_at  timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
alter table public.lesson_progress enable row level security;

-- Adakah pengguna semasa berdaftar (aktif) dalam kelas ini?
create or replace function public.has_course_access(p_course uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.enrollments
    where user_id = auth.uid() and course_id = p_course and status = 'active'
  );
$$;

-- ---- RLS ----
create policy "courses: baca yang diterbitkan" on public.courses
  for select using (status = 'published');
create policy "courses: admin urus" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

-- Jadual lessons mengandungi video_ref, jadi hanya pelajaran pratonton atau pelajar berdaftar boleh baca.
create policy "lessons: pratonton atau berdaftar" on public.lessons
  for select using (
    exists (select 1 from public.courses c where c.id = course_id and c.status = 'published')
    and (is_preview or public.has_course_access(course_id))
  );
create policy "lessons: admin urus" on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

-- Pelajar hanya nampak pendaftaran sendiri. Tiada polisi tulis: pendaftaran dibuat oleh
-- webhook bayaran (service role), supaya tiada siapa boleh mendaftar diri secara percuma.
create policy "enrollments: baca sendiri atau admin" on public.enrollments
  for select using (user_id = (select auth.uid()) or public.is_admin());
create policy "enrollments: admin urus" on public.enrollments
  for all using (public.is_admin()) with check (public.is_admin());

create policy "lesson_progress: urus sendiri" on public.lesson_progress
  for all using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.lessons l
      where l.id = lesson_id and (l.is_preview or public.has_course_access(l.course_id))
    )
  );

-- Pelan kelas (tajuk, urutan, tempoh) untuk paparan "terkunci" tanpa mendedahkan video_ref.
-- Sengaja dijalankan sebagai pemilik view (bukan security_invoker) dan hanya untuk kelas diterbitkan.
create view public.lesson_outline as
  select l.id, l.course_id, l.position, l.title, l.duration_seconds, l.is_preview
  from public.lessons l
  join public.courses c on c.id = l.course_id
  where c.status = 'published';
grant select on public.lesson_outline to anon, authenticated;
