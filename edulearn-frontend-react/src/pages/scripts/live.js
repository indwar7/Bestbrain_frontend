/* Lifted verbatim from edulearn-frontend/live.html, do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {

(function(){
'use strict';

/* Class 7's grid below is genuinely curated, a teacher picked which
   chapters are foundational/high-weightage, one by one, and that judgment
   isn't something curriculum.js's plain chapter list carries. Every other
   class gets its own real chapters instead, without inventing a "must-do"
   star this code has no basis to award. */
(function rebuildSyllabusForRealClass(){
  var section = document.querySelector('.syl');
  if (!section) return;

  var cls = 7;
  try {
    var u = JSON.parse(localStorage.getItem('edulearn_user') || 'null');
    var n = parseInt(String((u && (u.class || u.className)) || ''), 10);
    if (!n) { var m = String((u && u.className) || '').match(/\d+/); if (m) n = parseInt(m[0], 10); }
    if (n) cls = n;
  } catch (e) {}

  if (cls === 7) return;   // the hand-curated content already matches

  var C = window.EduCurriculum;
  var data = C && C.CURRICULUM && C.CURRICULUM[String(cls)];
  if (!data) return;       // no data for this class, leave the fallback rather than show nothing

  var ICONS = {
    science: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6M10 2v6.5L5.2 17A2 2 0 0 0 7 20h10a2 2 0 0 0 1.8-3L14 8.5V2"/><path d="M7.5 14h9"/></svg>',
    maths: '<span style="font-family:\'Fraunces\',serif;font-weight:700;font-size:18px;line-height:1">x&sup2;</span>',
    social: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/></svg>',
    english: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    hindi: '<span style="font-family:\'Nunito\',sans-serif;font-weight:800;font-size:19px;line-height:1">अ</span>'
  };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var subjects = (C.SUBJECTS || []).filter(function (s) { return data[s.key] && data[s.key].length; });
  var html = subjects.map(function (s, si) {
    var chapters = data[s.key];
    var rows = chapters.map(function (ch, i) {
      var num = String(i + 1).length < 2 ? '0' + (i + 1) : String(i + 1);
      return '<li class="sylc__ch"><span class="sylc__n">' + num + '</span>' +
        '<span class="sylc__t">' + esc(ch[1]) + '</span></li>';
    }).join('');
    return '<article class="sylc rv" style="--sa:' + s.accent + ';animation-delay:' + (0.22 + si * 0.04) + 's">' +
      '<div class="sylc__hd"><span class="sylc__ic">' + (ICONS[s.key] || '') + '</span>' +
      '<div><div class="sylc__name">' + esc(s.en) + '</div>' +
      '<div class="sylc__count">' + chapters.length + ' chapters</div></div></div>' +
      '<ul class="sylc__list">' + rows + '</ul></article>';
  }).join('');

  var grid = section.querySelector('.syl__grid');
  if (grid) grid.innerHTML = html;

  var h2 = section.querySelector('.syl__head h2');
  if (h2) h2.textContent = 'Class ' + cls + ' NCERT, the full syllabus';
  var sub = section.querySelector('.syl__sub');
  if (sub) sub.textContent = 'Every subject, chapter by chapter, straight from the NCERT syllabus for your class.';
  /* the "must-do, foundational" star is Class 7's curation only, nothing
     here has grounds to claim the same for a class it was never applied to */
  var legend = section.querySelector('.syl__legend');
  if (legend) legend.style.display = 'none';
})();

var LS_KEY = 'edulearn_live';

// Safe wrappers to LiveKit glue (live-video.js). No-op if not available.
function global_EduLiveConnect(id){ if (window.EduLive && id) window.EduLive.connect(id); }
function global_EduLiveDisconnect(){ if (window.EduLive) window.EduLive.disconnect(); }

function loadLS(){
  try{
    var raw = localStorage.getItem(LS_KEY);
    var d = raw ? JSON.parse(raw) : null;
    if(!d || typeof d !== 'object') d = {};
    if(!Array.isArray(d.bookings)) d.bookings = [];
    if(!Array.isArray(d.reports)) d.reports = [];
    return d;
  }catch(e){ return { bookings:[], reports:[] }; }
}
function saveLS(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(store)); }catch(e){} }
var store = loadLS();

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function pad(n){ return (n<10?'0':'')+n; }
function fmtTime(d){
  var h = d.getHours(), m = pad(d.getMinutes()), am = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if(h === 0) h = 12;
  return h + ':' + m + ' ' + am;
}

/* ---------- sessions, relative to now ---------- */
var SUBJ = {
  maths:  { name:'Mathematics',    color:'#7C9BFF' },
  science:{ name:'Science',        color:'#3DE8C5' },
  social: { name:'Social Science', color:'#FFB454' },
  english:{ name:'English',        color:'#FF7AA2' }
};
var now = new Date();
function at(offsetMin){ return new Date(now.getTime() + offsetMin * 60000); }
function tomorrowAt(h){
  var d = new Date(now.getTime() + 86400000);
  d.setHours(h, 0, 0, 0); return d;
}
var SESSIONS = [
  { id:'s1', topic:'Polynomials, Part 2',        cls:9, subj:'maths',   tutor:'Priya Sharma', rating:'4.9', start:at(-12), mins:60, seats:'3/15',  live:true  },
  { id:'s2', topic:'Heat - Revision',            cls:7, subj:'science', tutor:'Arjun Mehta',  rating:'4.8', start:at(60),  mins:45, seats:'6/15',  live:false },
  { id:'s3', topic:'The French Revolution',      cls:9, subj:'social',  tutor:'Kavita Rao',   rating:'4.9', start:at(150), mins:60, seats:'9/15',  live:false },
  { id:'s4', topic:'Fractions Doubt Clinic',     cls:6, subj:'maths',   tutor:'Rohan Iyer',   rating:'4.8', start:at(240), mins:45, seats:'11/15', live:false },
  { id:'s5', topic:'Light - Numericals',         cls:7, subj:'science', tutor:'Arjun Mehta',  rating:'4.8', start:tomorrowAt(10), mins:60, seats:'13/15', live:false },
  { id:'s6', topic:'Grammar Power Hour',         cls:8, subj:'english', tutor:'Sneha Kulkarni', rating:'4.9', start:tomorrowAt(17), mins:45, seats:'8/15', live:false }
];

function initials(name){
  return name.split(' ').map(function(w){ return w.charAt(0); }).join('').slice(0,2).toUpperCase();
}
function isBooked(id){
  return store.bookings.some(function(b){ return b.id === id; });
}

