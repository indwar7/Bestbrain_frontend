import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import HomeworkAssignMarkup from './markup/HomeworkAssignMarkup';
import css from '../styles/pages/homework-assign.css?inline';
import script from './scripts/homework-assign.js';

/**
 * HomeworkAssign, homework-assign.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function HomeworkAssign() {
  usePageCss(css);
  usePageScript(script);
  return <HomeworkAssignMarkup />;
}
