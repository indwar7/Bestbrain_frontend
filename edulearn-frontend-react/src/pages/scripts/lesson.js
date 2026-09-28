/* Lifted verbatim from edulearn-frontend/lesson.html, do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {

// Shared with the video-lookup script below (which runs after api.js loads).
var LESSON = {};
(function(){
'use strict';
var params = new URLSearchParams(window.location.search);

function titleCase(slug){
  return slug.split('-').map(function(w){
    return w ? w.charAt(0).toUpperCase() + w.slice(1) : w;
  }).join(' ');
}

var TRACKS = { yoga:'Yoga & Mindfulness', fin:'Financial Literacy', music:'Music', career:'Career Orientation' };
var SUBJECT_NAMES = { maths:'Mathematics', science:'Science', social:'Social Science', english:'English', hindi:'Hindi' };

var crumb = document.getElementById('lessonCrumb');
var title = document.getElementById('lessonTitle');
var hubCrumb = document.getElementById('hubCrumb');
var hubTitle = document.getElementById('hubTitle');
var back = document.getElementById('backLink');

var track = params.get('track');
var ch = params.get('ch');
var cls = params.get('class');
var subject = params.get('subject');
var titleParam = params.get('t'); // exact chapter name passed from learn.html
var viewParam = params.get('view'); // 'video' | 'notes', deep-link from Learn's module icons
var slug = null;

/* ------------------------------------------------------------
   CLASS ACCESS CONTROL (strict): a student may only open lessons for
   their OWN class. If the URL points at any other class, bounce them
   back to their own class page. Non-students are unrestricted.
   ------------------------------------------------------------ */
(function enforceStudentClass(){
  var u = null;
  try { u = JSON.parse(localStorage.getItem('edulearn_user') || 'null'); } catch(e){}
  if (!u || u.role !== 'student') return;
  var own = (String(u.className || '').match(/\d+/) || [])[0];
  var req = (String(cls || '').match(/\d+/) || [])[0];
  if (own && req && req !== own) {
    // requested a class that isn't theirs → send to their own Learn page
    window.location.replace('learn.html');
  }
})();

if(track && TRACKS[track]){
  crumb.textContent = 'Beyond academics';
  title.textContent = TRACKS[track];
} else if(ch){
  /* ch looks like c9-sst-french-revolution → strip the c<class>-<code>- prefix */
  slug = ch.replace(/^c\d+-[a-z]+-/, '');
  title.textContent = titleParam || titleCase(slug);
  var parts = [];
  if(cls) parts.push('Class ' + cls);
  if(subject && SUBJECT_NAMES[subject]) parts.push(SUBJECT_NAMES[subject]);
  crumb.textContent = parts.length ? parts.join(' · ') : 'Lesson';
}

// Mirror the resolved title/crumb onto the chapter hub (the first thing shown).
hubTitle.textContent = title.textContent;
hubCrumb.textContent = crumb.textContent;

// Null-guarded: this is decorative navigation, but an unguarded assignment
// here throws and aborts the rest of this bootstrap, including the LESSON.*
// assignments below that the video lookup depends on. A missing back button
// must never be able to take the lesson video down with it.
if(back && cls && subject){
  back.href = 'learn.html?class=' + encodeURIComponent(cls) + '&subject=' + encodeURIComponent(subject);
}

// Hand off to the video-lookup script (runs once EduAPI is available).
LESSON.cls = cls;
LESSON.subject = subject;
LESSON.slug = slug;
LESSON.view = viewParam;
LESSON.chapterTitle = title.textContent;
LESSON.chapterCrumb = crumb.textContent;
})();


/* ---- next <script> block ---- */


