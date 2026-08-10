/* Preview-only: seed a demo student session and point api.js at THIS
   server. Runs before role-guard.js, which reads these keys straight from
   localStorage. Without the api override, API_BASE stays the deployed EC2
   host, whose CORS allowlist has no localhost entry — every call, including
   the AI Tutor stream, would die in preflight. */
(function () {
  /* role-guard.js bounces a LOGGED-IN visitor off the public pages straight
     to the dashboard. Seeding a session there would make the redesigned
     homepage and auth screens unreachable, so those three stay logged-out
     and every app page gets the demo student. */
  var page = (location.pathname.split('/').pop() || 'index.html')
    .toLowerCase().replace(/\.html$/, '') || 'index';

  /* The API override has to be set on EVERY page, public ones included.
     login.html calls EduAPI.login() while still logged out, and without this
     api.js keeps its deployed EC2 default — whose CORS allowlist has no
     localhost entry — so the demo sign-in dies in preflight. */
  try { localStorage.setItem('edulearn_api', location.origin); } catch (e) {}

  if (page === 'index' || page === 'login' || page === 'signup') {
    /* Skipping the seed here is not enough: a session stored on an earlier
       visit still lives in localStorage, and role-guard.js bounces a
       logged-IN visitor off the public pages straight to the dashboard —
       so the homepage could never be seen twice. Clear it, so the demo
       always starts at the homepage and only Log in moves you on. */
    try {
      localStorage.removeItem('edulearn_token');
      localStorage.removeItem('edulearn_user');
    } catch (e) { /* private mode — nothing stored to clear */ }
    return;
  }

  /* With the real backend answering, the demo session must NOT be seeded: a
     made-up token is rejected on the first call, and Learn, Videos, Live and
     Arena would all render their empty state while looking logged in. Leave
     the visitor logged out instead — role-guard sends them to the sign-in
     screen and the session that follows is a genuine one. */
  if (window.__PREVIEW_BACKEND_LIVE__) {
    /* keep a stale demo token from an offline run from poisoning a live one */
    try {
      if (localStorage.getItem('edulearn_token') === 'preview-demo-token') {
        localStorage.removeItem('edulearn_token');
        localStorage.removeItem('edulearn_user');
      }
    } catch (e) {}
    return;
  }

  try {
    localStorage.setItem('edulearn_api', location.origin);
    localStorage.setItem('edulearn_token', 'preview-demo-token');
    localStorage.setItem('edulearn_user', JSON.stringify({
      id: 'preview-student',
      name: 'Aarav Bhatia',
      email: 'aarav@bestbrain.local',
      role: 'student',
      class: 6,
      className: 'Class 6'
    }));
  } catch (e) { /* private mode — the page will just redirect to login */ }
})();
