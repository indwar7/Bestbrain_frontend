/* Lifted verbatim from edulearn-frontend/mocktest.html, do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {

(function(){
'use strict';

var LS_KEY = 'edulearn_mock';
var Q_SECONDS = 60;
var TEST_LEN = 10;

/* ---------- question banks: e=easy m=medium h=hard ---------- */
var TESTS = {
  maths: {
    name: 'Class 9 Maths - Polynomials & Number Systems',
    other: 'science',
    bank: [
      { d:'e', q:'What is the degree of 5x³ − 4x² + 7?', opts:['1','2','3','7'], a:2,
        s:'The degree is the <b>highest power of x</b> in the polynomial.<br>Powers present: 5x³ → 3, −4x² → 2, 7 → 0.<br>The highest is <b>3</b>. (7 is the constant term, not the degree.)' },
      { d:'e', q:'Which of these is a polynomial?', opts:['x + 1/x','√x + 2','x² + 3x + 2','x⁻² + 1'], a:2,
        s:'A polynomial may only have <b>whole-number powers</b> of x (0, 1, 2, 3 …).<br>• x + 1/x → 1/x is x⁻¹, a negative power ✗<br>• √x + 2 → √x is x^(1/2), a fraction power ✗<br>• x⁻² + 1 → negative power ✗<br>• <b>x² + 3x + 2</b> → powers 2, 1, 0, all whole numbers ✓' },
      { d:'e', q:'√2 is a(n) … number.', opts:['rational','irrational','whole','natural'], a:1,
        s:'√2 = 1.414213562…, the decimal <b>never ends and never repeats</b>, so it cannot be written as a fraction p/q of two integers.<br>A number that cannot be written as p/q is <b>irrational</b>.' },
      { d:'e', q:'The coefficient of x² in 6x² + 5x − 4 is…', opts:['5','−4','6','2'], a:2,
        s:'The coefficient of a term is the <b>number multiplying</b> it.<br>The x² term here is 6x², so the number multiplying x² is <b>6</b>.<br>(5 is the coefficient of x, and −4 is the constant term.)' },
      { d:'e', q:'A polynomial of degree 1 is called…', opts:['quadratic','cubic','constant','linear'], a:3,
        s:'Polynomials are named by their degree:<br>• degree 0 → constant (e.g. 7)<br>• <b>degree 1 → linear</b> (e.g. 2x + 3)<br>• degree 2 → quadratic (e.g. x² − 4)<br>• degree 3 → cubic (e.g. x³ + 1)' },
      { d:'e', q:'0.3333… (repeating) equals…', opts:['1/3','3/10','1/30','3/100'], a:0,
        s:'Let x = 0.3333…<br>Multiply by 10: &nbsp;10x = 3.3333…<br>Subtract the first from the second: &nbsp;10x − x = 3.3333… − 0.3333…<br>9x = 3 &nbsp;→&nbsp; x = 3/9 = <b>1/3</b>' },
      { d:'e', q:'The zero of p(x) = x − 5 is…', opts:['0','−5','5','1/5'], a:2,
        s:'A <b>zero</b> is the value of x that makes p(x) = 0.<br>Set x − 5 = 0<br>Add 5 to both sides: x = <b>5</b><br>Check: p(5) = 5 − 5 = 0 ✓' },
      { d:'e', q:'A rational number is p/q where q is never…', opts:['1','negative','0','even'], a:2,
        s:'A rational number is p/q with p and q integers.<br>If q were <b>0</b>, you would be dividing by zero, which is undefined in mathematics.<br>So the one rule is <b>q ≠ 0</b>. (q may be 1, negative or even, all fine.)' },
      { d:'m', q:'The remainder when x³ + 3x² + 3x + 1 is divided by (x + 1) is…', opts:['0','1','−1','8'], a:0,
        s:'Use the <b>Remainder Theorem</b>: dividing by (x + 1) means substituting x = −1.<br>p(−1) = (−1)³ + 3(−1)² + 3(−1) + 1<br>= −1 + 3 − 3 + 1 = <b>0</b><br>Remainder 0 means (x + 1) is a factor, in fact x³ + 3x² + 3x + 1 = (x + 1)³.' },
      { d:'m', q:'If (x + 2) is a factor of x² + kx + 10, then k =', opts:['5','6','7','−7'], a:2,
        s:'Use the <b>Factor Theorem</b>: if (x + 2) is a factor, then p(−2) = 0.<br>p(−2) = (−2)² + k(−2) + 10 = 0<br>4 − 2k + 10 = 0<br>14 = 2k &nbsp;→&nbsp; k = <b>7</b><br>Check: x² + 7x + 10 = (x + 2)(x + 5) ✓' },
      { d:'m', q:'The decimal expansion of 1/8 is…', opts:['0.125, terminating','0.125…, recurring','0.12, terminating','non-terminating'], a:0,
        s:'1 ÷ 8 = <b>0.125</b> exactly, it stops after three digits.<br><b>Rule:</b> a fraction terminates when the denominator (in lowest terms) has only 2s and 5s as prime factors.<br>Here 8 = 2 × 2 × 2, only 2s → <b>terminating</b>.' },
      { d:'m', q:'(x + 2)(x − 3) expands to…', opts:['x² + x − 6','x² − x − 6','x² − 5x − 6','x² − x + 6'], a:1,
        s:'Multiply every term by every term:<br>x × x = x²<br>x × (−3) = −3x<br>2 × x = +2x<br>2 × (−3) = −6<br>Combine the middle terms: −3x + 2x = −x<br>Answer: <b>x² − x − 6</b>' },
      { d:'m', q:'(√3 + √2)(√3 − √2) equals…', opts:['5','√6','1','−1'], a:2,
        s:'This is the identity <b>(a + b)(a − b) = a² − b²</b>, with a = √3 and b = √2.<br>= (√3)² − (√2)²<br>= 3 − 2 = <b>1</b><br>The surds cancel out, that is why this trick is used to rationalise denominators.' },
      { d:'m', q:'The zeroes of p(x) = x² − 4 are…', opts:['2 only','−2 only','2 and −2','4 and −4'], a:2,
        s:'x² − 4 is a difference of squares: x² − 2² = (x − 2)(x + 2).<br>Set it to zero: (x − 2)(x + 2) = 0<br>So x − 2 = 0 → x = 2, &nbsp;or&nbsp; x + 2 = 0 → x = −2.<br>Both work: <b>2 and −2</b>. (A degree-2 polynomial has up to 2 zeroes.)' },
      { d:'m', q:'2³ × 2⁴ equals…', opts:['2⁷','2¹²','4⁷','2¹'], a:0,
        s:'Law of exponents: when the <b>bases are the same</b>, multiplying means <b>adding</b> the powers.<br>2³ × 2⁴ = 2^(3+4) = <b>2⁷</b> = 128<br>Check the long way: 8 × 16 = 128 ✓<br>(Don’t multiply the powers, that is the rule for (2³)⁴.)' },
      { d:'m', q:'To rationalise 1/(√5 − 2), multiply by…', opts:['(√5 − 2)','(√5 + 2)','(2 − √5)','√5'], a:1,
        s:'Multiply top and bottom by the <b>conjugate</b>, same terms, opposite sign: <b>(√5 + 2)</b>.<br>Denominator becomes (√5 − 2)(√5 + 2) = (√5)² − 2² = 5 − 4 = 1.<br>So 1/(√5 − 2) = (√5 + 2)/1 = √5 + 2, no surd left on the bottom.' },
      { d:'h', q:'x³ − 3x² − 9x − 5 factorises to…', opts:['(x+1)²(x−5)','(x−1)²(x+5)','(x+1)(x−1)(x+5)','(x+5)²(x−1)'], a:0,
        s:'Hunt for a root among factors of 5 (±1, ±5):<br>p(−1) = −1 − 3 + 9 − 5 = 0 ✓ so (x + 1) is a factor.<br>p(5) = 125 − 75 − 45 − 5 = 0 ✓ so (x − 5) is a factor.<br>Degree 3 needs three factors, and (x + 1) repeats.<br>Verify: (x + 1)²(x − 5) = (x² + 2x + 1)(x − 5) = x³ − 3x² − 9x − 5 ✓' },
      { d:'h', q:'If x + 1/x = 5, then x² + 1/x² =', opts:['25','23','27','24'], a:1,
        s:'<b>Square both sides</b> of x + 1/x = 5:<br>(x + 1/x)² = 5²<br>x² + 2·x·(1/x) + 1/x² = 25<br>The middle term is 2·(x/x) = 2, so:<br>x² + 2 + 1/x² = 25<br>x² + 1/x² = 25 − 2 = <b>23</b>' },
      { d:'h', q:'x³ + y³ equals…', opts:['(x+y)(x²−xy+y²)','(x+y)(x²+xy+y²)','(x−y)(x²+xy+y²)','(x+y)³'], a:0,
        s:'Standard identity: <b>x³ + y³ = (x + y)(x² − xy + y²)</b>.<br>Memory aid, the signs go <b>SOAP</b>: <b>S</b>ame sign (+), <b>O</b>pposite sign (−), <b>A</b>lways <b>P</b>ositive (+).<br>Expand to check: x³ − x²y + xy² + x²y − xy² + y³ = x³ + y³ ✓' },
      { d:'h', q:'Which of these is irrational?', opts:['√(16/25)','0.272727…','0.101101110…','22/7'], a:2,
        s:'Go one by one:<br>• √(16/25) = 4/5 → a fraction, rational<br>• 0.272727… → repeats "27" forever = 27/99, rational<br>• 22/7 → already a fraction, rational (it is only an <i>approximation</i> of π)<br>• <b>0.101101110…</b> → the pattern grows and never repeats a fixed block → <b>irrational</b>' },
      { d:'h', q:'The remainder when x⁴ + x³ − 2x² + x + 1 is divided by (x − 1) is…', opts:['0','1','2','3'], a:2,
        s:'<b>Remainder Theorem</b>: dividing by (x − 1) means substituting x = 1.<br>p(1) = 1⁴ + 1³ − 2(1)² + 1 + 1<br>= 1 + 1 − 2 + 1 + 1<br>= <b>2</b><br>The remainder is not 0, so (x − 1) is not a factor.' },
      { d:'h', q:'6x² + 5x − 6 factorises to…', opts:['(2x+3)(3x−2)','(2x−3)(3x+2)','(6x+1)(x−6)','(2x+1)(3x−6)'], a:0,
        s:'<b>Split the middle term.</b> Multiply first × last: 6 × (−6) = −36.<br>Find two numbers that multiply to −36 and add to +5: <b>+9 and −4</b>.<br>6x² + 9x − 4x − 6<br>= 3x(2x + 3) − 2(2x + 3)<br>= <b>(2x + 3)(3x − 2)</b>' },
      { d:'h', q:'64^(2/3) equals…', opts:['8','12','16','32'], a:2,
        s:'A fraction power means <b>root then power</b>: the bottom is the root, the top is the power.<br>64^(2/3) = (∛64)²<br>∛64 = 4 &nbsp;(since 4 × 4 × 4 = 64)<br>= 4² = <b>16</b>' },
      { d:'h', q:'If a = 2 + √3, then 1/a =', opts:['2 − √3','√3 − 2','(2+√3)/7','1/2 + √3'], a:0,
        s:'Rationalise by multiplying top and bottom by the conjugate (2 − √3):<br>1/(2 + √3) × (2 − √3)/(2 − √3)<br>Denominator: 2² − (√3)² = 4 − 3 = 1<br>= (2 − √3)/1 = <b>2 − √3</b><br>Check: (2 + √3)(2 − √3) = 1 ✓' }
    ]
  },
  science: {
    name: 'Class 9 Science - Motion & Force',
    other: 'maths',
    bank: [
      { d:'e', q:'The SI unit of acceleration is…', opts:['m/s','m/s²','km/h','N'], a:1,
        s:'Acceleration = change in velocity ÷ time.<br>Units: (m/s) ÷ s = <b>m/s²</b><br>(m/s and km/h are units of speed; N is the unit of force.)' },
      { d:'e', q:'Negative acceleration is also called…', opts:['velocity','momentum','retardation','inertia'], a:2,
        s:'When acceleration acts <b>opposite</b> to the direction of motion, the body slows down.<br>This slowing-down acceleration is called <b>retardation</b> (or deceleration), and is written with a minus sign.' },
      { d:'e', q:'Inertia of a body is measured by its…', opts:['speed','weight','volume','mass'], a:3,
        s:'Inertia is a body’s <b>resistance to a change in its state of motion</b>.<br>A loaded truck is far harder to start or stop than a bicycle, because it has more <b>mass</b>.<br>So mass is the measure of inertia. (Weight changes with location; mass does not.)' },
      { d:'e', q:'The slope of a distance–time graph gives…', opts:['acceleration','speed','displacement','force'], a:1,
        s:'Slope = rise ÷ run.<br>On a distance–time graph, rise = distance and run = time.<br>So slope = distance ÷ time = <b>speed</b>.<br>A steeper line therefore means a faster body.' },
      { d:'e', q:'The SI unit of momentum is…', opts:['kg·m/s','kg·m/s²','N/s','J'], a:0,
        s:'Momentum p = mass × velocity.<br>Units: kg × m/s = <b>kg·m/s</b><br>(kg·m/s² is the newton, the unit of force; J is the unit of energy.)' },
      { d:'e', q:'In uniform circular motion, the quantity that keeps changing is…', opts:['speed','mass','direction of motion','energy'], a:2,
        s:'"Uniform" means the <b>speed</b> stays constant. But moving in a circle means the body faces a new way at every instant, so the <b>direction of motion</b> changes continuously.<br>Velocity = speed + direction, so velocity changes → the motion is accelerated even at constant speed.' },
      { d:'e', q:'F = ma is Newton&rsquo;s … law of motion.', opts:['first','second','third','zeroth'], a:1,
        s:'• <b>First law</b>, a body stays at rest or in uniform motion unless a force acts (inertia).<br>• <b>Second law</b>, force = mass × acceleration, <b>F = ma</b> ✓<br>• <b>Third law</b>, every action has an equal and opposite reaction.' },
      { d:'e', q:'Distance is a scalar; displacement is a…', opts:['scalar too','vector','constant','unit'], a:1,
        s:'Distance = total path length, size only → <b>scalar</b>.<br>Displacement = the straight line from start to finish, and it also has a <b>direction</b> (e.g. "5 m east").<br>A quantity with both size and direction is a <b>vector</b>.' },
      { d:'m', q:'A car goes 0 to 20 m/s in 10 s. Its acceleration is…', opts:['0.5 m/s²','2 m/s²','5 m/s²','200 m/s²'], a:1,
        s:'Given: u = 0 m/s, v = 20 m/s, t = 10 s.<br>a = (v − u) / t<br>a = (20 − 0) / 10<br>a = <b>2 m/s²</b><br>Meaning: the car gains 2 m/s of speed every second.' },
      { d:'m', q:'v = u + at with u = 5 m/s, a = 2 m/s², t = 3 s gives v =', opts:['10 m/s','11 m/s','16 m/s','30 m/s'], a:1,
        s:'Substitute straight into v = u + at:<br>v = 5 + (2 × 3)<br>v = 5 + 6<br>v = <b>11 m/s</b><br>(Careful: multiply a × t <i>first</i>, then add u.)' },
      { d:'m', q:'A body covers 60 m in 12 s. Its average speed is…', opts:['5 m/s','6 m/s','0.2 m/s','72 m/s'], a:0,
        s:'Average speed = total distance ÷ total time.<br>= 60 m ÷ 12 s<br>= <b>5 m/s</b>' },
      { d:'m', q:'Momentum of a 10 kg body moving at 5 m/s is…', opts:['2 kg·m/s','15 kg·m/s','50 kg·m/s','500 kg·m/s'], a:2,
        s:'Momentum p = m × v<br>p = 10 kg × 5 m/s<br>p = <b>50 kg·m/s</b><br>(Multiply mass and velocity, do not add them.)' },
      { d:'m', q:'A horizontal line on a velocity–time graph means…', opts:['uniform acceleration','increasing speed','uniform velocity','object at rest always'], a:2,
        s:'On a velocity–time graph the height is the velocity.<br>A horizontal line means the height never changes → <b>uniform (constant) velocity</b>.<br>Its slope is zero, so acceleration = 0. (A body at rest is the special case where that line sits on v = 0.)' },
      { d:'m', q:'At the top of its flight, a ball thrown straight up has…', opts:['zero velocity, zero acceleration','zero velocity, acceleration g','velocity g, zero acceleration','maximum velocity'], a:1,
        s:'At the highest point the ball stops rising for an instant, so <b>v = 0</b>.<br>But gravity never switches off, it keeps pulling downward the whole time, so the <b>acceleration stays g (≈9.8 m/s²) downward</b>.<br>That is exactly why the ball does not hang there, it immediately starts falling.' },
      { d:'m', q:'A 12 N force acts on a 4 kg mass. The acceleration is…', opts:['48 m/s²','0.33 m/s²','3 m/s²','8 m/s²'], a:2,
        s:'From F = ma, rearrange to a = F / m.<br>a = 12 N ÷ 4 kg<br>a = <b>3 m/s²</b><br>(48 comes from multiplying instead of dividing.)' },
      { d:'m', q:'An athlete completes one full lap of a circular track. Displacement =', opts:['track length','zero','track radius','2 × radius'], a:1,
        s:'Displacement is the straight line from the <b>start point to the end point</b>.<br>After one full lap the athlete finishes exactly where they began, so that straight line has length <b>zero</b>.<br>The <i>distance</i> covered, however, equals the full track length.' },
      { d:'h', q:'s = ut + ½at² with u = 0, a = 2 m/s², t = 5 s gives s =', opts:['10 m','20 m','25 m','50 m'], a:2,
        s:'Substitute u = 0, a = 2, t = 5:<br>s = (0 × 5) + ½ × 2 × 5²<br>s = 0 + ½ × 2 × 25<br>s = 1 × 25<br>s = <b>25 m</b>' },
      { d:'h', q:'v² = u² + 2as: u = 0, v = 10 m/s, a = 2 m/s². Then s =', opts:['10 m','25 m','50 m','100 m'], a:1,
        s:'Substitute into v² = u² + 2as:<br>10² = 0² + 2 × 2 × s<br>100 = 4s<br>s = 100 ÷ 4<br>s = <b>25 m</b>' },
      { d:'h', q:'The area under a velocity–time graph gives…', opts:['acceleration','speed','displacement','momentum'], a:2,
        s:'Area of the region = height × width = velocity × time.<br>Units: (m/s) × s = m, a length.<br>So the area gives the <b>displacement</b>.<br>(The <i>slope</i> of the same graph gives acceleration, don’t mix the two up.)' },
      { d:'h', q:'A 2 kg body at 6 m/s hits a 4 kg body at rest and they stick. Final speed =', opts:['1 m/s','2 m/s','3 m/s','6 m/s'], a:1,
        s:'Use <b>conservation of momentum</b>: total momentum before = total after.<br>Before: (2 × 6) + (4 × 0) = 12 kg·m/s<br>After: they move together as one 6 kg body at speed v → 6v<br>6v = 12<br>v = <b>2 m/s</b>' },
      { d:'h', q:'A 0.02 kg bullet at 400 m/s is stopped in 0.05 s. Average force =', opts:['16 N','80 N','160 N','800 N'], a:2,
        s:'Force = change in momentum ÷ time.<br>Change in momentum = m(v − u) = 0.02 × (0 − 400) = −8 kg·m/s<br>F = 8 ÷ 0.05<br>F = <b>160 N</b><br>(The minus sign just shows the force opposes the motion; the size is 160 N.)' },
      { d:'h', q:'A train slows from 20 m/s to rest over 100 m. Its acceleration =', opts:['−2 m/s²','−4 m/s²','−0.2 m/s²','−20 m/s²'], a:0,
        s:'Distance is given, not time, so use v² = u² + 2as.<br>0² = 20² + 2 × a × 100<br>0 = 400 + 200a<br>200a = −400<br>a = <b>−2 m/s²</b><br>The minus sign means retardation (the train is slowing down).' },
      { d:'h', q:'Action–reaction forces do not cancel out because they…', opts:['are unequal','act at different times','act on different bodies','are always vertical'], a:2,
        s:'Two forces can only cancel if they act on the <b>same</b> body.<br>Newton’s third-law pair always acts on <b>two different bodies</b>, you push the wall, the wall pushes you.<br>Each body feels only one of the two forces, so each can still accelerate. The forces are equal and opposite, but never on the same object.' },
      { d:'h', q:'A stone is dropped (g = 10 m/s²). Distance fallen in the 3rd second is…', opts:['15 m','20 m','25 m','45 m'], a:2,
        s:'Distance in the nth second: sₙ = u + (a/2)(2n − 1), with u = 0, a = 10, n = 3.<br>s₃ = 0 + (10/2)(2×3 − 1)<br>s₃ = 5 × 5 = <b>25 m</b><br>Check the long way: total in 3 s = ½×10×9 = 45 m; total in 2 s = ½×10×4 = 20 m; difference = 25 m ✓' }
    ]
  }
};

