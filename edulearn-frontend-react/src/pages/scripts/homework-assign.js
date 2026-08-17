/* Lifted verbatim from edulearn-frontend/homework-assign.html — do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {
/* light-only product: strip any stale dark preference before paint */try{if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.remove('dark-mode');}localStorage.setItem('edulearn-theme','light');}catch(e){}

/* ---- next <script> block ---- */


  /* ============================================================
     ASSIGN HOMEWORK — teacher
     ------------------------------------------------------------
     A separate page rather than a mode inside create-test.html, because the
     two do opposite things: create-test AUTHORS new questions, this one picks
     questions that already exist. Folding them together would have meant one
     form where half the fields are inert depending on a toggle.

     The chapter list comes from the shared curriculum.js, which is the same
     source Learn reads — so the slugs a teacher assigns against are exactly
     the slugs the student's chapter row links to. Typing them by hand here
     would be a second list to keep in step.
     ============================================================ */
  (function () {
    'use strict';
    var el = function (id) { return document.getElementById(id); };
    var selected = {};   // questionId -> true

    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ---- gate: teachers only ----
    var user = window.EduAPI && EduAPI.getUser ? EduAPI.getUser() : null;
    if (!user || user.role !== 'teacher') {
      el('gate').hidden = false;
      el('main').hidden = true;
      return;
    }

    // ---- chapter dropdown, from the shared curriculum ----
    function subjectKeyOf(name) {
      return { 'Maths': 'maths', 'Science': 'science', 'Social Science': 'social',
               'English': 'english', 'Hindi': 'hindi' }[name] || 'science';
    }
    function fillChapters() {
      var sel = el('fChapter');
      sel.innerHTML = '<option value="">All chapters</option>';
      var C = window.CURRICULUM;
      if (!C) return;   // curriculum.js absent — "All chapters" still works
      var cls = C[el('fClass').value];
      var subj = cls && cls[subjectKeyOf(el('fSubject').value)];
      var chapters = (subj && subj.chapters) || [];
      chapters.forEach(function (ch) {
        var slug = Array.isArray(ch) ? ch[0] : ch.slug;
        var name = Array.isArray(ch) ? ch[1] : ch.name;
        var o = document.createElement('option');
        o.value = slug; o.textContent = name;
        sel.appendChild(o);
      });
    }
    el('fClass').addEventListener('change', fillChapters);
    el('fSubject').addEventListener('change', fillChapters);
    fillChapters();

    // ---- load questions for the chapter ----
    el('loadQs').addEventListener('click', function () {
      var btn = this;
      btn.disabled = true;
      EduAPI.listQuestions(el('fClass').value, el('fSubject').value, el('fChapter').value || undefined)
        .then(function (res) {
          var qs = res.questions || [];
          selected = {};
          el('pickCard').hidden = false;
          el('detailCard').hidden = qs.length === 0;
          if (!qs.length) {
            el('qlist').innerHTML = '<p class="muted">No questions in the bank for that chapter yet. ' +
              'Add some in <a href="create-test.html">Create a test</a>, or run the Class 6 Science seed.</p>';
            updateCount();
            return;
          }
          el('qlist').innerHTML = qs.map(function (q) {
            var id = q._id || q.id;
            return '<label class="qpick" data-id="' + esc(id) + '">' +
              '<input type="checkbox" value="' + esc(id) + '">' +
              '<span class="qpick__t">' + esc(q.text) +
                '<br><span class="qpick__d">' + esc(q.difficulty || 'medium') +
                (q.chapterSlug ? ' · ' + esc(q.chapterSlug) : '') + '</span></span>' +
            '</label>';
          }).join('');
          Array.prototype.forEach.call(el('qlist').querySelectorAll('input[type=checkbox]'), function (cb) {
            cb.addEventListener('change', function () {
              if (cb.checked) selected[cb.value] = true; else delete selected[cb.value];
              cb.closest('.qpick').classList.toggle('is-on', cb.checked);
              updateCount();
            });
          });
          updateCount();
        })
        .catch(function (e) {
          el('pickCard').hidden = false;
          el('qlist').innerHTML = '<p class="muted">' + esc(e && e.message ? e.message : 'Could not load questions.') + '</p>';
        })
        .finally(function () { btn.disabled = false; });
    });

    function updateCount() {
      var n = Object.keys(selected).length;
      el('pickCount').textContent = n === 0 ? 'Nothing selected yet.'
        : n + ' question' + (n === 1 ? '' : 's') + ' selected.';
    }

    // ---- assign ----
    el('assignBtn').addEventListener('click', function () {
      var ids = Object.keys(selected);
      var msg = el('msg');
      msg.className = 'msg';
      if (!ids.length) { msg.className = 'msg err'; msg.textContent = 'Pick at least one question.'; return; }
      if (!el('fTitle').value.trim()) { msg.className = 'msg err'; msg.textContent = 'Give the homework a title.'; return; }
      if (!el('fDue').value) { msg.className = 'msg err'; msg.textContent = 'Set a due date.'; return; }

      var btn = this;
      btn.disabled = true;
      EduAPI.createHomework({
        className: el('fClass').value,
        subject: el('fSubject').value,
        chapterSlug: el('fChapter').value || '',
        title: el('fTitle').value.trim(),
        instructions: el('fInstructions').value.trim(),
        questionIds: ids,
        // The date input gives a local midnight; homework is due at the END of
        // that day, which is what a student reading "due 12 March" expects.
        dueAt: new Date(el('fDue').value + 'T23:59:59').toISOString(),
        isPublished: el('fPublished').value === 'yes'
      }).then(function () {
        msg.className = 'msg ok';
        msg.textContent = 'Assigned. Students in that class will see it on Learn.';
        selected = {};
        el('fTitle').value = ''; el('fInstructions').value = '';
        Array.prototype.forEach.call(el('qlist').querySelectorAll('input[type=checkbox]'), function (cb) {
          cb.checked = false; cb.closest('.qpick').classList.remove('is-on');
        });
        updateCount();
        loadMine();
      }).catch(function (e) {
        msg.className = 'msg err';
        msg.textContent = e && e.message ? e.message : 'Could not assign that.';
      }).finally(function () { btn.disabled = false; });
    });

    // ---- your assignments, with the roster ----
    function loadMine() {
      EduAPI.listHomework().then(function (res) {
        var rows = res.homework || [];
        if (!rows.length) { el('mine').innerHTML = '<p class="muted">You have not assigned any homework yet.</p>'; return; }
        el('mine').innerHTML = rows.map(function (h) {
          return '<div class="hwrow">' +
            '<div class="hwrow__b">' +
              '<div class="hwrow__t">' + esc(h.title) + '</div>' +
              '<div class="hwrow__m">' + esc(h.className) + ' · ' + esc(h.subject) +
                (h.chapterSlug ? ' · ' + esc(h.chapterSlug) : '') +
                ' · ' + h.questionCount + ' Qs · due ' +
                new Date(h.dueAt).toLocaleDateString() +
                ' · ' + h.submissionCount + ' submitted</div>' +
            '</div>' +
            '<span class="tag ' + (h.isPublished ? 'on' : 'off') + '">' +
              (h.isPublished ? 'Assigned' : 'Draft') + '</span>' +
            '<button class="btn-ghost" data-roster="' + esc(h.id) + '" type="button">Roster</button>' +
            '<button class="btn-ghost" data-toggle="' + esc(h.id) + '" data-to="' + (h.isPublished ? 'no' : 'yes') + '" type="button">' +
              (h.isPublished ? 'Unpublish' : 'Publish') + '</button>' +
          '</div><div id="roster-' + esc(h.id) + '"></div>';
        }).join('');

        Array.prototype.forEach.call(el('mine').querySelectorAll('[data-roster]'), function (b) {
          b.addEventListener('click', function () {
            var id = b.getAttribute('data-roster');
            var box = el('roster-' + id);
            if (box.innerHTML) { box.innerHTML = ''; return; }   // toggle closed
            EduAPI.getHomeworkSubmissions(id).then(function (r) {
              box.innerHTML = (r.submissions || []).length
                ? '<div class="muted" style="padding:0 0 12px">' +
                    r.submissions.map(function (s) {
                      return esc(s.studentName || s.rollNumber || 'Student') + ' — ' + s.score + '/' + s.total +
                        (s.status === 'late' ? ' (late)' : '');
                    }).join('<br>') + '</div>'
                : '<p class="muted" style="padding:0 0 12px">Nobody has handed this in yet.</p>';
            });
          });
        });

        Array.prototype.forEach.call(el('mine').querySelectorAll('[data-toggle]'), function (b) {
          b.addEventListener('click', function () {
            EduAPI.updateHomework(b.getAttribute('data-toggle'), {
              isPublished: b.getAttribute('data-to') === 'yes'
            }).then(loadMine);
          });
        });
      }).catch(function () {
        el('mine').innerHTML = '<p class="muted">Could not load your assignments.</p>';
      });
    }
    loadMine();
  })();
  
}
