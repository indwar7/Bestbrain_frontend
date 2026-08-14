/* Lifted verbatim from edulearn-frontend/create-test.html — do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {
/* light-only product: strip any stale dark preference before paint */try{if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.remove('dark-mode');}localStorage.setItem('edulearn-theme','light');}catch(e){}

/* ---- next <script> block ---- */


    var user = EduAPI.getUser();
    if (!user || user.role !== 'teacher') {
      document.getElementById('form').style.display = 'none';
      document.getElementById('gate').style.display = 'block';
    }

    /* QA T-09: every question was forced to exactly 5 options, all marked
       `required` — a teacher could not submit a standard 4-option MCQ, let
       alone a true/false question, even though the backend already accepts
       2–6 (Question.ts) and the student-facing quiz renders however many a
       question actually has. Four is the default now (the common case), and
       each question gets its own +/− control down to 2 and up to 6 instead
       of a number nothing here enforced consistently. */
    var MIN_OPTIONS = 2, MAX_OPTIONS = 6, DEFAULT_OPTIONS = 4;
    var qCounter = 0;
    var host = document.getElementById('questionsHost');

    function esc(s){
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // Keeps each row's radio value / letter / placeholder in step with its
    // actual position after an option is added or removed — the submit
    // handler reads correctIndex straight off the checked radio's value, so
    // a stale value there would grade the wrong option as correct.
    function renumberOptions(card){
      var rows = card.querySelectorAll('.opt-row');
      var anyChecked = false;
      rows.forEach(function(row, i){
        var letter = String.fromCharCode(65 + i);
        var radio = row.querySelector('input[type=radio]');
        var input = row.querySelector('.opt-input');
        radio.value = String(i);
        if (radio.checked) anyChecked = true;
        row.querySelector('.opt-letter').textContent = letter;
        input.placeholder = 'Option ' + letter;
        row.querySelector('.opt-remove').style.visibility = rows.length > MIN_OPTIONS ? 'visible' : 'hidden';
      });
      if (!anyChecked && rows.length) rows[0].querySelector('input[type=radio]').checked = true;
      var addBtn = card.querySelector('.opt-add');
      if (addBtn) addBtn.style.display = rows.length >= MAX_OPTIONS ? 'none' : '';
    }

    function addOption(card){
      var idx = card.getAttribute('data-q');
      var i = card.querySelectorAll('.opt-row').length;
      if (i >= MAX_OPTIONS) return;
      var letter = String.fromCharCode(65 + i);
      var row = document.createElement('div');
      row.className = 'opt-row';
      row.innerHTML =
        '<label class="opt-pick" title="Mark this option as the correct answer">' +
          '<input type="radio" name="correct-' + idx + '" value="' + i + '">' +
          '<span class="opt-letter">' + letter + '</span>' +
        '</label>' +
        '<input type="text" class="opt-input" placeholder="Option ' + letter + '" required>' +
        '<button type="button" class="opt-remove" title="Remove this option" ' +
          'style="background:none;border:0;cursor:pointer;color:var(--muted);font-size:16px;line-height:1;">&times;</button>';
      card.insertBefore(row, card.lastElementChild);   // keep the "+ Add option" row last
      row.querySelector('.opt-remove').addEventListener('click', function(){
        if (card.querySelectorAll('.opt-row').length > MIN_OPTIONS){ row.remove(); renumberOptions(card); }
      });
      renumberOptions(card);
    }

    function addQuestion(){
      qCounter++;
      var idx = qCounter;
      var div = document.createElement('div');
      div.className = 'qcard';
      div.setAttribute('data-q', idx);
      var optsHtml = '';
      for (var i = 0; i < DEFAULT_OPTIONS; i++){
        var letter = String.fromCharCode(65 + i);
        optsHtml +=
          '<div class="opt-row">' +
            '<label class="opt-pick" title="Mark this option as the correct answer">' +
              '<input type="radio" name="correct-' + idx + '" value="' + i + '"' + (i === 0 ? ' checked' : '') + '>' +
              '<span class="opt-letter">' + letter + '</span>' +
            '</label>' +
            '<input type="text" class="opt-input" placeholder="Option ' + letter + '" required>' +
            '<button type="button" class="opt-remove" title="Remove this option" ' +
              'style="background:none;border:0;cursor:pointer;color:var(--muted);font-size:16px;line-height:1;visibility:hidden;">&times;</button>' +
          '</div>';
      }
      optsHtml += '<button type="button" class="btn-ghost opt-add" style="margin-top:6px;font-size:13px;padding:6px 12px;">+ Add option</button>';
      div.innerHTML =
        '<button type="button" class="remove" title="Remove question">&times;</button>' +
        '<div class="qnum">Question ' + idx + '</div>' +
        '<textarea class="q-text" placeholder="Type the question..." required></textarea>' +
        optsHtml;
      host.appendChild(div);
      div.querySelector('.remove').addEventListener('click', function(){
        // Always keep at least one question card.
        if (host.children.length > 1) div.remove();
      });
      Array.prototype.forEach.call(div.querySelectorAll('.opt-remove'), function(btn){
        btn.addEventListener('click', function(){
          if (div.querySelectorAll('.opt-row').length > MIN_OPTIONS){ btn.closest('.opt-row').remove(); renumberOptions(div); }
        });
      });
      div.querySelector('.opt-add').addEventListener('click', function(){ addOption(div); });
    }

    document.getElementById('addQBtn').addEventListener('click', addQuestion);
    addQuestion(); // start with one question row

    // Populate Class & subject from the teacher's own assignments — reuses
    // the exact className/subject strings already on their account, so the
    // created questions match a real student's own className exactly (no
    // "Class 7" vs "7" mismatch risk).
    var teaches = user && user.teaches || [];
    var classSel = document.getElementById('classSubject');
    if (teaches.length){
      classSel.innerHTML = teaches.map(function(t, i){
        return '<option value="' + i + '">' + esc(t.subject) + ' · ' + esc(t.className) + ' ' + esc(t.section) + '</option>';
      }).join('');
    } else {
      classSel.innerHTML = '<option value="">No classes assigned to your account</option>';
      classSel.disabled = true;
    }

    function slugify(s){
      return String(s).toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'test';
    }

    function msg(text, ok){
      var el = document.getElementById('formMsg');
      el.textContent = text;
      el.className = 'msg ' + (ok ? 'ok' : 'err');
    }

    document.getElementById('form').addEventListener('submit', async function(e){
      e.preventDefault();
      var title = document.getElementById('title').value.trim();
      var seconds = parseInt(document.getElementById('seconds').value, 10);
      var numQuestions = parseInt(document.getElementById('numQuestions').value, 10);
      var assign = teaches[parseInt(classSel.value, 10)];

      if (!assign){ msg('Pick a class & subject first.', false); return; }

      var qcards = Array.prototype.slice.call(host.querySelectorAll('.qcard'));
      if (qcards.length !== numQuestions){
        msg('You said ' + numQuestions + ' question(s) but wrote ' + qcards.length + ' — add or remove rows to match, or update the number above.', false);
        return;
      }

      var questions = [];
      for (var i = 0; i < qcards.length; i++){
        var card = qcards[i];
        var text = card.querySelector('.q-text').value.trim();
        var opts = Array.prototype.slice.call(card.querySelectorAll('.opt-input')).map(function(inp){ return inp.value.trim(); });
        var checked = card.querySelector('input[type="radio"]:checked');
        if (!text || opts.some(function(o){ return !o; }) || !checked){
          msg('Question ' + (i + 1) + ' is missing text, an option, or a marked correct answer.', false);
          return;
        }
        questions.push({ text: text, options: opts, correctIndex: parseInt(checked.value, 10) });
      }

      var submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating…';
      msg('Creating ' + questions.length + ' question(s)…', true);

      // A fresh, unique slug per test — so this test's questions form their
      // own isolated pool and a student's attempt only ever draws from
      // exactly this set, never mixed with other tests on the same chapter.
      var chapterSlug = slugify(title) + '-' + Date.now().toString(36);

      try {
        for (var j = 0; j < questions.length; j++){
          await EduAPI.createQuestion({
            className: assign.className,
            subject: assign.subject,
            chapterSlug: chapterSlug,
            text: questions[j].text,
            options: questions[j].options,
            correctIndex: questions[j].correctIndex,
            usage: 'mock'
          });
        }

        var params = new URLSearchParams({
          subject: assign.subject,
          chapter: chapterSlug,
          count: String(questions.length),
          time: String(seconds),
          title: title
        });
        var link = location.href.split('#')[0].split('?')[0].replace(/create-test\.html$/, 'take-test.html') + '?' + params.toString();

        document.getElementById('testLink').textContent = link;
        document.getElementById('openLinkBtn').setAttribute('href', link);
        document.getElementById('form').style.display = 'none';
        document.getElementById('resultCard').style.display = 'block';
      } catch (err) {
        msg(err.message || 'Could not create the test — please try again.', false);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create test';
      }
    });

    document.getElementById('copyLinkBtn').addEventListener('click', function(){
      var link = document.getElementById('testLink').textContent;
      var btn = this;
      (navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(link)
        : Promise.reject()
      ).then(function(){
        btn.textContent = 'Copied!';
        setTimeout(function(){ btn.textContent = 'Copy'; }, 1500);
      }).catch(function(){
        window.prompt('Copy this link:', link);
      });
    });

    document.getElementById('createAnotherBtn').addEventListener('click', function(){
      location.reload();
    });
  
}