var WEIGHT = { e:1, m:2, h:3 };
var DCOLOR = { e:'var(--teal)', m:'var(--peri)', h:'var(--rose)' };
var DNAME = { e:'Easy', m:'Medium', h:'Hard' };

/* ---------- storage ---------- */
function loadLS(){
  try{
    var raw = localStorage.getItem(LS_KEY);
    var d = raw ? JSON.parse(raw) : null;
    if(!d || typeof d !== 'object') d = {};
    if(!Array.isArray(d.attempts)) d.attempts = [];
    return d;
  }catch(e){ return { attempts:[] }; }
}
function saveLS(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(store)); }catch(e){} }
var store = loadLS();

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ---------- views ---------- */
var views = { setup: document.getElementById('setupView'), test: document.getElementById('testView'), result: document.getElementById('resultView') };
function show(name){
  Object.keys(views).forEach(function(k){ views[k].style.display = k === name ? 'block' : 'none'; });
  window.scrollTo(0, 0);
}

/* ---------- previous attempts ---------- */
function levelOf(p){ return p > 75 ? ['Advanced','var(--teal)'] : p >= 40 ? ['Proficient','var(--peri)'] : ['Foundation','var(--amber)']; }
function renderAttempts(){
  var host = document.getElementById('attList');
  if(!store.attempts.length){
    host.innerHTML = '<p class="empty-hint">No attempts yet, your history and mastery levels will appear here.</p>';
    return;
  }
  var html = '';
  store.attempts.slice().reverse().slice(0, 6).forEach(function(a){
    var lv = levelOf(a.mastery);
    html += '<div class="att">' +
      '<span class="lvlpill" style="background:' + lv[1] + '">' + lv[0] + '</span>' +
      '<div><div style="font-weight:600;font-size:13.5px">' + esc(a.test) + '</div>' +
      '<div class="d">' + new Date(a.dateISO).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) + '</div></div>' +
      '<span class="pct">' + a.mastery + '%</span></div>';
  });
  host.innerHTML = html;
}