window.HUB = (function(){
'use strict';

/* ------------------------------------------------------------------
   NOTES, keyed by chapter slug (the part after c<class>-<code>- in the
   URL's ?ch=). Content is trusted static HTML; add more chapters here.
   ------------------------------------------------------------------ */
var NOTES = {
  'food-sources': {
    read: 8,
    sections: [
      { h: 'Food variety',
        body: '<p>We eat a huge variety of food. A <b>food item</b> is anything we eat or drink, such as chapati, rice, dal, vegetables, milk or fruit. A single dish is usually made from more than one material. For example, <b>vegetable curry</b> needs vegetables, oil, salt and spices, and each of these is called an <b>ingredient</b>.</p>' +
              '<div class="nterm"><b>Ingredients</b> are the materials that are used to prepare a dish.</div>' },
      { h: 'Where does food come from?',
        body: '<p>If we trace any ingredient back to its source, it comes from either a <b>plant</b> or an <b>animal</b>. These are the two main sources of our food.</p>' +
              '<ul>' +
              '<li><b>Plant sources:</b> grains, pulses, vegetables, fruits, sugar, oil.</li>' +
              '<li><b>Animal sources:</b> milk, eggs, meat, fish, honey.</li>' +
              '</ul>' +
              '<p>Interestingly, <b>honey</b> is made by bees from the nectar of flowers, so it involves both a plant and an animal.</p>' },
      { h: 'Plant parts we eat',
        body: '<p>Different plants give us food from different parts, roots, stems, leaves, flowers, fruits and seeds.</p>' +
              '<ul>' +
              '<li><b>Seeds:</b> wheat, rice, pulses, mustard.</li>' +
              '<li><b>Roots:</b> carrot, radish, beetroot.</li>' +
              '<li><b>Leaves:</b> spinach, coriander, cabbage.</li>' +
              '<li><b>Stems:</b> potato, ginger, sugarcane.</li>' +
              '<li><b>Flowers:</b> cauliflower, banana flower.</li>' +
              '</ul>' +
              '<p>Some plants, like the mustard plant, give us more than one type of food, its seeds give oil and its leaves are eaten as a vegetable. When we let seeds like moong or chana <b>sprout</b>, tiny plants begin to grow, and sprouts are a healthy food too.</p>' },
      { h: 'Animal products as food',
        body: '<p>Animals give us products such as <b>milk, eggs, meat and honey</b>. Milk comes from cows, buffaloes and goats, and from milk we make curd, butter, cheese (paneer) and ghee.</p>' },
      { h: 'What do animals eat?',
        body: '<p>Based on their food habits, animals are grouped into three types:</p>' +
              '<ul>' +
              '<li><b>Herbivores</b>, eat only plants (cow, goat, deer, elephant).</li>' +
              '<li><b>Carnivores</b>, eat other animals (lion, tiger, lizard).</li>' +
              '<li><b>Omnivores</b>, eat both plants and animals (human, crow, dog, bear).</li>' +
              '</ul>' }
    ],
    recap: [
      'Food is made of ingredients that come from plants or animals.',
      'We eat different plant parts: roots, stems, leaves, flowers, fruits and seeds.',
      'Animal products include milk, eggs, meat and honey.',
      'Animals are herbivores, carnivores or omnivores based on what they eat.'
    ]
  },

  'components-of-food': {
    read: 9,
    sections: [
      { h: 'What food contains',
        body: '<p>The food we eat contains different components called <b>nutrients</b>, mainly <b>carbohydrates, proteins, fats, vitamins</b> and <b>minerals</b>. In addition, food contains <b>dietary fibre (roughage)</b> and <b>water</b>. Each nutrient is needed by the body for a special purpose.</p>' +
              '<div class="nterm">Simple tests can detect nutrients: <b>iodine</b> turns blue-black with <b>starch</b>, and a food that leaves an <b>oily patch</b> on paper contains <b>fat</b>.</div>' },
      { h: 'Energy-giving nutrients',
        body: '<ul>' +
              '<li><b>Carbohydrates</b> mainly provide energy. Sources: rice, wheat, potato, sugar.</li>' +
              '<li><b>Fats</b> give a lot more energy than carbohydrates. Sources: ghee, butter, oil, nuts.</li>' +
              '</ul>' },
      { h: 'Body-building nutrient',
        body: '<p><b>Proteins</b> are needed for the <b>growth and repair</b> of the body, so they are called <b>body-building foods</b>. Sources: pulses, milk, eggs, fish, meat, paneer.</p>' },
      { h: 'Protective nutrients',
        body: '<p><b>Vitamins</b> and <b>minerals</b> protect the body from diseases and keep it healthy. They are needed in small amounts.</p>' +
              '<ul>' +
              '<li><b>Vitamin A</b>, keeps skin and eyes healthy (carrot, papaya, mango).</li>' +
              '<li><b>Vitamin C</b>, helps fight diseases (amla, orange, lemon).</li>' +
              '<li><b>Vitamin D</b>, keeps bones and teeth strong (sunlight, milk).</li>' +
              '<li><b>Minerals</b>, iron, calcium, iodine, etc., needed in small amounts for good health.</li>' +
              '</ul>' },
      { h: 'Roughage and water',
        body: '<ul>' +
              '<li><b>Roughage</b> is the fibre from plant foods (whole grains, fresh fruits, vegetables). It has no nutrients but helps the body get rid of waste and prevents constipation.</li>' +
              '<li><b>Water</b> helps the body absorb nutrients and remove wastes. We also get water from many foods.</li>' +
              '</ul>' },
      { h: 'Balanced diet & deficiency diseases',
        body: '<p>A <b>balanced diet</b> contains all the nutrients, roughage and water in the right amounts. Eating too little of a nutrient over a long time causes <b>deficiency diseases</b>.</p>' +
              '<ul>' +
              '<li>Lack of <b>proteins</b> → poor growth (kwashiorkor).</li>' +
              '<li>Lack of <b>Vitamin A</b> → poor eyesight (night blindness).</li>' +
              '<li>Lack of <b>Vitamin C</b> → scurvy (bleeding gums).</li>' +
              '<li>Lack of <b>Vitamin D / calcium</b> → weak bones (rickets).</li>' +
              '<li>Lack of <b>iron</b> → anaemia; lack of <b>iodine</b> → goitre.</li>' +
              '</ul>' }
    ],
    recap: [
      'Nutrients are carbohydrates, proteins, fats, vitamins and minerals.',
      'Carbohydrates and fats give energy; proteins build and repair the body.',
      'Vitamins and minerals protect us and keep us healthy.',
      'A balanced diet has all nutrients, roughage and water; shortages cause deficiency diseases.'
    ]
  },

  'fibre-to-fabric': {
    read: 8,
    sections: [
      { h: 'Variety in fabrics',
        body: '<p>We use many kinds of cloth, cotton, silk, wool, nylon and polyester. All fabrics are made from thin thread-like strands called <b>yarn</b>, and yarn is made from even thinner strands called <b>fibres</b>.</p>' +
              '<div class="nterm"><b>Fibre → Yarn → Fabric.</b> Fibres are spun into yarn, and yarn is woven or knitted into fabric.</div>' },
      { h: 'Natural and synthetic fibres',
        body: '<ul>' +
              '<li><b>Natural fibres</b> come from plants or animals, cotton and jute (plants); wool and silk (animals).</li>' +
              '<li><b>Synthetic fibres</b> are made from chemicals, nylon, polyester, acrylic.</li>' +
              '</ul>' },
      { h: 'Plant fibres: cotton and jute',
        body: '<ul>' +
              '<li><b>Cotton</b> grows in warm areas in black soil. Cotton is picked from bursting <b>cotton bolls</b>, and the fibres are separated from seeds by <b>ginning</b>.</li>' +
              '<li><b>Jute</b> is obtained from the <b>stem</b> of the jute plant, grown in the rainy season. It is mainly grown in West Bengal, Bihar and Assam.</li>' +
              '</ul>' },
      { h: 'From fibre to fabric',
        body: '<p>Two main steps turn fibre into fabric:</p>' +
              '<ul>' +
              '<li><b>Spinning:</b> fibres are drawn out and twisted together to make yarn. Simple tools are the <b>takli</b> and the <b>charkha</b>; mills use spinning machines.</li>' +
              '<li><b>Weaving:</b> two sets of yarn are arranged together to make a fabric, done on a <b>loom</b>.</li>' +
              '<li><b>Knitting:</b> a single yarn is used to make a piece of fabric (as in socks and sweaters).</li>' +
              '</ul>' },
      { h: 'History of clothing material',
        body: '<p>Long ago, people used bark and big leaves of trees, or animal skins and furs, to cover themselves. When people began to settle in agricultural communities, they learnt to <b>weave</b> using cotton and other fibres, which led to the fabrics we use today.</p>' }
    ],
    recap: [
      'Fabric is made from yarn, and yarn is made from fibres.',
      'Fibres are natural (cotton, jute, wool, silk) or synthetic (nylon, polyester).',
      'Cotton comes from cotton bolls; jute comes from the plant’s stem.',
      'Spinning makes yarn from fibre; weaving and knitting make fabric from yarn.'
    ]
  },

  /* ---- NCERT "Curiosity" Class 7 Science ---- */
  'evolving-science': {
    read: 7,
    sections: [
      { h: 'What is science?',
        body: '<p>Science is a way of understanding the world around us. Instead of simply accepting things as they are, we <b>observe</b>, ask <b>questions</b>, and look for answers backed by <b>evidence</b>. Science is not just a fixed set of facts, it is a living <b>process of exploration</b> powered by curiosity.</p>' +
              '<div class="nterm">Science is both a <b>body of knowledge</b> and a <b>way of thinking</b>, asking questions and testing ideas with evidence.</div>' },
      { h: 'The scientific method',
        body: '<p>Scientists work in an organised way to move from a question to a reliable answer:</p>' +
              '<ul>' +
              '<li><b>Observation</b>, noticing something around us.</li>' +
              '<li><b>Question</b>, asking why or how it happens.</li>' +
              '<li><b>Hypothesis</b>, a possible explanation that can be tested.</li>' +
              '<li><b>Experiment</b>, a fair test to check the hypothesis.</li>' +
              '<li><b>Analysis &amp; conclusion</b>, studying the results and deciding whether the hypothesis holds.</li>' +
              '</ul>' +
              '<div class="nterm">A <b>hypothesis</b> is a testable, possible explanation, not a final answer.</div>' },
      { h: 'Science is ever-evolving',
        body: '<p>Scientific knowledge keeps <b>changing</b> as new evidence is found. Older ideas are refined or replaced by better ones. Our understanding of the atom, the Solar System and the causes of diseases has improved over time. Being willing to <b>update our ideas</b> when the evidence demands it is at the very heart of science.</p>' },
      { h: 'Branches of science',
        body: '<p>Science has many branches that study different parts of nature:</p>' +
              '<ul>' +
              '<li><b>Physics</b>, matter, energy, motion, light and electricity.</li>' +
              '<li><b>Chemistry</b>, substances and the way they change.</li>' +
              '<li><b>Biology</b>, living things and how they live.</li>' +
              '<li><b>Astronomy</b>, stars, planets and space.</li>' +
              '</ul>' +
              '<p>Many discoveries come from <b>combining</b> ideas across these branches.</p>' },
      { h: 'Curiosity and great scientists',
        body: '<p>Every discovery begins with <b>curiosity</b>. India has a rich scientific heritage - <b>Aryabhata</b> studied astronomy and the idea of zero, <b>Sir C.V. Raman</b> explained the scattering of light, and <b>Jagadish Chandra Bose</b> showed that plants respond to stimuli. Around the world, scientists such as Newton and Marie Curie expanded what we know.</p>' +
              '<div class="nterm">Sir <b>C.V. Raman</b> won the Nobel Prize in Physics (1930) for the <b>Raman Effect</b>, the scattering of light.</div>' },
      { h: 'Science in everyday life',
        body: '<p>Science and technology shape our daily lives - <b>medicines</b> keep us healthy, <b>transport</b> and <b>communication</b> connect us, and better <b>farming</b> and <b>clean water</b> improve living. Learning science helps us make sensible, <b>evidence-based decisions</b> and solve real problems.</p>' }
    ],
    recap: [
      'Science is a way of exploring the world through observation, questions and evidence.',
      'The scientific method: observe → question → hypothesise → experiment → conclude.',
      'Scientific knowledge is ever-evolving, ideas change as new evidence appears.',
      'Curiosity drives discovery; Indian scientists like C.V. Raman and Aryabhata made major contributions.'
    ]
  },

  'acidic-basic-neutral': {
    read: 8,
    sections: [
      { h: 'Acidic, basic and neutral substances',
        body: '<p>Substances can be grouped by their nature:</p>' +
              '<ul>' +
              '<li><b>Acidic</b> substances taste <b>sour</b>, lemon, tamarind (imli), vinegar, curd.</li>' +
              '<li><b>Basic</b> substances taste <b>bitter</b> and feel <b>soapy</b>, baking soda, soap, lime water.</li>' +
              '<li><b>Neutral</b> substances are neither acidic nor basic, water, common salt, sugar solution.</li>' +
              '</ul>' +
              '<div class="nterm">We must <b>never taste or touch</b> laboratory chemicals to test them, we use <b>indicators</b> instead.</div>' },
      { h: 'Indicators',
        body: '<p>An <b>indicator</b> is a substance that changes colour to show whether something is acidic or basic. The most common one is <b>litmus</b>, a natural dye obtained from <b>lichens</b>. It is used as blue litmus, red litmus, litmus solution or litmus paper.</p>' +
              '<div class="nterm">An <b>indicator</b> changes colour in acidic and basic solutions, telling us the nature of a substance.</div>' },
      { h: 'The litmus test',
        body: '<ul>' +
              '<li>An <b>acidic</b> substance turns <b>blue litmus red</b>.</li>' +
              '<li>A <b>basic</b> substance turns <b>red litmus blue</b>.</li>' +
              '<li>A <b>neutral</b> substance does <b>not change</b> the colour of either litmus.</li>' +
              '</ul>' },
      { h: 'Natural indicators',
        body: '<p>Many indicators come straight from nature:</p>' +
              '<ul>' +
              '<li><b>Turmeric (haldi)</b> is yellow; it stays yellow in acids but turns <b>red-brown</b> in bases, that is why a turmeric stain turns red when soap is applied.</li>' +
              '<li><b>China rose (gudhal)</b> turns acids <b>pink/magenta</b> and bases <b>green</b>.</li>' +
              '<li><b>Red cabbage</b> and <b>beetroot</b> juice also work as indicators.</li>' +
              '</ul>' },
      { h: 'Neutralisation',
        body: '<p>When an acid and a base are mixed in the right amounts, they cancel each other’s nature and form <b>salt and water</b>, releasing heat. This reaction is called <b>neutralisation</b>.</p>' +
              '<div class="nterm"><b>Acid + Base → Salt + Water</b>, this reaction is called <b>neutralisation</b>.</div>' },
      { h: 'Neutralisation in daily life',
        body: '<ul>' +
              '<li><b>Indigestion:</b> too much acid in the stomach is neutralised by an <b>antacid</b> (a mild base such as milk of magnesia).</li>' +
              '<li><b>Ant or bee sting:</b> the acid injected is neutralised by rubbing on <b>baking soda</b> (a base).</li>' +
              '<li><b>Soil treatment:</b> acidic soil is treated with <b>lime</b> (a base); very basic soil is treated with organic matter or compost.</li>' +
              '<li><b>Factory wastes:</b> acidic wastes are neutralised before release so they do not harm rivers and living things.</li>' +
              '</ul>' }
    ],
    recap: [
      'Substances are acidic (sour), basic (bitter and soapy) or neutral.',
      'Indicators show the nature: acids turn blue litmus red; bases turn red litmus blue.',
      'Turmeric and china rose are common natural indicators.',
      'Acid + base → salt + water (neutralisation), used in antacids, stings, soil and waste treatment.'
    ]
  },

  'electricity-circuits': {
    read: 8,
    sections: [
      { h: 'The electric cell, a source of electricity',
        body: '<p>An <b>electric cell</b> stores chemical energy and supplies electricity. It has two <b>terminals</b>, a <b>positive (+)</b> and a <b>negative (–)</b>. When two or more cells are joined together, they form a <b>battery</b>.</p>' +
              '<div class="nterm">A <b>battery</b> is a combination of two or more cells; the <b>+</b> terminal of one cell is joined to the <b>–</b> terminal of the next.</div>' },
      { h: 'What is an electric circuit?',
        body: '<p>An <b>electric circuit</b> is the complete path along which electric current flows, starting from the <b>positive</b> terminal of the cell, through the wires and components, and back to the <b>negative</b> terminal.</p>' +
              '<div class="nterm">Current flows only when the path is <b>complete (closed)</b>; a break anywhere stops it.</div>' },
      { h: 'Open and closed circuits',
        body: '<ul>' +
              '<li>A <b>closed circuit</b> has no gaps, so current flows and the bulb <b>glows</b>.</li>' +
              '<li>An <b>open circuit</b> has a break, so no current flows and the bulb stays <b>off</b>.</li>' +
              '</ul>' },
      { h: 'The switch',
        body: '<p>A <b>switch</b> is a simple device that opens or closes a circuit. Switching it <b>ON</b> closes the circuit and the bulb glows; switching it <b>OFF</b> opens the circuit and the bulb goes off. Switches let us control appliances conveniently and safely.</p>' },
      { h: 'The bulb and the LED',
        body: '<p>In an <b>incandescent bulb</b>, current heats a thin coiled wire called the <b>filament</b> until it glows. If the filament breaks, the bulb is <b>fused</b> and will not light. An <b>LED</b> (light-emitting diode) gives light using very little electricity and has two leads, a longer <b>(+)</b> and a shorter <b>(–)</b>, so it must be connected the right way round.</p>' +
              '<div class="nterm">The <b>filament</b> is the thin, high-resistance wire in a bulb that glows when current passes through it.</div>' },
      { h: 'Conductors and insulators',
        body: '<p>Materials that <b>allow</b> current to pass through them are <b>conductors</b>, most metals such as copper and aluminium (and graphite). Materials that <b>do not allow</b> current are <b>insulators</b>, plastic, rubber, wood and glass. A wire has a <b>copper conductor</b> inside a <b>plastic insulator</b> for safety.</p>' +
              '<div class="nterm"><b>Conductors</b> let current flow; <b>insulators</b> stop it, that is why switches and plugs are covered in plastic or rubber.</div>' },
      { h: 'Effects of current & staying safe',
        body: '<p>Electric current can produce a <b>heating effect</b> (used in heaters, and it makes a bulb’s filament glow) and a <b>magnetic effect</b> (used in electromagnets). Electricity must always be used with care, never touch switches or wires with <b>wet hands</b>, and never experiment with electricity from <b>wall sockets (mains)</b>.</p>' }
    ],
    recap: [
      'A cell has + and – terminals; joining cells makes a battery.',
      'Current flows only in a complete (closed) circuit; a switch opens or closes it.',
      'A bulb glows when current heats its filament; an LED uses little electricity and is direction-sensitive.',
      'Conductors (metals) allow current; insulators (plastic, rubber) do not, and current has heating and magnetic effects.'
    ]
  }
};

/* ------------------------------------------------------------------
   View switching
   ------------------------------------------------------------------ */
function $(id){ return document.getElementById(id); }
var STAGES = ['hubStage','notesStage','videoStage','placeholderStage'];
function show(id){
  STAGES.forEach(function(s){
    var el = $(s);
    if(el) el.style.display = (s === id) ? 'flex' : 'none';
  });
  // A hidden <video> keeps playing, so leaving the video stage stops it.
  if(id !== 'videoStage'){ var p = $('player'); if(p && !p.paused) p.pause(); }
  try { window.scrollTo(0, 0); } catch(e){}
}

/* ------------------------------------------------------------------
   Notes rendering
   ------------------------------------------------------------------ */
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
}); }

