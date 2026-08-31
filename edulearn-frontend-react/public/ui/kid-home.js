/* ============================================================
   BESTBRAIN — HOMEPAGE
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

  // Every card either links straight to the real feature (h) or, if there's
  // nowhere to send a click yet, expands in place to show one concrete
  // example (ex) — see cards() below. Copy throughout is written for a
  // Class 6 reader: short sentences, one real example per feature, second
  // person, no jargon ("adaptive", "entitlement", "mastery" etc. rewritten
  // into things that actually happen to a kid using the app).
  var FEATURES = [
    { i: 'graph',  t: 'Dashboard',            d: 'One page that shows everything you did this week — minutes studied, chapters finished, your streak.', h: 'dashboard.html' },
    { i: 'mic',    t: 'AI Tutor',             d: 'Stuck on something? Just say it out loud. PAL explains it back like a teacher sitting right next to you.', h: 'tutor.html', tag: 'NEW' },
    { i: 'target', t: 'Practice Tests',       d: 'Questions that get a little harder every time you get one right — like leveling up in a game.', h: 'mocktest.html' },
    { i: 'trophy', t: 'Arena',                d: 'The same question goes out to your whole school at once. Answer fast, climb the live leaderboard.', h: 'challenge.html' },
    { i: 'chat',   t: 'PAL',                  d: 'Type or talk to PAL in English or Hinglish — it explains chapters, makes quizzes, and never gets tired of "why?"', h: 'pal.html' },
    { i: 'book',   t: 'Learn',                d: 'Your whole syllabus, one chapter at a time, ready whenever you want to open it.', h: 'learn.html' },
    { i: 'video',  t: 'Live Classes',         d: 'Book a class and walk straight into a real online classroom with a real teacher.', h: 'live.html' },
    { i: 'eye',    t: 'Attention Monitoring', d: "Gently checks if you're focused in live class so your parents and teacher know how it went — your video itself never leaves your device.", h: 'live.html' },
    { i: 'graph',  t: 'Performance Analytics',d: 'Shows exactly what you’re strong at and what needs more practice — like "great at Fractions, needs Decimals".', ex: "You'll see a simple chart: strong in Fractions, needs a bit more practice in Decimals — so you know exactly what to open next." },
    { i: 'spark',  t: 'AI Feedback',          d: 'Get 8 out of 10 on a quiz? PAL tells you exactly why the other 2 were wrong, not just the score.', ex: 'Score 8/10 and PAL walks you through the 2 you missed — so next time you actually know why, not just what.' },
    { i: 'bolt',   t: 'Progress Tracking',    d: 'A bar that fills up as you finish a chapter, so you can see your own progress grow.', ex: "Finish 3 out of 5 topics in a chapter and watch your progress bar jump straight to 60%." },
    { i: 'users',  t: 'Leaderboard',          d: 'See exactly where you rank — in your class, your school, even your whole city.', ex: "Top the weekly Maths quiz and see your name at #1 for your class — updated live, not once a month." },
    { i: 'code',   t: 'Coding Challenges',    d: 'Learn to code with tiny, fun puzzles — perfect if you’ve never written a line of code before.', ex: 'Write your very first "if this happens, then do that" rule — and watch it actually run.' },
    { i: 'shield', t: 'Mock Interviews',      d: 'Practise saying your answers out loud and get instant, friendly tips on how to say them better.', ex: 'Practise answering "Tell me about yourself" out loud, and get a tip on speaking clearer next time.' },
    { i: 'cap',    t: 'Question Bank',        d: 'Thousands of practice questions, sorted so you only see the ones from your chapter. No timer, no marks — answer, see why it was right, keep going.', h: 'bank.html' },
    { i: 'brain',  t: 'Personalised Learning',d: 'PAL quietly notices what you’re weak in and picks tomorrow’s lesson to fix exactly that.', ex: "Struggling with Grammar this week? Tomorrow's first lesson quietly starts there instead of somewhere random." },
    { i: 'bolt',   t: 'Daily Streaks',        d: 'Study a little bit every day and watch your streak count go up — small wins that add up fast.', ex: 'Study 5 days in a row and unlock your first streak badge — day 6 gets even easier to show up for.' },
    { i: 'trophy', t: 'Achievements',         d: 'Badges you earn for really understanding a topic — not just for logging in.', ex: "Really master every topic in Algebra and unlock the 'Algebra Ace' badge — not given, earned." },
    { i: 'shield', t: 'Certificates',         d: 'Finish a full module and get a real certificate with your name on it.', ex: "Complete the 'Living Things' module and download a certificate with your own name on it." },
    { i: 'wave',   t: 'Recent Activity',      d: 'One tap and you’re back exactly where you left off — no hunting for the right chapter.', ex: "Left off on Question 7 last night? One tap on the homepage and you're back on Question 7." },
    { i: 'wand',   t: 'AI Recommendations',   d: 'Every evening, PAL tells you the one thing worth revising tonight — decided from how you actually did.', ex: 'PAL might say: "Revise Light & Shadows tonight — you missed 2 questions on it yesterday."' },

    /* ---- pages that shipped without a card here ----
       Each of these is a real, wired surface — videos.html, homework.html,
       create-test.html (with upload.html and homework-assign.html beside it),
       the KidPDF panel and the dashboard's Plus card. Every one of them was
       reachable only from inside Learn or the dashboard, so the person
       deciding whether to sign up was the one person who never saw them. */
    { i: 'video',  t: 'Video Lectures',       d: 'Recorded lessons for your class and subject — watch the chapter explained first, then go answer the questions.', h: 'videos.html' },
    { i: 'pencil', t: 'Homework',             d: 'Work your teacher sets for your class, with a due date. Answer it here and it gets marked the second you hit submit.', h: 'homework.html' },
    { i: 'ruler',  t: 'Teacher Studio',       d: 'Teachers build a timed, auto-marked test in minutes, set homework straight from the question bank, and upload their own videos and notes.', h: 'create-test.html' },
    { i: 'bulb',   t: 'PDF Study Sheets',     d: 'Type any topic and PAL writes you a neat one-page study sheet — read it on screen or save it as a PDF for later.', ex: 'Type "Light and Shadows" and get a printable sheet: what it means, the diagram to remember, and a few questions to try.' },
    { i: 'rocket', t: 'BestBrain Plus',       d: 'Free to start. Plus unlocks every class and subject and takes the cap off your PAL doubts — your coin balance sits right on your dashboard.', h: 'dashboard.html' }
  ];

  /* Sample lessons. These are the real animated lectures that sit inside
     Learn, not a marketing reel — the same Class 6 Science chapter a student
     opens after signing up.

     public/sampleVideos/ holds the TRANSCODED set and nothing else. The
     originals are 720p at 5.7-7.0 Mbps (402MB for 8.5 minutes), roughly four
     times the bitrate animation at this size needs; re-encoded at CRF 26 they
     measure SSIM 0.99 against the source and weigh 61MB all in.

     The originals deliberately live OUTSIDE public/, in
     edulearn-frontend-react/media-src/sampleVideos-originals/. Vite copies
     everything under public/ into dist/ verbatim — with the originals still
     in there a production build came out at 464MB, shipping 402MB nobody can
     ever watch. Anything in public/ is something the browser can download.

     Replacing one of these means transcoding it the same way first. See
     public/sampleVideos/README.md for the exact ffmpeg command.

     `d` is the duration label only; the real duration comes from the file. */
  /* Copy note: kid-quiz.js rewrites the visible word "test" to "quiz" across
     every page, which is right for the product's own noun and wrong for a
     science one — "the starch test" rendered as "the starch quiz". Say
     experiment here. */
  var SAMPLES = [
    { f: '2', cls: 'Class 6 · Science', d: '2:58',
      t: 'Do plants really need sunlight?',
      p: 'Three pots, three different spots. Watch what happens to the one kept in the dark — and find out what a plant is actually eating.' },
    { f: '3', cls: 'Class 6 · Science', d: '2:45',
      t: 'Boiling a leaf to find its food',
      p: 'Animals take their food. Plants make it. Hot water, then alcohol, then iodine — the experiment that shows the starch hiding inside an ordinary leaf.' },
    { f: '4', cls: 'Class 6 · Science', d: '2:48',
      t: 'Meet chlorophyll, the food-maker',
      p: 'The green stuff inside every leaf introduces itself — and shows you exactly what it needs from the sunlight and the water to cook a plant its dinner.' }
  ];

  var WHY = [
    { i: 'brain',  t: 'Built on your syllabus', d: 'Not a generic tutor. Every answer is grounded in the NCERT chapter you are actually studying.' },
    { i: 'mic',    t: 'Speaks your language',   d: 'English, Hindi or Hinglish — ask however you think, PAL replies the same way.' },
    { i: 'bolt',   t: 'Answers in seconds',     d: 'Streamed replies start speaking before the sentence is finished.' },
    { i: 'shield', t: 'Safe for classrooms',    d: 'Age-appropriate by design, with teacher and parent visibility built in.' },
    { i: 'graph',  t: 'Proof, not vibes',       d: 'Mastery is measured per chapter so effort turns into evidence.' },
    { i: 'users',  t: 'Made for Bharat',        d: 'Works on low-end phones and patchy networks, offline-first where it counts.' }
  ];

  var ROLES = [
    { i: 'target', t: 'Student',  d: 'Your own dashboard — streak, minutes studied and badges earned — plus PAL telling you exactly what to revise tonight.' },
    { i: 'shield', t: 'Parent',   d: "See your child's progress and live-class attention score without watching every keystroke. No separate app to install." },
    { i: 'cap',    t: 'Teacher',  d: 'Class roster, chapter-wise averages and live-class attendance, grounded in real submitted work — not guesses. Build a timed test, set homework from the question bank, upload your own lecture videos and notes.' }
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
    { q: 'Is it free to start?', a: 'Yes. Creating an account and exploring Learn, the question bank, PAL and practice questions is free. BestBrain Plus is an optional monthly upgrade that unlocks every class and subject and removes the cap on PAL doubts.' }
  ];

  var CSS =
  /* ---------- accent ----------
     One place to change the landing page's accent. Everything below reads
     these instead of repeating a hex 27 times, which is what made the old
     amber impossible to retheme.

     Violet replaces the amber. Contrast, against the values this page
     actually paints on:
       #0A0A0A ink on #A855F7 fill  -> 5.0:1  (CTA label, needs 4.5)
       #C084FC text on the #050505 ground -> 7.7:1  (eyebrow, labels)
     The primary button keeps dark ink rather than white: white on #A855F7
     is only 3.9:1 and would fail at body size.

     --kh-accent-rgb carries the same colour as bare channels so the many
     rgba(...) glows can keep their own alpha. */
  ':root{--kh-accent:#A855F7;--kh-accent-soft:#C084FC;--kh-accent-deep:#7E22CE;' +
    '--kh-accent-rgb:168,85,247;--kh-accent-soft-rgb:192,132,252;' +
    /* the lit and shadowed ends of the PAL sphere's gradient */
    '--kh-accent-hi-rgb:233,213,255;--kh-accent-deep-rgb:76,29,149;' +
    /* One hairline for every neutral edge on the page. It used to be nine
       different alphas between .07 and .18, which over a near-black ground
       reads as some borders black and some grey. */
    '--kh-line:rgba(255,255,255,.14);}' +
  '#kh-root{position:relative;z-index:1;font-family:"Nunito",system-ui,sans-serif;color:rgba(255,255,255,.8);}' +
  '#kh-root *{box-sizing:border-box;}' +
  '#kh-root section{max-width:1180px;margin:0 auto;padding:clamp(64px,9vw,120px) clamp(20px,4vw,32px);}' +
  '#kh-root h1,#kh-root h2,#kh-root h3{color:#fff;letter-spacing:-.03em;line-height:1.08;margin:0;}' +
  '#kh-root p{margin:0;}' +
  '.kh-eyebrow{display:inline-flex;align-items:center;gap:9px;padding:7px 15px;border-radius:99px;' +
    'background:rgba(var(--kh-accent-rgb),.12);border:1px solid rgba(var(--kh-accent-rgb),.32);' +
    'font-size:12.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--kh-accent-soft);}' +
  /* Static. The dot used to run `kh-blip 2s infinite`, dropping to opacity .4
     and scale .7 and back, forever — on nine capsules at once (one per section
     head). Nothing on the page depends on it and nothing is loading, so it was
     a blink with no meaning attached, and with several on screen at different
     scroll offsets it read as the page flickering. */
  '.kh-eyebrow .d{width:7px;height:7px;border-radius:50%;background:var(--kh-accent);' +
    'box-shadow:0 0 10px var(--kh-accent);}' +

  /* ---- nav ---- */
  '#kh-nav{position:sticky;top:0;z-index:60;backdrop-filter:blur(24px) saturate(1.5);' +
    '-webkit-backdrop-filter:blur(24px) saturate(1.5);background:rgba(5,5,5,.6);' +
    'border-bottom:1px solid var(--kh-line) !important;transition:transform .4s cubic-bezier(.22,1,.36,1);}' +
  '#kh-nav.hide{transform:translateY(-100%);}' +
  '.kh-nav-in{max-width:1180px;margin:0 auto;padding:0 clamp(20px,4vw,32px);height:70px;' +
    'display:flex;align-items:center;gap:24px;}' +
  '.kh-logo{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;}' +
  '.kh-logo .m{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;color:#0A0A0A;flex-shrink:0;' +
    'background:linear-gradient(135deg,var(--kh-accent),var(--kh-accent-soft));box-shadow:0 6px 18px rgba(var(--kh-accent-rgb),.45);}' +
  '.kh-logo .m svg{width:19px;height:19px;}' +
  /* Header wordmark lockup: "BestBrain" over a small parent-company caption.
     Text styling lives on .lt, not the bare .kh-logo anchor, because the
     narrow-phone rules below need to hide the caption+wordmark as one unit
     while leaving .m (the icon) visible — a bare font-size:0 on .kh-logo
     wouldn't reach .lt's own explicit font-size (a child's explicit font-size
     is never overridden by an ancestor's), so hiding has to target .lt
     directly rather than relying on inherited zero. */
  '.kh-logo .lt{display:flex;flex-direction:column;line-height:1.05;' +
    'font-weight:900;font-size:20px;letter-spacing:-.02em;}' +
  '.kh-logo .lt small{margin-top:3px;font-size:9px;font-weight:800;letter-spacing:.09em;' +
    'text-transform:uppercase;color:rgba(255,255,255,.4);}' +
  /* The landing page's own stylesheet still styles the bare `nav` tag
     (index.css: sticky, blurred, background, border-bottom) — that was the
     pre-redesign navbar, and it lands on both <nav>s built below, painting a
     hairline under the link group and a panel behind it. theme.css restates
     the background with !important, so the reset has to as well. */
  '#kh-root nav{position:static;top:auto;z-index:auto;backdrop-filter:none;' +
    '-webkit-backdrop-filter:none;background:transparent !important;border:0;}' +
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

  /* ---- mobile drawer ----
     Below 820px .kh-nav-links just vanishes with nothing replacing it, so a
     phone visitor had no way to reach Roles/How it works/Journey/Stories/FAQ
     — only the two header CTAs. This burger + drawer restores that, matching
     the same scrim/inert/Escape pattern the router's Navbar.tsx uses.

     Scrim and drawer are siblings of #kh-nav, not children of it — #kh-nav has
     backdrop-filter, which creates a containing block for position:fixed
     descendants and would size/clip a fixed drawer against the 70px bar
     instead of the viewport (the exact bug Navbar.tsx's own drawer comment
     documents). Keeping them outside #kh-nav is what makes position:fixed
     resolve against the viewport here. */
  '.kh-burger{display:none;width:44px;height:44px;border-radius:10px;flex-shrink:0;' +
    'border:1px solid var(--kh-line) !important;background:rgba(255,255,255,.06);color:#fff;' +
    'align-items:center;justify-content:center;cursor:pointer;}' +
  '.kh-burger:hover{background:rgba(255,255,255,.1);}' +
  '.kh-burger svg,.kh-drawer-close svg{width:20px;height:20px;display:block;}' +
  '@media(max-width:820px){.kh-burger{display:inline-flex;}}' +
  '.kh-scrim{position:fixed;inset:0;z-index:70;background:rgba(3,3,6,.6);' +
    '-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);opacity:0;pointer-events:none;' +
    'transition:opacity .35s ease;}' +
  '.kh-scrim.open{opacity:1;pointer-events:auto;}' +
  '.kh-drawer{position:fixed;top:0;right:0;bottom:0;z-index:71;width:min(320px,84vw);' +
    'background:#0A0A0A;border-left:1px solid var(--kh-line);box-shadow:-24px 0 60px rgba(0,0,0,.5);' +
    'transform:translateX(100%);transition:transform .4s cubic-bezier(.22,1,.36,1);' +
    'padding:18px 18px calc(24px + env(safe-area-inset-bottom));display:flex;flex-direction:column;overflow-y:auto;}' +
  '.kh-drawer.open{transform:translateX(0);}' +
  '.kh-drawer-close{align-self:flex-end;width:44px;height:44px;border-radius:10px;flex-shrink:0;' +
    'border:1px solid var(--kh-line) !important;background:rgba(255,255,255,.06);color:#fff;' +
    'display:flex;align-items:center;justify-content:center;cursor:pointer;margin-bottom:14px;}' +
  '.kh-drawer-links{display:flex;flex-direction:column;gap:3px;}' +
  '.kh-drawer-links a{padding:13px 12px;border-radius:10px;font-size:16px;font-weight:700;min-height:44px;' +
    'display:flex;align-items:center;color:rgba(255,255,255,.82);text-decoration:none;transition:all .2s ease;}' +
  '.kh-drawer-links a:hover,.kh-drawer-links a:active{background:rgba(255,255,255,.08);color:#fff;}' +
  '.kh-drawer-links .kh-btn{margin-top:12px;justify-content:center;min-height:48px;}' +
  '@media(min-width:821px){.kh-scrim,.kh-drawer{display:none;}}' +

  /* ---- buttons ---- */
  '.kh-btn{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;border-radius:99px;' +
    'font-size:15px;font-weight:800;text-decoration:none;cursor:pointer;border:0;position:relative;overflow:hidden;' +
    'transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s ease,filter .3s ease;}' +
  '.kh-btn.p{background:linear-gradient(120deg,var(--kh-accent),var(--kh-accent-soft));color:#0A0A0A;' +
    'box-shadow:0 12px 34px rgba(var(--kh-accent-rgb),.42),inset 0 1px 0 rgba(255,255,255,.4);}' +
  '.kh-btn.g{background:rgba(255,255,255,.08);color:#fff;border:1px solid var(--kh-line);' +
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}' +
  '.kh-btn:hover{transform:translateY(-3px);filter:brightness(1.05);}' +
  '.kh-btn.p:hover{box-shadow:0 18px 46px rgba(var(--kh-accent-rgb),.56);}' +
  '.kh-btn:active{transform:translateY(-1px) scale(.98);}' +
  /* .ar used to hold the character "→", so it needed no box. It now holds an
     <svg> with no width/height attribute — an SVG without either lays out at
     its default 300x150 — so the size lives here, once, for every .ar on the
     page. */
  '.ar{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;}' +
  '.ar svg{width:100%;height:100%;display:block;}' +
  '.kh-btn .ar{width:17px;height:17px;transition:transform .3s ease;}' +
  '.kh-btn:hover .ar{transform:translateX(4px);}' +

  /* ---- hero ---- */
  '#kh-hero{text-align:center;padding-top:clamp(56px,8vw,104px);padding-bottom:clamp(40px,6vw,72px);}' +
  '#kh-hero h1{font-size:clamp(42px,7.4vw,84px);font-weight:900;margin:24px auto 0;max-width:16ch;}' +
  /* Solid, not clipped. A gradient headline needs color:transparent, and the
     ink law owns -webkit-text-fill-color platform-wide — the two fight and the
     word loses, rendering near-black on a near-black page. */
  '#kh-hero h1 .gr{color:var(--kh-accent-soft)!important;-webkit-text-fill-color:var(--kh-accent-soft)!important;' +
    'background:none!important;}' +
  '#kh-hero .sub{margin:22px auto 0;max-width:60ch;font-size:clamp(16px,1.9vw,19px);line-height:1.6;' +
    'color:rgba(255,255,255,.7);}' +
  '#kh-hero .cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:34px;}' +
  '#kh-hero .trust{display:flex;gap:26px;justify-content:center;flex-wrap:wrap;margin-top:38px;' +
    'font-size:13px;font-weight:700;color:rgba(255,255,255,.55);}' +
  '#kh-hero .trust span{display:inline-flex;align-items:center;gap:8px;}' +
  /* Was a 6px accent dot; three bullets in a row said nothing about the three
     claims next to them. A tick does. */
  '#kh-hero .trust i{display:inline-flex;width:15px;height:15px;flex-shrink:0;' +
    'color:var(--kh-accent);font-style:normal;}' +
  '#kh-hero .trust i svg{width:100%;height:100%;display:block;}' +

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
  '.kh-orbit .r2{inset:13%;border-color:rgba(var(--kh-accent-rgb),.18);}' +
  '.kh-orbit .r3{inset:26%;border-color:rgba(255,255,255,.07);}' +
  '.kh-orbit .spin{position:absolute;inset:0;animation:kh-spin 34s linear infinite;}' +
  '.kh-orbit .spin.rev{animation-direction:reverse;animation-duration:46s;}' +
  '@keyframes kh-spin{to{transform:rotate(360deg)}}' +
  '.kh-orbit .node{position:absolute;width:var(--node);height:var(--node);border-radius:18px;display:grid;place-items:center;' +
    'background:rgba(255,255,255,.08);border:1px solid var(--kh-line);' +
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);' +
    'box-shadow:0 12px 30px rgba(0,0,0,.5);color:var(--kh-accent-soft);}' +
  '.kh-orbit .node svg{width:26px;height:26px;}' +
  '.kh-orbit .node i{display:block;animation:kh-unspin 34s linear infinite;}' +
  '.kh-orbit .spin.rev .node i{animation-duration:46s;animation-direction:reverse;}' +
  '@keyframes kh-unspin{to{transform:rotate(-360deg)}}' +
  '.kh-core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:40%;height:40%;' +
    'border-radius:50%;display:grid;place-items:center;text-align:center;' +
    /* The sphere is a three-stop gradient: a lit highlight, the accent, and a
       shadow. Only the middle stop was a token, so the highlight stayed warm
       cream and the shadow stayed burnt orange — the one element on the page
       still reading amber after the retheme, and the most prominent. */
    'background:radial-gradient(circle at 34% 28%,rgba(var(--kh-accent-hi-rgb),.92),' +
      'rgba(var(--kh-accent-rgb),.85) 55%,rgba(var(--kh-accent-deep-rgb),.92));' +
    'box-shadow:0 0 70px rgba(var(--kh-accent-rgb),.55),inset 0 2px 0 rgba(255,255,255,.4);' +
    'animation:kh-breathe 5s ease-in-out infinite;}' +
  '@keyframes kh-breathe{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.05)}}' +
  '.kh-core b{display:block;font-size:clamp(20px,3vw,30px);font-weight:900;color:#1A0E00;letter-spacing:-.02em;}' +
  '.kh-core span{font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:rgba(20,6,32,.72);}' +

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
    'background:rgba(255,255,255,.06);border:1px solid var(--kh-line);' +
    'backdrop-filter:blur(20px) saturate(1.4);-webkit-backdrop-filter:blur(20px) saturate(1.4);' +
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.13),0 16px 40px rgba(0,0,0,.42);' +
    'transition:transform .45s cubic-bezier(.22,1,.36,1),border-color .45s ease,' +
      'box-shadow .45s ease,background .45s ease;text-decoration:none;display:block;}' +
  '.kh-card::after{content:"";position:absolute;inset:-1px;border-radius:22px;pointer-events:none;opacity:0;' +
    'background:radial-gradient(420px circle at var(--mx,50%) var(--my,0%),rgba(var(--kh-accent-rgb),.18),transparent 60%);' +
    'transition:opacity .4s ease;}' +
  '.kh-card:hover{transform:translateY(-7px);background:rgba(255,255,255,.1);' +
    'border-color:rgba(var(--kh-accent-rgb),.45);' +
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 26px 60px rgba(0,0,0,.55),0 0 44px rgba(var(--kh-accent-rgb),.2);}' +
  '.kh-card:hover::after{opacity:1;}' +
  '.kh-ic{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;margin-bottom:16px;color:var(--kh-accent-soft);' +
    'background:rgba(var(--kh-accent-rgb),.14);box-shadow:inset 0 0 0 1px rgba(var(--kh-accent-rgb),.3);' +
    'transition:transform .45s cubic-bezier(.34,1.56,.64,1),background .35s ease;}' +
  '.kh-ic svg{width:23px;height:23px;}' +
  '.kh-card:hover .kh-ic{transform:scale(1.14) rotate(-8deg);background:rgba(var(--kh-accent-rgb),.26);}' +
  '.kh-card h3{font-size:17px;font-weight:800;margin-bottom:7px;letter-spacing:-.01em;}' +
  '.kh-card p{font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.62);}' +
  '.kh-tag{position:absolute;top:16px;right:16px;font-size:9.5px;font-weight:900;letter-spacing:.1em;' +
    'padding:4px 9px;border-radius:99px;background:linear-gradient(100deg,var(--kh-accent),var(--kh-accent-soft));color:#0A0A0A;}' +

  /* ---- sample lesson videos ----
     Poster-first and preload="none" by construction: the <video> element does
     not exist until the visitor presses play, so a reader who scrolls past
     this section downloads three ~80KB JPEGs and not one byte of the 61MB of
     lectures behind them. That is the whole reason this is a <button> holding
     an <img> rather than a <video poster>, which would still open a
     connection and fetch metadata on some browsers.

     Two-class selectors (.kh-card.kh-vid) throughout: .kh-card is restated
     inside the max-width:600px block further down, so a single .kh-vid would
     lose its padding:0 back to .kh-card{padding:18px} on phones purely on
     source order. */
  '.kh-card.kh-vid{padding:0;}' +
  /* Once a video is playing the card must stop moving. The base .kh-card
     lift is translateY(-7px) on hover, which under a cursor heading for the
     scrubber slides the controls out from under it. */
  '.kh-card.kh-vid.is-playing:hover{transform:none;}' +
  '.kh-vid-stage{position:relative;display:block;width:100%;aspect-ratio:16/9;' +
    'border:0;padding:0;margin:0;background:#0B0B0B;cursor:pointer;overflow:hidden;' +
    'border-radius:22px 22px 0 0;}' +
  '.kh-vid-stage img{width:100%;height:100%;object-fit:cover;display:block;' +
    'transition:transform .6s cubic-bezier(.22,1,.36,1),filter .4s ease;}' +
  '.kh-vid:hover .kh-vid-stage img{transform:scale(1.045);filter:brightness(1.07);}' +
  '.kh-vid > video{width:100%;height:auto;aspect-ratio:16/9;display:block;background:#000;' +
    'object-fit:cover;border-radius:22px 22px 0 0;}' +
  /* Sits above the poster so the poster can scale under it without the button
     scaling too. */
  '.kh-vid-btn{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);' +
    'width:62px;height:62px;border-radius:50%;display:grid;place-items:center;' +
    'color:#0A0A0A;background:var(--kh-accent);pointer-events:none;' +
    'box-shadow:0 10px 30px rgba(0,0,0,.5),0 0 0 8px rgba(var(--kh-accent-rgb),.16);' +
    'transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease;}' +
  '.kh-vid:hover .kh-vid-btn{transform:translate(-50%,-50%) scale(1.12);' +
    'box-shadow:0 14px 40px rgba(0,0,0,.55),0 0 0 13px rgba(var(--kh-accent-rgb),.2);}' +
  '.kh-vid-stage:focus-visible{outline:2px solid var(--kh-accent-soft);outline-offset:-4px;}' +
  '.kh-vid-btn svg{width:22px;height:22px;margin-left:1px;display:block;}' +
  '.kh-vid-time{position:absolute;right:11px;bottom:11px;font-size:11.5px;font-weight:800;' +
    'letter-spacing:.03em;padding:4px 9px;border-radius:99px;color:#fff;pointer-events:none;' +
    'background:rgba(0,0,0,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);}' +
  '.kh-vid-meta{padding:19px 21px 21px;}' +
  '.kh-vid-meta .cls{display:block;font-size:10.5px;font-weight:900;letter-spacing:.13em;' +
    'text-transform:uppercase;color:var(--kh-accent-soft);margin-bottom:9px;}' +

  /* ---- expandable "tap to see an example" cards ---- */
  '.kh-card--ex{cursor:pointer;}' +
  '.kh-ex-hint{margin-top:10px!important;font-size:12px!important;font-weight:800;' +
    'color:var(--kh-accent-soft)!important;display:flex;align-items:center;gap:5px;}' +
  '.kh-ex-hint .ar{width:14px;height:14px;transition:transform .3s var(--ease);}' +
  '.kh-card--ex.is-open .kh-ex-hint .ar{transform:rotate(90deg);}' +
  '.kh-ex-body{max-height:0;overflow:hidden;opacity:0;margin-top:0!important;' +
    'transition:max-height .4s var(--ease),opacity .3s ease,margin-top .4s var(--ease);' +
    'font-size:13px!important;line-height:1.55;color:rgba(255,255,255,.8)!important;' +
    'padding-top:0;border-top:0 solid rgba(var(--kh-accent-rgb),.2);}' +
  '.kh-card--ex.is-open .kh-ex-body{max-height:180px;opacity:1;margin-top:10px!important;' +
    'padding-top:10px;border-top-width:1px;}' +
  '.kh-card--ex.is-open .kh-ex-hint{color:rgba(255,255,255,.4)!important;}' +

  /* ---- stats ---- */
  '.kh-stat b{display:block;font-size:clamp(34px,4.6vw,46px);font-weight:900;color:#fff;line-height:1;' +
    'font-variant-numeric:tabular-nums;letter-spacing:-.03em;}' +
  /* Solid, not clipped — same fix as #kh-hero h1 .gr and for the same reason.
     kid-bg.js's ink pass measures whatever background-image sits behind a
     glyph to decide readable ink, and a background-clip:text gradient reads
     to it as a bright surface the text sits ON rather than the text's own
     fill — so it "corrected" 24x7 / 7 days to near-black ink on a near-black
     card, undoing the clip. A flat accent color has no background-image for
     the pass to misread, and !important keeps it from re-winning anyway. */
  '.kh-stat b em{font-style:normal;color:var(--kh-accent-soft)!important;' +
    '-webkit-text-fill-color:var(--kh-accent-soft)!important;background:none!important;}' +
  '.kh-stat .l{display:block;margin-top:10px;font-size:14px;font-weight:800;color:#fff;}' +
  '.kh-stat .s{display:block;margin-top:4px;font-size:12.5px;color:rgba(255,255,255,.55);}' +

  /* ---- steps / timeline ---- */
  '.kh-step{position:relative;padding-left:60px;}' +
  '.kh-step .n{position:absolute;left:0;top:0;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;' +
    'font-weight:900;font-size:15px;color:#0A0A0A;background:linear-gradient(135deg,var(--kh-accent),var(--kh-accent-soft));' +
    'box-shadow:0 8px 22px rgba(var(--kh-accent-rgb),.4);}' +
  '.kh-step h3{font-size:17px;font-weight:800;margin-bottom:7px;}' +
  '.kh-step p{font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.62);}' +
  '.kh-tl{position:relative;padding-left:34px;}' +
  '.kh-tl::before{content:"";position:absolute;left:9px;top:6px;bottom:6px;width:2px;border-radius:2px;' +
    'background:linear-gradient(180deg,var(--kh-accent),rgba(var(--kh-accent-rgb),.1));}' +
  '.kh-tl-item{position:relative;padding:0 0 30px 4px;}' +
  '.kh-tl-item::before{content:"";position:absolute;left:-30px;top:5px;width:12px;height:12px;border-radius:50%;' +
    'background:var(--kh-accent);box-shadow:0 0 0 4px rgba(var(--kh-accent-rgb),.18),0 0 16px var(--kh-accent);}' +
  '.kh-tl-item .w{font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:var(--kh-accent-soft);}' +
  '.kh-tl-item h3{font-size:17px;font-weight:800;margin:6px 0 6px;}' +
  '.kh-tl-item p{font-size:13.5px;line-height:1.55;color:rgba(255,255,255,.62);}' +

  /* ---- the journey runs ACROSS on a wide screen ----
     Four short steps stacked in a column inside an 1180px section used about
     a third of the width and left the rest of the row empty — the emptiness
     was the layout, not the content. Read left-to-right the timeline also
     says what it means: eight weeks as a span you travel, rather than a list.

     The same elements do both jobs. The rail (.kh-tl::before) turns from a
     vertical line into a horizontal one, and each dot moves from the left of
     its item to above it, sitting on that line. Below 901px nothing here
     applies and the column layout — which is the right shape on a phone —
     is untouched.

     The numbers line up: the grid's 36px top padding puts each item's content
     at y=36, so a dot at top:-36px sits at y=0. It is 12px tall, so its
     centre is y=6 — the same as the 2px rail at top:5px. */
  '@media(min-width:901px){' +
    '.kh-tl{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0 26px;' +
      'padding-left:0;padding-top:36px;}' +
    /* The rail starts and ends ON a dot rather than at the container edge —
       running it to right:6px left it trailing past the last step into empty
       space, which is the thing this layout is fixing. One column plus the
       6px half-dot is exactly the inset that lands it on the last centre:
       a column is (100% - 3 gaps) / 4. */
    '.kh-tl::before{left:6px;right:calc((100% - 78px) / 4 - 6px);top:5px;bottom:auto;' +
      'width:auto;height:2px;' +
      'background:linear-gradient(90deg,var(--kh-accent),rgba(var(--kh-accent-rgb),.35));}' +
    '.kh-tl-item{padding:0 10px 0 0;}' +
    '.kh-tl-item::before{left:0;top:-36px;}' +
  '}' +

  /* ---- testimonials ---- */
  '.kh-quote{font-size:15px;line-height:1.65;color:rgba(255,255,255,.82);}' +
  '.kh-who{display:flex;align-items:center;gap:11px;margin-top:20px;padding-top:18px;' +
    'border-top:1px solid var(--kh-line);}' +
  '.kh-who .av{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-weight:900;' +
    'color:#0A0A0A;background:linear-gradient(135deg,var(--kh-accent),var(--kh-accent-soft));}' +
  '.kh-who b{display:block;font-size:13.5px;color:#fff;}' +
  '.kh-who span{font-size:12px;color:rgba(255,255,255,.55);}' +
  '.kh-stars{display:flex;gap:3px;color:var(--kh-accent-soft);margin-bottom:14px;}' +
  '.kh-stars svg{width:14px;height:14px;display:block;}' +

  /* ---- devices ----
     Every colour here is a variable already defined above (--kh-accent /
     --kh-accent-soft / the site's near-black #0A0A0A / the same
     rgba(255,255,255,x) whites every other card uses) — no new hex values,
     matching the constraint that this pass only adds, never re-themes. */
  /* The composition is symmetric about the wrap's centre BY CONSTRUCTION, so
     `margin:0 auto` actually centres what the eye sees.

     It did not used to be. The wrap was 820px wide with padding:8px 60px 40px 0
     — 60px on the right, 0 on the left — and held a 620px laptop that
     left-aligned inside it while the phone was pinned to the far right. The
     result measured: laptop 310-930 (centre 620), phone 958-1130, a 28px gap
     between them, and a section whose centre was 720. Two disconnected objects,
     both off-centre, which is the "uneven" this section read as.

     Now the wrap is exactly as wide as the laptop, the base overhangs it by 6%
     a side (unchanged), and the phone's right edge is pinned to that same -6%.
     So the ink runs from -6% to +106% — symmetric — and the phone lands ON the
     laptop's bottom-right instead of floating beside it. */
  '.kh-dev-wrap{position:relative;max-width:640px;margin:0 auto;padding:0 0 30px;}' +
  '.kh-dev-lap{width:100%;}' +
  '.kh-dev-screen{border:10px solid #0A0A0A;border-radius:20px;overflow:hidden;' +
    'background:linear-gradient(rgba(255,255,255,.05),rgba(255,255,255,.05)),#0A0A0A;' +
    'box-shadow:0 0 0 1px var(--kh-line),0 30px 70px rgba(0,0,0,.5);}' +
  '.kh-dev-bar{display:flex;gap:7px;padding:12px 16px;border-bottom:1px solid var(--kh-line);}' +
  '.kh-dev-bar i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.16);display:block;}' +
  '.kh-dev-body{padding:22px 24px 26px;}' +
  '.kh-dev-nav{display:flex;align-items:center;gap:8px;margin-bottom:18px;}' +
  '.kh-dev-nav i{height:9px;border-radius:5px;background:rgba(255,255,255,.12);display:block;}' +
  '.kh-dev-row{display:flex;align-items:center;gap:12px;border:1px solid var(--kh-line);' +
    'border-radius:13px;padding:11px 13px;margin-bottom:9px;background:rgba(255,255,255,.02);}' +
  '.kh-dev-row .n{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;flex:none;' +
    'font-size:12px;font-weight:800;color:#0A0A0A;background:linear-gradient(135deg,var(--kh-accent),var(--kh-accent-soft));}' +
  '.kh-dev-row .lines{flex:1;}' +
  '.kh-dev-row .line{display:block;height:8px;border-radius:4px;background:rgba(255,255,255,.14);margin-bottom:7px;}' +
  '.kh-dev-row .bar{display:block;height:5px;border-radius:3px;background:rgba(255,255,255,.08);overflow:hidden;}' +
  '.kh-dev-row .bar i{display:block;height:100%;border-radius:3px;' +
    'background:linear-gradient(90deg,var(--kh-accent),var(--kh-accent-soft));}' +
  '.kh-dev-base{width:112%;margin:0 -6% -2px;height:14px;background:#0A0A0A;' +
    'border-radius:0 0 10px 10px;box-shadow:0 0 0 1px var(--kh-line),' +
    'inset 0 1px 0 rgba(255,255,255,.09),0 18px 34px rgba(0,0,0,.5);}' +

  /* right:-6% is the base's own overhang, so the phone's right edge and the
     laptop base's right edge are the same vertical line — the detail that
     makes the pair read as one object. */
  '.kh-dev-phone{position:absolute;right:-6%;bottom:0;width:172px;border:9px solid #0A0A0A;' +
    'border-radius:30px;overflow:hidden;' +
    'background:linear-gradient(rgba(255,255,255,.06),rgba(255,255,255,.06)),#0A0A0A;' +
    'box-shadow:0 0 0 1px var(--kh-line),0 26px 54px rgba(0,0,0,.55);}' +
  '.kh-dev-notch{width:52px;height:13px;background:#0A0A0A;border-radius:0 0 9px 9px;margin:0 auto;}' +
  '.kh-dev-pbody{padding:14px 13px 16px;}' +
  '.kh-dev-phead{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px;}' +
  '.kh-dev-phead i{height:8px;border-radius:4px;background:rgba(255,255,255,.14);display:block;}' +
  '.kh-dev-ring{width:52px;height:52px;border-radius:50%;margin:0 auto 12px;display:grid;place-items:center;' +
    'background:conic-gradient(var(--kh-accent) 0 76%, rgba(255,255,255,.1) 76% 100%);}' +
  '.kh-dev-ring i{width:38px;height:38px;border-radius:50%;background:#0A0A0A;display:grid;place-items:center;' +
    'font-style:normal;font-weight:900;font-size:11px;color:var(--kh-accent-soft);}' +
  '.kh-dev-opt{border:1px solid var(--kh-line);border-radius:10px;padding:8px 10px;' +
    'display:flex;align-items:center;gap:8px;margin-bottom:7px;}' +
  '.kh-dev-opt .dot{width:15px;height:15px;border-radius:5px;background:rgba(255,255,255,.1);flex:none;}' +
  '.kh-dev-opt.on .dot{background:var(--kh-accent);}' +
  '.kh-dev-opt .pill{height:7px;border-radius:4px;background:rgba(255,255,255,.14);flex:1;border:0 !important;}' +

  '@media(max-width:700px){.kh-dev-phone{width:142px;}.kh-dev-body{padding:18px 18px 20px;}}' +
  '@media(max-width:460px){.kh-dev-wrap{padding:0 0 22px;}' +
    '.kh-dev-phone{width:112px;}' +
    '.kh-dev-screen{border-width:7px;border-radius:15px;}' +
    '.kh-dev-body{padding:14px 13px 15px;}' +
    '.kh-dev-row{padding:8px 9px;border-radius:10px;gap:9px;}' +
    '.kh-dev-row .n{width:22px;height:22px;border-radius:7px;font-size:10px;}' +
    '.kh-dev-pbody{padding:9px 8px 10px;}' +
    '.kh-dev-ring{width:40px;height:40px;margin-bottom:8px;}' +
    '.kh-dev-ring i{width:29px;height:29px;font-size:9px;}}' +

  /* ---- FAQ ---- */
  '.kh-faq{border:1px solid var(--kh-line);border-radius:18px;background:rgba(255,255,255,.05);' +
    'backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);margin-bottom:12px;overflow:hidden;' +
    'transition:border-color .35s ease,background .35s ease;}' +
  '.kh-faq[open]{border-color:rgba(var(--kh-accent-rgb),.42);background:rgba(var(--kh-accent-rgb),.07);}' +
  '.kh-faq summary{list-style:none;cursor:pointer;padding:20px 22px;font-size:15.5px;font-weight:800;color:#fff;' +
    'display:flex;align-items:center;gap:14px;}' +
  '.kh-faq summary::-webkit-details-marker{display:none;}' +
  '.kh-faq summary .pm{margin-left:auto;width:26px;height:26px;border-radius:8px;flex-shrink:0;' +
    'display:grid;place-items:center;background:rgba(var(--kh-accent-rgb),.16);color:var(--kh-accent-soft);' +
    'transition:transform .35s cubic-bezier(.22,1,.36,1);}' +
  /* rotate(45deg) turns the plus into a close cross — the same trick the "+"
     character was doing, now on a glyph whose arms are actually equal. */
  '.kh-faq summary .pm svg{width:15px;height:15px;display:block;}' +
  '.kh-faq[open] summary .pm{transform:rotate(45deg);}' +
  '.kh-faq .a{padding:0 22px 20px 22px;font-size:14px;line-height:1.65;color:rgba(255,255,255,.68);}' +

  /* ---- final CTA + footer ---- */
  '#kh-cta{text-align:center;position:relative;overflow:hidden;border-radius:32px;' +
    'padding:clamp(48px,7vw,84px) clamp(24px,5vw,60px);margin:0 clamp(20px,4vw,32px) 40px;' +
    'background:linear-gradient(140deg,rgba(var(--kh-accent-rgb),.2),rgba(255,255,255,.05));' +
    'border:1px solid rgba(var(--kh-accent-rgb),.3);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);' +
    'box-shadow:0 30px 80px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.16);}' +
  '#kh-cta h2{font-size:clamp(30px,4.6vw,50px);font-weight:900;max-width:18ch;margin:18px auto 0;}' +
  '#kh-cta p{margin:18px auto 0;max-width:52ch;font-size:16px;line-height:1.6;color:rgba(255,255,255,.7);}' +
  '#kh-cta .cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:32px;}' +
  /* text-align is reset here, not inherited. #kh-foot is a <footer>, and the
     lifted index.html stylesheet carries a bare `footer{…text-align:center}`
     rule that reaches straight into this one — every column heading and link
     came out centred under a left-aligned brand. An id beats an element
     selector, so this settles it without touching the page stylesheet. */
  '#kh-foot{border-top:1px solid var(--kh-line) !important;text-align:left;}' +
  '.kh-copy{text-align:center;}' +
  '.kh-foot-in{max-width:1180px;margin:0 auto;padding:44px clamp(20px,4vw,32px);' +
    'display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start;}' +
  /* Adding the Classes column made six items compete for the row and pushed
     Account onto a second line on its own, which read as a mistake. The
     widths are picked to fit: 1180 minus 64 padding leaves 1116; six gaps of
     24 take 144; five link columns at 150 take 750; the brand keeps the
     remaining 222, above its 200 floor. */
  '.kh-foot-in .c{min-width:150px;}' +
  '.kh-fbrand{flex:1 1 200px;min-width:200px;}' +
  '.kh-foot-in h4{font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;' +
    'color:rgba(255,255,255,.45);margin:0 0 14px;}' +
  /* :not(.kh-logo) matters. This rule is one class more specific than
     .kh-logo AND comes later, so without the exclusion it won its every
     property: the wordmark lost display:flex to display:block, dropped from
     20px to 13.5px, and faded from #fff to 68% white. The mark and the word
     stopped sitting on one line and the brand read as a broken link. */
  '.kh-foot-in a:not(.kh-logo){display:block;font-size:13.5px;font-weight:600;color:rgba(255,255,255,.68);' +
    'text-decoration:none;padding:5px 0;transition:color .25s ease,transform .25s ease;}' +
  '.kh-foot-in a:hover{color:var(--kh-accent-soft);transform:translateX(3px);}' +
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

    /* ---------- vertical rhythm ----------
       clamp(64px,9vw,120px) bottoms out at its 64px floor on a phone, so
       every one of the nine sections spends 128px on air. Nothing here is
       dense enough on a 390px screen to need that much separation, and the
       page was long enough to feel endless. */
    '#kh-root section{padding:44px clamp(16px,4vw,32px);}' +
    '.kh-head h2{font-size:clamp(26px,7vw,34px);}' +
    '.kh-head p{font-size:15px;}' +
    '.kh-grid{gap:14px;}' +
    '.kh-card{padding:18px;border-radius:18px;}' +
    '.kh-vid-stage,.kh-vid > video{border-radius:18px 18px 0 0;}' +
    '.kh-vid-meta{padding:16px 17px 18px;}' +
    '.kh-vid-btn{width:54px;height:54px;}' +

    /* .kh-g4 carries the eight stats AND the nineteen feature cards — both
       are a short label over one or two lines, and both read better two-up
       than as 27 full-width blocks the reader has to scroll past one at a
       time. The reason and testimonial grids (g3, g2) stay single column:
       those are full sentences and go unreadable at half width. */
    '.kh-g4{grid-template-columns:repeat(2,minmax(0,1fr));}' +
    '.kh-g3,.kh-g2{grid-template-columns:minmax(0,1fr);}' +
    '.kh-stat b{font-size:clamp(26px,8vw,34px);}' +
    '.kh-stat .l{font-size:13px;margin-top:8px;}' +
    '.kh-stat .s{font-size:12px;}' +
    '.kh-card h3{font-size:15px;}' +
    '.kh-card p{font-size:13px;line-height:1.5;}' +

    /* Hero: the two CTAs were centred at their natural widths, so they came
       out different sizes stacked on top of each other. Full width makes them
       one block and gives each a proper 48px target. */
    '#kh-hero .cta{flex-direction:column;align-items:stretch;gap:10px;}' +
    '#kh-hero .cta .kh-btn{justify-content:center;width:100%;min-height:48px;}' +
    '#kh-hero .trust{gap:8px 16px;font-size:12.5px;}' +
    '#kh-cta .cta{flex-direction:column;align-items:stretch;}' +
    '#kh-cta .cta .kh-btn{justify-content:center;width:100%;min-height:48px;}' +
    /* The header keeps a logo and two CTAs. At 320px "Log in" wrapped onto
       two lines and "Start learning free" ran off the right edge, so the
       first thing on the page was a broken row. Tighten the row, shorten the
       primary label's padding, and let the logo give up space first. */
    '.kh-nav-in{height:60px;gap:10px;padding:0 14px;}' +
    '.kh-logo{min-width:0;}' +
    '.kh-logo .lt{font-size:17px;}' +
    '.kh-logo .m{width:28px;height:28px;flex-shrink:0;}' +
    '.kh-nav-in .kh-btn{padding:10px 14px;font-size:13.5px;}' +
    '.kh-nav-in .kh-btn.p{padding:10px 15px;}' +
    '.kh-nav-in .kh-btn .ar{display:none;}' +
    /* a 1180px footer row of 170px columns collapses to one readable column */
    '.kh-foot-in{gap:20px;}' +
    '.kh-foot-in .c{min-width:min(150px,100%);}' +
  '}' +

  /* ---------- touch ----------
     900px, not 600px: a phone held sideways is 667px and a tablet 768px.
     Footer links were a 32px row at both, and the header wordmark had no
     minimum height. */
  '@media(max-width:900px){' +
    '.kh-foot-in a{padding:11px 0;min-height:44px;display:flex;align-items:center;}' +
    '.kh-nav-in .kh-logo{min-height:44px;min-width:44px;}' +
    '.kh-nav-in .kh-btn{min-height:44px;}' +
    /* The card tag, the orbit caption and the journey week markers are 9.5px
       and 11px — set for a desktop card, under the 12px floor on a phone,
       and each one is the label that says what the thing beside it is. */
    '.kh-tag{font-size:12px;}' +
    '.kh-core span{font-size:12px;}' +
    '.kh-tl-item .w{font-size:12px;}' +
  '}' +

  /* Narrow phones: the wordmark and two CTAs cannot share 292px. The mark is
     the part that still identifies the site at a glance, so the word goes and
     the buttons keep their labels — the reverse leaves two buttons nobody can
     read next to a logo nobody needed. */
  '@media(max-width:420px){' +
    '.kh-nav-in{gap:8px;}' +
    /* Scoped to the nav. This hides the wordmark+caption so the header's two
       CTAs keep readable labels on a 320px screen — but .kh-logo also appears
       in the footer, where there is a whole row to spare, and an unscoped
       rule would blank the brand name there too. Hiding .lt directly, not a
       font-size:0 cascade — see the base .kh-logo comment for why the old
       cascade trick stopped reaching the wordmark once it moved into .lt. */
    '.kh-nav-in .kh-logo{gap:0;flex-shrink:0;}' +
    '.kh-nav-in .kh-logo .lt{display:none;}' +
    '.kh-nav-in .kh-btn{padding:10px 13px;font-size:13px;}' +
  '}' +

  '@media(prefers-reduced-motion:reduce){.kh-rv{opacity:1;transform:none;}' +
    '.kh-orbit .spin,.kh-core,.kh-orbit .node i{animation:none!important;}' +
    '.kh-drawer,.kh-scrim{transition:none!important;}}';

  function ic(name) { return I[name] || I.spark || ''; }

  /* Lucide v1.37.0 (ISC), the same family as KidTheme.ICON — but these are the
     interface glyphs rather than the subject ones, so they live here instead
     of in kid-bg's map: an arrow is not a topic a card can be about.

     Each replaced a text character or a hand-drawn path:
       ar  "→"  the four CTA arrows      ch  "›"  the expand chevron
       menu/close  hand-drawn strokes    play  a hand-drawn triangle
       star  "★"  the testimonial rating plus  "+"  the FAQ toggle
       tick  a 6px CSS dot on the hero's trust row

     The text arrows were the worst of them: "→" renders from whichever font
     the browser resolves it in, not the page's, so it changed weight between
     platforms and sat off the label's baseline. */
  function lu(paths, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 2) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }
  var LU = {
    ar:    lu('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', 2.2),
    ch:    lu('<path d="m9 18 6-6-6-6"/>', 2.2),
    menu:  lu('<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>', 2.2),
    close: lu('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', 2.2),
    plus:  lu('<path d="M5 12h14"/><path d="M12 5v14"/>', 2.2),
    tick:  lu('<path d="M20 6 9 17l-5-5"/>', 2.6),
    play:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
             '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>',
    star:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
             '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 ' +
             '.294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 ' +
             '2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 ' +
             '9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>'
  };

  function cards(list, cls) {
    return list.map(function (f) {
      var tag = f.tag ? '<span class="kh-tag">' + f.tag + '</span>' : '';
      // A card with a real page to send someone to (h) already "does
      // something" on click — navigates. A card with no page yet (h absent)
      // used to just sit there; if it also carries an ex(ample), tapping it
      // now expands in place to show one concrete "here's what that looks
      // like" line instead, which is the only kind of interactivity that
      // doesn't fight the cards that already navigate. Which cards those are
      // is decided by FEATURES alone — don't restate the count here, it has
      // gone stale twice already.
      var expandable = !f.h && f.ex;
      var open = f.h
        ? '<a class="kh-card kh-rv" href="' + f.h + '">'
        : '<div class="kh-card kh-rv' + (expandable ? ' kh-card--ex' : '') + '"' +
          (expandable ? ' tabindex="0" role="button" aria-expanded="false"' : '') + '>';
      var close = f.h ? '</a>' : '</div>';
      var example = expandable
        ? '<p class="kh-ex-hint">Tap to see an example <span class="ar">' + LU.ch + '</span></p>' +
          '<p class="kh-ex-body">' + f.ex + '</p>'
        : '';
      return open + tag + '<span class="kh-ic">' + ic(f.i) + '</span>' +
        '<h3>' + f.t + '</h3><p>' + f.d + '</p>' + example + close;
    }).join('');
  }

  function build() {
    if (document.getElementById('kh-root')) return;
    /* One sheet, reused. build() runs again on every return to the home route,
       and appending a fresh copy each time left a stack of identical <style
       id="kh-css"> elements in <head> — duplicate ids, and the whole sheet
       re-parsed on every visit. */
    if (!document.getElementById('kh-css')) {
      var style = document.createElement('style');
      style.id = 'kh-css';
      style.textContent = CSS;
      document.head.appendChild(style);
    }

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
        '<button type="button" class="kh-burger" id="kh-burger-btn" aria-label="Open menu" ' +
          'aria-expanded="false" aria-controls="kh-drawer">' +
          LU.menu +
        '</button>' +
        '<a class="kh-logo" href="index.html"><span class="m">' + ic('spark') + '</span>' +
          '<span class="lt">BestBrain<small>NorthBridge</small></span></a>' +
        '<nav class="kh-nav-links">' +
          '<a href="#features">Features</a><a href="#roles">For families</a><a href="#how">How it works</a>' +
          '<a href="#journey">Journey</a><a href="#voices">Stories</a><a href="#faq">FAQ</a>' +
        '</nav>' +
        /* Sizing lives in .kh-nav-in .kh-btn, not in a style attribute: an
           inline padding/font-size outranks every media query, so the phone
           rules could not shrink these and the header ran off the screen. */
        '<a class="kh-btn g" href="login.html">Log in</a>' +
        '<a class="kh-btn p" href="signup.html">Start free ' +
          '<span class="ar">' + LU.ar + '</span></a>' +
      '</div></header>' +

      /* ---------- mobile drawer (siblings of #kh-nav, see the CSS comment) ---------- */
      '<div class="kh-scrim" id="kh-scrim"></div>' +
      '<div class="kh-drawer" id="kh-drawer" inert>' +
        '<button type="button" class="kh-drawer-close" id="kh-drawer-close" aria-label="Close menu">' +
          LU.close +
        '</button>' +
        '<nav class="kh-drawer-links">' +
          '<a href="#features">Features</a><a href="#roles">For families</a><a href="#how">How it works</a>' +
          '<a href="#journey">Journey</a><a href="#voices">Stories</a><a href="#faq">FAQ</a>' +
          '<a class="kh-btn g" href="login.html">Log in</a>' +
          '<a class="kh-btn p" href="signup.html">Start free <span class="ar">' + LU.ar + '</span></a>' +
        '</nav>' +
      '</div>' +

      /* ---------- hero ---------- */
      '<section id="kh-hero">' +
        '<span class="kh-eyebrow kh-rv"><span class="d"></span>AI powered learning for Bharat</span>' +
        '<h1 class="kh-rv">Your doubt, answered <span class="gr">out loud</span>, in seconds.</h1>' +
        '<p class="sub kh-rv">BestBrain is an AI tutor that knows your syllabus. Ask in English, Hindi or ' +
          'Hinglish — get an explanation, a practice set and proof you improved.</p>' +
        '<div class="cta kh-rv">' +
          '<a class="kh-btn p" href="signup.html">Start learning free <span class="ar">' + LU.ar + '</span></a>' +
          '<a class="kh-btn g" href="tutor.html">Try the AI Tutor 🎙️</a>' +
        '</div>' +
        '<div class="trust kh-rv">' +
          '<span><i>' + LU.tick + '</i>No credit card needed</span>' +
          '<span><i>' + LU.tick + '</i>Classes 6–9 · CBSE</span>' +
          '<span><i>' + LU.tick + '</i>Works offline-first</span>' +
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
          '<h2>One platform. Twenty-six ways to get better.</h2>' +
          '<p>Every surface is connected — what you learn feeds what you practise, and what you practise feeds what PAL recommends next.</p></div>' +
        '<div class="kh-grid kh-g4">' + cards(FEATURES) + '</div>' +
      '</section>' +

      /* ---------- sample lessons ---------- */
      '<section id="samples">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>See it for yourself</span>' +
          '<h2>Watch a real lesson, before you sign up.</h2>' +
          '<p>Three minutes each, straight out of the Class 6 Science chapter on plants — the same animated lectures waiting inside Learn.</p></div>' +
        '<div class="kh-grid kh-g3">' +
          SAMPLES.map(function (v) {
            return '<div class="kh-card kh-vid kh-rv">' +
              '<button type="button" class="kh-vid-stage" data-src="/sampleVideos/' + v.f + '.mp4" ' +
                'aria-label="Play the lesson: ' + v.t + '">' +
                /* width/height are the real pixel dimensions so the browser
                   reserves the box before the JPEG lands — aspect-ratio alone
                   still shifts layout on a cold cache in older Safari. */
                '<img src="/sampleVideos/' + v.f + '.jpg" alt="" loading="lazy" ' +
                  'decoding="async" width="1280" height="720">' +
                '<span class="kh-vid-btn">' + LU.play + '</span>' +
                '<span class="kh-vid-time">' + v.d + '</span>' +
              '</button>' +
              '<div class="kh-vid-meta"><span class="cls">' + v.cls + '</span>' +
                '<h3>' + v.t + '</h3><p>' + v.p + '</p></div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</section>' +

      /* ---------- why ---------- */
      '<section id="why">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>Why BestBrain</span>' +
          '<h2>Built for how Indian students actually study.</h2>' +
          '<p>Not a western tutor with a translation layer bolted on.</p></div>' +
        '<div class="kh-grid kh-g3">' + cards(WHY) + '</div>' +
      '</section>' +

      /* ---------- roles ---------- */
      '<section id="roles">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>One account, three dashboards</span>' +
          '<h2>Built for the whole family.</h2>' +
          '<p>Student, parent and teacher each get their own view of the same real data — nobody stares at a dashboard meant for someone else.</p></div>' +
        '<div class="kh-grid kh-g3">' + cards(ROLES) + '</div>' +
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
            return '<div class="kh-card kh-rv"><div class="kh-stars">' + LU.star.repeat(5) + '</div>' +
              '<p class="kh-quote">“' + v.q + '”</p>' +
              '<div class="kh-who"><span class="av">' + v.n.charAt(0) + '</span>' +
              '<span><b>' + v.n + '</b><span>' + v.r + '</span></span></div></div>';
          }).join('') +
        '</div>' +
      '</section>' +

      /* ---------- devices ---------- */
      '<section id="devices">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>Every screen</span>' +
          '<h2>Works properly on a laptop <em>and</em> a phone.</h2>' +
          '<p>No app to install. Same dashboard, same PAL, same progress — on a school computer or your own phone.</p></div>' +
        '<div class="kh-dev-wrap kh-rv" aria-hidden="true">' +
          '<div class="kh-dev-lap">' +
            '<div class="kh-dev-screen">' +
              '<div class="kh-dev-bar"><i></i><i></i><i></i></div>' +
              '<div class="kh-dev-body">' +
                '<div class="kh-dev-nav">' +
                  '<i style="width:26px;background:linear-gradient(135deg,var(--kh-accent),var(--kh-accent-soft))"></i>' +
                  '<i style="width:64px"></i><i style="width:40px"></i><i style="width:46px;margin-left:auto"></i>' +
                '</div>' +
                '<div class="kh-dev-row"><span class="n">01</span>' +
                  '<span class="lines"><span class="line" style="width:62%"></span>' +
                  '<span class="bar"><i style="width:78%"></i></span></span></div>' +
                '<div class="kh-dev-row"><span class="n">02</span>' +
                  '<span class="lines"><span class="line" style="width:74%"></span>' +
                  '<span class="bar"><i style="width:45%"></i></span></span></div>' +
                '<div class="kh-dev-row" style="margin-bottom:0"><span class="n">03</span>' +
                  '<span class="lines"><span class="line" style="width:56%"></span>' +
                  '<span class="bar"><i style="width:22%"></i></span></span></div>' +
              '</div>' +
            '</div>' +
            '<div class="kh-dev-base"></div>' +
          '</div>' +
          '<div class="kh-dev-phone">' +
            '<div class="kh-dev-notch"></div>' +
            '<div class="kh-dev-pbody">' +
              '<div class="kh-dev-phead"><i style="width:44px"></i><i style="width:18px"></i></div>' +
              '<div class="kh-dev-ring"><i>76%</i></div>' +
              '<div class="kh-dev-opt on"><span class="dot"></span><span class="pill" style="max-width:70px"></span></div>' +
              '<div class="kh-dev-opt"><span class="dot"></span><span class="pill" style="max-width:52px"></span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* ---------- faq ---------- */
      '<section id="faq">' +
        '<div class="kh-head kh-rv"><span class="kh-eyebrow"><span class="d"></span>FAQ</span>' +
          '<h2>Questions, answered.</h2></div>' +
        '<div style="max-width:820px;margin:0 auto">' +
          FAQ.map(function (f) {
            return '<details class="kh-faq kh-rv"><summary>' + f.q + '<span class="pm">' + LU.plus + '</span></summary>' +
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
          '<a class="kh-btn p" href="signup.html">Create free account <span class="ar">' + LU.ar + '</span></a>' +
          '<a class="kh-btn g" href="dashboard.html">Explore the dashboard</a>' +
        '</div>' +
      '</div>' +

      /* ---------- footer ---------- */
      '<footer id="kh-foot"><div class="kh-foot-in">' +
        '<div class="c kh-fbrand">' +
          '<a class="kh-logo" href="index.html" style="margin-bottom:14px"><span class="m">' + ic('spark') + '</span>' +
            '<span class="lt">BestBrain</span></a>' +
          '<p style="font-size:13.5px;line-height:1.6;color:rgba(255,255,255,.55);max-width:34ch">' +
            'AI-powered learning for Classes 6–9. Built in India, for Indian classrooms.<br>' +
            'A <b style="color:var(--kh-accent-soft)!important;-webkit-text-fill-color:var(--kh-accent-soft)!important">' +
              'NorthBridge Future Labs Pvt Ltd</b> company.</p>' +
        '</div>' +
        /* Classes is the column a visitor who is not signed in actually
           needs — the first thing they want to know is whether their class
           is covered. learn.html reads ?class= (see its VIEW STATE section)
           and useLegacyLinks carries the query string across when it turns
           the .html href into a route, so these land on the right class
           rather than the default one. The static learn.html footer has had
           this column all along; the redesigned homepage dropped it. */
        '<div class="c"><h4>Classes</h4>' +
          '<a href="learn.html?class=6">Class 6</a><a href="learn.html?class=7">Class 7</a>' +
          '<a href="learn.html?class=8">Class 8</a><a href="learn.html?class=9">Class 9</a></div>' +
        '<div class="c"><h4>Learn</h4><a href="learn.html">Chapters</a><a href="videos.html">Video lectures</a>' +
          '<a href="lesson.html">Lessons</a><a href="live.html">Live classes</a></div>' +
        '<div class="c"><h4>Practise</h4><a href="mocktest.html">Mock tests</a><a href="challenge.html">Arena</a>' +
          '<a href="bank.html">Question bank</a><a href="homework.html">Homework</a>' +
          '<a href="dashboard.html">Dashboard</a></div>' +
        '<div class="c"><h4>AI</h4><a href="tutor.html">AI Tutor</a><a href="pal.html">PAL chat</a></div>' +
        '<div class="c"><h4>Account</h4><a href="login.html">Log in</a><a href="signup.html">Sign up</a>' +
          '<a href="privacy.html">Privacy policy</a><a href="terms.html">Terms of service</a></div>' +
      '</div>' +
      '<div class="kh-copy">© 2026 BestBrain, a ' +
        '<b style="color:var(--kh-accent-soft)!important;-webkit-text-fill-color:var(--kh-accent-soft)!important">' +
          'NorthBridge Future Labs Pvt Ltd</b> company. All rights reserved.</div></footer>';

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

    /* Revealing a card and counting its number are ONE operation.
       They used to be two, and .in was added in four separate places while
       countUp() was called from only one of them — the observer. Every other
       path revealed the card and left its number showing the literal "0" the
       markup ships with: with reduced motion on, all eight stats read 0+ /
       0% / 0 days permanently. countUp even carries a reduced-motion branch
       that fills in the final value instantly, which could never run because
       its caller returned before reaching it.
       Idempotent, so a card revealed by the safety net below still counts
       when the observer catches up. */
    function reveal(n) {
      n.classList.add('in');
      var num = n.querySelector && n.querySelector('b[data-to]');
      if (num && !num.dataset.done) { num.dataset.done = '1'; countUp(num); }
    }

    /* scroll reveal + count-up */
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        reveal(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('.kh-rv').forEach(function (n, i) {
      if (reduce) { reveal(n); return; }

      /* The hero is above the fold, and it was starting at opacity:0 — so the
         first thing a visitor saw was an empty page waiting for an observer.
         An entrance is only worth having where the reader has not arrived
         yet. Anything already on screen is shown at once. */
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.05) { reveal(n); return; }

      n.style.transitionDelay = ((i % 8) * 60) + 'ms';
      io.observe(n);
    });

    /* and nothing may stay hidden — or stuck at zero — because an observer
       never fired */
    setTimeout(function () {
      document.querySelectorAll('.kh-rv:not(.in)').forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.5) reveal(n);
      });
    }, 400);

    /* The standing backstop, and the one that actually matters.

       An IntersectionObserver only reports what is on screen at an
       observation point. Scroll smoothly and every card passes through the
       viewport, so every card fires. JUMP, and the ones jumped over never
       intersect at all — and because .kh-rv is opacity:1 with
       transform:translateY(16px), an element that never gets .in is not
       hidden, it is permanently sitting 16px below where it belongs.

       Jumping is not an edge case here: the six nav links and the six drawer
       links all scrollIntoView, so clicking "FAQ" skips the whole page. After
       that, scrolling back up showed 37 of 81 elements — every stat card and
       most of the feature grid — offset by 16px against their neighbours,
       for the rest of the session.

       So: on scroll, reveal anything the reader has reached. Idempotent with
       the observer (reveal() already is), rAF-throttled so a scroll burst
       costs one pass per frame, passive so it never blocks scrolling, and it
       unhooks itself once the last element is in. */
    var sweeping = false;
    function sweep() {
      sweeping = false;
      var left = document.querySelectorAll('.kh-rv:not(.in)');
      for (var i = 0; i < left.length; i++) {
        /* .9 rather than 1: matches where the observer's own threshold/
           rootMargin pair fires, so during ordinary scrolling this changes
           nothing about when a card animates in. */
        if (left[i].getBoundingClientRect().top < window.innerHeight * 0.9) {
          reveal(left[i]);
          io.unobserve(left[i]);
        }
      }
      if (!document.querySelector('.kh-rv:not(.in)')) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }
    function onScroll() {
      if (sweeping) return;
      sweeping = true;
      requestAnimationFrame(sweep);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

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

    wireDocument();

    /* smooth in-page nav.
       Scoped to #kh-root, not document. The router's #root is only hidden
       (display:none), never removed (see build()), and its dead LandingMarkup
       tree still carries its own id="features" — a bare document.querySelector
       resolved to THAT one first (it comes before #kh-root in body order), an
       invisible display:none element with no layout, so scrollIntoView was a
       silent no-op and the "Features" nav link did nothing.
       Covers the drawer's copy of the links too — same targets, same fix. */
    var khRoot = document.getElementById('kh-root');
    document.querySelectorAll('.kh-nav-links a[href^="#"], .kh-drawer-links a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = khRoot.querySelector(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      });
    });

    /* mobile drawer: burger opens it, scrim/X/Escape/any link closes it.
       Mirrors Navbar.tsx's drawer contract (scrim, inert, Escape, body scroll
       lock) since that is the pattern this site already committed to — see
       its comments for why each piece is there. */
    var burger = document.getElementById('kh-burger-btn');
    var drawer = document.getElementById('kh-drawer');
    var scrim = document.getElementById('kh-scrim');
    var drawerClose = document.getElementById('kh-drawer-close');
    if (burger && drawer && scrim && drawerClose) {
      burger.addEventListener('click', function () { setDrawer(!drawer.classList.contains('open')); });
      scrim.addEventListener('click', function () { setDrawer(false); });
      drawerClose.addEventListener('click', function () { setDrawer(false); });
      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setDrawer(false); });
      });
    }
  }

  /* Reads the drawer's parts on every call rather than closing over them: the
     Escape handler in wireDocument() is bound once, and #kh-drawer is a
     different element after the next visit to the home route. */
  function setDrawer(open) {
    var drawer = document.getElementById('kh-drawer');
    var scrim = document.getElementById('kh-scrim');
    var burger = document.getElementById('kh-burger-btn');
    if (!drawer || !scrim || !burger) return;
    drawer.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) drawer.removeAttribute('inert'); else drawer.setAttribute('inert', '');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  /* Listeners that live on document/window, bound exactly once.

     #kh-root is rebuilt every time the visitor comes back to the home route,
     and wire() runs again with it. These four are delegated, so one copy
     already covers whatever the current build put on the page — binding them
     per build would stack a fresh pointermove handler on every visit while the
     old ones went on firing against a tree that no longer exists. Each looks
     its nodes up when it runs, for the same reason. */
  var docWired = false;
  function wireDocument() {
    if (docWired) return;
    docWired = true;

    /* Expandable feature cards ("tap to see an example") — one delegated
       listener rather than one per card, same reasoning as the pointer-glow
       listener just below. Toggles a class the CSS above animates; the hint
       text and aria-expanded are kept in sync from here rather than in CSS
       content, so a screen reader announces the real state. */
    document.addEventListener('click', function (e) {
      var card = e.target.closest ? e.target.closest('.kh-card--ex') : null;
      if (!card) return;
      toggleExampleCard(card);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var card = e.target.closest ? e.target.closest('.kh-card--ex') : null;
      if (!card) return;
      e.preventDefault();
      toggleExampleCard(card);
    });
    function toggleExampleCard(card) {
      var open = !card.classList.contains('is-open');
      card.classList.toggle('is-open', open);
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
      var hint = card.querySelector('.kh-ex-hint');
      if (hint) {
        var text = open ? 'Tap to close' : 'Tap to see an example';
        // Rewrite just the text node, leaving the arrow <span> in place.
        for (var i = 0; i < hint.childNodes.length; i++) {
          if (hint.childNodes[i].nodeType === 3) { hint.childNodes[i].nodeValue = text + ' '; break; }
        }
      }
    }

    /* Sample lesson videos: swap the poster button for a real <video> on the
       first click, and never before. Delegated like the cards above, so it
       survives build() running again on a return to the home route.

       The <video> replaces the <button> outright rather than sitting hidden
       beside it — a hidden <video src> is still a <video src>, and Chrome
       fetches its metadata (and on some versions buffers ahead) whether or
       not anyone can see it. Nothing here is created until the click. */
    document.addEventListener('click', function (e) {
      var stage = e.target.closest ? e.target.closest('.kh-vid-stage') : null;
      if (!stage) return;
      var src = stage.getAttribute('data-src');
      if (!src) return;

      /* One at a time. Three lectures playing over each other is not a
         demo, and on a metered connection it is three downloads. */
      document.querySelectorAll('#samples video').forEach(function (other) {
        other.pause();
      });

      var card = stage.closest('.kh-card');
      var video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'auto';
      /* The poster carries over so the first frame is already painted while
         the file opens, instead of a black box. */
      video.poster = stage.querySelector('img') ? stage.querySelector('img').src : '';
      video.setAttribute('controlsList', 'nodownload');
      stage.replaceWith(video);
      if (card) card.classList.add('is-playing');
      /* Autoplay with sound is refused by every browser unless the gesture is
         attributed to the play itself; this call is inside the click handler,
         so it is. If a browser refuses anyway the controls are already there
         and the poster frame is showing — the card degrades to "press play". */
      var played = video.play();
      if (played && played.catch) played.catch(function () { /* user presses play */ });
    });

    /* Escape closes the mobile drawer. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setDrawer(false);
    });

    /* cursor-tracked glow on glass cards */
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.addEventListener('pointermove', function (e) {
        var c = e.target.closest ? e.target.closest('.kh-card') : null;
        if (!c) return;
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      }, { passive: true });
    }

    /* navbar hide on scroll down, show on scroll up */
    var last = 0;
    window.addEventListener('scroll', function () {
      var nav = document.getElementById('kh-nav');
      if (!nav) return;
      var y = window.scrollY;
      nav.classList.toggle('hide', y > 220 && y > last);
      last = y;
    }, { passive: true });
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

  /* Under the router React says when the home screen exists; this file no
     longer watches the URL.

     It used to. history.pushState was patched and popstate listened to, each
     scheduling sync() 60ms later — and the URL changing is not the screen
     changing. React Router navigates inside a transition, so the route commits
     a good while after the address bar updates, and both ends of that gap were
     visible. Leaving home, the hero was still on screen when the page being
     opened swapped #page-css underneath it, so the homepage painted a frame
     wearing the next page's stylesheet. Coming back with the Back button,
     React committed its own landing markup into #root — the pre-redesign page
     this file exists to replace — and it stayed up until the timer got round
     to hiding it.

     Landing's layout effect calls mount/unmount instead (src/lib/useKidHome),
     which puts the swap inside the commit that changes the route: the browser
     only ever paints the finished state.

     __kidHomeWanted covers the first load. This is a deferred script, so on a
     cold load of "/" that effect has already run by the time we get here. */
  window.KidHome = { mount: build, unmount: unmount };

  function start() {
    /* Static pages have no router and no #root — one page, one decision. */
    if (!SPA) { sync(); return; }
    if (window.__kidHomeWanted) build();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