function renderSessions(){
  var host = document.getElementById('sessionGrid');
  var html = '';
  SESSIONS.forEach(function(s, i){
    var sub = SUBJ[s.subj];
    var when = s.live
      ? 'Started ' + Math.round((now - s.start)/60000) + ' min ago'
      : (s.start.getDate() !== now.getDate() ? 'Tomorrow · ' : '') + fmtTime(s.start) + ' · ' + s.mins + ' min';
    var act = s.live
      ? '<button class="btn-join" data-join="' + s.id + '" type="button">Join live</button>'
      : (isBooked(s.id)
        ? '<button class="btn-book is-booked" type="button" disabled>Booked, added to calendar</button>'
        : '<button class="btn-book" data-book="' + s.id + '" type="button">Book seat</button>');
    html +=
      '<article class="sess rv" style="--sa:' + sub.color + ';animation-delay:' + (380 + i*70) + 'ms">' +
        '<div class="sess__avatar">' + initials(s.tutor) + '</div>' +
        '<div class="sess__body">' +
          '<div class="sess__topic">' + esc(s.topic) + '</div>' +
          '<div class="sess__meta"><b>' + esc(s.tutor) + '</b> · ' + s.rating + ' · ' + when + '</div>' +
          '<div class="sess__tags">' +
            '<span class="tag tag--subj">Class ' + s.cls + ' · ' + sub.name + '</span>' +
            (s.live ? '<span class="tag tag--live">Live now</span>' : '<span class="tag">' + s.seats + ' seats left</span>') +
          '</div>' +
        '</div>' +
        '<div class="sess__act">' + act + '</div>' +
      '</article>';
  });
  host.innerHTML = html;

  host.querySelectorAll('[data-book]').forEach(function(btn){
    btn.addEventListener('click', function(){ book(btn.getAttribute('data-book')); });
  });
  host.querySelectorAll('[data-join]').forEach(function(btn){
    btn.addEventListener('click', function(){ joinClass(btn.getAttribute('data-join')); });
  });
}

function renderMyList(){
  var host = document.getElementById('myList');
  if(!store.bookings.length){
    host.innerHTML = '<p class="empty-hint">Nothing booked yet, grab a seat from today&rsquo;s sessions.</p>';
    return;
  }
  var html = '';
  store.bookings.forEach(function(b){
    var d = new Date(b.startISO);
    html += '<div class="myrow"><span>' + esc(b.title) + '</span><span class="when">' +
      (d.getDate() !== now.getDate() ? 'Tomorrow ' : '') + fmtTime(d) + '</span></div>';
  });
  host.innerHTML = html;
}

function scoreColor(s){ return s >= 80 ? 'var(--teal)' : s >= 50 ? 'var(--amber)' : 'var(--rose)'; }

function renderReports(){
  var host = document.getElementById('reportList');
  if(!store.reports.length){
    host.innerHTML = '<p class="empty-hint">Join a class and your attentiveness report will appear here, and on the parent dashboard.</p>';
    return;
  }
  var html = '';
  store.reports.slice().reverse().slice(0, 5).forEach(function(r){
    var d = new Date(r.dateISO);
    html +=
      '<div class="rep">' +
        '<span class="rep__score" style="background:' + scoreColor(r.score) + '">' + r.score + '</span>' +
        '<div class="rep__body">' +
          '<div class="rep__topic">' + esc(r.topic) + '</div>' +
          '<div class="rep__date">' + d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) + ' · ' + r.duration + ' attended' +
            (typeof r.onScreenPct === 'number' ? ' · ' + r.onScreenPct + '% on screen' : '') + '</div>' +
        '</div>' +
        '<span class="tag" style="color:var(--teal);border-color:rgba(61,232,197,.4)">' +
          (r.camUsed ? 'Camera' : 'Sent') + '</span>' +
      '</div>';
  });
  host.innerHTML = html;
}

