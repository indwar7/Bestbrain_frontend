import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import VideosMarkup from './markup/VideosMarkup';
import css from '../styles/pages/videos.css?inline';
import script from './scripts/videos.js';

/**
 * Videos, videos.html's real stylesheet, markup and script.
 *
 * All three are lifted from the original page rather than reimplemented,
 * so the behaviour is the code that was already working, running against
 * markup that reproduces the same element ids it queries.
 */
export default function Videos() {
  usePageCss(css);
  usePageScript(script);
  return <VideosMarkup />;
}
