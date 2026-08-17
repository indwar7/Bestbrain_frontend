/* Lifted verbatim from edulearn-frontend/homework.html — do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {
/* light-only product: strip any stale dark preference before paint */try{if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.remove('dark-mode');}localStorage.setItem('edulearn-theme','light');}catch(e){}

/* ---- next <script> block ---- */


  /* ============================================================
     HOMEWORK — student view
     ------------------------------------------------------------
     Three views in one page: the list of what has been set, the attempt, and
     the marked result. They are separate <section>s toggled with [hidden]
     rather than separate pages, because the attempt has unsaved answers in
     memory — navigating away to mark it would mean posting them somewhere
     first, and there is nothing to post to until the student submits.

     Answers are held client-side and sent once. The server grades: nothing
     here knows a correctIndex until the submit response comes back, which is
     the same contract take-test.html works to.
     ============================================================ */
  (function () {
    'use strict';

    var params = new URLSearchParams(location.search);
    var chapterSlug = params.get('ch') || '';
    var subjectKey = params.get('subject') || '';
    var SUBJECT_NAME = { maths: 'Maths', science: 'Science', social: 'Social Science', english: 'English', hindi: 'Hindi' };
    var subject = SUBJECT_NAME[subjectKey] || '';

    var el = function (id) { return document.getElementById(id); };
    var listView = el('listView'), attemptView = el('attemptView'), resultView = el('resultView');

    function show(view) {
      listView.hidden = view !== 'list';
      attemptView.hidden = view !== 'attempt';
      resultView.hidden = view !== 'result';
    }

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

    // "in 3 days" reads better than a date for work that is due soon, and a
    // date reads better than "in 41 days" for work that is not.
    function dueLabel(iso) {
      var due = new Date(iso), now = new Date();
      var days = Math.round((due - now) / 86400000);
      if (days < 0) return 'was due ' + Math.abs(days) + (Math.abs(days) === 1 ? ' day' : ' days') + ' ago';
      if (days === 0) return 'due today';
      if (days === 1) return 'due tomorrow';
      if (days <= 14) return 'due in ' + days + ' days';
      return 'due ' + due.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    }

    function pillFor(h) {
      if (h.status === 'submitted') return '<span class="pill done">Submitted · ' + h.score + '/' + h.total + '</span>';
      if (h.status === 'late') return '<span class="pill late">Submitted late · ' + h.score + '/' + h.total + '</span>';
      if (h.overdue) return '<span class="pill overdue">Overdue · ' + esc(dueLabel(h.dueAt)) + '</span>';
      return '<span class="pill due">' + esc(dueLabel(h.dueAt)) + '</span>';
    }

    // ---------------- list ----------------
    function renderList(rows) {
      var list = el('list');
      el('empty').hidden = rows.length > 0;
      list.innerHTML = rows.map(function (h) {
        var done = h.status === 'submitted' || h.status === 'late';
        return '<div class="card hw">' +
          '<div class="hw__body">' +
            '<h2 class="hw__title">' + esc(h.title) + '</h2>' +
            '<p class="hw__meta">' + esc(h.subject) + (h.chapterSlug ? ' · ' + esc(h.chapterSlug.replace(/-/g, ' ')) : '') +
              ' · ' + h.questionCount + ' question' + (h.questionCount === 1 ? '' : 's') + '</p>' +
            (h.instructions ? '<p class="hw__instructions">' + esc(h.instructions) + '</p>' : '') +
            pillFor(h) +
          '</div>' +
          '<button class="' + (done ? 'btn-ghost' : 'btn') + '" data-open="' + esc(h.id) + '"' +
            (done ? ' disabled' : '') + ' type="button">' +
            (done ? 'Handed in' : 'Start') + '</button>' +
        '</div>';
      }).join('');

      Array.prototype.forEach.call(list.querySelectorAll('[data-open]'), function (b) {
        b.addEventListener('click', function () { openHomework(b.getAttribute('data-open')); });
      });
    }

    // ---------------- attempt ----------------
    var A = null; // { id, questions[], answers{}, i }

    function openHomework(id) {
      EduAPI.getHomework(id).then(function (res) {
        A = { id: id, questions: res.questions || [], answers: {}, i: 0, title: res.homework.title };
        if (!A.questions.length) { alert('This homework has no questions yet.'); return; }
        show('attempt');
        paintQuestion();
      }).catch(function (e) {
        alert(e && e.message ? e.message : 'Could not open that homework.');
      });
    }

    function paintQuestion() {
      var q = A.questions[A.i];
      el('qnum').textContent = 'Question ' + (A.i + 1) + ' of ' + A.questions.length;
      el('qtext').textContent = q.text;
      var picked = A.answers[q.id];
      el('opts').innerHTML = q.options.map(function (o, i) {
        return '<button class="opt' + (picked === i ? ' is-picked' : '') + '" data-i="' + i + '" type="button">' +
          '<span class="opt__k">' + String.fromCharCode(65 + i) + '</span>' +
          '<span>' + esc(o) + '</span></button>';
      }).join('');
      Array.prototype.forEach.call(el('opts').querySelectorAll('.opt'), function (b) {
        b.addEventListener('click', function () {
          A.answers[q.id] = Number(b.getAttribute('data-i'));
          paintQuestion();
          updateProgress();
        });
      });
      el('prevBtn').disabled = A.i === 0;
      el('nextBtn').disabled = A.i >= A.questions.length - 1;
      updateProgress();
    }

    function updateProgress() {
      var answered = Object.keys(A.answers).length;
      el('prog').textContent = answered + ' of ' + A.questions.length + ' answered';
      // Submitting with blanks is allowed — they are marked wrong, exactly as
      // the server grades them — so the button is never disabled. Making the
      // student answer everything to hand in would be a different rule than
      // the one the API enforces.
    }

    // A is null until a homework is opened, and these buttons exist in the DOM
    // from the start — hidden with the attempt view, but still clickable by a
    // script, and still focusable. Without the guard they throw on A.i.
    el('prevBtn').addEventListener('click', function () { if (A && A.i > 0) { A.i--; paintQuestion(); } });
    el('nextBtn').addEventListener('click', function () { if (A && A.i < A.questions.length - 1) { A.i++; paintQuestion(); } });

    el('submitBtn').addEventListener('click', function () {
      if (!A) return;
      var answered = Object.keys(A.answers).length;
      if (answered < A.questions.length &&
          !confirm((A.questions.length - answered) + ' question(s) are unanswered. Submit anyway?')) return;

      var answers = A.questions.map(function (q) {
        return { questionId: q.id, selectedIndex: A.answers[q.id] === undefined ? -1 : A.answers[q.id] };
      });
      el('submitBtn').disabled = true;
      EduAPI.submitHomework(A.id, answers).then(function (res) {
        renderResult(res);
      }).catch(function (e) {
        el('attemptMsg').innerHTML = '<div class="msg err">' +
          esc(e && e.message ? e.message : 'Could not submit.') + '</div>';
      }).finally(function () { el('submitBtn').disabled = false; });
    });

    // ---------------- result ----------------
    function renderResult(res) {
      var s = res.submission;
      el('score').innerHTML = s.score + ' <small>/ ' + s.total + '</small>';
      el('scoreNote').textContent = s.status === 'late'
        ? 'Handed in after the due date — it still counts, and your teacher can see it was late.'
        : 'Handed in on time.';

      el('review').innerHTML = (res.review || []).map(function (r, n) {
        return '<div class="card">' +
          '<div class="qnum">Question ' + (n + 1) + (r.isCorrect ? ' · correct' : ' · incorrect') + '</div>' +
          '<p class="qtext">' + esc(r.text) + '</p>' +
          '<div class="opts">' + r.options.map(function (o, i) {
            var cls = 'opt';
            if (i === r.correctIndex) cls += ' bank-right';
            else if (i === r.selectedIndex) cls += ' bank-wrong';
            return '<div class="' + cls + '">' +
              '<span class="opt__k">' + String.fromCharCode(65 + i) + '</span>' +
              '<span>' + esc(o) + '</span></div>';
          }).join('') + '</div>' +
          (r.explanation ? '<div class="expl"><b>Why</b>' + esc(r.explanation) + '</div>' : '') +
        '</div>';
      }).join('');

      // after innerHTML, so the nodes exist to be marked
      (res.review || []).forEach(function (r, n) {
        var card = el('review').children[n];
        if (!card) return;
        var opts = card.querySelectorAll('.opt');
        if (opts[r.correctIndex]) markState(opts[r.correctIndex], 'right');
        if (!r.isCorrect && r.selectedIndex >= 0 && opts[r.selectedIndex]) {
          markState(opts[r.selectedIndex], 'wrong');
        }
      });

      show('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    el('backBtn').addEventListener('click', function () { show('list'); load(); });

    // ---------------- boot ----------------
    function load() {
      if (!window.EduAPI || !EduAPI.getUser || !EduAPI.getUser()) {
        el('gate').hidden = false;
        listView.hidden = true;
        return;
      }
      if (chapterSlug) {
        el('sub').textContent = 'Homework for this chapter.';
      }
      EduAPI.getAssignedHomework(subject || undefined, chapterSlug || undefined)
        .then(function (res) { renderList(res.homework || []); })
        .catch(function () {
          el('list').innerHTML = '<div class="msg err">Could not load your homework. Check your connection and try again.</div>';
        });
    }

    load();
  })();
  
}
