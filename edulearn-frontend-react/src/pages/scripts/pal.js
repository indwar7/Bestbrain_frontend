/* Lifted verbatim from edulearn-frontend/pal.html — do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {

(function(){
'use strict';

/* ============================================================
   DATA — compact curriculum index + mini knowledge base
   ============================================================ */
var SUBJECTS = {
  maths:   { en:'Mathematics' },
  science: { en:'Science' },
  social:  { en:'Social Science' },
  english: { en:'English' },
  hindi:   { en:'Hindi' }
};

var CURR = [];
function addC(cls, subj, names){
  names.forEach(function(n){ CURR.push({ cls: cls, subj: subj, name: n }); });
}
addC(6,'maths',['Knowing Our Numbers','Whole Numbers','Playing with Numbers','Basic Geometrical Ideas','Understanding Elementary Shapes','Integers','Fractions','Decimals','Data Handling','Mensuration']);
addC(6,'science',['Food: Where Does It Come From?','Components of Food','Fibre to Fabric','Sorting Materials into Groups','Separation of Substances','Changes Around Us','Getting to Know Plants','Body Movements','The Living Organisms and Their Surroundings','Light, Shadows and Reflections']);
addC(6,'social',['What, Where, How and When?','On the Trail of the Earliest People','From Gathering to Growing Food','In the Earliest Cities','Kingdoms, Kings and an Early Republic','The Earth in the Solar System','Globe: Latitudes and Longitudes','Motions of the Earth','Understanding Diversity']);
addC(7,'maths',['Integers','Fractions and Decimals','Data Handling','Simple Equations','Lines and Angles','The Triangle and its Properties','Congruence of Triangles','Comparing Quantities','Rational Numbers','Perimeter and Area']);
addC(7,'science',['Nutrition in Plants','Nutrition in Animals','Heat','Acids, Bases and Salts','Physical and Chemical Changes','Respiration in Organisms','Transportation in Animals and Plants','Electric Current and its Effects','Light','Motion and Time']);
addC(7,'social',['Tracing Changes Through a Thousand Years','New Kings and Kingdoms','The Delhi Sultans','The Mughal Empire','Rulers and Buildings','Environment','Inside Our Earth','On Equality','Markets Around Us']);
addC(8,'maths',['Rational Numbers','Linear Equations in One Variable','Understanding Quadrilaterals','Data Handling','Squares and Square Roots','Cubes and Cube Roots','Comparing Quantities','Algebraic Expressions and Identities','Mensuration','Factorisation']);
addC(8,'science',['Crop Production and Management','Microorganisms: Friend and Foe','Synthetic Fibres and Plastics','Materials: Metals and Non-Metals','Coal and Petroleum','Combustion and Flame','Cell — Structure and Functions','Force and Pressure','Friction','Sound']);
addC(8,'social',['How, When and Where','From Trade to Territory','Ruling the Countryside','Tribals, Dikus and the Vision of a Golden Age','When People Rebel: 1857 and After','Resources','Land, Soil, Water, Natural Vegetation','The Indian Constitution','Judiciary']);
addC(9,'maths',['Number Systems','Polynomials','Coordinate Geometry','Linear Equations in Two Variables','Introduction to Euclid’s Geometry','Lines and Angles','Triangles','Quadrilaterals','Heron’s Formula','Statistics']);
addC(9,'science',['Matter in Our Surroundings','Is Matter Around Us Pure?','Atoms and Molecules','Structure of the Atom','The Fundamental Unit of Life','Tissues','Motion','Force and Laws of Motion','Gravitation','Sound']);
addC(9,'social',['The French Revolution','Socialism in Europe and the Russian Revolution','Nazism and the Rise of Hitler','Forest Society and Colonialism','India — Size and Location','Physical Features of India','What is Democracy? Why Democracy?','Electoral Politics','The Story of Village Palampur']);