// Teacher-uploaded notes for this chapter, filled by the note-lookup script.
// null = still loading, [] = none exist, [ ... ] = downloadable uploads.
var uploadedNotes = null;

function fmtBytes(n){
  n = Number(n) || 0;
  if (n >= 1048576) return (n / 1048576).toFixed(1) + ' MB';
  if (n >= 1024) return Math.round(n / 1024) + ' KB';
  return n + ' B';
}

// Render the uploaded notes as token-authed download links (a plain <a> can't
// send an auth header, so the token rides the query string like video stream).
function uploadedNotesHTML(){
  if (!uploadedNotes || !uploadedNotes.length) return '';
  var token = (window.EduAPI && EduAPI.getToken && EduAPI.getToken()) || '';
  var base = (window.EduAPI && EduAPI.API_BASE) || '';
  var items = uploadedNotes.map(function(n){
    var href = base + n.fileUrl + '?token=' + encodeURIComponent(token);
    var meta = [n.uploadedByName ? 'By ' + n.uploadedByName : '', fmtBytes(n.size)].filter(Boolean).join(' · ');
    return '<a class="dlnote" href="' + href + '" target="_blank" rel="noopener">' +
      '<span class="dlnote__ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg></span>' +
      '<span class="dlnote__body"><span class="dlnote__t">' + esc(n.title || 'Notes') + '</span>' +
      (meta ? '<span class="dlnote__m">' + esc(meta) + '</span>' : '') + '</span></a>';
  }).join('');
  return '<div class="nsec"><h2 class="nsec__h"><span class="n">' +
    (uploadedNotes.length < 10 ? '0' : '') + uploadedNotes.length +
    '</span>Downloadable notes</h2><div class="dlnotes">' + items + '</div></div>';
}

