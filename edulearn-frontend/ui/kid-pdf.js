/* ============================================================
   BESTBRAIN - PDF GENERATOR
   ------------------------------------------------------------
   Lives beside the AI Tutor: a student types a science topic and
   gets a structured, NCERT-aligned study sheet they can read or
   save as a PDF.

   The PDF is produced by the browser's own print engine rather
   than a PDF library. That is a deliberate trade: it costs no
   dependency and no server work, the page prints exactly the
   typography the student just read, and page breaks are handled
   by the engine that already knows how to paginate text. The
   sheet is opened in its own window so printing it cannot drag
   the app's chrome along.

   The server returns DATA, never markup, a fixed set of sections
   it validates, so nothing a model writes is ever injected as
   HTML. Everything below renders with textContent.
   ============================================================ */
(function () {
  'use strict';

  /* Reachable from anywhere. It was gated to the tutor page, which is also
     the one place a student had no reason to look for it. */
  function pageKey() {
    return (location.pathname.split('/').pop() || '').toLowerCase().replace(/\.html$/, '') || 'index';
  }
  var PUBLIC = ['index', 'login', 'signup'];

  /* The app resolves its own API host, a deployed build talks to a different
     origin than the one it is served from. Reading that first is the only way
     these calls land where every other call in the app lands; location.origin
     is a last resort for the static pages, which are same-origin anyway. */
  function api() {
    try {
      if (window.EduAPI && window.EduAPI.API_BASE) return window.EduAPI.API_BASE;
    } catch (e) { /* not on this page */ }
    try {
      var o = localStorage.getItem('edulearn_api');
      if (o) return o.replace(/\/+$/, '');
    } catch (e) { /* storage blocked */ }
    return location.origin;
  }
  function token() {
    try { return localStorage.getItem('edulearn_token') || ''; } catch (e) { return ''; }
  }

  var CSS =
  /* ---------- the launcher ---------- */
  '#kp-open{position:fixed;right:22px;bottom:86px;z-index:80;display:inline-flex;align-items:center;' +
    'gap:10px;padding:13px 20px;border:0;border-radius:99px;cursor:pointer;font-size:14px;font-weight:800;' +
    'background:linear-gradient(120deg,#FF7A00,#FFA726);color:#0A0A0A!important;' +
    '-webkit-text-fill-color:#0A0A0A!important;' +
    'box-shadow:0 14px 34px rgba(255,122,0,.45);' +
    'transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s ease;}' +
  '#kp-open:hover{transform:translateY(-3px);box-shadow:0 20px 46px rgba(255,122,0,.55);}' +
  '#kp-open svg{width:17px;height:17px;}' +

  /* ---------- the sheet ---------- */
  '#kp{position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;' +
    'padding:clamp(12px,3vw,40px);background:rgba(3,3,3,.86);' +
    'backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);' +
    'opacity:0;animation:kp-fade .3s ease forwards;}' +
  '@keyframes kp-fade{to{opacity:1}}' +
  '#kp *{box-sizing:border-box;}' +
  '.kp-box{width:min(760px,100%);max-height:100%;display:flex;flex-direction:column;' +
    'border-radius:24px;overflow:hidden;background:#0B0908;' +
    'border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 120px rgba(0,0,0,.7);' +
    'transform:translateY(16px) scale(.99);animation:kp-rise .4s cubic-bezier(.22,1,.36,1) .04s forwards;}' +
  '@keyframes kp-rise{to{transform:none}}' +
  '.kp-hd{padding:24px 26px 20px;border-bottom:1px solid rgba(255,255,255,.1);' +
    'background:radial-gradient(700px 300px at 10% 0,rgba(255,122,0,.16),transparent 65%);}' +
  '.kp-eye{display:inline-flex;align-items:center;gap:8px;padding:6px 13px;border-radius:99px;' +
    'background:rgba(255,122,0,.14);border:1px solid rgba(255,122,0,.34);font-size:11.5px;' +
    'font-weight:900;letter-spacing:.11em;text-transform:uppercase;' +
    'color:#FFC98A!important;-webkit-text-fill-color:#FFC98A!important;}' +
  '.kp-hd h2{margin:14px 0 6px;font-size:clamp(21px,2.5vw,27px);font-weight:900;letter-spacing:-.02em;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;}' +
  '.kp-hd p{margin:0;font-size:14px;line-height:1.6;' +
    'color:rgba(255,255,255,.86)!important;-webkit-text-fill-color:rgba(255,255,255,.86)!important;}' +
  '.kp-body{padding:22px 26px 26px;overflow:auto;}' +
  '.kp-row{display:flex;gap:10px;flex-wrap:wrap;}' +
  '#kp-topic{flex:1;min-width:220px;padding:14px 16px;border-radius:14px;font-size:15px;font-weight:600;' +
    'background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.16)!important;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;outline:none;' +
    'transition:border-color .25s ease,box-shadow .25s ease;}' +
  '#kp-topic:focus{border-color:rgba(255,150,60,.75)!important;' +
    'box-shadow:0 0 0 4px rgba(255,122,0,.18);}' +
  '#kp-topic::placeholder{color:rgba(255,255,255,.5)!important;' +
    '-webkit-text-fill-color:rgba(255,255,255,.5)!important;}' +
  '.kp-btn{padding:14px 22px;border:0;border-radius:14px;cursor:pointer;font-size:14.5px;font-weight:800;' +
    'background:linear-gradient(120deg,#FF7A00,#FFA726);color:#0A0A0A!important;' +
    '-webkit-text-fill-color:#0A0A0A!important;box-shadow:0 12px 30px rgba(255,122,0,.4);' +
    'transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease,opacity .2s ease;}' +
  '.kp-btn:hover:not(:disabled){transform:translateY(-2px);}' +
  '.kp-btn:disabled{opacity:.55;cursor:default;box-shadow:none;}' +
  '.kp-btn.ghost{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.18);' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;box-shadow:none;}' +
  '.kp-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;}' +
  '.kp-chip{padding:7px 13px;border-radius:99px;cursor:pointer;font-size:12.5px;font-weight:700;' +
    'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);' +
    'color:rgba(255,255,255,.88)!important;-webkit-text-fill-color:rgba(255,255,255,.88)!important;' +
    'transition:background .22s ease,border-color .22s ease,transform .22s ease;}' +
  '.kp-chip:hover{background:rgba(255,122,0,.16);border-color:rgba(255,150,60,.5);transform:translateY(-2px);}' +
  '.kp-msg{margin-top:14px;padding:11px 14px;border-radius:12px;font-size:13.5px;font-weight:600;' +
    'background:rgba(239,68,68,.16);border:1px solid rgba(239,68,68,.42);' +
    'color:#FFD9D9!important;-webkit-text-fill-color:#FFD9D9!important;}' +
  '.kp-note{margin-top:12px;font-size:12.5px;line-height:1.55;' +
    'color:rgba(255,255,255,.7)!important;-webkit-text-fill-color:rgba(255,255,255,.7)!important;}' +

  /* ---------- working ---------- */
  '.kp-work{display:flex;align-items:center;gap:14px;margin-top:18px;padding:16px;border-radius:16px;' +
    'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);}' +
  '.kp-spin{width:26px;height:26px;flex-shrink:0;border-radius:50%;' +
    'border:3px solid rgba(255,122,0,.25);border-top-color:#FF7A00;' +
    'animation:kp-turn .8s linear infinite;}' +
  '@keyframes kp-turn{to{transform:rotate(360deg)}}' +
  '.kp-work b{display:block;font-size:14px;color:#fff!important;-webkit-text-fill-color:#fff!important;}' +
  '.kp-work span{font-size:12.5px;color:rgba(255,255,255,.72)!important;' +
    '-webkit-text-fill-color:rgba(255,255,255,.72)!important;}' +

  /* ---------- preview ---------- */
  '.kp-prev{margin-top:18px;border-radius:16px;overflow:hidden;' +
    'border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.04);}' +
  '.kp-prev-hd{padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.1);' +
    'font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;' +
    'color:#FFC98A!important;-webkit-text-fill-color:#FFC98A!important;}' +
  '.kp-prev-bd{max-height:280px;overflow:auto;padding:16px;}' +
  '.kp-prev-bd h4{margin:14px 0 6px;font-size:14px;font-weight:800;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;}' +
  '.kp-prev-bd h4:first-child{margin-top:0;}' +
  '.kp-prev-bd p,.kp-prev-bd li{font-size:13px;line-height:1.6;' +
    'color:rgba(255,255,255,.86)!important;-webkit-text-fill-color:rgba(255,255,255,.86)!important;}' +
  '.kp-prev-bd ul{margin:6px 0 0 18px;}' +
  '@media(prefers-reduced-motion:reduce){#kp *,#kp-open{animation:none!important;transition:none!important}}';

  function style() {
    if (document.getElementById('kp-css')) return;
    var s = document.createElement('style');
    s.id = 'kp-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>' +
    '<path d="M14 3v5h5M9 13h6M9 17h4"/></svg>';

  /* Class 6 chapters, and not science alone, a study sheet is as useful for
     fractions or the Mughal empire as it is for photosynthesis. */
  var SUGGEST = ['Food: Where Does It Come From?', 'Fractions', 'Light and Shadows',
    'Electricity and Circuits', 'Our Past - Early Humans'];

  var doc = null;

  /* ---------- the printable sheet ----------
     Built with the DOM, never with a string of HTML: every value here came
     from a model, and textContent is what guarantees it stays text. */
  function sheet() {
    var w = window.open('', '_blank');
    if (!w) return false;

    var d = w.document;
    d.write('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');
    d.close();
    d.title = doc.topic + ' - BestBrain study sheet';

    var st = d.createElement('style');
    st.textContent =
      '*{box-sizing:border-box}' +
      'body{margin:0;padding:44px 52px;font-family:Nunito,-apple-system,BlinkMacSystemFont,' +
        '"Segoe UI",Roboto,sans-serif;color:#12100E;background:#fff;line-height:1.62;}' +
      '.hd{border-bottom:3px solid #FF7A00;padding-bottom:18px;margin-bottom:26px;}' +
      '.brand{font-size:12px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#FF7A00;}' +
      'h1{margin:8px 0 6px;font-size:30px;font-weight:900;letter-spacing:-.02em;}' +
      '.meta{font-size:13px;color:#5C5650;}' +
      'h2{margin:26px 0 8px;font-size:17px;font-weight:900;color:#12100E;' +
        'border-left:4px solid #FF7A00;padding-left:11px;}' +
      'p{margin:0 0 10px;font-size:14px;}' +
      'ul{margin:0 0 10px;padding-left:22px;}' +
      'li{font-size:14px;margin-bottom:6px;}' +
      '.ft{margin-top:34px;padding-top:14px;border-top:1px solid #E3DED8;' +
        'font-size:11.5px;color:#7A736C;}' +
      /* keep a heading with the text it introduces when the page breaks */
      'h2{break-after:avoid;page-break-after:avoid;}' +
      'li,p{break-inside:avoid;page-break-inside:avoid;}' +
      '@page{margin:16mm;}';
    d.head.appendChild(st);

    function el(tag, text, cls) {
      var n = d.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    }

    var hd = el('div', null, 'hd');
    hd.appendChild(el('div', 'BestBrain · Study Sheet', 'brand'));
    hd.appendChild(el('h1', doc.topic));
    hd.appendChild(el('div', doc.className + ' · ' + doc.subject + ' · NCERT-aligned', 'meta'));
    d.body.appendChild(hd);

    doc.sections.forEach(function (s) {
      d.body.appendChild(el('h2', s.heading));
      (s.body || []).forEach(function (p) { d.body.appendChild(el('p', p)); });
      if (s.points && s.points.length) {
        var ul = d.createElement('ul');
        s.points.forEach(function (li) { ul.appendChild(el('li', li)); });
        d.body.appendChild(ul);
      }
    });

    d.body.appendChild(el('div',
      doc.generated
        ? 'Generated by BestBrain from the NCERT curriculum. Written for revision, check your textbook before exams.'
        : 'Structure only, the explanation could not be generated. Fill it in from your textbook or ask PAL.',
      'ft'));

    return w;
  }

  function open() {
    style();
    if (document.getElementById('kp')) return;

    var wrap = document.createElement('div');
    wrap.id = 'kp';
    wrap.innerHTML =
      '<div class="kp-box">' +
        '<div class="kp-hd">' +
          '<span class="kp-eye">' + ICON + 'Study sheet</span>' +
          '<h2>PDF Generator</h2>' +
          '<p>Enter any chapter or topic from your syllabus and get a structured, NCERT-aligned study sheet.</p>' +
        '</div>' +
        '<div class="kp-body">' +
          '<div class="kp-row">' +
            '<input id="kp-topic" type="text" placeholder="Enter your topic…" autocomplete="off">' +
            '<button class="kp-btn" data-act="go">Generate PDF</button>' +
            '<button class="kp-btn ghost" data-act="close">Close</button>' +
          '</div>' +
          '<div class="kp-chips"></div>' +
          '<div id="kp-out"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    var chips = wrap.querySelector('.kp-chips');
    SUGGEST.forEach(function (t) {
      var c = document.createElement('button');
      c.className = 'kp-chip';
      c.type = 'button';
      c.textContent = t;
      c.addEventListener('click', function () {
        wrap.querySelector('#kp-topic').value = t;
        go();
      });
      chips.appendChild(c);
    });

    var out = wrap.querySelector('#kp-out');
    var goBtn = wrap.querySelector('[data-act=go]');
    var input = wrap.querySelector('#kp-topic');

    function fail(msg) {
      out.innerHTML = '';
      var e = document.createElement('div');
      e.className = 'kp-msg';
      e.textContent = msg;
      out.appendChild(e);
    }

    function working() {
      out.innerHTML =
        '<div class="kp-work"><span class="kp-spin"></span>' +
        '<span><b>Writing your study sheet…</b>' +
        '<span>Covering the concepts, definitions, examples and revision questions.</span></span></div>';
    }

    function ready() {
      out.innerHTML = '';

      var prev = document.createElement('div');
      prev.className = 'kp-prev';
      var h = document.createElement('div');
      h.className = 'kp-prev-hd';
      h.textContent = 'Preview · ' + doc.sections.length + ' sections';
      prev.appendChild(h);

      var bd = document.createElement('div');
      bd.className = 'kp-prev-bd';
      doc.sections.forEach(function (s) {
        var hh = document.createElement('h4');
        hh.textContent = s.heading;
        bd.appendChild(hh);
        (s.body || []).forEach(function (p) {
          var pp = document.createElement('p');
          pp.textContent = p;
          bd.appendChild(pp);
        });
        if (s.points && s.points.length) {
          var ul = document.createElement('ul');
          s.points.forEach(function (t) {
            var li = document.createElement('li');
            li.textContent = t;
            ul.appendChild(li);
          });
          bd.appendChild(ul);
        }
      });
      prev.appendChild(bd);
      out.appendChild(prev);

      var row = document.createElement('div');
      row.className = 'kp-row';
      row.style.marginTop = '16px';

      function act(label, cls, fn) {
        var b = document.createElement('button');
        b.className = 'kp-btn' + (cls ? ' ' + cls : '');
        b.textContent = label;
        b.addEventListener('click', fn);
        row.appendChild(b);
      }
      act('Download PDF', '', function () {
        var w = sheet();
        if (!w) return fail('Your browser blocked the sheet window, allow pop-ups and try again.');
        /* let the fonts settle before the print dialog measures the page */
        setTimeout(function () { w.focus(); w.print(); }, 400);
      });
      act('View sheet', 'ghost', function () {
        if (!sheet()) fail('Your browser blocked the sheet window, allow pop-ups and try again.');
      });
      act('Generate another', 'ghost', function () {
        doc = null;
        out.innerHTML = '';
        input.value = '';
        input.focus();
      });
      out.appendChild(row);

      if (!doc.generated) {
        var n = document.createElement('p');
        n.className = 'kp-note';
        n.textContent = 'The tutor could not write the explanation just now, so this sheet is the ' +
          'structure to fill in from your textbook. Everything else works the same.';
        out.appendChild(n);
      }
    }

    function go() {
      var topic = (input.value || '').trim();
      if (!topic) { input.focus(); return fail('Enter a topic first.'); }

      goBtn.disabled = true;
      working();

      fetch(api() + '/api/pal/study-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token()
        },
        body: JSON.stringify({ topic: topic })
      })
        .then(function (r) {
          return r.json().then(function (d) { return { ok: r.ok, d: d }; });
        })
        .then(function (res) {
          goBtn.disabled = false;
          if (!res.ok) return fail(res.d && res.d.error ? res.d.error : 'Could not generate the sheet.');
          if (!res.d || !Array.isArray(res.d.sections) || !res.d.sections.length) {
            return fail('The sheet came back empty, try a different topic.');
          }
          doc = res.d;
          ready();
        })
        .catch(function () {
          goBtn.disabled = false;
          fail('Could not reach the server. Check your connection and try again.');
        });
    }

    goBtn.addEventListener('click', go);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    wrap.querySelector('[data-act=close]').addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.addEventListener('keydown', onKey);
    setTimeout(function () { input.focus(); }, 80);
  }

  function onKey(e) { if (e.key === 'Escape') close(); }

  function close() {
    var w = document.getElementById('kp');
    if (w) w.remove();
    document.removeEventListener('keydown', onKey);
  }

  function launcher() {
    if (document.getElementById('kp-open')) return;
    var b = document.createElement('button');
    b.id = 'kp-open';
    b.type = 'button';
    b.innerHTML = ICON + 'PDF Generator';
    b.addEventListener('click', open);
    document.body.appendChild(b);
  }

  /* The rail is the front door, see kid-ui. This is the handle it pulls. */
  window.KidPDF = { open: open, close: close };

  function start() {
    if (PUBLIC.indexOf(pageKey()) !== -1) return;   // not on the public pages
    style();
    if (pageKey() === 'tutor') launcher();          // and a shortcut where it was born
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