/* hand-written study notes for popular chapters */
var KB = {
  'polynomials': {
    notes:['A **polynomial** is an expression with whole-number powers of x — like x³ + 2x − 7.','**Degree** = highest power. Degree 1: linear, 2: quadratic, 3: cubic.','A **zero** of p(x) is the value where p(x) = 0. A degree-n polynomial has at most n zeroes.','**Remainder theorem:** dividing p(x) by (x − a) leaves remainder p(a).','**Factor theorem:** (x − a) is a factor exactly when p(a) = 0.'],
    qa:'Students most often mix up the two theorems. Remember: the factor theorem is just the remainder theorem when the remainder is **zero**.'
  },
  'number systems': {
    notes:['**Rational** numbers can be written p/q (q ≠ 0); their decimals terminate or repeat.','**Irrational** numbers (√2, π) have decimals that never terminate or repeat.','Every point on the number line is a **real** number.','To rationalise 1/(√a − b), multiply by (√a + b)/(√a + b).','Laws of exponents work for rational powers too: a^m × a^n = a^(m+n).'],
    qa:'Quick test: 0.272727... repeats — rational. 0.101101110... never repeats a block — irrational.'
  },
  'motion': {
    notes:['**Distance** is total path (scalar); **displacement** is shortest path (vector).','**Speed** = distance/time. **Velocity** = displacement/time.','**Acceleration** a = (v − u)/t.','Equations of motion: v = u + at, s = ut + ½at², v² = u² + 2as.','On a v–t graph, slope = acceleration and **area under the graph = displacement**.'],
    qa:'If a body returns to its start point, displacement is zero but distance is not — the classic trick question.'
  },
  'force and laws of motion': {
    notes:['**First law:** objects resist change in motion (inertia).','**Second law:** F = ma — force is rate of change of momentum.','**Third law:** action and reaction are equal, opposite, and act on **different bodies**.','**Momentum** p = mv; total momentum is conserved in collisions.','Mass measures inertia — more mass, harder to change motion.'],
    qa:'Action-reaction pairs never cancel because they act on different objects — that is why the gun recoils while the bullet flies.'
  },
  'heat': {
    notes:['Heat flows from **hotter to colder** objects until temperatures equalise.','Lab thermometer: −10°C to 110°C; clinical: 35°C to 42°C.','**Conduction** (solids), **convection** (liquids/gases), **radiation** (no medium needed).','Dark surfaces absorb and emit more radiation than shiny ones.','Wool keeps us warm by trapping air — a poor conductor.'],
    qa:'Sea breeze is convection: land heats faster by day, hot air rises, cool sea air flows in. At night it reverses.'
  },
  'the french revolution': {
    notes:['Began in **1789**; France had three **estates**, and only the third paid taxes.','Causes: empty treasury, rising bread prices, Enlightenment ideas (Rousseau, Voltaire).','**14 July 1789** — storming of the Bastille became the symbol.','1791 constitution limited the king; 1792 France became a **republic**.','Legacy: **liberty, equality, fraternity** spread worldwide — including to colonial India.'],
    qa:'Why it matters: the ideas of equality and citizenship from 1789 shaped constitutions everywhere, including India’s.'
  },
  'nutrition in plants': {
    notes:['Plants are **autotrophs** — they make food by **photosynthesis** in leaves.','Needs: sunlight, chlorophyll, CO₂, water. Products: glucose and O₂.','**Stomata** are tiny pores for gas exchange.','**Cuscuta** is a parasite; pitcher plant is insectivorous.','Fungi are saprotrophs — they feed on dead matter.'],
    qa:'Equation to remember: CO₂ + H₂O —(sunlight, chlorophyll)→ glucose + O₂.'
  },
  'fractions': {
    notes:['A fraction is a part of a whole: numerator/denominator.','**Like** fractions share a denominator; compare unlike ones using the LCM.','Multiply: tops × tops, bottoms × bottoms. Divide: multiply by the **reciprocal**.','To add or subtract, convert to like fractions first.','Mixed ↔ improper: 2¾ = 11/4.'],
    qa:'Half of one-third is 1/6 — and one-third of a half is also 1/6. Order doesn’t matter in multiplication.'
  },
  'gravitation': {
    notes:['Every mass attracts every other: F = G m₁m₂ / d².','g on Earth ≈ 9.8 m/s²; all objects fall equally fast without air resistance.','**Mass** is constant; **weight** = mg changes with location.','Moon’s g ≈ 1/6th of Earth’s.','Buoyancy and Archimedes’ principle are part of this chapter too.'],
    qa:'A feather and a stone fall together in vacuum — on the Moon they land at the same time.'
  },
  'acids, bases and salts': {
    notes:['Acids taste sour and turn blue litmus **red**; bases turn red litmus **blue**.','Natural indicators: litmus, turmeric, china rose.','Acid + base → salt + water (**neutralisation**), releasing heat.','Antacids neutralise excess stomach acid.','Acidic soil is treated with quick lime (a base).'],
    qa:'Turmeric stays yellow in acid but turns red in base — that is why soap on a haldi stain looks reddish.'
  },
  'electric current and its effects': {
    notes:['Current needs a closed **circuit**: cell → wire → device → back.','Learn the circuit symbols: cell, battery, switch, bulb.','**Heating effect** powers heaters; fuses melt to protect circuits.','**Magnetic effect:** a current-carrying coil behaves like a magnet.','Electromagnets drive bells, cranes and motors.'],
    qa:'A fuse is a thin wire that melts first when current is too high — it sacrifices itself to save the circuit.'
  },
  'what is democracy? why democracy?': {
    notes:['**Democracy** = rule by the people through free and fair elections.','One person, one vote, one value.','Final decision-making power rests with elected representatives.','Needs more than elections: rule of law, rights, independent institutions.','It resolves differences peacefully and lets citizens correct mistakes.'],
    qa:'Elections alone don’t make a democracy — they must be free, fair, and able to change who rules.'
  }
};

/* small quiz pool per subject */
var QUIZ = {
  maths: [
    { q:'What is the degree of x³ + 2x² − 7?', o:['1','2','3','7'], a:2 },
    { q:'7/8 as a decimal is…', o:['0.78','0.875','0.785','0.825'], a:1 },
    { q:'(√3 + √2)(√3 − √2) = ?', o:['5','√6','1','−1'], a:2 },
    { q:'If 3x = 21, x = ?', o:['6','7','8','9'], a:1 }
  ],
  science: [
    { q:'SI unit of force?', o:['joule','watt','newton','pascal'], a:2 },
    { q:'Slope of a distance–time graph gives…', o:['acceleration','speed','displacement','force'], a:1 },
    { q:'Which gas do plants take in for photosynthesis?', o:['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'], a:2 },
    { q:'Litmus turns red in…', o:['acid','base','salt','distilled water'], a:0 }
  ],
  social: [
    { q:'The French Revolution began in…', o:['1789','1798','1857','1776'], a:0 },
    { q:'Who led the Russian Revolution of 1917?', o:['Stalin','Lenin','Trotsky','Kerensky'], a:1 },
    { q:'Democracy literally means rule by the…', o:['king','army','people','court'], a:2 },
    { q:'The Indian Constitution came into force on…', o:['15 Aug 1947','26 Jan 1950','26 Nov 1949','2 Oct 1948'], a:1 }
  ]
};

