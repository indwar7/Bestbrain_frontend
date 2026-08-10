/* ============================================================
   BESTBRAIN — BOOT (preview only)
   ------------------------------------------------------------
   Runs synchronously in <head>, before the page's own stylesheets
   have painted anything. Its whole job is that there is never a
   white frame: the theme classes and the canvas colour are in
   place for the very first paint, so switching tabs goes dark →
   dark instead of dark → white flash → dark.

   Everything here is deliberately tiny. The real background,
   layout and passes still come from kid-bg / kid-ui later.
   ============================================================ */
(function () {
  'use strict';

  var SKIP = ['demo-pal-slides'];
  var page = (location.pathname.split('/').pop() || '').toLowerCase().replace(/\.html$/, '') || 'index';
  if (SKIP.indexOf(page) !== -1) return;

  /* classes first — every themed rule keys off these */
  var h = document.documentElement;
  h.classList.add('kidbg', 'kid-dark', 'dark-mode');
  h.classList.remove('light-mode');

  /* Critical CSS. `html` and `body` get the canvas immediately, and the ink
     law is repeated here so the first frame's text is already white rather
     than the black that vivid.css asserts. */
  var css =
    'html.kid-dark,html.kid-dark body{background:#050505!important;background-color:#050505!important;}' +
    'html.kid-dark body{color:#FFFFFF!important;-webkit-text-fill-color:#FFFFFF!important;}' +
    'html.kid-dark body,html.kid-dark p,html.kid-dark li,html.kid-dark span,html.kid-dark div,' +
    'html.kid-dark a,html.kid-dark td,html.kid-dark th,html.kid-dark label,html.kid-dark small,' +
    'html.kid-dark strong,html.kid-dark b,html.kid-dark em,html.kid-dark i,html.kid-dark u,' +
    'html.kid-dark button,html.kid-dark summary,html.kid-dark legend,html.kid-dark caption,' +
    'html.kid-dark input,html.kid-dark select,html.kid-dark textarea,html.kid-dark option,' +
    'html.kid-dark h1,html.kid-dark h2,html.kid-dark h3,html.kid-dark h4,html.kid-dark h5,html.kid-dark h6{' +
      'color:#FFFFFF!important;-webkit-text-fill-color:#FFFFFF!important;}' +
    /* kill the browser's own white paint between documents */
    'html{color-scheme:dark;}';

  var s = document.createElement('style');
  s.id = 'kid-boot';
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
})();
