/* Lifted verbatim from edulearn-frontend/take-test.html — do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {
/* light-only product: strip any stale dark preference before paint */try{if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.remove('dark-mode');}localStorage.setItem('edulearn-theme','light');}catch(e){}

/* ---- next <script> block ---- */


    var user = EduAPI.requireAuth('student'); // redirects if not logged in / wrong role
    var host = document.getElementById('host');

    function esc(s){
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
    function center(html){
      host.innerHTML = '<div class="center">' + html + '</div>';
    }

    if (user) {
      var params = new URLSearchParams(location.search);
      var subject = params.get('subject');
      var chapter = params.get('chapter');
      var count = parseInt(params.get('count'), 10) || 10;
      var secondsPerQ = Math.max(5, parseInt(params.get('time'), 10) || 30);
      var testTitle = params.get('title') || 'Test';

      if (!subject) {
        center('This test link is missing information. Ask your teacher to re-share it.');
      } else {
        runTest();
      }
    }

    var STATE = null; // { attemptId, total, questions, i, answers, timer, remaining }

    async function runTest(){
      center('Loading your test…');
      var res;
      try {
        res = await EduAPI.startMockTest(subject, chapter, count);
      } catch (err) {
        center(esc(err.message || 'Could not load this test.') + '<br><br><a href="dashboard.html">Back to dashboard</a>');
        return;
      }
      if (!res.questions || !res.questions.length) {
        center('No questions available for this test right now.<br><br><a href="dashboard.html">Back to dashboard</a>');
        return;
      }
      STATE = {
        attemptId: res.attemptId,
        total: res.questions.length,
        questions: res.questions,
        i: 0,
        answers: new Array(res.questions.length).fill(-1),
        picked: null,    // highlighted but not yet submitted
        answered: false, // this question has been graded and its solution shown
        timerId: null,
        remaining: secondsPerQ
      };
      renderQuestion();
    }

    function renderQuestion(){
      var q = STATE.questions[STATE.i];
      var pct = (STATE.i / STATE.total) * 100;
      var optsHtml = q.options.map(function(o, i){
        return '<button class="opt" type="button" data-i="' + i + '" role="radio" aria-checked="false">' +
          '<span class="ltr">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o) + '</span></button>';
      }).join('');

      host.innerHTML =
        '<div class="qhead">' +
          '<span class="mono">' + esc(testTitle) + ' &middot; Question ' + (STATE.i + 1) + ' of ' + STATE.total + '</span>' +
          '<span class="timer" id="timerNum">' + secondsPerQ + 's</span>' +
        '</div>' +
        '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="qtext">' + esc(q.text) + '</div>' +
        '<div id="optGrid" role="radiogroup" aria-label="Answer options">' + optsHtml + '</div>' +
        // role=status so the verdict and worked solution are read out on reveal
        '<div id="solutionSlot" role="status"></div>' +
        '<div class="qactions">' +
          '<button class="btn" type="button" id="submitBtn" disabled>Submit answer</button>' +
          '<button class="btn" type="button" id="nextBtn" hidden>' +
            (STATE.i + 1 < STATE.total ? 'Next question' : 'See my results') + '</button>' +
          '<span class="hint" id="qHint">Pick an option, then submit.</span>' +
        '</div>' +
        '<div class="locked-note" id="lockedNote"></div>';

      // Selecting an option only highlights it — nothing is graded until Submit.
      document.querySelectorAll('#optGrid .opt').forEach(function(btn){
        btn.addEventListener('click', function(){
          if (STATE.answered) return;
          STATE.picked = parseInt(btn.getAttribute('data-i'), 10);
          document.querySelectorAll('#optGrid .opt').forEach(function(b){
            b.classList.toggle('is-picked', b === btn);
            b.setAttribute('aria-checked', String(b === btn)); // announce the selection
          });
          document.getElementById('submitBtn').disabled = false;
          document.getElementById('qHint').textContent = 'Submit when you are ready.';
        });
      });

      // keyboard users land on the question's first option, not back at the nav
      var firstOpt = document.querySelector('#optGrid .opt');
      if (firstOpt) firstOpt.focus();

      document.getElementById('submitBtn').addEventListener('click', function(){
        if (STATE.picked !== null && STATE.picked !== undefined) lockAnswer(STATE.picked, false);
      });
      document.getElementById('nextBtn').addEventListener('click', advance);

      STATE.picked = null;
      STATE.answered = false;
      STATE.remaining = secondsPerQ;
      updateTimerDisplay();
      clearInterval(STATE.timerId);
      STATE.timerId = setInterval(function(){
        STATE.remaining--;
        updateTimerDisplay();
        if (STATE.remaining <= 0){
          // out of time: submit whatever is selected (-1 if nothing was picked)
          lockAnswer(STATE.picked === null || STATE.picked === undefined ? -1 : STATE.picked, true);
        }
      }, 1000);
    }

    function updateTimerDisplay(){
      var el = document.getElementById('timerNum');
      if (!el) return;
      el.textContent = Math.max(0, STATE.remaining) + 's';
      el.classList.toggle('low', STATE.remaining <= 5);
    }

    async function lockAnswer(chosenIdx, timedOut){
      if (STATE.answered) return; // ignore a click that lands as the timer also fires
      STATE.answered = true;
      clearInterval(STATE.timerId); // stop the clock — reading time isn't timed
      STATE.answers[STATE.i] = chosenIdx;

      var buttons = document.querySelectorAll('#optGrid .opt');
      buttons.forEach(function(b){ b.disabled = true; });

      var submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Checking…';

      // The server holds the correct answer and the explanation — it only hands
      // them over once this question has been committed to.
      var res = null;
      try {
        res = await EduAPI.answerMockQuestion(STATE.attemptId, STATE.i, chosenIdx);
      } catch (err) {
        // Offline or server hiccup: don't strand the student mid-test. Their
        // answer is still in STATE.answers and gets graded at final submit.
        submitBtn.hidden = true;
        document.getElementById('qHint').textContent = '';
        var slot = document.getElementById('solutionSlot');
        slot.innerHTML = '<div class="solution"><span class="lbl">Solution</span>' +
          '<div class="body">Could not load the solution just now — your answer is saved ' +
          'and you will see the full explanation on the results page.</div></div>';
        showNext(timedOut);
        return;
      }

      buttons.forEach(function(b){
        b.classList.remove('is-picked');
        var i = parseInt(b.getAttribute('data-i'), 10);
        if (i === res.correctIndex) b.classList.add('is-right');
        else if (i === chosenIdx) b.classList.add('is-wrong');
      });

      var q = STATE.questions[STATE.i];
      var rightLtr = String.fromCharCode(65 + res.correctIndex);
      var rightTxt = '<b>' + rightLtr + '. ' + esc(q.options[res.correctIndex] || '') + '</b>';
      var verdict = res.correct
        ? '<span style="color:var(--teal)">Correct — the answer is ' + rightTxt + '</span>'
        : '<span style="color:var(--rose)">' +
            (chosenIdx < 0
              ? 'Time’s up — the answer is '
              : 'Not quite. You chose ' + String.fromCharCode(65 + chosenIdx) + ' — the answer is ') +
            rightTxt + '</span>';

      document.getElementById('solutionSlot').innerHTML =
        '<div class="solution">' +
          '<span class="lbl">Solution</span>' +
          '<div class="verdict">' + verdict + '</div>' +
          (res.explanation
            ? '<div class="body">' + esc(res.explanation) + '</div>'
            : '<div class="body" style="color:var(--muted)">No written solution has been added for this question yet.</div>') +
        '</div>';

      submitBtn.hidden = true;
      document.getElementById('qHint').textContent = 'Read the solution, then continue.';
      showNext(timedOut);
    }

    // Reveal the Next button — the student advances when they're done reading.
    function showNext(timedOut){
      var nextBtn = document.getElementById('nextBtn');
      nextBtn.hidden = false;
      nextBtn.focus(); // move focus with the control that replaced Submit
      var note = document.getElementById('lockedNote');
      if (note) note.textContent = timedOut ? "Time's up — this one was auto-submitted." : '';
    }

    function advance(){
      if (!STATE.answered) return; // never skip past an ungraded question
      STATE.i++;
      if (STATE.i < STATE.total) renderQuestion();
      else finishTest();
    }

    async function finishTest(){
      clearInterval(STATE.timerId); // point of no return — stop the clock for good
      center('Grading your test…');
      var res;
      try {
        res = await EduAPI.submitMockTest(STATE.attemptId, STATE.answers);
      } catch (err) {
        center(esc(err.message || 'Could not submit your test.') + '<br><br><a href="dashboard.html">Back to dashboard</a>');
        return;
      }
      renderResults(res);
    }

    function renderResults(res){
      var pct = res.total ? Math.round((res.score / res.total) * 100) : 0;
      var reviewHtml = (res.review || []).map(function(r, i){
        var q = STATE.questions[i];
        var yourAns = r.chosen >= 0 && q.options[r.chosen] ? q.options[r.chosen] : 'No answer';
        var rightAns = q.options[r.correctIndex] || '—';
        return '<div class="review-row">' +
          '<div class="qt">' + (i + 1) + '. ' + esc(q.text) + '</div>' +
          '<div class="ans ' + (r.correct ? 'correct' : 'wrong') + '">' +
            (r.correct
              ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px"><path d="M20 6 9 17l-5-5"/></svg> Correct — ' + esc(yourAns)
              : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> Your answer: ' + esc(yourAns) + ' &middot; Correct: ' + esc(rightAns)) +
          '</div>' +
          // repeat the worked solution here so the whole paper can be revised at once
          (r.explanation ? '<div class="ans" style="margin-top:6px">' + esc(r.explanation) + '</div>' : '') +
          '</div>';
      }).join('');

      host.innerHTML =
        '<div class="score-num">' + res.score + ' / ' + res.total + '</div>' +
        '<div class="score-sub">' + pct + '% correct &middot; ' + esc(testTitle) + '</div>' +
        '<div style="margin-top:26px">' + reviewHtml + '</div>' +
        '<div style="text-align:center;margin-top:26px"><a class="btn" href="dashboard.html">Back to dashboard</a></div>';
    }
  
}
