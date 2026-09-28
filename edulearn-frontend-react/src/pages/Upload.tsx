import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import UploadMarkup from './markup/UploadMarkup';
import css from '../styles/pages/upload.css?inline';
import script from './scripts/upload.js';

/**
 * Upload, upload.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Upload() {
  usePageCss(css);
  usePageScript(script);
  return <UploadMarkup />;
}