/* ---------- whose syllabus is this? ----------
   Every paper here used to be a Class 9 bank written into this file and served
   to whoever opened it, so a Class 6 student sat down to Class 9 polynomials.
   Questions now come from the API, which picks them by the class on the
   signed-in account, a student can only be given their own. The bank below
   survives as the sample for a visitor with no account, and says so rather
   than passing itself off as the student's syllabus. */
var QUIZ_USER = (function(){
  try { return JSON.parse(localStorage.getItem('edulearn_user') || 'null'); } catch(e){ return null; }
})();
var QUIZ_CLASS = (function(){
  var m = String((QUIZ_USER && QUIZ_USER.className) || '').match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
})();
/* card key -> the subject string the questions are stored under */
var SUBJECT_OF = { maths: 'Maths', science: 'Science' };

/* Put the student's real class on the cards instead of a flat "Class 9". */
(function labelCards(){
  if (!QUIZ_CLASS) return;
  document.querySelectorAll('.pick').forEach(function(card){
    var el = card.querySelector('.pick__subj');
    var btn = card.querySelector('[data-test]');
    if (!el || !btn) return;
    var subj = SUBJECT_OF[btn.getAttribute('data-test')] || '';
    el.textContent = 'Class ' + QUIZ_CLASS + (subj ? ' · ' + subj : '');
  });
})();

