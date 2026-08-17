/* Lifted verbatim from edulearn-frontend/bank.html — do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {
/* light-only product: strip any stale dark preference before paint */try{if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.remove('dark-mode');}localStorage.setItem('edulearn-theme','light');}catch(e){}

/* ---- next <script> block ---- */


  /* ============================================================
     QUESTION BANK — untimed chapter practice
     ------------------------------------------------------------
     Deliberately not a test. There is no timer, no running score sent
     anywhere, and no submission: the student answers, the server says whether
     that was right and why, and they move on. Getting one wrong is not a
     penalty, so the answer is revealed either way — the point is to learn the
     thing now rather than at the end of a paper.

     Nothing here knows a correctIndex until the server replies to that one
     answer, which is the same contract the mock test works to.

     Reaching the end offers another set rather than a score screen. A score
     would turn practice back into a test.
     ============================================================ */
  (function () {
    'use strict';
    var params = new URLSearchParams(location.search);
    var chapterSlug = params.get('ch') || '';
    var subjectKey = params.get('subject') || '';
    var SUBJECT_NAME = { maths: 'Maths', science: 'Science', social: 'Social Science', english: 'English', hindi: 'Hindi' };
    var subject = SUBJECT_NAME[subjectKey] || 'Science';

    var el = function (id) { return document.getElementById(id); };

    /* Paint a right/wrong verdict so it survives the skin.
       kid-bg turns any near-white opaque surface into glass by writing
       background-color and border-color INLINE with !important — no stylesheet
       rule can outrank that, which is why .opt.bank-right rendered identical
       to every other option. Setting the same properties inline afterwards
       replaces those declarations, and the low-alpha accent this writes does
       not meet the pass's own >=.82-alpha bar, so it is not glassed again.

       The glyph is not decoration. Correctness must not depend on colour
       alone — for colour-blind readers, and because this is exactly the sort
       of styling a later skin pass can take away again. */
    function markState(node, kind) {
      var teal = 'rgba(16,185,129,.22)', rose = 'rgba(244,63,94,.20)';
      var edge = kind === 'right' ? '#10B981' : '#F43F5E';
      node.style.setProperty('background-color', kind === 'right' ? teal : rose, 'important');
      node.style.setProperty('border-color', edge, 'important');
      var glyph = document.createElement('span');
      glyph.className = 'opt__v';
      glyph.textContent = kind === 'right' ? '✓' : '✗';
      glyph.style.setProperty('color', edge, 'important');
      glyph.setAttribute('aria-label', kind === 'right' ? 'correct answer' : 'your answer, incorrect');
      node.appendChild(glyph);
    }

    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    var Q = [];        // the set being drilled
    var i = 0;         // which question
    var answered = 0, right = 0;

    function load() {
      if (!window.EduAPI || !EduAPI.getUser || !EduAPI.getUser()) {
        el('gate').hidden = false;
        return;
      }
      EduAPI.getQuestionBank(subject, chapterSlug || undefined, 10).then(function (res) {
        Q = res.questions || [];
        if (!Q.length) { el('empty').hidden = false; return; }
        if (chapterSlug) {
          el('sub').textContent = 'Practising ' + chapterSlug.replace(/-/g, ' ') +
            '. No timer, no marks — answer, see why, keep going.';
        }
        i = 0;
        el('quiz').hidden = false;
        paint();
      }).catch(function () {
        el('empty').hidden = false;
        el('empty').textContent = 'Could not load practice questions. Check your connection and try again.';
      });
    }

    function paint() {
      var q = Q[i];
      el('qnum').textContent = 'Question ' + (i + 1) + ' of ' + Q.length;
      el('diff').textContent = q.difficulty || '';
      el('qtext').textContent = q.text;
      el('feedback').innerHTML = '';
      el('nextBtn').hidden = true;
      el('moreBtn').hidden = true;
      el('opts').innerHTML = q.options.map(function (o, n) {
        return '<button class="opt" data-i="' + n + '" type="button">' +
          '<span class="opt__k">' + String.fromCharCode(65 + n) + '</span>' +
          '<span>' + esc(o) + '</span></button>';
      }).join('');
      Array.prototype.forEach.call(el('opts').querySelectorAll('.opt'), function (b) {
        b.addEventListener('click', function () { answer(q, Number(b.getAttribute('data-i'))); });
      });
      updateTally();
    }

    function answer(q, chosen) {
      // Lock the options the moment one is picked, so a second click cannot
      // ask the server again for a question that has already been graded.
      var buttons = el('opts').querySelectorAll('.opt');
      Array.prototype.forEach.call(buttons, function (b) { b.disabled = true; });

      EduAPI.answerBankQuestion(q.id, chosen).then(function (r) {
        answered += 1;
        if (r.correct) right += 1;

        Array.prototype.forEach.call(buttons, function (b, n) {
          if (n === r.correctIndex) { b.classList.add('bank-right'); markState(b, 'right'); }
          else if (n === chosen) { b.classList.add('bank-wrong'); markState(b, 'wrong'); }
        });

        el('feedback').innerHTML =
          '<div class="expl">' +
            '<div class="verdict ' + (r.correct ? 'ok' : 'no') + '">' +
              (r.correct ? 'Correct' : 'Not quite') +
              (r.coinsAwarded ? '<span class="coin">+' + r.coinsAwarded + ' coin</span>' : '') +
            '</div>' +
            (r.explanation ? '<b>Why</b>' + esc(r.explanation) : '') +
          '</div>';

        el('nextBtn').hidden = i >= Q.length - 1;
        el('moreBtn').hidden = i < Q.length - 1;
        updateTally();
      }).catch(function () {
        Array.prototype.forEach.call(buttons, function (b) { b.disabled = false; });
        el('feedback').innerHTML = '<div class="expl">Could not check that answer. Try again.</div>';
      });
    }

    function updateTally() {
      el('tally').textContent = answered ? right + ' right of ' + answered + ' answered' : '';
    }

    el('nextBtn').addEventListener('click', function () {
      if (i < Q.length - 1) { i += 1; paint(); }
    });
    // A fresh sample rather than the same ten again — the API samples, so
    // asking again deals a different set.
    el('moreBtn').addEventListener('click', function () { load(); });

    load();
  })();
  
}
