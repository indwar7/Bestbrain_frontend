import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import MockTestMarkup from './markup/MockTestMarkup';
import css from '../styles/pages/mocktest.css?inline';
import script from './scripts/mocktest.js';

/**
 * MockTest, mocktest.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function MockTest() {
  usePageCss(css);
  usePageScript(script);
  return <MockTestMarkup />;
}