function quizMessage(msg){
  var host = document.querySelector('.pickgrid');
  if (!host) return;
  var el = document.getElementById('quizMsg');
  if (!el) {
    el = document.createElement('p');
    el.id = 'quizMsg';
    el.className = 'empty-hint';
    el.style.cssText = 'grid-column:1/-1;margin:4px 0 0';
    host.appendChild(el);
  }
  el.textContent = msg;
}

/* ---------- adaptive test engine ---------- */
var T = null;
var qTimerRAF = null;

/* One API question in the shape the engine already reads. The answer and the
   worked solution are deliberately missing: the server withholds them until
   the student has committed to a choice, so the paper cannot be read ahead
   from devtools. answer() fills them in at reveal time. */
function fromApi(q, i){
  return {
    d: String(q.difficulty || 'medium').charAt(0),   // easy|medium|hard -> e|m|h
    q: q.text,
    opts: q.options || [],
    apiIndex: i
  };
}

function startTest(key){
  // Signed in → the student's own class, decided by the server.
  if (QUIZ_USER && window.EduAPI && EduAPI.startMockTest) return startFromApi(key);
  startLocal(key);
}

function startFromApi(key){
  var subject = SUBJECT_OF[key] || 'Science';
  var params = new URLSearchParams(window.location.search);
  var chapter = params.get('ch') || params.get('chapter') || undefined;
  var btn = document.querySelector('[data-test="' + key + '"]');
  var label = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'Loading…'; }
  quizMessage('');

  EduAPI.startMockTest(subject, chapter, TEST_LEN).then(function(res){
    if (btn) { btn.disabled = false; btn.textContent = label; }
    var qs = (res && res.questions) || [];
    if (!qs.length) {
      quizMessage('No ' + subject + ' questions for Class ' + (QUIZ_CLASS || '-') +
        ' yet. Your teacher adds these, check back soon.');
      return;
    }
    beginTest({
      name: 'Class ' + (QUIZ_CLASS || '') + ' ' + subject,
      /* the results screen offers the other subject, it reads def.other */
      other: key === 'maths' ? 'science' : 'maths',
      bank: qs.map(fromApi)
    }, key, res.attemptId);
  }).catch(function(err){
    if (btn) { btn.disabled = false; btn.textContent = label; }
    quizMessage((err && err.message) ||
      'Could not load your quiz. Check your connection and try again.');
  });
}

