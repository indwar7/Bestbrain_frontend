import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import TutorMarkup from './markup/TutorMarkup';
import css from '../styles/pages/tutor.css?inline';
import script from './scripts/tutor.js';

/**
 * Tutor, tutor.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Tutor() {
  usePageCss(css);
  usePageScript(script);
  return <TutorMarkup />;
}
