# Build Status — against the original 8-phase brief

Build-tested with `next build` — full route tree compiles clean.

## Done and real

**Public site** — every page live-queries Supabase, no hardcoded content:
- `/` — hero showcase (5 compositions), intro, featured work, services teaser
- `/portfolio` — grid, category filtering, empty states
- `/portfolio/[slug]` — case study: gallery lightbox, related projects, CTAs
- `/services` — published services from admin
- `/about` — biography/philosophy/skills from Content Control + profile photo
- `/contact` — WhatsApp/email/location/socials from Settings
- `/start-a-project` — validated form, reference file upload, WhatsApp handoff

**Admin (`/control`)** — every section from the brief's nav is real:
- Login with real auth + two-layer authorization check
- Overview — live stats + activity feed
- Portfolio — visual grid, full project editor (cover/thumbnail/gallery
  upload, category, tools, client, date, featured/published)
- Hero Showcase — slide CRUD with composition picker
- Content Control — every editable copy block from `lib/content-keys.ts`
- Services — CRUD with icon upload
- Client Requests — status workflow, signed URLs for private reference files
- Media Library — search, bucket filter, "in use" protection before delete
- Settings — site name, WhatsApp number/templates, social links, SEO, OG image

**Infrastructure**
- `supabase/schema.sql` / `policies.sql` / `storage.sql` — full RLS,
  including a narrow anon-insert-only policy so visitors can attach
  reference files without gaining read access to the media table
- Every admin mutation is a Server Action that independently re-verifies
  the caller is an authorized admin (`getCurrentAdmin()`), on top of the
  middleware boundary — matches the brief's "do not rely on route obscurity"
- `robots.ts` / `sitemap.ts` / `netlify.toml`

## Before you deploy

1. Run `schema.sql` → `policies.sql` → `storage.sql` in order in Supabase
2. Create your admin user, add them to the `admins` table (see README)
3. Fill in `site_settings` (at minimum: WhatsApp number, email)
4. Add your first hero slide, category content, and a project or two —
   the site is intentionally empty until you do, per "no fake functionality"
5. Set env vars, `npm install`, `npm run build` locally once to confirm,
   then deploy to Netlify

## Not started / worth a follow-up pass

- Drag-and-drop reordering (currently up/down buttons for gallery images)
- Rich text for descriptions (currently plain text)
- Email notifications on new client requests (currently admin must check the dashboard)
- Final line-by-line QA against the brief's 43-item acceptance test
