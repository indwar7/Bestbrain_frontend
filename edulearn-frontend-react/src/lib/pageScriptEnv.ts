import { routeForHtmlHref } from './pages';

/**
 * The environment a lifted page script runs in.
 *
 * Each static page's <script> is extracted verbatim and wrapped in a function
 * that receives these as parameters, so the names shadow the real globals
 * inside that function body. That lets the original code run untouched while
 * four things that only hold for a full page load get corrected:
 *
 *   location   `location.href = 'dashboard.html'` must become a route change,
 *              not a full document navigation that reloads the whole SPA.
 *   document   DOMContentLoaded has long since fired by the time a route
 *              mounts, so a listener for it would never run. Registered
 *              callbacks are invoked once the script finishes instead.
 *   window     listeners are recorded so they can be removed on unmount ,
 *              otherwise every revisit to a route stacks another handler.
 *   cleanup    timers and observers a page sets up, torn down the same way.
 */
export interface PageEnv {
  location: PageLocation;
  document: Document;
  window: Window;
  onCleanup: (fn: () => void) => void;
  /** Run queued DOMContentLoaded callbacks; called after the script body. */
  flushReady: () => void;
  /** Remove every listener and run every cleanup the script registered. */
  dispose: () => void;
}

interface PageLocation {
  href: string;
  readonly pathname: string;
  readonly search: string;
  readonly hash: string;
  readonly origin: string;
  readonly host: string;
  readonly hostname: string;
  readonly protocol: string;
  assign(url: string): void;
  replace(url: string): void;
  reload(): void;
  toString(): string;
}

type Navigate = (to: string, opts?: { replace?: boolean }) => void;

/**
 * @param searchOverride query string a param route must present to its script.
 *   lesson.html read its chapter from `?ch=`, and take-test.html its attempt
 *   from `?attempt=`; the SPA carries both as path params, so window.location
 *   .search is empty and the script would fall back to a generic title.
 */
export function createPageEnv(navigate: Navigate, searchOverride?: string): PageEnv {
  const cleanups: Array<() => void> = [];
  const ready: Array<() => void> = [];

  function go(url: string, replace: boolean) {
    const route = routeForHtmlHref(url);
    if (route) { navigate(route, { replace }); return; }
    // Not a known page link, let the browser do what it would have done.
    if (replace) window.location.replace(url);
    else window.location.href = url;
  }

  const location: PageLocation = {
    get href() {
      const u = new URL(window.location.href);
      if (searchOverride !== undefined) u.search = searchOverride;
      return u.toString();
    },
    set href(v: string) { go(v, false); },
    get pathname() { return window.location.pathname; },
    get search() { return searchOverride !== undefined ? searchOverride : window.location.search; },
    get hash() { return window.location.hash; },
    get origin() { return window.location.origin; },
    get host() { return window.location.host; },
    get hostname() { return window.location.hostname; },
    get protocol() { return window.location.protocol; },
    assign: (url: string) => go(url, false),
    replace: (url: string) => go(url, true),
    reload: () => window.location.reload(),
    toString() { return this.href; },
  };

  /**
   * Forward everything to the real target, but intercept listener
   * registration. Methods are bound because an unbound document.getElementById
   * called through a Proxy would lose its receiver and throw.
   */
  function wrap<T extends EventTarget>(target: T): T {
    return new Proxy(target, {
      get(t, prop, receiver) {
        // Scripts reach for `window.location` and `document.location` as often
        // as the bare global, and those must resolve to the shim too ,
        // otherwise a param route's synthesized query string is invisible and
        // a ".html" assignment escapes the router.
        if (prop === 'location') return location;
        if (prop === 'addEventListener') {
          return (type: string, fn: EventListenerOrEventListenerObject, opts?: unknown) => {
            if (type === 'DOMContentLoaded' || type === 'load') {
              // Both already fired; run after the script body instead.
              ready.push(() => (typeof fn === 'function' ? fn(new Event(type)) : fn.handleEvent(new Event(type))));
              return;
            }
            (t as EventTarget).addEventListener(type, fn, opts as AddEventListenerOptions);
            cleanups.push(() => (t as EventTarget).removeEventListener(type, fn, opts as EventListenerOptions));
          };
        }
        const value = Reflect.get(t, prop, receiver === undefined ? t : t);
        return typeof value === 'function' ? value.bind(t) : value;
      },
      set(t, prop, value) {
        Reflect.set(t, prop, value, t);
        return true;
      },
    }) as T;
  }

  return {
    location,
    document: wrap(document),
    window: wrap(window),
    onCleanup: (fn) => cleanups.push(fn),
    flushReady: () => { while (ready.length) ready.shift()!(); },
    dispose: () => { while (cleanups.length) { try { cleanups.pop()!(); } catch { /* keep tearing down */ } } },
  };
}
