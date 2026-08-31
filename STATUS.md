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

- Drag-and-drop reordering (currently up/down buttons for gallery images and categories)
- Rich text for descriptions (currently plain text)
- Email notifications on new client requests (currently admin must check the dashboard)
- Final line-by-line QA against the brief's 43-item acceptance test

## Fixed this session

- **Netlify "Powered by Netlify" badge**: this is a real, brand-new Netlify
  feature (rolled out Aug 19, 2026) — new *public* projects on the *Free*
  plan get it by default. Turn it off per-project at **Project configuration
  → General → Powered by Netlify badge** in the Netlify dashboard. No code
  change needed; takes effect on the next request, no redeploy required.
- **Broken Select/Dialog styling** (the category dropdown, service editor,
  hero slide editor): Radix portals these to `document.body` by default,
  which sits outside the `.theme-public`/`.theme-admin` wrapper divs that
  define this app's CSS variables — and there was no bare `:root` fallback,
  so portaled content had literally undefined colors. Fixed via
  `lib/theme-scope.tsx`, which portals into the correct themed ancestor
  instead. This affected the public site too (the "Project Type" dropdown
  on Start a Project), not just admin.
- **Dead mobile nav button**: the public header's hamburger button did
  nothing. Now opens a real slide-in menu (`components/public/mobile-nav.tsx`).
- **Category management**: previously only possible via raw SQL. Added
  full CRUD (add/rename/reorder/delete) via a dialog on `/control/portfolio`.
- **Modern visual pass** on public pages per request: colored glow-shadows
  on primary CTAs, card lift-on-hover with real box-shadow, contained radial
  gradient accents on the homepage intro and closing CTA, active-state glow
  on category filter pills. Kept deliberately restrained — full glassmorphism
  or heavy gradients would conflict with the brief's "editorial, not generic
  SaaS" direction, so this reads as a sharper, more contemporary version of
  the existing design rather than a different one.