/* ---------- booking + .ics calendar ---------- */
function icsStamp(d){
  return d.getUTCFullYear() + pad(d.getUTCMonth()+1) + pad(d.getUTCDate()) + 'T' +
         pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
}
function downloadICS(s){
  var end = new Date(s.start.getTime() + s.mins * 60000);
  var ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//BestBrain//Live Classes//EN',
    'BEGIN:VEVENT',
    'UID:' + s.id + '@edulearn.in',
    'DTSTAMP:' + icsStamp(new Date()),
    'DTSTART:' + icsStamp(s.start),
    'DTEND:' + icsStamp(end),
    'SUMMARY:BestBrain Live: ' + s.topic,
    'DESCRIPTION:Class ' + s.cls + ' ' + SUBJ[s.subj].name + ' with ' + s.tutor + '. Join from the BestBrain Live page.',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  var blob = new Blob([ics], { type:'text/calendar' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'edulearn-' + s.id + '.ics';
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 400);
}
function book(id){
  var s = SESSIONS.filter(function(x){ return x.id === id; })[0];
  if(!s || isBooked(id)) return;
  store.bookings.push({ id:s.id, title:s.topic, startISO:s.start.toISOString() });
  saveLS();
  downloadICS(s);
  renderSessions(); renderMyList();
}

/* ---------- classroom + attentiveness ---------- */
var CLS = null; /* live class state */

/* Play a REAL lecture video as the class stage (in-app, same tab as the camera
   monitor). Picks a lecture for the student's class from the backend; on any
   failure it falls back to the existing avatar so the class still opens. */
function loadLectureStage(s){
  var stageEl = document.getElementById('lectureStage');
  var vid = document.getElementById('lectureVideo');
  var sim = document.getElementById('simAvatar');
  var note = document.getElementById('stageNote');
  if(!window.EduAPI || !EduAPI.listVideos){ return; }
  function paint(pick){
    if(!pick){ return; } // no lecture available → keep the formula board
    if(sim) sim.style.display = 'none';
    var board = document.getElementById('boardStage');
    if(board) board.style.display = 'none'; // real lecture replaces the board
    stageEl.style.display = 'block';
    document.getElementById('lectureTitle').textContent = pick.title || 'Live lecture';
    vid.src = EduAPI.API_BASE + '/api/videos/' + pick.id + '/stream?token=' + encodeURIComponent(EduAPI.getToken());
    vid.play().catch(function(){});
    if(note) note.textContent = 'Live lecture playing · your camera is used only for attention monitoring (video stays on your device).';
    if (CLS){ CLS.lectureTitle = pick.title || ''; }
  }
  function best(list){
    list = list || [];
    return list.filter(function(v){ return /▶/.test(v.title||''); })[0] || list[0] || null;
  }
  // Prefer a lecture matching the class's subject; if none exist for that
  // subject, fall back to ANY lecture the student can access (so the stage is
  // never the fake avatar when real content exists for their class).
  var subjFilter = s.subj ? { subject: s.subj } : {};
  EduAPI.listVideos(subjFilter).then(function(list){
    var pick = best(list);
    if (pick) return paint(pick);
    return EduAPI.listVideos({}).then(function(all){ paint(best(all)); });
  }).catch(function(){
    EduAPI.listVideos({}).then(function(all){ paint(best(all)); }).catch(function(){});
  });
}
function stopLectureStage(){
  var stageEl = document.getElementById('lectureStage');
  var vid = document.getElementById('lectureVideo');
  if(vid){ try{ vid.pause(); vid.removeAttribute('src'); vid.load(); }catch(e){} }
  if(stageEl) stageEl.style.display = 'none';
}

function joinClass(id){
  var s = SESSIONS.filter(function(x){ return x.id === id; })[0];
  if(!s) return;
  document.getElementById('browseView').style.display = 'none';
  document.getElementById('reportView').style.display = 'none';
  document.getElementById('classView').style.display = 'block';
  document.getElementById('clsTopic').textContent = s.topic;
  document.getElementById('tutorName').textContent = s.tutor + ' · Tutor';
  document.getElementById('tutorCircle').textContent = initials(s.tutor);
  // Fresh class → show the polynomial formula board; hide any prior video stage.
  var _board = document.getElementById('boardStage');
  if(_board) _board.style.display = 'block';
  document.getElementById('lkStage').style.display = 'none';
  document.getElementById('lectureStage').style.display = 'none';
  window.scrollTo(0, 0);

  // Video stage: a REAL backend session with a live broadcast uses LiveKit;
  // otherwise play an actual recorded lecture in-app as the class content
  // (never the fake simulated avatar). Camera monitoring runs either way.
  if (s.backendId){
    if (global_EduLiveConnect) global_EduLiveConnect(s.backendId);
  } else {
    loadLectureStage(s);
  }

  CLS = {
    session: s,
    t0: Date.now(),
    score: 100,
    away: false, awaySince: 0, awayCount: 0, awayLoss: 0,
    idle: false, lastActivity: Date.now(),
    chats: 0, hands: 0,
    longestFocus: 0, focusStart: Date.now(),
    events: [{ t: 0, type:'ok', label:'Joined the class' }],
    timer: setInterval(tick, 1000),
    chatTimers: [],
    /* camera attention */
    camOn: false, gaze: 'unknown', gazeAway: false,
    onScreenSec: 0, offScreenSec: 0, lookAwayCount: 0,
    camTimer: null, camStream: null
  };
  /* reset camera UI */
  var consent = document.getElementById('camConsent');
  consent.classList.remove('is-hidden');
  var tile = document.getElementById('selfTile');
  tile.classList.remove('has-cam','cam-on','cam-away');
  startChatScript();
}

function logEvent(type, label){
  if(!CLS) return;
  CLS.events.push({ t: Math.round((Date.now() - CLS.t0)/1000), type: type, label: label });
}
function mmss(sec){ return Math.floor(sec/60) + ':' + pad(sec % 60); }

function markFocusStretch(){
  var stretch = Date.now() - CLS.focusStart;
  if(stretch > CLS.longestFocus) CLS.longestFocus = stretch;
}

function setAway(away){
  if(!CLS || CLS.away === away) return;
  CLS.away = away;
  if(away){
    CLS.awaySince = Date.now(); CLS.awayCount++; CLS.awayLoss = 0;
    markFocusStretch();
    logEvent('bad', 'Looked away (left the tab)');
  } else {
    CLS.focusStart = Date.now();
    logEvent('ok', 'Came back');
  }
}
document.addEventListener('visibilitychange', function(){ setAway(document.hidden); });
window.addEventListener('blur', function(){ setAway(true); });
window.addEventListener('focus', function(){ setAway(false); });

/* ---------- CAMERA ATTENTION (real webcam + face/gaze detection) ---------- */
var faceDetector = null;
if('FaceDetector' in window){
  try{ faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 }); }catch(e){ faceDetector = null; }
}
/* canvas for the fallback brightness/skin heuristic */
var gazeCanvas = document.createElement('canvas');
gazeCanvas.width = 64; gazeCanvas.height = 48;
var gazeCtx = gazeCanvas.getContext('2d', { willReadFrequently: true });

function setGaze(state){ /* 'looking' | 'away' */
  if(!CLS || !CLS.camOn) return;
  var badge = document.getElementById('gazeBadge');
  var tile = document.getElementById('selfTile');
  var awayNow = (state === 'away');
  if(awayNow !== CLS.gazeAway){
    CLS.gazeAway = awayNow;
    if(awayNow){ CLS.lookAwayCount++; markFocusStretch(); logEvent('bad', 'Looked away from the screen (camera)'); }
    else { CLS.focusStart = Date.now(); logEvent('ok', 'Eyes back on screen'); }
  }
  CLS.gaze = state;
  badge.textContent = awayNow ? 'Looking away' : 'Looking';
  badge.classList.toggle('away', awayNow);
  tile.classList.toggle('cam-on', !awayNow);
  tile.classList.toggle('cam-away', awayNow);
}

/* analyse one video frame → resolve to true if a centred face is present */
function detectGaze(video){
  if(faceDetector){
    return faceDetector.detect(video).then(function(faces){
      if(!faces || !faces.length) return false;
      var b = faces[0].boundingBox;
      var cx = (b.x + b.width/2) / video.videoWidth;
      var cy = (b.y + b.height/2) / video.videoHeight;
      var big = (b.width * b.height) / (video.videoWidth * video.videoHeight) > 0.025;
      /* "looking" = a reasonably sized face roughly centred in frame */
      return big && cx > 0.28 && cx < 0.72 && cy > 0.18 && cy < 0.82;
    }).catch(function(){ return heuristicGaze(video); });
  }
  return Promise.resolve(heuristicGaze(video));
}

/* fallback when FaceDetector is unavailable (Firefox/Safari):
   compare centre-region skin-tone coverage, present & facing forward → looking */
function heuristicGaze(video){
  try{
    gazeCtx.drawImage(video, 0, 0, gazeCanvas.width, gazeCanvas.height);
    var d = gazeCtx.getImageData(0, 0, gazeCanvas.width, gazeCanvas.height).data;
    var W = gazeCanvas.width, H = gazeCanvas.height;
    var skin = 0, centreSkin = 0, total = 0, centreTotal = 0;
    for(var y = 0; y < H; y++){
      for(var x = 0; x < W; x++){
        var i = (y * W + x) * 4;
        var r = d[i], g = d[i+1], b = d[i+2];
        var isSkin = r > 70 && g > 40 && b > 25 && r > g && r > b && (r - g) > 12 && Math.abs(r - g) < 130;
        total++;
        if(isSkin) skin++;
        var inC = x > W*0.3 && x < W*0.7 && y > H*0.2 && y < H*0.8;
        if(inC){ centreTotal++; if(isSkin) centreSkin++; }
      }
    }
    var centreFrac = centreSkin / centreTotal;
    /* face present and centred → looking; mostly empty centre → away */
    return centreFrac > 0.16 && (skin/total) > 0.07;
  }catch(e){ return true; }
}

