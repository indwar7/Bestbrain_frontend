/**
 * Lift every static page's <style> block into a standalone CSS file.
 *
 * The CSS is copied VERBATIM — no rewriting, no scoping. Pixel parity comes
 * from reusing the real stylesheet, not from re-deriving it.
 *
 * These files are imported with Vite's `?inline` and swapped into the
 * <style id="page-css"> slot in index.html, which sits between theme.css and
 * vivid.css. That reproduces the static site's cascade exactly:
 *
 *     theme.css  ->  the page's own <style>  ->  vivid.css (wins, last)
 *
 * Scoping the selectors instead would raise their specificity (`.card` becomes
 * `.pg-x .card`) and let page rules beat vivid.css overrides that are supposed
 * to win by source order. Swapping keeps the cascade identical to the browser's.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const STATIC = join(HERE, '../../edulearn-frontend');
const OUT = join(HERE, '../src/styles/pages');

const PAGES = [
  'index', 'dashboard', 'learn', 'lesson', 'videos', 'mocktest', 'take-test',
  'create-test', 'challenge', 'pal', 'tutor', 'live', 'login', 'signup', 'upload', 'admin',
  'bank', 'homework', 'homework-assign',
];

mkdirSync(OUT, { recursive: true });

const summary = [];
for (const page of PAGES) {
  const html = readFileSync(join(STATIC, `${page}.html`), 'utf8');

  // Concatenate every <style> block in source order, exactly as the browser
  // applies them.
  const blocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
  if (!blocks.length) { summary.push([page, 0, 'no <style> block']); continue; }

  const css =
    `/* Lifted verbatim from edulearn-frontend/${page}.html.\n` +
    `   Do not hand-edit: regenerate with \`node scripts/extract-page-css.mjs\`. */\n` +
    blocks.join('\n');

  writeFileSync(join(OUT, `${page}.css`), css);
  summary.push([page, blocks.length, `${css.split('\n').length} lines`]);
}

console.log('page              blocks  output');
for (const [p, n, note] of summary) {
  console.log(`${p.padEnd(16)} ${String(n).padStart(6)}  ${note}`);
}
