/* ============================================================
   BestBrain — centralized role guard & nav access control
   ------------------------------------------------------------
   ONE source of truth for "who can open what". Load this FIRST,
   in <head> (before the page body renders), on every page that
   has the shared nav. It:

     1. Hard-guards the page: no session -> login.html,
        wrong role -> that role's home. Runs synchronously so a
        disallowed user never sees the protected content flash.
     2. Hides the navbar "Start free" CTA for logged-in users.
     3. Hides nav links the current role may not use, and rewrites
        the brand/logo link to the dashboard when logged in.

   Reads localStorage directly — NO dependency on api.js / EduAPI,
   so it is safe to run before those scripts load. api.js's
   requireAuth() and account-menu.js remain for their own concerns
   (API calls, settings panel); this file owns nav + access policy.

   To change access rules, edit ACCESS below — nowhere else.
   ============================================================ */
(function () {
  'use strict';

  var TOKEN_KEY = 'edulearn_token';
  var USER_KEY = 'edulearn_user';
  var LANDING = 'index.html'; // public landing — where logged-out visitors go
  var HOME = 'dashboard.html'; // every logged-in role's landing page

  // ---- session (read straight from localStorage, defensively) ----
  function readToken() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
  }
  function readUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (e) { return null; }
  }

  // Normalize role. Live-session sub-roles (host/assistant) are teachers
  // for access purposes; anything unknown is treated as 'student' (the
  // most-restricted-but-safe default) rather than granted teacher/admin.
  function roleOf(user) {
    var r = (user && user.role ? String(user.role) : '').toLowerCase();
    if (r === 'host' || r === 'assistant') return 'teacher';
    if (r === 'student' || r === 'teacher' || r === 'parent' || r === 'admin') return r;
    return 'student';
  }

  // ---- ACCESS MATRIX — the single source of truth ----
  // For each role: the set of pages it may open. A page NOT listed is
  // denied (hard redirect on direct access + its nav link hidden).
  // 'admin' is handled specially below (may open everything).
  //
  // Derived from the app's role intent:
  //   * Learn (chapters), Arena (challenge), and Tests (mocktest) are STUDENT
  //     surfaces — teachers and parents must NOT see or open them. Teachers
  //     author tests via create-test.html, not the student mocktest page.
  //   * PAL serves students, teachers (worksheets), and parents (progress).
  //   * tutor (the live voice doubt session) is a STUDENT surface — it exists
  //     to answer a student's own doubts aloud.
  //   * create-test / upload are teacher tools (each also self-gates in-page).
  //   * Live, Videos, Dashboard are shared by all roles.
  var ACCESS = {
    student: ['learn.html', 'live.html', 'challenge.html', 'mocktest.html', 'pal.html', 'tutor.html', 'lesson.html', 'videos.html', 'dashboard.html'],
    teacher: ['live.html', 'create-test.html', 'upload.html', 'pal.html', 'videos.html', 'dashboard.html'],
    parent: ['live.html', 'pal.html', 'videos.html', 'dashboard.html'],
    admin: null // null = unrestricted
  };

  // Pages that require a session but no specific role beyond "logged in".
  // (Nav pages live in ACCESS; these are here for completeness/clarity.)

  // Public pages: never guarded, even when logged out.
  var PUBLIC = ['index.html', 'login.html', 'signup.html', ''];

  function currentPage() {
    var p = location.pathname.split('/').pop();
    return p || 'index.html';
  }

  function roleAllows(role, page) {
    if (role === 'admin') return true;
    var allowed = ACCESS[role];
    if (!allowed) return true; // unknown role config -> don't lock out
    return allowed.indexOf(page) !== -1;
  }

  var page = currentPage();
  var token = readToken();
  var user = readUser();
  var role = roleOf(user);
  var loggedIn = !!token && !!user;
  var isPublic = PUBLIC.indexOf(page) !== -1;

  // ---------- 1. HARD GUARD (must run before body paints) ----------
  if (!isPublic) {
    if (!loggedIn) {
      // Not signed in -> show the LANDING page, not the bare login form. A
      // shared deep link (e.g. challenge.html) used to dump first-time
      // visitors straight onto login/signup with zero context about what
      // BestBrain even is; the landing page introduces the product and its
      // header carries the Login button. replace() so Back doesn't loop here.
      location.replace(LANDING);
      return;
    }
    if (!roleAllows(role, page)) {
      // Signed in but this page isn't for their role -> send to their home.
      // Guard against redirect loops if HOME itself were ever disallowed.
      if (page !== HOME) {
        location.replace(HOME);
        return;
      }
    }
  }

  // ---------- 2 & 3. NAV COSMETICS (run once the nav DOM exists) ----------
  function applyNav() {
    // Hide the "Start free" CTA whenever logged in — it links to login.html
    // and would bounce an authenticated user back to the login screen.
    if (loggedIn) {
      document.querySelectorAll('a.btn-primary[href="login.html"]').forEach(function (el) {
        el.style.display = 'none';
      });
      // Brand/logo and "Home" links default to index.html (the logged-out
      // landing). Clicking them while logged in should go to the dashboard.
      document.querySelectorAll('a.brand[href="index.html"], a[href="index.html"]').forEach(function (el) {
        el.setAttribute('href', HOME);
      });
      // Hide nav links to pages this role may not open, so the menu only ever
      // shows what the guard would actually let them reach.
      document.querySelectorAll('a.nav__link[href], a.nav-link[href]').forEach(function (el) {
        var href = (el.getAttribute('href') || '').split('/').pop().split('#')[0].split('?')[0];
        if (!href || href === 'index.html') return; // brand/home handled above
        if (!roleAllows(role, href)) el.style.display = 'none';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyNav);
  } else {
    applyNav();
  }

  // Expose the policy so pages/tests can reason about it without re-deriving.
  window.EduGuard = {
    role: role,
    loggedIn: loggedIn,
    can: function (pg) { return roleAllows(role, pg); },
    ACCESS: ACCESS
  };
})();