function renderNotes(){
  var note = LESSON.slug ? NOTES[LESSON.slug] : null;
  var host = $('notesBody');
  var head =
    '<div class="notes__crumb mono">' + esc(LESSON.chapterCrumb || 'Lesson') + '</div>' +
    '<h1 class="notes__title">' + esc(LESSON.chapterTitle || 'Notes') + '</h1>';

  var uploads = uploadedNotesHTML();

  // Nothing authored AND nothing uploaded, a loading-aware placeholder.
  if(!note && !uploads){
    var msg = uploadedNotes === null
      ? 'Checking for notes…'
      : 'Notes for this chapter are being written and will appear here soon.<br>In the meantime you can watch the video lecture.';
    host.innerHTML = head + '<hr class="notes__hr"><p class="notes__empty">' + msg + '</p>';
    return;
  }

  var html = head;

  if(note){
    html +=
      '<div class="notes__read">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>' +
        note.read + ' min read</div>' +
      '<hr class="notes__hr">';

    note.sections.forEach(function(sec, i){
      var n = (i + 1 < 10 ? '0' : '') + (i + 1);
      html += '<div class="nsec"><h2 class="nsec__h"><span class="n">' + n + '</span>' + esc(sec.h) + '</h2>' + sec.body + '</div>';
    });

    if(note.recap && note.recap.length){
      html += '<div class="nrecap"><div class="nrecap__h">Quick recap</div><ul>';
      note.recap.forEach(function(r){ html += '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' + esc(r) + '</li>'; });
      html += '</ul></div>';
    }
  }

  if(uploads){
    if(note) html += '<hr class="notes__hr">';
    html += uploads;
  }

  host.innerHTML = html;
}

