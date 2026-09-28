/* Lifted verbatim from edulearn-frontend/challenge.html, do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {

(function(){
'use strict';

var LS_KEY = 'edulearn_arena';
var WINDOW_SEC = 45;

/* ---------- question bank: short, single-fact, curriculum-accurate ---------- */
var BANK = [
  { q:'What is the degree of the polynomial x³ + 2x² − 7?', opts:['1','2','3','7'], a:2, subj:'Maths' },
  { q:'7/8 written as a decimal is…', opts:['0.78','0.875','0.785','0.825'], a:1, subj:'Maths' },
  { q:'The SI unit of force is the…', opts:['joule','watt','newton','pascal'], a:2, subj:'Science' },
  { q:'(−6) + (+4) equals…', opts:['−2','2','−10','10'], a:0, subj:'Maths' },
  { q:'Which gas do plants take in for photosynthesis?', opts:['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'], a:2, subj:'Science' },
  { q:'Who led the Russian Revolution of 1917?', opts:['Stalin','Lenin','Trotsky','Kerensky'], a:1, subj:'Social' },
  { q:'The sum of angles of a triangle is…', opts:['90°','180°','270°','360°'], a:1, subj:'Maths' },
  { q:'The smallest unit of life is the…', opts:['tissue','organ','cell','atom'], a:2, subj:'Science' },
  { q:'The French Revolution began in the year…', opts:['1789','1798','1857','1776'], a:0, subj:'Social' },
  { q:'√81 equals…', opts:['7','8','9','11'], a:2, subj:'Maths' },
  { q:'Speed = distance ÷ …', opts:['mass','time','velocity','force'], a:1, subj:'Science' },
  { q:'Akbar belonged to which dynasty?', opts:['Maurya','Gupta','Mughal','Chola'], a:2, subj:'Social' },
  { q:'A polynomial with exactly two terms is called a…', opts:['monomial','binomial','trinomial','quadratic'], a:1, subj:'Maths' },
  { q:'Litmus turns red in…', opts:['acid','base','salt','water'], a:0, subj:'Science' },
  { q:'The Tropic of Cancer passes through…', opts:['Kerala','Sri Lanka','Madhya Pradesh','Punjab, only'], a:2, subj:'Social' },
  { q:'15% of 200 is…', opts:['15','20','30','35'], a:2, subj:'Maths' },
  { q:'The unit of electric current is the…', opts:['volt','ohm','ampere','coulomb'], a:2, subj:'Science' },
  { q:'The Indian Constitution came into force on…', opts:['15 Aug 1947','26 Jan 1950','26 Nov 1949','2 Oct 1948'], a:1, subj:'Social' },
  { q:'If 3x = 21, then x equals…', opts:['6','7','8','9'], a:1, subj:'Maths' },
  { q:'Sound cannot travel through…', opts:['water','steel','air','vacuum'], a:3, subj:'Science' },
  { q:'Earth takes about how long for one rotation?', opts:['12 hours','24 hours','365 days','30 days'], a:1, subj:'Social' },
  { q:'The value of x² − y² when x = 5, y = 3 is…', opts:['16','15','8','34'], a:0, subj:'Maths' },
  { q:'Newton&rsquo;s third law: every action has an equal and opposite…', opts:['force','mass','reaction','motion'], a:2, subj:'Science' },
  { q:'Democracy literally means rule by the…', opts:['king','army','people','court'], a:2, subj:'Social' },
  { q:'LCM of 4 and 6 is…', opts:['10','12','18','24'], a:1, subj:'Maths' },
  { q:'Acceleration is the rate of change of…', opts:['distance','speed','velocity','momentum'], a:2, subj:'Science' },
  { q:'Delhi Sultanate&rsquo;s first dynasty was the…', opts:['Khalji','Tughlaq','Mamluk (Slave)','Lodi'], a:2, subj:'Social' },
  { q:'A quadrilateral with all sides equal and all angles 90° is a…', opts:['rhombus','rectangle','square','kite'], a:2, subj:'Maths' },
  { q:'The boiling point of water at sea level is…', opts:['90°C','95°C','100°C','110°C'], a:2, subj:'Science' },
  { q:'Heron&rsquo;s formula computes a triangle&rsquo;s…', opts:['perimeter','area','height','angles'], a:1, subj:'Maths' }
];

