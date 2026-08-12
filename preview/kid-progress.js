/* ============================================================
   BESTBRAIN — MARK A CHAPTER COMPLETE  (QA S-06)
   ------------------------------------------------------------
   A student could read a chapter end to end and the product had
   no way to record it. Learn kept saying "0 of 10 chapters done";
   the dashboard kept saying "Nothing in progress yet". Chapters
   done, streak, XP, level, subject mastery, the badge shelf and
   the gap analysis are all built on a number the UI gave nobody a
   way to move.

   The backend already understood this: /api/progress/sync accepts
   a `chapter_completed` event and sets `chapters[id].completed`.
   Nothing ever sent one. This adds the control that does.

   Design notes:
     · The button lands at the END of the reading, which is where
       the claim "I have read this" is actually true.
     · It is optimistic — the state flips immediately and reverts
       if the call fails, because a student who taps and sees
       nothing happen taps again.
     · Completion is idempotent: the event carries a stable id
       derived from the chapter, so a double tap cannot count
       twice.
   ============================================================ */
(function () {
  'use strict';

  function pageKey() {
    return (location.pathname.split('/').pop() || '').toLowerCase().replace(/\.html$/, '') || 'index';
  }
  /* the reader lives on lesson.html, and on /lesson/:id under the router */
  if (pageKey().indexOf('lesson') === -1) return;

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

  /* The chapter id the rest of the app uses. The lesson hub carries it in the
     query string; fall back to the path segment the router uses. */
  function chapterId() {
    var q = new URLSearchParams(location.search);
    var id = q.get('ch') || q.get('chapter') || q.get('id');
    if (id) return id;
    var seg = location.pathname.split('/').filter(Boolean).pop();
    return seg && seg !== 'lesson' ? decodeURIComponent(seg) : null;
  }
  function chapterTitle() {
    var h = document.querySelector('h1, .lesson__title, .chapter__title');
    return h ? h.textContent.replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  }

  var CSS =
  '#kg{margin:26px 0 8px;padding:20px 22px;border-radius:20px;' +
    'background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.13);' +
    'display:flex;align-items:center;gap:16px;flex-wrap:wrap;}' +
  '#kg .t{flex:1;min-width:200px;}' +
  '#kg b{display:block;font-size:15.5px;font-weight:900;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;}' +
  '#kg span{display:block;margin-top:4px;font-size:13px;line-height:1.5;' +
    'color:rgba(255,255,255,.72)!important;-webkit-text-fill-color:rgba(255,255,255,.72)!important;}' +
  '#kg-btn{flex:none;display:inline-flex;align-items:center;gap:9px;height:50px;padding:0 22px;' +
    'border:0;border-radius:14px;cursor:pointer;font-size:15px;font-weight:900;' +
    'background:linear-gradient(120deg,#FFC400,#FFDD3C);' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;' +
    'box-shadow:0 0 0 1px rgba(255,214,60,.55),0 12px 30px rgba(255,200,0,.42);' +
    'transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease;}' +
  '#kg-btn:hover:not(:disabled){transform:translateY(-2px);}' +
  '#kg-btn:disabled{cursor:default;transform:none;}' +
  '#kg-btn svg{width:17px;height:17px;}' +
  /* done is a state, not a disabled button — it should look earned */
  '#kg.is-done{background:rgba(52,211,153,.12);border-color:rgba(52,211,153,.42);}' +
  '#kg.is-done #kg-btn{background:linear-gradient(120deg,#34D399,#6EE7B7);' +
    'box-shadow:0 0 0 1px rgba(52,211,153,.5),0 12px 30px rgba(52,211,153,.34);}' +
  '#kg-msg{flex-basis:100%;font-size:12.5px;font-weight:600;' +
    'color:#FFD9D9!important;-webkit-text-fill-color:#FFD9D9!important;}';

  var TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>';

  function style() {
    if (document.getElementById('kg-css')) return;
    var s = document.createElement('style');
    s.id = 'kg-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var done = false, busy = false;

  function paint(card, btn) {
    card.classList.toggle('is-done', done);
    btn.innerHTML = TICK + (done ? 'Completed' : 'Mark as complete');
    btn.disabled = busy || done;
    var sub = card.querySelector('.t span');
    if (sub) {
      sub.textContent = done
        ? 'Counted towards your chapters, streak and subject mastery.'
        : 'Tap when you have read this — it updates your progress and streak.';
    }
  }

  function send(id, card, btn) {
    if (busy || done) return;
    var t = token();
    if (!t) return fail(card, 'Sign in to save your progress.');

    busy = true;
    done = true;                 // optimistic: a tap must do something at once
    paint(card, btn);

    fetch(api() + '/api/progress/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
      body: JSON.stringify({
        events: [{
          /* stable, so a double tap is the same event and cannot count twice */
          clientEventId: 'chapter-complete-' + id,
          type: 'chapter_completed',
          payload: { chapterId: id, title: chapterTitle() },
          occurredAt: new Date().toISOString()
        }]
      })
    }).then(function (r) {
      busy = false;
      if (!r.ok) throw new Error('rejected');
      /* mirror it locally so Learn and the dashboard agree before their next fetch */
      try {
        var k = 'edulearn_state';
        var st = JSON.parse(localStorage.getItem(k) || '{}');
        st.chapters = st.chapters || {};
        st.chapters[id] = Object.assign({}, st.chapters[id], { completed: true, pct: 100 });
        localStorage.setItem(k, JSON.stringify(st));
      } catch (e) { /* private mode — the server still has it */ }
      paint(card, btn);
    }).catch(function () {
      busy = false;
      done = false;              // it did not happen; do not pretend it did
      paint(card, btn);
      fail(card, 'Could not save that just now — check your connection and tap again.');
    });
  }

  function fail(card, text) {
    var m = card.querySelector('#kg-msg');
    if (!m) {
      m = document.createElement('div');
      m.id = 'kg-msg';
      card.appendChild(m);
    }
    m.textContent = text;
  }

  function build() {
    if (document.getElementById('kg')) return;
    var id = chapterId();
    if (!id) return;

    /* the end of the reading is where "I have read this" becomes true */
    var host = document.querySelector('.notes, .lesson__body, .reader, main') || document.body;
    style();

    var card = document.createElement('div');
    card.id = 'kg';
    card.innerHTML =
      '<div class="t"><b>Finished this chapter?</b><span></span></div>' +
      '<button id="kg-btn" type="button"></button>';
    host.appendChild(card);

    var btn = card.querySelector('#kg-btn');

    /* if it is already done, say so rather than inviting a second tap */
    try {
      var st = JSON.parse(localStorage.getItem('edulearn_state') || '{}');
      if (st.chapters && st.chapters[id] && st.chapters[id].completed) done = true;
    } catch (e) {}

    paint(card, btn);
    btn.addEventListener('click', function () { send(id, card, btn); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(build, 400); });
  } else {
    setTimeout(build, 400);
  }
  setTimeout(build, 1400);       // the reader renders after its data lands
})();
