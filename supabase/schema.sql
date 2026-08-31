-- ============================================================
-- IMAGINESANSAH — SCHEMA
-- Run in Supabase SQL editor, in order: schema.sql, then policies.sql, then storage.sql
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- ADMINS  (authorization allowlist — auth.users alone is not enough)
-- ------------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- MEDIA  (centralized library — Supabase Storage objects, tracked in DB)
-- ------------------------------------------------------------
create table if not exists media (
  id uuid primary key default uuid_generate_v4(),
  bucket text not null,               -- 'portfolio' | 'hero' | 'profile' | 'client-files' | 'site-assets'
  path text not null,                 -- storage object path
  file_name text not null,
  file_type text,
  file_size_bytes bigint,
  alt_text text,
  width integer,
  height integer,
  uploaded_by uuid references admins(user_id),
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

-- ------------------------------------------------------------
-- PROJECTS
-- ------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  category_id uuid references categories(id) on delete set null,
  description text,
  client text,
  tools_used text[] default '{}',
  project_date date,
  cover_media_id uuid references media(id) on delete set null,
  thumbnail_media_id uuid references media(id) on delete set null,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_images (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  media_id uuid not null references media(id) on delete cascade,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SERVICES
-- ------------------------------------------------------------
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  icon_media_id uuid references media(id) on delete set null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- HERO SLIDES
-- ------------------------------------------------------------
create table if not exists hero_slides (
  id uuid primary key default uuid_generate_v4(),
  composition text not null default 'portrait_with_artwork',
  -- one of: portrait_with_artwork | editorial | portrait_beside_design |
  --         full_impact_showcase | portrait_typography_branding
  headline text,
  subtext text,
  primary_media_id uuid references media(id) on delete set null,   -- portrait
  secondary_media_id uuid references media(id) on delete set null, -- artwork / decorative
  featured_project_id uuid references projects(id) on delete set null,
  duration_ms integer not null default 5000,
  is_enabled boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SITE CONTENT  (editable copy blocks — keyed, not one giant JSON blob)
-- ------------------------------------------------------------
create table if not exists site_content (
  key text primary key,   -- e.g. 'hero.headline', 'about.biography', 'footer.tagline'
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SITE SETTINGS  (structured, single-row config)
-- ------------------------------------------------------------
create table if not exists site_settings (
  id boolean primary key default true constraint single_row check (id),
  site_name text not null default 'ImagineSansah',
  logo_media_id uuid references media(id) on delete set null,
  profile_media_id uuid references media(id) on delete set null,
  email text,
  whatsapp_number text,           -- E.164, e.g. 233XXXXXXXXX
  whatsapp_default_greeting text default 'Hi ImagineSansah! 👋',
  whatsapp_project_message_template text default
    'Hi ImagineSansah, I''d like to start a project. Name: {name}. Project type: {project_type}. Budget: {budget}.',
  location text,
  social_links jsonb not null default '{}'::jsonb,  -- { "instagram": "...", "behance": "...", ... }
  seo_title text,
  seo_description text,
  og_image_media_id uuid references media(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values (true) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- CLIENT REQUESTS
-- ------------------------------------------------------------
create type request_status as enum ('new', 'reviewing', 'in_progress', 'completed', 'cancelled');

create table if not exists client_requests (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  whatsapp_number text not null,
  email text,
  project_type text not null,
  service_id uuid references services(id) on delete set null,
  description text not null,
  preferred_deadline date,
  budget_range text,
  reference_notes text,
  status request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists client_request_files (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references client_requests(id) on delete cascade,
  media_id uuid not null references media(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ACTIVITY LOG  (drives "recent activity" on the admin dashboard — real, not faked)
-- ------------------------------------------------------------
create table if not exists activity_log (
  id uuid primary key default uuid_generate_v4(),
  actor uuid references admins(user_id),
  action text not null,   -- 'project.created' | 'project.updated' | 'request.received' | 'service.updated' | ...
  entity_type text not null,
  entity_id uuid,
  summary text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------
create index if not exists idx_projects_published on projects (is_published, display_order);
create index if not exists idx_projects_category on projects (category_id);
create index if not exists idx_projects_featured on projects (is_featured) where is_featured = true;
create index if not exists idx_project_images_project on project_images (project_id, display_order);
create index if not exists idx_services_published on services (is_published, display_order);
create index if not exists idx_hero_slides_enabled on hero_slides (is_enabled, display_order);
create index if not exists idx_client_requests_status on client_requests (status, created_at desc);
create index if not exists idx_media_bucket on media (bucket);
create index if not exists idx_activity_log_created on activity_log (created_at desc);

-- ------------------------------------------------------------
-- updated_at TRIGGERS
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  foreach t in array array['projects','services','hero_slides','client_requests','site_settings']
  loop
    execute format(
      'drop trigger if exists trg_set_updated_at on %I;
       create trigger trg_set_updated_at before update on %I
       for each row execute function set_updated_at();', t, t
    );
  end loop;
end $$;

-- Seed categories (editable later from admin; not production portfolio data)
insert into categories (name, slug, display_order) values
  ('Branding', 'branding', 1),
  ('Logo Design', 'logo-design', 2),
  ('Flyers', 'flyers', 3),
  ('Posters', 'posters', 4),
  ('Social Media', 'social-media', 5),
  ('Business Design', 'business-design', 6),
  ('Other Creative Works', 'other', 7)
on conflict (slug) do nothing;
