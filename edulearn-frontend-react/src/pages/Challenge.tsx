import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import ChallengeMarkup from './markup/ChallengeMarkup';
import css from '../styles/pages/challenge.css?inline';
import script from './scripts/challenge.js';

/**
 * Challenge, challenge.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Challenge() {
  usePageCss(css);
  usePageScript(script);
  return <ChallengeMarkup />;
}
