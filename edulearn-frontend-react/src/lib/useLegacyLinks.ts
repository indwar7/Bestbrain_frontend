import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { guardRedirect } from './guard';
import { ROUTE_BY_PAGE } from './pages';

/**
 * Route legacy "<page>.html" links through the SPA router.
 *
 * The ported markup is a faithful copy of the static pages, so it is still
 * full of href="learn.html", and features-panel.js builds its links the same
 * way at runtime. Rewriting every one of them would mean diverging from the
 * original markup in thousands of places (and re-diverging on every
 * regeneration), so instead a single delegated listener translates them on
 * click. Anything it does not recognise is left alone and behaves as a normal
 * link.
 */
/**
 * A link to the screen you are already on starts that screen again: "Quizzes"
 * pressed in the middle of a quiz goes back to the quiz list. The router alone
 * does nothing for it (same route, same component), which read as the menu
 * being stuck. App listens for this and remounts the page.
 */
export const RESTART_EVENT = 'edulearn:restart-page';
function restartPage(): void {
  window.dispatchEvent(new Event(RESTART_EVENT));
}

export function useLegacyLinks(): void {
  const navigate = useNavigate();
  const { loggedIn, role } = useAuth();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Let the browser handle modified clicks (new tab, download, etc.).
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as Element | null)?.closest?.('a');
      if (!anchor) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref || anchor.hasAttribute('download') || anchor.getAttribute('target') === '_blank') return;

      // Resolve against the current location so relative hrefs work, then bail
      // on anything pointing off-site.
      let url: URL;
      try { url = new URL(rawHref, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;

      // An in-page anchor ("#rosterAnchor", or "dashboard.html#x" while on the
      // dashboard): scroll to it. Routing it did nothing but change the URL.
      const samePage = url.pathname === window.location.pathname
        || (ROUTE_BY_PAGE[(url.pathname.split('/').pop() || '').replace(/\.html$/, '')] === window.location.pathname);
      if (samePage && url.hash) {
        const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }

      const file = url.pathname.split('/').pop() || '';
      if (!file.endsWith('.html')) {
        /*
          Already an app route ("/learn", "/lesson/x"). The sidebar rail is
          cloned from the navbar, so its <Link>s lose React's own handler and
          would otherwise fall through to a full page load on every click.
        */
        const seg = url.pathname.split('/')[1] || '';
        const appPage = seg === '' ? 'index' : seg;
        if (ROUTE_BY_PAGE[appPage] === undefined) return;
        e.preventDefault();
        const target = guardRedirect(appPage, loggedIn, role) || url.pathname + url.search + url.hash;
        const samePath = target.split(/[?#]/)[0] === window.location.pathname;
        if (target !== window.location.pathname + window.location.search + window.location.hash) navigate(target);
        if (samePath && !url.hash) restartPage();
        return;
      }

      const page = file.slice(0, -'.html'.length);
      const route = ROUTE_BY_PAGE[page];
      if (!route) return;

      /*
        Resolve the route guard here, on the click, rather than letting the
        router walk into a gated page and bounce back out of it.

        The bounce was visible. App derives the page chrome from the URL, so
        the intermediate render committed the target page's fonts, its
        theme.css state and its floating panels; and because <ProtectedRoute>
        renders a redirect instead of a page, nothing mounted to refill the
        #page-css slot that the outgoing page's cleanup had just emptied. The
        browser painted that frame, a flash of unstyled page, before the
        redirect landed.

        Sending the click straight at its real destination means the outgoing
        page unmounts and the destination mounts in the same commit, so there
        is no in-between state to paint.
      */
      const redirect = guardRedirect(page, loggedIn, role);
      if (redirect) {
        e.preventDefault();
        navigate(redirect);
        return;
      }

      // lesson.html?ch=c6-sci-food carried its target in the query string; the
      // SPA takes it as a path param instead. The REST of the query string
      // (class, subject, t, view) must be preserved, lesson.js gates its
      // video/notes lookup on class & subject, so dropping them left every
      // chapter stuck on "Coming soon".
      let to = route;
      if (page === 'lesson') {
        const chapter = url.searchParams.get('ch') || url.searchParams.get('chapter');
        if (chapter) {
          const rest = new URLSearchParams(url.search);
          rest.delete('ch'); rest.delete('chapter');
          const qs = rest.toString();
          to = `/lesson/${encodeURIComponent(chapter)}` + (qs ? `?${qs}` : '');
        }
      } else if (url.search) {
        to = route + url.search;
      }
      if (url.hash) to += url.hash;

      e.preventDefault();
      const sameRoute = to.split(/[?#]/)[0] === window.location.pathname;
      navigate(to);
      if (sameRoute && !url.hash) restartPage();
    }

    // api.ts's requireAuth() has no router access, so it asks for navigation
    // by dispatching this instead of assigning to window.location.
    function onNavigate(e: Event) {
      const detail = (e as CustomEvent<{ to: string; replace?: boolean }>).detail;
      if (detail?.to) navigate(detail.to, { replace: !!detail.replace });
    }

    document.addEventListener('click', onClick);
    window.addEventListener('edulearn:navigate', onNavigate);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('edulearn:navigate', onNavigate);
    };
  }, [navigate, loggedIn, role]);
}