function startCamera(){
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    camFailed('Camera not supported on this browser.');
    return;
  }
  navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' }, audio: false })
    .then(function(stream){
      if(!CLS){ stream.getTracks().forEach(function(t){ t.stop(); }); return; }
      CLS.camStream = stream;
      CLS.camOn = true;
      var video = document.getElementById('selfCam');
      video.srcObject = stream;
      document.getElementById('selfTile').classList.add('has-cam');
      document.getElementById('camConsent').classList.add('is-hidden');
      document.getElementById('selfStatus').textContent = 'camera on';
      logEvent('ok', 'Camera monitoring started');
      setGaze('looking');
      var miss = 0;
      CLS.camTimer = setInterval(function(){
        if(!CLS || !CLS.camOn || video.readyState < 2) return;
        detectGaze(video).then(function(looking){
          /* debounce: need 2 consecutive away frames before flipping to away */
          if(looking){ miss = 0; setGaze('looking'); }
          else { miss++; if(miss >= 2) setGaze('away'); }
        });
      }, 900);
    })
    .catch(function(err){
      camFailed(err && err.name === 'NotAllowedError'
        ? 'Camera permission denied. Attention will be tracked by tab focus only.'
        : 'Could not start the camera. Tab-focus tracking stays on.');
    });
}

function camFailed(msg){
  var consent = document.getElementById('camConsent');
  consent.classList.add('is-hidden');
  document.getElementById('stageNote').textContent = msg;
  if(CLS) logEvent('warn', 'Camera not enabled, tab-focus tracking only');
}

function stopCamera(){
  if(CLS && CLS.camTimer){ clearInterval(CLS.camTimer); CLS.camTimer = null; }
  if(CLS && CLS.camStream){ CLS.camStream.getTracks().forEach(function(t){ t.stop(); }); CLS.camStream = null; }
  var video = document.getElementById('selfCam');
  if(video) video.srcObject = null;
}

document.getElementById('enableCam').addEventListener('click', startCamera);
document.getElementById('skipCam').addEventListener('click', function(){
  document.getElementById('camConsent').classList.add('is-hidden');
  document.getElementById('stageNote').textContent = 'Camera monitoring skipped, attention tracked by tab focus only.';
  if(CLS) logEvent('warn', 'Skipped camera monitoring');
});

['mousemove','keydown','pointerdown','scroll','touchstart'].forEach(function(ev){
  window.addEventListener(ev, function(){
    if(!CLS) return;
    CLS.lastActivity = Date.now();
    if(CLS.idle){
      CLS.idle = false;
      CLS.focusStart = Date.now();
      logEvent('ok', 'Active again');
    }
  }, { passive:true });
});

function tick(){
  if(!CLS) return;
  var el = Math.round((Date.now() - CLS.t0)/1000);
  document.getElementById('clsClock').textContent = mmss(el);

  /* camera attention accounting */
  if(CLS.camOn){
    if(CLS.gazeAway) CLS.offScreenSec++; else CLS.onScreenSec++;
  }

  if(CLS.away){
    /* left the browser tab entirely */
    if(CLS.awayLoss < 20){ CLS.score -= 2; CLS.awayLoss += 2; }
  } else if(CLS.camOn && CLS.gazeAway){
    /* camera says eyes are off the screen, strongest penalty */
    CLS.score -= 1.5;
  } else if(Date.now() - CLS.lastActivity > 45000 && !CLS.camOn){
    /* no camera: fall back to idle detection */
    if(!CLS.idle){
      CLS.idle = true;
      markFocusStretch();
      logEvent('warn', 'Went idle');
    }
    CLS.score -= 0.5;
  } else {
    CLS.score += 0.2;
  }
  CLS.score = Math.max(0, Math.min(100, CLS.score));
  paintScore();
}

function paintScore(){
  var s = Math.round(CLS.score);
  var arc = document.getElementById('attnArc');
  document.getElementById('attnNum').textContent = s;
  arc.setAttribute('stroke-dashoffset', (138.2 * (1 - s/100)).toFixed(1));
  arc.setAttribute('stroke', scoreColor(s));
}

/* controls */
var micOn = true, camOn = true;
document.getElementById('micBtn').addEventListener('click', function(){
  micOn = !micOn;
  this.textContent = micOn ? 'Mic on' : 'Mic off';
  this.classList.toggle('is-off', !micOn);
  updateSelf();
});
document.getElementById('camBtn').addEventListener('click', function(){
  camOn = !camOn;
  this.textContent = camOn ? 'Camera on' : 'Camera off';
  this.classList.toggle('is-off', !camOn);
  updateSelf();
});
function updateSelf(){
  document.getElementById('selfStatus').textContent =
    'mic ' + (micOn ? 'on' : 'off') + ' · cam ' + (camOn ? 'on' : 'off');
}
document.getElementById('handBtn').addEventListener('click', function(){
  if(!CLS) return;
  CLS.hands++;
  CLS.score = Math.min(100, CLS.score + 3);
  logEvent('ok', 'Raised hand');
  var chipEl = document.getElementById('handChip');
  chipEl.style.display = 'block';
  setTimeout(function(){ chipEl.style.display = 'none'; }, 10000);
});