/* simulated class roster for teacher mode */
var ROSTER = [
  { n:'Aarav P.',  avg:82, weak:'Heron’s Formula' },
  { n:'Diya S.',   avg:74, weak:'Gravitation' },
  { n:'Ishaan K.', avg:68, weak:'Polynomials' },
  { n:'Meera R.',  avg:88, weak:'—' },
  { n:'Kabir J.',  avg:51, weak:'Number Systems' },
  { n:'Ananya T.', avg:63, weak:'Force and Laws of Motion' },
  { n:'Riya G.',   avg:77, weak:'Motion' }
];

/* ============================================================
   STORAGE
   ============================================================ */
// Determine the authenticated user's role (or fallback to guest/demo).
// PAL is reachable both logged-in (from the dashboard) and logged-out (from
// the landing page, as a try-before-signup demo) — so this can't hard-require
// auth. But it must not trust a stale 'edulearn_user' with no matching token
// (e.g. left over from an interrupted session): that would misattribute chat
// history to an identity that isn't actually logged in. (api.js loads later
// on this page, so read localStorage directly rather than via EduAPI.)
var _authUser = null;
var _authToken = '';
try { _authToken = localStorage.getItem('edulearn_token') || ''; } catch(e) {}
if (_authToken) {
  try { _authUser = JSON.parse(localStorage.getItem('edulearn_user') || 'null'); } catch(e) { _authUser = null; }
} else {
  try { localStorage.removeItem('edulearn_user'); } catch(e) {}
}
var AUTH_ROLE = (_authUser && _authUser.role) || null;

// Chat store is namespaced PER USER so one account's chats are never shown
// to another account on the same device. (The old shared key is retired.)
var LS_KEY = 'edulearn_pal_chats_' + ((_authUser && _authUser.id) || 'guest');
try { localStorage.removeItem('edulearn_pal_chats'); } catch(e) {}
// The backend session id lives on each chat thread (`c.backendSessionId`), not
// in a page-level variable — see askBackend().

function loadStore(){
  try{
    var d = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if(!d || typeof d !== 'object') d = {};
    if(!Array.isArray(d.chats)) d.chats = [];
    // Always boot into the authenticated user's role when logged in
    if(!d.role || AUTH_ROLE) d.role = AUTH_ROLE || 'student';
    return d;
  }catch(e){ return { chats:[], role: AUTH_ROLE || 'student', activeId:null }; }
}
function save(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(store)); }catch(e){} }
var store = loadStore();

function readLS(key){
  try{ return JSON.parse(localStorage.getItem(key) || 'null'); }catch(e){ return null; }
}

/* ============================================================
   HELPERS
   ============================================================ */
function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
/* markdown-lite: **bold**, "- " bullets, [label](url) links */
function md(s){
  var out = [], lines = String(s).split('\n'), inUl = false;
  lines.forEach(function(ln){
    var safe = esc(ln)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.+?)\]\((learn\.html[^)]*)\)/g, '<a href="$2">$1</a>');
    if(/^- /.test(ln)){
      if(!inUl){ out.push('<ul>'); inUl = true; }
      out.push('<li>' + safe.slice(2) + '</li>');
    } else {
      if(inUl){ out.push('</ul>'); inUl = false; }
      if(ln.trim()) out.push('<p>' + safe + '</p>');
    }
  });
  if(inUl) out.push('</ul>');
  return out.join('');
}
function norm(s){ return s.toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim(); }

function findChapter(text){
  var t = norm(text);
  if(!t) return null;
  var best = null, bestScore = 0;
  CURR.forEach(function(c){
    var name = norm(c.name);
    if(t.indexOf(name) !== -1){
      var s = name.length + 100;
      if(s > bestScore){ bestScore = s; best = c; }
      return;
    }
    var words = name.split(' ').filter(function(w){ return w.length > 3; });
    var hit = 0;
    words.forEach(function(w){ if(t.indexOf(w) !== -1) hit++; });
    if(words.length && hit >= Math.max(1, Math.ceil(words.length * 0.6))){
      var score = hit / words.length * name.length;
      if(score > bestScore){ bestScore = score; best = c; }
    }
  });
  return best;
}
function learnLink(c){
  return 'learn.html?class=' + c.cls + '&subject=' + c.subj;
}

/* ============================================================
   ENGINE — role-aware responses
   ============================================================ */
var lastChapter = null;