// Called by the note-lookup script once the API responds (or fails).
function setNotes(list){
  uploadedNotes = list || [];
  var notesTag = $('notesTag'), notesTagTxt = $('notesTagText');
  if(notesTag && notesTagTxt){
    var hasStatic = !!(LESSON.slug && NOTES[LESSON.slug]);
    if(uploadedNotes.length){
      notesTag.classList.add('is-live');
      notesTagTxt.textContent = uploadedNotes.length + ' note' + (uploadedNotes.length > 1 ? 's' : '') + (hasStatic ? ' + summary' : '');
    } else if(hasStatic){
      notesTag.classList.add('is-live');
      notesTagTxt.textContent = 'Notes ready';
    } else {
      notesTag.classList.remove('is-live');
      notesTagTxt.textContent = 'Coming soon';
    }
  }
  renderNotes(); // refresh the (possibly open) notes stage in place
}

/* ------------------------------------------------------------------
   Video option state, driven by the video-lookup script below.
   'loading' → still checking; 'ready' → an upload exists; 'none' → none.
   ------------------------------------------------------------------ */
var videoState = 'loading';
var videoSectionActive = false;

function paintVideoTag(){
  var tag = $('videoTag'), txt = $('videoTagText');
  if(!tag || !txt) return;
  if(videoState === 'ready'){ tag.classList.add('is-live'); txt.textContent = 'Lecture available'; }
  else if(videoState === 'none'){ tag.classList.remove('is-live'); txt.textContent = 'Coming soon'; }
  else { tag.classList.remove('is-live'); txt.textContent = 'Checking…'; }
}

