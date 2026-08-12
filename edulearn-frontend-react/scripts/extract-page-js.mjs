/**
 * Lift each static page's inline <script> into a module.
 *
 * The body is copied VERBATIM and wrapped in a function whose parameters
 * shadow `location`, `document` and `window` (see pageScriptEnv.ts). That is
 * the whole trick: the page's own, already-working code keeps running against
 * a DOM that the converted markup reproduces exactly, instead of being
 * re-derived in React idiom — which is where behaviour drift would come from.
 *
 * Emitted as .js, not .ts: this is untouched legacy source and should not have
 * to satisfy strict type checking. tsconfig sets allowJs so it can be imported.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFragment } from 'parse5';
import { bodyOf } from './html-to-jsx.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const STATIC = join(HERE, '../../edulearn-frontend');
const OUT = join(HERE, '../src/pages/scripts');

// ---------------------------------------------------------------------------
// Inline on* handlers.
//
// A few pages (login, signup, admin) wire submit/click behaviour through
// attributes in the markup — `<form onsubmit="handleLogin(event)">` — not
// addEventListener. html-to-jsx.mjs deliberately drops every on* attribute
// ("re-attached in React"), and the lifted script only *defines* those
// functions, it never binds them. So without this, the login form has no
// submit handler at all: pressing the button does a native form reload and the
// user never signs in.
//
// We reproduce each inline handler as an addEventListener call appended to the
// lifted script. The expression runs inside init(), where those functions are
// in scope, and the target is selected by a path anchored at the nearest
// id-bearing ancestor — stable because the converted markup carries the same
// element tree across.
// ---------------------------------------------------------------------------
const isEl = (n) => n && typeof n.tagName === 'string';
const idOf = (n) => (n.attrs || []).find((a) => a.name === 'id')?.value ?? null;

function nthOfType(el) {
  const same = el.parentNode.childNodes.filter((n) => isEl(n) && n.tagName === el.tagName);
  return same.indexOf(el) + 1;
}

/**
 * A CSS selector for `el`, anchored at its nearest ancestor with an id.
 * Returns null when no ancestor has an id: a document-relative nth-of-type path
 * would not survive markup conversion (which drops the shared chrome), and a
 * loose path risks binding the wrong element — so we skip binding rather than
 * bind something fragile.
 */
function selectorFor(el) {
  const own = idOf(el);
  if (own) return `#${own}`;
  const segs = [];
  let cur = el;
  while (isEl(cur)) {
    segs.unshift(`${cur.tagName}:nth-of-type(${nthOfType(cur)})`);
    const parent = cur.parentNode;
    if (isEl(parent)) {
      const pid = idOf(parent);
      if (pid) return `#${pid} > ${segs.join(' > ')}`;
      cur = parent;
    } else break;
  }
  return null;
}

/** Collect `{ selector, type, expr }` for every bindable on* attribute, in document order. */
function collectHandlers(html, page) {
  const frag = parseFragment(bodyOf(html));
  const found = [];
  let skipped = 0;
  (function walk(n) {
    if (isEl(n)) {
      for (const a of n.attrs || []) {
        if (/^on[a-z]+$/i.test(a.name)) {
          const selector = selectorFor(n);
          if (selector) found.push({ selector, type: a.name.slice(2).toLowerCase(), expr: a.value });
          else { skipped++; console.warn(`  ⚠ ${page}: on${a.name.slice(2)} on <${n.tagName}> has no id ancestor — left unbound.`); }
        }
      }
    }
    (n.childNodes || []).forEach(walk);
  })(frag);
  return found;
}

function bindingsBlock(handlers) {
  if (!handlers.length) return '';
  const lines = handlers
    .map((h) => `  __bindEvt(${JSON.stringify(h.selector)}, ${JSON.stringify(h.type)}, function (event) { ${h.expr} });`)
    .join('\n');
  return (
    '\n\n/* ---- inline on* handlers, re-attached; see extract-page-js.mjs ---- */\n' +
    ';(function () {\n' +
    '  function __bindEvt(sel, type, fn) {\n' +
    '    document.querySelectorAll(sel).forEach(function (el) {\n' +
    '      el.addEventListener(type, fn);\n' +
    '      onCleanup(function () { el.removeEventListener(type, fn); });\n' +
    '    });\n' +
    '  }\n' +
    lines +
    '\n})();\n'
  );
}

const PAGES = ['dashboard', 'learn', 'lesson', 'videos', 'mocktest', 'take-test',
  'create-test', 'challenge', 'pal', 'tutor', 'live', 'login', 'signup', 'upload', 'admin'];

mkdirSync(OUT, { recursive: true });

const rows = [];
for (const page of PAGES) {
  const html = readFileSync(join(STATIC, `${page}.html`), 'utf8');

  // Inline scripts only, in source order. <script src="..."> are shared files
  // (api.js, curriculum.js, account-menu.js) loaded globally in index.html.
  const bodies = [];
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (/\bsrc\s*=/.test(m[1])) continue;
    if (m[2].trim()) bodies.push(m[2]);
  }
  if (!bodies.length) { rows.push([page, 0, 'no inline script']); continue; }

  const body = bodies.join('\n\n/* ---- next <script> block ---- */\n\n');
  const handlers = collectHandlers(html, page);
  const bindings = bindingsBlock(handlers);

  const src =
    `/* Lifted verbatim from edulearn-frontend/${page}.html — do not hand-edit.\n` +
    `   Regenerate with \`npm run sync:js\`.\n\n` +
    `   Runs inside the page-script environment: the destructured parameters\n` +
    `   shadow the real globals so ".html" navigations become route changes and\n` +
    `   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */\n` +
    `/* eslint-disable */\n` +
    `export default function init({ location, document, window, onCleanup }) {\n` +
    body + '\n' +
    bindings +
    `}\n`;

  writeFileSync(join(OUT, `${page}.js`), src);
  rows.push([page, bodies.length, `${handlers.length} handler${handlers.length === 1 ? '' : 's'}, ${src.split('\n').length} lines`]);
}

console.log('page             blocks  output');
for (const [p, n, note] of rows) console.log(`${p.padEnd(16)} ${String(n).padStart(6)}  ${note}`);