function studentReply(text){
  var t = norm(text);
  var ch = findChapter(text) || (/\b(it|this|that|isko|iska|usse)\b/.test(t) ? lastChapter : null);
  if(ch) lastChapter = ch;

  var wantQuiz = /\b(quiz|mcq|test me|questions?|practice|puchho|pucho)\b/.test(t);
  var wantNotes = /\b(notes?|summar|revis|key points?|explain|samjha|kya hai|what is|batao|easy words)\b/.test(t);

  if(/^(hi|hello|hey|namaste|hii+|yo)\b/.test(t) && t.length < 18){
    return { text:'Namaste! I’m **PAL**, your study buddy.\nAsk me any chapter — like **"summarise Polynomials"**, **"explain Heat"** or **"quiz me on Motion"**.' };
  }
  if(/thank/.test(t)){
    return { text:'Anytime. One chapter a day beats ten before the exam — pick tomorrow’s now?' };
  }
  if(/\b(what should i study|kya padhu|study plan|today)\b/.test(t)){
    var state = readLS('edulearn_state');
    var line = 'Here’s a smart plan for today:\n- **20 min** — continue your most recent chapter\n- **10 min** — one practice set on your weakest topic\n- **2 min** — this hour’s Arena drop for streak points';
    if(state && state.chapters){
      var open = Object.keys(state.chapters).filter(function(k){ return !state.chapters[k].mastered; });
      if(open.length) line += '\n\nYou have **' + open.length + ' chapters in progress** — finishing beats starting.';
    }
    return { text: line, chips:['Quiz me on Polynomials','Summarise Motion','Explain the French Revolution'] };
  }

  if(wantQuiz){
    var subj = ch ? (QUIZ[ch.subj] ? ch.subj : 'maths')
      : (/math/.test(t) ? 'maths' : /science|physic|chem|bio/.test(t) ? 'science' : /history|civic|geo|social|democra|revolution/.test(t) ? 'social' : 'maths');
    var pool = QUIZ[subj] || QUIZ.maths;
    var q = pool[Math.floor(Math.random() * pool.length)];
    return {
      text:'Quick one' + (ch ? ' from **' + ch.name + '** territory' : '') + ' — 30 seconds, no peeking:',
      quiz: q,
      chips: ch ? ['Notes on ' + ch.name, 'Another quiz'] : ['Another quiz','Summarise Number Systems']
    };
  }

  if(ch){
    var key = norm(ch.name);
    var kb = KB[key] || KB[key.replace(/^the /,'')];
    var head = '**' + ch.name + '** — Class ' + ch.cls + ' ' + SUBJECTS[ch.subj].en;
    if(kb){
      var body = head + '\n' + kb.notes.map(function(n){ return '- ' + n; }).join('\n') +
        '\n\n' + kb.qa + '\n\n[Open the full lesson in Learn](' + learnLink(ch) + ')';
      return { text: body, chips:['Quiz me on ' + ch.name, 'Explain the hardest part', 'What should I study today?'] };
    }
    var generic = head +
      '\nHere’s how I’d attack this chapter:\n- **Watch** the animated lecture first — 1.25× speed is fine\n- **Write** every bold term and formula in your own words\n- **Practice** 10 questions; star the ones you guess on\n- **Re-test** yourself after a day, not the same evening' +
      '\n\n[Open it in Learn](' + learnLink(ch) + ') and ask me for a quiz when ready.';
    return { text: generic, chips:['Quiz me on ' + ch.name, 'What should I study today?'] };
  }

  if(wantNotes){
    return { text:'Tell me the chapter and I’ll do the rest — for example **"notes on Gravitation"** or **"summarise The Mughal Empire"**. I cover Classes 6–9, all five subjects.' };
  }
  return { text:'I’m built for your syllabus — try naming a chapter:\n- **"Summarise Polynomials"**\n- **"Explain Heat in easy words"**\n- **"Quiz me on the French Revolution"**\n\nOr ask **"what should I study today?"** and I’ll plan it.' };
}

function parentReply(text){
  var t = norm(text);
  var state = readLS('edulearn_state');
  var live = readLS('edulearn_live');
  var arena = readLS('edulearn_arena');
  var mock = readLS('edulearn_mock');

  if(/\b(attention|attentive|focus|live class|report)\b/.test(t)){
    var reps = (live && live.reports) || [];
    if(!reps.length) return { text:'No live-class reports yet. After every live session, PAL sends you an **attentiveness report** — how long they stayed focused, when they drifted, and what they asked. It will appear here automatically.', chips:['How is overall progress?'] };
    var r = reps[reps.length - 1];
    var camLine = (typeof r.onScreenPct === 'number')
      ? '\n- **Camera attention: eyes on screen ' + r.onScreenPct + '% of the class**, looked away ' + (r.lookAwayCount || 0) + ' times'
      : '\n- Looked away **' + (r.awayCount || 0) + ' times** (tracked by tab focus)';
    return { text:'Latest live class — **' + r.topic + '**:\n- Attention score: **' + r.score + '/100**' + camLine + '\n- Asked **' + (r.chats || 0) + ' doubts** in chat, attended ' + r.duration +
      '\n\n' + (r.score >= 80 ? 'Excellent focus — worth a shabashi today.' : r.score >= 50 ? 'Decent focus with some drift — a quieter study corner could help.' : 'Focus dropped a lot — try shorter sessions, phone in another room.') +
      (r.camUsed ? '\n\nThis report used live **camera monitoring** — the video never left the device, only the score was saved.' : ''),
      chips:['How is overall progress?','Any weak subjects?'] };
  }
  if(/\b(weak|problem|struggl|kamzor|improve)\b/.test(t)){
    if(mock && mock.attempts && mock.attempts.length){
      var last = mock.attempts[mock.attempts.length - 1];
      return { text:'In the latest adaptive mock (**' + last.test + '**), mastery was **' + last.mastery + '%** — level: **' + last.level + '**.\n\n' +
        (last.mastery > 75 ? 'No red flags. Nudge them toward the harder practice sets.' : last.mastery >= 40 ? 'The base is fine; difficult questions are where marks leak. One practice session a day for a week should move this.' : 'The test stepped back to basics — that’s PAL doing its job. Daily 20-minute bridging practice will rebuild the foundation quietly. No scolding needed — the app never labels them.'),
        chips:['Show attentiveness report','How much time this week?'] };
    }
    return { text:'No mock-test attempts yet. Ask them to take one adaptive test in **Tests** — I’ll then tell you exactly which topics need help, in plain words.', chips:['How is overall progress?'] };
  }
  if(/\b(time|kitna|screen|hours|week)\b/.test(t)){
    var mins = (state && state.minutes) || [];
    var total = mins.reduce(function(a,b){ return a + b; }, 0);
    return { text:'This week: about **' + Math.floor(total/60) + ' hours ' + (total % 60) + ' minutes** of learning across ' + mins.length + ' days.\n\nDaily rhythm matters more than totals — 30 focused minutes daily beats a 4-hour Sunday.', chips:['Any weak subjects?','How is overall progress?'] };
  }
  var done = 0, doing = 0;
  if(state && state.chapters){
    Object.keys(state.chapters).forEach(function(k){
      if(state.chapters[k].mastered) done++; else doing++;
    });
  }
  var pts = (arena && arena.points) || 0;
  var streak = (arena && arena.streak) || 0;
  var liveCount = (live && live.reports && live.reports.length) || 0;
  return { text:'Here’s the honest picture:\n- **' + done + ' chapters mastered**, ' + doing + ' in progress\n- Arena: **' + pts + ' points**' + (streak ? ', on a ' + streak + '-hour streak' : '') +
    '\n- ' + (liveCount ? liveCount + ' live class' + (liveCount > 1 ? 'es' : '') + ' attended, attentiveness tracked each time' : 'No live classes attended yet') +
    '\n\nAsk **"any weak subjects?"** or **"show attentiveness report"** for details.',
    chips:['Any weak subjects?','Show attentiveness report','How much time this week?'] };
}