/* The offline sample, for a visitor with no account. */
function startLocal(key){
  var def = TESTS[key];
  beginTest(def, key, null);
}

function beginTest(def, key, attemptId){
  T = {
    key: key, def: def,
    attemptId: attemptId || null,   // set when the paper came from the server
    level: 'm',
    used: {},
    n: 0,
    journey: [],   /* {d, ok, q, picked, correctIdx, time} */
    points: 0, maxPossible: 0,
    tStart: 0
  };
  document.getElementById('tName').textContent = def.name;
  /* .onclick (not addEventListener) so a retake doesn't stack duplicate handlers */
  document.getElementById('submitBtn').onclick = function(){
    if(T.picked !== null && T.picked !== undefined) answer(T.picked, false);
  };
  document.getElementById('nextBtn').onclick = function(){ nextQuestion(); };
  show('test');
  nextQuestion();
}

function pickQuestion(){
  var order = { e:['e','m','h'], m:['m','e','h'], h:['h','m','e'] }[T.level];
  for(var oi = 0; oi < order.length; oi++){
    var lvl = order[oi];
    var pool = [];
    T.def.bank.forEach(function(q, i){
      if(q.d === lvl && !T.used[i]) pool.push(i);
    });
    if(pool.length){
      var idx = pool[Math.floor(Math.random() * pool.length)];
      T.used[idx] = true;
      return T.def.bank[idx];
    }
  }
  return null;
}

