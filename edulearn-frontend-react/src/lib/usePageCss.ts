import { useLayoutEffect } from 'react';

/**
 * Swap a page's lifted stylesheet into the <style id="page-css"> slot that
 * sits between theme.css and vivid.css in index.html.
 *
 * The static site loaded exactly one page stylesheet at a time, and those
 * sheets reuse generic names (.card, .wrap, .grid) for different things while
 * each declaring its own :root and body rules. Swapping, rather than loading
 * them all at once, is what keeps routes from bleeding into each other, and
 * keeps vivid.css winning by source order the way it was written to.
 *
 * useLayoutEffect (not useEffect) so the swap lands before the browser paints;
 * otherwise every route change would flash the previous page's styling.
 */
export function usePageCss(css: string): void {
  useLayoutEffect(() => {
    const slot = document.getElementById('page-css');
    if (!slot) return;
    slot.textContent = css;
    return () => {
      // Clear on unmount so an unstyled frame is never rendered with the
      // outgoing page's rules still applied.
      if (slot.textContent === css) slot.textContent = '';
    };
  }, [css]);
}
