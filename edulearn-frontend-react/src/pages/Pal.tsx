import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import PalMarkup from './markup/PalMarkup';
import css from '../styles/pages/pal.css?inline';
import script from './scripts/pal.js';

/**
 * Pal, pal.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Pal() {
  usePageCss(css);
  usePageScript(script);
  return <PalMarkup />;
}