function paintLadder(){
  ['e','m','h'].forEach(function(l){
    document.getElementById('rung-' + l).classList.toggle('is-on', T.level === l);
  });
}
function paintPath(){
  var html = '';
  for(var i = 0; i < TEST_LEN; i++){
    var st = T.journey[i];
    html += '<i style="' + (st ? 'background:' + DCOLOR[st.d] + ';border-color:transparent' + (st.ok ? '' : ';opacity:.45') : '') + '"></i>';
  }
  document.getElementById('dPath').innerHTML = html;
}

function nextQuestion(){
  /* Never advance past a question that hasn't been graded. Without this a stray
     "Next" click would skip it while T.n and T.maxPossible had already counted
     it, quietly deflating the student's mastery score. */
  if(T.current && !T.answered) return;
  if(T.n >= TEST_LEN){ finishTest(); return; }
  var q = pickQuestion();
  if(!q){ finishTest(); return; }
  T.current = q;
  T.n++;
  T.tStart = Date.now();
  T.maxPossible += WEIGHT[q.d];

  document.getElementById('tCount').textContent = T.n + ' / ' + TEST_LEN;
  document.getElementById('dChip').textContent = DNAME[q.d];
  document.getElementById('dChip').style.background = DCOLOR[q.d];
  document.getElementById('qText').innerHTML = q.q;
  document.getElementById('toast').textContent = '';
  paintLadder(); paintPath();

  /* back to the "answering" state: solution hidden, Submit shown but locked
     until an option is picked */
  T.picked = null;
  T.answered = false;
  document.getElementById('solution').hidden = true;
  var submitBtn = document.getElementById('submitBtn');
  var nextBtn = document.getElementById('nextBtn');
  submitBtn.hidden = false;
  submitBtn.disabled = true;
  nextBtn.hidden = true;
  document.getElementById('qHint').textContent = 'Pick an option, then submit.';

  var html = '';
  q.opts.forEach(function(o, i){
    html += '<button class="opt" data-i="' + i + '" type="button" role="radio" aria-checked="false">' +
      '<span class="ltr">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o) + '</span></button>';
  });
  var grid = document.getElementById('optGrid');
  grid.innerHTML = html;
  grid.querySelectorAll('.opt').forEach(function(b){
    b.addEventListener('click', function(){ pick(parseInt(b.getAttribute('data-i'), 10)); });
  });
  /* keyboard users land on the question's first option, not back at the nav */
  var first = grid.querySelector('.opt');
  if(first) first.focus();

  /* per-question timer */
  var deadline = Date.now() + Q_SECONDS * 1000;
  var C = 138.2;
  cancelAnimationFrame(qTimerRAF);
  function frame(){
    var remaining = (deadline - Date.now()) / 1000;
    /* out of time: submit whatever is selected (null if nothing) */
    if(remaining <= 0){ answer(T.picked, true); return; }
    var arc = document.getElementById('qArc');
    document.getElementById('qNum').textContent = Math.ceil(remaining);
    arc.setAttribute('stroke-dashoffset', (C * (1 - remaining / Q_SECONDS)).toFixed(1));
    arc.setAttribute('stroke', remaining > 20 ? 'var(--teal)' : remaining > 10 ? 'var(--amber)' : 'var(--rose)');
    qTimerRAF = requestAnimationFrame(frame);
  }
  qTimerRAF = requestAnimationFrame(frame);
}

/* Selecting an option only highlights it, nothing is graded until Submit. */
function pick(idx){
  if(T.answered) return;
  T.picked = idx;
  document.getElementById('optGrid').querySelectorAll('.opt').forEach(function(b){
    var isPicked = parseInt(b.getAttribute('data-i'), 10) === idx;
    b.classList.toggle('is-picked', isPicked);
    b.setAttribute('aria-checked', String(isPicked)); // announce the selection
  });
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('qHint').textContent = 'Submit when you are ready.';
}

function answer(pickedIdx, timedOut){
  /* T.done guards the case where the results screen is already up */
  if(T.answered || T.done) return;
  T.answered = true;
  /* stop the clock, the student reads the solution with no time pressure */
  cancelAnimationFrame(qTimerRAF);
  var q = T.current;

  /* A server-served question arrives without its answer, so grading is a round
     trip. Marking it answered above already stopped the clock and locked the
     options, so a slow network cannot be used to keep guessing. */
  if(q.a === undefined && T.attemptId && window.EduAPI && EduAPI.answerMockQuestion){
    EduAPI.answerMockQuestion(T.attemptId, q.apiIndex,
      (pickedIdx === null || pickedIdx === undefined) ? -1 : pickedIdx
    ).then(function(g){
      q.a = g.correctIndex;
      q.s = g.explanation || '';
      reveal(pickedIdx, timedOut);
    }).catch(function(){
      /* Can't grade it, say so rather than invent a verdict. */
      var v = document.getElementById('solVerdict');
      v.style.color = 'var(--amber)';
      v.textContent = 'Could not check that answer, your connection dropped.';
      document.getElementById('solBody').textContent =
        'This question was not counted. Tap Next to carry on.';
      document.getElementById('solution').hidden = false;
    });
    return;
  }

  reveal(pickedIdx, timedOut);
}

