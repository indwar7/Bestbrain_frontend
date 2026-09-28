/**
 * Convert a static page's <body> markup into JSX.
 *
 * The markup is hand-written HTML full of dense inline SVG (mascots, icons,
 * gradients). Retyping that by hand is where UI drift creeps in, so the
 * translation is done mechanically against a real HTML parse tree, every
 * element, attribute and text node is carried across, or the run fails loudly.
 *
 * What is deliberately dropped: <script> and <style> (ported separately), and
 * the chrome the SPA now owns as shared components, the <nav>, the hidden
 * aurora <defs> svg, and account-menu markup.
 *
 * Output is a starting point, not the finished page: containers the original
 * filled imperatively (e.g. <div id="subjMap"></div>) stay empty for the React
 * logic to populate.
 */
import { parseFragment } from 'parse5';

/** Attributes React spells differently from HTML. */
const RENAME = new Map(Object.entries({
  class: 'className',
  for: 'htmlFor',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  maxlength: 'maxLength',
  minlength: 'minLength',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  novalidate: 'noValidate',
  enctype: 'encType',
  usemap: 'useMap',
  srcset: 'srcSet',
  crossorigin: 'crossOrigin',
  playsinline: 'playsInline',
  contenteditable: 'contentEditable',
  spellcheck: 'spellCheck',
  inputmode: 'inputMode',
  accesskey: 'accessKey',
  'xlink:href': 'xlinkHref',
  'xml:lang': 'xmlLang',
  controlslist: 'controlsList',
  formaction: 'formAction',
  formmethod: 'formMethod',
  formnovalidate: 'formNoValidate',
  datetime: 'dateTime',
  frameborder: 'frameBorder',
  allowfullscreen: 'allowFullScreen',
  marginwidth: 'marginWidth',
  marginheight: 'marginHeight',
  referrerpolicy: 'referrerPolicy',
  srcdoc: 'srcDoc',
}));

/**
 * Attributes React types as `number`. HTML writes them as strings, so an
 * integer-looking value is emitted unquoted; anything else is left as a string
 * so a template placeholder is never silently turned into NaN.
 */
const NUMERIC = new Set(['colspan', 'rowspan', 'tabindex', 'maxlength', 'minlength',
  'size', 'span', 'start', 'rows', 'cols']);

/** Attributes that stay hyphenated in JSX. */
const KEEP_HYPHEN = /^(data-|aria-)/;

/** Void elements, always self-closed in JSX. */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr']);

/** Valueless HTML attributes become `attr={true}`. */
const BOOLEAN = new Set(['checked', 'disabled', 'readonly', 'required', 'selected',
  'autofocus', 'autoplay', 'controls', 'loop', 'muted', 'multiple', 'novalidate',
  'open', 'playsinline', 'hidden', 'default', 'reversed', 'async', 'defer']);

const kebabToCamel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

function jsxAttrName(name) {
  if (RENAME.has(name)) return RENAME.get(name);
  if (KEEP_HYPHEN.test(name)) return name;
  // SVG presentation attributes (stroke-width, stop-color, clip-path...) are
  // camelCase in JSX. Plain lowercase names pass through untouched.
  if (name.includes('-')) return kebabToCamel(name);
  if (name.includes(':')) return kebabToCamel(name.replace(':', '-'));
  return name;
}

/**
 * `style="fill:red;top:0"` -> a JSX style object literal.
 *
 * React applies CSS custom properties at runtime but CSSProperties does not
 * type them, so any object carrying one gets an explicit cast. Several pages
 * drive animation delays and grid positions through --i / --d / --sa, so this
 * is common rather than exotic.
 */