function teacherReply(text){
  var t = norm(text);
  var ch = findChapter(text);
  if(ch) lastChapter = ch;

  if(/\b(worksheet|paper|assignment|generate|banao|question)\b/.test(t)){
    var subj = ch ? (QUIZ[ch.subj] ? ch.subj : 'maths') : 'maths';
    var pool = (QUIZ[subj] || QUIZ.maths).slice(0, 3);
    var ws = '**Worksheet' + (ch ? ' — ' + ch.name : '') + '** (10 marks, 15 minutes)\n' +
      pool.map(function(q, i){ return '- Q' + (i+1) + '. ' + q.q + '  (a) ' + q.o[0] + '  (b) ' + q.o[1] + '  (c) ' + q.o[2] + '  (d) ' + q.o[3]; }).join('\n') +
      '\n- Q4. Define the key term of the lesson in one line.\n- Q5. Application: one real-life example in three sentences.' +
      '\n\n**Answer key:** ' + pool.map(function(q, i){ return 'Q' + (i+1) + ' (' + 'abcd'[q.a] + ')'; }).join(' · ') +
      '\n\nWant a tougher set or a Hindi-medium version?';
    return { text: ws, chips:['Tougher set', ch ? 'Remedial plan for ' + ch.name : 'Who is struggling?', 'Class average?'] };
  }
  if(/\b(weak|struggl|behind|remedial)\b/.test(t)){
    var weak = ROSTER.filter(function(r){ return r.avg < 70; });
    return { text:'**' + weak.length + ' of ' + ROSTER.length + ' students** are below 70% this month (demo roster):\n' +
      weak.map(function(r){ return '- **' + r.n + '** — ' + r.avg + '%, weakest in ' + r.weak; }).join('\n') +
      '\n\nSuggested move: assign PAL bridging practice on their weak chapters — it steps back to earlier grades privately, so nobody feels singled out.',
      chips:['Generate worksheet on Polynomials','Class average?'] };
  }
  if(/\b(average|class|performance|overall|analytics)\b/.test(t)){
    var avg = Math.round(ROSTER.reduce(function(a, r){ return a + r.avg; }, 0) / ROSTER.length);
    var top = ROSTER.slice().sort(function(a,b){ return b.avg - a.avg; })[0];
    return { text:'Class snapshot (demo roster):\n- Average mastery: **' + avg + '%**\n- Top performer: **' + top.n + '** at ' + top.avg + '%\n- Most common weak topics: **Polynomials, Number Systems**\n\nI can generate a worksheet, list struggling students, or draft a remedial plan.',
      chips:['Who is struggling?','Generate worksheet on Number Systems'] };
  }
  return { text:'Teacher mode at your service. I can:\n- **Generate worksheets** — "worksheet on Motion" (answer key included)\n- **Spot struggling students** — "who is weak this month?"\n- **Class analytics** — "class average?"\n- **Remedial plans** using PAL’s quiet grade-bridging',
    chips:['Class average?','Who is struggling?','Generate worksheet on Polynomials'] };
}

function reply(text){
  if(store.role === 'parent') return parentReply(text);
  if(store.role === 'teacher') return teacherReply(text);
  return studentReply(text);
}

/* ============================================================
   CHAT STATE + RENDERING
   ============================================================ */
var threadInner = document.getElementById('threadInner');
var thread = document.getElementById('thread');
var input = document.getElementById('input');
var sendBtn = document.getElementById('sendBtn');
var busy = false;

