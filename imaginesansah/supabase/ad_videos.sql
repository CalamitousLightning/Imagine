-- ============================================================
-- IMAGINESANSAH — AD POPUP VIDEOS
--
-- Run this once in the Supabase SQL editor (after schema.sql, policies.sql,
-- storage.sql have already been applied to this project).
--
-- Adds everything needed for the "Ad Popup" admin page: a table to hold
-- video entries, a public 'ads' storage bucket for the video files/posters,
-- and RLS policies so only admins can write while the public site can read
-- enabled videos. Once this is run, adding/removing/reordering videos from
-- /control/ad-videos takes effect on the live site immediately — no
-- redeploy needed, since the popup reads from Supabase at request time.
--
-- Safe to re-run: every statement below is idempotent.
-- ============================================================

-- ------------------------------------------------------------
-- TABLE
-- ------------------------------------------------------------
create table if not exists ad_videos (
  id uuid primary key default uuid_generate_v4(),
  title text,
  cta_label text,
  cta_href text,
  media_id uuid references media(id) on delete cascade,
  poster_media_id uuid references media(id) on delete set null,
  is_enabled boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ad_videos_enabled on ad_videos (is_enabled, display_order);

drop trigger if exists trg_ad_videos_set_updated_at on ad_videos;
create trigger trg_ad_videos_set_updated_at before update on ad_videos
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table ad_videos enable row level security;

drop policy if exists "ad_videos_public_read_enabled" on ad_videos;
create policy "ad_videos_public_read_enabled" on ad_videos
  for select using (is_enabled = true or is_admin());

drop policy if exists "ad_videos_admin_write" on ad_videos;
create policy "ad_videos_admin_write" on ad_videos for insert with check (is_admin());

drop policy if exists "ad_videos_admin_update" on ad_videos;
create policy "ad_videos_admin_update" on ad_videos for update using (is_admin());

drop policy if exists "ad_videos_admin_delete" on ad_videos;
create policy "ad_videos_admin_delete" on ad_videos for delete using (is_admin());

-- Public pages need to read the `media` rows an ad video points at (the
-- video file itself + its poster image) as an anonymous visitor — same
-- reasoning as the other public buckets in policies.sql. This replaces the
-- original policy from policies.sql with one that also includes 'ads'.
drop policy if exists "media_public_read_public_buckets" on media;
create policy "media_public_read_public_buckets" on media
  for select using (bucket in ('portfolio', 'hero', 'profile', 'site-assets', 'ads'));

-- ------------------------------------------------------------
-- STORAGE BUCKET  (public read, admin write — videos can run larger, so a
-- higher size limit than the image buckets)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ads', 'ads', true, 104857600, array['video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "ads_public_read" on storage.objects;
create policy "ads_public_read" on storage.objects
  for select using (bucket_id = 'ads');

drop policy if exists "ads_admin_insert" on storage.objects;
create policy "ads_admin_insert" on storage.objects
  for insert with check (bucket_id = 'ads' and is_admin());

drop policy if exists "ads_admin_update" on storage.objects;
create policy "ads_admin_update" on storage.objects
  for update using (bucket_id = 'ads' and is_admin());

drop policy if exists "ads_admin_delete" on storage.objects;
create policy "ads_admin_delete" on storage.objects
  for delete using (bucket_id = 'ads' and is_admin());
