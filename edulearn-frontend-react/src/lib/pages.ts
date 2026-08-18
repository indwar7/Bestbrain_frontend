/**
 * Page ids are the static site's filenames minus ".html". They stay the
 * canonical identifier because the access matrix in role-guard.js was keyed by
 * them, and AuthContext's ACCESS is a direct port — keeping the ids identical
 * means the policy can be compared line-for-line against the original.
 *
 * This map is the one place that translates a page id to its SPA route.
 */
export const ROUTE_BY_PAGE: Record<string, string> = {
  index: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  learn: '/learn',
  lesson: '/lesson',
  videos: '/videos',
  mocktest: '/mocktest',
  'take-test': '/take-test',
  'create-test': '/create-test',
  challenge: '/challenge',
  pal: '/pal',
  tutor: '/tutor',
  live: '/live',
  upload: '/upload',
  admin: '/admin',
  bank: '/bank',
  homework: '/homework',
  'homework-assign': '/homework-assign',
  privacy: '/privacy',
  terms: '/terms',
};

/** Public pages: never guarded, even when logged out (PUBLIC in role-guard.js). */
export const PUBLIC_PAGES = ['index', 'login', 'signup'];

/**
 * Translate a legacy "<page>.html" URL into its SPA route.
 *
 * Returns null for anything that is not a recognised same-origin page link,
 * so callers can fall through to normal browser behaviour.
 */
export function routeForHtmlHref(rawHref: string, base: string = window.location.href): string | null {
  let url: URL;
  try { url = new URL(rawHref, base); } catch { return null; }
  if (url.origin !== window.location.origin) return null;

  const file = url.pathname.split('/').pop() || '';
  if (!file.endsWith('.html')) return null;

  const page = file.slice(0, -'.html'.length);
  const route = ROUTE_BY_PAGE[page];
  if (!route) return null;

  // lesson.html?ch=c6-sci-food carried its target in the query string; the SPA
  // takes it as a path param instead, but the rest of the query (class, subject,
  // t, view) is preserved — lesson.js needs class & subject to run its
  // video/notes lookup. take-test.html keeps its full query string untouched.
  let to = route;
  if (page === 'lesson') {
    const chapter = url.searchParams.get('ch') || url.searchParams.get('chapter');
    if (chapter) {
      const rest = new URLSearchParams(url.search);
      rest.delete('ch'); rest.delete('chapter');
      const qs = rest.toString();
      return `/lesson/${encodeURIComponent(chapter)}${qs ? `?${qs}` : ''}${url.hash}`;
    }
  }
  if (url.search) to += url.search;
  return to + url.hash;
}

/**
 * Which page a path belongs to. /lesson/:chapterId matches on its first
 * segment.
 */
export function pageFromPath(pathname: string): string {
  if (pathname === '/') return 'index';
  const first = '/' + (pathname.split('/').filter(Boolean)[0] ?? '');
  for (const [page, route] of Object.entries(ROUTE_BY_PAGE)) {
    if (route === pathname || route === first) return page;
  }
  return 'index';
}