function activeChat(){
  var c = null;
  store.chats.forEach(function(x){ if(x.id === store.activeId) c = x; });
  return c;
}
function newChat(){
  var c = { id:'c' + Date.now(), role: store.role, title:'New chat', msgs:[] };
  store.chats.unshift(c);
  store.activeId = c.id;
  save();
  renderChatList(); renderThread();
}
function renderChatList(){
  var host = document.getElementById('chatList');
  var colors = { student:'var(--teal)', parent:'var(--amber)', teacher:'var(--peri)' };
  var html = '';
  store.chats.slice(0, 30).forEach(function(c){
    html += '<button class="chatitem' + (c.id === store.activeId ? ' is-on' : '') + '" data-id="' + c.id + '" type="button">' +
      '<span class="rb" style="background:' + (colors[c.role] || 'var(--teal)') + '"></span>' +
      '<span class="t">' + esc(c.title) + '</span></button>';
  });
  host.innerHTML = html || '<p style="font-size:12.5px;color:var(--muted);padding:4px 6px">No chats yet.</p>';
  host.querySelectorAll('.chatitem').forEach(function(b){
    b.addEventListener('click', function(){
      store.activeId = b.getAttribute('data-id');
      var c = activeChat();
      if(c) setRole(c.role, true);
      save(); renderChatList(); renderThread();
      document.getElementById('sidebar').classList.remove('is-open');
    });
  });
}

var ROLE_META = {
  student: { badge:'Student mode', color:'var(--teal)', ph:'Ask a doubt — "explain Polynomials in easy words"',
    welcome:'Stuck on a chapter? <em>Ask me.</em>',
    sub:'Summaries, easy explanations and quick quizzes for Classes 6–9 — in English ya Hinglish.',
    starters:[['Summarise','Summarise Polynomials for me'],['Explain','Explain the French Revolution in easy words'],['Quiz','Quiz me on Motion'],['Plan','What should I study today?']] },
  parent: { badge:'Parent mode', color:'var(--amber)', ph:'Ask about your child — "how is she doing in Maths?"',
    welcome:'Know exactly how your <em>child is doing.</em>',
    sub:'Progress, weak subjects, study time and live-class attentiveness — explained in plain words, not charts.',
    starters:[['Progress','How is my child doing overall?'],['Focus','Show me the attentiveness report'],['Weak areas','Any weak subjects I should know about?'],['Time','How much did they study this week?']] },
  teacher: { badge:'Teacher mode', color:'var(--peri)', ph:'Ask for your class — "generate a worksheet on Motion"',
    welcome:'Your class, <em>one question away.</em>',
    sub:'Worksheets with answer keys, struggling-student lists and remedial plans — generated in seconds.',
    starters:[['Worksheet','Generate a worksheet on Polynomials'],['Students','Who is struggling this month?'],['Analytics','What is the class average?'],['Remedial','Draft a remedial plan for Number Systems']] }
};

function setRole(role, skipNew){
  store.role = role;
  document.querySelectorAll('.role').forEach(function(b){
    b.classList.toggle('is-on', b.getAttribute('data-role') === role);
  });
  var meta = ROLE_META[role];
  var badge = document.getElementById('roleBadge');
  badge.textContent = meta.badge;
  badge.style.background = meta.color;
  input.placeholder = meta.ph;
  save();
  if(!skipNew){
    var c = activeChat();
    if(c && c.msgs.length === 0){ c.role = role; save(); renderChatList(); renderThread(); }
    else newChat();
  }
}

function welcomeHTML(){
  var meta = ROLE_META[store.role];
  var starters = meta.starters.map(function(s){
    return '<button class="starter" data-q="' + esc(s[1]) + '" type="button"><span class="mono">' + s[0] + '</span>' + esc(s[1]) + '</button>';
  }).join('');
  return '<div class="welcome">' +
    '<svg class="tokky" width="76" height="76" viewBox="0 0 100 100" aria-hidden="true">' +
      '<circle cx="50" cy="9" r="4" fill="#3DE8C5"/>' +
      '<line x1="50" y1="21" x2="50" y2="12" stroke="#7C9BFF" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="50" cy="56" r="34" fill="#121C30" stroke="url(#auroraGrad)" stroke-width="2.5"/>' +
      '<rect class="blink blink-l" x="36" y="44" width="8" height="14" rx="4" fill="#F2EDE3"/>' +
      '<rect class="blink blink-r" x="56" y="44" width="8" height="14" rx="4" fill="#F2EDE3"/>' +
      '<path d="M42 67 q8 7 16 0" fill="none" stroke="#F2EDE3" stroke-width="2.5" stroke-linecap="round"/>' +
    '</svg>' +
    '<h2>' + meta.welcome + '</h2><p>' + meta.sub + '</p>' +
    '<div class="starters">' + starters + '</div></div>';
}

var PAL_AV = '<svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="#121C30" stroke="url(#auroraGrad)" stroke-width="4"/><rect x="35" y="34" width="9" height="17" rx="4.5" fill="#F2EDE3"/><rect x="56" y="34" width="9" height="17" rx="4.5" fill="#F2EDE3"/><path d="M38 64 q12 9 24 0" fill="none" stroke="#F2EDE3" stroke-width="3.5" stroke-linecap="round"/></svg>';

