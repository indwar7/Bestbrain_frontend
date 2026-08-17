import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import HomeworkMarkup from './markup/HomeworkMarkup';
import css from '../styles/pages/homework.css?inline';
import script from './scripts/homework.js';

/**
 * Homework — homework.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Homework() {
  usePageCss(css);
  usePageScript(script);
  return <HomeworkMarkup />;
}