function styleToObject(value, state) {
  const props = [];
  let hasCustom = false;
  for (const part of value.split(';')) {
    const i = part.indexOf(':');
    if (i === -1) continue;
    const rawKey = part.slice(0, i).trim();
    const val = part.slice(i + 1).trim();
    if (!rawKey || !val) continue;
    // Custom properties (--foo) must keep their exact name and be quoted.
    const isCustom = rawKey.startsWith('--');
    if (isCustom) hasCustom = true;
    const key = isCustom ? `'${rawKey}'` : kebabToCamel(rawKey);
    props.push(`${key}: ${JSON.stringify(val)}`);
  }
  if (!props.length) return null;
  if (hasCustom) {
    state.needsCssProperties = true;
    return `{{ ${props.join(', ')} } as CSSProperties}`;
  }
  return `{{ ${props.join(', ')} }}`;
}

/** JSX text may not contain a bare { or }. */
function escapeText(text) {
  return text.replace(/[{}]/g, (c) => `{'${c}'}`);
}

/**
 * Elements that flow inline, where the whitespace around them is rendered
 * text rather than source formatting. `<h1>Learn <em>smarter,</em></h1>` loses
 * its word gap if that trailing space is trimmed away.
 */
const INLINE = new Set(['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'button', 'cite',
  'code', 'data', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'mark', 'q',
  'rp', 'rt', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub',
  'sup', 'svg', 'textarea', 'time', 'u', 'var', 'wbr']);

const isInlineNode = (n) => n && (n.nodeName === '#text' || INLINE.has(n.nodeName));

/** Whitespace-only text between two inline nodes is a real, rendered space. */
function isSignificantGap(nodes, i) {
  const node = nodes[i];
  if (node.nodeName !== '#text' || node.value.trim()) return false;
  if (!/[ \t\n\r]/.test(node.value)) return false;
  let prev = null, next = null;
  for (let j = i - 1; j >= 0; j--) { if (!isDropped(nodes[j])) { prev = nodes[j]; break; } }
  for (let j = i + 1; j < nodes.length; j++) { if (!isDropped(nodes[j])) { next = nodes[j]; break; } }
  return isInlineNode(prev) && isInlineNode(next);
}

/**
 * Find what a <select> should start on, from the `selected` option beneath it.
 *
 * In HTML `selected` marks the initial choice; React expects that expressed as
 * defaultValue on the <select> and rejects `selected` on the <option>. An
 * option with no value attribute falls back to its text, which is what the
 * browser submits for it.
 */
function selectDefault(node) {
  const found = [];
  (function walk(n) {
    for (const c of n.childNodes || []) {
      if (c.nodeName === 'option' && (c.attrs || []).some((a) => a.name === 'selected')) {
        const v = (c.attrs || []).find((a) => a.name === 'value');
        found.push(v ? v.value : (c.childNodes || []).map((t) => t.value || '').join('').trim());
      }
      walk(c);
    }
  })(node);
  if (!found.length) return null;
  const multiple = (node.attrs || []).some((a) => a.name === 'multiple');
  return multiple ? `{${JSON.stringify(found)}}` : JSON.stringify(found[0]);
}

function renderAttrs(attrs, state, tag) {
  const out = [];
  for (const { name, value } of attrs) {
    if (name.startsWith('on')) continue; // inline handlers are re-attached in React
    if (name === 'style') {
      const obj = styleToObject(value, state);
      if (obj) out.push(`style=${obj}`);
      continue;
    }
    /*
      HTML's `value`/`checked`/`selected` set the INITIAL state of a control.
      React reads the same spellings as the *controlled* value and then demands
      an onChange for every one of them, logging an error per field and
      rendering it read-only. defaultValue/defaultChecked are React's names for
      what the HTML actually meant, and these controls are all driven
      imperatively by the lifted page scripts anyway.
    */
    if (name === 'value' && (tag === 'input' || tag === 'textarea' || tag === 'select')) {
      out.push(`defaultValue=${JSON.stringify(value)}`);
      continue;
    }
    if (name === 'checked' && tag === 'input') { out.push('defaultChecked={true}'); continue; }
    // Consumed by selectDefault() on the parent <select>.
    if (name === 'selected' && tag === 'option') continue;

    const jsxName = jsxAttrName(name);
    if (value === '' && BOOLEAN.has(name)) { out.push(`${jsxName}={true}`); continue; }
    if (NUMERIC.has(name) && /^-?\d+$/.test(value.trim())) {
      out.push(`${jsxName}={${value.trim()}}`);
      continue;
    }
    out.push(`${jsxName}=${JSON.stringify(value)}`);
  }
  return out;
}

