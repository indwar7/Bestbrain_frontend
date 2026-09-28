/* ============================================================
   BESTBRAIN - CONTENT-FIRST CHAPTERS  (preview only)
   ------------------------------------------------------------
   learn.html renders its chapter list from an inline curriculum
   and gives every row the same Video / Notes / Quiz icons, whether
   or not anything has actually been uploaded for that chapter. A
   student clicks, lands on an empty stage, and learns not to trust
   the icons.

   This asks the backend what content really exists for the class,
   matches it to the chapters on screen, and then:

     · marks the rows that have something to watch or read
     · lifts those rows to the top of the list
     · dims the icons that would open an empty stage

   If the backend is not running, or the class has no content, it
   does nothing at all, the list is left exactly as the page built
   it. Ordering is a hint, never a filter: no chapter is hidden.
   ============================================================ */
(function () {
  'use strict';

  function pageKey() {
    return (location.pathname.split('/').pop() || '').toLowerCase().replace(/\.html$/, '') || 'index';
  }
  if (['learn', 'dashboard'].indexOf(pageKey()) === -1) return;

  /* ---------- matching ----------
     The backend links content to a chapter by class + subject + a word
     set, so the same rule is used here rather than a stricter one that
     would disagree with it and mark real content as missing. */
  var STOP = {
    the: 1, a: 1, an: 1, of: 1, and: 1, or: 1, in: 1, on: 1, to: 1, for: 1,
    with: 1, is: 1, are: 1, it: 1, its: 1, our: 1, we: 1, do: 1, does: 1,
    what: 1, how: 1, why: 1, from: 1, by: 1, at: 1, as: 1, be: 1
  };
  function words(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9ऀ-ॿ]+/g, ' ')
      .split(' ')
      .filter(function (w) { return w.length > 2 && !STOP[w]; });
  }
  function overlaps(a, b) {
    if (!a.length || !b.length) return false;
    var set = {}, i, hit = 0;
    for (i = 0; i < a.length; i++) set[a[i]] = 1;
    for (i = 0; i < b.length; i++) if (set[b[i]]) hit++;
    /* a match is judged against the SHORTER side: "Food: Where Does It Come
       From?" and a note titled "Food" describe the same chapter */
    return hit / Math.min(a.length, b.length) >= 0.6;
  }

  /* ---------- style ---------- */
  var CSS =
  '.kc-has{position:relative;}' +
  '.kc-tags{display:inline-flex;gap:6px;margin-left:10px;vertical-align:middle;}' +
  '.kc-tag{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:99px;' +
    'font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;}' +
  '.kc-tag.v{background:linear-gradient(120deg,#FF7A00,#FFB347);}' +
  '.kc-tag.n{background:linear-gradient(120deg,#34D399,#6EE7B7);}' +
  /* an icon that would open an empty stage should not look inviting */
  '.kc-empty{opacity:.32!important;filter:grayscale(1);}' +
  '.kc-sep{display:flex;align-items:center;gap:12px;margin:22px 2px 12px;' +
    'font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;' +
    'color:rgba(255,255,255,.55)!important;-webkit-text-fill-color:rgba(255,255,255,.55)!important;}' +
  '.kc-sep::after{content:"";flex:1;height:1px;background:rgba(255,255,255,.12);}';

  function style() {
    if (document.getElementById('kc-style')) return;
    var s = document.createElement('style');
    s.id = 'kc-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- the backend ---------- */
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
  function currentClass() {
    try {
      var u = JSON.parse(localStorage.getItem('edulearn_user') || '{}');
      var n = parseInt(u.class, 10);
      if (n) return n;
      var m = String(u.className || '').match(/(\d+)/);
      if (m) return parseInt(m[1], 10);
    } catch (e) { /* fall through */ }
    var chip = document.body.innerText.match(/Class\s+(\d+)/);
    return chip ? parseInt(chip[1], 10) : null;
  }

  function load(kind, cls) {
    var t = token();
    if (!t) return Promise.resolve([]);
    return fetch(api() + '/api/' + kind + '?className=Class%20' + cls, {
      headers: { Authorization: 'Bearer ' + t }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return [];
        var list = Array.isArray(d) ? d : (d[kind] || d.items || d.data || []);
        return Array.isArray(list) ? list : [];
      })
      .catch(function () { return []; });
  }

  /* ---------- the pass ---------- */
  var applied = false;

  function apply(videos, notes) {
    var rows = document.querySelectorAll('.chrow');
    if (!rows.length) return false;

    var vSets = videos.map(function (v) { return words(v.topic || v.title); });
    var nSets = notes.map(function (n) { return words(n.topic || n.title); });

    var withContent = [], without = [];
    rows.forEach(function (row) {
      if (row.classList.contains('kc-done')) return;
      row.classList.add('kc-done');

      var nameEl = row.querySelector('.chrow__name');
      var w = words(nameEl ? nameEl.textContent : '');
      var hasV = vSets.some(function (s) { return overlaps(w, s); });
      var hasN = nSets.some(function (s) { return overlaps(w, s); });

      var mods = row.querySelectorAll('.mod');
      if (mods[0] && !hasV) mods[0].classList.add('kc-empty');
      if (mods[1] && !hasN) mods[1].classList.add('kc-empty');

      if (hasV || hasN) {
        row.classList.add('kc-has');
        if (nameEl && !nameEl.querySelector('.kc-tags')) {
          var tags = document.createElement('span');
          tags.className = 'kc-tags';
          if (hasV) tags.insertAdjacentHTML('beforeend', '<span class="kc-tag v">Video</span>');
          if (hasN) tags.insertAdjacentHTML('beforeend', '<span class="kc-tag n">Notes</span>');
          nameEl.appendChild(tags);
        }
        withContent.push(row);
      } else {
        without.push(row);
      }
    });

    if (!withContent.length) return true;      // nothing to lift; leave the order

    /* Re-order in place. The rows keep their own parent, so the page's own
       click handlers, progress bars and animations are untouched, only the
       sequence changes. */
    var parent = withContent[0].parentNode;
    if (!parent) return true;
    var frag = document.createDocumentFragment();
    withContent.forEach(function (r) { frag.appendChild(r); });

    if (without.length) {
      var sep = document.createElement('div');
      sep.className = 'kc-sep';
      sep.textContent = 'More chapters';
      frag.appendChild(sep);
      without.forEach(function (r) { frag.appendChild(r); });
    }
    parent.appendChild(frag);
    return true;
  }

  /* The dashboard opens a brand-new student on the first chapter of the first
     subject in the syllabus, which is whatever the curriculum happens to list
     first, not whatever they can actually watch. Send them to a chapter that
     has a lecture waiting instead: the first click of the product should not
     land on an empty stage. */
  function fixStartHere(videos, notes) {
    var host = document.querySelector('.nextup__row');
    if (!host) return;

    var title = host.querySelector('.nextup__title');
    var sub = host.querySelector('.nextup__sub');
    var kicker = host.querySelector('.nextup__kicker');
    var cta = host.querySelector('.nextup__cta');
    if (!title || !cta) return;
    if (host.dataset.kcDone) return;

    /* prefer something with a video, that is what "start here" should mean */
    var pick = videos[0] || notes[0];
    if (!pick) return;

    var chapter = pick.title || pick.topic;
    var subject = pick.subject || 'Science';
    host.dataset.kcDone = '1';

    if (kicker) kicker.textContent = 'Start here';
    title.textContent = chapter;
    if (sub) sub.textContent = subject + ' · lecture and notes ready';

    /* Link to the chapter's own video stage. The lesson hub matches content by
       class + subject + topic, which is the same rule the backend uses, so
       the video that made this the pick is the video that opens. */
    var cls = currentClass() || 6;
    cta.setAttribute('href',
      'learn.html?class=' + cls + '&subject=' + encodeURIComponent(subject) +
      '&topic=' + encodeURIComponent(chapter) + '&view=video');
    var label = cta.querySelector('span');
    if (label) label.textContent = 'Watch the lecture';
  }

  function run() {
    var cls = currentClass();
    if (!cls) return;
    style();
    Promise.all([load('videos', cls), load('notes', cls)]).then(function (res) {
      var videos = res[0], notes = res[1];
      if (!videos.length && !notes.length) return;   // nothing uploaded, leave it alone

      if (pageKey() === 'dashboard') {
        fixStartHere(videos, notes);
        setTimeout(function () { fixStartHere(videos, notes); }, 900);
        return;
      }

      applied = apply(videos, notes);

      /* the list re-renders on subject and class switches */
      var mo = new MutationObserver(function () {
        clearTimeout(run._t);
        run._t = setTimeout(function () { apply(videos, notes); }, 160);
      });
      var host = document.querySelector('.chrow') && document.querySelector('.chrow').parentNode;
      if (host) mo.observe(host, { childList: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 500); });
  } else {
    setTimeout(run, 500);
  }
})();
