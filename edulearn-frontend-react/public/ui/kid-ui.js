/* ============================================================
   BESTBRAIN - AMBER OS · GLASS DESIGN SYSTEM + SHELL
   ------------------------------------------------------------
   Local preview only. Never written to the repo.

   Three jobs:
     1. one glass language for every surface, cards, nav, sidebar,
        dialogs, tables, inputs, buttons
     2. the app shell: the top navbar becomes a LEFT SIDEBAR, plus a
        slim top HUD, both frosted
     3. motion, scroll reveal, hover lift, count-up, ripple

   THE SIDEBAR IS BUILT BY MOVING, NOT COPYING. The page's real
   .brand / .nav__links / .nav__right nodes are relocated into the
   rail, so role-guard.js's link decisions, account-menu.js's
   injected buttons and the i18n layer all keep working untouched.
   ============================================================ */
(function () {
  'use strict';

  var RAIL = 244;
  /* privacy and terms join this list for the same reason index/login/signup
     are on it: they are documents, not product screens. The rail put a
     signed-out reader's "MY SPACE / Level 1 / Start learning" dashboard
     beside a policy. */
  var NO_RAIL = ['index', 'login', 'signup', 'privacy', 'terms', 'demo-pal-slides'];

  function pageKey() {
    // "/lesson/<chapter>" is the lesson page, whatever the chapter is called
    if (/^\/lesson\//.test(location.pathname)) return 'lesson';
    var last = (location.pathname.split('/').pop() || '').toLowerCase();
    return (last.replace(/\.html$/, '')) || 'index';
  }
  function readUser() {
    try { return JSON.parse(localStorage.getItem('edulearn_user') || 'null'); }
    catch (e) { return null; }
  }

  /* ---------------------------------------------------------
     REAL PROGRESS (QA S-07 / T-05 / T-06 / P-02)

     "Level 7 · 680/1000 XP", "480 coins" and a hardcoded "🔥 7" streak were
     literal text in this file, the same numbers for every account, on every
     role, forever. A QA pass caught it instantly: the header disagreed with
     the page body on the same screen, a teacher and a parent were shown a
     student's level-up nudge, and "Class 6 · CBSE" was printed under a
     teacher's name.

     There is no coins/XP/level field anywhere in the backend (confirmed by
     reading the API), so the honest fix is not to invent a second backend
     to back them. Streak is real and per-user; XP, level and coins are
     derived from it plus badges and minutes so they move with an account's
     actual activity instead of being the same for all 55 seeded users. And
     the gamification cluster only renders for students, a teacher or
     parent does not have a chapter to finish.
     --------------------------------------------------------- */
  function api() {
    try {
      if (window.EduAPI && window.EduAPI.API_BASE) return window.EduAPI.API_BASE;
    } catch (e) {}
    try {
      var o = localStorage.getItem('edulearn_api');
      if (o) return o.replace(/\/+$/, '');
    } catch (e) {}
    return location.origin;
  }
  function token() {
    try { return localStorage.getItem('edulearn_token') || ''; } catch (e) { return ''; }
  }
  function role() {
    var u = readUser();
    return (u && u.role) || 'student';
  }

  var progressPromise = null;
  /* One fetch, cached and shared, every chip that shows a number reads from
     the same object, so the header and the body can no longer disagree. */
  function loadProgress() {
    if (progressPromise) return progressPromise;
    var t = token();
    if (!t) return (progressPromise = Promise.resolve(null));
    progressPromise = fetch(api() + '/api/progress', { headers: { Authorization: 'Bearer ' + t } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { return (d && d.progress) || null; })
      .catch(function () { return null; });
    return progressPromise;
  }

  /* Deterministic, not fictional: the same real inputs always produce the
     same XP, so two students with identical activity see identical numbers
    , and a student who has done nothing sees 0, not 480.

     Coins are no longer among them. They used to be invented here from the
     streak and badge counts, which made them a decoration: nothing awarded
     them, nothing could spend them, and the figure existed only for as long
     as the page was open. They are a real balance now, earned server-side
     from progress the server has accepted, spendable, and backed by a ledger
    , so the number comes from /api/coins instead of a formula. XP and level
     are still derived; they are a view of the same activity, not a currency. */
  function deriveStats(p) {
    /* dayStreak is the real consecutive-day count the dashboard shows; the
       stored `streak` is an old client-side counter, kept only as a fallback. */
    var streak = (p && (p.dayStreak != null ? p.dayStreak : p.streak)) || 0;
    var minutes = (p && p.minutes) || 0;
    var badges = (p && p.badges && p.badges.length) || 0;
    var xp = Math.round(minutes * 4 + streak * 30 + badges * 150);
    var level = Math.floor(xp / 500) + 1;
    var xpIntoLevel = xp - (level - 1) * 500;
    /* The balance rides along on the progress payload; /api/coins is the
       fuller view (balance + history) for a screen that wants to show it. */
    var coins = (p && typeof p.coins === 'number') ? p.coins : 0;
    return { streak: streak, xp: xp, level: level, xpIntoLevel: xpIntoLevel, xpForLevel: 500, coins: coins };
  }

  var G = 'rgba(255,255,255,.08)';      // glass fill
  var GB = 'rgba(255,255,255,.15)';     // glass border

  var CSS =
  /* ================= GLASS: every surface ================= */
  '.pcard,.vcard,.card,.feature-card,.feat-card,.qcard,.optcard,.subjcard,.cont-card,.chrow,' +
  '.tablecard,.blurbox,.attcard,.howcard,.rescard,.notes__card,.auth-panel,dialog,.modal{' +
    'background:' + G + '!important;' +
    'backdrop-filter:blur(22px) saturate(1.4);-webkit-backdrop-filter:blur(22px) saturate(1.4);' +
    'border:1px solid ' + GB + '!important;border-radius:22px!important;' +
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 18px 46px rgba(0,0,0,.5)!important;' +
    'transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s ease,' +
      'background .45s ease,border-color .45s ease!important;}' +
  /* .auth-panel rides along in the card rule above for the glass fill, but it
     is not a card, it is the full-height right-hand column of the auth pages.
     Rounding it leaves a floating rounded rectangle whose corners are clipped
     off at the viewport edge, so keep the glass and drop the radius. */
  '.auth-panel{border-radius:0!important;box-shadow:none!important;}' +
  /* the light rake across the top of every card, glass, not flat fill */
  '.pcard::before,.vcard::before,.card::before,.feature-card::before,.feat-card::before,' +
  '.qcard::before,.optcard::before,.subjcard::before,.cont-card::before{' +
    'content:"";position:absolute;inset:0 0 auto;height:38%;pointer-events:none;border-radius:22px 22px 0 0;' +
    'background:linear-gradient(180deg,rgba(255,255,255,.10),transparent);}' +
  '.pcard,.vcard,.card,.feature-card,.feat-card,.qcard,.optcard,.subjcard,.cont-card{position:relative;}' +
  '.pcard:hover,.vcard:hover,.card:hover,.feature-card:hover,.feat-card:hover,.qcard:hover,' +
  '.optcard:hover,.subjcard:hover,.cont-card:hover,.chrow:hover{' +
    'transform:translateY(-6px)!important;background:rgba(255,255,255,.12)!important;' +
    'border-color:rgba(255,122,0,.5)!important;' +
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 26px 60px rgba(0,0,0,.6),' +
      '0 0 40px rgba(255,122,0,.22)!important;}' +

  /* nav / strips / tables */
  '.topstrip,.pagehead,.hero-strip,thead,.tablecard thead{' +
    'background:rgba(255,255,255,.05)!important;backdrop-filter:blur(16px);' +
    '-webkit-backdrop-filter:blur(16px);border-radius:18px;}' +

  /* inputs: frosted, orange focus glow */
  'input,select,textarea{background:rgba(255,255,255,.06)!important;color:#fff!important;' +
    'border:1px solid ' + GB + '!important;border-radius:14px!important;' +
    'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);' +
    'transition:border-color .3s ease,box-shadow .3s ease,background .3s ease!important;}' +
  'input:focus,select:focus,textarea:focus{outline:none!important;' +
    'border-color:rgba(255,122,0,.7)!important;background:rgba(255,255,255,.09)!important;' +
    'box-shadow:0 0 0 4px rgba(255,122,0,.16),0 0 26px rgba(255,122,0,.28)!important;}' +

  /* buttons: soft-depth pills, orange primary, ripple on press.

     `.cta` is deliberately NOT in this list. On the homepage it names the
     flex row that HOLDS the buttons, not a button, so the row was given a
     999px radius and, because hovering a child hovers its parent, hovering
     either button lit the whole strip up as one giant glowing pill behind
     them. Only elements that are themselves clickable belong here, so a
     .cta that really is a button still qualifies as a.cta / button.cta. */
  '.btn-primary,.btn,a.cta,button.cta,.btn-cta,button.primary,a.btn{position:relative;overflow:hidden;' +
    'border-radius:999px!important;font-weight:700!important;' +
    'transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease,filter .3s ease!important;}' +
  '.btn-primary,.btn-cta,button.primary{' +
    'background:linear-gradient(120deg,#FF7A00,#FFA726)!important;color:#0A0A0A!important;' +
    'border:0!important;box-shadow:0 10px 30px rgba(255,122,0,.4),inset 0 1px 0 rgba(255,255,255,.4)!important;}' +
  '.btn-primary:hover,.btn:hover,a.cta:hover,button.cta:hover,a.btn:hover,button.primary:hover{' +
    'transform:translateY(-3px)!important;filter:brightness(1.06);' +
    'box-shadow:0 16px 42px rgba(255,122,0,.55)!important;}' +
  '.btn-primary:active,.btn:active,a.btn:active{transform:translateY(-1px) scale(.98)!important;}' +
  /* Sized and clipped in JS; kept dim and modest on purpose, at .5 white and
     2.6x it read as a flashbulb rather than a touch response. */
  '.kid-ripple{position:absolute;border-radius:50%;transform:scale(0);pointer-events:none;' +
    'background:rgba(255,255,255,.3);animation:kid-rip .6s ease-out forwards;}' +
  '@keyframes kid-rip{to{transform:scale(1.8);opacity:0}}' +

  /* scrollbar / selection / focus ring */
  '::-webkit-scrollbar{width:11px;height:11px;}' +
  '::-webkit-scrollbar-track{background:rgba(255,255,255,.04);}' +
  '::-webkit-scrollbar-thumb{border-radius:99px;border:3px solid transparent;background-clip:content-box;' +
    'background-image:linear-gradient(180deg,#FF7A00,#FFB347);}' +
  '::selection{background:rgba(255,122,0,.45);color:#fff;}' +
  'a:focus-visible,button:focus-visible,input:focus-visible{' +
    'outline:2px solid #FFA726!important;outline-offset:3px!important;border-radius:12px;}' +

  /* scroll reveal */
  '.kid-rv{opacity:1;transform:translateY(14px);' +
    'transition:transform .45s cubic-bezier(.22,1,.36,1);}' +
  '.kid-rv.in{transform:none;}' +

  /* ================= THE RAIL ================= */
  'html.kid-rail-on{--kid-rail:' + RAIL + 'px;}' +
  'html.kid-rail-on body{padding-left:var(--kid-rail)!important;padding-top:62px!important;}' +
  'html.kid-rail-on nav.nav{display:none!important;}' +

  '#kid-rail{position:fixed;left:0;top:0;bottom:0;width:var(--kid-rail);z-index:9000;' +
    'display:flex;flex-direction:column;gap:4px;padding:20px 14px 16px;overflow-y:auto;overflow-x:hidden;' +
    'background:rgba(10,10,10,.62);backdrop-filter:blur(28px) saturate(1.5);' +
    '-webkit-backdrop-filter:blur(28px) saturate(1.5);' +
    'border-right:1px solid ' + GB + ';' +
    'box-shadow:inset -1px 0 0 rgba(255,255,255,.06),8px 0 40px rgba(0,0,0,.5);' +
    'font-family:"Nunito",system-ui,sans-serif;}' +
  '#kid-rail::-webkit-scrollbar{width:0;}' +
  '#kid-rail::after{content:"";position:absolute;top:0;right:0;bottom:0;width:1px;' +
    'background:linear-gradient(180deg,transparent,rgba(255,122,0,.7),transparent);' +
    'background-size:100% 260%;animation:kr-edge 11s linear infinite;}' +
  '@keyframes kr-edge{0%{background-position:0 -160%}100%{background-position:0 160%}}' +

  '#kid-rail .brand{display:flex;align-items:center;gap:11px;padding:4px 10px 16px;flex-shrink:0;}' +
  '#kid-rail .brand__mark{width:32px!important;height:32px!important;animation:kr-tw 8s ease-in-out infinite;}' +
  '@keyframes kr-tw{0%,88%,100%{transform:rotate(0)}94%{transform:rotate(16deg) scale(1.12)}}' +
  '#kid-rail .brand__word{font-size:21px!important;color:#fff!important;letter-spacing:-.02em;}' +

  /* identity card */
  '#kid-hello{display:flex;align-items:center;gap:11px;margin:0 2px 16px;padding:12px;border-radius:18px;flex-shrink:0;' +
    'background:' + G + ';border:1px solid ' + GB + ';' +
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}' +
  '#kid-hello .av{width:40px;height:40px;border-radius:13px;flex-shrink:0;display:grid;place-items:center;' +
    'font-weight:800;font-size:16px;color:#0A0A0A;background:linear-gradient(135deg,#FF7A00,#FFB347);' +
    'box-shadow:0 6px 18px rgba(255,122,0,.4);}' +
  '#kid-hello b{display:block;font-size:14px;color:#fff;line-height:1.2;}' +
  '#kid-hello span{font-size:11px;font-weight:700;color:rgba(255,255,255,.6);}' +
  '#kid-hello .streak{margin-left:auto;font-size:12px;font-weight:800;color:#FFB347;' +
    'background:rgba(255,122,0,.14);border:1px solid rgba(255,122,0,.3);' +
    'padding:5px 9px;border-radius:99px;white-space:nowrap;}' +

  '.kid-lab{font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;' +
    'color:rgba(255,255,255,.45);padding:10px 12px 6px;flex-shrink:0;}' +

  /* nav links */
  '#kid-rail .nav__links{display:flex!important;flex-direction:column!important;gap:4px!important;margin:0!important;flex-shrink:0;}' +
  '#kid-rail .nav__link{position:relative;display:flex!important;align-items:center;gap:12px;' +
    'justify-content:flex-start!important;text-align:left!important;width:100%!important;' +
    'padding:11px 13px!important;border-radius:14px!important;' +
    'font-size:14.5px!important;font-weight:700!important;color:rgba(255,255,255,.8)!important;' +
    'text-decoration:none!important;white-space:nowrap;' +
    'transition:background .3s ease,color .3s ease,transform .3s cubic-bezier(.22,1,.36,1)!important;}' +
  '#kid-rail .nav__link .ki{width:30px;height:30px;border-radius:10px;flex-shrink:0;' +
    'display:grid;place-items:center;background:rgba(255,255,255,.07);' +
    'box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);' +
    'transition:transform .35s cubic-bezier(.34,1.56,.64,1),background .3s ease;}' +
  '#kid-rail .nav__link .ki svg{width:17px;height:17px;display:block;}' +
  '#kid-rail .nav__link:hover{background:rgba(255,255,255,.07);color:#fff!important;transform:translateX(4px);}' +
  '#kid-rail .nav__link:hover .ki{transform:scale(1.14) rotate(-6deg);background:rgba(255,122,0,.22);}' +
  '#kid-rail .nav__link.is-current{color:#0A0A0A!important;' +
    'background:linear-gradient(115deg,#FF7A00,#FFA726)!important;' +
    'box-shadow:0 10px 26px rgba(255,122,0,.42),inset 0 1px 0 rgba(255,255,255,.4);}' +
  '#kid-rail .nav__link.is-current .ki{background:rgba(0,0,0,.16);box-shadow:none;}' +
  '#kid-rail .nav__link.is-current::before{content:"";position:absolute;left:-14px;top:50%;' +
    'transform:translateY(-50%);width:3px;height:22px;border-radius:0 3px 3px 0;' +
    'background:#FFB347;box-shadow:0 0 14px #FF7A00;}' +
  '.knew{margin-left:auto;font-size:9px;font-weight:900;letter-spacing:.08em;padding:3px 7px;' +
    'border-radius:99px;background:linear-gradient(100deg,#FF7A00,#FFB347);color:#0A0A0A;' +
    'animation:kr-pop 2.6s ease-in-out infinite;}' +
  '@keyframes kr-pop{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}' +

  /* XP card */
  '#kid-xp{margin:16px 2px 0;padding:14px;border-radius:18px;flex-shrink:0;' +
    'background:' + G + ';border:1px solid ' + GB + ';}' +
  '#kid-xp .top{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:9px;}' +
  '#kid-xp .top b{font-size:15px;color:#fff;}' +
  '#kid-xp .top span{font-size:10.5px;font-weight:800;color:rgba(255,255,255,.6);}' +
  '#kid-xp .tr{height:9px;border-radius:99px;background:rgba(0,0,0,.5);overflow:hidden;' +
    'box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);}' +
  '#kid-xp .tr i{display:block;height:100%;border-radius:99px;width:68%;' +
    'background:linear-gradient(90deg,#FF7A00,#FFB347,#FF7A00);background-size:200% 100%;' +
    'box-shadow:0 0 18px rgba(255,122,0,.55);animation:kr-sh 3.4s linear infinite;}' +
  '@keyframes kr-sh{to{background-position:200% 0}}' +
  '#kid-xp p{margin:9px 0 0;font-size:11.5px;font-weight:600;color:rgba(255,255,255,.6);line-height:1.45;}' +

  '#kid-rail .nav__right{margin-top:auto;display:flex!important;flex-direction:row!important;' +
    'justify-content:center;gap:8px!important;padding-top:14px;flex-shrink:0;' +
    'border-top:1px solid rgba(255,255,255,.1);}' +
  '#kid-rail .acct-fab{position:static!important;top:auto!important;right:auto!important;' +
    'display:flex!important;justify-content:center;gap:8px!important;flex-shrink:0;padding-top:10px;}' +
  '#kid-rail{padding-bottom:104px!important;}' +

  /* ================= TOP HUD ================= */
  '#kid-top{position:fixed;left:var(--kid-rail);right:0;top:0;height:62px;z-index:8900;' +
    'display:flex;align-items:center;gap:14px;padding:0 24px;' +
    'background:rgba(10,10,10,.55);backdrop-filter:blur(24px) saturate(1.4);' +
    '-webkit-backdrop-filter:blur(24px) saturate(1.4);' +
    'border-bottom:1px solid ' + GB + ';font-family:"Nunito",system-ui,sans-serif;}' +
  '#kid-top .kt-ttl{font-weight:800;font-size:17px;color:#fff!important;display:flex;align-items:center;gap:10px;}' +
  '#kid-top .kt-ttl .dot{width:8px;height:8px;border-radius:50%;background:#FF7A00;' +
    'box-shadow:0 0 12px #FF7A00;flex-shrink:0;animation:kr-pop 2.2s ease-in-out infinite;}' +
  '#kid-top .spacer{flex:1;}' +
  '#kid-back{display:inline-flex;align-items:center;gap:6px;flex:none;height:38px;padding:0 15px 0 11px;' +
    'margin-right:14px;border-radius:99px;border:1px solid rgba(255,255,255,.24)!important;cursor:pointer;' +
    'background:rgba(255,255,255,.09)!important;color:#FFFFFF!important;-webkit-text-fill-color:#FFFFFF!important;' +
    'font-family:inherit;font-size:14px;font-weight:800;transition:border-color .15s ease,background .15s ease;}' +
  '#kid-back:hover{border-color:#FFB347!important;background:rgba(255,179,71,.2)!important;}' +
  '#kid-back:focus-visible{outline:3px solid #FFB347;outline-offset:2px;}' +
  '#kid-back svg{display:block;}' +
  '#kid-top .hchip{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;border-radius:99px;' +
    'font-size:12.5px;font-weight:800;color:#fff;background:' + G + ';border:1px solid ' + GB + ';' +
    'white-space:nowrap;transition:transform .3s ease,border-color .3s ease;}' +
  '#kid-top .hchip:hover{transform:translateY(-2px);border-color:rgba(255,122,0,.5);}' +
  '@media(max-width:900px){#kid-top .hchip.b,#kid-top .hchip.c{display:none;}}' +

  /* ================= PAL MASCOT ================= */
  /* QA S-27: fixed at left:14px;bottom:14px, this sat directly on top of the
     rail's own bottom-left icons (settings/logout), same corner, same
     stack. It had no dismiss control either, so a visitor who found it in
     the way had no way to make it stop. Moved clear of the rail entirely,
     given a close button, and made to stay closed once closed. */
  '#pal-mascot{position:fixed;right:22px;bottom:150px;z-index:9050;' +
    'display:flex;flex-direction:row-reverse;align-items:flex-end;gap:12px;' +
    'font-family:"Nunito",system-ui,sans-serif;}' +
  '#pal-orb{position:relative;width:56px;height:56px;border-radius:50%;border:0;cursor:pointer;padding:0;' +
    'background:radial-gradient(circle at 34% 28%,#FFD08A,#FF7A00 58%,#C24E00);' +
    'box-shadow:0 0 0 5px rgba(255,122,0,.16),0 14px 34px rgba(255,122,0,.45);' +
    'animation:pal-bob 4.6s ease-in-out infinite;}' +
  '#pal-orb:hover{animation-play-state:paused;transform:scale(1.07);}' +
  '#pal-orb svg{position:absolute;inset:0;width:100%;height:100%;}' +
  '#pal-orb .eye{transform-origin:center;animation:pal-blink 5.4s ease-in-out infinite;}' +
  '@keyframes pal-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}' +
  '@keyframes pal-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}' +
  '#pal-say{position:relative;max-width:250px;padding:13px 34px 13px 16px;' +
    'border-radius:18px 18px 5px 18px;' +
    'background:rgba(18,18,18,.92);border:1px solid ' + GB + ';' +
    'backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);' +
    'box-shadow:0 18px 44px rgba(0,0,0,.6);font-size:13.5px;line-height:1.5;color:#fff;' +
    'opacity:0;transform:translateY(8px) scale(.96);pointer-events:none;' +
    'transition:opacity .4s cubic-bezier(.22,1,.36,1),transform .4s cubic-bezier(.22,1,.36,1);}' +
  '#pal-say.on{opacity:1;transform:none;pointer-events:auto;}' +
  '#pal-say b{display:block;font-size:11.5px;color:#FFB347;letter-spacing:.06em;margin-bottom:3px;}' +
  '#pal-close{position:absolute;top:8px;right:8px;width:20px;height:20px;border:0;border-radius:50%;' +
    'display:grid;place-items:center;cursor:pointer;background:rgba(255,255,255,.1);' +
    'color:rgba(255,255,255,.7);font-size:13px;line-height:1;}' +
  '#pal-close:hover{background:rgba(255,255,255,.18);color:#fff;}' +
  'html.pal-off #pal-mascot{display:none!important;}' +

  /* Laptop / small-desktop: the rail keeps its place but drops to icons only.
     .knew and the streak pill are `margin-left:auto` items, so in a 76px
     centred link they were pushed straight out of the rail and cut off - 15
     pages showed a sliced "NEW". They have no room here; the drawer below
     shows them in full. */
  '@media(max-width:980px){html.kid-rail-on{--kid-rail:76px;}' +
    '#kid-rail .nav__link span.lbl,#kid-hello>div,#kid-xp,.kid-lab,#kid-rail .brand__word{display:none;}' +
    '#kid-rail .nav__link{justify-content:center;}#pal-say{display:none;}' +
    '.knew,#kid-streak{display:none!important;}}' +

  /* ================= PHONE / TABLET: RAIL BECOMES A DRAWER =================
     Below 900px (vivid.css's own breakpoint) a permanent rail is not
     affordable: at 320px it took 76px, a quarter of the screen, off every
     page, and the layout it left behind is what clipped the search field, the
     subject tabs and the chapter rows.

     So the rail goes off-canvas and the page gets the full width back. It
     opens as a real drawer: full labels (there is room now), a scrim, and the
     page behind it locked. The burger lives in the HUD, which is the only
     chrome that stays on screen. */
  '@media(max-width:900px){' +
    'html.kid-rail-on{--kid-rail:0px;}' +
    'html.kid-rail-on body{padding-left:0!important;padding-top:56px!important;}' +

    /* off-canvas by default; slides in over the page rather than pushing it */
    '#kid-rail{width:min(86vw,320px);max-width:320px;' +
      'transform:translateX(-101%);transition:transform .28s cubic-bezier(.22,1,.36,1);' +
      'padding-left:max(14px,env(safe-area-inset-left));' +
      'padding-bottom:max(104px,calc(88px + env(safe-area-inset-bottom)))!important;' +
      'will-change:transform;}' +
    'html.kid-nav-open #kid-rail{transform:none;}' +

    /* it is a full drawer here, so undo the icons-only collapse above */
    '#kid-rail .nav__link span.lbl,#kid-hello>div,.kid-lab,#kid-rail .brand__word{display:revert;}' +
    '#kid-rail .nav__link{justify-content:flex-start!important;}' +
    '.knew,#kid-streak{display:revert!important;}' +
    /* 44px minimum touch target, and never a hover-shift on a touch screen */
    '#kid-rail .nav__link{min-height:48px;padding:12px 14px!important;}' +
    '#kid-rail .nav__link:hover{transform:none;}' +
    '#kid-hello{min-width:0;}' +
    '#kid-hello b,#kid-hello span{overflow-wrap:anywhere;}' +
    /* 10px and 9px are desktop-rail sizes. In the drawer there is room, and
       both sit under the 12px floor for supporting text on a phone. */
    '.kid-lab{font-size:12px;}' +
    '.knew{font-size:12px;padding:3px 8px;}' +
    '#kid-hello span{font-size:12px;}' +
    '#kid-hello .streak{font-size:13px;}' +

    /* the scrim: closes on tap, and hides the decorative FABs behind it */
    '#kid-scrim{position:fixed;inset:0;z-index:8950;border:0;padding:0;margin:0;' +
      'background:rgba(0,0,0,.58);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);' +
      'opacity:0;pointer-events:none;transition:opacity .28s ease;}' +
    'html.kid-nav-open #kid-scrim{opacity:1;pointer-events:auto;}' +
    'html.kid-nav-open #pal-mascot,html.kid-nav-open #efp-btn{display:none!important;}' +
    /* the drawer must be above its own scrim */
    '#kid-rail{z-index:9000;}' +

    /* HUD: full width now, and it has to hold the burger */
    '#kid-top{left:0;height:56px;padding:0 10px;padding-left:max(10px,env(safe-area-inset-left));' +
      'padding-right:max(10px,env(safe-area-inset-right));gap:8px;}' +
    '#kid-top .kt-ttl{font-size:15px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}' +
    '#kid-burger{flex-shrink:0;width:44px;height:44px;margin-left:-6px;border:0;padding:0;' +
      'display:grid;place-items:center;border-radius:13px;cursor:pointer;' +
      'background:' + G + ';border:1px solid ' + GB + ';color:#fff;}' +
    '#kid-burger:active{transform:scale(.94);}' +
    '#kid-burger i{position:relative;display:block;width:17px;height:2px;border-radius:2px;background:currentColor;' +
      'box-shadow:0 -6px 0 currentColor,0 6px 0 currentColor;transition:box-shadow .2s ease,transform .2s ease;}' +
    'html.kid-nav-open #kid-burger i{box-shadow:none;transform:rotate(45deg);}' +
    'html.kid-nav-open #kid-burger i::after{content:"";position:absolute;width:17px;height:2px;' +
      'border-radius:2px;background:currentColor;transform:rotate(-90deg);}' +

    /* the mascot and the feature button both parked bottom-right, on top of
       each other and on top of the page's own last card */
    '#pal-mascot{right:12px;bottom:calc(88px + env(safe-area-inset-bottom));}' +
    '#pal-orb{width:48px;height:48px;}' +

    /* Nothing may end up underneath the floating furniture.
       The mascot, the Features button and the PDF button stack in the
       bottom-right corner and are fixed, so the last thing on a page sits
       under them, the audit caught the question-remove button on create-test
       and the language select on the tutor call buried 47-59% each. Reserving
       the height they occupy is what puts the page's own last control back
       within reach. */
    'html.kid-rail-on body{padding-bottom:calc(104px + env(safe-area-inset-bottom))!important;}' +
    /* and the sticky HUD must not land on whatever an in-page link jumps to */
    'html.kid-rail-on{scroll-padding-top:68px;}' +
  '}' +

  /* Narrow phones: the HUD chips are the first thing to go, the same numbers
     are in the drawer, and a half-cut streak pill reads as breakage. */
  '@media(max-width:600px){#kid-top .hchip{display:none!important;}' +
    '#kid-top .kt-ttl{font-size:14.5px;}}' +

  '@media(prefers-reduced-motion:reduce){#pal-orb,.knew,#kid-xp .tr i,#kid-rail::after{animation:none!important}' +
    '#kid-rail{transition:none!important;}#kid-scrim{transition:none!important;}' +
    '.kid-rv{opacity:1;transform:none;}}';

  /* ---------------------------------------------------------
     rail icons, keyed by destination, the i18n layer rewrites
     link TEXT in place, so keying on href survives translation
     --------------------------------------------------------- */
  var NAV_ICON = {
    'learn': 'book', 'lesson': 'book', 'live': 'users', 'challenge': 'trophy',
    'mocktest': 'target', 'take-test': 'target', 'pal': 'chat', 'tutor': 'mic',
    'videos': 'rocket', 'dashboard': 'graph', 'upload': 'code',
    'create-test': 'wand', 'admin': 'shield', 'index': 'spark'
  };

  function iconFor(href) {
    var f = (href || '').split('/').pop().split('#')[0].split('?')[0].replace(/\.html$/, '');
    return NAV_ICON[f] || 'spark';
  }

  var FACE =
    '<svg viewBox="0 0 56 56" fill="none">' +
      '<ellipse class="eye" cx="21" cy="25" rx="4" ry="4.8" fill="#fff"/>' +
      '<ellipse class="eye" cx="35" cy="25" rx="4" ry="4.8" fill="#fff"/>' +
      '<circle cx="22" cy="26" r="1.9" fill="#1A0E00"/><circle cx="36" cy="26" r="1.9" fill="#1A0E00"/>' +
      '<path d="M21 35c2.4 3 11.2 3 14 0" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>' +
    '</svg>';


  /* React serves everything from one document. Two things follow:

     COPY, DON'T MOVE. On the static site the nav's children are moved into
     the rail so their listeners survive. Under React that is sabotage: the
     framework still owns those nodes, and its next reconcile of a navbar
     whose children have been spirited away throws NotFoundError mid-render.
     So inside the SPA the rail is built from clones and the original nav is
     simply hidden by the rail CSS - React keeps a tree it fully owns, and
     link clicks still work because the app translates them at the document
     level, not per node.

     REBUILD PER ROUTE. There is no fresh page load to re-run us, so the
     rail is torn down and rebuilt when the route changes, that is also
     what keeps is-current and the top bar's title honest. */
  var SPA = !!document.getElementById('root');
  var builtFor = '';

  function take(el) {
    if (!el) return null;
    return SPA ? el.cloneNode(true) : el;
  }

  /* Pages with no rail entry of their own light up the section they belong
     to (same map as Navbar.tsx's CURRENT_NAV), so the rail and the top bar
     title always say where the student is. */
  var NAV_PARENT = {
    lesson: 'learn', videos: 'learn', 'take-test': 'mocktest', 'create-test': 'mocktest',
    upload: 'dashboard', admin: 'dashboard', bank: 'learn', homework: 'learn',
    'homework-assign': 'dashboard'
  };

  function markCurrent(links) {
    if (!SPA || !links) return;
    var here = pageKey();
    if (!links.querySelector('a[href="/' + here + '"],a[href="' + here + '.html"]')) here = NAV_PARENT[here] || here;
    Array.prototype.forEach.call(links.querySelectorAll('a'), function (a) {
      var href = (a.getAttribute('href') || '')
        .replace(/^\//, '').replace(/\.html$/, '').split('?')[0] || 'index';
      a.classList.toggle('is-current', href === here);
    });
  }

  /* ---------- the way in ----------
     "Start free" describes the price; a student is choosing to learn, not to
     buy. The label says that, and the button is weighted so the eye lands on
     it before anything else on the page. */
  var CTA_CSS =
  'html.kid-dark .btn-primary,html.kid-dark .btn-cta,html.kid-dark button.primary,' +
  'html.kid-dark .nav-cta,html.kid-dark .cta-primary,html.kid-dark form button[type=submit]{' +
    'font-weight:900!important;letter-spacing:.01em!important;font-size:15.5px!important;' +
    'background:linear-gradient(120deg,#FFC400,#FFDD3C)!important;' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;' +
    'box-shadow:0 0 0 1px rgba(255,214,60,.5),0 14px 34px rgba(255,200,0,.44),' +
      'inset 0 1px 0 rgba(255,255,255,.45)!important;}' +
  'html.kid-dark .btn-primary:hover,html.kid-dark .nav-cta:hover,' +
  'html.kid-dark form button[type=submit]:hover{' +
    'transform:translateY(-2px);box-shadow:0 20px 46px rgba(255,122,0,.58)!important;}';

  var CTA_WORDS = [
    [/\bStart free\b/g, 'Start learning'],
    [/\bStart Free\b/g, 'Start Learning'],
    [/\bstart free\b/g, 'start learning']
  ];

  function ctaPass() {
    if (!document.getElementById('kid-cta-css')) {
      var st = document.createElement('style');
      st.id = 'kid-cta-css';
      st.textContent = CTA_CSS;
      document.head.appendChild(st);
    }
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || p.nodeName === 'SCRIPT' || p.nodeName === 'STYLE') return NodeFilter.FILTER_REJECT;
        return /start free/i.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var hits = [], n;
    while ((n = w.nextNode())) hits.push(n);
    hits.forEach(function (t) {
      var v = t.nodeValue;
      for (var i = 0; i < CTA_WORDS.length; i++) v = v.replace(CTA_WORDS[i][0], CTA_WORDS[i][1]);
      if (v !== t.nodeValue) t.nodeValue = v;
    });
  }

  function build() {
    if (document.getElementById('kid-ui-css')) return;
    var style = document.createElement('style');
    style.id = 'kid-ui-css';
    style.textContent = CSS;
    document.head.appendChild(style);

    buildRail();
    buildTop();
    wireMotion();
    ctaPass();
    /* kid-home swaps the homepage body in after us, relabel what it built */
    setTimeout(ctaPass, 300);
    setTimeout(ctaPass, 1200);
  }

  function buildRail() {
    if (NO_RAIL.indexOf(pageKey()) !== -1) return;
    var nav = document.querySelector('nav.nav');
    if (!nav || document.getElementById('kid-rail')) return;

    var rail = document.createElement('aside');
    rail.id = 'kid-rail';

    var brand = take(nav.querySelector('.brand'));
    if (brand) rail.appendChild(brand);                    // MOVE (static) / copy (SPA)

    var u = readUser() || {};
    /* First name, but not a title: "Mr. Verma" is "Mr. Verma", not "Mr." */
    var parts = (u.name || 'Student').trim().split(/\s+/);
    var name = /^(mr|mrs|ms|miss|dr|prof|sir|smt|shri)\.?$/i.test(parts[0]) && parts[1]
      ? parts[0] + ' ' + parts[1] : parts[0];
    var isStudent = role() === 'student';
    /* The backend's own field is className: "Class 6", already the whole
       label, not a bare number. Prefixing "Class " onto it a second time is
       how "Class Class 6" happens; a bare u.class (if a page ever sets one)
       still needs the prefix. Strip either shape down to the digits and
       rebuild the label once, so it can never double up. */
    var classNum = String(u.class || u.className || '6').replace(/\D+/g, '') || '6';
    /* "Class 6 · CBSE" was printed under every account regardless of role ,
       a teacher and a parent do not have a class. Say what they actually
       are instead of guessing a student's class for them. */
    var sub = isStudent ? 'Class ' + classNum + ' · CBSE'
      : role() === 'teacher' ? 'Teacher'
      : role() === 'parent' ? 'Parent'
      : '';
    var hello = document.createElement('div');
    hello.id = 'kid-hello';
    hello.innerHTML =
      '<span class="av">' + name.charAt(0).toUpperCase() + '</span>' +
      '<div><b>' + name + '</b><span>' + sub + '</span></div>' +
      (isStudent ? '<span class="streak" id="kid-streak">🔥 -</span>' : '');
    rail.appendChild(hello);

    var lab = document.createElement('span');
    lab.className = 'kid-lab';
    lab.textContent = 'My space';
    rail.appendChild(lab);

    var links = take(nav.querySelector('.nav__links'));
    if (links) {
      rail.appendChild(links);                             // MOVE (static) / copy (SPA)
      markCurrent(links);
      Array.prototype.forEach.call(links.querySelectorAll('a'), function (a) {
        if (a.querySelector('.ki')) return;
        var glyph = (window.KidTheme && window.KidTheme.ICON[iconFor(a.getAttribute('href'))]) || '';
        var ic = document.createElement('i');
        ic.className = 'ki';
        ic.innerHTML = glyph;
        ic.style.color = '#FFB347';
        a.insertBefore(ic, a.firstChild);
      });

      /* tutor.html shipped after some pages' navs were written, every
         student gets the entry regardless of which nav they landed on */
      if (role() === 'student' && !links.querySelector('a[href*="tutor"]')) {
        var t = document.createElement('a');
        t.className = 'nav__link';
        t.href = 'tutor.html';
        t.innerHTML = '<i class="ki" style="color:#FFB347">' +
          ((window.KidTheme && window.KidTheme.ICON.mic) || '') + '</i>AI Tutor<span class="knew">NEW</span>';
        var palLink = links.querySelector('a[href*="pal"]');
        if (palLink && palLink.nextSibling) links.insertBefore(t, palLink.nextSibling);
        else links.appendChild(t);
      }
      if (pageKey() === 'tutor') {
        var cur = links.querySelector('a[href*="tutor"]');
        if (cur) cur.classList.add('is-current');
      }

      /* PDF Maker has no page of its own, it is a panel. It still belongs in
         the rail, because a feature a student cannot find is a feature that
         does not exist, and the tutor page was the one place they had no
         reason to look for it. */
      /* Homework assignment had no way in: it was not on any teacher screen. */
      if (role() === 'teacher' && !links.querySelector('a[href*="homework-assign"]')) {
        var hw = document.createElement('a');
        hw.className = 'nav__link';
        hw.href = 'homework-assign.html';
        hw.innerHTML = '<i class="ki" style="color:#FFB347">' +
          ((window.KidTheme && window.KidTheme.ICON.book) || '') + '</i>Homework';
        links.appendChild(hw);
      }
      if (role() === 'student' && !links.querySelector('.kid-pdf-link')) {
        var pdf = document.createElement('a');
        pdf.className = 'nav__link kid-pdf-link';
        pdf.href = '#';
        pdf.innerHTML = '<i class="ki" style="color:#FFB347">' +
          ((window.KidTheme && window.KidTheme.ICON.book) || '') + '</i>PDF Maker';
        pdf.addEventListener('click', function (e) {
          e.preventDefault();
          if (window.KidPDF) window.KidPDF.open();
        });
        var after = links.querySelector('a[href*="tutor"]');
        if (after && after.nextSibling) links.insertBefore(pdf, after.nextSibling);
        else links.appendChild(pdf);
      }
    }

    /* the level-up nudge only makes sense for the person doing the levelling */
    if (role() === 'student') {
      var xp = document.createElement('div');
      xp.id = 'kid-xp';
      xp.innerHTML =
        '<div class="top"><b>Level -</b><span>- / 500 XP</span></div>' +
        '<div class="tr"><i style="width:0"></i></div>' +
        '<p>Keep learning to level up 🏅</p>';
      rail.appendChild(xp);
    }

    var right = take(nav.querySelector('.nav__right'));
    if (right) rail.appendChild(right);                    // MOVE (static) / copy (SPA)

    document.body.appendChild(rail);
    document.documentElement.classList.add('kid-rail-on');
    builtFor = pageKey();

    /* account-menu.js pins its settings/logout cluster to the viewport's
       top-right and builds it after we run, adopt it once it exists */
    function adopt() {
      var fab = document.querySelector('.acct-fab');
      if (fab && fab.parentElement !== rail) rail.appendChild(fab);
    }
    adopt(); setTimeout(adopt, 400); setTimeout(adopt, 1400);
  }

  /* Back returns to the screen the person came from. When this tab has no
     earlier screen (a shared link, a reload), it goes to where the page
     belongs: Learn for a chapter's Video, Notes, Quiz, Question Bank and
     Homework, the dashboard for everything else. */
  function goBack() {
    var st = window.history.state;
    if (st && typeof st.idx === 'number' && st.idx > 0) { window.history.back(); return; }
    var q = new URLSearchParams(location.search);
    var key = pageKey();
    var to = 'dashboard.html';
    if (key === 'lesson' || q.get('ch') || q.get('chapter') || NAV_PARENT[key] === 'learn') {
      to = 'learn.html' + (q.get('class') && q.get('subject')
        ? '?class=' + encodeURIComponent(q.get('class')) + '&subject=' + encodeURIComponent(q.get('subject'))
        : '');
    }
    var a = document.createElement('a');
    a.href = to;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function buildTop() {
    if (document.getElementById('kid-top') ||
        !document.documentElement.classList.contains('kid-rail-on')) return;
    var cur = document.querySelector('#kid-rail .nav__link.is-current');
    var title = 'BestBrain';
    if (cur) {
      var c = cur.cloneNode(true);
      Array.prototype.forEach.call(c.querySelectorAll('.ki,.knew'), function (n) { n.remove(); });
      title = c.textContent.trim() || title;
    }
    var bar = document.createElement('div');
    bar.id = 'kid-top';
    bar.innerHTML =
      '<span class="kt-ttl"><span class="dot"></span></span><span class="spacer"></span>' +
      (role() === 'student'
        ? '<span class="hchip a" id="kid-hud-streak">🔥, day streak</span>' +
          '<span class="hchip b" id="kid-hud-coins">⭐, coins</span>' +
          '<span class="hchip c" id="kid-hud-level">🚀 Level -</span>'
        : '');
    bar.querySelector('.kt-ttl').appendChild(document.createTextNode(title));
    /* A way back on every screen except the home one. */
    if (pageKey() !== 'dashboard') {
      var back = document.createElement('button');
      back.type = 'button';
      back.id = 'kid-back';
      back.setAttribute('aria-label', 'Go back to the previous page');
      back.innerHTML =
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>' +
        '<span>Back</span>';
      back.addEventListener('click', goBack);
      bar.insertBefore(back, bar.firstChild);
    }
    document.body.appendChild(bar);
    buildDrawer(bar);
    paintProgress();
  }

  /* ---------------------------------------------------------------
     The rail's mobile form.

     Under 900px the rail is off-canvas (see the stylesheet above), so
     without this there is no way to reach navigation at all on a phone ,
     the skin hides nav.nav outright, which also takes React's own drawer
     with it. The burger and scrim are built here so both the static pages
     and the SPA get the same one.

     Everything below is the behaviour a drawer is expected to have and is
     wrong without: it closes on route change, on outside tap, and on
     Escape; the page behind it does not scroll; and focus cannot wander
     out of it while it is covering the page.
     --------------------------------------------------------------- */
  var scrollLock = '';

  function navOpen() {
    return document.documentElement.classList.contains('kid-nav-open');
  }

  function setNav(open) {
    var html = document.documentElement;
    if (open === navOpen()) return;
    var burger = document.getElementById('kid-burger');
    if (open) {
      scrollLock = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      html.classList.add('kid-nav-open');
      if (burger) burger.setAttribute('aria-expanded', 'true');
      var first = document.querySelector('#kid-rail .nav__link');
      if (first) first.focus({ preventScroll: true });
    } else {
      document.body.style.overflow = scrollLock;
      html.classList.remove('kid-nav-open');
      if (burger) {
        burger.setAttribute('aria-expanded', 'false');
        /* Returning focus to the control that opened it, otherwise focus is
           left on an element that just slid off the screen. */
        if (document.activeElement && document.getElementById('kid-rail') &&
            document.getElementById('kid-rail').contains(document.activeElement)) {
          burger.focus({ preventScroll: true });
        }
      }
    }
  }

  function buildDrawer(bar) {
    if (document.getElementById('kid-burger')) return;

    var burger = document.createElement('button');
    burger.id = 'kid-burger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'Menu');
    burger.setAttribute('aria-controls', 'kid-rail');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<i></i>';
    burger.addEventListener('click', function () { setNav(!navOpen()); });
    bar.insertBefore(burger, bar.firstChild);

    if (!document.getElementById('kid-scrim')) {
      var scrim = document.createElement('div');
      scrim.id = 'kid-scrim';
      scrim.addEventListener('click', function () { setNav(false); });
      document.body.appendChild(scrim);
    }

    /* A drawer that survives the navigation it just triggered would cover the
       page the user asked for. Any link inside it ends the drawer's job. */
    document.addEventListener('click', function (e) {
      if (!navOpen()) return;
      var rail = document.getElementById('kid-rail');
      var a = e.target.closest && e.target.closest('a,button');
      if (a && rail && rail.contains(a) && a.id !== 'kid-burger') setNav(false);
    }, true);

    document.addEventListener('keydown', function (e) {
      if (!navOpen()) return;
      if (e.key === 'Escape') { setNav(false); return; }
      if (e.key !== 'Tab') return;
      /* Focus trap: while the page behind is inert to the eye, Tab must not
         walk into it. */
      var rail = document.getElementById('kid-rail');
      if (!rail) return;
      var focusable = rail.querySelectorAll(
        'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* Client-side route changes do not reload, so nothing else would close it. */
    window.addEventListener('popstate', function () { setNav(false); });

    /* Growing past the breakpoint turns the drawer back into a fixed rail; the
       scroll lock and scrim have to come off with it or the page stays frozen. */
    var mq = window.matchMedia('(max-width:900px)');
    var onChange = function () { if (!mq.matches) setNav(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* Fills every gamification chip from ONE fetch, so the header and the rail
     can never show two different numbers for the same account again. */
  function paintProgress() {
    if (role() !== 'student') return;
    loadProgress().then(function (p) {
      var s = deriveStats(p);
      var set = function (id, html) { var n = document.getElementById(id); if (n) n.innerHTML = html; };
      set('kid-streak', '🔥 ' + s.streak);
      set('kid-hud-streak', '🔥 ' + s.streak + ' day streak');
      set('kid-hud-coins', '⭐ ' + s.coins + ' coins');
      set('kid-hud-level', '🚀 Level ' + s.level);
      var xpCard = document.getElementById('kid-xp');
      if (xpCard) {
        var top = xpCard.querySelector('.top');
        if (top) top.innerHTML = '<b>Level ' + s.level + '</b><span>' + s.xpIntoLevel + ' / ' + s.xpForLevel + ' XP</span>';
        var bar = xpCard.querySelector('.tr i');
        if (bar) bar.style.width = Math.min(100, Math.round((s.xpIntoLevel / s.xpForLevel) * 100)) + '%';
        var p2 = xpCard.querySelector('p');
        if (p2) {
          var left = s.xpForLevel - s.xpIntoLevel;
          p2.textContent = s.xp === 0
            ? 'Finish a chapter to start earning XP 🏅'
            : left + ' XP to go, keep it up 🏅';
        }
      }
    });
  }


  /* ---------------------------------------------------------
     MOTION, reveal on scroll, ripple on press, count-up
     --------------------------------------------------------- */
  function wireMotion() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

    /* The fail-safe. A reveal animation starts its subject at opacity:0 and
       trusts an observer to turn it back on, so anything the observer misses
       is not "un-animated", it is GONE. Content arriving on a route the
       observer was not watching is exactly that case, and a blank screen is a
       far worse failure than an entrance that does not play. Everything is
       revealed on a timer regardless; the observer only decides whether it
       gets to animate on the way in. */
    function revealAll() {
      document.querySelectorAll('.kid-rv:not(.in)').forEach(function (n) {
        n.classList.add('in');
      });
    }

    function observe() {
      document.querySelectorAll(
        '.pcard,.vcard,.card,.feature-card,.feat-card,.qcard,.optcard,.subjcard,.cont-card,.tablecard'
      ).forEach(function (n, idx) {
        if (n.dataset.kidRv) return;
        n.dataset.kidRv = '1';

        /* Never hide what the reader is already looking at. An entrance
           animation on above-the-fold content does not read as polish, it
           reads as the page being slow, the words are simply not there yet.
           Anything already on screen renders immediately; only what is still
           below the fold gets an entrance, where the animation is free. */
        var r = n.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.05) return;

        n.classList.add('kid-rv');
        n.style.transitionDelay = ((idx % 8) * 45) + 'ms';
        io.observe(n);
      });
    }
    observe();
    setTimeout(observe, 900);
    setTimeout(revealAll, 400);

    /* a route swap brings its own cards, watch for them, and keep the
       fail-safe behind each batch */
    var pending = 0;
    new MutationObserver(function () {
      clearTimeout(pending);
      pending = setTimeout(function () { observe(); setTimeout(revealAll, 400); }, 160);
    }).observe(document.body, { childList: true, subtree: true });

    ['pushState', 'replaceState'].forEach(function (m) {
      var orig = history[m];
      history[m] = function () {
        var r = orig.apply(this, arguments);
        setTimeout(function () { observe(); setTimeout(revealAll, 400); }, 60);
        return r;
      };
    });
    window.addEventListener('popstate', function () {
      setTimeout(function () { observe(); setTimeout(revealAll, 400); }, 60);
    });

    document.addEventListener('click', function (e) {
      /* Same reason as the CSS above: a bare `.cta` is the row around the
         buttons, so closest() walked past the button that was clicked and
         put the ripple on the whole strip. */
      var b = e.target.closest('.btn-primary,.btn,a.cta,button.cta,.btn-cta,button.primary,a.btn');
      if (!b) return;

      /* Never on a button that submits. Sizing the circle to the button was
         fine for a chip and wrong for anything wide: a full-width "Sign In"
         is ~400px across, so the ripple was a 400px circle that then scaled
         2.6x, a white disc bigger than the card, arriving at the exact
         moment the student is waiting to learn whether their password
         worked. It reads as the page breaking, not as feedback. */
      if (b.matches('button[type=submit],input[type=submit]')) return;

      var r = b.getBoundingClientRect();
      /* And cap it everywhere else. A ripple is decoration; past ~120px it
         stops reading as a touch response and starts reading as a flash. */
      var d = Math.min(Math.max(r.width, r.height), 120);

      /* Keep it inside the button. Without a positioned, clipping host the
         circle is laid out against whatever ancestor happens to be
         positioned, which is how it ends up painted across the page. */
      if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
      var prevOverflow = b.style.overflow;
      b.style.overflow = 'hidden';

      var s = document.createElement('span');
      s.className = 'kid-ripple';
      s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' +
        (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px;';
      b.appendChild(s);
      setTimeout(function () {
        s.remove();
        b.style.overflow = prevOverflow;
      }, 620);
    }, true);
  }

  /* Settings and logout are one node, built once.

     account-menu.js creates .acct-fab a single time, on load, and buildRail
     MOVES it into the rail. Tearing the rail down therefore took the only
     copy of settings and logout with it, and nothing rebuilds them, so on
     a client-side route change they were gone for the rest of the session.
     Hand it back to the body before the rail goes, and the next buildRail
     adopts it again. */
  function releaseFab(rail) {
    if (!rail) return;
    var fab = rail.querySelector('.acct-fab');
    if (fab) document.body.appendChild(fab);
  }

  /* The reconciler. Cheap enough to run often; it only acts on a change. */
  function ensure() {
    var need = NO_RAIL.indexOf(pageKey()) === -1;
    var rail = document.getElementById('kid-rail');

    if (!need) {
      if (rail) {
        releaseFab(rail);
        rail.remove();
        var top = document.getElementById('kid-top');
        if (top) top.remove();
        document.documentElement.classList.remove('kid-rail-on');
        builtFor = '';
      }
      return;
    }

    /* a rail built for another route carries that route's links and title */
    if (rail && SPA && builtFor !== pageKey()) {
      releaseFab(rail);
      rail.remove();
      var t = document.getElementById('kid-top');
      if (t) t.remove();
      document.documentElement.classList.remove('kid-rail-on');
      rail = null;
    }

    if (!rail) {
      buildRail();          // no-op until nav.nav exists, the observer retries
      buildTop();
    }

    /* buildRail's own adopt() gives up after 1.4s. account-menu.js waits on the
       stored session, so on a slow load the fab can arrive after that and would
       then sit where it was born, fixed to the viewport's top-right, floating
       over the page instead of resting in the rail. This runs on every
       reconcile, so it catches a late one whenever it shows up. */
    var host = document.getElementById('kid-rail');
    if (host) {
      var stray = document.querySelector('.acct-fab');
      if (stray && stray.parentElement !== host) host.appendChild(stray);
    }

    ctaPass();
  }

  function start() {
    build();
    ensure();

    if (!SPA) return;

    /* A route change swaps in a whole new page's worth of DOM at once, until
       the rail catches up, whatever was built for the PREVIOUS route (wrong
       links, wrong "current" highlight) is what's on screen, which is what
       reads as "the old design" for a beat after every sidebar click. The
       180ms debounce below exists to stop routine, incremental mutations
       (typing, lazy content) from re-running this on every keystroke, but
       applying that same patience to a just-fired navigation is exactly
       backwards, so the next mutation after one gets reacted to fast instead. */
    var navPending = false;

    /* React mounts after us and swaps content on navigation, watch for both */
    ['pushState', 'replaceState'].forEach(function (m) {
      var orig = history[m];
      history[m] = function () {
        var r = orig.apply(this, arguments);
        navPending = true;
        ensure();                 // covers a render that already landed synchronously
        setTimeout(ensure, 500);  // ultimate fallback if the observer below misses it
        return r;
      };
    });
    window.addEventListener('popstate', function () {
      navPending = true;
      ensure();
      setTimeout(ensure, 500);
    });

    var pending = 0;
    new MutationObserver(function () {
      clearTimeout(pending);
      pending = setTimeout(function () {
        navPending = false;
        ensure();
      }, navPending ? 16 : 180);
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
