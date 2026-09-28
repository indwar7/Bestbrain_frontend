import { useLayoutEffect } from 'react';

declare global {
  interface Window {
    /** Set by public/ui/kid-home.js once it has loaded. */
    KidHome?: { mount(): void; unmount(): void };
    /** True while the home route is the one on screen. See below. */
    __kidHomeWanted?: boolean;
  }
}

/**
 * Keep the standalone home screen (public/ui/kid-home.js) mounted for exactly
 * as long as this component is.
 *
 * The home route has two renderers. React has LandingMarkup, the page as it
 * was before the redesign, and kid-home.js builds the current one into
 * #kh-root, then hides React's #root behind it. Something has to say which of
 * the two is showing, and it has to say it in the same breath as the route
 * change: kid-home used to watch the URL and swap 60ms later, which left the
 * losing renderer on screen in between (its start() carries the details).
 *
 * useLayoutEffect, not useEffect, so that both this mount and the unmount of
 * whatever page is being left happen inside the commit that changes the route,
 * before the browser paints.
 *
 * The flag exists for the first load. kid-home.js is a deferred script, so on
 * a cold load of "/" this effect has already run by the time it executes;
 * reading the flag is how it finds out it was wanted.
 */
export function useKidHome(): void {
  useLayoutEffect(() => {
    window.__kidHomeWanted = true;
    window.KidHome?.mount();
    return () => {
      window.__kidHomeWanted = false;
      window.KidHome?.unmount();
    };
  }, []);
}
