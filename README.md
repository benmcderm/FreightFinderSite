# freightfinderapp.com

Marketing/SEO site for the Freight Finder load board app (iOS + Android).
Static multi-page site: plain HTML pages, a Vite MPA build, and a
dependency-free Node server for Replit Autoscale.

- `index.html` + `*/index.html` — the pages (landing, 5 guides, support, privacy, terms). Plain HTML, no JS beyond gtag.
- `site.config.ts` — SINGLE SOURCE for every brand/domain/store/price string. Pages use `{{TOKEN}}` placeholders (`[A-Z_]+` only). Bump `LASTMOD` when content changes.
- `vite.config.ts` — `siteTokens()` plugin substitutes tokens and generates `robots.txt` + `sitemap.xml`. Add new pages to `rollupOptions.input` AND `SITEMAP_PATHS`.
- `public/` — `site.css`, `img/` (screenshots 520px webp, store badges, og-image 1200x630, icon).
- `serve.mjs` — serves `dist/` with directory-index resolution and real 404s (no SPA fallback).

Build: `PORT=5000 BASE_PATH=/ npm run build` (both env vars are required). Preview: `PORT=5000 node serve.mjs`.
Deploy: push to GitHub → pull in the Replit workspace → Publish (see `.replit`).

Screenshots were taken from the iOS simulator (iPhone 16 Pro) with Premium forced on; regenerate with
`magick shot.png -resize 520x -quality 82 public/img/NN-name.webp`.