/* chat */
var SCRIPT = [
  { d: 4000,  who:'Priya Sharma · Tutor', tutor:true,  text:'Welcome everyone! Today we finish the factor theorem and start splitting cubics.' },
  { d: 11000, who:'Diya S.',              tutor:false, text:'mam ek baar zeroes wala dobara please' },
  { d: 16000, who:'Priya Sharma · Tutor', tutor:true,  text:'Sure Diya, a zero is just the x where p(x) becomes 0. Watch this example.' },
  { d: 26000, who:'Ishaan K.',            tutor:false, text:'so (x-2) is a factor because p(2)=0?' },
  { d: 31000, who:'Priya Sharma · Tutor', tutor:true,  text:'Exactly, Ishaan. That IS the factor theorem. Now try q(x) = x² − 5x + 6 yourselves.' },
  { d: 44000, who:'Meera R.',             tutor:false, text:'(x-2)(x-3)!' },
  { d: 49000, who:'Priya Sharma · Tutor', tutor:true,  text:'Well done. Next: what happens with cubics, this is where your boards marks hide.' }
];
function pushMsg(who, text, tutor, me){
  var log = document.getElementById('chatLog');
  var div = document.createElement('div');
  div.className = 'msg' + (tutor ? ' msg--tutor' : '') + (me ? ' msg--me' : '');
  div.innerHTML = '<span class="who">' + esc(who) + '</span><span class="bub">' + esc(text) + '</span>';
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
function startChatScript(){
  document.getElementById('chatLog').innerHTML = '';
  SCRIPT.forEach(function(m){
    CLS.chatTimers.push(setTimeout(function(){ pushMsg(m.who, m.text, m.tutor, false); }, m.d));
  });
}
document.getElementById('chatForm').addEventListener('submit', function(e){
  e.preventDefault();
  var inp = document.getElementById('chatInput');
  var v = inp.value.trim();
  if(!v || !CLS) return;

  // Real backend class → send over the live socket (server echoes it back,
  // which renders it for everyone including us). No scripted tutor reply.
  if (window.LiveRT && LiveRT.active()){
    if (LiveRT.send(v)){
      inp.value = '';
      CLS.chats++;
      CLS.score = Math.min(100, CLS.score + 5);
      logEvent('ok', 'Asked in chat');
    }
    return;
  }

  // Demo class → local scripted behaviour.
  pushMsg('You', v, false, true);
  inp.value = '';
  CLS.chats++;
  CLS.score = Math.min(100, CLS.score + 5);
  logEvent('ok', 'Asked in chat');
  CLS.chatTimers.push(setTimeout(function(){
    pushMsg('Priya Sharma · Tutor', 'Good question, let me cover that right after this example.', true, false);
  }, 4000));
});

/* leave -> report */
document.getElementById('leaveBtn').addEventListener('click', function(){
  if(!CLS) return;
  clearInterval(CLS.timer);
  CLS.chatTimers.forEach(clearTimeout);
  stopCamera();
  markFocusStretch();

  var score = Math.round(CLS.score);
  var durSec = Math.round((Date.now() - CLS.t0)/1000);
  var duration = mmss(durSec) + ' min';
  var camTotal = CLS.onScreenSec + CLS.offScreenSec;
  var onScreenPct = camTotal ? Math.round(CLS.onScreenSec / camTotal * 100) : null;
  var report = {
    dateISO: new Date().toISOString(),
    topic: CLS.session.topic,
    duration: duration,
    score: score,
    awayCount: CLS.awayCount,
    chats: CLS.chats,
    events: CLS.events,
    camUsed: CLS.camOn,
    onScreenPct: onScreenPct,
    lookAwayCount: CLS.lookAwayCount
  };
  store.reports.push(report);
  saveLS();

  /* Persist the report server-side so it survives a device change and reaches
     the student's linked parent. Best-effort: if the endpoint isn't live yet
     (older backend), the local copy above still shows it here. */
  if (window.EduAPI && EduAPI.submitLiveReport){
    EduAPI.submitLiveReport({
      topic: CLS.lectureTitle || CLS.session.topic,
      tutor: CLS.session.tutor || '',
      className: (liveUser && liveUser.className) || '',
      durationSec: durSec,
      score: score,
      camUsed: CLS.camOn,
      onScreenPct: onScreenPct,
      lookAwayCount: CLS.lookAwayCount,
      awayCount: CLS.awayCount,
      chats: CLS.chats,
      events: CLS.events
    });
  }
  stopLectureStage();

  /* disconnect live video + realtime chat; if this is a real backend class the
     host owns, end it server-side so every student's room is torn down too. */
  global_EduLiveDisconnect();
  if (window.LiveRT) LiveRT.disconnect();
  if (CLS.backendId && CLS.isHost && window.EduAPI && EduAPI.endLive){
    EduAPI.endLive(CLS.backendId).catch(function(){});
    realSessions = realSessions.filter(function(x){ return x._id !== CLS.backendId; });
    renderRealSessions();
  }

  /* paint report view */
  document.getElementById('classView').style.display = 'none';
  document.getElementById('reportView').style.display = 'block';
  document.getElementById('repTopic').textContent = CLS.session.topic;
  document.getElementById('repDate').textContent =
    new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) + ' · ' + CLS.session.tutor;
  document.getElementById('repScore').textContent = score;
  document.getElementById('repArc').setAttribute('stroke-dashoffset', (314.2 * (1 - score/100)).toFixed(1));

  var v = document.getElementById('repVerdict');
  if(score >= 80){
    v.innerHTML = '<span style="color:var(--teal)">Excellent focus</span><small>Locked in for nearly the whole session. Keep this rhythm.</small>';
  } else if(score >= 50){
    v.innerHTML = '<span style="color:var(--amber)">Good, some drift</span><small>A few wander-offs, try keeping the tab front and centre next class.</small>';
  } else {
    v.innerHTML = '<span style="color:var(--rose)">Needs attention</span><small>Attention dropped a lot this session. PAL will suggest a shorter format next time.</small>';
  }

  document.getElementById('repStats').innerHTML =
    '<div class="stat"><b>' + duration + '</b><span>attended</span></div>' +
    (onScreenPct !== null
      ? '<div class="stat"><b>' + onScreenPct + '%</b><span>eyes on screen (camera)</span></div>' +
        '<div class="stat"><b>' + CLS.lookAwayCount + '</b><span>times looked away (camera)</span></div>'
      : '<div class="stat"><b>' + CLS.awayCount + '</b><span>times left the tab</span></div>' +
        '<div class="stat"><b>' + mmss(Math.round(CLS.longestFocus/1000)) + '</b><span>longest focused stretch</span></div>') +
    '<div class="stat"><b>' + CLS.chats + '</b><span>doubts asked in chat</span></div>';

  var tl = '';
  CLS.events.forEach(function(ev){
    tl += '<div class="tl__row' + (ev.type === 'bad' ? ' is-bad' : ev.type === 'warn' ? ' is-warn' : '') + '">' +
          '<span class="t">' + mmss(ev.t) + '</span>' + esc(ev.label) + '</div>';
  });
  document.getElementById('repTimeline').innerHTML = tl;

  CLS = null;
  window.scrollTo(0, 0);
});

document.getElementById('backBtn').addEventListener('click', function(){
  document.getElementById('reportView').style.display = 'none';
  document.getElementById('browseView').style.display = 'block';
  renderReports(); renderMyList();
  window.scrollTo(0, 0);
});

/* hero CTA, jump into the live demo class and prompt the camera right away */
document.getElementById('tryAttn').addEventListener('click', function(){
  var liveSess = SESSIONS.filter(function(x){ return x.live; })[0] || SESSIONS[0];
  joinClass(liveSess.id);
  /* auto-trigger the permission prompt so the user sees it immediately */
  setTimeout(function(){ startCamera(); }, 350);
});

/* ============================================================
   REAL backend live classes (teacher starts → student joins).
   Layers on top of the demo UI above; uses EduAPI + EduLive.
   ============================================================ */
var liveUser = (window.EduAPI && EduAPI.getUser) ? EduAPI.getUser() : null;
var realSessions = []; // backend LiveSession objects

// Real self-tile initials from the logged-in user (was a hardcoded "AN").
(function(){
  var el = document.getElementById('selfInitials');
  if (el && liveUser && liveUser.name){
    var parts = String(liveUser.name).trim().split(/\s+/);
    var ini = (parts[0][0] || '') + (parts.length > 1 ? parts[parts.length-1][0] : '');
    el.textContent = (ini || 'You').toUpperCase();
  }
})();

