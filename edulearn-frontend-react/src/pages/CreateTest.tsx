import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import CreateTestMarkup from './markup/CreateTestMarkup';
import css from '../styles/pages/create-test.css?inline';
import script from './scripts/create-test.js';

/**
 * CreateTest, create-test.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function CreateTest() {
  usePageCss(css);
  usePageScript(script);
  return <CreateTestMarkup />;
}