function openVideo(){
  videoSectionActive = true;
  if(videoState === 'ready'){ show('videoStage'); }
  else if(videoState === 'none'){ show('placeholderStage'); }
  else { show('placeholderStage'); } // still loading, placeholder, upgraded on resolve
}

// Called by the video-lookup script once the API responds.
function setVideoState(state){
  videoState = state;
  paintVideoTag();
  if(videoSectionActive) openVideo(); // upgrade the view if the user is waiting on it
}

/* ------------------------------------------------------------------
   Wire up the hub
   ------------------------------------------------------------------ */
function goHub(){ videoSectionActive = false; show('hubStage'); }

document.addEventListener('DOMContentLoaded', function(){
  paintVideoTag();
  renderNotes();

  // Mark on the Notes card whether real notes exist for this chapter.
  var notesTag = $('notesTag'), notesTagTxt = $('notesTagText');
  if(notesTag && notesTagTxt){
    if(LESSON.slug && NOTES[LESSON.slug]){ notesTag.classList.add('is-live'); notesTagTxt.textContent = 'Notes ready'; }
    else { notesTagTxt.textContent = 'Coming soon'; }
  }

  var on = $('optNotes'); if(on) on.addEventListener('click', function(){ show('notesStage'); });
  var ov = $('optVideo'); if(ov) ov.addEventListener('click', openVideo);
  Array.prototype.forEach.call(document.querySelectorAll('[data-tohub]'), function(b){
    b.addEventListener('click', goHub);
  });

  // Deep-link from Learn's module icons: skip the hub and open the requested
  // resource directly. 'video' arms the video section so it reveals (and the
  // lookup below auto-plays part 1) as soon as the lecture resolves; while it
  // loads the placeholder shows. 'notes' opens the notes stage right away
  // (it re-renders in place once the uploaded notes arrive).
  if(LESSON.view === 'notes'){
    show('notesStage');
  } else if(LESSON.view === 'video'){
    videoSectionActive = true;
    openVideo();
  }
});

