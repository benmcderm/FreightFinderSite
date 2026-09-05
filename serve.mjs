// Zero-dependency static server for the built site (dist).
// Exists because the site is a multi-page build: /load-board-app/ must serve
// load-board-app/index.html (directory index resolution) and unknown paths must 404 —
// no SPA fallback. Used as the deployment run command in .replit; deps are
// pruned after the deploy build, so this must not import anything from
// node_modules.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.PORT || 5000);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webmanifest': 'application/manifest+json',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp',
};

const cacheControlFor = (file) => {
  if (file.endsWith('.html')) return 'no-cache';
  // Images change rarely and are the LCP payload — cache hard.
  if (/\.(png|webp|svg|jpg|jpeg|ico)$/.test(file)) return 'public, max-age=2592000, immutable';
  return 'public, max-age=3600';
};

createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405).end();
      return;
    }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const fsPath = normalize(join(root, pathname));
    if (!fsPath.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    let file = fsPath;
    let s = await stat(file).catch(() => null);
    if (s?.isDirectory()) {
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { location: pathname + '/' }).end();
        return;
      }
      file = join(file, 'index.html');
      s = await stat(file).catch(() => null);
    }
    if (!s?.isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] || 'application/octet-stream',
      'content-length': body.length,
      'cache-control': cacheControlFor(file),
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(500).end();
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`serving ${root} on :${port}`);
});