/* ---------- state ---------- */
function loadLS(){
  try{
    var raw = localStorage.getItem(LS_KEY);
    var d = raw ? JSON.parse(raw) : null;
    if(!d || typeof d !== 'object') d = {};
    if(typeof d.points !== 'number') d.points = 0;
    if(typeof d.streak !== 'number') d.streak = 0;
    if(typeof d.bestStreak !== 'number') d.bestStreak = 0;
    if(!Array.isArray(d.history)) d.history = [];
    return d;
  }catch(e){ return { points:0, streak:0, bestStreak:0, history:[] }; }
}
function saveLS(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(store)); }catch(e){} }
var store = loadLS();

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function pad(n){ return (n<10?'0':'')+n; }

/* deterministic question per hour, same for every student */
function hourKey(d){
  return '' + d.getFullYear() + pad(d.getMonth()+1) + pad(d.getDate()) + pad(d.getHours());
}
function hashStr(s){
  var h = 0;
  for(var i = 0; i < s.length; i++){ h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
  return Math.abs(h);
}
function questionFor(key){ return BANK[hashStr(key) % BANK.length]; }
function hourLabel(d){
  var h = d.getHours(), am = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if(h === 0) h = 12;
  return h + ' ' + am;
}
function playedThisHour(){
  var key = hourKey(new Date());
  return store.history.some(function(r){ return r.key === key; });
}

/* ---------- play card states ---------- */
var playCard = document.getElementById('playCard');
var playTimer = null, countdownTimer = null;

// A logged-in student plays the REAL backend challenge (real question pool,
// real per-account scoring, real leaderboard) instead of the local BANK/
// localStorage demo engine below, which stays for logged-out visitors only.
var REAL_MODE = !!(window.EduAPI && EduAPI.getToken && EduAPI.getToken());
var realQuestion = null; // current backend question, once fetched

function renderReadyReal(question){
  realQuestion = question;
  playCard.innerHTML =
    '<div class="mono">This hour&rsquo;s drop</div>' +
    '<div class="play__hour">' + hourLabel(new Date()) + ' question</div>' +
    '<div class="play__sub">Same question for every student in your class right now · ' + esc(question.subject || '') + '</div>' +
    '<div class="blurbox"><p>The question stays hidden until you start. No previews, no head starts.</p></div>' +
    '<div class="startrow">' +
      '<button class="btn-primary" id="startBtn" type="button">Reveal &amp; start 45s</button>' +
      '<span class="startnote">The timer starts the moment you reveal.</span>' +
    '</div>';
  document.getElementById('startBtn').addEventListener('click', function(){ startPlayReal(question); });
}

function startPlayReal(question){
  var deadline = Date.now() + WINDOW_SEC * 1000;
  var startedAt = Date.now();
  var locked = false;
  var C = 2 * Math.PI * 30;

  var optsHtml = '';
  question.options.forEach(function(o, i){
    optsHtml += '<button class="opt" data-i="' + i + '" type="button"><span class="ltr">' +
      String.fromCharCode(65 + i) + '</span><span>' + esc(o) + '</span></button>';
  });

  playCard.innerHTML =
    '<div class="qhead">' +
      '<div class="timer">' +
        '<svg width="74" height="74" viewBox="0 0 74 74">' +
          '<circle cx="37" cy="37" r="30" fill="none" stroke="var(--line)" stroke-width="6"/>' +
          '<circle id="tArc" cx="37" cy="37" r="30" fill="none" stroke="var(--teal)" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="0"/>' +
        '</svg>' +
        '<span class="timer__num" id="tNum">' + WINDOW_SEC + '</span>' +
      '</div>' +
      '<div><div class="mono">' + esc(question.subject || '') + ' · ' + hourLabel(new Date()) + ' drop</div>' +
      '<div class="play__sub" style="margin-top:4px">Answer before the ring runs out.</div></div>' +
    '</div>' +
    '<div class="qtext">' + esc(question.text) + '</div>' +
    '<div class="opts" id="optGrid">' + optsHtml + '</div>';

  function finish(pickedIdx){
    if(locked) return;
    locked = true;
    cancelAnimationFrame(playTimer);
    var msTaken = Date.now() - startedAt;

    // pickedIdx === null means time ran out with no answer, still submit so
    // the one-attempt-per-hour lock is real, matching the local demo's "missed" case.
    EduAPI.answerChallenge(question.id, pickedIdx === null ? -1 : pickedIdx, msTaken)
      .then(function(res){
        var grid = document.getElementById('optGrid');
        grid.querySelectorAll('.opt').forEach(function(b){
          b.disabled = true;
          var i = parseInt(b.getAttribute('data-i'), 10);
          if(i === res.correctIndex) b.classList.add('is-right');
          else if(i === pickedIdx) b.classList.add('is-wrong');
        });
        setTimeout(function(){
          renderDoneReal(res, pickedIdx === null);
          refreshRealStats();
          renderLBReal();
        }, 1600);
      })
      .catch(function(err){
        playCard.innerHTML =
          '<div class="mono">Couldn&rsquo;t submit your answer</div>' +
          '<div class="play__sub" style="margin-top:10px">' + esc(err.message || 'Please refresh and try again.') + '</div>';
      });
  }

  document.getElementById('optGrid').querySelectorAll('.opt').forEach(function(b){
    b.addEventListener('click', function(){ finish(parseInt(b.getAttribute('data-i'), 10)); });
  });

  function frame(){
    var remaining = (deadline - Date.now()) / 1000;
    if(remaining <= 0){ finish(null); return; }
    var arc = document.getElementById('tArc');
    var num = document.getElementById('tNum');
    if(arc && num){
      num.textContent = Math.ceil(remaining);
      arc.setAttribute('stroke-dashoffset', (C * (1 - remaining / WINDOW_SEC)).toFixed(1));
      arc.setAttribute('stroke', remaining > 20 ? 'var(--teal)' : remaining > 10 ? 'var(--amber)' : 'var(--rose)');
    }
    playTimer = requestAnimationFrame(frame);
  }
  playTimer = requestAnimationFrame(frame);
}

function renderDoneReal(res, missed){
  var verdict, detail;
  if(missed){
    verdict = '<span style="color:var(--amber)">Time&rsquo;s up</span>';
    detail = 'The window closed. Next hour, reveal only when you&rsquo;re ready to sprint.';
  } else if(res.correct){
    verdict = '<span style="color:var(--teal)">Correct</span>';
    detail = 'Speed bonus banked. Come back next hour to keep the streak alive.';
  } else {
    verdict = '<span style="color:var(--rose)">Not this time</span>';
    detail = (res.explanation ? esc(res.explanation) + ' ' : '') + 'A new drop lands at the top of the hour.';
  }
  playCard.innerHTML =
    '<div class="mono">' + hourLabel(new Date()) + ' drop, played</div>' +
    '<div style="margin-top:16px" class="res__points">+' + (res.points || 0) + '</div>' +
    '<div class="res__verdict">' + verdict + '</div>' +
    '<div class="res__detail">' + detail + '</div>' +
    '<div class="nextdrop">' +
      '<div class="mono">Next drop in</div>' +
      '<b id="nextClock">--:--</b>' +
      '<div class="hourbar"><i id="hourFill" style="width:0%"></i></div>' +
    '</div>';
  tickCountdown();
  countdownTimer = setInterval(tickCountdown, 1000);
}

// Refetches the real per-account stats from the backend leaderboard's "you"
// field, the only per-user stat the backend currently exposes. Streak/best-
// streak/accuracy/hours-played aren't tracked server-side yet, so those rail
// stats stay honestly blank in real mode rather than showing a fabricated number.
function refreshRealStats(){
  EduAPI.getChallengeLeaderboard().then(function(res){
    setText('statPoints', res.you ? res.you.points : 0);
    setText('statStreak', '-');
    setText('statBest', '-');
    setText('statAcc', res.you ? (res.you.correct ? '100%' : '0%') : '-');
    setText('statPlayed', res.you ? '1' : '0');
  }).catch(function(){});
}
function setText(id, v){ var el = document.getElementById(id); if (el) el.textContent = v; }

function renderLBReal(){
  EduAPI.getChallengeLeaderboard().then(function(res){
    var rows = (res.leaderboard || []).map(function(r){ return [r.name, r.points, false]; });
    var meIn = (res.leaderboard || []).length && res.you && res.leaderboard.some(function(r){ return r.points === res.you.points; });
    if (res.you && !meIn) rows.push(['You', res.you.points, true]);
    var html = rows.length
      ? rows.map(function(r, i){
          return '<div class="lb__row' + (r[2] ? ' is-you' : '') + '">' +
            '<span class="lb__rank">' + pad(i + 1) + '</span><span>' + esc(r[0]) + '</span>' +
            '<span class="lb__pts">' + r[1] + ' pts</span></div>';
        }).join('')
      : '<p class="empty-hint" style="padding:6px 2px">No one has played this hour yet, be the first.</p>';
    document.getElementById('lbList').innerHTML = html;
  }).catch(function(){
    document.getElementById('lbList').innerHTML =
      '<p class="empty-hint" style="padding:6px 2px">Could not load the leaderboard right now.</p>';
  });
}

// ---------- boot (real backend) ----------
function bootReal(){
  var lbEyebrow = document.getElementById('lbEyebrow');
  if (lbEyebrow) lbEyebrow.textContent = "This hour's leaderboard";
  document.getElementById('histWrap').style.display = 'none'; // per-hour history isn't tracked server-side yet

  EduAPI.getChallenge().then(function(res){
    if (res.alreadyPlayed){
      renderDoneReal({ points: res.points, correct: true }, false);
    } else {
      renderReadyReal(res.question);
    }
  }).catch(function(err){
    playCard.innerHTML =
      '<div class="mono">Arena</div>' +
      '<div class="play__sub" style="margin-top:10px">' + esc(err.message || "Couldn't load this hour's question.") + '</div>';
  });
  refreshRealStats();
  renderLBReal();
}

function renderReady(){
  var nowD = new Date();
  playCard.innerHTML =
    '<div class="mono">This hour&rsquo;s drop</div>' +
    '<div class="play__hour">' + hourLabel(nowD) + ' question</div>' +
    '<div class="play__sub">Same question for every student right now · ' + esc(questionFor(hourKey(nowD)).subj) + '</div>' +
    '<div class="blurbox"><p>The question stays hidden until you start. No previews, no head starts.</p></div>' +
    '<div class="startrow">' +
      '<button class="btn-primary" id="startBtn" type="button">Reveal &amp; start 45s</button>' +
      '<span class="startnote">The timer starts the moment you reveal.</span>' +
    '</div>';
  document.getElementById('startBtn').addEventListener('click', startPlay);
}

function startPlay(){
  var nowD = new Date();
  var key = hourKey(nowD);
  var qData = questionFor(key);
  var deadline = Date.now() + WINDOW_SEC * 1000;
  var locked = false;
  var C = 2 * Math.PI * 30;

  var optsHtml = '';
  qData.opts.forEach(function(o, i){
    optsHtml += '<button class="opt" data-i="' + i + '" type="button"><span class="ltr">' +
      String.fromCharCode(65 + i) + '</span><span>' + esc(o) + '</span></button>';
  });

  playCard.innerHTML =
    '<div class="qhead">' +
      '<div class="timer">' +
        '<svg width="74" height="74" viewBox="0 0 74 74">' +
          '<circle cx="37" cy="37" r="30" fill="none" stroke="var(--line)" stroke-width="6"/>' +
          '<circle id="tArc" cx="37" cy="37" r="30" fill="none" stroke="var(--teal)" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="0"/>' +
        '</svg>' +
        '<span class="timer__num" id="tNum">' + WINDOW_SEC + '</span>' +
      '</div>' +
      '<div><div class="mono">' + esc(qData.subj) + ' · ' + hourLabel(new Date()) + ' drop</div>' +
      '<div class="play__sub" style="margin-top:4px">Answer before the ring runs out.</div></div>' +
    '</div>' +
    '<div class="qtext">' + qData.q + '</div>' +
    '<div class="opts" id="optGrid">' + optsHtml + '</div>';

  function finish(pickedIdx){
    if(locked) return;
    locked = true;
    cancelAnimationFrame(playTimer);
    var remaining = Math.max(0, (deadline - Date.now()) / 1000);
    var correct = pickedIdx === qData.a;
    var pts = 0;
    if(correct){
      var streakBonus = Math.min(store.streak * 10, 50);
      pts = 100 + Math.round(remaining / WINDOW_SEC * 100) + streakBonus;
      store.streak += 1;
      if(store.streak > store.bestStreak) store.bestStreak = store.streak;
    } else {
      store.streak = 0;
    }
    store.points += pts;
    store.history.push({ key: key, correct: correct, points: pts, subj: qData.subj, missed: pickedIdx === null });
    saveLS();

    var grid = document.getElementById('optGrid');
    grid.querySelectorAll('.opt').forEach(function(b){
      b.disabled = true;
      var i = parseInt(b.getAttribute('data-i'), 10);
      if(i === qData.a) b.classList.add('is-right');
      else if(i === pickedIdx) b.classList.add('is-wrong');
    });
    setTimeout(function(){ renderDone(); renderStats(); renderLBDemo(); renderHist(); }, 1600);
  }

  document.getElementById('optGrid').querySelectorAll('.opt').forEach(function(b){
    b.addEventListener('click', function(){ finish(parseInt(b.getAttribute('data-i'), 10)); });
  });

  function frame(){
    var remaining = (deadline - Date.now()) / 1000;
    if(remaining <= 0){ finish(null); return; }
    var arc = document.getElementById('tArc');
    var num = document.getElementById('tNum');
    if(arc && num){
      num.textContent = Math.ceil(remaining);
      arc.setAttribute('stroke-dashoffset', (C * (1 - remaining / WINDOW_SEC)).toFixed(1));
      arc.setAttribute('stroke', remaining > 20 ? 'var(--teal)' : remaining > 10 ? 'var(--amber)' : 'var(--rose)');
    }
    playTimer = requestAnimationFrame(frame);
  }
  playTimer = requestAnimationFrame(frame);
}

function renderDone(){
  var key = hourKey(new Date());
  var last = null;
  store.history.forEach(function(r){ if(r.key === key) last = r; });
  var verdict, detail;
  if(last && last.correct){
    verdict = '<span style="color:var(--teal)">Correct</span>';
    detail = 'Speed bonus banked. Come back next hour to keep the streak alive.';
  } else if(last && last.missed){
    verdict = '<span style="color:var(--amber)">Time&rsquo;s up</span>';
    detail = 'The window closed. Next hour, reveal only when you&rsquo;re ready to sprint.';
  } else {
    verdict = '<span style="color:var(--rose)">Not this time</span>';
    detail = 'Streak resets, but a new drop lands at the top of the hour.';
  }
  playCard.innerHTML =
    '<div class="mono">' + hourLabel(new Date()) + ' drop, played</div>' +
    '<div style="margin-top:16px" class="res__points">+' + (last ? last.points : 0) + '</div>' +
    '<div class="res__verdict">' + verdict + '</div>' +
    '<div class="res__detail">' + detail + '</div>' +
    (store.streak > 1 ? '<div class="streakchip">' + store.streak + '-hour streak</div>' : '') +
    '<div class="nextdrop">' +
      '<div class="mono">Next drop in</div>' +
      '<b id="nextClock">--:--</b>' +
      '<div class="hourbar"><i id="hourFill" style="width:0%"></i></div>' +
    '</div>';
  tickCountdown();
  countdownTimer = setInterval(tickCountdown, 1000);
}

function tickCountdown(){
  var el = document.getElementById('nextClock');
  if(!el){ clearInterval(countdownTimer); return; }
  var nowD = new Date();
  var next = new Date(nowD); next.setHours(nowD.getHours() + 1, 0, 0, 0);
  var sec = Math.round((next - nowD) / 1000);
  el.textContent = pad(Math.floor(sec / 60)) + ':' + pad(sec % 60);
  var fill = document.getElementById('hourFill');
  if(fill) fill.style.width = ((3600 - sec) / 3600 * 100).toFixed(1) + '%';
  if(sec <= 1){
    clearInterval(countdownTimer);
    setTimeout(function(){ renderReady(); }, 1200);
  }
}

/* ---------- rail ---------- */
function renderStats(){
  document.getElementById('statPoints').textContent = store.points;
  document.getElementById('statStreak').textContent = store.streak;
  document.getElementById('statBest').textContent = store.bestStreak;
  document.getElementById('statPlayed').textContent = store.history.length;
  var played = store.history.filter(function(r){ return !r.missed; }).length;
  var right = store.history.filter(function(r){ return r.correct; }).length;
  document.getElementById('statAcc').textContent =
    store.history.length ? Math.round(right / store.history.length * 100) + '%' : '-';
}

// Logged-out preview only: a single real row ("You") plus an honest note that
// this is a preview, not a real cross-student ranking (that requires being
// logged in, see renderLBReal above for the real backend leaderboard).
function renderLBDemo(){
  document.getElementById('lbList').innerHTML =
    '<div class="lb__row is-you"><span class="lb__rank">01</span><span>You</span>' +
    '<span class="lb__pts">' + store.points + ' pts</span></div>' +
    '<p class="empty-hint" style="padding:10px 2px 2px">Sign in to see the real leaderboard for your class.</p>';
}

function renderHist(){
  var wrap = document.getElementById('histWrap');
  if(!store.history.length){ wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  var html = '';
  store.history.slice().reverse().slice(0, 8).forEach(function(r){
    var y = r.key.slice(0,4), mo = r.key.slice(4,6), da = r.key.slice(6,8), hh = parseInt(r.key.slice(8,10), 10);
    var am = hh >= 12 ? 'PM' : 'AM'; var h12 = hh % 12; if(h12 === 0) h12 = 12;
    html += '<div class="hist__row">' +
      '<span class="hist__dot" style="background:' + (r.correct ? 'var(--teal)' : 'var(--rose)') + '"></span>' +
      '<span>' + da + '/' + mo + ' · ' + h12 + ' ' + am + ' · ' + esc(r.subj) + '</span>' +
      '<span class="hist__pts">' + (r.missed ? 'missed' : (r.correct ? 'correct' : 'wrong')) + ' · +' + r.points + '</span>' +
    '</div>';
  });
  document.getElementById('histList').innerHTML = html;
}

/* boot */
// REAL_MODE was computed above from a synchronous localStorage check, before
// api.js (loaded after this script tag) exists, re-check once EduAPI is
// actually available, then never show the local demo engine to a logged-in
// student, only the real backend-driven challenge.
window.__eduBootChallenge = function(){
  REAL_MODE = !!(window.EduAPI && EduAPI.getToken && EduAPI.getToken());
  if (REAL_MODE){
    bootReal();
  } else {
    if(playedThisHour()) renderDone(); else renderReady();
    renderStats(); renderLBDemo(); renderHist();
  }
};

})();


/* ---- next <script> block ---- */

window.__eduBootChallenge();
}