function subjColor(subject){
  var k = String(subject || '').toLowerCase();
  if (k.indexOf('math') === 0) return '#7C9BFF';
  if (k.indexOf('sci') === 0)  return '#3DE8C5';
  if (k.indexOf('social') === 0 || k.indexOf('history') === 0) return '#FFB454';
  if (k.indexOf('eng') === 0)  return '#FF7AA2';
  return '#7C9BFF';
}

// Any logged-in user: hide the hardcoded fake demo content (fake tutors,
// fake bookings, fake attention reports) that's meant only as a
// try-before-signup preview for logged-out visitors on this same page.
// Real sessions (#liveGrid) and joining by code are unaffected.
function hideDemoContentForLoggedInUser(){
  liveUser = (window.EduAPI && EduAPI.getUser) ? EduAPI.getUser() : null;
  if (!liveUser) return;

  ['todayTitle', 'sessionGrid'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  var heroCta = document.querySelector('.hero__cta');
  if (heroCta) heroCta.style.display = 'none';
  var sidePanel = document.querySelector('aside.panel');
  if (sidePanel) sidePanel.style.display = 'none';
}

// Render the teacher's "start a class" composer from their assignments.
function setupTeacherComposer(){
  // Re-read the session fresh in case it changed after this script parsed.
  liveUser = (window.EduAPI && EduAPI.getUser) ? EduAPI.getUser() : null;
  if (!liveUser || liveUser.role !== 'teacher') return;

  // Teachers get a teacher page: hide the same fake demo content every
  // logged-in user gets hidden, plus (teacher-only) the join-by-code box ,
  // the page is about STARTING a class, not booking/joining a seat in one.
  hideDemoContentForLoggedInUser();
  var joinCodeBox = document.getElementById('joinCodeBox');
  if (joinCodeBox) joinCodeBox.style.display = 'none';
  var heroSub = document.querySelector('.hero__sub');
  if (heroSub) heroSub.textContent = 'Start a live class for your section below, your students join in one tap or with the class code.';
  var heroTitle = document.getElementById('liveHero');
  if (heroTitle) heroTitle.innerHTML = 'Teach live, <em>face to face.</em>';

  var box = document.getElementById('teacherComposer');
  var sel = document.getElementById('startAssign');
  var teaches = (liveUser.teaches || []);
  if (!teaches.length){
    box.classList.add('is-visible');
    sel.innerHTML = '<option value="">No classes assigned to your account</option>';
    sel.disabled = true;
    return;
  }
  sel.disabled = false;
  sel.innerHTML = teaches.map(function(t, i){
    return '<option value="' + i + '">' + esc(t.subject) + ' · ' + esc(t.className) + ' ' + esc(t.section) + '</option>';
  }).join('');
  box.classList.add('is-visible');
}

// Fetch the backend sessions this user can join and render them on top.
// Normalize a class label ("Class 7" / "7") to a bare number string for
// comparison, and a section to an upper-case letter.
function normClass(v){ var m = String(v||'').match(/\d+/); return m ? m[0] : ''; }
function normSec(v){ return String(v||'').trim().toUpperCase(); }

// STRICT: a student may only ever see live classes for their OWN class AND
// section. This is enforced client-side regardless of what the API returns,
// so a Class 7A student never sees another class's live session.
function scopeSessionsToUser(list){
  if (!liveUser || liveUser.role !== 'student') return list; // teacher/parent unchanged
  var myClass = normClass(liveUser.className);
  var mySec = normSec(liveUser.section);
  if (!myClass) return list; // no class on record → don't over-filter
  return list.filter(function(s){
    if (normClass(s.className) !== myClass) return false;
    // If the student has a section, require it to match (when the session has one).
    if (mySec && s.section && normSec(s.section) !== mySec) return false;
    return true;
  });
}

async function loadRealSessions(){
  if (!liveUser || !window.EduAPI || !EduAPI.getToken()) return;
  try {
    realSessions = scopeSessionsToUser(await EduAPI.listLive());
  } catch (e) {
    realSessions = [];
  }
  renderRealSessions();
}

function renderRealSessions(){
  var host = document.getElementById('liveGrid');
  var title = document.getElementById('liveNowTitle');
  // The "Live now" section was removed from the page, bail out quietly if its
  // elements aren't present so this doesn't throw on a null innerHTML.
  if (!host || !title) return;
  if (!realSessions.length){
    host.innerHTML = '';
    title.style.display = 'none';
    return;
  }
  title.style.display = 'block';
  host.innerHTML = realSessions.map(function(s){
    var color = subjColor(s.subject);
    var teacher = (s.teacherId && s.teacherId.name) ? s.teacherId.name : 'Your class';
    var mine = liveUser && liveUser.role === 'teacher';
    var isMeet = s.videoProvider === 'google-meet';
    var actBtn = isMeet
      ? '<button class="btn-join" data-meet-join="' + esc(s.videoRoom||'') + '" type="button">Join Google Meet</button>'
      : '<button class="btn-join" data-real-join="' + s._id + '" type="button">' + (mine ? 'Enter class' : 'Join live') + '</button>';
    return '' +
      '<article class="sess" style="--sa:' + color + '">' +
        '<div class="sess__avatar">' + esc((s.subject||'?').slice(0,2).toUpperCase()) + '</div>' +
        '<div class="sess__body">' +
          '<div class="sess__topic">' + esc(s.title) + '</div>' +
          '<div class="sess__meta"><b>' + esc(teacher) + '</b> · code ' + esc(s.joinCode||'') + '</div>' +
          '<div class="sess__tags">' +
            '<span class="tag tag--subj">' + esc(s.className) + ' · ' + esc(s.section) + ' · ' + esc(s.subject) + '</span>' +
            '<span class="tag tag--live">' + (isMeet ? 'Live on Google Meet' : 'Live now') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="sess__act">' + actBtn + '</div>' +
      '</article>';
  }).join('');

  host.querySelectorAll('[data-real-join]').forEach(function(btn){
    btn.addEventListener('click', function(){ joinRealClass(btn.getAttribute('data-real-join')); });
  });
  host.querySelectorAll('[data-meet-join]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var link = btn.getAttribute('data-meet-join');
      if (link) window.open(link, '_blank', 'noopener');
    });
  });
}