function reveal(pickedIdx, timedOut){
  var q = T.current;
  var ok = pickedIdx === q.a;
  var took = Math.round((Date.now() - T.tStart) / 1000);
  if(ok) T.points += WEIGHT[q.d];

  T.journey.push({ d: q.d, ok: ok, q: q.q, opts: q.opts, picked: pickedIdx, correctIdx: q.a, time: took, timedOut: !!timedOut });

  var grid = document.getElementById('optGrid');
  grid.querySelectorAll('.opt').forEach(function(b){
    b.disabled = true;
    b.classList.remove('is-picked');
    var i = parseInt(b.getAttribute('data-i'), 10);
    if(i === q.a) b.classList.add('is-right');
    else if(i === pickedIdx) b.classList.add('is-wrong');
  });

  /* reveal the worked solution */
  var rightLtr = String.fromCharCode(65 + q.a);
  var rightTxt = '<b>' + rightLtr + '. ' + esc(q.opts[q.a]) + '</b>';
  var verdict = document.getElementById('solVerdict');
  if(ok){
    verdict.style.color = 'var(--teal)';
    verdict.innerHTML = 'Correct, the answer is ' + rightTxt;
  } else {
    verdict.style.color = 'var(--rose)';
    verdict.innerHTML = (pickedIdx === null || pickedIdx === undefined)
      ? 'Time’s up, the answer is ' + rightTxt
      : 'Not quite. You chose ' + String.fromCharCode(65 + pickedIdx) + ', the answer is ' + rightTxt;
  }
  document.getElementById('solBody').innerHTML = q.s || 'Solution coming soon for this question.';
  document.getElementById('solution').hidden = false;

  var toast = document.getElementById('toast');
  var prev = T.level;
  if(ok){
    T.level = prev === 'e' ? 'm' : 'h';
    toast.style.color = 'var(--teal)';
    toast.textContent = prev === 'h' ? 'Staying at the top rung.' : 'Level up, the next one is harder.';
  } else {
    T.level = prev === 'h' ? 'm' : 'e';
    toast.style.color = 'var(--rose)';
    toast.textContent = timedOut
      ? 'Timed out, stepping back to rebuild.'
      : (prev === 'e' ? 'Staying on basics, let’s steady this.' : 'Stepping back, let’s rebuild.');
  }
  paintLadder(); paintPath();

  /* swap Submit for Next, the student advances when they are done reading */
  document.getElementById('submitBtn').hidden = true;
  var nextBtn = document.getElementById('nextBtn');
  nextBtn.textContent = T.n >= TEST_LEN ? 'See my results' : 'Next question';
  nextBtn.hidden = false;
  nextBtn.focus(); // move focus with the control that replaced Submit
  document.getElementById('qHint').textContent = 'Read the solution, then continue.';
}

