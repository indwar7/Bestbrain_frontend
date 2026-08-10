/* ============================================================
   BESTBRAIN — QUIZ (preview only)
   ------------------------------------------------------------
   Two things, neither of which touches the repo:

   1. VOCABULARY — the product says "Test" everywhere; the demo
      says "Quiz". Only visible words are rewritten (text nodes,
      placeholders, titles). Every href, id, class and data
      attribute is left exactly as it was, so routing and the
      pages' own logic keep working.

   2. EXPLAINER — when an answer comes back wrong, a video plays
      that walks through that specific question.

   The explainer is built from the question on screen rather than
   from a hard-coded list, so it works for every question in the
   bank instead of the two or three someone remembered to write.
   It reads the stem, the option the student picked, the correct
   option and the page's own worked solution, then stages them as
   a narrated sequence of scenes.
   ============================================================ */
(function () {
  'use strict';

  /* =========================================================
     1. VOCABULARY
     ========================================================= */
  var WORDS = [
    [/\bMock Tests\b/g, 'Mock Quizzes'], [/\bMock Test\b/g, 'Mock Quiz'],
    [/\bmock tests\b/g, 'mock quizzes'], [/\bmock test\b/g, 'mock quiz'],
    [/\bTest Series\b/g, 'Quiz Series'],
    [/\bTests\b/g, 'Quizzes'], [/\btests\b/g, 'quizzes'],
    [/\bTest\b/g, 'Quiz'], [/\btest\b/g, 'quiz'],
    [/\bTesting\b/g, 'Quizzing'], [/\btesting\b/g, 'quizzing']
  ];
  /* \b keeps "latest", "greatest", "contest" and "Testimonials" intact —
     there is no word boundary inside them. */
  function reword(s) {
    var out = s;
    for (var i = 0; i < WORDS.length; i++) out = out.replace(WORDS[i][0], WORDS[i][1]);
    return out;
  }
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };

  function rewordTree(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || SKIP_TAGS[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('#kq-player')) return NodeFilter.FILTER_REJECT;
        return /test/i.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var hits = [], n;
    while ((n = walker.nextNode())) hits.push(n);
    hits.forEach(function (t) {
      var next = reword(t.nodeValue);
      if (next !== t.nodeValue) t.nodeValue = next;
    });

    var attrs = ['placeholder', 'title', 'aria-label', 'value'];
    var els = root.querySelectorAll ? root.querySelectorAll('[placeholder],[title],[aria-label],input[type=submit],input[type=button]') : [];
    for (var i = 0; i < els.length; i++) {
      for (var a = 0; a < attrs.length; a++) {
        var v = els[i].getAttribute(attrs[a]);
        if (v && /test/i.test(v)) {
          var nv = reword(v);
          if (nv !== v) els[i].setAttribute(attrs[a], nv);
        }
      }
    }
    if (/test/i.test(document.title)) document.title = reword(document.title);
  }

  /* =========================================================
     1b. THE ANSWER OPTIONS
     Left to the page's own tokens the options came out the same
     brown as the card behind them — readable in theory, invisible
     as *choices*. They are the one thing on the screen a student
     has to act on, so they get a surface of their own, a border
     that is actually a border, and a letter badge that reads at a
     glance. States are unmistakable: picked is orange, right is
     green, wrong is red.
     ========================================================= */
  var QUIZ_CSS =
  '#optGrid{gap:16px!important;}' +
  '#optGrid .opt{background:rgba(0,0,0,.52)!important;' +
    'border:2px solid rgba(255,255,255,.28)!important;border-radius:20px!important;' +
    'padding:22px 24px!important;gap:18px!important;cursor:pointer;' +
    'box-shadow:0 10px 26px rgba(0,0,0,.42)!important;' +
    'transition:border-color .25s ease,background .25s ease,box-shadow .25s ease,' +
      'transform .25s cubic-bezier(.22,1,.36,1)!important;}' +
  '#optGrid .opt:hover:not(:disabled){border-color:#FFB347!important;' +
    'background:rgba(255,122,0,.16)!important;transform:translateY(-3px)!important;' +
    'box-shadow:0 16px 34px rgba(255,122,0,.3)!important;}' +
  '#optGrid .opt:focus-visible{outline:3px solid #FFB347!important;outline-offset:3px!important;}' +
  /* the option text itself — big, white, unmissable */
  '#optGrid .opt,#optGrid .opt span:not(.ltr){font-size:clamp(18px,1.8vw,23px)!important;' +
    'font-weight:700!important;color:#FFFFFF!important;-webkit-text-fill-color:#FFFFFF!important;}' +
  /* A / B / C / D */
  '#optGrid .opt .ltr{width:46px!important;height:46px!important;border-radius:14px!important;' +
    'border:0!important;flex:none!important;font-size:17px!important;font-weight:900!important;' +
    'background:linear-gradient(135deg,#FF7A00,#FFB347)!important;' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;' +
    'box-shadow:0 6px 16px rgba(255,122,0,.45)!important;}' +
  /* states */
  '#optGrid .opt.is-picked{border-color:#FF7A00!important;background:rgba(255,122,0,.22)!important;' +
    'box-shadow:0 0 0 4px rgba(255,122,0,.24),0 16px 34px rgba(255,122,0,.32)!important;}' +
  '#optGrid .opt.is-right{border-color:#34D399!important;background:rgba(52,211,153,.22)!important;' +
    'box-shadow:0 0 0 4px rgba(52,211,153,.2)!important;}' +
  '#optGrid .opt.is-right .ltr{background:#34D399!important;' +
    'box-shadow:0 6px 16px rgba(52,211,153,.5)!important;}' +
  '#optGrid .opt.is-wrong{border-color:#F87171!important;background:rgba(239,68,68,.22)!important;' +
    'box-shadow:0 0 0 4px rgba(239,68,68,.2)!important;}' +
  '#optGrid .opt.is-wrong .ltr{background:#F87171!important;' +
    'box-shadow:0 6px 16px rgba(239,68,68,.5)!important;}' +
  /* a disabled option is still being read — never fade it out */
  '#optGrid .opt:disabled{opacity:1!important;cursor:default;}' +
  /* the two controls under the question */
  '#submitBtn,#nextBtn{background:linear-gradient(120deg,#FF7A00,#FFA726)!important;border:0!important;' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;font-weight:800!important;' +
    'box-shadow:0 12px 30px rgba(255,122,0,.42)!important;}' +
  '#submitBtn:disabled{opacity:.5!important;box-shadow:none!important;}';

  function quizStyle() {
    if (document.getElementById('kq-quiz-style')) return;
    if (!document.getElementById('optGrid')) return;
    var s = document.createElement('style');
    s.id = 'kq-quiz-style';
    s.textContent = QUIZ_CSS;
    document.head.appendChild(s);
  }

  /* =========================================================
     2. THE EXPLAINER
     ========================================================= */

  var CSS =
  '#kq-player{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;' +
    'padding:clamp(12px,3vw,40px);background:rgba(3,3,3,.86);' +
    'backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);' +
    'opacity:0;animation:kq-fade .35s ease forwards;}' +
  '@keyframes kq-fade{to{opacity:1}}' +
  '#kq-player *{box-sizing:border-box;}' +

  '.kq-box{width:min(980px,100%);border-radius:24px;overflow:hidden;position:relative;' +
    'background:#0B0908;border:1px solid rgba(255,255,255,.14);' +
    'box-shadow:0 40px 120px rgba(0,0,0,.7);' +
    'transform:translateY(18px) scale(.98);animation:kq-rise .45s cubic-bezier(.22,1,.36,1) .05s forwards;}' +
  '@keyframes kq-rise{to{transform:none}}' +

  /* ---- the picture ---- */
  '.kq-stage{position:relative;aspect-ratio:16/9;overflow:hidden;' +
    'background:radial-gradient(1000px 700px at 18% 12%,rgba(255,122,0,.20),transparent 62%),' +
    'radial-gradient(800px 600px at 86% 88%,rgba(168,85,247,.14),transparent 64%),#0B0908;}' +
  '.kq-grid{position:absolute;inset:0;opacity:.16;pointer-events:none;' +
    'background-image:linear-gradient(rgba(255,255,255,.10) 1px,transparent 1px),' +
    'linear-gradient(90deg,rgba(255,255,255,.10) 1px,transparent 1px);background-size:44px 44px;}' +
  '.kq-scene{position:absolute;inset:0;padding:clamp(20px,3.4vw,44px);' +
    'display:flex;flex-direction:column;justify-content:center;gap:14px;' +
    'opacity:0;transform:translateY(16px);transition:opacity .45s ease,transform .45s cubic-bezier(.22,1,.36,1);}' +
  '.kq-scene.on{opacity:1;transform:none;}' +
  '.kq-kicker{font-size:12px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#FFC98A!important;' +
    '-webkit-text-fill-color:#FFC98A!important;}' +
  '.kq-h{font-size:clamp(20px,2.9vw,34px);font-weight:900;line-height:1.2;letter-spacing:-.02em;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;}' +
  '.kq-p{font-size:clamp(14px,1.6vw,18px);line-height:1.6;max-width:62ch;' +
    'color:rgba(255,255,255,.92)!important;-webkit-text-fill-color:rgba(255,255,255,.92)!important;}' +
  '.kq-chip{display:inline-flex;align-items:center;gap:10px;padding:12px 18px;border-radius:16px;' +
    'font-size:clamp(14px,1.7vw,19px);font-weight:800;max-width:100%;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;}' +
  '.kq-chip.bad{background:rgba(239,68,68,.16);border:1px solid rgba(239,68,68,.5);}' +
  '.kq-chip.bad .kq-txt{text-decoration:line-through;text-decoration-color:rgba(255,120,120,.85);}' +
  '.kq-chip.good{background:rgba(52,211,153,.15);border:1px solid rgba(52,211,153,.5);}' +
  '.kq-mark{width:28px;height:28px;flex-shrink:0;border-radius:9px;display:grid;place-items:center;' +
    'font-weight:900;font-size:15px;color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;}' +
  '.kq-chip.bad .kq-mark{background:#F87171;}' +
  '.kq-chip.good .kq-mark{background:#34D399;}' +
  '.kq-step{display:flex;gap:14px;align-items:flex-start;padding:14px 16px;border-radius:16px;' +
    'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);}' +
  '.kq-step .n{width:30px;height:30px;flex-shrink:0;border-radius:10px;display:grid;place-items:center;' +
    'font-weight:900;font-size:14px;color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;' +
    'background:linear-gradient(135deg,#FF7A00,#FFB347);}' +

  /* presenter */
  '.kq-pal{position:absolute;right:clamp(16px,2.4vw,30px);bottom:clamp(16px,2.4vw,30px);' +
    'display:flex;align-items:center;gap:10px;padding:9px 14px 9px 9px;border-radius:99px;' +
    'background:rgba(0,0,0,.42);border:1px solid rgba(255,255,255,.14);' +
    'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}' +
  '.kq-orb{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#FF7A00,#FFB347);' +
    'box-shadow:0 0 18px rgba(255,122,0,.7);}' +
  '.kq-eq{display:flex;align-items:flex-end;gap:3px;height:18px;}' +
  '.kq-eq i{width:3px;border-radius:2px;background:#FFC98A;height:5px;}' +
  '#kq-player.playing .kq-eq i{animation:kq-bar .9s ease-in-out infinite;}' +
  '.kq-eq i:nth-child(2){animation-delay:.12s}.kq-eq i:nth-child(3){animation-delay:.24s}' +
  '.kq-eq i:nth-child(4){animation-delay:.36s}.kq-eq i:nth-child(5){animation-delay:.48s}' +
  '@keyframes kq-bar{0%,100%{height:5px}50%{height:17px}}' +
  '.kq-pal b{font-size:12.5px;font-weight:800;color:#fff!important;-webkit-text-fill-color:#fff!important;}' +

  /* captions */
  '.kq-cap{position:absolute;left:50%;transform:translateX(-50%);bottom:clamp(14px,2.2vw,26px);' +
    'max-width:min(74%,760px);padding:9px 16px;border-radius:12px;text-align:center;' +
    'background:rgba(0,0,0,.62);font-size:clamp(12.5px,1.4vw,15px);font-weight:600;line-height:1.45;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;}' +

  /* ---- controls ---- */
  '.kq-bar{display:flex;align-items:center;gap:14px;padding:13px 16px;' +
    'background:rgba(255,255,255,.04);border-top:1px solid rgba(255,255,255,.1);}' +
  '.kq-btn{width:38px;height:38px;flex-shrink:0;border-radius:50%;border:0;cursor:pointer;display:grid;' +
    'place-items:center;background:linear-gradient(120deg,#FF7A00,#FFA726);' +
    'box-shadow:0 8px 20px rgba(255,122,0,.4);}' +
  '.kq-btn svg{width:17px;height:17px;color:#0A0A0A;}' +
  '.kq-seek{flex:1;display:flex;gap:4px;height:8px;align-items:stretch;cursor:pointer;}' +
  '.kq-seg{flex:1;border-radius:99px;background:rgba(255,255,255,.16);overflow:hidden;}' +
  '.kq-seg i{display:block;height:100%;width:0;border-radius:99px;' +
    'background:linear-gradient(90deg,#FF7A00,#FFB347);}' +
  '.kq-time{font-size:12.5px;font-weight:800;font-variant-numeric:tabular-nums;flex-shrink:0;' +
    'color:rgba(255,255,255,.86)!important;-webkit-text-fill-color:rgba(255,255,255,.86)!important;}' +
  '.kq-act{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);cursor:pointer;' +
    'border-radius:99px;padding:9px 16px;font-size:13px;font-weight:800;flex-shrink:0;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;}' +
  '.kq-act.primary{background:linear-gradient(120deg,#FF7A00,#FFA726);border:0;' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;}' +
  '.kq-tag{position:absolute;top:16px;left:16px;display:inline-flex;align-items:center;gap:8px;' +
    'padding:7px 13px;border-radius:99px;background:rgba(0,0,0,.5);' +
    'border:1px solid rgba(255,255,255,.16);font-size:11.5px;font-weight:900;letter-spacing:.1em;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;}' +
  '.kq-tag i{width:7px;height:7px;border-radius:50%;background:#F87171;box-shadow:0 0 10px #F87171;}' +
  '@media(max-width:700px){.kq-time{display:none}}' +
  '@media(prefers-reduced-motion:reduce){#kq-player *{animation:none!important;transition:none!important}}';

  function style() {
    if (document.getElementById('kq-style')) return;
    var s = document.createElement('style');
    s.id = 'kq-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- reading the question off the page ---------- */
  function text(el) { return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }

  /* A worked solution is written as paragraphs and <br>s. textContent welds
     them into one run-on line ("= -6Combine the middle terms"), which then
     splits into a single "step". Turn every block boundary into a real line
     break first, so each line of the solution becomes its own step. */
  function blockText(el) {
    if (!el) return '';
    return (el.innerHTML || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .split('\n')
      .map(function (l) { return l.replace(/\s+/g, ' ').trim(); })
      .filter(Boolean)
      .join('\n');
  }

  function readQuestion() {
    var wrong = document.querySelector('.opt.is-wrong, .opt.wrong, .opt.is-incorrect');
    if (!wrong) return null;
    var right = document.querySelector('.opt.is-right, .opt.correct, .opt.is-correct');
    var stem = text(document.getElementById('qText')) ||
               text(document.querySelector('.qtext, .qstem, .question'));
    var sol = blockText(document.getElementById('solBody'));
    /* Each option carries its letter in a badge element. Drop the badge from a
       clone rather than stripping a leading letter by pattern: "A(√5 − 2)" has
       no separator after the A, and an option that genuinely begins with a
       capital would lose its first letter. */
    function opt(el) {
      if (!el) return '';
      var c = el.cloneNode(true);
      var badge = c.querySelector('.ltr, .opt__k, .opt__letter, .key');
      if (badge) badge.remove();
      return text(c);
    }
    return {
      stem: stem,
      picked: opt(wrong),
      correct: opt(right),
      solution: sol
    };
  }

  /* ---------- turning it into scenes ---------- */
  function sentences(s) {
    if (!s) return [];
    /* lines first (the solution's own structure), then sentences inside a
       long line — a step should be one idea, not one paragraph */
    var out = [];
    s.split('\n').forEach(function (line) {
      line.split(/(?<=[.!?])\s+/).forEach(function (part) {
        var t = part.trim();
        if (t.length > 2) out.push(t);
      });
    });
    return out;
  }
  function secondsFor(line) {
    var words = (line || '').split(/\s+/).length;
    return Math.max(2.8, Math.min(9, words * 0.42 + 1.1));
  }

  function buildScenes(q) {
    var sc = [];
    sc.push({
      kind: 'title',
      say: 'Let us understand this question together.',
      html: '<div class="kq-kicker">Why that was wrong</div>' +
            '<div class="kq-h">' + esc(q.stem || 'Let us look at this question') + '</div>' +
            '<div class="kq-p">Chalo, isko step by step samajhte hain.</div>'
    });
    if (q.picked) {
      sc.push({
        kind: 'bad',
        say: 'You chose ' + q.picked + '. That one is not right.',
        html: '<div class="kq-kicker">Your answer</div>' +
              '<div class="kq-chip bad"><span class="kq-mark">✕</span>' +
              '<span class="kq-txt">' + esc(q.picked) + '</span></div>' +
              '<div class="kq-p">Ye wala sahi nahi tha — dekhte hain kyun.</div>'
      });
    }
    if (q.correct) {
      sc.push({
        kind: 'good',
        say: 'The correct answer is ' + q.correct + '.',
        html: '<div class="kq-kicker">Correct answer</div>' +
              '<div class="kq-chip good"><span class="kq-mark">✓</span>' +
              '<span class="kq-txt">' + esc(q.correct) + '</span></div>' +
              '<div class="kq-p">Ab samajhte hain ye kyun sahi hai.</div>'
      });
    }
    var steps = sentences(q.solution).slice(0, 5);
    steps.forEach(function (line, i) {
      sc.push({
        kind: 'step',
        say: line,
        html: '<div class="kq-kicker">Step ' + (i + 1) + ' of ' + steps.length + '</div>' +
              '<div class="kq-step"><span class="n">' + (i + 1) + '</span>' +
              '<span class="kq-p">' + esc(line) + '</span></div>'
      });
    });
    sc.push({
      kind: 'end',
      say: 'Got it? Try the next question.',
      html: '<div class="kq-kicker">You are set</div>' +
            '<div class="kq-h">Samajh aa gaya? Agla question try karo.</div>' +
            '<div class="kq-p">This explainer replays any time — tap the ▶ button under the question.</div>'
    });
    sc.forEach(function (s) { s.dur = secondsFor(s.say); });
    return sc;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function clock(t) {
    t = Math.max(0, Math.round(t));
    return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
  }

  /* ---------- the player ---------- */
  var live = null;

  function play(scenes) {
    close();
    style();

    var total = scenes.reduce(function (a, s) { return a + s.dur; }, 0);

    var wrap = document.createElement('div');
    wrap.id = 'kq-player';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'Explainer video');
    wrap.innerHTML =
      '<div class="kq-box">' +
        '<div class="kq-stage">' +
          '<div class="kq-grid"></div>' +
          scenes.map(function (s, i) {
            return '<div class="kq-scene" data-i="' + i + '">' + s.html + '</div>';
          }).join('') +
          '<span class="kq-tag"><i></i>EXPLAINER</span>' +
          '<div class="kq-pal"><span class="kq-orb"></span>' +
            '<span class="kq-eq"><i></i><i></i><i></i><i></i><i></i></span><b>PAL</b></div>' +
          '<div class="kq-cap"></div>' +
        '</div>' +
        '<div class="kq-bar">' +
          '<button class="kq-btn" data-act="toggle" aria-label="Pause">' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg>' +
          '</button>' +
          '<div class="kq-seek">' +
            scenes.map(function () { return '<span class="kq-seg"><i></i></span>'; }).join('') +
          '</div>' +
          '<span class="kq-time">0:00 / ' + clock(total) + '</span>' +
          '<button class="kq-act" data-act="replay">Replay</button>' +
          '<button class="kq-act primary" data-act="close">Got it</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    var scenesEl = wrap.querySelectorAll('.kq-scene');
    var segs = wrap.querySelectorAll('.kq-seg i');
    var cap = wrap.querySelector('.kq-cap');
    var timeEl = wrap.querySelector('.kq-time');
    var toggle = wrap.querySelector('[data-act=toggle]');

    var state = { i: -1, t: 0, playing: true, raf: 0, last: 0 };
    live = { wrap: wrap, state: state };

    function speak(line) {
      if (!window.speechSynthesis) return;
      try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(line);
        var vs = speechSynthesis.getVoices() || [];
        for (var i = 0; i < vs.length; i++) {
          if (/en-IN|en_IN/i.test(vs[i].lang)) { u.voice = vs[i]; break; }
        }
        u.rate = .98; u.pitch = 1.05;
        speechSynthesis.speak(u);
      } catch (e) { /* narration is a bonus, never a requirement */ }
    }

    function show(i) {
      if (i === state.i) return;
      state.i = i;
      for (var k = 0; k < scenesEl.length; k++) scenesEl[k].classList.toggle('on', k === i);
      cap.textContent = scenes[i].say;
      speak(scenes[i].say);
    }

    function paint() {
      var acc = 0, idx = 0;
      for (var k = 0; k < scenes.length; k++) {
        var start = acc, end = acc + scenes[k].dur;
        var p = state.t <= start ? 0 : state.t >= end ? 1 : (state.t - start) / scenes[k].dur;
        segs[k].style.width = (p * 100) + '%';
        if (state.t >= start && state.t < end) idx = k;
        acc = end;
      }
      if (state.t >= total) idx = scenes.length - 1;
      show(idx);
      timeEl.textContent = clock(Math.min(state.t, total)) + ' / ' + clock(total);
    }

    /* The clock is a plain interval, not requestAnimationFrame: rAF stops in a
       background tab, and a "video" that silently freezes when the student
       switches tabs is worse than one that ticks at 10fps. Scene changes are
       CSS transitions, so nothing needs frame-accurate timing. */
    var STEP = 100;
    function tick() {
      if (!state.playing) return;
      state.t += STEP / 1000;
      if (state.t >= total) {
        state.t = total;
        paint();
        pause();
        return;
      }
      paint();
    }

    function start() {
      state.playing = true;
      wrap.classList.add('playing');
      toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg>';
      clearInterval(state.raf);
      state.raf = setInterval(tick, STEP);
      paint();
    }
    function pause() {
      state.playing = false;
      wrap.classList.remove('playing');
      toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      clearInterval(state.raf);
      if (window.speechSynthesis) { try { speechSynthesis.pause(); } catch (e) {} }
    }

    wrap.addEventListener('click', function (e) {
      var act = e.target.closest && e.target.closest('[data-act]');
      if (act) {
        var a = act.getAttribute('data-act');
        if (a === 'close') return close();
        if (a === 'replay') { state.t = 0; state.i = -1; return start(); }
        if (a === 'toggle') {
          if (state.playing) return pause();
          if (state.t >= total) { state.t = 0; state.i = -1; }
          if (window.speechSynthesis) { try { speechSynthesis.resume(); } catch (er) {} }
          return start();
        }
      }
      var seg = e.target.closest && e.target.closest('.kq-seg');
      if (seg) {
        var idx = Array.prototype.indexOf.call(wrap.querySelectorAll('.kq-seg'), seg);
        var acc = 0;
        for (var k = 0; k < idx; k++) acc += scenes[k].dur;
        state.t = acc; state.i = -1;
        return start();
      }
      if (e.target === wrap) close();
    });

    document.addEventListener('keydown', onKey);
    function onKey(e) {
      if (e.key === 'Escape') close();
      else if (e.key === ' ') { e.preventDefault(); state.playing ? pause() : start(); }
    }
    wrap._onKey = onKey;

    paint();
    start();
  }

  function close() {
    if (!live) return;
    clearInterval(live.state.raf);
    if (window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (e) {} }
    if (live.wrap._onKey) document.removeEventListener('keydown', live.wrap._onKey);
    if (live.wrap.parentNode) live.wrap.parentNode.removeChild(live.wrap);
    live = null;
  }

  /* ---------- the trigger ---------- */
  var lastKey = '';

  function maybeExplain() {
    var q = readQuestion();
    if (!q) { lastKey = ''; return; }
    var key = q.stem + '|' + q.picked;
    if (key === lastKey) return;          // same question, already handled
    lastKey = key;
    addReplayButton();
    /* let the red option register first — the explainer is a follow-up to
       seeing the mistake, not a replacement for it */
    setTimeout(function () {
      if (readQuestion()) play(buildScenes(q));
    }, 700);
  }

  /* a way back into the explainer without answering wrong again */
  function addReplayButton() {
    var sol = document.getElementById('solution');
    if (!sol || sol.querySelector('.kq-again')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'kq-again kq-act primary';
    b.style.cssText = 'margin-top:14px;display:inline-flex;align-items:center;gap:8px;';
    b.innerHTML = '▶ Watch the explainer';
    b.addEventListener('click', function () {
      var q = readQuestion();
      if (q) play(buildScenes(q));
    });
    sol.appendChild(b);
  }

  /* =========================================================
     BOOT
     ========================================================= */
  function start() {
    rewordTree(document.body);
    quizStyle();

    var mo = new MutationObserver(function (recs) {
      var touched = false;
      for (var i = 0; i < recs.length; i++) {
        if (recs[i].addedNodes && recs[i].addedNodes.length) touched = true;
      }
      if (touched) { rewordTree(document.body); quizStyle(); }
      maybeExplain();
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true,
      attributeFilter: ['class'] });

    maybeExplain();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
