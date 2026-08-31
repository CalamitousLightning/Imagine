-- ============================================================
-- IMAGINESANSAH — ROW LEVEL SECURITY
-- Run after schema.sql
-- Model: public (anon) can READ published content only.
--        Only rows present in `admins` may write anything, or read drafts/requests.
-- ============================================================

alter table admins enable row level security;
alter table categories enable row level security;
alter table media enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table services enable row level security;
alter table hero_slides enable row level security;
alter table site_content enable row level security;
alter table site_settings enable row level security;
alter table client_requests enable row level security;
alter table client_request_files enable row level security;
alter table activity_log enable row level security;

-- Helper: is the current user an authorized admin?
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ---------------- ADMINS ----------------
create policy "admins_self_read" on admins for select using (user_id = auth.uid());
create policy "admins_admin_manage" on admins for all using (is_admin()) with check (is_admin());

-- ---------------- CATEGORIES (public read, admin write) ----------------
create policy "categories_public_read" on categories for select using (true);
create policy "categories_admin_write" on categories for insert with check (is_admin());
create policy "categories_admin_update" on categories for update using (is_admin());
create policy "categories_admin_delete" on categories for delete using (is_admin());

-- ---------------- MEDIA (admin-only reads/writes; narrow exception below) ----------------
create policy "media_admin_all" on media for all using (is_admin()) with check (is_admin());

-- Anonymous visitors submitting the "Start a Project" form need to attach
-- reference files, which are tracked as `media` rows so client_request_files
-- can point at them consistently with the rest of the schema. This grants
-- INSERT only, scoped to the private 'client-files' bucket — no SELECT, so
-- a visitor can create a row but can never read it (or anyone else's) back.
-- The app works around the lack of SELECT by generating the row's UUID
-- client-side before inserting, so it never needs to read the row back.
create policy "media_public_insert_client_files" on media
  for insert with check (bucket = 'client-files');

-- Public-facing pages join against `media` for every image (project covers,
-- hero slides, service icons, profile/site-asset images) as an ANONYMOUS
-- visitor. Without this, those joins silently return null under RLS for
-- anyone who isn't an admin — the storage object itself is public, but the
-- row describing which object to load never gets read, so no <img> tag is
-- ever built. client-files is deliberately excluded — it stays admin-only.
create policy "media_public_read_public_buckets" on media
  for select using (bucket in ('portfolio', 'hero', 'profile', 'site-assets'));

-- ---------------- PROJECTS (public reads published only; admin reads/writes everything) ----------------
create policy "projects_public_read_published" on projects
  for select using (is_published = true or is_admin());
create policy "projects_admin_write" on projects for insert with check (is_admin());
create policy "projects_admin_update" on projects for update using (is_admin());
create policy "projects_admin_delete" on projects for delete using (is_admin());

create policy "project_images_public_read" on project_images
  for select using (
    exists (select 1 from projects p where p.id = project_id and (p.is_published or is_admin()))
  );
create policy "project_images_admin_write" on project_images for insert with check (is_admin());
create policy "project_images_admin_update" on project_images for update using (is_admin());
create policy "project_images_admin_delete" on project_images for delete using (is_admin());

-- ---------------- SERVICES ----------------
create policy "services_public_read_published" on services
  for select using (is_published = true or is_admin());
create policy "services_admin_write" on services for insert with check (is_admin());
create policy "services_admin_update" on services for update using (is_admin());
create policy "services_admin_delete" on services for delete using (is_admin());

-- ---------------- HERO SLIDES ----------------
create policy "hero_slides_public_read_enabled" on hero_slides
  for select using (is_enabled = true or is_admin());
create policy "hero_slides_admin_write" on hero_slides for insert with check (is_admin());
create policy "hero_slides_admin_update" on hero_slides for update using (is_admin());
create policy "hero_slides_admin_delete" on hero_slides for delete using (is_admin());

-- ---------------- SITE CONTENT / SETTINGS (public read, admin write) ----------------
create policy "site_content_public_read" on site_content for select using (true);
create policy "site_content_admin_write" on site_content for insert with check (is_admin());
create policy "site_content_admin_update" on site_content for update using (is_admin());

create policy "site_settings_public_read" on site_settings for select using (true);
create policy "site_settings_admin_update" on site_settings for update using (is_admin());

-- ---------------- CLIENT REQUESTS ----------------
-- Anonymous visitors may INSERT (submit the form) but never read or list requests.
create policy "client_requests_public_insert" on client_requests
  for insert with check (true);
create policy "client_requests_admin_read" on client_requests
  for select using (is_admin());
create policy "client_requests_admin_update" on client_requests
  for update using (is_admin());

create policy "client_request_files_public_insert" on client_request_files
  for insert with check (true);
create policy "client_request_files_admin_read" on client_request_files
  for select using (is_admin());

-- ---------------- ACTIVITY LOG (admin-only) ----------------
create policy "activity_log_admin_read" on activity_log for select using (is_admin());
create policy "activity_log_admin_insert" on activity_log for insert with check (is_admin());