function msgHTML(m){
  if(m.who === 'user'){
    return '<div class="msg msg--user"><span class="av av--user">You</span><div class="bubble">' + md(m.text) + '</div></div>';
  }
  return '<div class="msg msg--pal"><span class="av av--pal">' + PAL_AV + '</span><div class="bubble">' +
    md(m.text) + (m.quiz ? quizHTML(m.quiz, m.quizDone) : '') + '</div></div>';
}
function quizHTML(q, done){
  var opts = q.o.map(function(o, i){
    var cls = '';
    if(done){
      if(i === q.a) cls = ' ok';
      else if(done.picked === i) cls = ' no';
    }
    return '<button class="qz__opt' + cls + '" data-i="' + i + '" type="button"' + (done ? ' disabled' : '') + '>' +
      '<span class="l">' + 'ABCD'[i] + '</span><span>' + esc(o) + '</span></button>';
  }).join('');
  var verdict = done ? (done.picked === q.a ? '<span style="color:var(--teal)">Correct — sharp.</span>' : '<span style="color:var(--rose)">Not quite — the answer is ' + 'ABCD'[q.a] + '.</span>') : '';
  return '<div class="qz"><div class="qz__q">' + esc(q.q) + '</div><div class="qz__opts">' + opts + '</div><div class="qz__verdict">' + verdict + '</div></div>';
}
function chipsHTML(chips){
  if(!chips || !chips.length) return '';
  return '<div class="chips">' + chips.map(function(c){
    return '<button class="chip" data-q="' + esc(c) + '" type="button">' + esc(c) + '</button>';
  }).join('') + '</div>';
}

function renderThread(){
  var c = activeChat();
  if(!c || !c.msgs.length){
    threadInner.innerHTML = welcomeHTML();
  } else {
    var html = '';
    c.msgs.forEach(function(m, i){
      html += msgHTML(m);
      if(m.who === 'pal' && m.chips && i === c.msgs.length - 1) html += chipsHTML(m.chips);
    });
    threadInner.innerHTML = html;
  }
  bindThread();
  thread.scrollTop = thread.scrollHeight;
}

function bindThread(){
  threadInner.querySelectorAll('[data-q]').forEach(function(b){
    b.addEventListener('click', function(){ sendMessage(b.getAttribute('data-q')); });
  });
  threadInner.querySelectorAll('.qz__opt:not([disabled])').forEach(function(b){
    b.addEventListener('click', function(){
      var c = activeChat(); if(!c) return;
      var m = null;
      c.msgs.forEach(function(x){ if(x.quiz && !x.quizDone) m = x; });
      if(!m) return;
      m.quizDone = { picked: parseInt(b.getAttribute('data-i'), 10) };
      save(); renderThread();
    });
  });
}

/* streaming reveal */
function streamIn(m, after){
  var holder = document.createElement('div');
  threadInner.appendChild(holder);
  var words = m.text.split(' ');
  var i = 0;
  function step(){
    i = Math.min(words.length, i + 1 + Math.floor(Math.random() * 2));
    var partial = words.slice(0, i).join(' ');
    holder.innerHTML = msgHTML({ who:'pal', text: partial, quiz: i >= words.length ? m.quiz : null, quizDone: null });
    thread.scrollTop = thread.scrollHeight;
    if(i < words.length){ setTimeout(step, 32); }
    else {
      if(m.chips) holder.insertAdjacentHTML('afterend', chipsHTML(m.chips));
      bindThread();
      thread.scrollTop = thread.scrollHeight;
      after();
    }
  }
  step();
}

// One backend round-trip for `chat`. `canRetry` guards a single recovery
// attempt: a sessionId can go stale (deleted on another device, or a server
// whose sessions were wiped), and the server 404s it. Because the id is stored
// on the thread, that 404 would repeat for EVERY later question — the thread
// would be permanently unable to get an answer. So on a 404 we drop the dead id
// and ask again as a fresh session instead of surfacing a dead end.
function askBackend(c, text, sessionId, canRetry){
  EduAPI.chatPal(text, sessionId || undefined).then(function(res){
    var row = document.getElementById('typingRow');
    if(row) row.remove();
    // Store backend session id for this chat thread
    if (res.sessionId) c.backendSessionId = res.sessionId;
    var replyText = (typeof res.reply === 'string' ? res.reply : null) ||
                    (res.reply && res.reply.content) ||
                    (res.message && typeof res.message === 'string' ? res.message : null) ||
                    (res.message && res.message.content) ||
                    'I did not catch that. Could you rephrase?';
    var m = { who:'pal', text: replyText, quiz: null, quizDone: null, chips: null };
    streamIn(m, function(){
      c.msgs.push(m);
      save();
      busy = false; sendBtn.disabled = false;
      input.focus();
    });
  }).catch(function(err){
    if (canRetry && err && err.status === 404 && sessionId) {
      c.backendSessionId = null;
      save();
      askBackend(c, text, null, false);
      return;
    }
    // A logged-in user gets an honest error, never the local demo engine's
    // fabricated data (teacherReply's ROSTER is fake — presenting it as a
    // real answer about a real teacher's real class would be actively
    // misleading, not just an unpolished fallback).
    var row = document.getElementById('typingRow');
    if(row) row.remove();
    // A server-side config failure (dead AI credentials) will not fix itself, so
    // don't tell the user to try again in a moment — that's a promise the server
    // can't keep, and they'd sit there retrying a dead endpoint.
    var text2 = (err && err.code === 'pal_not_configured')
      ? 'PAL’s AI service is not set up on the server right now, so I can’t answer yet. This needs an admin to fix — please report it.'
      : 'Sorry, I could not reach PAL just now (' + (err && err.message ? err.message : 'connection issue') + '). Please try again in a moment.';
    var m = { who:'pal', text: text2, quiz: null, quizDone: null, chips: null };
    streamIn(m, function(){
      c.msgs.push(m);
      save();
      busy = false; sendBtn.disabled = false;
      input.focus();
    });
  });
}

