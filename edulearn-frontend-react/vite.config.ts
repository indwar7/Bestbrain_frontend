import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * No Tailwind plugin on purpose. This app renders the platform's real
 * stylesheets (theme.css -> the page's own CSS -> vivid.css; see index.html).
 * Tailwind's preflight and @theme palette redefined the same tokens and fought
 * the theme, and any CSS Vite injects from a JS import lands AFTER vivid.css
 * in <head>, silently outranking it.
 */

// The static site talks straight to the deployed API. Proxying keeps the SPA
// same-origin in dev, so it never has to satisfy the production CORS allowlist
// (which deliberately does not include arbitrary localhost ports).
const API_TARGET = process.env.VITE_API_TARGET || 'https://api.bestbrainplus.com';

/*
  The shared scripts and stylesheets in public/ (ui/*.js, vivid.css, ...) keep
  fixed names, and the server caches static files for a year. Without a
  version on the URL a returning visitor keeps last month's copy, so a fix to
  one of them (say, removing the PAL mascot) never reaches them. Stamp every
  local, unhashed <script src>/<link href> in index.html with this build's id.
*/
const BUILD_ID = Date.now().toString(36);
function versionPublicAssets() {
  return {
    name: 'version-public-assets',
    apply: 'build' as const,
    transformIndexHtml(html: string) {
      return html.replace(
        /(<(?:script|link)\b[^>]*?\s(?:src|href)=")(\/(?!assets\/)[^"?#]+\.(?:js|css))(")/g,
        (_m, pre, url, post) => `${pre}${url}?v=${BUILD_ID}${post}`
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), versionPublicAssets()],
  server: {
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
      // Production serves the API under /backend-api via a Vercel rewrite, and
      // some page scripts fall back to that path directly. Proxied here too so
      // that fallback reaches the backend instead of the SPA's index.html.
      '/backend-api': {
        target: API_TARGET,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/backend-api/, ''),
      },
      '/uploads': { target: API_TARGET, changeOrigin: true },
      '/socket.io': { target: API_TARGET, ws: true, changeOrigin: true },
    },
  },
});
