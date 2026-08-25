-- ============================================================
-- IMAGINESANSAH — STORAGE BUCKETS & POLICIES
-- Run after schema.sql and policies.sql
-- ============================================================

-- Public, published-content buckets: readable by anyone, written only by admins.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('portfolio', 'portfolio', true, 15728640, array['image/jpeg','image/png','image/webp','image/avif']),
  ('hero', 'hero', true, 15728640, array['image/jpeg','image/png','image/webp','image/avif']),
  ('profile', 'profile', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('site-assets', 'site-assets', true, 5242880, array['image/jpeg','image/png','image/webp','image/svg+xml'])
on conflict (id) do nothing;

-- Client reference files: PRIVATE. Visitors can upload, but only admins can read/list.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('client-files', 'client-files', false, 20971520,
   array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do nothing;

-- ---------------- Public buckets: read = anyone, write = admins only ----------------
do $$
declare b text;
begin
  foreach b in array array['portfolio','hero','profile','site-assets']
  loop
    execute format(
      $p$create policy "%1$s_public_read" on storage.objects
        for select using (bucket_id = '%1$s');$p$, b);
    execute format(
      $p$create policy "%1$s_admin_insert" on storage.objects
        for insert with check (bucket_id = '%1$s' and is_admin());$p$, b);
    execute format(
      $p$create policy "%1$s_admin_update" on storage.objects
        for update using (bucket_id = '%1$s' and is_admin());$p$, b);
    execute format(
      $p$create policy "%1$s_admin_delete" on storage.objects
        for delete using (bucket_id = '%1$s' and is_admin());$p$, b);
  end loop;
end $$;

-- ---------------- client-files: anyone can upload, only admins can read ----------------
create policy "client_files_public_insert" on storage.objects
  for insert with check (bucket_id = 'client-files');

create policy "client_files_admin_read" on storage.objects
  for select using (bucket_id = 'client-files' and is_admin());

create policy "client_files_admin_delete" on storage.objects
  for delete using (bucket_id = 'client-files' and is_admin());

-- Note: file-size and mime-type limits above are the first line of defense.
-- Application code must still validate uploads before calling storage.upload(),
-- since client-side limits are enforced by Supabase but a defense-in-depth
-- check keeps error messages friendlier and avoids failed uploads reaching Storage at all.