function sendMessage(text){
  text = (text || '').trim();
  if(!text || busy) return;
  var c = activeChat();
  if(!c){ newChat(); c = activeChat(); }
  c.role = store.role;
  if(c.msgs.length === 0){
    c.title = text.length > 34 ? text.slice(0, 34) + '…' : text;
  }
  c.msgs.push({ who:'user', text: text });
  save(); renderChatList(); renderThread();
  input.value = ''; autosize();

  busy = true; sendBtn.disabled = true;
  threadInner.insertAdjacentHTML('beforeend',
    '<div class="msg msg--pal" id="typingRow"><span class="av av--pal">' + PAL_AV + '</span><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div></div>');
  thread.scrollTop = thread.scrollHeight;

  // Try real backend PAL AI first; fall back to local engine.
  var token = (typeof EduAPI !== 'undefined') && EduAPI.getToken && EduAPI.getToken();
  if (token) {
    // Only THIS thread's backend session — never a global "last session id".
    // A new chat must start a new server session, otherwise every thread in the
    // sidebar appends to whichever session was used last and PAL answers the
    // new question with the old thread's context.
    askBackend(c, text, c.backendSessionId, true);
  } else {
    // No auth token — use offline local engine
    setTimeout(function(){
      var r = reply(text);
      var row = document.getElementById('typingRow');
      if(row) row.remove();
      var m = { who:'pal', text: r.text, quiz: r.quiz || null, quizDone: null, chips: r.chips || null };
      streamIn(m, function(){
        c.msgs.push(m);
        save();
        busy = false; sendBtn.disabled = false;
        input.focus();
      });
    }, 650 + Math.random() * 500);
  }
}

/* ============================================================
   WIRING
   ============================================================ */
// Reveal the live doubt session launcher only for roles the guard would let
// through (students) — otherwise the link would just bounce off role-guard.
// In the SPA this script runs without role-guard.js, so when EduGuard is
// absent fall back to reading the stored session role directly.
(function(){
  var doubtBtn = document.getElementById('doubtBtn');
  if (!doubtBtn) return;
  var allowed;
  if (window.EduGuard) {
    allowed = EduGuard.loggedIn && EduGuard.can('tutor.html');
  } else {
    var u = null;
    try { u = JSON.parse(localStorage.getItem('edulearn_user') || 'null'); } catch(e){}
    var r = u && String(u.role || '').toLowerCase();
    allowed = r === 'student' || r === 'admin';
  }
  if (allowed) doubtBtn.hidden = false;
})();

function autosize(){
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 130) + 'px';
}
input.addEventListener('input', autosize);
input.addEventListener('keydown', function(e){
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    sendMessage(input.value);
  }
});
sendBtn.addEventListener('click', function(){ sendMessage(input.value); });
document.getElementById('newChat').addEventListener('click', function(){
  newChat();
  document.getElementById('sidebar').classList.remove('is-open');
  input.focus();
});
document.querySelectorAll('.role').forEach(function(b){
  b.addEventListener('click', function(){ setRole(b.getAttribute('data-role')); });
});
document.getElementById('menuBtn').addEventListener('click', function(){
  document.getElementById('sidebar').classList.toggle('is-open');
});

/* boot */
if(!store.activeId || !activeChat()){
  if(store.chats.length){ store.activeId = store.chats[0].id; }
  else { store.chats.unshift({ id:'c' + Date.now(), role: store.role, title:'New chat', msgs:[] }); store.activeId = store.chats[0].id; }
}
// Lock role to authenticated user's actual role
if(AUTH_ROLE){
  store.role = AUTH_ROLE;
  // Disable manual role switching for logged-in users
  document.querySelectorAll('.role').forEach(function(b){
    if(b.getAttribute('data-role') !== AUTH_ROLE){
      b.style.opacity = '0.35';
      b.style.pointerEvents = 'none';
      b.setAttribute('title', 'Your account role is ' + AUTH_ROLE + '. Log in as a different role to switch.');
    }
  });
}
setRole(store.role, true);
renderChatList();
renderThread();

// Expose what the post-load restore script (below, after api.js) needs.
window._palStore = store;
window._palSave = save;
window._palRenderChatList = renderChatList;
window._palRenderThread = renderThread;

})();


/* ---- next <script> block ---- */


// Chat history lives only in this browser's localStorage — logging out wipes
// it (by design, so the next person on a shared device can't read it) and
// nothing restores it on the next login, so a same-user logout→login cycle
// looked like PAL had "erased" the conversation even though the backend still
// has it. Once logged in with an empty local store, pull the most recent
// backend session back in as a read-only chat so it isn't gone for good.
(function () {
  if (!window.EduAPI || !EduAPI.getToken || !EduAPI.getToken()) return;
  var store = window._palStore;
  if (!store || !store.chats.length) return;
  var onlyEmptyChat = store.chats.length === 1 && store.chats[0].msgs.length === 0;
  if (!onlyEmptyChat) return;

  EduAPI.listPalSessions().then(function (res) {
    var sessions = (res && res.sessions) || [];
    if (!sessions.length) return;
    return EduAPI.getPalSession(sessions[0].id).then(function (res2) {
      var session = res2 && res2.session;
      var msgs = (session && session.messages) || [];
      if (!msgs.length) return;
      store.chats[0].msgs = msgs.map(function (m) {
        return { who: m.role === 'assistant' ? 'pal' : 'user', text: m.content };
      });
      store.chats[0].title = sessions[0].title || 'Restored chat';
      store.chats[0].backendSessionId = sessions[0].id;
      window._palSave();
      window._palRenderChatList();
      window._palRenderThread();
    });
  }).catch(function () {}); // best-effort — never block the page on this
})();

}