/** Chrome the SPA renders as shared components rather than per page. */
function isDropped(node) {
  if (node.nodeName === 'script' || node.nodeName === 'style') return true;
  if (node.nodeName === 'nav') {
    const cls = node.attrs?.find((a) => a.name === 'class')?.value || '';
    if (/\bnav\b/.test(cls)) return true;
  }
  // The hidden <svg width="0" height="0"> gradient defs are deliberately KEPT.
  // Each static page shipped its own #auroraGrad with different stops (the
  // landing page's is teal, the app pages' gold), and only one page is mounted
  // at a time, so keeping them page-local preserves that. They render before
  // <AuroraDefs/>, which stays mounted as a fallback, with duplicate ids the
  // first in document order wins, so the page's own definition takes effect.
  return false;
}

function walk(node, depth, out, state) {
  const pad = '  '.repeat(depth);

  if (node.nodeName === '#text') {
    const text = node.value;
    if (!text.trim()) {
      // Only reached for gaps already judged significant by the kids filter.
      out.push(`${pad}{' '}`);
      return;
    }
    // HTML collapses whitespace runs to a single space; a space at either end
    // is rendered output, so it is emitted as a string literal rather than
    // trimmed away by JSX's own whitespace rules.
    const collapsed = text.replace(/\s+/g, ' ');
    if (collapsed !== collapsed.trim()) {
      out.push(pad + `{${JSON.stringify(collapsed)}}`);
    } else {
      out.push(pad + escapeText(collapsed));
    }
    return;
  }

  if (node.nodeName === '#comment') {
    const body = node.data.trim().replace(/\*\//g, '*\\/');
    out.push(`${pad}{/* ${body} */}`);
    return;
  }

  if (isDropped(node)) return;

  const tag = node.nodeName;
  const attrs = renderAttrs(node.attrs || [], state, tag);
  if (tag === 'select') {
    const initial = selectDefault(node);
    if (initial && !attrs.some((a) => a.startsWith('defaultValue='))) {
      attrs.push(`defaultValue=${initial}`);
    }
  }
  const all = node.childNodes || [];
  const kids = all.filter((c, i) => {
    if (isDropped(c)) return false;
    if (c.nodeName === '#text' && !c.value.trim()) return isSignificantGap(all, i);
    return true;
  });

  // Attributes go one-per-line once the opening tag would get unwieldy.
  const inlineAttrs = attrs.join(' ');
  const attrStr = attrs.length === 0
    ? ''
    : inlineAttrs.length <= 90
      ? ' ' + inlineAttrs
      : '\n' + attrs.map((a) => `${pad}  ${a}`).join('\n') + `\n${pad}`;

  if (VOID.has(tag) || kids.length === 0) {
    out.push(`${pad}<${tag}${attrStr} />`);
    return;
  }

  out.push(`${pad}<${tag}${attrStr}>`);
  for (const kid of kids) walk(kid, depth + 1, out, state);
  out.push(`${pad}</${tag}>`);
}

/**
 * @param {string} html  the page's <body> inner HTML
 * @param {number} depth indentation level for the emitted JSX
 * @returns {{ jsx: string, needsCssProperties: boolean }}
 */
export function htmlToJsx(html, depth = 2) {
  const frag = parseFragment(html);
  const out = [];
  const state = { needsCssProperties: false };
  const all = frag.childNodes;
  all.forEach((node, i) => {
    if (isDropped(node)) return;
    if (node.nodeName === '#text' && !node.value.trim() && !isSignificantGap(all, i)) return;
    walk(node, depth, out, state);
  });
  return { jsx: out.join('\n'), needsCssProperties: state.needsCssProperties };
}

export function bodyOf(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1] : html;
}
