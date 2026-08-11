import { useLayoutEffect } from 'react';
import { PAGE_FONTS } from './pageFonts';

/**
 * Match each route to the shared assets its static page actually loaded.
 *
 * The 15 pages were not uniform about this, and the differences are visible:
 *
 *   vivid.css        all 15   (loaded globally in index.html)
 *   theme.css         9/15    forces html/body colour with !important
 *   features-panel.js 10/15   fixed right-hand panel; its off-screen shadow
 *                             darkens the right edge even while closed
 *   theme.js         13/15    only forces light mode, and login/signup do the
 *                             same thing inline, so it stays global
 *
 * Loading all of them everywhere is what made /login render 6.8% different
 * from login.html — it gained a feature panel the original never had.
 */

/**
 * Pages whose <head> actually linked ../theme.css.
 *
 * videos.html only mentions it in a CSS comment, and is deliberately absent:
 * theme.css sets an opaque html background, which stops body's background from
 * propagating to the canvas. Enabling it there left the page white below the
 * content instead of filling the viewport.
 */
const THEME_CSS = new Set([
  'index', 'dashboard', 'learn', 'lesson', 'mocktest', 'challenge', 'pal', 'tutor', 'live',
]);

/** Pages that loaded ../features-panel.js. */
const FEATURES_PANEL = new Set([
  'index', 'dashboard', 'learn', 'lesson', 'mocktest', 'create-test',
  'challenge', 'pal', 'tutor', 'live', 'signup',
]);

/** Pages that loaded account-menu.js (the settings FAB, overlay and panel). */
const ACCOUNT_MENU = new Set([
  'dashboard', 'learn', 'lesson', 'mocktest', 'take-test', 'create-test',
  'challenge', 'pal', 'tutor', 'live',
]);

/**
 * features-panel.js appends itself to <body> once and cannot be unloaded, so
 * on the pages that never had it the elements are hidden instead. display:none
 * also removes the panel's shadow, which is the part that actually shows.
 */
const HIDE_PANEL_CSS = '#efp-btn, #efp-ov, #efp { display: none !important; }';
const HIDE_ACCOUNT_CSS = '.acct-fab, .acct-overlay, .acct-panel { display: none !important; }';

export function usePageChrome(page: string): void {
  useLayoutEffect(() => {
    const fontLink = document.getElementById('page-fonts') as HTMLLinkElement | null;
    const fonts = PAGE_FONTS[page];
    if (fontLink && fonts && fontLink.getAttribute('href') !== fonts) {
      fontLink.setAttribute('href', fonts);
    }

    const themeLink = document.getElementById('theme-css') as HTMLLinkElement | null;
    if (themeLink) themeLink.disabled = !THEME_CSS.has(page);

    const slot = document.getElementById('chrome-css');
    if (!slot) return;
    slot.textContent = [
      FEATURES_PANEL.has(page) ? '' : HIDE_PANEL_CSS,
      ACCOUNT_MENU.has(page) ? '' : HIDE_ACCOUNT_CSS,
    ].filter(Boolean).join('\n');
  }, [page]);
}
