import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Start a new route at the top of the page.
 *
 * A full page load always begins at scroll 0; a client-side navigation does
 * not — the scroll position simply carries over, clamped to the new document's
 * height. Since the landing page is ~11,000px tall and its footer is at the
 * very bottom, every link down there opened its destination two-thirds of the
 * way down: Privacy Policy landed at 1376 of 2189, Terms at 1457, and even
 * /signup at 395. The reader arrived mid-document and had to scroll up to find
 * the heading.
 *
 * Three cases are deliberately left alone:
 *
 *   POP  — Back and Forward. The browser restores the scroll position it
 *          recorded for that history entry, which is what a reader expects
 *          when they go back; overriding it would be the opposite bug.
 *   hash — /page#section names its own target, so the fragment owns the
 *          scroll and this must not fight it.
 *   same pathname — a query-string-only change (take-test.html?id=…, or
 *          learn.html?class=7) is the same screen re-filtering itself, not a
 *          new one. Yanking the reader to the top there loses their place.
 *
 * useLayoutEffect, so the jump happens before the browser paints rather than
 * as a visible scroll after it. App calls this, not the individual pages:
 * React runs a child's layout effects before its parent's, so by the time this
 * runs the destination has mounted and the document is already its full new
 * height — scrolling to 0 against a stale height would land in the wrong
 * place on a short page.
 */
export function useScrollReset(): void {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === 'POP') return;
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);
}
