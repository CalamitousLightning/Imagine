# ImagineSansah — Portfolio + Creative Control Center

Next.js 14 / TypeScript / Tailwind / Supabase / Framer Motion, per the build brief.

## Status

See `STATUS.md` for exactly what's built vs. still scaffolded. Short version:
architecture, schema, security, and the public homepage + hero showcase are real
and build-tested. The rest of the public pages and the entire `/control` admin
are stubbed and need to be built out next.

## Setup

1. **Create a Supabase project**, then in the SQL editor run, in order:
   - `supabase/schema.sql`
   - `supabase/policies.sql`
   - `supabase/storage.sql`

2. **Create your first admin.** Sign up a user via Supabase Auth (email/password
   is fine to start), then in the SQL editor:
   ```sql
   insert into admins (user_id, full_name)
   values ('<the auth.users.id you just created>', 'ImagineSansah');
   ```
   Being a row in `admins` is what grants access to `/control` — not just having
   an account.

3. **Env vars.** Copy `.env.example` to `.env.local` and fill in your project's
   URL, anon key, and service role key (service role key is server-only —
   never reference it from a Client Component or expose it via `NEXT_PUBLIC_*`).

4. **Generate real types** once the schema is live:
   ```bash
   npx supabase gen types typescript --project-id <id> --schema public > types/supabase.ts
   ```

5. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```

6. **Seed initial content.** `site_settings` gets one row automatically. You'll
   want to fill in `whatsapp_number`, `email`, and at least one row in
   `hero_slides` before the homepage looks like anything — there's intentionally
   no hardcoded demo portfolio data per the brief's "no fake functionality" rule.

7. **Everything is admin-manageable from here.** Log into `/control` and use
   Portfolio, Hero Showcase, Content Control, Services, and Settings to
   populate the site — no further code changes needed for day-to-day updates.

## Deployment (Netlify)

Standard Next.js on Netlify — connect the repo, set the same env vars in
Netlify's dashboard, build command `next build`, and Netlify's Next.js runtime
handles the rest. Matches your existing evoshub.xyz / africagames.netlify.app
deployment pattern.

## Security notes

- `/control/*` is protected in `middleware.ts` — auth *and* membership in the
  `admins` table are both checked server-side on every request. Route
  obscurity is not the security boundary.
- RLS is enabled on every table. Public (anon) role can only read published/
  enabled rows; only rows in `admins` can write anything or read drafts,
  client requests, or the media library.
- `client-files` storage bucket is private: visitors can upload (submitting
  the project-request form) but cannot list or read back other people's
  uploads. Only admins can read it.
- `SUPABASE_SERVICE_ROLE_KEY` is only referenced in `lib/supabase/server.ts`'s
  `createAdminClient()`, which throws if it's ever somehow evaluated in the
  browser, as a second line of defense on top of it never being
  `NEXT_PUBLIC_*`-prefixed.
