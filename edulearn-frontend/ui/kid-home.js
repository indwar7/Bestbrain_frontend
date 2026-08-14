/* ============================================================
   BESTBRAIN — AMBER OS · HOMEPAGE
   ------------------------------------------------------------
   Local preview only. index.html on disk is never touched: this
   builds the marketing page in memory and swaps it in, so the
   repo file and its routing/links stay exactly as committed.

   Every CTA points at the REAL pages (signup.html, login.html,
   dashboard.html, tutor.html), so the funnel still works.
   ============================================================ */
(function () {
  'use strict';

  function pageKey() {
    var last = (location.pathname.split('/').pop() || '').toLowerCase();
    return (last.replace(/\.html$/, '')) || 'index';
  }
  /* Under the router this file loads once and the route changes under it, so
     the check belongs at mount time, not at load time. */
  var SPA = !!document.getElementById('root');
  function onHome() { return pageKey() === 'index'; }

  var I = (window.KidTheme && window.KidTheme.ICON) || {};

  var STATS = [
    { n: 1000, suf: '+', l: 'Practice questions', s: 'Chapter-wise, NCERT aligned' },
    { n: 250,  suf: '+', l: 'AI generated tests', s: 'Adaptive difficulty, instant marks' },
    { n: 50,   suf: '+', l: 'Coding challenges', s: 'From first loop to logic puzzles' },
    { n: 25,   suf: '+', l: 'Learning modules', s: 'Classes 6 to 9, five subjects' },
    { n: 24,   suf: '×7', l: 'AI tutor on call', s: 'Voice doubts, answered out loud' },
    { n: 95,   suf: '%', l: 'Student satisfaction', s: 'Across our pilot schools' },
    { n: 10000, suf: '+', l: 'Questions solved', s: 'By students, this term' },
    { n: 7,    suf: ' days', l: 'Average streak', s: 'Habits, not cramming' }
  ];

  var FEATURES = [
    { i: 'graph',  t: 'Dashboard',            d: 'Everything you did this week in one glance.', h: 'dashboard.html' },
    { i: 'mic',    t: 'AI Tutor',             d: 'Ask a doubt out loud. PAL answers like a teacher on call.', h: 'tutor.html', tag: 'NEW' },
    { i: 'target', t: 'Practice Tests',       d: 'Adaptive papers that climb when you do.', h: 'mocktest.html' },
    { i: 'trophy', t: 'Arena',                d: 'Same question, whole school, live leaderboard.', h: 'challenge.html' },
    { i: 'chat',   t: 'PAL',                  d: 'Summaries, explanations and quizzes in English ya Hinglish.', h: 'pal.html' },
    { i: 'book',   t: 'Learn',                d: 'Your whole syllabus, chapter by chapter.', h: 'learn.html' },
    { i: 'graph',  t: 'Performance Analytics',d: 'Strengths, gaps and trends — measured, not guessed.' },
    { i: 'spark',  t: 'AI Feedback',          d: 'Every answer explained, not just marked.' },
    { i: 'bolt',   t: 'Progress Tracking',    d: 'Chapter mastery that updates as you work.' },
    { i: 'users',  t: 'Leaderboard',          d: 'Class, school and city ranks, refreshed live.' },
    { i: 'code',   t: 'Coding Challenges',    d: 'Logic and loops, built for beginners.' },
    { i: 'shield', t: 'Mock Interviews',      d: 'Practise speaking answers with instant feedback.' },
    { i: 'cap',    t: 'Question Bank',        d: 'A thousand questions, filtered to your chapter.' },
    { i: 'brain',  t: 'Personalised Learning',d: 'The next lesson is chosen for you, daily.' },
    { i: 'bolt',   t: 'Daily Streaks',        d: 'Small daily wins that compound into habit.' },
    { i: 'trophy', t: 'Achievements',         d: 'Badges for depth, not just for showing up.' },
    { i: 'shield', t: 'Certificates',         d: 'Verified proof of every module you finish.' },
    { i: 'wave',   t: 'Recent Activity',      d: 'Pick up exactly where you left off.' },
    { i: 'wand',   t: 'AI Recommendations',   d: 'What to revise tonight, decided by your data.' }
  ];

  var WHY = [
    { i: 'brain',  t: 'Built on your syllabus', d: 'Not a generic tutor. Every answer is grounded in the NCERT chapter you are actually studying.' },
    { i: 'mic',    t: 'Speaks your language',   d: 'English, Hindi or Hinglish — ask however you think, PAL replies the same way.' },
    { i: 'bolt',   t: 'Answers in seconds',     d: 'Streamed replies start speaking before the sentence is finished.' },
    { i: 'shield', t: 'Safe for classrooms',    d: 'Age-appropriate by design, with teacher and parent visibility built in.' },
    { i: 'graph',  t: 'Proof, not vibes',       d: 'Mastery is measured per chapter so effort turns into evidence.' },
    { i: 'users',  t: 'Made for Bharat',        d: 'Works on low-end phones and patchy networks, offline-first where it counts.' }
  ];

  var STEPS = [
    { n: '01', t: 'Create your space', d: 'Pick your class and board. Your syllabus loads instantly.' },
    { n: '02', t: 'Ask anything',      d: 'Tap the mic or type. PAL explains it in your own words.' },
    { n: '03', t: 'Practise adaptively',d: 'Tests get harder as you get better, and quietly step back when you struggle.' },
    { n: '04', t: 'See yourself improve',d: 'Analytics turn hours into a visible mastery curve.' }
  ];

  var JOURNEY = [
    { w: 'Week 1', t: 'Find your level',    d: 'A short diagnostic maps what you already know.' },
    { w: 'Week 2', t: 'Close the gaps',     d: 'PAL drills only the chapters that need it.' },
    { w: 'Week 4', t: 'Build the habit',    d: 'Streaks, arena battles and badges keep it daily.' },
    { w: 'Week 8', t: 'Walk into the exam', d: 'Full mock papers, timed, with instant analysis.' }
  ];

  var VOICES = [
    { q: 'I asked PAL why shadows are sharp and it explained with a torch and my own hand. I actually remembered it in the test.', n: 'Aarav B.', r: 'Class 6 · Indore' },
    { q: 'The arena is the only reason my class fights to solve maths at 8pm. The leaderboard does something a lecture cannot.', n: 'Mrs. Kulkarni', r: 'Maths teacher · Pune' },
    { q: 'My daughter used to hide her doubts. Now she just asks the tutor out loud, in Hinglish, and keeps going.', n: 'Rajesh S.', r: 'Parent · Bhopal' }
  ];

  var FAQ = [
    { q: 'Which classes and boards do you cover?', a: 'Classes 6 to 9 on the CBSE/NCERT syllabus today — Maths, Science, Social Science, English and Hindi, chapter by chapter.' },
    { q: 'Can I ask doubts by voice?', a: 'Yes. The AI Tutor is a live doubt call — tap the mic, ask in English, Hindi or Hinglish, and PAL answers out loud while a transcript builds beside you.' },
    { q: 'Does it work on a slow connection?', a: 'The interface is built for low-end phones and patchy networks. Lessons and notes stay available offline once opened.' },
    { q: 'How is this different from a search engine?', a: 'Answers are grounded in your chapter and your progress. PAL knows what you have already covered and what you got wrong last week.' },
    { q: 'Can teachers and parents see progress?', a: 'Yes. Teachers get class-wide mastery and test analytics; parents see streaks and progress without seeing every keystroke.' },
    { q: 'Is it free to start?', a: 'Creating an account and exploring Learn, PAL and practice questions is free. You can upgrade later for unlimited adaptive tests.' }
  ];

  var CSS =
  '#kh-root{position:relative;z-index:1;font-family:"Nunito",system-ui,sans-serif;color:rgba(255,255,255,.8);}' +
  '#kh-root *{box-sizing:border-box;}' +
  '#kh-root section{max-width:1180px;margin:0 auto;padding:clamp(64px,9vw,120px) clamp(20px,4vw,32px);}' +
  '#kh-root h1,#kh-root h2,#kh-root h3{color:#fff;letter-spacing:-.03em;line-height:1.08;margin:0;}' +
  '#kh-root p{margin:0;}' +
  '.kh-eyebrow{display:inline-flex;align-items:center;gap:9px;padding:7px 15px;border-radius:99px;' +
    'background:rgba(255,122,0,.12);border:1px solid rgba(255,122,0,.32);' +
    'font-size:12.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#FFB347;}' +
  '.kh-eyebrow .d{width:7px;height:7px;border-radius:50%;background:#FF7A00;box-shadow:0 0 10px #FF7A00;' +
    'animation:kh-blip 2s ease-in-out infinite;}' +
  '@keyframes kh-blip{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}' +

  /* ---- nav ---- */
  '#kh-nav{position:sticky;top:0;z-index:60;backdrop-filter:blur(24px) saturate(1.5);' +
    '-webkit-backdrop-filter:blur(24px) saturate(1.5);background:rgba(5,5,5,.6);' +
    'border-bottom:1px solid rgba(255,255,255,.1);transition:transform .4s cubic-bezier(.22,1,.36,1);}' +
  '#kh-nav.hide{transform:translateY(-100%);}' +
  '.kh-nav-in{max-width:1180px;margin:0 auto;padding:0 clamp(20px,4vw,32px);height:70px;' +
    'display:flex;align-items:center;gap:24px;}' +
  '.kh-logo{display:flex;align-items:center;gap:10px;font-weight:900;font-size:20px;color:#fff;' +
    'letter-spacing:-.02em;text-decoration:none;}' +
  '.kh-logo .m{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;color:#0A0A0A;' +
    'background:linear-gradient(135deg,#FF7A00,#FFB347);box-shadow:0 6px 18px rgba(255,122,0,.45);}' +
  '.kh-logo .m svg{width:19px;height:19px;}' +
  '.kh-nav-links{display:flex;gap:4px;margin-left:auto;}' +
  '.kh-nav-links a{padding:9px 15px;border-radius:99px;font-size:14px;font-weight:700;' +
    'color:rgba(255,255,255,.7);text-decoration:none;transition:all .3s ease;}' +
  '.kh-nav-links a:hover{color:#fff;background:rgba(255,255,255,.08);}' +
  /* the desktop size the two header CTAs used to carry inline */
  '.kh-nav-in .kh-btn{padding:11px 20px;font-size:14px;white-space:nowrap;flex-shrink:0;}' +
  '.kh-nav-in .kh-btn.p{padding:11px 22px;}' +
  /* .kh-nav-links carries margin-left:auto and is what pushes the CTAs right.
     Once it is hidden nothing does, so the logo takes over that job — but only
     here, or on desktop it would fight the links for the same space. */
  '@media(max-width:820px){.kh-nav-links{display:none;}' +
    '.kh-nav-in .kh-logo{margin-right:auto;}}' +

  /* ---- buttons ---- */
  '.kh-btn{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;border-radius:99px;' +
    'font-size:15px;font-weight:800;text-decoration:none;cursor:pointer;border:0;position:relative;overflow:hidden;' +
    'transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease,filter .3s ease;}' +
  '.kh-btn.p{background:linear-gradient(120deg,#FF7A00,#FFA726);color:#0A0A0A;' +
    'box-shadow:0 12px 34px rgba(255,122,0,.42),inset 0 1px 0 rgba(255,255,255,.4);}' +
  '.kh-btn.g{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.18);' +
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}' +
  '.kh-btn:hover{transform:translateY(-3px);filter:brightness(1.05);}' +
  '.kh-btn.p:hover{box-shadow:0 18px 46px rgba(255,122,0,.56);}' +
  '.kh-btn:active{transform:translateY(-1px) scale(.98);}' +
  '.kh-btn .ar{transition:transform .3s ease;}' +
  '.kh-btn:hover .ar{transform:translateX(4px);}' +

  /* ---- hero ---- */
  '#kh-hero{text-align:center;padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(40px,6vw,72px);}' +
  '#kh-hero h1{font-size:clamp(42px,7.4vw,84px);font-weight:900;margin:24px auto 0;max-width:16ch;}' +
  /* Solid, not clipped. A gradient headline needs color:transparent, and the
     ink law owns -webkit-text-fill-color platform-wide — the two fight and the
     word loses, rendering near-black on a near-black page. */
  '#kh-hero h1 .gr{color:#FFB347!important;-webkit-text-fill-color:#FFB347!important;' +
    'background:none!important;}' +
  '#kh-hero .sub{margin:22px auto 0;max-width:60ch;font-size:clamp(16px,1.9vw,19px);line-height:1.6;' +
    'color:rgba(255,255,255,.7);}' +
  '#kh-hero .cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:34px;}' +
  '#kh-hero .trust{display:flex;gap:26px;justify-content:center;flex-wrap:wrap;margin-top:38px;' +
    'font-size:13px;font-weight:700;color:rgba(255,255,255,.55);}' +
  '#kh-hero .trust span{display:inline-flex;align-items:center;gap:8px;}' +
  '#kh-hero .trust i{width:6px;height:6px;border-radius:50%;background:#FF7A00;font-style:normal;}' +

  /* hero orbit.
     --orb is the ring's diameter, and every node's distance from the centre is
     derived from it. That distance used to be written in vw — the viewport's
     width, not this element's — so on a wide screen the radius came out more
     than twice the ring's and the nodes were flung out of the circle and
     across the hero copy above it. */
  '.kh-orbit{--orb:min(560px,86vw);--node:58px;position:relative;width:var(--orb);height:var(--orb);' +
    'margin:44px auto 0;}' +
  /* .spin is inset:0 on the orbit and rotates, so its bounding box is the
     ring's diagonal — orb x 1.41. At 86vw that box is wider than the screen
     and it was extending the page by 33-35px on every phone size. The box is
     empty (only .node children paint, and they ride the ring), so clipping it
     costs nothing visually. overflow:clip rather than hidden: hidden would
     make #kh-root a scroll container and change how the page scrolls. */
  '#kh-root{overflow-x:clip;}' +
  '.kh-orbit .ring{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(255,255,255,.09);}' +
  '.kh-orbit .r2{inset:13%;border-color:rgba(255,122,0,.18);}' +
  '.kh-orbit .r3{inset:26%;border-color:rgba(255,255,255,.07);}' +
  '.kh-orbit .spin{position:absolute;inset:0;animation:kh-spin 34s linear infinite;}' +
  '.kh-orbit .spin.rev{animation-direction:reverse;animation-duration:46s;}' +
  '@keyframes kh-spin{to{transform:rotate(360deg)}}' +
  '.kh-orbit .node{position:absolute;width:var(--node);height:var(--node);border-radius:18px;display:grid;place-items:center;' +
    'background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);' +
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);' +
    'box-shadow:0 12px 30px rgba(0,0,0,.5);color:#FFB347;}' +
  '.kh-orbit .node svg{width:26px;height:26px;}' +
  '.kh-orbit .node i{display:block;animation:kh-unspin 34s linear infinite;}' +
  '.kh-orbit .spin.rev .node i{animation-duration:46s;animation-direction:reverse;}' +
  '@keyframes kh-unspin{to{transform:rotate(-360deg)}}' +
  '.kh-core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:40%;height:40%;' +
    'border-radius:50%;display:grid;place-items:center;text-align:center;' +
    'background:radial-gradient(circle at 34% 28%,rgba(255,208,138,.9),rgba(255,122,0,.85) 55%,rgba(150,60,0,.9));' +
    'box-shadow:0 0 70px rgba(255,122,0,.55),inset 0 2px 0 rgba(255,255,255,.4);' +
    'animation:kh-breathe 5s ease-in-out infinite;}' +
  '@keyframes kh-breathe{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.05)}}' +
  '.kh-core b{display:block;font-size:clamp(20px,3vw,30px);font-weight:900;color:#1A0E00;letter-spacing:-.02em;}' +
  '.kh-core span{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(26,14,0,.7);}' +

  /* ---- section heads ---- */
  '.kh-head{text-align:center;max-width:44ch;margin:0 auto clamp(38px,5vw,60px);}' +
  '.kh-head h2{font-size:clamp(30px,4.4vw,48px);font-weight:900;margin-top:18px;}' +
  '.kh-head p{margin-top:16px;font-size:16px;line-height:1.6;color:rgba(255,255,255,.65);}' +

  /* ---- glass grid ---- */
  '.kh-grid{display:grid;gap:16px;}' +
  /* min(Npx,100%) rather than a bare Npx floor: minmax(360px,1fr) is a hard
     360px minimum, so on a 320px phone the track stayed 360px wide and pushed
     the whole page past the screen edge — the homepage laid out at 380px on a
     320px device. min() lets the track fall back to the container's width
     when the container is the smaller of the two, which is the only case
     where the floor was doing harm. Above these widths nothing changes. */
  '.kh-g4{grid-template-columns:repeat(auto-fit,minmax(min(230px,100%),1fr));}' +
  '.kh-g3{grid-template-columns:repeat(auto-fit,minmax(min(290px,100%),1fr));}' +
  '.kh-g2{grid-template-columns:repeat(auto-fit,minmax(min(360px,100%),1fr));}' +
  '.kh-card{position:relative;overflow:hidden;padding:24px;border-radius:22px;' +
    'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);' +
    'backdrop-filter:blur(20px) saturate(1.4);-webkit-backdrop-filter:blur(20px) saturate(1.4);' +
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.13),0 16px 40px rgba(0,0,0,.42);' +
    'transition:transform .45s cubic-bezier(.22,1,.36,1),border-color .45s ease,' +
      'box-shadow .45s ease,background .45s ease;text-decoration:none;display:block;}' +
  '.kh-card::after{content:"";position:absolute;inset:-1px;border-radius:22px;pointer-events:none;opacity:0;' +
    'background:radial-gradient(420px circle at var(--mx,50%) var(--my,0%),rgba(255,122,0,.18),transparent 60%);' +
    'transition:opacity .4s ease;}' +
  '.kh-card:hover{transform:translateY(-7px);background:rgba(255,255,255,.1);' +
    'border-color:rgba(255,122,0,.45);' +
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 26px 60px rgba(0,0,0,.55),0 0 44px rgba(255,122,0,.2);}' +
  '.kh-card:hover::after{opacity:1;}' +
  '.kh-ic{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;margin-bottom:16px;color:#FFB347;' +
    'background:rgba(255,122,0,.14);box-shadow:inset 0 0 0 1px rgba(255,122,0,.3);' +
    'transition:transform .45s cubic-bezier(.34,1.56,.64,1),background .35s ease;}' +
  '.kh-ic svg{width:23px;height:23px;}' +
  '.kh-card:hover .kh-ic{transform:scale(1.14) rotate(-8deg);background:rgba(255,122,0,.26);}' +
  '.kh-card h3{font-size:17px;font-weight:800;margin-bottom:7px;letter-spacing:-.01em;}' +
  '.kh-card p{font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.62);}' +
  '.kh-tag{position:absolute;top:16px;right:16px;font-size:9.5px;font-weight:900;letter-spacing:.1em;' +
    'padding:4px 9px;border-radius:99px;background:linear-gradient(100deg,#FF7A00,#FFB347);color:#0A0A0A;}' +

  /* ---- stats ---- */
  '.kh-stat b{display:block;font-size:clamp(34px,4.6vw,46px);font-weight:900;color:#fff;line-height:1;' +
    'font-variant-numeric:tabular-nums;letter-spacing:-.03em;}' +
  '.kh-stat b em{font-style:normal;background:linear-gradient(115deg,#FF7A00,#FFB347);' +
    '-webkit-background-clip:text;background-clip:text;color:transparent;}' +
  '.kh-stat .l{display:block;margin-top:10px;font-size:14px;font-weight:800;color:#fff;}' +
  '.kh-stat .s{display:block;margin-top:4px;font-size:12.5px;color:rgba(255,255,255,.55);}' +

  /* ---- steps / timeline ---- */
  '.kh-step{position:relative;padding-left:60px;}' +
  '.kh-step .n{position:absolute;left:0;top:0;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;' +
    'font-weight:900;font-size:15px;color:#0A0A0A;background:linear-gradient(135deg,#FF7A00,#FFB347);' +
    'box-shadow:0 8px 22px rgba(255,122,0,.4);}' +
  '.kh-step h3{font-size:17px;font-weight:800;margin-bottom:7px;}' +
  '.kh-step p{font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.62);}' +
  '.kh-tl{position:relative;padding-left:34px;}' +
  '.kh-tl::before{content:"";position:absolute;left:9px;top:6px;bottom:6px;width:2px;border-radius:2px;' +
    'background:linear-gradient(180deg,#FF7A00,rgba(255,122,0,.1));}' +
  '.kh-tl-item{position:relative;padding:0 0 30px 4px;}' +
  '.kh-tl-item::before{content:"";position:absolute;left:-30px;top:5px;width:12px;height:12px;border-radius:50%;' +
    'background:#FF7A00;box-shadow:0 0 0 4px rgba(255,122,0,.18),0 0 16px #FF7A00;}' +
  '.kh-tl-item .w{font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#FFB347;}' +
  '.kh-tl-item h3{font-size:17px;font-weight:800;margin:6px 0 6px;}' +
  '.kh-tl-item p{font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.62);}' +

  /* ---- testimonials ---- */
  '.kh-quote{font-size:15px;line-height:1.65;color:rgba(255,255,255,.82);}' +
  '.kh-who{display:flex;align-items:center;gap:11px;margin-top:20px;padding-top:18px;' +
    'border-top:1px solid rgba(255,255,255,.1);}' +
  '.kh-who .av{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-weight:900;' +
    'color:#0A0A0A;background:linear-gradient(135deg,#FF7A00,#FFB347);}' +
  '.kh-who b{display:block;font-size:13.5px;color:#fff;}' +
  '.kh-who span{font-size:12px;color:rgba(255,255,255,.55);}' +
  '.kh-stars{color:#FFB347;font-size:13px;letter-spacing:2px;margin-bottom:14px;}' +

  /* ---- FAQ ---- */
  '.kh-faq{border:1px solid rgba(255,255,255,.13);border-radius:18px;background:rgba(255,255,255,.05);' +
    'backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);margin-bottom:12px;overflow:hidden;' +
    'transition:border-color .35s ease,background .35s ease;}' +
  '.kh-faq[open]{border-color:rgba(255,122,0,.42);background:rgba(255,122,0,.07);}' +
  '.kh-faq summary{list-style:none;cursor:pointer;padding:20px 22px;font-size:15.5px;font-weight:800;color:#fff;' +
    'display:flex;align-items:center;gap:14px;}' +
  '.kh-faq summary::-webkit-details-marker{display:none;}' +
  '.kh-faq summary .pm{margin-left:auto;width:26px;height:26px;border-radius:8px;flex-shrink:0;' +
    'display:grid;place-items:center;background:rgba(255,122,0,.16);color:#FFB347;font-weight:900;' +
    'transition:transform .35s cubic-bezier(.22,1,.36,1);}' +
  '.kh-faq[open] summary .pm{transform:rotate(45deg);}' +
  '.kh-faq .a{padding:0 22px 20px 22px;font-size:14px;line-height:1.65;color:rgba(255,255,255,.68);}' +

  /* ---- final CTA + footer ---- */
  '#kh-cta{text-align:center;position:relative;overflow:hidden;border-radius:32px;' +
    'padding:clamp(48px,7vw,84px) clamp(24px,5vw,60px);margin:0 clamp(20px,4vw,32px) 40px;' +
    'background:linear-gradient(140deg,rgba(255,122,0,.2),rgba(255,255,255,.05));' +
    'border:1px solid rgba(255,122,0,.3);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);' +
    'box-shadow:0 30px 80px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.16);}' +
  '#kh-cta h2{font-size:clamp(30px,4.6vw,50px);font-weight:900;max-width:18ch;margin:18px auto 0;}' +
  '#kh-cta p{margin:18px auto 0;max-width:52ch;font-size:16px;line-height:1.6;color:rgba(255,255,255,.7);}' +
  '#kh-cta .cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:32px;}' +
  '#kh-foot{border-top:1px solid rgba(255,255,255,.1);}' +
  '.kh-foot-in{max-width:1180px;margin:0 auto;padding:44px clamp(20px,4vw,32px);' +
    'display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start;}' +
  '.kh-foot-in .c{min-width:170px;}' +
  '.kh-foot-in h4{font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;' +
    'color:rgba(255,255,255,.45);margin:0 0 14px;}' +
  '.kh-foot-in a{display:block;font-size:13.5px;font-weight:600;color:rgba(255,255,255,.68);' +
    'text-decoration:none;padding:5px 0;transition:color .25s ease,transform .25s ease;}' +
  '.kh-foot-in a:hover{color:#FFB347;transform:translateX(3px);}' +
  '.kh-copy{max-width:1180px;margin:0 auto;padding:0 clamp(20px,4vw,32px) 40px;' +
    'font-size:12.5px;color:rgba(255,255,255,.4);}' +

  '.kh-rv{opacity:1;transform:translateY(16px);' +
    'transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1);}' +
  '.kh-rv.in{transform:none;}' +

  /* ---------- phone ----------
     The orbit nodes are 58px squares centred ON the ring, so they reach
     orb/2 + 29px from the centre. At 86vw that is 195px from centre on a
     320px screen — 70px past the section's content edge. Sizing the ring so
     the nodes land inside is the difference between a decoration and a row of
     icons hanging off the page. */
  '@media(max-width:600px){' +
    '.kh-orbit{--orb:min(560px,62vw);--node:46px;margin-top:32px;}' +
    '.kh-orbit .node{border-radius:14px;}' +
    '.kh-orbit .node svg{width:21px;height:21px;}' +
    /* The header keeps a logo and two CTAs. At 320px "Log in" wrapped onto
       two lines and "Start learning free" ran off the right edge, so the
       first thing on the page was a broken row. Tighten the row, shorten the
       primary label's padding, and let the logo give up space first. */
    '.kh-nav-in{height:60px;gap:10px;padding:0 14px;}' +
    '.kh-logo{font-size:17px;min-width:0;}' +
    '.kh-logo .m{width:28px;height:28px;flex-shrink:0;}' +
    '.kh-nav-in .kh-btn{padding:10px 14px;font-size:13.5px;}' +
    '.kh-nav-in .kh-btn.p{padding:10px 15px;}' +
    '.kh-nav-in .kh-btn .ar{display:none;}' +
    /* a 1180px footer row of 170px columns collapses to one readable column */
    '.kh-foot-in{gap:20px;}' +
    '.kh-foot-in .c{min-width:min(170px,100%);}' +
  '}' +

  /* ---------- touch ----------
     900px, not 600px: a phone held sideways is 667px and a tablet 768px.
     Footer links were a 32px row at both, and the header wordmark had no
     minimum height. */
  '@media(max-width:900px){' +
    '.kh-foot-in a{padding:11px 0;min-height:44px;display:flex;align-items:center;}' +
    '.kh-nav-in .kh-logo{min-height:44px;}' +
    '.kh-nav-in .kh-btn{min-height:44px;}' +
  '}' +

  /* Narrow phones: the wordmark and two CTAs cannot share 292px. The mark is
     the part that still identifies the site at a glance, so the word goes and
     the buttons keep their labels — the reverse leaves two buttons nobody can
     read next to a logo nobody needed. */
  '@media(max-width:420px){' +
    '.kh-nav-in{gap:8px;}' +
    '.kh-logo{font-size:0;gap:0;flex-shrink:0;}' +
    '.kh-logo .m{font-size:19px;}' +
    '.kh-nav-in .kh-btn{padding:10px 13px;font-size:13px;}' +
  '}' +

  '@media(prefers-reduced-motion:reduce){.kh-rv{opacity:1;transform:none;}' +
    '.kh-orbit .spin,.kh-core,.kh-orbit .node i{animation:none!important;}}';

  function ic(name) { return I[name] || I.spark || ''; }

  function cards(list, cls) {
    return list.map(function (f) {
      var tag = f.tag ? '<span class="kh-tag">' + f.tag + '</span>' : '';
      var open = f.h ? '<a class="kh-card kh-rv" href="' + f.h + '">' : '<div class="kh-card kh-rv">';
      var close = f.h ? '</a>' : '</div>';
      return open + tag + '<span class="kh-ic">' + ic(f.i) + '</span>' +
        '<h3>' + f.t + '</h3><p>' + f.d + '</p>' + close;
    }).join('');
  }

  function build() {
    if (document.getElementById('kh-root')) return;
    var style = document.createElement('style');
    style.id = 'kh-css';
    style.textContent = CSS;
    document.head.appendChild(style);

    var root = document.createElement('div');
    root.id = 'kh-root';

    /* Four nodes on the outer ring, four on the inner one (r2, inset 13%), the
       inner set offset by 45° so the two rings interleave instead of hiding
       each other.

       Each node sits dead centre and is pushed out along its own angle:
         rotate(a) -> translateY(-radius) -> rotate(-a)
       The trailing rotate cancels the first, so the tile stays upright at
       every angle instead of lying on its side at 90° and upside down at 180°.
       Radii come from --orb, so they track the ring the node belongs to at any
       viewport width. */
    var orbitNodes = ['brain', 'mic', 'target', 'trophy', 'book', 'code', 'graph', 'chat'];
    var orbit = orbitNodes.map(function (n, i) {
      var outer = i < 4;
      var ang = (i % 4) * 90 + (outer ? 0 : 45);
      /* outer ring: half the diameter. inner ring r2 is inset 13% a side, so
         its radius is (50% - 13%) = 37% of the diameter. */
      var radius = outer ? 'calc(var(--orb) * 0.5)' : 'calc(var(--orb) * 0.37)';
      /* The centring offset is half the node's size. Writing it as a literal
         29px silently assumed the node is always 58px, so shrinking the node
         for phones would have pushed all eight off-centre. --node owns the
         size and the offset follows it. */
      return '<div class="spin' + (outer ? '' : ' rev') + '" style="animation-delay:' + (-i * 4) + 's">' +
        '<span class="node" style="left:calc(50% - var(--node) / 2);top:calc(50% - var(--node) / 2);' +
        'transform:rotate(' + ang + 'deg) translateY(calc(-1 * ' + radius + ')) rotate(' + (-ang) + 'deg)">' +
        '<i>' + ic(n) + '</i></span></div>';
    }).join('');

    root.innerHTML =
      /* ---------- nav ---------- */
      '<header id="kh-nav"><div class="kh-nav-in">' +
        '<a class="kh-logo" href="index.html"><span class="m">' + ic('spark') + '</span>BestBrain</a>' +
        '<nav class="kh-nav-links">' +
          '<a href="#features">Features</a><a href="#how">How it works</a>' +
          '<a href="#journey">Journey</a><a href="#voices">Stories</a><a href="#faq">FAQ</a>' +
        '</nav>' +
        /* Sizing lives in .kh-nav-in .kh-btn, not in a style attribute: an
           inline padding/font-size outranks every media query, so the phone
           rules could not shrink these and the header ran off the screen. */
        '<a class="kh-btn g" href="login.html">Log in</a>' +
        '<a class="kh-btn p" href="signup.html">Start free ' +
          '<span class="ar">→</span></a>' +
      '</div></header>' +

      /* ---------- hero ---------- */
      '<section id="kh-hero">' +
        '<span class="kh-eyebrow kh-rv"><span class="d"></span>AI powered learning for Bharat</span>' +
        '<h1 class="kh-rv">Your doubt, answered <span class="gr">out loud</span>, in seconds.</h1>' +
        '<p class="sub kh-rv">BestBrain is an AI tutor that knows your syllabus. Ask in English, Hindi or ' +
          'Hinglish — get an explanation, a practice set and proof you improved.</p>' +
        '<div class="cta kh-rv">' +
          '<a class="kh-btn p" href="signup.html">Start learning free <span class="ar">→</span></a>' +
          '<a class="kh-btn g" href="tutor.html">Try the AI Tutor 🎙️</a>' +
        '</div>' +
        '<div class="trust kh-rv">' +
          '<span><i></i>No credit card needed</span>' +
          '<span><i></i>Classes 6–9 · CBSE</span>' +
          '<span><i></i>Works offline-first</span>' +
        '</div>' +
        '<div class="kh-orbit kh-rv">' +
          '<div class="ring"></div><div class="ring r2"></div><div class="ring r3"></div>' + orbit +
          '<div class="kh-core"><div><b>PAL</b><span>AI tutor</span></div></div>' +
        '</div>' +
      '</section>' +

      /* ---------- stats ---------- */
      '<section id="stats">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>By the numbers</span>' +
          '<h2>A platform students actually finish.</h2>' +
          '<p>Not a content dump — a measured learning system with enough depth to last a whole academic year.</p></div>' +
        '<div class="kh-grid kh-g4">' +
          STATS.map(function (s) {
            return '<div class="kh-card kh-stat kh-rv"><b data-to="' + s.n + '">0<em>' + s.suf + '</em></b>' +
              '<span class="l">' + s.l + '</span><span class="s">' + s.s + '</span></div>';
          }).join('') +
        '</div>' +
      '</section>' +

      /* ---------- features ---------- */
      '<section id="features">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>Everything inside</span>' +
          '<h2>One platform. Nineteen ways to get better.</h2>' +
          '<p>Every surface is connected — what you learn feeds what you practise, and what you practise feeds what PAL recommends next.</p></div>' +
        '<div class="kh-grid kh-g4">' + cards(FEATURES) + '</div>' +
      '</section>' +

      /* ---------- why ---------- */
      '<section id="why">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>Why BestBrain</span>' +
          '<h2>Built for how Indian students actually study.</h2>' +
          '<p>Not a western tutor with a translation layer bolted on.</p></div>' +
        '<div class="kh-grid kh-g3">' + cards(WHY) + '</div>' +
      '</section>' +

      /* ---------- how ---------- */
      '<section id="how">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>How it works</span>' +
          '<h2>Four steps from doubt to mastery.</h2></div>' +
        '<div class="kh-grid kh-g2">' +
          STEPS.map(function (s) {
            return '<div class="kh-card kh-step kh-rv"><span class="n">' + s.n + '</span>' +
              '<h3>' + s.t + '</h3><p>' + s.d + '</p></div>';
          }).join('') +
        '</div>' +
      '</section>' +

      /* ---------- journey ---------- */
      '<section id="journey">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>Learning journey</span>' +
          '<h2>What eight weeks looks like.</h2></div>' +
        '<div class="kh-tl">' +
          JOURNEY.map(function (j) {
            return '<div class="kh-tl-item kh-rv"><span class="w">' + j.w + '</span>' +
              '<h3>' + j.t + '</h3><p>' + j.d + '</p></div>';
          }).join('') +
        '</div>' +
      '</section>' +

      /* ---------- testimonials ---------- */
      '<section id="voices">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>Stories</span>' +
          '<h2>Students, teachers and parents.</h2></div>' +
        '<div class="kh-grid kh-g3">' +
          VOICES.map(function (v) {
            return '<div class="kh-card kh-rv"><div class="kh-stars">★★★★★</div>' +
              '<p class="kh-quote">“' + v.q + '”</p>' +
              '<div class="kh-who"><span class="av">' + v.n.charAt(0) + '</span>' +
              '<span><b>' + v.n + '</b><span>' + v.r + '</span></span></div></div>';
          }).join('') +
        '</div>' +
      '</section>' +

      /* ---------- faq ---------- */
      '<section id="faq">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>FAQ</span>' +
          '<h2>Questions, answered.</h2></div>' +
        '<div style="max-width:820px;margin:0 auto">' +
          FAQ.map(function (f) {
            return '<details class="kh-faq kh-rv"><summary>' + f.q + '<span class="pm">+</span></summary>' +
              '<div class="a">' + f.a + '</div></details>';
          }).join('') +
        '</div>' +
      '</section>' +

      /* ---------- cta ---------- */
      '<div id="kh-cta" class="kh-rv">' +
        '<span class="kh-eyebrow"><span class="d"></span>Start today</span>' +
        '<h2>Ask your first doubt in the next two minutes.</h2>' +
        '<p>Create a free account, pick your class, and tap the mic. PAL takes it from there.</p>' +
        '<div class="cta">' +
          '<a class="kh-btn p" href="signup.html">Create free account <span class="ar">→</span></a>' +
          '<a class="kh-btn g" href="dashboard.html">Explore the dashboard</a>' +
        '</div>' +
      '</div>' +

      /* ---------- footer ---------- */
      '<footer id="kh-foot"><div class="kh-foot-in">' +
        '<div class="c" style="flex:1;min-width:240px">' +
          '<a class="kh-logo" href="index.html" style="margin-bottom:14px"><span class="m">' + ic('spark') + '</span>BestBrain</a>' +
          '<p style="font-size:13.5px;line-height:1.6;color:rgba(255,255,255,.55);max-width:34ch">' +
            'AI-powered learning for Classes 6–9. Built in India, for Indian classrooms.</p>' +
        '</div>' +
        '<div class="c"><h4>Learn</h4><a href="learn.html">Chapters</a><a href="videos.html">Video lectures</a>' +
          '<a href="lesson.html">Lessons</a><a href="live.html">Live classes</a></div>' +
        '<div class="c"><h4>Practise</h4><a href="mocktest.html">Mock tests</a><a href="challenge.html">Arena</a>' +
          '<a href="dashboard.html">Dashboard</a></div>' +
        '<div class="c"><h4>AI</h4><a href="tutor.html">AI Tutor</a><a href="pal.html">PAL chat</a></div>' +
        '<div class="c"><h4>Account</h4><a href="login.html">Log in</a><a href="signup.html">Sign up</a></div>' +
      '</div>' +
      '<div class="kh-copy">© 2026 BestBrain · Learn smart, score better.</div></footer>';

    /* Static pages own their DOM, so their content is removed outright. Under
       the router it is only HIDDEN: React still owns those nodes, and deleting
       them leaves its tree describing a page that no longer exists — the next
       render then throws. Hiding is reversible, which is exactly what leaving
       the home route needs. */
    if (SPA) {
      var host = document.getElementById('root');
      if (host) host.style.display = 'none';
    } else {
      Array.prototype.slice.call(document.body.children).forEach(function (n) {
        if (n.classList && (n.classList.contains('kb-sky') || n.id === 'pal-mascot')) return;
        if (n.tagName === 'SCRIPT') return;
        n.remove();
      });
    }
    document.body.appendChild(root);
    document.body.style.padding = '0';

    wire();
  }

  function wire() {
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* scroll reveal + count-up */
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        var num = e.target.querySelector && e.target.querySelector('b[data-to]');
        if (num && !num.dataset.done) { num.dataset.done = '1'; countUp(num); }
        io.unobserve(e.target);
      });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('.kh-rv').forEach(function (n, i) {
      if (reduce) { n.classList.add('in'); return; }

      /* The hero is above the fold, and it was starting at opacity:0 — so the
         first thing a visitor saw was an empty page waiting for an observer.
         An entrance is only worth having where the reader has not arrived
         yet. Anything already on screen is shown at once. */
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.05) { n.classList.add('in'); return; }

      n.style.transitionDelay = ((i % 8) * 60) + 'ms';
      io.observe(n);
    });

    /* and nothing may stay hidden because an observer never fired */
    setTimeout(function () {
      document.querySelectorAll('.kh-rv:not(.in)').forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.5) n.classList.add('in');
      });
    }, 400);

    function countUp(el) {
      var to = parseInt(el.dataset.to, 10);
      var suf = el.querySelector('em') ? el.querySelector('em').outerHTML : '';
      if (reduce) { el.innerHTML = to.toLocaleString('en-IN') + suf; return; }
      var t0 = null, dur = 1500;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var v = Math.round(to * (1 - Math.pow(1 - p, 3)));
        el.innerHTML = v.toLocaleString('en-IN') + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    /* cursor-tracked glow on glass cards */
    if (!reduce) {
      document.addEventListener('pointermove', function (e) {
        var c = e.target.closest ? e.target.closest('.kh-card') : null;
        if (!c) return;
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      }, { passive: true });
    }

    /* navbar hide on scroll down, show on scroll up */
    var nav = document.getElementById('kh-nav'), last = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      nav.classList.toggle('hide', y > 220 && y > last);
      last = y;
    }, { passive: true });

    /* smooth in-page nav */
    document.querySelectorAll('.kh-nav-links a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.querySelector(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  function unmount() {
    var root = document.getElementById('kh-root');
    if (root) root.remove();
    var host = document.getElementById('root');
    if (host) host.style.display = '';
    document.body.style.padding = '';
  }

  function sync() {
    if (onHome()) {
      if (!document.getElementById('kh-root')) build();
    } else {
      unmount();
    }
  }

  function start() {
    sync();
    if (!SPA) return;
    ['pushState', 'replaceState'].forEach(function (m) {
      var orig = history[m];
      history[m] = function () {
        var r = orig.apply(this, arguments);
        setTimeout(sync, 60);
        return r;
      };
    });
    window.addEventListener('popstate', function () { setTimeout(sync, 60); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
