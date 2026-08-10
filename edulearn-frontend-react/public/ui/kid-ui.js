/* ============================================================
   BESTBRAIN — AMBER OS · GLASS DESIGN SYSTEM + SHELL
   ------------------------------------------------------------
   Local preview only. Never written to the repo.

   Three jobs:
     1. one glass language for every surface — cards, nav, sidebar,
        dialogs, tables, inputs, buttons
     2. the app shell: the top navbar becomes a LEFT SIDEBAR, plus a
        slim top HUD, both frosted
     3. motion — scroll reveal, hover lift, count-up, ripple

   THE SIDEBAR IS BUILT BY MOVING, NOT COPYING. The page's real
   .brand / .nav__links / .nav__right nodes are relocated into the
   rail, so role-guard.js's link decisions, account-menu.js's
   injected buttons and the i18n layer all keep working untouched.
   ============================================================ */
(function () {
  'use strict';

  var RAIL = 244;
  var NO_RAIL = ['index', 'login', 'signup', 'demo-pal-slides'];

  function pageKey() {
    var last = (location.pathname.split('/').pop() || '').toLowerCase();
    return (last.replace(/\.html$/, '')) || 'index';
  }
  function readUser() {
    try { return JSON.parse(localStorage.getItem('edulearn_user') || 'null'); }
    catch (e) { return null; }
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
  /* the light rake across the top of every card — glass, not flat fill */
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

  /* buttons: soft-depth pills, orange primary, ripple on press */
  '.btn-primary,.btn,.cta,.btn-cta,button.primary,a.btn{position:relative;overflow:hidden;' +
    'border-radius:999px!important;font-weight:700!important;' +
    'transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease,filter .3s ease!important;}' +
  '.btn-primary,.btn-cta,button.primary{' +
    'background:linear-gradient(120deg,#FF7A00,#FFA726)!important;color:#0A0A0A!important;' +
    'border:0!important;box-shadow:0 10px 30px rgba(255,122,0,.4),inset 0 1px 0 rgba(255,255,255,.4)!important;}' +
  '.btn-primary:hover,.btn:hover,.cta:hover,a.btn:hover,button.primary:hover{' +
    'transform:translateY(-3px)!important;filter:brightness(1.06);' +
    'box-shadow:0 16px 42px rgba(255,122,0,.55)!important;}' +
  '.btn-primary:active,.btn:active,a.btn:active{transform:translateY(-1px) scale(.98)!important;}' +
  '.kid-ripple{position:absolute;border-radius:50%;transform:scale(0);pointer-events:none;' +
    'background:rgba(255,255,255,.5);animation:kid-rip .6s ease-out forwards;}' +
  '@keyframes kid-rip{to{transform:scale(2.6);opacity:0}}' +

  /* scrollbar / selection / focus ring */
  '::-webkit-scrollbar{width:11px;height:11px;}' +
  '::-webkit-scrollbar-track{background:rgba(255,255,255,.04);}' +
  '::-webkit-scrollbar-thumb{border-radius:99px;border:3px solid transparent;background-clip:content-box;' +
    'background-image:linear-gradient(180deg,#FF7A00,#FFB347);}' +
  '::selection{background:rgba(255,122,0,.45);color:#fff;}' +
  'a:focus-visible,button:focus-visible,input:focus-visible{' +
    'outline:2px solid #FFA726!important;outline-offset:3px!important;border-radius:12px;}' +

  /* scroll reveal */
  '.kid-rv{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);}' +
  '.kid-rv.in{opacity:1;transform:none;}' +

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
  '#kid-top .hchip{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;border-radius:99px;' +
    'font-size:12.5px;font-weight:800;color:#fff;background:' + G + ';border:1px solid ' + GB + ';' +
    'white-space:nowrap;transition:transform .3s ease,border-color .3s ease;}' +
  '#kid-top .hchip:hover{transform:translateY(-2px);border-color:rgba(255,122,0,.5);}' +
  '@media(max-width:900px){#kid-top .hchip.b,#kid-top .hchip.c{display:none;}}' +

  /* ================= PAL MASCOT ================= */
  '#pal-mascot{position:fixed;left:14px;bottom:14px;z-index:9100;display:flex;align-items:flex-end;gap:12px;' +
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
  '#pal-say{max-width:250px;padding:13px 16px;border-radius:18px 18px 18px 5px;order:2;' +
    'background:rgba(18,18,18,.92);border:1px solid ' + GB + ';' +
    'backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);' +
    'box-shadow:0 18px 44px rgba(0,0,0,.6);font-size:13.5px;line-height:1.5;color:#fff;' +
    'opacity:0;transform:translateY(8px) scale(.96);pointer-events:none;' +
    'transition:opacity .4s cubic-bezier(.22,1,.36,1),transform .4s cubic-bezier(.22,1,.36,1);}' +
  '#pal-say.on{opacity:1;transform:none;}' +
  '#pal-say b{display:block;font-size:11.5px;color:#FFB347;letter-spacing:.06em;margin-bottom:3px;}' +

  '@media(max-width:980px){html.kid-rail-on{--kid-rail:76px;}' +
    '#kid-rail .nav__link span.lbl,#kid-hello>div,#kid-xp,.kid-lab,#kid-rail .brand__word{display:none;}' +
    '#kid-rail .nav__link{justify-content:center;}#pal-say{display:none;}}' +
  '@media(prefers-reduced-motion:reduce){#pal-orb,.knew,#kid-xp .tr i,#kid-rail::after{animation:none!important}' +
    '.kid-rv{opacity:1;transform:none;}}';

  /* ---------------------------------------------------------
     rail icons, keyed by destination — the i18n layer rewrites
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

  var TIPS = [
    'Hi! I am PAL 👋 Tap me whenever you get stuck.',
    'Naya AI Tutor try kiya? Mic dabao aur bolo — main sun raha hoon 🎙️',
    'Roz 15 minute padho — streak banega, badge milega 🔥',
    'Fractions ka trick: ek chapati ke 4 tukde socho 🍕',
    'Ek chapter khatam? Quiz khel lo — 50 star coins pakke ⭐'
  ];

  /* React serves everything from one document. Two things follow:

     COPY, DON'T MOVE. On the static site the nav's children are moved into
     the rail so their listeners survive. Under React that is sabotage: the
     framework still owns those nodes, and its next reconcile of a navbar
     whose children have been spirited away throws NotFoundError mid-render.
     So inside the SPA the rail is built from clones and the original nav is
     simply hidden by the rail CSS — React keeps a tree it fully owns, and
     link clicks still work because the app translates them at the document
     level, not per node.

     REBUILD PER ROUTE. There is no fresh page load to re-run us, so the
     rail is torn down and rebuilt when the route changes — that is also
     what keeps is-current and the top bar's title honest. */
  var SPA = !!document.getElementById('root');
  var builtFor = '';

  function take(el) {
    if (!el) return null;
    return SPA ? el.cloneNode(true) : el;
  }

  function markCurrent(links) {
    if (!SPA || !links) return;
    var here = pageKey();
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
    'box-shadow:0 14px 34px rgba(255,122,0,.46),inset 0 1px 0 rgba(255,255,255,.36)!important;}' +
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
    buildMascot();
    wireMotion();
    ctaPass();
    /* kid-home swaps the homepage body in after us — relabel what it built */
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
    var name = (u.name || 'Student').split(' ')[0];
    var hello = document.createElement('div');
    hello.id = 'kid-hello';
    hello.innerHTML =
      '<span class="av">' + name.charAt(0).toUpperCase() + '</span>' +
      '<div><b>' + name + '</b><span>Class ' + (u.class || 6) + ' · CBSE</span></div>' +
      '<span class="streak">🔥 7</span>';
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

      /* tutor.html shipped after some pages' navs were written — every
         student gets the entry regardless of which nav they landed on */
      if (!links.querySelector('a[href*="tutor"]')) {
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
    }

    var xp = document.createElement('div');
    xp.id = 'kid-xp';
    xp.innerHTML =
      '<div class="top"><b>Level 7</b><span>680 / 1000 XP</span></div>' +
      '<div class="tr"><i></i></div>' +
      '<p>320 XP aur — aaj ek chapter khatam karo 🏅</p>';
    rail.appendChild(xp);

    var right = take(nav.querySelector('.nav__right'));
    if (right) rail.appendChild(right);                    // MOVE (static) / copy (SPA)

    document.body.appendChild(rail);
    document.documentElement.classList.add('kid-rail-on');
    builtFor = pageKey();

    /* account-menu.js pins its settings/logout cluster to the viewport's
       top-right and builds it after we run — adopt it once it exists */
    function adopt() {
      var fab = document.querySelector('.acct-fab');
      if (fab && fab.parentElement !== rail) rail.appendChild(fab);
    }
    adopt(); setTimeout(adopt, 400); setTimeout(adopt, 1400);
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
      '<span class="hchip a">🔥 7 day streak</span>' +
      '<span class="hchip b">⭐ 480 coins</span>' +
      '<span class="hchip c">🚀 Level 7</span>';
    bar.querySelector('.kt-ttl').appendChild(document.createTextNode(title));
    document.body.appendChild(bar);
  }

  function buildMascot() {
    /* The public pages are a first impression, and on a sign-up screen the
       mascot's speech bubble lands squarely on the copy it is meant to sell.
       It belongs to the app, once you are inside it. */
    if (NO_RAIL.indexOf(pageKey()) !== -1) return;
    if (document.getElementById('pal-mascot')) return;
    var wrap = document.createElement('div');
    wrap.id = 'pal-mascot';
    var say = document.createElement('div');
    say.id = 'pal-say';
    var orb = document.createElement('button');
    orb.id = 'pal-orb';
    orb.type = 'button';
    orb.setAttribute('aria-label', 'PAL says hello');
    orb.innerHTML = FACE;
    wrap.appendChild(orb);
    wrap.appendChild(say);
    document.body.appendChild(wrap);

    var i = -1, hide;
    function speak() {
      i = (i + 1) % TIPS.length;
      say.innerHTML = '<b>PAL</b>';
      say.appendChild(document.createTextNode(TIPS[i]));
      say.classList.add('on');
      clearTimeout(hide);
      hide = setTimeout(function () { say.classList.remove('on'); }, 6500);
    }
    orb.addEventListener('click', speak);
    setTimeout(speak, 1600);
    setInterval(speak, 17000);
  }

  /* ---------------------------------------------------------
     MOTION — reveal on scroll, ripple on press, count-up
     --------------------------------------------------------- */
  function wireMotion() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

    /* The fail-safe. A reveal animation starts its subject at opacity:0 and
       trusts an observer to turn it back on — so anything the observer misses
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
        n.classList.add('kid-rv');
        n.style.transitionDelay = ((idx % 8) * 55) + 'ms';
        io.observe(n);
      });
    }
    observe();
    setTimeout(observe, 900);
    setTimeout(revealAll, 1500);

    /* a route swap brings its own cards — watch for them, and keep the
       fail-safe behind each batch */
    var pending = 0;
    new MutationObserver(function () {
      clearTimeout(pending);
      pending = setTimeout(function () { observe(); setTimeout(revealAll, 1200); }, 200);
    }).observe(document.body, { childList: true, subtree: true });

    ['pushState', 'replaceState'].forEach(function (m) {
      var orig = history[m];
      history[m] = function () {
        var r = orig.apply(this, arguments);
        setTimeout(function () { observe(); setTimeout(revealAll, 1000); }, 80);
        return r;
      };
    });
    window.addEventListener('popstate', function () {
      setTimeout(function () { observe(); setTimeout(revealAll, 1000); }, 80);
    });

    document.addEventListener('click', function (e) {
      var b = e.target.closest('.btn-primary,.btn,.cta,.btn-cta,button.primary,a.btn');
      if (!b) return;
      var r = b.getBoundingClientRect();
      var d = Math.max(r.width, r.height);
      var s = document.createElement('span');
      s.className = 'kid-ripple';
      s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' +
        (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px;';
      b.appendChild(s);
      setTimeout(function () { s.remove(); }, 620);
    }, true);
  }

  /* The reconciler. Cheap enough to run often; it only acts on a change. */
  function ensure() {
    var need = NO_RAIL.indexOf(pageKey()) === -1;
    var rail = document.getElementById('kid-rail');

    if (!need) {
      if (rail) {
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
      rail.remove();
      var t = document.getElementById('kid-top');
      if (t) t.remove();
      document.documentElement.classList.remove('kid-rail-on');
      rail = null;
    }

    if (!rail) {
      buildRail();          // no-op until nav.nav exists — the observer retries
      buildTop();
    }
    ctaPass();
  }

  function start() {
    build();
    ensure();

    if (!SPA) return;

    /* React mounts after us and swaps content on navigation — watch for both */
    ['pushState', 'replaceState'].forEach(function (m) {
      var orig = history[m];
      history[m] = function () {
        var r = orig.apply(this, arguments);
        setTimeout(ensure, 60);
        setTimeout(ensure, 500);
        return r;
      };
    });
    window.addEventListener('popstate', function () {
      setTimeout(ensure, 60);
      setTimeout(ensure, 500);
    });

    var pending = 0;
    new MutationObserver(function () {
      clearTimeout(pending);
      pending = setTimeout(ensure, 180);
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
