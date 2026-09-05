// Single source of truth for every brand/domain/store string on the site.
// Tokens appear in the *.html pages as {{KEY}} and are substituted by the
// `site-tokens` plugin in vite.config.ts (which also generates robots.txt and
// sitemap.xml from ORIGIN/LASTMOD). The plugin only matches [A-Z_]+ keys.
export const SITE = {
  BRAND: 'Freight Finder',
  DOMAIN: 'freightfinderapp.com',
  ORIGIN: 'https://freightfinderapp.com',
  APP_ID: '849725731', // Apple App Store numeric id (Smart App Banner)
  IOS_URL: 'https://apps.apple.com/app/id849725731',
  PLAY_URL: 'https://play.google.com/store/apps/details?id=com.freightfinderapp',
  CONTACT_EMAIL: 'info@1771.co',
  COMPANY: '1771 Co',
  PRICE_MONTH: '$9.99',
  PRICE_YEAR: '$79.99',
  LASTMOD: '2026-09-05', // bump when page content changes (sitemap <lastmod>)
  // Google Search Console HTML-tag token for benmcderm@gmail.com (the token is
  // per Google account, not per site — same value carbles.app uses).
  GSC_VERIFICATION: 'EyaN4qlOMBFwTgKrwpPrx6VJ4vt2A3POfEt4VMkQ2V4',
  // GA4 web stream for this site (property "Freight Finder website", account McD).
  GA_MEASUREMENT_ID: 'G-J6H7SM2ZEG',
} as const;

export const SITEMAP_PATHS = [
  '/',
  '/load-board-app/',
  '/how-to-find-loads/',
  '/truck-loads-near-me/',
  '/free-load-boards/',
  '/trucking-rate-per-mile/',
  '/support/',
  '/privacy/',
  '/terms/',
] as const;
