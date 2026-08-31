Drop these two files directly in this `/public` folder before deploying:

- `imaginesansah.jpeg` — favicon (referenced in app/layout.tsx metadata.icons)
- `imagine.jpeg` — header logo (referenced in components/public/site-logo.tsx)

Both are optional at build time. If `imagine.jpeg` is missing (or fails to
load in the browser), the header falls back to the "ImagineSansah" text
wordmark automatically — no code changes needed either way.
