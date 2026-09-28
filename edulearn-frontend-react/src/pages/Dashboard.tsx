import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import DashboardMarkup from './markup/DashboardMarkup';
import css from '../styles/pages/dashboard.css?inline';
import script from './scripts/dashboard.js';

/**
 * Dashboard, dashboard.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Dashboard() {
  usePageCss(css);
  usePageScript(script);
  return <DashboardMarkup />;
}
