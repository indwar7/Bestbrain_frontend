/**
 * Generate a JSX markup component per static page.
 *
 * These files are the faithful structural translation of each page's <body>.
 * Pages whose content was built imperatively come out mostly as empty
 * containers, that is correct; the React logic fills them.
 *
 * Regenerate with `npm run sync:markup`. Hand-edits are lost, so once a page
 * has real behaviour wired in, that lives in src/pages/<Page>.tsx which
 * imports (or supersedes) the generated markup.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { htmlToJsx, bodyOf } from './html-to-jsx.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const STATIC = join(HERE, '../../edulearn-frontend');
const OUT = join(HERE, '../src/pages/markup');

const PAGES = {
  index: 'LandingMarkup',
  dashboard: 'DashboardMarkup',
  learn: 'LearnMarkup',
  lesson: 'LessonMarkup',
  videos: 'VideosMarkup',
  mocktest: 'MockTestMarkup',
  'take-test': 'TakeTestMarkup',
  'create-test': 'CreateTestMarkup',
  challenge: 'ChallengeMarkup',
  pal: 'PalMarkup',
  tutor: 'TutorMarkup',
  live: 'LiveMarkup',
  login: 'LoginMarkup',
  signup: 'SignupMarkup',
  upload: 'UploadMarkup',
  admin: 'AdminMarkup',
  bank: 'BankMarkup',
  homework: 'HomeworkMarkup',
  'homework-assign': 'HomeworkAssignMarkup',
};

mkdirSync(OUT, { recursive: true });

const rows = [];
for (const [page, comp] of Object.entries(PAGES)) {
  const html = readFileSync(join(STATIC, `${page}.html`), 'utf8');
  const { jsx, needsCssProperties } = htmlToJsx(bodyOf(html), 2);

  const src =
    `/* Generated from edulearn-frontend/${page}.html, do not hand-edit.\n` +
    `   Regenerate with \`npm run sync:markup\`. */\n` +
    (needsCssProperties ? `import type { CSSProperties } from 'react';\n\n` : '') +
    `export default function ${comp}() {\n` +
    `  return (\n` +
    `    <>\n` +
    jsx.split('\n').map((l) => (l ? '  ' + l : l)).join('\n') + '\n' +
    `    </>\n` +
    `  );\n` +
    `}\n`;

  writeFileSync(join(OUT, `${comp}.tsx`), src);
  rows.push([page, comp, src.split('\n').length]);
}

console.log('page             component            lines');
for (const [p, c, n] of rows) {
  console.log(`${p.padEnd(16)} ${c.padEnd(20)} ${String(n).padStart(5)}`);
}