// Wire the "Join with code" box: look the class up by its code, then enter the
// classroom. Eligibility is enforced server-side (same as the normal join).
function wireJoinCode(){
  var input = document.getElementById('joinCodeInput');
  var btn = document.getElementById('joinCodeBtn');
  var msg = document.getElementById('joinCodeMsg');
  if (!input || !btn) return;

  async function submit(){
    var code = (input.value || '').trim().toUpperCase();
    msg.textContent = '';
    if (!code){ msg.textContent = 'Enter a class code first.'; return; }
    btn.disabled = true;
    var orig = btn.textContent;
    btn.textContent = 'Joining…';
    try {
      var res = await EduAPI.joinLiveByCode(code);
      if (res && res.ok && res.session){
        var s = res.session;
        if (s.videoProvider === 'google-meet' && s.videoRoom){
          window.open(s.videoRoom, '_blank', 'noopener');
        } else {
          // Shape the session for joinRealClass (it expects _id + fields).
          joinRealClass(s.id, {
            _id: s.id, title: s.title, className: s.className,
            section: s.section, subject: s.subject,
            teacherId: null
          });
        }
      } else {
        msg.textContent = 'Could not join with that code.';
      }
    } catch (err){
      // Backend gives a clear reason (wrong code / not your class / ended).
      msg.textContent = err.message || 'Could not join with that code.';
    } finally {
      btn.disabled = false;
      btn.textContent = orig;
    }
  }

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', function(e){ if (e.key === 'Enter'){ e.preventDefault(); submit(); } });
}

// Teacher submits the composer → create a backend session → enter as host.
function wireStartForm(){
  var form = document.getElementById('startForm');
  if (!form) return;
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    var msg = document.getElementById('startMsg');
    var title = document.getElementById('startTitle').value.trim();
    var idx = document.getElementById('startAssign').value;
    var assign = (liveUser.teaches || [])[idx];
    var meetLink = document.getElementById('startMeetLink').value.trim();
    if (!title || !assign){ msg.textContent = 'Pick a class and enter a topic.'; return; }
    if (meetLink && !/^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i.test(meetLink)){
      msg.textContent = 'That doesn\'t look like a Google Meet link (expected https://meet.google.com/xxx-xxxx-xxx).';
      return;
    }
    msg.textContent = 'Starting…';
    try {
      var session = await EduAPI.createLive({
        title: title,
        className: assign.className,
        section: assign.section,
        subject: assign.subject,
        meetLink: meetLink || undefined
      });
      msg.textContent = '';
      document.getElementById('startTitle').value = '';
      document.getElementById('startMeetLink').value = '';
      realSessions.unshift(session);
      renderRealSessions();
      if (session.videoProvider === 'google-meet' && session.videoRoom){
        window.open(session.videoRoom, '_blank', 'noopener'); // open Meet directly, skip the in-app classroom
      } else {
        joinRealClass(session._id, session); // enter the classroom immediately
      }
    } catch (err) {
      msg.textContent = err.message || 'Could not start the class.';
    }
  });
}

// Enter a REAL backend session: open the classroom UI and connect LiveKit
// using the actual session id (host publishes, viewer watches).
function joinRealClass(sessionId, known){
  var s = known || realSessions.filter(function(x){ return x._id === sessionId; })[0];
  if (!s) return;
  var isHost = !!(liveUser && liveUser.role === 'teacher');
  var teacher = (s.teacherId && s.teacherId.name) ? s.teacherId.name
    : (isHost && liveUser.name) ? liveUser.name : 'Teacher';

  document.getElementById('browseView').style.display = 'none';
  document.getElementById('reportView').style.display = 'none';
  document.getElementById('classView').style.display = 'block';
  document.getElementById('clsTopic').textContent = s.title;
  document.getElementById('tutorName').textContent = teacher + ' · Teacher';
  document.getElementById('tutorCircle').textContent = initials(teacher);
  // A real class never shows the demo formula board.
  var realBoard = document.getElementById('boardStage');
  if (realBoard) realBoard.style.display = 'none';
  // The teacher runs the class: no attention camera, no raise-hand.
  var hand = document.getElementById('handBtn');
  if (hand) hand.style.display = isHost ? 'none' : '';
  var note = document.getElementById('stageNote');
  if (note) note.textContent = isHost
    ? 'You are live. Students who join with the class code appear here.'
    : 'Your camera is used only for attention monitoring. The video stays on your device.';
  window.scrollTo(0, 0);

  // Real LiveKit connection against the backend session id.
  global_EduLiveConnect(sessionId);

  CLS = {
    session: { topic: s.title, tutor: teacher, subj: (s.subject||'').toLowerCase() },
    backendId: sessionId,
    isHost: (liveUser && liveUser.role === 'teacher'),
    t0: Date.now(), score: 100,
    away:false, awaySince:0, awayCount:0, awayLoss:0,
    idle:false, lastActivity:Date.now(),
    chats:0, hands:0, longestFocus:0, focusStart:Date.now(),
    events:[{ t:0, type:'ok', label:'Joined the class' }],
    timer:setInterval(tick, 1000), chatTimers:[],
    camOn:false, gaze:'unknown', gazeAway:false,
    onScreenSec:0, offScreenSec:0, lookAwayCount:0, camTimer:null, camStream:null
  };
  var consent = document.getElementById('camConsent');
  consent.classList.toggle('is-hidden', CLS.isHost);
  document.getElementById('selfTile').classList.remove('has-cam','cam-on','cam-away');
  // Real classes have no scripted chat, start with an empty, live chat log.
  document.getElementById('chatLog').innerHTML = '';

  // Connect realtime presence + chat for this backend session.
  LiveRT.connect(sessionId);
}

/* ============================================================
   Realtime presence + chat (Socket.IO).
   - Teacher: sees a roster (joined ✓ / waiting ○) and can @tag a student.
   - Tagging a student fires a "called-on" prompt to them.
   - Everyone: real class chat.
   ============================================================ */
