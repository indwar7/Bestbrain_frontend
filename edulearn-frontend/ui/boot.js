/* ============================================================
   BESTBRAIN - BOOT (preview only)
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

  /* classes first, every themed rule keys off these */
  var h = document.documentElement;
  h.classList.add('kidbg', 'kid-dark', 'dark-mode', 'kid-booting');
  h.classList.remove('light-mode');

  /* The reveal, and every guarantee that it happens.

     kid-bg calls this the moment its first pass is done. Everything else
     here is a backstop: if that script is slow, fails to parse, or never
     loads at all, the page must still become visible. Each path is
     independent on purpose, a single missed reveal means a blank screen,
     which is a worse bug than the one being fixed. */
  var safety = 0;
  function reveal() {
    clearTimeout(safety);
    h.classList.remove('kid-booting');
  }
  /* Re-armed on client-side navigation: the router swaps in another of the
     product's own screens, so the same window reopens on every route change,
     not just the first load. The safety timer is re-armed with it. */
  function hold(ms) {
    h.classList.add('kid-booting');
    clearTimeout(safety);
    safety = setTimeout(reveal, ms || 900);
  }
  window.__kidReveal = reveal;
  window.__kidHold = hold;

  safety = setTimeout(reveal, 1400);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(reveal, 700); });
  } else {
    setTimeout(reveal, 250);
  }
  window.addEventListener('load', function () { setTimeout(reveal, 120); });
  /* A script blowing up must not leave the page blank. */
  window.addEventListener('error', function () { reveal(); }, true);

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
    'html{color-scheme:dark;}' +
    /* ----------------------------------------------------------------
       Hold the content back until the skin has been over it once.

       The pre-redesign screens are not a stale cache, they are the real
       markup. React (and each static page) renders the product's own
       layout, and the skin restyles it a beat later, so the old design is
       genuinely on screen in between. No amount of making that beat
       shorter removes it; the content simply must not be shown until the
       skin has run.

       Only body's opacity is held. html keeps the dark canvas above, so
       this reads as the page still loading rather than as a flash of a
       different product. Revealed by kid-bg once its first pass lands,
       with the timeouts below as a hard backstop, content that never
       comes back would be far worse than the flash this replaces. */
    'html.kid-booting body{opacity:0!important;}' +
    'html body{transition:opacity .16s ease-out;}';

  /* ------------------------------------------------------------------
     An expired session must end the session.

     When the access token dies the API answers 401, and the app went on
     rendering a fully signed-in shell with stale numbers, offering a banner
     that said "please refresh" for a state refreshing cannot fix. A student
     was left looking at yesterday's progress with no way to understand why.

     Every response is watched here rather than in each caller: one place to
     get right, and it covers the page scripts as well as the app's own client.
     ------------------------------------------------------------------ */
  /* But a 401 is also what every request gets once the short-lived access
     token expires, which happens routinely while the 7-day refresh cookie is
     still good. Signing out on that first 401 logged people out every few
     minutes. So: renew the access token first and replay the request, and
     only end the session when the renewal itself is refused. */
  var native = window.fetch;
  if (typeof native === 'function' && !window.__kidAuthGuard) {
    window.__kidAuthGuard = true;
    var signingOut = false;
    var renewing = null;

    var signOut = function () {
      if (signingOut) return;
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
    };

    /* One renewal at a time: a page that fires five calls at once must not
       spend the rotating refresh cookie five times. */
    var renew = function (apiRoot) {
      if (!renewing) {
        renewing = native(apiRoot + '/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (d) {
            var t = d && d.accessToken;
            if (t) { try { localStorage.setItem('edulearn_token', t); } catch (e) {} }
            return t || null;
          })
          .catch(function () { return null; })
          .then(function (t) { renewing = null; return t; });
      }
      return renewing;
    };

    window.fetch = function (input, init) {
      var isReq = typeof Request !== 'undefined' && input instanceof Request;
      var replay = isReq ? input.clone() : input;
      return native.apply(this, arguments).then(function (res) {
        try {
          var url = typeof input === 'string' ? input : (input && input.url) || String(input || '');
          /* only the app's own API, a 401 from anywhere else is not our session */
          if (res.status !== 401 || !/\/api\//.test(url) || /\/auth\/(login|signup|refresh|logout)/.test(url)) return res;
          if (signingOut) return res;

          return renew(url.replace(/\/api\/.*$/, '')).then(function (token) {
            if (!token) { signOut(); return res; }
            var headers = new Headers((init && init.headers) || (isReq ? replay.headers : undefined));
            headers.set('Authorization', 'Bearer ' + token);
            var opts = {};
            if (init) for (var k in init) opts[k] = init[k];
            opts.headers = headers;
            return native(replay, opts).then(function (again) {
              if (again.status === 401) signOut();
              return again;
            });
          });
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
