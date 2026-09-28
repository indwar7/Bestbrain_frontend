import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import LiveMarkup from './markup/LiveMarkup';
import css from '../styles/pages/live.css?inline';
import script from './scripts/live.js';

/**
 * Live, live.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Live() {
  usePageCss(css);
  usePageScript(script);
  return <LiveMarkup />;
}
