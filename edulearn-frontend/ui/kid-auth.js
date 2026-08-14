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
      { i: 'book', t: 'Right where you stopped', d: 'Your chapter, your progress, still there' },
    ],
    quote: 'It explains the same doubt three different ways until it clicks.',
    who: 'Aarav B. · Class 6',
  } : {
    eyebrow: 'Start free',
    head: 'Learning that<br><em>answers back</em>.',
    sub: 'Create an account and get a tutor that knows your class, your board ' +
         'and your weak chapters — from the very first question.',
    feats: [
      { i: 'mic', t: 'Doubts answered in seconds', d: 'Voice or type, day or night' },
      { i: 'book', t: 'Mapped to NCERT', d: 'Classes 6 to 9, CBSE aligned' },
      { i: 'shield', t: 'Safe for children', d: 'Age-appropriate answers, always' },
      { i: 'chart', t: 'Progress you can see', d: 'Every chapter, every score, in one place' },
    ],
    quote: 'My son stopped waiting for the next class to ask his doubts.',
    who: 'Meera S. · parent, Class 7',
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

  /* minmax(0,…) rather than a bare fr: `1fr` is `minmax(auto,1fr)`, and that
     auto floor is the column's min-content width. .ka-card is 452px wide, so
     the floor was 452px and the column simply refused to shrink — on a 320px
     phone the page laid out at 492px and the right third was cut off by
     body{overflow-x:hidden}. Letting the column reach 0 is what makes
     .ka-card's own max-width:100% mean anything.

     min-height uses dvh so the shell tracks the visible area as the mobile
     browser's toolbar shows and hides; 100vh is the taller, fixed number and
     leaves the last row under the toolbar. 100vh stays as the fallback for
     engines without dvh. */
  '#ka-root{position:relative;z-index:1;min-height:100vh;min-height:100dvh;display:grid;' +
    'grid-template-columns:minmax(0,1.02fr) minmax(0,.98fr);align-items:stretch;' +
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
    'opacity:1;transform:translateY(12px);animation:ka-slide .55s cubic-bezier(.22,1,.36,1) forwards;}' +
  '#ka-root .ka-feats li:nth-child(1){animation-delay:.10s}' +
  '#ka-root .ka-feats li:nth-child(2){animation-delay:.20s}' +
  '#ka-root .ka-feats li:nth-child(3){animation-delay:.30s}' +
  '#ka-root .ka-feats li:nth-child(4){animation-delay:.38s}' +
  '#ka-root .ka-feats .fi{width:36px;height:36px;flex-shrink:0;border-radius:12px;display:grid;place-items:center;' +
    'background:rgba(255,122,0,.18);box-shadow:inset 0 0 0 1px rgba(255,122,0,.3);}' +
  '#ka-root .ka-feats .fi svg{width:18px;height:18px;color:#FFC98A;}' +
  '#ka-root .ka-feats b{display:block;font-size:14px;font-weight:800;line-height:1.3;}' +
  '#ka-root .ka-feats span{display:block;margin-top:3px;font-size:12.5px;line-height:1.5;}' +
  '@keyframes ka-in{to{opacity:1;transform:none}}' +

  '#ka-root .ka-quote{margin:26px 0 0;padding:18px 20px;border-radius:18px;' +
    'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);' +
    'border-left:3px solid #FF7A00;' +
    'opacity:1;transform:translateY(12px);animation:ka-slide .55s cubic-bezier(.22,1,.36,1) .2s forwards;}' +
  '#ka-root .ka-quote blockquote{margin:0;font-size:15px;line-height:1.6;font-weight:600;}' +
  '#ka-root .ka-quote figcaption{margin-top:10px;font-size:12.5px;font-weight:800;' +
    'color:#FFC98A!important;-webkit-text-fill-color:#FFC98A!important;}' +
  '#ka-root .ka-proof{display:flex;align-items:center;gap:clamp(16px,2.4vw,30px);margin-top:28px;' +
    'padding-top:26px;border-top:1px solid rgba(255,255,255,.1);}' +
  '#ka-root .ka-proof .n{font-size:23px;font-weight:900;letter-spacing:-.02em;line-height:1;}' +
  '#ka-root .ka-proof .l{font-size:11.5px;font-weight:700;margin-top:5px;letter-spacing:.03em;}' +
  '#ka-root .ka-proof .sep{width:1px;height:30px;background:rgba(255,255,255,.14);}' +

  /* ---------- right: the card ---------- */
  '#ka-root .ka-main{display:flex;align-items:center;justify-content:center;' +
    'padding:clamp(30px,4vw,58px) clamp(20px,4vw,52px);}' +
  /* A fixed width, not a max-width. The card is sized to its contents
     otherwise, so the moment a browser adds a password-manager icon, or the
     submit button's label changes to "Signing in…", the whole card resizes
     under the cursor. */
  '#ka-root .ka-card{position:relative;width:452px;max-width:100%;border-radius:26px;' +
    'padding:clamp(26px,3vw,38px);background:rgba(14,11,9,.58);' +
    'border:1px solid rgba(255,255,255,.13);' +
    'backdrop-filter:blur(30px) saturate(1.25);-webkit-backdrop-filter:blur(30px) saturate(1.25);' +
    'box-shadow:0 30px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.09);' +
    /* Visible first, animated second. This card held the sign-in form at
       opacity:0 and trusted an entrance animation to bring it back — so any
       load where that animation did not run left the form present, laid out,
       and permanently invisible, with nothing in the console to say so. A
       transform alone cannot hide anything. */
    'opacity:1;transform:translateY(14px);animation:ka-slide .5s cubic-bezier(.22,1,.36,1) forwards;}' +
  '@keyframes ka-slide{to{transform:none}}' +
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
  /* Yellow, not amber. This is the one control on the screen that has to be
     found without looking for it, and yellow on near-black is the sharpest
     pairing the palette has — black text on it reads at about 15:1. */
  '#ka-slot .btn,#ka-slot .btn-primary,#ka-slot button[type=submit]{' +
    'width:100%!important;padding:14px 20px!important;border-radius:14px!important;border:0!important;' +
    'font-size:15px!important;font-weight:900!important;cursor:pointer;' +
    'background:linear-gradient(120deg,#FFC400,#FFDD3C)!important;' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;' +
    'box-shadow:0 0 0 1px rgba(255,214,60,.55),0 14px 36px rgba(255,200,0,.45),' +
      'inset 0 1px 0 rgba(255,255,255,.5)!important;' +
    'transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s ease,filter .28s ease!important;}' +
  '#ka-slot .btn:hover,#ka-slot .btn-primary:hover,#ka-slot button[type=submit]:hover{' +
    'box-shadow:0 0 0 1px rgba(255,221,60,.75),0 20px 48px rgba(255,200,0,.6)!important;}' +
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

  /* One height, whatever the label says. The page swaps the label to
     "Signing in…" mid-submit, and a button sized to its text grows under the
     cursor at the exact moment the reader is waiting on it. */
  '#ka-slot .btn,#ka-slot .btn-primary,#ka-slot button[type=submit]{' +
    'font-weight:900!important;font-size:15.5px!important;letter-spacing:.01em!important;' +
    'height:52px!important;min-height:52px!important;line-height:1!important;' +
    'display:inline-flex!important;align-items:center!important;justify-content:center!important;' +
    'gap:10px!important;padding:0 22px!important;white-space:nowrap!important;' +
    'text-overflow:ellipsis;overflow:hidden;}' +
  /* The waiting state must not resize anything. Whatever the page puts inside
     the button while it works — a spinner div, an svg, a pseudo-element — is
     clamped to a fixed 16px and told not to grow, because a loader that
     inherits the button's height renders as a circle the size of the button
     and the whole card appears to lurch. */
  '#ka-slot button[type=submit]:disabled{opacity:1!important;filter:saturate(.85);}' +
  '#ka-slot button[type=submit] > *{max-height:20px;flex:0 0 auto!important;align-self:center!important;}' +
  '#ka-slot button[type=submit] .spinner,#ka-slot button[type=submit] .loader,' +
  '#ka-slot button[type=submit] [class*=spin],#ka-slot button[type=submit] svg{' +
    'width:16px!important;height:16px!important;min-width:16px!important;min-height:16px!important;' +
    'max-width:16px!important;max-height:16px!important;flex:0 0 16px!important;' +
    'border-width:2px!important;}' +
  '#ka-slot button[type=submit].is-busy{pointer-events:none;}' +
  /* the two ways forward, unmistakable */
  '#ka-slot .signup-link,#ka-slot .forgot-password{font-weight:800!important;}' +
  '#ka-slot .signup-link a,#ka-slot .forgot-password a{' +
    'color:#FFB347!important;-webkit-text-fill-color:#FFB347!important;' +
    'text-decoration:underline!important;text-underline-offset:3px!important;' +
    'text-decoration-thickness:2px!important;}' +
  '#ka-slot .signup-link a,#ka-slot .forgot-password a{' +
    'color:#FFC98A!important;-webkit-text-fill-color:#FFC98A!important;font-weight:900!important;}' +
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
    '#ka-root{grid-template-columns:minmax(0,1fr);}' +
    '#ka-root .ka-brand{border-right:0;border-bottom:1px solid rgba(255,255,255,.09);' +
      'padding:26px clamp(20px,5vw,34px) 30px;}' +
    '#ka-root .ka-body{padding:18px 0 0;}' +
    '#ka-root .ka-feats,#ka-root .ka-proof{display:none;}' +
    '#ka-root .ka-head{font-size:clamp(26px,6vw,34px);}' +
    '#ka-root .ka-sub{font-size:14.5px;}' +
  '}' +

  /* ---------- phone ----------
     The card is a fixed 452px, which is wider than every phone in the target
     list. It needs a real width here, and its children need permission to
     shrink: a grid/flex child defaults to min-width:auto and will hold its
     min-content width no matter what its parent says. That is what pushed the
     role tabs (three 125px buttons in a row), the password toggle and the
     quote block off the right edge. */
  '@media(max-width:600px){' +
    '#ka-root,#ka-root .ka-brand,#ka-root .ka-body,#ka-root .ka-card{min-width:0;}' +
    '#ka-root .ka-card{width:100%;max-width:100%;border-radius:20px;' +
      'padding:20px clamp(14px,4.5vw,20px);}' +
    '#ka-root .ka-body{padding:14px clamp(12px,4vw,18px) ' +
      'max(20px,env(safe-area-inset-bottom));}' +
    '#ka-root .ka-brand{padding:20px clamp(14px,4.5vw,20px) 22px;}' +
    '#ka-slot,#ka-slot form,#ka-slot .role-tabs{min-width:0;max-width:100%;}' +
    /* three tabs cannot sit in a 292px row and stay tappable — wrap them */
    '#ka-slot .role-tabs{flex-wrap:wrap!important;}' +
    '#ka-slot .role-tab{flex:1 1 30%!important;min-width:0!important;min-height:44px;' +
      'font-size:13px!important;}' +
    /* long words in headings and quotes are the other way this page overflows */
    '#ka-root .ka-head,#ka-root .ka-sub,#ka-root .ka-quote,#ka-slot h1,' +
    '#ka-slot .subtitle{overflow-wrap:anywhere;}' +
    '#ka-root .ka-quote{padding:14px 16px;}' +
    /* 16px keeps iOS from zooming the page when a field takes focus */
    '#ka-slot .social-logins{grid-template-columns:1fr!important;}' +
    /* The terms checkbox is a 17px box and the two links inside its label are
       17px tall — the three controls a signup cannot complete without were
       the three smallest things on the screen. */
    /* "Forgot password?" is an 18px inline link and the only way back into a
       locked-out account — it needs to be reachable with a thumb. */
    '#ka-slot .otp-inputs-wrapper{gap:6px!important;}' +
    '#ka-slot .otp-digit{min-width:0!important;font-size:18px!important;padding:11px 0!important;}' +
    '#ka-slot #otpChannelSelector{grid-template-columns:1fr!important;}' +
  '}' +
  /* ---------- touch + legibility ----------
     Keyed to 900px, not 600px. A phone held sideways is 667px wide and a
     tablet is 768px; neither of them grew a mouse, and at 600px both were
     still getting the 17px terms checkbox and the 18px "Forgot password?"
     link. Field sizing lives here too: below 16px iOS Safari zooms the page
     on focus regardless of which way the phone is turned. */
  '@media(max-width:900px){' +
    '#ka-slot input[type=text],#ka-slot input[type=email],#ka-slot input[type=password],' +
    '#ka-slot input[type=tel],#ka-slot input[type=number],#ka-slot select,#ka-slot textarea{' +
      'font-size:16px!important;min-height:46px;}' +
    '#ka-slot .pw-toggle{min-width:44px;min-height:44px;display:grid!important;place-items:center;}' +
    '#ka-slot input[type=checkbox]{width:24px!important;height:24px!important;flex:0 0 auto;}' +
    '#ka-slot .checkbox-group{align-items:flex-start!important;gap:12px!important;}' +
    '#ka-slot .checkbox-group label{font-size:13.5px!important;line-height:1.5!important;}' +
    '#ka-slot label a,#ka-slot .checkbox-group a{display:inline-block;padding:6px 2px;}' +
    '#ka-slot .forgot-password{margin:0 0 12px!important;}' +
    '#ka-slot .forgot-password a,#ka-slot .signup-link a,#ka-slot .signin-link a{' +
      'display:inline-block;padding:12px 4px;min-height:44px;box-sizing:border-box;}' +
    '#ka-root .ka-logo{min-height:44px;align-items:center;}' +
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
        '<figure class="ka-quote"><blockquote>' + COPY.quote + '</blockquote>' +
        '<figcaption>' + COPY.who + '</figcaption></figure>' +
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

  /* The page signals "working" by rewriting the button's text. Watch for that
     and mark the button, so the spinner belongs to the state rather than to a
     handler we would have to intercept — the form's own submit logic is never
     touched. */
  function watchBusy() {
    var slot = document.getElementById('ka-slot');
    if (!slot) return;
    new MutationObserver(function () {
      slot.querySelectorAll('button[type=submit]').forEach(function (b) {
        var busy = /…|\.\.\.|signing|creating|sending|verifying|please wait/i.test(b.textContent || '');
        b.classList.toggle('is-busy', busy);
      });
    }).observe(slot, { childList: true, subtree: true, characterData: true });
  }

  /* ---------------------------------------------------------
     QA S-11 / S-12 — two controls that did nothing, silently.

     Google/Apple already called handleSocial(), which fired a blocking
     native alert() — startling on a screen this calm, and easy to read as
     the page having crashed. It still opens the small notice below, because
     that sign-in genuinely is not connected.

     Forgot-password was a literal href="#" with no route behind it. It has
     one now (see resetDialog and /api/auth/forgot-password), so it runs the
     real two-step flow rather than apologising.
     --------------------------------------------------------- */
  var NOTICE_CSS =
  '#ka-notice{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;' +
    'padding:20px;background:rgba(3,3,3,.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
    'opacity:0;animation:ka-nfade .25s ease forwards;}' +
  '@keyframes ka-nfade{to{opacity:1}}' +
  '#ka-notice .box{width:min(380px,100%);padding:26px;border-radius:20px;' +
    'background:#0E0B09;border:1px solid rgba(255,255,255,.14);' +
    'box-shadow:0 30px 70px rgba(0,0,0,.6);text-align:center;}' +
  '#ka-notice h3{margin:0 0 10px;font-size:18px;font-weight:900;color:#fff!important;' +
    '-webkit-text-fill-color:#fff!important;}' +
  '#ka-notice p{margin:0 0 20px;font-size:14px;line-height:1.6;' +
    'color:rgba(255,255,255,.82)!important;-webkit-text-fill-color:rgba(255,255,255,.82)!important;}' +
  '#ka-notice button{width:100%;padding:12px;border:0;border-radius:12px;cursor:pointer;' +
    'font-size:14px;font-weight:900;background:linear-gradient(120deg,#FFC400,#FFDD3C);' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;}' +
  /* the reset dialog reuses the notice shell, with a form inside */
  '#ka-notice .box.form{text-align:left;width:min(400px,100%);}' +
  '#ka-notice label{display:block;font-size:12px;font-weight:800;margin:0 0 6px;' +
    'color:rgba(255,255,255,.7)!important;-webkit-text-fill-color:rgba(255,255,255,.7)!important;}' +
  '#ka-notice input{width:100%;padding:12px 14px;margin:0 0 14px;border-radius:12px;' +
    'font-size:15px;background:rgba(255,255,255,.06)!important;' +
    'border:1px solid rgba(255,255,255,.16)!important;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;}' +
  '#ka-notice input:focus{outline:2px solid #FFB347!important;outline-offset:1px;}' +
  '#ka-notice .row{display:flex;gap:10px;}' +
  '#ka-notice .row button{flex:1;}' +
  '#ka-notice .ghost{background:rgba(255,255,255,.08)!important;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;' +
    'border:1px solid rgba(255,255,255,.18)!important;}' +
  '#ka-notice .say{font-size:13px;line-height:1.5;margin:0 0 14px;min-height:18px;}' +
  '#ka-notice .say.bad{color:#FF9B9B!important;-webkit-text-fill-color:#FF9B9B!important;}' +
  '#ka-notice .say.good{color:#8FE3C0!important;-webkit-text-fill-color:#8FE3C0!important;}';

  function notice(title, body) {
    if (document.getElementById('ka-notice')) return;
    var st = document.getElementById('ka-notice-css');
    if (!st) {
      st = document.createElement('style');
      st.id = 'ka-notice-css';
      st.textContent = NOTICE_CSS;
      document.head.appendChild(st);
    }
    var wrap = document.createElement('div');
    wrap.id = 'ka-notice';
    var h = document.createElement('h3'); h.textContent = title;
    var p = document.createElement('p'); p.textContent = body;
    var b = document.createElement('button'); b.type = 'button'; b.textContent = 'Got it';
    var box = document.createElement('div'); box.className = 'box';
    box.appendChild(h); box.appendChild(p); box.appendChild(b);
    wrap.appendChild(box);
    document.body.appendChild(wrap);
    function close() { wrap.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    b.addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);
  }

  function wireNotices() {
    /* Replace the page's own alert()-based handler rather than adding a
       second click listener beside it — two handlers firing on one click
       would show the alert AND the notice. */
    if (typeof window.handleSocial === 'function' && !window.handleSocial.__kaWrapped) {
      window.handleSocial = function (provider) {
        notice('Coming soon',
          (provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'Social') +
          ' sign-in isn’t connected yet — please use your email and password for now.');
      };
      window.handleSocial.__kaWrapped = true;
    }

    var forgot = document.querySelector('.forgot-password a');
    if (forgot && !forgot.__kaWired) {
      forgot.__kaWired = true;
      forgot.addEventListener('click', function (e) {
        e.preventDefault();
        resetDialog();
      });
    }
  }

  /* ---------------------------------------------------------
     FORGOT PASSWORD

     Two steps against /api/auth/forgot-password and
     /api/auth/reset-password: ask for a code, then spend it on a new
     password. The code is emailed and scoped to resets, so a code sent to
     confirm an address cannot be used here.

     The first step's answer is deliberately the same whether or not the
     address is registered — the screen must not become a way to find out
     which emails have accounts — so the copy says "if that email is
     registered" rather than claiming a message was sent.
     --------------------------------------------------------- */
  function apiBase() {
    try {
      if (window.EduAPI && window.EduAPI.API_BASE) return window.EduAPI.API_BASE;
      var o = localStorage.getItem('edulearn_api');
      if (o) return o.replace(/\/+$/, '');
    } catch (e) {}
    return location.origin;
  }

  function resetDialog() {
    if (document.getElementById('ka-notice')) return;
    var st = document.getElementById('ka-notice-css');
    if (!st) {
      st = document.createElement('style');
      st.id = 'ka-notice-css';
      st.textContent = NOTICE_CSS;
      document.head.appendChild(st);
    }

    var wrap = document.createElement('div');
    wrap.id = 'ka-notice';
    var box = document.createElement('div');
    box.className = 'box form';
    wrap.appendChild(box);
    document.body.appendChild(wrap);

    function close() { wrap.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });

    function say(el, msg, kind) {
      el.textContent = msg || '';
      el.className = 'say' + (kind ? ' ' + kind : '');
    }

    /* prefill from the sign-in form — they have almost certainly just typed it */
    var typed = '';
    try { typed = (document.getElementById('email') || {}).value || ''; } catch (e) {}

    function stepEmail() {
      box.innerHTML =
        '<h3>Reset your password</h3>' +
        '<p>Enter the email you signed up with and we’ll send you a 6-digit code.</p>' +
        '<label for="ka-rp-email">Email</label>' +
        '<input id="ka-rp-email" type="email" autocomplete="username" placeholder="you@example.com">' +
        '<div class="say" id="ka-rp-say"></div>' +
        '<div class="row">' +
          '<button type="button" class="ghost" id="ka-rp-cancel">Cancel</button>' +
          '<button type="button" id="ka-rp-send">Send code</button>' +
        '</div>';
      var email = box.querySelector('#ka-rp-email');
      var msg = box.querySelector('#ka-rp-say');
      email.value = typed;
      email.focus();
      box.querySelector('#ka-rp-cancel').addEventListener('click', close);

      var btn = box.querySelector('#ka-rp-send');
      function send() {
        var v = (email.value || '').trim();
        if (!v) return say(msg, 'Please enter your email.', 'bad');
        btn.disabled = true;
        say(msg, 'Sending…');
        fetch(apiBase() + '/api/auth/forgot-password', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: v })
        }).then(function (r) {
          return r.json().then(function (d) { return { ok: r.ok, d: d }; });
        }).then(function (res) {
          btn.disabled = false;
          if (!res.ok) return say(msg, res.d.error || 'Could not send the code.', 'bad');
          stepCode(v, res.d.devCode);
        }).catch(function () {
          btn.disabled = false;
          say(msg, 'Could not reach the server. Check your connection.', 'bad');
        });
      }
      btn.addEventListener('click', send);
      email.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
    }

    function stepCode(email, devCode) {
      box.innerHTML =
        '<h3>Enter the code</h3>' +
        '<p>If that email is registered, a 6-digit code is on its way. It expires in 10 minutes.</p>' +
        '<label for="ka-rp-code">6-digit code</label>' +
        '<input id="ka-rp-code" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="one-time-code">' +
        '<label for="ka-rp-pw">New password</label>' +
        '<input id="ka-rp-pw" type="password" placeholder="At least 6 characters" autocomplete="new-password">' +
        '<div class="say" id="ka-rp-say"></div>' +
        '<div class="row">' +
          '<button type="button" class="ghost" id="ka-rp-back">Back</button>' +
          '<button type="button" id="ka-rp-save">Set password</button>' +
        '</div>';
      var code = box.querySelector('#ka-rp-code');
      var pw = box.querySelector('#ka-rp-pw');
      var msg = box.querySelector('#ka-rp-say');
      /* Only ever present when no mail provider is configured and the server
         is not in production — it keeps the flow usable on a dev box. */
      if (devCode) { code.value = devCode; say(msg, 'Dev mode: code filled in for you.', 'good'); }
      code.focus();
      box.querySelector('#ka-rp-back').addEventListener('click', stepEmail);

      var btn = box.querySelector('#ka-rp-save');
      function save() {
        var c = (code.value || '').trim();
        var p = pw.value || '';
        if (c.length !== 6) return say(msg, 'The code is 6 digits.', 'bad');
        if (p.length < 6) return say(msg, 'Password must be at least 6 characters.', 'bad');
        btn.disabled = true;
        say(msg, 'Saving…');
        fetch(apiBase() + '/api/auth/reset-password', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, code: c, password: p })
        }).then(function (r) {
          return r.json().then(function (d) { return { ok: r.ok, d: d }; });
        }).then(function (res) {
          btn.disabled = false;
          if (!res.ok) return say(msg, res.d.error || 'Could not reset the password.', 'bad');
          stepDone();
        }).catch(function () {
          btn.disabled = false;
          say(msg, 'Could not reach the server. Check your connection.', 'bad');
        });
      }
      btn.addEventListener('click', save);
      pw.addEventListener('keydown', function (e) { if (e.key === 'Enter') save(); });
    }

    function stepDone() {
      box.className = 'box';
      box.innerHTML =
        '<h3>Password updated</h3>' +
        '<p>You can sign in with your new password now.</p>' +
        '<button type="button" id="ka-rp-ok">Back to sign in</button>';
      box.querySelector('#ka-rp-ok').addEventListener('click', function () {
        close();
        try {
          var pf = document.getElementById('password');
          if (pf) { pf.value = ''; pf.focus(); }
        } catch (e) {}
      });
    }

    stepEmail();
  }

  function start() { style(); build(); watchBusy(); wireNotices(); setTimeout(wireNotices, 500); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  /* the page's own script may swap views in later */
  setTimeout(build, 400);
})();
