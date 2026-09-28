import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import SignupMarkup from './markup/SignupMarkup';
import css from '../styles/pages/signup.css?inline';
import script from './scripts/signup.js';

/**
 * Signup, signup.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Signup() {
  usePageCss(css);
  usePageScript(script);
  return <SignupMarkup />;
}