/* ---------- result ---------- */
function finishTest(){
  /* Point of no return: kill the countdown so a late frame can't fire answer()
     over the results screen and push an extra entry into an already-saved run. */
  cancelAnimationFrame(qTimerRAF);
  qTimerRAF = null;
  T.done = true;

  var mastery = T.maxPossible ? Math.round(T.points / T.maxPossible * 100) : 0;
  var lv = levelOf(mastery);
  var hardest = T.journey.some(function(j){ return j.d === 'h'; }) ? 'Hard'
              : T.journey.some(function(j){ return j.d === 'm'; }) ? 'Medium' : 'Easy';
  var rightCount = T.journey.filter(function(j){ return j.ok; }).length;
  var avgTime = T.journey.length
    ? Math.round(T.journey.reduce(function(s, j){ return s + j.time; }, 0) / T.journey.length)
    : 0;

  store.attempts.push({
    dateISO: new Date().toISOString(), test: T.def.name, mastery: mastery,
    level: lv[0], points: T.points, maxPossible: T.maxPossible,
    journey: T.journey.map(function(j){ return { d: j.d, ok: j.ok }; })
  });
  saveLS();

  // Persist to the backend so this attempt survives re-login, syncs across
  // devices, and is visible server-side (local save above is just instant UI).
  if (window.EduAPI && EduAPI.recordMockAttempt) {
    var subj = (T.key || '').charAt(0).toUpperCase() + (T.key || '').slice(1);
    EduAPI.recordMockAttempt({
      subject: subj || T.def.name,
      testName: T.def.name,
      score: rightCount,
      total: T.journey.length,
      mastery: mastery
    }).catch(function(){ /* offline → local copy still shows */ });
  }

  show('result');
  document.getElementById('resName').textContent = T.def.name;
  document.getElementById('resPct').textContent = mastery + '%';
  document.getElementById('resArc').setAttribute('stroke-dashoffset', (345.6 * (1 - mastery / 100)).toFixed(1));

  var verdicts = {
    Foundation: 'We found the gaps. PAL practice will rebuild them, then come back and climb.',
    Proficient: 'Solid base. The hard rung is where your next marks are hiding.',
    Advanced: 'You held the top rung. You are ready for the chapter final test.'
  };
  document.getElementById('resVerdict').innerHTML =
    '<span style="color:' + lv[1] + '">' + lv[0] + '</span><small>' + verdicts[lv[0]] + '</small>';

  /* journey chart: x = question, y = difficulty */
  var Y = { e:100, m:60, h:20 };
  var pts = T.journey.map(function(j, i){ return { x: 30 + i * 55, y: Y[j.d], ok: j.ok, d: j.d }; });
  var svg = '';
  for(var i = 0; i < pts.length - 1; i++){
    svg += '<line x1="' + pts[i].x + '" y1="' + pts[i].y + '" x2="' + pts[i+1].x + '" y2="' + pts[i+1].y + '" stroke="var(--line-strong)" stroke-width="2"/>';
  }
  pts.forEach(function(p, i){
    svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="10" fill="' + DCOLOR[p.d] + '"' + (p.ok ? '' : ' opacity=".4"') + '/>' +
           '<text x="' + p.x + '" y="' + (p.y + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#0B1224">' + (p.ok ? '&#10003;' : '&#10005;') + '</text>';
  });
  ['Hard','Medium','Easy'].forEach(function(lbl, i){
    svg += '<text x="556" y="' + (24 + i * 40) + '" text-anchor="end" font-size="9" fill="var(--muted)" font-family="monospace" letter-spacing="1">' + lbl.toUpperCase() + '</text>';
  });
  document.getElementById('journeySvg').innerHTML = svg;

  document.getElementById('resStats').innerHTML =
    /* report over questions actually attempted, not the nominal length */
    '<div class="stat"><b>' + rightCount + ' / ' + (T.journey.length || TEST_LEN) + '</b><span>correct</span></div>' +
    '<div class="stat"><b>' + hardest + '</b><span>highest level reached</span></div>' +
    '<div class="stat"><b>' + avgTime + 's</b><span>avg time per question</span></div>' +
    '<div class="stat"><b>' + T.points + ' / ' + T.maxPossible + '</b><span>weighted points</span></div>';

  /* recommendation */
  var hardMisses = T.journey.filter(function(j){ return j.d === 'h' && !j.ok; }).length;
  var reco;
  if(mastery > 75) reco = 'You climbed fast and held Hard. PAL suggests attempting the chapter final test to lock the mastery badge.';
  else if(hardMisses >= 2) reco = 'You reached Hard but slipped ' + hardMisses + ' times there. Rewatch the lecture&rsquo;s tougher worked examples, then retake.';
  else if(mastery >= 40) reco = 'You held Medium steadily. One focused PAL practice session should unlock the Hard rung.';
  else reco = 'The test stepped back to basics for you, no stress. Start with the chapter video and PAL bridging practice, then return.';
  document.getElementById('resReco').innerHTML = '<span class="mono" style="flex:none;margin-top:3px">PAL says</span><span>' + reco + '</span>';

  /* review */
  var rv = '';
  T.journey.forEach(function(j, i){
    rv += '<details><summary><span class="dchip" style="background:' + DCOLOR[j.d] + '">' + DNAME[j.d] + '</span>' +
      '<span style="color:' + (j.ok ? 'var(--teal)' : 'var(--rose)') + '">' + (j.ok ? 'Correct' : (j.timedOut ? 'Timed out' : 'Wrong')) + '</span>' +
      '<span style="font-weight:500;color:var(--muted);font-size:13px">Q' + (i + 1) + '</span></summary>' +
      '<div class="rbody"><div style="margin-bottom:6px;color:var(--cream)">' + j.q + '</div>' +
      (j.picked !== null && !j.ok ? 'Your answer: <b style="color:var(--rose)">' + esc(j.opts[j.picked]) + '</b> · ' : '') +
      'Correct: <b style="color:var(--teal)">' + esc(j.opts[j.correctIdx]) + '</b> · ' + j.time + 's</div></details>';
  });
  document.getElementById('resReview').innerHTML = rv;

  document.getElementById('retakeBtn').onclick = function(){ startTest(T.key); };
  document.getElementById('otherBtn').onclick = function(){ startTest(T.def.other); };
  renderAttempts();
}

/* ---------- boot ---------- */
document.querySelectorAll('[data-test]').forEach(function(b){
  b.addEventListener('click', function(){ startTest(b.getAttribute('data-test')); });
});

// Load history from the server (source of truth) so it persists across logins
// and devices. Falls back to the local copy if the request fails (offline).
function syncHistoryFromServer(){
  if(!(window.EduAPI && EduAPI.getMockHistory)){ renderAttempts(); return; }
  EduAPI.getMockHistory().then(function(res){
    var list = (res && res.attempts) || [];
    if(Array.isArray(list)){
      store.attempts = list.map(function(a){
        var m = (a.mastery != null) ? a.mastery : (a.total ? Math.round(a.score / a.total * 100) : 0);
        return { dateISO: a.finishedAt, test: a.testName || a.subject, mastery: m };
      });
    }
    renderAttempts();
  }).catch(function(){ renderAttempts(); });
}
syncHistoryFromServer();

// A shared-test link (dashboard.html's "Share a test" modal) adds ?chapter=
// so every student who opens it lands on the actual test, not the generic
// picker screen every link used to show regardless of which chapter was sent.
var CHAPTER_SUBJECT = {
  'nutrition-in-plants': 'science', 'heat': 'science', 'acids-bases-salts': 'science',
  'respiration': 'science', 'motion-and-time': 'science', 'electric-current': 'science', 'light': 'science'
};
var sharedChapter = new URLSearchParams(location.search).get('chapter');
if (sharedChapter && CHAPTER_SUBJECT[sharedChapter]) {
  startTest(CHAPTER_SUBJECT[sharedChapter]);
} else {
  show('setup');
}

})();

}
