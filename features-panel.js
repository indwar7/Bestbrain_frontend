/* ============================================================
   EduLearn - Feature Showcase + Live Progress Panel
   A floating button + slide-out panel. The top shows the signed-in
   user's REAL progress pulled live from the backend (/api/dashboard);
   below it, the module map links to every page.
   Theme-aware: readable in both light and dark mode (uses the site's
   --dm-* CSS variables, which flip with the `dark-mode` class).
   Injected on every page. Self-contained.
   ============================================================ */
(function () {
  'use strict';
  if (window.__eduFeaturePanel) return;
  window.__eduFeaturePanel = true;

  var BASE = (function () {
    var p = location.pathname;
    var i = p.indexOf('/edulearn-frontend/');
    return i !== -1 ? p.slice(0, i + 19) : (p.replace(/[^/]*$/, ''));
  })();
  function href(file) { return BASE + file; }

  /* each item: [label, status('done'|'plan'), targetFile] */
  var SECTIONS = [
    {
      title: 'Live Classes & Tutors', link: 'live.html', color: '#3DE8C5',
      items: [
        ['Small-group live classes with real tutors', 'done', 'live.html'],
        ['Seat booking + .ics calendar invite', 'done', 'live.html'],
        ['In-app classroom, stage, chat, controls', 'done', 'live.html'],
        ['Zoom Video SDK / self-hosted LiveKit', 'plan', 'live.html']
      ]
    },
    {
      title: 'AI Attention Monitoring', link: 'live.html', color: '#FF7AA2',
      items: [
        ['Real webcam gaze detection (eyes-on-screen %)', 'done', 'live.html'],
        ['Consent-first; video stays on device', 'done', 'live.html'],
        ['Tab-focus / idle fallback', 'done', 'live.html'],
        ['Post-session report → parent & teacher', 'done', 'live.html'],
        ['Parent dashboard attention card', 'done', 'dashboard.html']
      ]
    },
    {
      title: 'PAL - AI Assistant', link: 'pal.html', color: '#7C9BFF',
      items: [
        ['GPT-style chat: Student / Parent / Teacher', 'done', 'pal.html'],
        ['Student: doubts, notes, summaries, quizzes', 'done', 'pal.html'],
        ['Parent: progress, weak areas, attention', 'done', 'pal.html'],
        ['Teacher: worksheets + class analytics', 'done', 'pal.html'],
        ['Hinglish input, streaming, chat history', 'done', 'pal.html'],
        ['Connect to a live LLM API', 'plan', 'pal.html']
      ]
    },
    {
      title: 'Arena - Hourly Challenge', link: 'challenge.html', color: '#FFB454',
      items: [
        ['One question every hour, same for all', 'done', 'challenge.html'],
        ['45-second window, speed is anti-cheat', 'done', 'challenge.html'],
        ['Speed points, streaks, leaderboard', 'done', 'challenge.html']
      ]
    },
    {
      title: 'Progressive Mock Tests', link: 'mocktest.html', color: '#3DE8C5',
      items: [
        ['Adaptive: right → harder, wrong → easier', 'done', 'mocktest.html'],
        ['Visible difficulty ladder + journey chart', 'done', 'mocktest.html'],
        ['Mastery score weighted by difficulty', 'done', 'mocktest.html'],
        ['Full review + PAL recommendation', 'done', 'mocktest.html']
      ]
    },
    {
      title: 'Learn - Course Library', link: 'learn.html', color: '#7C9BFF',
      items: [
        ['Classes 6–9 × 5 subjects, ~190 chapters', 'done', 'learn.html'],
        ['Live search, progress bars, badges', 'done', 'learn.html'],
        ['AI animated video lectures', 'plan', 'lesson.html'],
        ['Notes, practice, tests, eBook per chapter', 'plan', 'lesson.html']
      ]
    },
    {
      title: 'Dashboards', link: 'dashboard.html', color: '#FFB454',
      items: [
        ['Student: streaks, mastery, recommendations', 'done', 'dashboard.html'],
        ['Parent: progress, alerts, attention', 'done', 'dashboard.html'],
        ['Teacher: class average, weak topics, roster', 'done', 'dashboard.html'],
        ['School admin view', 'plan', 'dashboard.html']
      ]
    },
    {
      title: 'Platform', link: 'index.html', color: '#FF7AA2',
      items: [
        ['Dark / light theme across all pages', 'done', 'index.html'],
        ['Bilingual UI - English / हिंदी', 'done', 'learn.html'],
        ['Character-driven animated landing', 'done', 'index.html'],
        ['Offline-first PWA + Android app', 'plan', 'index.html'],
        ['Phone-OTP auth, UPI payments', 'plan', 'login.html']
      ]
    }
  ];

  var NAV = [
    ['Home', 'index.html'], ['Learn', 'learn.html'], ['Live', 'live.html'],
    ['Arena', 'challenge.html'], ['Tests', 'mocktest.html'],
    ['PAL AI', 'pal.html'], ['Dashboard', 'dashboard.html']
  ];

  /* Theme-aware styling.
     - Base rules (light mode) use dark text on a light surface.
     - html.dark-mode overrides flip to light text on a dark surface.
     Colours are set explicitly (not inherited) so nothing on the host
     page can wash them out, this is what fixes the "can't read" bug. */
  var css = [
    '#efp-btn{position:fixed;right:18px;bottom:18px;z-index:99998;display:inline-flex;align-items:center;gap:9px;',
    'background:linear-gradient(135deg,#5B6CF0,#3F5BE0);color:#FFFFFF;font-family:"Schibsted Grotesk",system-ui,sans-serif;',
    'font-weight:800;font-size:14px;border:2px solid #000;cursor:pointer;border-radius:999px;padding:11px 18px;',
    'box-shadow:3px 3px 0 #000;transition:transform .2s,box-shadow .2s}',
    '#efp-btn:hover{transform:translate(-1px,-1px);box-shadow:5px 5px 0 #000}',
    '#efp-btn svg{display:block}',
    '@media(max-width:600px){#efp-btn span{display:none}#efp-btn{padding:13px;right:14px;bottom:14px}}',
    '#efp-ov{position:fixed;inset:0;z-index:99998;background:rgba(8,12,22,.55);backdrop-filter:blur(3px);opacity:0;pointer-events:none;transition:opacity .3s ease}',
    '#efp-ov.open{opacity:1;pointer-events:auto}',

    /* ---- panel shell (LIGHT mode defaults) ---- */
    '#efp{position:fixed;top:0;right:0;height:100%;width:420px;max-width:92vw;z-index:99999;',
    'background:#FFFFFF;color:#1A1F36;',
    'font-family:"Schibsted Grotesk",system-ui,sans-serif;box-shadow:-24px 0 60px rgba(0,0,0,.25);transform:translateX(100%);',
    'transition:transform .36s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column;border-left:1px solid rgba(0,0,0,.1)}',
    '#efp.open{transform:translateX(0)}',
    '#efp *{box-sizing:border-box}',
    '#efp-hd{flex:none;padding:22px 22px 18px;border-bottom:1px solid rgba(0,0,0,.1);position:relative}',
    '#efp-hd h2{font-family:"Fraunces",Georgia,serif;font-size:21px;font-weight:600;margin:0 0 4px;letter-spacing:-.01em;color:#1A1F36}',
    '#efp-hd p{margin:0;font-size:12.5px;color:#6B7280;line-height:1.5}',
    '#efp-x{position:absolute;top:18px;right:18px;width:34px;height:34px;border-radius:10px;border:1px solid rgba(0,0,0,.14);',
    'background:transparent;color:#1A1F36;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s}',
    '#efp-x:hover{background:rgba(0,0,0,.06)}',

    /* ---- live progress block ---- */
    '#efp-me{flex:none;padding:16px 22px;border-bottom:1px solid rgba(0,0,0,.1)}',
    '#efp-me .ttl{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6B7280;font-weight:700;margin:0 0 10px}',
    '#efp-stats{display:flex;gap:10px}',
    '.efp-stat{flex:1;background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.07);border-radius:12px;padding:11px 12px;text-align:center}',
    '.efp-stat b{display:block;font-family:"Fraunces",serif;font-size:20px;font-weight:600;color:#1A1F36;line-height:1.1}',
    '.efp-stat span{display:block;font-size:10.5px;color:#6B7280;margin-top:3px;letter-spacing:.02em}',
    '#efp-empty{font-size:12.5px;color:#6B7280;line-height:1.5;background:rgba(0,0,0,.04);border:1px dashed rgba(0,0,0,.14);border-radius:12px;padding:14px}',
    '#efp-empty a{color:#0A9E86;font-weight:700;text-decoration:none}',
    '#efp-signin{font-size:12.5px;color:#6B7280;line-height:1.5}',
    '#efp-signin a{color:#0A9E86;font-weight:700;text-decoration:none}',

    '#efp-meter{display:flex;align-items:center;gap:12px;padding:14px 22px;border-bottom:1px solid rgba(0,0,0,.1)}',
    '#efp-bar{flex:1;height:7px;border-radius:5px;background:rgba(0,0,0,.1);overflow:hidden}',
    '#efp-bar i{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,#3DE8C5,#7C9BFF)}',
    '#efp-meter b{font-family:"Fraunces",serif;font-size:15px;font-weight:600;white-space:nowrap;color:#1A1F36}',
    '#efp-bd{flex:1;overflow-y:auto;padding:8px 22px 26px}',
    '.efp-sec{padding:16px 0;border-bottom:1px solid rgba(0,0,0,.07)}',
    '.efp-sec:last-child{border-bottom:none}',
    '.efp-sh{display:flex;align-items:center;gap:10px;margin-bottom:11px}',
    '.efp-dot{width:9px;height:9px;border-radius:50%;flex:none}',
    '.efp-sh h3{font-size:15px;font-weight:700;margin:0;flex:1;color:#1A1F36}',
    '.efp-open{font-family:"Fragment Mono",ui-monospace,monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;',
    'color:#6B7280;text-decoration:none;border:1px solid rgba(0,0,0,.16);border-radius:6px;padding:4px 8px;transition:all .2s;white-space:nowrap;cursor:pointer}',
    '.efp-open:hover{color:#0B1224;background:#3DE8C5;border-color:transparent}',
    '.efp-it{display:flex;align-items:center;gap:10px;font-size:13.5px;line-height:1.4;padding:7px 8px;margin:1px -8px;color:#334155;text-decoration:none;border-radius:9px;cursor:pointer;transition:background .18s}',
    '.efp-it:hover{background:rgba(0,0,0,.05)}',
    '.efp-it:hover .efp-go{opacity:1;transform:translateX(0)}',
    '.efp-ck{width:18px;height:18px;border-radius:6px;flex:none;display:flex;align-items:center;justify-content:center}',
    '.efp-ck.done{background:rgba(10,158,134,.16);color:#0A9E86}',
    '.efp-ck.plan{background:rgba(124,155,255,.18);color:#5B76E0}',
    '.efp-it .lbl{flex:1}',
    '.efp-it .pl{font-family:"Fragment Mono",monospace;font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:#5B76E0;border:1px solid rgba(124,155,255,.4);border-radius:5px;padding:2px 6px}',
    '.efp-go{flex:none;color:#6B7280;opacity:0;transform:translateX(-4px);transition:all .2s}',
    '#efp-nav{flex:none;border-top:1px solid rgba(0,0,0,.1);padding:14px 22px;display:flex;flex-wrap:wrap;gap:7px;background:rgba(0,0,0,.03)}',
    '#efp-nav a{font-size:12px;font-weight:600;color:#334155;text-decoration:none;border:1px solid rgba(0,0,0,.16);border-radius:999px;padding:6px 13px;transition:all .2s}',
    '#efp-nav a:hover{color:#0B1224;background:#3DE8C5;border-color:transparent}',
    '#efp-nav a.cur{background:rgba(61,232,197,.18);border-color:rgba(61,232,197,.6);color:#0A9E86}',
    '#efp-foot{font-size:10.5px;color:#8A93A5;text-align:center;padding:0 22px 14px;background:rgba(0,0,0,.03)}',

    /* ============ DARK MODE OVERRIDES ============ */
    'html.dark-mode #efp{background:#0E1626;color:#F2EDE3;box-shadow:-24px 0 60px rgba(0,0,0,.5);border-left:1px solid rgba(242,237,227,.1)}',
    'html.dark-mode #efp-hd{border-bottom:1px solid rgba(242,237,227,.1)}',
    'html.dark-mode #efp-hd h2{color:#F2EDE3}',
    'html.dark-mode #efp-hd p{color:#A7B0C2}',
    'html.dark-mode #efp-x{border:1px solid rgba(242,237,227,.14);color:#F2EDE3}',
    'html.dark-mode #efp-x:hover{background:rgba(242,237,227,.08)}',
    'html.dark-mode #efp-me{border-bottom:1px solid rgba(242,237,227,.1)}',
    'html.dark-mode #efp-me .ttl{color:#A7B0C2}',
    'html.dark-mode .efp-stat{background:rgba(242,237,227,.06);border:1px solid rgba(242,237,227,.1)}',
    'html.dark-mode .efp-stat b{color:#F2EDE3}',
    'html.dark-mode .efp-stat span{color:#A7B0C2}',
    'html.dark-mode #efp-empty{color:#A7B0C2;background:rgba(242,237,227,.06);border:1px dashed rgba(242,237,227,.18)}',
    'html.dark-mode #efp-empty a,html.dark-mode #efp-signin a{color:#3DE8C5}',
    'html.dark-mode #efp-signin{color:#A7B0C2}',
    'html.dark-mode #efp-meter{border-bottom:1px solid rgba(242,237,227,.1)}',
    'html.dark-mode #efp-bar{background:rgba(242,237,227,.12)}',
    'html.dark-mode #efp-meter b{color:#F2EDE3}',
    'html.dark-mode .efp-sec{border-bottom:1px solid rgba(242,237,227,.07)}',
    'html.dark-mode .efp-sh h3{color:#F2EDE3}',
    'html.dark-mode .efp-open{color:#A7B0C2;border:1px solid rgba(242,237,227,.16)}',
    'html.dark-mode .efp-it{color:#DDD8CE}',
    'html.dark-mode .efp-it:hover{background:rgba(242,237,227,.06)}',
    'html.dark-mode .efp-ck.done{background:rgba(61,232,197,.18);color:#3DE8C5}',
    'html.dark-mode .efp-ck.plan{background:rgba(124,155,255,.18);color:#7C9BFF}',
    'html.dark-mode .efp-it .pl{color:#9DB0FF;border:1px solid rgba(124,155,255,.34)}',
    'html.dark-mode .efp-go{color:#A7B0C2}',
    'html.dark-mode #efp-nav{border-top:1px solid rgba(242,237,227,.1);background:#0B1220}',
    'html.dark-mode #efp-nav a{color:#DDD8CE;border:1px solid rgba(242,237,227,.16)}',
    'html.dark-mode #efp-nav a.cur{background:rgba(61,232,197,.16);border-color:rgba(61,232,197,.5);color:#3DE8C5}',
    'html.dark-mode #efp-foot{color:#7C879B;background:#0B1220}',
    /* ---- phone ----
       Last in the sheet on purpose. A media query adds no specificity, so
       these lose to the identical single-class selectors above unless they
       come after them in source order, placed higher up, every one of these
       was silently dropped.

       The type in here was set for a desktop side panel: 8px on the .pl chips
       and 9px on the "Open" links, unreadable on a phone and under the 12px
       floor for supporting text. The close button was 34px and the "Open"
       links a 4px-padded row, both under the 44px a finger needs. Scoped to
       the query, so the desktop panel keeps the density it was designed with. */
    /* Legibility and touch targets key off 900px, not 600px: a phone held
       sideways is 667px wide and a tablet is 768px, and neither of them grew
       a mouse. Sizing these at 600px left the same 9px links and 34px close
       button on both. Layout is the separate block below, that genuinely
       depends on how much width there is. */
    '@media(max-width:900px){',
    '  #efp-x{width:44px;height:44px}',
    '  .efp-open{font-size:12px;padding:11px 12px;min-height:44px;display:inline-flex;align-items:center}',
    '  .efp-it{padding:11px 8px;min-height:44px}',
    '  .efp-it .pl{font-size:12px;padding:3px 7px}',
    '  .efp-sh h3{font-size:16px}',
    '  #efp-nav a{font-size:13px;padding:10px 14px}',
    '  #efp-foot{font-size:12px;padding-bottom:max(14px,env(safe-area-inset-bottom))}',
    '  #efp-me .ttl{font-size:12px}',
    '  .efp-stat span{font-size:12px}',
    '  #efp-btn{bottom:max(14px,env(safe-area-inset-bottom))}',
    '}',
    '@media(max-width:600px){',
    '  #efp{width:min(100vw,420px);max-width:100vw}',
    '}',
  ].join('');

  var totDone = 0, tot = 0;
  SECTIONS.forEach(function (s) { s.items.forEach(function (it) { tot++; if (it[1] === 'done') totDone++; }); });
  var pct = Math.round(totDone / tot * 100);

  var ckDone = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.5 5.5L20 7"/></svg>';
  var ckPlan = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  var goArrow = '<svg class="efp-go" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var hereFile = (location.pathname.split('/').pop() || 'index.html');

  var secHTML = SECTIONS.map(function (s) {
    var items = s.items.map(function (it) {
      var done = it[1] === 'done';
      return '<a class="efp-it" href="' + href(it[2]) + '"><span class="efp-ck ' + (done ? 'done' : 'plan') + '">' +
        (done ? ckDone : ckPlan) + '</span><span class="lbl">' + esc(it[0]) + '</span>' +
        (done ? '' : '<span class="pl">Planned</span>') + goArrow + '</a>';
    }).join('');
    return '<div class="efp-sec"><div class="efp-sh"><span class="efp-dot" style="background:' + s.color + '"></span>' +
      '<h3>' + esc(s.title) + '</h3><a class="efp-open" href="' + href(s.link) + '">Open</a></div>' + items + '</div>';
  }).join('');

  var navHTML = NAV.map(function (n) {
    var cur = n[1] === hereFile ? ' class="cur"' : '';
    return '<a' + cur + ' href="' + href(n[1]) + '">' + esc(n[0]) + '</a>';
  }).join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'efp-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Show feature list');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1.3" fill="currentColor" stroke="none"/></svg><span>Features</span>';

  var ov = document.createElement('div');
  ov.id = 'efp-ov';

  var panel = document.createElement('aside');
  panel.id = 'efp';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Feature showcase');
  panel.innerHTML =
    '<div id="efp-hd"><h2>EduLearn - Feature Tour</h2>' +
    '<p>Your live progress, plus every module. Click any row to jump straight to it.</p>' +
    '<button id="efp-x" type="button" aria-label="Close">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button></div>' +
    '<div id="efp-me"><p class="ttl">Your progress</p><div id="efp-me-body">' +
      '<div id="efp-signin">Loading…</div>' +
    '</div></div>' +
    '<div id="efp-meter"><div id="efp-bar"><i style="width:' + pct + '%"></i></div><b>' + totDone + ' live</b></div>' +
    '<div id="efp-bd">' + secHTML + '</div>' +
    '<div id="efp-nav">' + navHTML + '</div>' +
    '<div id="efp-foot">' + totDone + ' modules built · ' + (tot - totDone) + ' planned · click a row to open it</div>';

  document.body.appendChild(btn);
  document.body.appendChild(ov);
  document.body.appendChild(panel);

  // ---- live per-user progress (real data, honest empty states) ----
  var progressLoaded = false;

  function renderSignedOut() {
    document.getElementById('efp-me-body').innerHTML =
      '<div id="efp-signin">Sign in to see your real learning progress. ' +
      '<a href="' + href('login.html') + '">Log in</a></div>';
  }

  function renderEmpty(name) {
    var hi = name ? esc(name.split(' ')[0]) + ', you' : 'You';
    document.getElementById('efp-me-body').innerHTML =
      '<div id="efp-empty">' + hi + ' haven\'t started yet. Watch a lecture or complete a chapter and your ' +
      'streak, minutes and progress will show up here. ' +
      '<a href="' + href('learn.html') + '">Start learning →</a></div>';
  }

  function renderStats(cells) {
    var html = '<div id="efp-stats">' + cells.map(function (c) {
      return '<div class="efp-stat"><b>' + esc(String(c.value)) + '</b><span>' + esc(c.label) + '</span></div>';
    }).join('') + '</div>';
    document.getElementById('efp-me-body').innerHTML = html;
  }

  // Turn a backend dashboard payload into real stat cells per role.
  // Returns null when there is genuinely nothing to show (→ empty state).
  function statsFromDashboard(data) {
    if (!data || !data.role) return null;

    if (data.role === 'student') {
      var streak = (data.insights && data.insights.dayStreak) || 0;
      var week = (data.insights && data.insights.thisWeek) || {};
      var mins = week.minutes || 0;
      var stats = data.stats || {};
      var done = stats.chaptersCompleted || 0;
      // Nothing done at all → let the caller show the empty state.
      if (!streak && !mins && !done) return null;
      return [
        { value: done, label: 'Chapters done' },
        { value: mins, label: 'Mins this week' },
        { value: streak, label: 'Day streak' }
      ];
    }

    if (data.role === 'parent') {
      var kids = data.children || [];
      if (!kids.length) return null;
      var k = kids[0];
      var anyActivity = kids.some(function (c) { return (c.minutes || c.dayStreak || c.chaptersCompleted); });
      if (!anyActivity) return null;
      return [
        { value: kids.length, label: kids.length === 1 ? 'Child' : 'Children' },
        { value: k.chaptersCompleted || 0, label: 'Chapters done' },
        { value: k.dayStreak || 0, label: 'Day streak' }
      ];
    }

    if (data.role === 'teacher') {
      var count = data.studentCount || 0;
      if (!count) return null;
      var avg = data.classAverage || {};
      return [
        { value: count, label: 'Students' },
        { value: data.activeThisWeek || 0, label: 'Active this wk' },
        { value: (avg.avgWeekMinutes || 0), label: 'Avg mins/wk' }
      ];
    }
    return null;
  }

  function loadProgress() {
    if (progressLoaded) return;

    var api = window.EduAPI;
    // Not signed in (no token at all) → show the signed-out note, but DON'T mark
    // as loaded, so it re-checks the next time the panel opens (e.g. after api.js
    // finishes loading or the user logs in).
    if (!api || typeof api.getDashboard !== 'function' || !api.getToken || !api.getToken()) {
      renderSignedOut();
      return;
    }

    progressLoaded = true; // we have a real session, load it once
    api.getDashboard().then(function (data) {
      var cells = statsFromDashboard(data);
      if (cells) {
        renderStats(cells);
      } else {
        var u = api.getUser && api.getUser();
        renderEmpty(u && u.name);
      }
    }).catch(function () {
      // On any error (expired token, network), don't invent numbers, and allow
      // a retry on the next open.
      progressLoaded = false;
      renderSignedOut();
    });
  }

  function open() { ov.classList.add('open'); panel.classList.add('open'); loadProgress(); }
  function close() { ov.classList.remove('open'); panel.classList.remove('open'); }
  btn.addEventListener('click', open);
  ov.addEventListener('click', close);
  document.getElementById('efp-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