return { setVideoState: setVideoState, setNotes: setNotes };
})();


/* ---- next <script> block ---- */


(function(){
'use strict';
// Only academic chapters (not "beyond academics" tracks) have uploaded
// lecture videos, those are keyed by class/subject/topic, tracks aren't.
// When we can't look one up, tell the hub so the Video option resolves to
// "Coming soon" instead of hanging on "Checking…".
if (!LESSON.cls || !LESSON.subject || !LESSON.slug || !window.EduAPI) {
  if (window.HUB) {
    window.HUB.setVideoState('none');
    if (window.HUB.setNotes) window.HUB.setNotes([]);
  }
  return;
}

var searchTerm = LESSON.slug.replace(/-/g, ' ');

// Uploaded notes for this chapter, same class/subject/topic lookup as videos,
// so a chapter surfaces its notes wherever a teacher filed them.
EduAPI.listNotes({ className: LESSON.cls, subject: LESSON.subject, topic: searchTerm })
  .then(function(notes){ if (window.HUB && window.HUB.setNotes) window.HUB.setNotes(notes || []); })
  .catch(function(){ if (window.HUB && window.HUB.setNotes) window.HUB.setNotes([]); });

EduAPI.listVideos({ className: LESSON.cls, subject: LESSON.subject, topic: searchTerm })
  .then(function(videos){
    if (!videos.length) { if (window.HUB) window.HUB.setVideoState('none'); return; }

    // A chapter can have several parts. If every title carries an explicit part
    // number ("… - Part 3", "Ep 2", "4. Foo") use that; otherwise fall back to
    // upload order (oldest first), which is how the parts were uploaded.
    videos.forEach(function(v){
      var m = String(v.title || '').match(/(?:part|episode|ep)\s*(\d+)|^\s*(\d+)\s*[.)\-–\u2014]|[-–\u2014]\s*(\d+)\s*$/i);
      v._num = m ? parseInt(m[1] || m[2] || m[3], 10) : null;
    });
    var allNumbered = videos.every(function(v){ return v._num != null; });
    videos.sort(function(a, b){
      return allNumbered ? a._num - b._num
                         : new Date(a.createdAt) - new Date(b.createdAt);
    });
    videos.forEach(function(v, i){ v._part = allNumbered ? v._num : i + 1; });

    document.getElementById('videoCrumb').textContent = LESSON.chapterCrumb;
    document.getElementById('videoClassTag').textContent = videos[0].className;
    document.getElementById('videoSubjectTag').textContent = videos[0].subject;

    var player   = document.getElementById('player');
    var titleEl  = document.getElementById('videoTitle');
    var byline   = document.getElementById('videoByline');
    var playlist = document.getElementById('videoPlaylist');
    var viewed   = {};

    // <video src> can't send an Authorization header, and streaming is
    // eligibility-gated server-side, pass the token as a query param.
    function select(v, autoplay){
      titleEl.textContent = v.title || LESSON.chapterTitle;
      byline.textContent  = 'By ' + (v.uploadedByName || 'Teacher') + ' · ' + v.views + ' views';
      player.src = EduAPI.API_BASE + '/api/videos/' + v.id + '/stream?token=' + encodeURIComponent(EduAPI.getToken());
      player.setAttribute('data-id', v.id);
      Array.prototype.forEach.call(playlist.querySelectorAll('.vpitem'), function(el){
        el.classList.toggle('is-active', el.getAttribute('data-id') === v.id);
      });
      if (autoplay) player.play().catch(function(){});
    }

    // Count a view once per part, on first play.
    player.addEventListener('play', function(){
      var id = player.getAttribute('data-id');
      if (id && !viewed[id]) { viewed[id] = true; EduAPI.recordVideoView(id); }
    });

    // Render the part list only when there's more than one.
    if (videos.length > 1) {
      playlist.style.display = 'flex';
      playlist.innerHTML = '<div class="vplaylist__hd">' + videos.length + ' parts in this chapter</div>';
      videos.forEach(function(v){
        var b = document.createElement('button');
        b.className = 'vpitem';
        b.setAttribute('data-id', v.id);
        b.innerHTML = '<span class="vpitem__n">' + v._part + '</span>' +
                      '<span class="vpitem__t"></span>' +
                      '<span class="vpitem__meta">' + v.views + ' views</span>';
        // Badge already shows the number, so drop a leading "Part N - " prefix.
        b.querySelector('.vpitem__t').textContent =
          (v.title || ('Part ' + v._part)).replace(/^\s*part\s*\d+\s*[-–\u2014:.]\s*/i, '');
        b.addEventListener('click', function(){ select(v, true); });
        playlist.appendChild(b);
      });
    }

    select(videos[0], false);

    // A lecture exists, light up the "Watch Video" option on the hub. The hub
    // controller reveals the player if the student is already waiting on it.
    if (window.HUB) window.HUB.setVideoState('ready');

    // Auto-play part 1 when the student deep-linked in via Learn's Video icon.
    // Done AFTER setVideoState so the stage is already visible (playing a
    // display:none <video> is unreliable). Browsers may still gate
    // autoplay-with-sound; the rejection is swallowed and the loaded video sits
    // ready with its controls for a single tap.
    if (LESSON.view === 'video') { player.play().catch(function(){}); }

    // Not actually eligible for this specific video (e.g. wrong class/subject)
    //, fall back to the honest placeholder instead of a broken player.
    player.addEventListener('error', function(){
      if (window.HUB) window.HUB.setVideoState('none');
    });
  })
  .catch(function(){ if (window.HUB) window.HUB.setVideoState('none'); });
})();

}
