import { useLayoutEffect } from 'react';

declare global {
  interface Window {
    /** Set by public/ui/kid-bg.js once it has loaded. */
    KidBg?: { restyle(): void };
  }
}

/**
 * Re-run the skin's colour pass whenever the route changes.
 *
 * kid-bg.js derives the dark surfaces and ink by measuring what the cascade
 * actually produced and pinning the result inline. The cascade underneath it
 * is still the pre-redesign look, so anything it has not measured yet paints
 * in the old palette, vivid.css gives .brand-panel a flat white background,
 * for one, which is what the signup page's left half showed for a third of a
 * second after every navigation.
 *
 * It used to watch history.pushState for that cue. The URL changes before the
 * page does (the router navigates inside a transition), so every pass landed
 * on the page being left. Called from here it runs against the DOM the commit
 * just produced.
 *
 * useLayoutEffect, so the pass finishes before the browser paints. This must
 * stay in App rather than in the individual pages: React runs a child's layout
 * effects before its parent's, so by the time this runs the route's own
 * usePageCss has already swapped the stylesheet being measured.
 */
export function useKidSkin(pathname: string): void {
  useLayoutEffect(() => {
    window.KidBg?.restyle();
  }, [pathname]);
}
