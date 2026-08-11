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

  /* ------------------------------------------------------------------
     An expired session must end the session.

     When the access token dies the API answers 401 — and the app went on
     rendering a fully signed-in shell with stale numbers, offering a banner
     that said "please refresh" for a state refreshing cannot fix. A student
     was left looking at yesterday's progress with no way to understand why.

     Every response is watched here rather than in each caller: one place to
     get right, and it covers the page scripts as well as the app's own client.
     ------------------------------------------------------------------ */
  var native = window.fetch;
  if (typeof native === 'function' && !window.__kidAuthGuard) {
    window.__kidAuthGuard = true;
    var signingOut = false;

    window.fetch = function (input, init) {
      return native.apply(this, arguments).then(function (res) {
        try {
          var url = typeof input === 'string' ? input : (input && input.url) || '';
          /* only the app's own API — a 401 from anywhere else is not our session */
          if (res.status === 401 && /\/api\//.test(url) && !/\/auth\/(login|signup|refresh)/.test(url)) {
            if (!signingOut) {
              signingOut = true;
              try {
                localStorage.removeItem('edulearn_token');
                localStorage.removeItem('edulearn_user');
              } catch (e) {}
              var here = (location.pathname.split('/').pop() || '').toLowerCase();
              if (here.indexOf('login') === -1 && here.indexOf('signup') === -1) {
                /* let the caller see its own 401 first, then leave */
                setTimeout(function () {
                  location.href = here.indexOf('.html') !== -1 ? 'login.html' : '/login';
                }, 60);
              }
            }
          }
        } catch (e) { /* never let the guard break a response */ }
        return res;
      });
    };
  }

  var s = document.createElement('style');
  s.id = 'kid-boot';
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
})();
