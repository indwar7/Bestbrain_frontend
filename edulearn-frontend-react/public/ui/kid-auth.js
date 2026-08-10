/* ============================================================
   BESTBRAIN — AUTH, REBUILT
   ------------------------------------------------------------
   Local preview only. login.html / signup.html on disk are never
   modified.

   This is a ground-up replacement of the auth screens: a new
   split-screen shell is constructed, and the page's existing form
   views are MOVED (not copied) into it. Moving keeps every node
   identity intact — ids, listeners, the OTP flow, role tabs and
   the submit handler all keep working, so the only thing that
   changes is the design around them.
   ============================================================ */
(function () {
  'use strict';

  var page = (location.pathname.split('/').pop() || '').toLowerCase().replace(/\.html$/, '');
  if (page !== 'login' && page !== 'signup') return;

  var isLogin = page === 'login';

  /* ---------------------------------------------------------
     ICONS
     --------------------------------------------------------- */
  function svg(d, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + d + (extra || '') + '</svg>';
  }
  var IC = {
    mark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.1L21 10.5l-6.6 2.4L12 19l-2.4-6.1L3 10.5l6.6-2.4z"/></svg>',
    mic: svg('<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v4"/>'),
    book: svg('<path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z"/><path d="M8 7h7M8 11h7"/>'),
    chart: svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    shield: svg('<path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="M9.2 12l2 2 3.6-4"/>'),
  };

  /* ---------------------------------------------------------
     COPY — different story on each screen
     --------------------------------------------------------- */
  var COPY = isLogin ? {
    eyebrow: 'Welcome back',
    head: 'Your tutor has been<br><em>waiting</em> for you.',
    sub: 'Pick up the chapter you left, or just ask your next doubt out loud. ' +
         'BestBrain remembers where you stopped.',
    feats: [
      { i: 'mic', t: 'Ask out loud', d: 'Speak a doubt in English, Hindi or Hinglish' },
      { i: 'book', t: 'Your exact syllabus', d: 'NCERT chapters for Classes 6 to 9' },
      { i: 'chart', t: 'Proof you improved', d: 'Every session tracked, nothing guessed' },
    ],
  } : {
    eyebrow: 'Start free',
    head: 'Learning that<br><em>answers back</em>.',
    sub: 'Create an account and get a tutor that knows your class, your board ' +
         'and your weak chapters — from the very first question.',
    feats: [
      { i: 'mic', t: 'Doubts answered in seconds', d: 'Voice or type, day or night' },
      { i: 'book', t: 'Mapped to NCERT', d: 'Classes 6 to 9, CBSE aligned' },
      { i: 'shield', t: 'Safe for children', d: 'Age-appropriate answers, always' },
    ],
  };

  var PROOF = [
    { n: '48k+', l: 'Doubts solved' },
    { n: '4.8', l: 'Parent rating' },
    { n: '9 min', l: 'Avg. session' },
  ];

  /* ---------------------------------------------------------
     STYLE
     --------------------------------------------------------- */
  var CSS =
  /* the old shell is retired once its contents have been rehoused */
  '.auth-shell{display:none!important;}' +
  'html.kidbg body{overflow-x:hidden;}' +

  '#ka-root{position:relative;z-index:1;min-height:100vh;display:grid;' +
    'grid-template-columns:1.02fr .98fr;align-items:stretch;' +
    'font-family:inherit;color:#fff;}' +

  /* ---------- left: the story ---------- */
  '#ka-root .ka-brand{position:relative;overflow:hidden;display:flex;flex-direction:column;' +
    'justify-content:center;padding:clamp(38px,5vw,74px) clamp(28px,5vw,78px);' +
    'border-right:1px solid rgba(255,255,255,.09);' +
    'background:linear-gradient(155deg,rgba(255,122,0,.16),rgba(255,122,0,.03) 42%,rgba(0,0,0,.28));}' +
  '#ka-root .ka-brand::after{content:"";position:absolute;inset:0;pointer-events:none;' +
    'background:radial-gradient(720px 520px at 12% 8%,rgba(255,167,38,.20),transparent 62%),' +
    'radial-gradient(640px 520px at 88% 92%,rgba(168,85,247,.14),transparent 64%);}' +
  '#ka-root .ka-brand > *{position:relative;z-index:2;}' +

  '#ka-root .ka-logo{display:inline-flex;align-items:center;gap:11px;font-weight:900;font-size:21px;' +
    'letter-spacing:-.02em;text-decoration:none;margin-bottom:auto;}' +
  '#ka-root .ka-logo .m{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;' +
    'background:linear-gradient(135deg,#FF7A00,#FFB347);box-shadow:0 8px 22px rgba(255,122,0,.45);}' +
  '#ka-root .ka-logo .m svg{width:19px;height:19px;color:#0A0A0A;}' +

  '#ka-root .ka-body{padding:clamp(30px,4vw,52px) 0;}' +
  '#ka-root .ka-eyebrow{display:inline-flex;align-items:center;gap:9px;padding:7px 15px;border-radius:99px;' +
    'background:rgba(255,122,0,.14);border:1px solid rgba(255,122,0,.34);' +
    'font-size:12px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;}' +
  '#ka-root .ka-eyebrow .d{width:7px;height:7px;border-radius:50%;background:#FF7A00;' +
    'box-shadow:0 0 10px #FF7A00;animation:ka-blip 2s ease-in-out infinite;}' +
  '@keyframes ka-blip{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}' +

  '#ka-root .ka-head{font-size:clamp(32px,3.9vw,50px);font-weight:900;line-height:1.08;' +
    'letter-spacing:-.03em;margin:22px 0 0;}' +
  '#ka-root .ka-head em{font-style:normal;position:relative;white-space:nowrap;}' +
  '#ka-root .ka-head em::after{content:"";position:absolute;left:0;right:0;bottom:.06em;height:.16em;' +
    'border-radius:99px;background:linear-gradient(90deg,#FF7A00,#FFB347);opacity:.55;z-index:-1;}' +
  '#ka-root .ka-sub{margin:18px 0 0;max-width:44ch;font-size:15.5px;line-height:1.66;}' +

  '#ka-root .ka-feats{list-style:none;margin:34px 0 0;padding:0;display:grid;gap:15px;}' +
  '#ka-root .ka-feats li{display:flex;gap:14px;align-items:flex-start;padding:13px 15px;border-radius:16px;' +
    'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);' +
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);' +
    'opacity:0;transform:translateY(14px);animation:ka-in .7s cubic-bezier(.22,1,.36,1) forwards;}' +
  '#ka-root .ka-feats li:nth-child(1){animation-delay:.10s}' +
  '#ka-root .ka-feats li:nth-child(2){animation-delay:.20s}' +
  '#ka-root .ka-feats li:nth-child(3){animation-delay:.30s}' +
  '#ka-root .ka-feats .fi{width:36px;height:36px;flex-shrink:0;border-radius:12px;display:grid;place-items:center;' +
    'background:rgba(255,122,0,.18);box-shadow:inset 0 0 0 1px rgba(255,122,0,.3);}' +
  '#ka-root .ka-feats .fi svg{width:18px;height:18px;color:#FFC98A;}' +
  '#ka-root .ka-feats b{display:block;font-size:14px;font-weight:800;line-height:1.3;}' +
  '#ka-root .ka-feats span{display:block;margin-top:3px;font-size:12.5px;line-height:1.5;}' +
  '@keyframes ka-in{to{opacity:1;transform:none}}' +

  '#ka-root .ka-proof{display:flex;align-items:center;gap:clamp(16px,2.4vw,30px);margin-top:auto;' +
    'padding-top:26px;border-top:1px solid rgba(255,255,255,.1);}' +
  '#ka-root .ka-proof .n{font-size:23px;font-weight:900;letter-spacing:-.02em;line-height:1;}' +
  '#ka-root .ka-proof .l{font-size:11.5px;font-weight:700;margin-top:5px;letter-spacing:.03em;}' +
  '#ka-root .ka-proof .sep{width:1px;height:30px;background:rgba(255,255,255,.14);}' +

  /* ---------- right: the card ---------- */
  '#ka-root .ka-main{display:flex;align-items:center;justify-content:center;' +
    'padding:clamp(30px,4vw,58px) clamp(20px,4vw,52px);}' +
  '#ka-root .ka-card{position:relative;width:100%;max-width:452px;border-radius:26px;' +
    'padding:clamp(26px,3vw,38px);background:rgba(14,11,9,.58);' +
    'border:1px solid rgba(255,255,255,.13);' +
    'backdrop-filter:blur(30px) saturate(1.25);-webkit-backdrop-filter:blur(30px) saturate(1.25);' +
    'box-shadow:0 30px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.09);' +
    'opacity:0;transform:translateY(20px);animation:ka-in .75s cubic-bezier(.22,1,.36,1) .06s forwards;}' +
  '#ka-root .ka-card::before{content:"";position:absolute;left:26px;right:26px;top:0;height:2px;' +
    'border-radius:0 0 3px 3px;background:linear-gradient(90deg,transparent,#FF7A00,#FFB347,transparent);}' +

  /* ---------- the rehoused form ---------- */
  '#ka-slot h1{font-size:clamp(25px,2.7vw,31px)!important;font-weight:900!important;' +
    'letter-spacing:-.025em!important;line-height:1.14!important;margin:0 0 8px!important;}' +
  '#ka-slot .subtitle,#ka-slot #otpSubtitle{font-size:14px!important;line-height:1.6!important;' +
    'margin:0 0 22px!important;}' +
  '#ka-slot .logo,#ka-slot .reveal{opacity:1!important;transform:none!important;animation:none!important;}' +

  /* segmented role tabs */
  '#ka-slot .role-tabs{display:flex!important;gap:5px!important;padding:5px!important;margin:0 0 20px!important;' +
    'border-radius:15px!important;background:rgba(255,255,255,.05)!important;' +
    'border:1px solid rgba(255,255,255,.1)!important;}' +
  '#ka-slot .role-tab{flex:1!important;padding:9px 6px!important;border-radius:11px!important;border:0!important;' +
    'font-size:13px!important;font-weight:800!important;cursor:pointer;background:transparent!important;' +
    'transition:background .25s ease,color .25s ease,transform .25s ease!important;}' +
  '#ka-slot .role-tab:hover{background:rgba(255,255,255,.07)!important;}' +
  '#ka-slot .role-tab.on,#ka-slot .role-tab.active,#ka-slot .role-tab[aria-selected="true"]{' +
    'background:linear-gradient(120deg,#FF7A00,#FFA726)!important;color:#0A0A0A!important;' +
    '-webkit-text-fill-color:#0A0A0A!important;box-shadow:0 8px 20px rgba(255,122,0,.4)!important;}' +

  /* fields */
  '#ka-slot .form-group{margin:0 0 15px!important;}' +
  '#ka-slot label{display:block!important;font-size:12.5px!important;font-weight:800!important;' +
    'letter-spacing:.02em!important;margin:0 0 7px!important;}' +
  '#ka-slot input[type=text],#ka-slot input[type=email],#ka-slot input[type=password],' +
  '#ka-slot input[type=tel],#ka-slot input[type=number],#ka-slot select,#ka-slot textarea{' +
    'width:100%!important;padding:13px 15px!important;border-radius:14px!important;' +
    'font-size:14.5px!important;font-weight:600!important;' +
    'background:rgba(255,255,255,.055)!important;border:1px solid rgba(255,255,255,.14)!important;' +
    'box-shadow:none!important;outline:none!important;' +
    'transition:border-color .25s ease,box-shadow .25s ease,background .25s ease!important;}' +
  '#ka-slot input:focus,#ka-slot select:focus,#ka-slot textarea:focus{' +
    'border-color:rgba(255,150,60,.75)!important;background:rgba(255,255,255,.08)!important;' +
    'box-shadow:0 0 0 4px rgba(255,122,0,.18),0 0 26px rgba(255,122,0,.22)!important;}' +
  '#ka-slot input::placeholder,#ka-slot textarea::placeholder{' +
    'color:rgba(255,255,255,.5)!important;-webkit-text-fill-color:rgba(255,255,255,.5)!important;}' +
  '#ka-slot select option{background:#141210!important;color:#fff!important;}' +
  /* the page draws a leading glyph inside the wrap — give it a lane of its
     own instead of letting it sit on top of the placeholder */
  '#ka-slot .field-wrap{position:relative!important;}' +
  '#ka-slot .field-wrap > svg,#ka-slot .field-wrap > i,#ka-slot .field-wrap > .fi{' +
    'position:absolute!important;left:14px!important;top:50%!important;' +
    'transform:translateY(-50%)!important;width:17px!important;height:17px!important;' +
    'opacity:.62!important;pointer-events:none!important;z-index:2!important;}' +
  '#ka-slot .field-wrap > svg ~ input,#ka-slot .field-wrap > i ~ input,' +
  '#ka-slot .field-wrap > .fi ~ input{padding-left:42px!important;}' +
  '#ka-slot .pw-toggle{position:absolute!important;right:8px!important;top:50%!important;' +
    'transform:translateY(-50%)!important;background:transparent!important;border:0!important;' +
    'padding:8px!important;cursor:pointer;opacity:.72;}' +
  '#ka-slot .pw-toggle:hover{opacity:1;}' +

  /* checkbox row */
  '#ka-slot input[type=checkbox]{width:17px!important;height:17px!important;accent-color:#FF7A00;' +
    'margin-right:8px!important;vertical-align:-3px;}' +

  /* primary + secondary actions */
  '#ka-slot .btn,#ka-slot .btn-primary,#ka-slot button[type=submit]{' +
    'width:100%!important;padding:14px 20px!important;border-radius:14px!important;border:0!important;' +
    'font-size:15px!important;font-weight:800!important;cursor:pointer;' +
    'background:linear-gradient(120deg,#FF7A00,#FFA726)!important;' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;' +
    'box-shadow:0 14px 34px rgba(255,122,0,.42),inset 0 1px 0 rgba(255,255,255,.38)!important;' +
    'transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s ease,filter .28s ease!important;}' +
  '#ka-slot .btn:hover,#ka-slot .btn-primary:hover,#ka-slot button[type=submit]:hover{' +
    'transform:translateY(-2px);box-shadow:0 20px 46px rgba(255,122,0,.55)!important;filter:brightness(1.04);}' +
  '#ka-slot .btn:active,#ka-slot .btn-primary:active{transform:translateY(0) scale(.99);}' +

  '#ka-slot .divider{display:flex!important;align-items:center!important;gap:12px!important;' +
    'margin:20px 0!important;font-size:12px!important;font-weight:700!important;}' +
  '#ka-slot .divider::before,#ka-slot .divider::after{content:"";flex:1;height:1px;' +
    'background:rgba(255,255,255,.13);}' +

  '#ka-slot .social-logins{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important;}' +
  '#ka-slot .social-btn{display:flex!important;align-items:center!important;justify-content:center!important;' +
    'gap:9px!important;padding:12px 14px!important;border-radius:13px!important;' +
    'font-size:13.5px!important;font-weight:700!important;cursor:pointer;width:auto!important;' +
    'background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.14)!important;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:none!important;' +
    'transition:background .25s ease,transform .25s ease,border-color .25s ease!important;}' +
  '#ka-slot .social-btn:hover{background:rgba(255,255,255,.1)!important;transform:translateY(-2px);' +
    'border-color:rgba(255,255,255,.24)!important;}' +

  '#ka-slot .forgot-password{text-align:right!important;margin:-4px 0 16px!important;font-size:13px!important;}' +
  '#ka-slot .forgot-password a,#ka-slot .signup-link a,#ka-slot a{font-weight:800!important;' +
    'text-decoration:none!important;}' +
  '#ka-slot .forgot-password a:hover,#ka-slot .signup-link a:hover{text-decoration:underline!important;}' +
  '#ka-slot .signup-link{text-align:center!important;margin:20px 0 0!important;font-size:13.5px!important;}' +

  /* errors + demo notices */
  '#ka-slot .auth-error{margin:0 0 14px!important;padding:11px 14px!important;border-radius:13px!important;' +
    'font-size:13px!important;font-weight:700!important;' +
    'background:rgba(239,68,68,.16)!important;border:1px solid rgba(239,68,68,.42)!important;' +
    'color:#FFD9D9!important;-webkit-text-fill-color:#FFD9D9!important;}' +
  '#ka-slot .demo-info{margin:0 0 14px!important;padding:11px 14px!important;border-radius:13px!important;' +
    'font-size:13px!important;background:rgba(255,122,0,.14)!important;' +
    'border:1px solid rgba(255,122,0,.34)!important;}' +

  /* OTP */
  '#ka-slot .otp-inputs-wrapper{display:flex!important;gap:9px!important;margin:0 0 16px!important;}' +
  '#ka-slot .otp-digit{flex:1!important;width:auto!important;text-align:center!important;' +
    'font-size:21px!important;font-weight:900!important;padding:13px 0!important;}' +
  '#ka-slot #otpChannelSelector{display:grid!important;grid-template-columns:1fr 1fr!important;' +
    'gap:10px!important;margin:0 0 16px!important;}' +

  /* ---------- responsive ---------- */
  '@media(max-width:1000px){' +
    '#ka-root{grid-template-columns:1fr;}' +
    '#ka-root .ka-brand{border-right:0;border-bottom:1px solid rgba(255,255,255,.09);' +
      'padding:26px clamp(20px,5vw,34px) 30px;}' +
    '#ka-root .ka-body{padding:18px 0 0;}' +
    '#ka-root .ka-feats,#ka-root .ka-proof{display:none;}' +
    '#ka-root .ka-head{font-size:clamp(26px,6vw,34px);}' +
    '#ka-root .ka-sub{font-size:14.5px;}' +
  '}' +
  '@media(prefers-reduced-motion:reduce){#ka-root *{animation:none!important}}';

  /* ---------------------------------------------------------
     BUILD
     --------------------------------------------------------- */
  function style() {
    var s = document.createElement('style');
    s.id = 'ka-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function brandHtml() {
    var feats = COPY.feats.map(function (f) {
      return '<li><span class="fi">' + (IC[f.i] || '') + '</span>' +
        '<span><b>' + f.t + '</b><span>' + f.d + '</span></span></li>';
    }).join('');

    var proof = PROOF.map(function (p, i) {
      return (i ? '<span class="sep"></span>' : '') +
        '<div><div class="n">' + p.n + '</div><div class="l">' + p.l + '</div></div>';
    }).join('');

    return '<a class="ka-logo" href="index.html"><span class="m">' + IC.mark + '</span>BestBrain</a>' +
      '<div class="ka-body">' +
        '<span class="ka-eyebrow"><span class="d"></span>' + COPY.eyebrow + '</span>' +
        '<h1 class="ka-head">' + COPY.head + '</h1>' +
        '<p class="ka-sub">' + COPY.sub + '</p>' +
        '<ul class="ka-feats">' + feats + '</ul>' +
      '</div>' +
      '<div class="ka-proof">' + proof + '</div>';
  }

  function build() {
    if (document.getElementById('ka-root')) return;
    var shell = document.querySelector('.auth-shell');
    if (!shell) return;

    /* the views that carry all the behaviour */
    var views = [];
    [isLogin ? 'loginFormView' : 'signupFormView', 'otpFormView'].forEach(function (id) {
      var v = document.getElementById(id);
      if (v) views.push(v);
    });
    if (!views.length) return;   // markup changed — leave the page untouched

    var root = document.createElement('div');
    root.id = 'ka-root';

    var brand = document.createElement('aside');
    brand.className = 'ka-brand';
    brand.innerHTML = brandHtml();

    var main = document.createElement('main');
    main.className = 'ka-main';
    var card = document.createElement('div');
    card.className = 'ka-card';
    var slot = document.createElement('div');
    slot.id = 'ka-slot';
    card.appendChild(slot);
    main.appendChild(card);

    root.appendChild(brand);
    root.appendChild(main);
    shell.parentNode.insertBefore(root, shell);

    /* MOVE, so listeners and ids survive intact */
    views.forEach(function (v) { slot.appendChild(v); });

    shell.parentNode.removeChild(shell);
  }

  function start() { style(); build(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  /* the page's own script may swap views in later */
  setTimeout(build, 400);
})();
