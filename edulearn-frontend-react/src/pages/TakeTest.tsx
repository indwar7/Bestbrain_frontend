import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import TakeTestMarkup from './markup/TakeTestMarkup';
import css from '../styles/pages/take-test.css?inline';
import script from './scripts/take-test.js';

/**
 * TakeTest, take-test.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function TakeTest() {
  usePageCss(css);
  usePageScript(script);
  return <TakeTestMarkup />;
}
