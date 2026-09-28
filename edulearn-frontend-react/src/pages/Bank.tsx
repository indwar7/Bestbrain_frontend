import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import BankMarkup from './markup/BankMarkup';
import css from '../styles/pages/bank.css?inline';
import script from './scripts/bank.js';

/**
 * Bank, bank.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Bank() {
  usePageCss(css);
  usePageScript(script);
  return <BankMarkup />;
}