var LiveRT = (function(){
  var sock = null;
  var sessionId = null;
  var presentIds = {};   // userId -> true (who's currently in the room)
  var rosterUsers = [];  // teacher's full eligible class
  var pendingTag = null; // { userId, name } a teacher is tagging

  function isTeacher(){ return liveUser && liveUser.role === 'teacher'; }

  function connect(id){
    sessionId = id;
    presentIds = {}; pendingTag = null; rosterUsers = [];
    document.getElementById('chatLog').innerHTML = '';
    setTagPending(null);

    if (!window.io || !window.EduAPI || !EduAPI.getToken()){
      return; // socket.io not loaded or not logged in, chat stays inert
    }
    // Fresh connection per class.
    if (sock){ try { sock.disconnect(); } catch(e){} sock = null; }
    // When API_BASE is an absolute origin (localhost dev), connect straight to
    // it. On the deployed https site API_BASE is the relative '/backend-api' ,
    // passing that to io() would be read as a NAMESPACE on the Vercel origin,
    // not a URL. Connect same-origin instead: vercel.json proxies /socket.io/*
    // to the backend. Vercel rewrites can't carry a WebSocket upgrade, so use
    // long-polling there (the backend is pinned to one instance, so polling is
    // safe); direct connections keep websocket-first.
    var direct = EduAPI.API_BASE.indexOf('http') === 0;
    sock = direct
      ? io(EduAPI.API_BASE, { auth: { token: EduAPI.getToken() }, transports: ['websocket','polling'] })
      : io({ auth: { token: EduAPI.getToken() }, transports: ['polling'] });

    sock.on('connect', function(){ sock.emit('join-session', { sessionId: sessionId }); });
    sock.on('connect_error', function(){ pushSys('Live chat unavailable (connection error).'); });
    sock.on('join-denied', function(d){ pushSys('Could not join chat: ' + (d && d.reason || '')); });
    sock.on('roster', function(d){ (d.present||[]).forEach(markPresent); refreshRoster(); });
    sock.on('participant-joined', function(d){ markPresent(d); refreshRoster(); pushSys((d.name||'Someone') + ' joined'); });
    sock.on('participant-left', function(d){ delete presentIds[d.userId]; refreshRoster(); });
    sock.on('chat-message', renderChat);
    sock.on('called-on', onCalledOn);
    sock.on('session-ended', function(){ pushSys('The teacher ended the class.'); });

    // Teacher: load the full class roster so absent students show too.
    if (isTeacher()){
      document.getElementById('roster').classList.add('is-on');
      EduAPI.liveRoster(sessionId).then(function(r){
        rosterUsers = r.roster || [];
        (r.roster||[]).forEach(function(u){ if (u.present) presentIds[u.userId] = true; });
        refreshRoster();
      }).catch(function(){});
    } else {
      document.getElementById('roster').classList.remove('is-on');
    }
  }

  function markPresent(p){ if (p && p.userId) presentIds[p.userId] = true; }

  function disconnect(){
    if (sock){ try { sock.emit('leave-session', { sessionId: sessionId }); sock.disconnect(); } catch(e){} sock = null; }
    sessionId = null;
    document.getElementById('roster').classList.remove('is-on');
    document.getElementById('calledOn').classList.remove('is-on');
    setTagPending(null);
  }

  /* ---- roster rendering (teacher) ---- */
  function refreshRoster(){
    if (!isTeacher()) return;
    var list = document.getElementById('rosterList');
    var joined = 0;
    list.innerHTML = rosterUsers.map(function(u){
      var here = !!presentIds[u.userId];
      if (here) joined++;
      return '<div class="roster__row' + (here ? ' is-present' : '') + '" data-uid="' + u.userId + '">' +
        '<span class="roster__dot"></span>' +
        '<span class="roster__name">' + esc(u.name) + '</span>' +
        '<span class="roster__state">' + (here ? 'In class' : 'Waiting') + '</span>' +
        '<button class="roster__tag" type="button" data-tag-uid="' + u.userId + '" data-tag-name="' + esc(u.name) + '">Tag</button>' +
        '</div>';
    }).join('');
    document.getElementById('rosterCount').textContent = joined + ' / ' + rosterUsers.length + ' joined';

    list.querySelectorAll('[data-tag-uid]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        setTagPending({ userId: btn.getAttribute('data-tag-uid'), name: btn.getAttribute('data-tag-name') });
        document.getElementById('chatInput').focus();
      });
    });
  }

  /* ---- chat ---- */
  function pushSys(text){
    var log = document.getElementById('chatLog');
    var div = document.createElement('div');
    div.className = 'msg'; div.style.opacity = '.7';
    div.innerHTML = '<span class="bub" style="font-size:12px">' + esc(text) + '</span>';
    log.appendChild(div); log.scrollTop = log.scrollHeight;
  }
  function renderChat(m){
    var log = document.getElementById('chatLog');
    var me = liveUser && m.userId === liveUser.id;
    var tutor = m.role === 'teacher';
    var tagged = !!m.tagUserId;
    var div = document.createElement('div');
    div.className = 'msg' + (tutor ? ' msg--tutor' : '') + (me ? ' msg--me' : '') + (tagged ? ' msg--tagged' : '');
    var tagchip = (tagged && m.tagName) ? '<span class="tagchip">@' + esc(m.tagName) + '</span>' : '';
    var who = me ? 'You' : (m.name || 'Someone');
    div.innerHTML = '<span class="who">' + esc(who) + '</span><span class="bub">' + tagchip + esc(m.text) + '</span>';
    log.appendChild(div); log.scrollTop = log.scrollHeight;
  }

  function setTagPending(tag){
    pendingTag = tag;
    var bar = document.getElementById('chatTagged');
    if (tag){
      document.getElementById('chatTaggedName').textContent = '@' + tag.name;
      bar.classList.add('is-on');
      document.getElementById('chatInput').placeholder = 'Message for ' + tag.name + '…';
    } else {
      bar.classList.remove('is-on');
      document.getElementById('chatInput').placeholder = 'Ask a doubt...';
    }
  }

  // The tagged student gets a "called on" prompt.
  function onCalledOn(d){
    if (!liveUser || d.tagUserId !== liveUser.id) return;
    document.getElementById('calledByName').textContent = d.byName || 'Your teacher';
    document.getElementById('calledText').textContent = d.text ? (': “' + d.text + '”') : '';
    document.getElementById('calledOn').classList.add('is-on');
    if (typeof CLS === 'object' && CLS){ CLS.score = Math.min(100, CLS.score + 2); logEvent('warn', 'Called on by the teacher'); }
  }

  function send(text){
    if (!sock || !sessionId || !text.trim()) return false;
    sock.emit('chat-message', {
      sessionId: sessionId,
      text: text.trim(),
      tagUserId: pendingTag ? pendingTag.userId : null,
      tagName: pendingTag ? pendingTag.name : null
    });
    setTagPending(null);
    return true;
  }

  function active(){ return !!(sock && sessionId); }

  document.getElementById('chatTaggedClear').addEventListener('click', function(){ setTagPending(null); });
  document.getElementById('calledOnClose').addEventListener('click', function(){
    document.getElementById('calledOn').classList.remove('is-on');
  });

  return { connect: connect, disconnect: disconnect, send: send, active: active };
})();
window.LiveRT = LiveRT; // expose so the chat/leave handlers can reach it

/* boot */
// A logged-in user must never see the fake demo sessions/bookings/reports,
// not even briefly, check localStorage directly (synchronous, available
// immediately) rather than waiting for api.js to load before hiding them,
// which left a flash-of-fake-content window on slower connections.
// Live classes are shown ONLY from the real backend (loadRealSessions →
// #liveGrid). The old demo tutors/sessions/reports are never rendered, this
// page is auth-gated (role-guard sends logged-out visitors to login), and a
// logged-in user only ever sees their own class's real sessions. No fake data.
// (Navbar CTA + role-based nav are handled by role-guard.js.)

/* real backend live classes, run AFTER api.js has loaded. The inline boot
   executes before the <script src="api.js"> tags below it, so EduAPI may not
   exist yet; wait for it (and the DOM) before wiring the backend features. */
function bootRealLive(){
  if (!window.EduAPI){ setTimeout(bootRealLive, 40); return; } // api.js not loaded yet
  hideDemoContentForLoggedInUser();
  setupTeacherComposer();
  wireStartForm();
  wireJoinCode();
  loadRealSessions();
}
if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', bootRealLive);
} else {
  bootRealLive();
}

})();

}
