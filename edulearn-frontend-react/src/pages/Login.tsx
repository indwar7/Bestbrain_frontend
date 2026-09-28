import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import LoginMarkup from './markup/LoginMarkup';
import css from '../styles/pages/login.css?inline';
import script from './scripts/login.js';

/**
 * Login, login.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Login() {
  usePageCss(css);
  usePageScript(script);
  return <LoginMarkup />;
}
