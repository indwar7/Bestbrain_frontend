import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import LearnMarkup from './markup/LearnMarkup';
import css from '../styles/pages/learn.css?inline';
import script from './scripts/learn.js';

/**
 * Learn, learn.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Learn() {
  usePageCss(css);
  usePageScript(script);
  return <LearnMarkup />;
}
