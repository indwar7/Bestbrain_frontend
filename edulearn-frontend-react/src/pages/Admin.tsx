import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import AdminMarkup from './markup/AdminMarkup';
import css from '../styles/pages/admin.css?inline';
import script from './scripts/admin.js';

/**
 * Admin, admin.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Admin() {
  usePageCss(css);
  usePageScript(script);
  return <AdminMarkup />;
}
