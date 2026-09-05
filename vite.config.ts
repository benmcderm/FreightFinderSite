import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { SITE, SITEMAP_PATHS } from './site.config';

// Substitutes {{TOKEN}} placeholders in every HTML page from site.config.ts,
// and emits robots.txt + sitemap.xml from the same config, so brand/domain
// strings live in exactly one file.
const siteTokens = (): Plugin => ({
  name: 'site-tokens',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) =>
      html.replace(/\{\{([A-Z_]+)\}\}/g, (match, key: string) => {
        const value = (SITE as Record<string, string>)[key];
        if (value === undefined) throw new Error(`Unknown site token ${match}`);
        return value;
      }),
  },
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'robots.txt',
      source: `User-agent: *\nAllow: /\n\nSitemap: ${SITE.ORIGIN}/sitemap.xml\n`,
    });
    const urls = SITEMAP_PATHS.map(
      (p) => `  <url>\n    <loc>${SITE.ORIGIN}${p}</loc>\n    <lastmod>${SITE.LASTMOD}</lastmod>\n  </url>`,
    ).join('\n');
    this.emitFile({
      type: 'asset',
      fileName: 'sitemap.xml',
      source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    });
  },
});

const port = Number(process.env.PORT);
if (!port) throw new Error('PORT environment variable is required (e.g. PORT=5000).');
const basePath = process.env.BASE_PATH;
if (!basePath) throw new Error('BASE_PATH environment variable is required (e.g. BASE_PATH=/).');

const root = path.resolve(import.meta.dirname);
const page = (dir: string) => path.resolve(root, dir, 'index.html');

export default defineConfig({
  base: basePath,
  // Multi-page site: no SPA fallback, so /load-board-app/ resolves to its own index.html.
  appType: 'mpa',
  plugins: [siteTokens()],
  root,
  build: {
    outDir: path.resolve(root, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: page('.'),
        loadboardapp: page('load-board-app'),
        findloads: page('how-to-find-loads'),
        nearme: page('truck-loads-near-me'),
        freeboards: page('free-load-boards'),
        ratepermile: page('trucking-rate-per-mile'),
        support: page('support'),
        privacy: page('privacy'),
        terms: page('terms'),
      },
    },
  },
  server: { port, strictPort: true, host: '0.0.0.0', allowedHosts: true },
  preview: { port, host: '0.0.0.0', allowedHosts: true },
});
