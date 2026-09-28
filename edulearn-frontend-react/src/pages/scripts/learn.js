/* Lifted verbatim from edulearn-frontend/learn.html, do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {

/* ============================================================
   BESTBRAIN · LEARN, application script
   ============================================================ */
(function(){
'use strict';

/* ------------------------------------------------------------
   1 · SHARED STATE  (localStorage "edulearn_state")
   ------------------------------------------------------------ */
var STATE_KEY = 'edulearn_state';

var STATE_DEFAULTS = {
  lang: 'en',
  streak: 12,
  minutes: [34, 52, 41, 68, 45, 72, 58],
  badges: ['photosynthesis', 'fractions', 'electricity'],
  // No seeded chapters: progress starts empty and is filled from the backend
  // for signed-in users (and from the user's own activity locally). This is
  // what keeps a brand-new user from seeing progress they never earned.
  chapters: {},
  pal: { level: 1, remedialMastery: 0, finalUnlocked: false, hints: 3, skips: 1 }
};

function cloneObj(o){ return JSON.parse(JSON.stringify(o)); }

function loadState(){
  var base = cloneObj(STATE_DEFAULTS);
  try{
    var raw = localStorage.getItem(STATE_KEY);
    if(!raw){
      localStorage.setItem(STATE_KEY, JSON.stringify(base));
      return base;
    }
    var saved = JSON.parse(raw);
    if(!saved || typeof saved !== 'object') return base;
    // merge over defaults, defensively
    var merged = base;
    Object.keys(saved).forEach(function(k){
      if(k === 'chapters' && saved.chapters && typeof saved.chapters === 'object'){
        Object.keys(saved.chapters).forEach(function(id){
          merged.chapters[id] = saved.chapters[id];
        });
      } else if(k === 'pal' && saved.pal && typeof saved.pal === 'object'){
        Object.keys(saved.pal).forEach(function(p){ merged.pal[p] = saved.pal[p]; });
      } else {
        merged[k] = saved[k];
      }
    });
    return merged;
  }catch(e){
    return base;
  }
}

function saveState(st){
  try{ localStorage.setItem(STATE_KEY, JSON.stringify(st)); }catch(e){ /* private mode etc. */ }
}

var state = loadState();
// Hindi is disabled in production (see the commented-out toggle above) ,
// force English regardless of a stale localStorage value from before.
state.lang = 'en';

/* ------------------------------------------------------------
   2 · i18n
   ------------------------------------------------------------ */
var I18N = {
  en: {
    nav_home: 'Home',
    nav_learn: 'Learn',
    nav_live: 'Live',
    nav_arena: 'Arena',
    nav_tests: 'Tests',
    nav_pal: 'PAL AI',
    nav_dash: 'Dashboard',
    nav_cta: 'Start free',
    hero_title: 'Choose your <em>battlefield.</em>',
    chip1: 'One subscription, all classes unlocked',
    chip2: 'Study ahead or revisit any class, no stigma',
    class_word: 'Class',
    chapters_word: 'chapters',
    search_ph: 'Search Class {n} chapters...',
    try_chip: 'try “{name}”?',
    results_for: 'Results across Class',
    continue_title: 'Continue learning',
    resume: 'Resume',
    beyond_title: 'Beyond academics',
    mastered: 'Mastered',
    done: 'Done',
    empty_title: 'No chapters found',
    empty_pre: 'Tokky suggests -',
    footer_tag: 'Made for Bharat. Works fully offline.',
    tokky_name: 'Tokky says:',
    tokky_tip_progress: 'You’re {pct}% through {title}, keep going!',
    tokky_tip_empty: 'Pick a chapter above and Tokky will cheer you on as you go.',
    beyond_yoga: 'Yoga & Mindfulness',
    beyond_fin: 'Financial Literacy',
    beyond_music: 'Music',
    beyond_career: 'Career Orientation'
  },
  hi: {
    nav_home: 'होम',
    nav_learn: 'सीखें',
    nav_live: 'लाइव',
    nav_arena: 'अरीना',
    nav_tests: 'टेस्ट',
    nav_pal: 'PAL AI',
    nav_dash: 'डैशबोर्ड',
    nav_cta: 'मुफ़्त शुरू करें',
    hero_title: 'अपना <em>रणक्षेत्र</em> चुनें।',
    chip1: 'एक सब्सक्रिप्शन, सभी कक्षाएँ अनलॉक',
    chip2: 'आगे पढ़ें या कोई भी कक्षा दोहराएँ, बिना झिझक',
    class_word: 'कक्षा',
    chapters_word: 'अध्याय',
    search_ph: 'कक्षा {n} के अध्याय खोजें...',
    try_chip: '“{name}” आज़माएँ?',
    results_for: 'परिणाम, कक्षा',
    continue_title: 'सीखना जारी रखें',
    resume: 'फिर शुरू करें',
    beyond_title: 'पढ़ाई से आगे',
    mastered: 'महारत',
    done: 'पूरा',
    empty_title: 'कोई अध्याय नहीं मिला',
    empty_pre: 'Tokky का सुझाव -',
    footer_tag: 'भारत के लिए बना। पूरी तरह ऑफ़लाइन चलता है।',
    tokky_name: 'Tokky कहता है:',
    tokky_tip_progress: 'आप {title} में {pct}% पहुँच गए, ऐसे ही जारी रखें!',
    tokky_tip_empty: 'ऊपर से एक अध्याय चुनें, Tokky आपका उत्साह बढ़ाएगा।',
    beyond_yoga: 'योग और माइंडफुलनेस',
    beyond_fin: 'वित्तीय साक्षरता',
    beyond_music: 'संगीत',
    beyond_career: 'करियर मार्गदर्शन'
  }
};

function t(key){
  var dict = I18N[state.lang] || I18N.en;
  return dict[key] !== undefined ? dict[key] : (I18N.en[key] || key);
}

function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    // The sidebar rail carries its own icons inside these links; rewriting
    // its innerHTML wiped them out.
    if (el.closest('#kid-rail, #kid-top')) return;
    el.innerHTML = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')).replace('{n}', activeClass));
  });
  document.documentElement.lang = state.lang === 'hi' ? 'hi' : 'en';
  // Toggle buttons are commented out (Hindi disabled), guard their absence.
  var en = document.getElementById('langEn');
  var hi = document.getElementById('langHi');
  if (en) en.classList.toggle('is-on', state.lang === 'en');
  if (hi) hi.classList.toggle('is-on', state.lang === 'hi');
  // Re-render (not just data-i18n swap) since this uses a {pct}/{title} template.
  try { renderTokkyTip(); } catch(e){}
}

function setLang(lang){
  if(state.lang === lang) return;
  state.lang = lang;
  saveState(state);
  applyI18n();
  renderAll(false);
}

/* ------------------------------------------------------------
   3 · SVG ICON LIBRARY (all hand-built, 1.5px stroke, round caps)
   ------------------------------------------------------------ */
var STROKE = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

var ICONS = {
  /* subject icons, bespoke */
  maths: '<svg width="24" height="24" viewBox="0 0 24 24" ' + STROKE + ' aria-hidden="true">' +
         '<path d="M2.5 21.5 L8 16" opacity=".55"/>' +
         '<path d="M4.2 19.8 l1.1 1.1 M6 18 l1.1 1.1" opacity=".55"/>' +
         '<circle cx="13.5" cy="4.5" r="1.8"/>' +
         '<path d="M12.6 6.1 L8 20.5 M14.4 6.1 L19 20.5"/>' +
         '<path d="M9.9 14.5 a7.5 7.5 0 0 0 7.2 0"/>' +
         '</svg>',
  science: '<svg width="24" height="24" viewBox="0 0 24 24" ' + STROKE + ' aria-hidden="true">' +
         '<ellipse cx="12" cy="12" rx="9.5" ry="3.8"/>' +
         '<ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/>' +
         '<ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(-60 12 12)"/>' +
         '<circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>' +
         '</svg>',
  social: '<svg width="24" height="24" viewBox="0 0 24 24" ' + STROKE + ' aria-hidden="true">' +
         '<circle cx="12" cy="12" r="9.5"/>' +
         '<ellipse cx="12" cy="12" rx="4.2" ry="9.5"/>' +
         '<path d="M2.5 12 h19 M4 7 h16 M4 17 h16"/>' +
         '</svg>',
  english: '<svg width="24" height="24" viewBox="0 0 24 24" ' + STROKE + ' aria-hidden="true">' +
         '<path d="M2.5 4.5 h6 a3.5 3.5 0 0 1 3.5 3.5 v12 a2.8 2.8 0 0 0 -2.8 -2.8 h-6.7 Z"/>' +
         '<path d="M21.5 4.5 h-6 a3.5 3.5 0 0 0 -3.5 3.5 v12 a2.8 2.8 0 0 1 2.8 -2.8 h6.7 Z"/>' +
         '</svg>',
  hindi: '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">' +
         '<path d="M3 4.5 h18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
         '<text x="12" y="19" text-anchor="middle" font-size="15" font-weight="600" fill="currentColor" font-family="\'Nunito\',sans-serif">अ</text>' +
         '</svg>',
  /* modality icons, tiny */
  video: '<svg width="13" height="13" viewBox="0 0 24 24" ' + STROKE + '>' +
         '<rect x="2.5" y="4.5" width="19" height="15" rx="3.5"/>' +
         '<path d="M10 9 l5.5 3 L10 15 Z"/>' +
         '</svg>',
  notes: '<svg width="13" height="13" viewBox="0 0 24 24" ' + STROKE + '>' +
         '<path d="M14 2.5 H7 a2 2 0 0 0 -2 2 v15 a2 2 0 0 0 2 2 h10 a2 2 0 0 0 2 -2 V7.5 Z"/>' +
         '<path d="M14 2.5 V7.5 H19 M9 12 h6 M9 16 h4"/>' +
         '</svg>',
  test: '<svg width="13" height="13" viewBox="0 0 24 24" ' + STROKE + '>' +
         '<rect x="4.5" y="3.5" width="15" height="18" rx="2.5"/>' +
         '<path d="M9 3.5 a3 3 0 0 1 6 0"/>' +
         '<path d="M8.5 13.5 l2.4 2.4 L16 11"/>' +
         '</svg>',
  /* Question bank, a stack of cards, i.e. a pool to draw from. Deliberately
     not another clipboard: the bank has to read as different from the test at
     a glance, since they now sit next to each other on every row. */
  bank: '<svg width="13" height="13" viewBox="0 0 24 24" ' + STROKE + '>' +
         '<rect x="3.5" y="7.5" width="14" height="13" rx="2.5"/>' +
         '<path d="M7 4.5 h11 a2.5 2.5 0 0 1 2.5 2.5 v11" opacity=".55"/>' +
         '<path d="M7.5 12.5 h6M7.5 16 h4"/>' +
         '</svg>',
  /* Homework, a page with a turned corner and a tick. */
  homework: '<svg width="13" height="13" viewBox="0 0 24 24" ' + STROKE + '>' +
         '<path d="M6 2.5 h7.5 L19.5 8.5 V21.5 H6 z"/>' +
         '<path d="M13.5 2.5 V8.5 H19.5" opacity=".55"/>' +
         '<path d="M9 14.5 l2.2 2.2 L16 12.2"/>' +
         '</svg>',
  /* misc */
  check: '<svg width="10" height="10" viewBox="0 0 24 24" ' + STROKE + '><path d="M4 12.5 l5.5 5.5 L20 7"/></svg>',
  arrow: '<svg width="17" height="17" viewBox="0 0 24 24" ' + STROKE + '><path d="M4 12 h16 M13 5 l7 7 -7 7"/></svg>',
  play:  '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5 L19.5 12 L7 19.5 Z"/></svg>',
  chev:  '<svg class="chev" width="14" height="14" viewBox="0 0 24 24" ' + STROKE + '><path d="M9 5 l7 7 -7 7"/></svg>',
  /* beyond academics */
  yoga: '<svg width="17" height="17" viewBox="0 0 24 24" ' + STROKE + '>' +
        '<circle cx="12" cy="4.8" r="2.2"/>' +
        '<path d="M12 7.5 v5"/>' +
        '<path d="M12 12.5 c-2.6 0 -4.6 1.6 -5.4 4 M12 12.5 c2.6 0 4.6 1.6 5.4 4"/>' +
        '<path d="M3.5 19.5 c2.5 -1.8 6 -2.6 8.5 -2.6 s6 .8 8.5 2.6"/>' +
        '</svg>',
  fin:  '<svg width="17" height="17" viewBox="0 0 24 24" ' + STROKE + '>' +
        '<path d="M6 3.5 h12 M6 8 h12 M6 3.5 c5 0 7 2 7 4.5 s-2 4.5 -7 4.5 l7 8"/>' +
        '</svg>',
  music:'<svg width="17" height="17" viewBox="0 0 24 24" ' + STROKE + '>' +
        '<path d="M9 18.5 V5.5 l11.5 -2 v13"/>' +
        '<circle cx="6.2" cy="18.5" r="2.8"/>' +
        '<circle cx="17.7" cy="16.5" r="2.8"/>' +
        '</svg>',
  career:'<svg width="17" height="17" viewBox="0 0 24 24" ' + STROKE + '>' +
        '<circle cx="12" cy="12" r="9.5"/>' +
        '<path d="M15.8 8.2 l-2.2 5.4 -5.4 2.2 2.2 -5.4 Z"/>' +
        '</svg>'
};

/* Tokky the spark-bot, reusable */
function tokkySVG(size){
  return '<svg class="tokky" width="' + size + '" height="' + size + '" viewBox="0 0 100 100" aria-hidden="true">' +
    '<circle class="tokky-halo" cx="50" cy="9" r="7" fill="#3DE8C5"/>' +
    '<line x1="50" y1="21" x2="50" y2="12" stroke="#7C9BFF" stroke-width="2.5" stroke-linecap="round"/>' +
    '<circle class="tokky-tip" cx="50" cy="9" r="4" fill="#3DE8C5"/>' +
    '<circle cx="50" cy="56" r="34" fill="#121C30" stroke="url(#auroraGrad)" stroke-width="2.5"/>' +
    '<rect class="tokky-eye" x="36" y="44" width="8" height="14" rx="4" fill="#F2EDE3"/>' +
    '<rect class="tokky-eye" x="56" y="44" width="8" height="14" rx="4" fill="#F2EDE3"/>' +
    '<path d="M42 67 q8 7 16 0" fill="none" stroke="#F2EDE3" stroke-width="2.5" stroke-linecap="round"/>' +
    '<circle cx="30" cy="62" r="3" fill="#FF7AA2" opacity=".45"/>' +
    '<circle cx="70" cy="62" r="3" fill="#FF7AA2" opacity=".45"/>' +
    '</svg>';
}

/* ------------------------------------------------------------
   4 · CURRICULUM DATA - 4 classes × 5 subjects, real NCERT names
       chapter = [slug, name, minutes]
   ------------------------------------------------------------ */
var SUBJECTS = [
  { key:'maths',   code:'math', en:'Mathematics',    hi:'गणित',           accent:'#7C9BFF', icon:'maths'   },
  { key:'science', code:'sci',  en:'Science',         hi:'विज्ञान',         accent:'#3DE8C5', icon:'science' },
  { key:'social',  code:'sst',  en:'Social Science',  hi:'सामाजिक विज्ञान', accent:'#FFB454', icon:'social'  },
  { key:'english', code:'eng',  en:'English',         hi:'अंग्रेज़ी',        accent:'#FF7AA2', icon:'english' },
  { key:'hindi',   code:'hin',  en:'Hindi',           hi:'हिंदी',           accent:'#A78BFA', icon:'hindi'   }
];

var CLASS_COLORS = { 6:'#3DE8C5', 7:'#FFB454', 8:'#7C9BFF', 9:'#FF7AA2' };

var CURRICULUM = {
  6: {
    maths: [
      ['knowing-numbers','Knowing Our Numbers',24],
      ['whole-numbers','Whole Numbers',21],
      ['playing-numbers','Playing with Numbers',26],
      ['geometrical-ideas','Basic Geometrical Ideas',19],
      ['elementary-shapes','Understanding Elementary Shapes',23],
      ['integers','Integers',20],
      ['fractions','Fractions',28],
      ['decimals','Decimals',22],
      ['data-handling','Data Handling',17],
      ['mensuration','Mensuration',25]
    ],
    science: [
      ['food-sources','Food: Where Does It Come From?',16],
      ['components-of-food','Components of Food',19],
      ['fibre-to-fabric','Fibre to Fabric',18],
      ['sorting-materials','Sorting Materials into Groups',17],
      ['separation','Separation of Substances',21],
      ['changes-around-us','Changes Around Us',15],
      ['getting-to-know-plants','Getting to Know Plants',22],
      ['body-movements','Body Movements',20],
      ['living-organisms','The Living Organisms and Their Surroundings',24],
      ['light-shadows','Light, Shadows and Reflections',23]
    ],
    social: [
      ['what-where-how-when','What, Where, How and When?',18],
      ['earliest-people','On the Trail of the Earliest People',20],
      ['gathering-to-growing','From Gathering to Growing Food',19],
      ['earliest-cities','In the Earliest Cities',21],
      ['kingdoms-republic','Kingdoms, Kings and an Early Republic',23],
      ['earth-solar-system','The Earth in the Solar System',22],
      ['latitudes-longitudes','Globe: Latitudes and Longitudes',24],
      ['motions-of-earth','Motions of the Earth',17],
      ['understanding-diversity','Understanding Diversity',16]
    ],
    english: [
      ['patricks-homework','Who Did Patrick’s Homework?',14],
      ['dog-new-master','How the Dog Found Himself a New Master',15],
      ['taros-reward','Taro’s Reward',16],
      ['kalpana-chawla','An Indian-American Woman in Space',18],
      ['different-school','A Different Kind of School',15],
      ['who-i-am','Who I Am',13],
      ['fair-play','Fair Play',14],
      ['game-of-chance','A Game of Chance',15],
      ['banyan-tree','The Banyan Tree',17]
    ],
    hindi: [
      ['vah-chidiya','वह चिड़िया जो',12],
      ['bachpan','बचपन',14],
      ['nadan-dost','नादान दोस्त',15],
      ['chand-se-gappein','चाँद से थोड़ी-सी गप्पें',13],
      ['aksharon-ka-mahatva','अक्षरों का महत्व',16],
      ['par-nazar-ke','पार नज़र के',15],
      ['saathi-haath','साथी हाथ बढ़ाना',12],
      ['ticket-album','टिकट-अलबम',14],
      ['jhansi-ki-rani','झाँसी की रानी',18]
    ]
  },
  7: {
    maths: [
      ['integers','Integers',22],
      ['fractions-decimals','Fractions and Decimals',26],
      ['data-handling','Data Handling',18],
      ['simple-equations','Simple Equations',24],
      ['lines-angles','Lines and Angles',21],
      ['triangle-properties','The Triangle and its Properties',25],
      ['congruence','Congruence of Triangles',20],
      ['comparing-quantities','Comparing Quantities',23],
      ['rational-numbers','Rational Numbers',24],
      ['perimeter-area','Perimeter and Area',22]
    ],
    // Content-complete chapters first (videos + notes): electricity, metals,
    // physical/chemical changes, adolescence, then ch7 (heat) and ch8 (time &
    // motion); the rest follow. This inline copy is what the Learn page renders
    // (the shared curriculum.js drives dashboard/lesson), keep both in sync.
    science: [
      ['electricity-circuits','Electricity: Circuits and their Components',26],
      ['metals-nonmetals','The World of Metals and Non-metals',22],
      ['physical-chemical-changes','Changes Around Us: Physical and Chemical',24],
      ['adolescence','Adolescence: A Stage of Growth and Change',26],
      ['heat-transfer','Heat Transfer in Nature',24],
      ['time-and-motion','Measurement of Time and Motion',22],
      ['evolving-science','The Ever-Evolving World of Science',18],
      ['acidic-basic-neutral','Exploring Substances: Acidic, Basic & Neutral',22],
      ['life-processes-animals','Life Processes in Animals',24],
      ['life-processes-plants','Life Processes in Plants',22],
      ['light-shadows','Light: Shadows and Reflections',23],
      ['earth-moon-sun','Earth, Moon and the Sun',20]
    ],
    social: [
      ['thousand-years','Tracing Changes Through a Thousand Years',20],
      ['new-kings','New Kings and Kingdoms',21],
      ['delhi-sultans','The Delhi Sultans',23],
      ['mughal-empire','The Mughal Empire',26],
      ['rulers-buildings','Rulers and Buildings',19],
      ['environment','Environment',18],
      ['inside-our-earth','Inside Our Earth',20],
      ['on-equality','On Equality',17],
      ['markets-around-us','Markets Around Us',16]
    ],
    english: [
      ['three-questions','Three Questions',15],
      ['gift-of-chappals','A Gift of Chappals',16],
      ['gopal-hilsa','Gopal and the Hilsa-Fish',14],
      ['ashes-trees-bloom','The Ashes That Made Trees Bloom',17],
      ['quality','Quality',15],
      ['expert-detectives','Expert Detectives',16],
      ['vita-wonk','The Invention of Vita-Wonk',14],
      ['fire-friend-foe','Fire: Friend and Foe',15],
      ['story-of-cricket','The Story of Cricket',18]
    ],
    hindi: [
      ['hum-panchhi','हम पंछी उन्मुक्त गगन के',12],
      ['dadi-maa','दादी माँ',15],
      ['himalay-betiyan','हिमालय की बेटियाँ',14],
      ['kathputli','कठपुतली',11],
      ['mithaiwala','मिठाईवाला',16],
      ['rakt-sharir','रक्त और हमारा शरीर',17],
      ['papa-kho-gaye','पापा खो गए',15],
      ['shaam-ek-kisan','शाम, एक किसान',12],
      ['chidiya-ki-bachchi','चिड़िया की बच्ची',14]
    ]
  },
  8: {
    maths: [
      ['rational-numbers','Rational Numbers',25],
      ['linear-equations','Linear Equations in One Variable',27],
      ['quadrilaterals','Understanding Quadrilaterals',23],
      ['data-handling','Data Handling',19],
      ['squares-roots','Squares and Square Roots',26],
      ['cubes-roots','Cubes and Cube Roots',21],
      ['comparing-quantities','Comparing Quantities',24],
      ['algebraic-identities','Algebraic Expressions and Identities',28],
      ['mensuration','Mensuration',25],
      ['factorisation','Factorisation',23]
    ],
    science: [
      ['crop-production','Crop Production and Management',22],
      ['microorganisms','Microorganisms: Friend and Foe',24],
      ['synthetic-fibres','Synthetic Fibres and Plastics',19],
      ['metals-nonmetals','Materials: Metals and Non-Metals',23],
      ['coal-petroleum','Coal and Petroleum',20],
      ['combustion-flame','Combustion and Flame',21],
      ['cell-structure','Cell - Structure and Functions',26],
      ['force-pressure','Force and Pressure',25],
      ['friction','Friction',22],
      ['sound','Sound',24]
    ],
    social: [
      ['how-when-where','How, When and Where',18],
      ['trade-to-territory','From Trade to Territory',22],
      ['ruling-countryside','Ruling the Countryside',21],
      ['tribals-dikus','Tribals, Dikus and the Vision of a Golden Age',23],
      ['revolt-1857','When People Rebel: 1857 and After',25],
      ['resources','Resources',17],
      ['land-soil-water','Land, Soil, Water, Natural Vegetation',20],
      ['indian-constitution','The Indian Constitution',24],
      ['judiciary','Judiciary',19]
    ],
    english: [
      ['best-christmas-present','The Best Christmas Present in the World',17],
      ['tsunami','The Tsunami',15],
      ['glimpses-of-past','Glimpses of the Past',18],
      ['bepin-choudhury','Bepin Choudhury’s Lapse of Memory',16],
      ['summit-within','The Summit Within',15],
      ['jodys-fawn','This is Jody’s Fawn',14],
      ['visit-to-cambridge','A Visit to Cambridge',16],
      ['monsoon-diary','A Short Monsoon Diary',13],
      ['great-stone-face','The Great Stone Face - I',15]
    ],
    hindi: [
      ['dhwani','ध्वनि',11],
      ['lakh-ki-choodiyan','लाख की चूड़ियाँ',15],
      ['bus-ki-yatra','बस की यात्रा',14],
      ['deewanon-ki-hasti','दीवानों की हस्ती',12],
      ['chitthiyon-ki-duniya','चिट्ठियों की अनूठी दुनिया',16],
      ['bhagwan-ke-dakiye','भगवान के डाकिए',13],
      ['kya-nirash-hua-jaye','क्या निराश हुआ जाए',15],
      ['kabir-ki-sakhiyan','कबीर की साखियाँ',14],
      ['kaamchor','कामचोर',16]
    ]
  },
  9: {
    maths: [
      ['number-systems','Number Systems',28],
      ['polynomials','Polynomials',30],
      ['coordinate-geometry','Coordinate Geometry',24],
      ['linear-equations-2var','Linear Equations in Two Variables',27],
      ['euclids-geometry','Introduction to Euclid’s Geometry',22],
      ['lines-angles','Lines and Angles',25],
      ['triangles','Triangles',29],
      ['quadrilaterals','Quadrilaterals',26],
      ['herons-formula','Heron’s Formula',21],
      ['statistics','Statistics',23]
    ],
    science: [
      ['matter-surroundings','Matter in Our Surroundings',24],
      ['is-matter-pure','Is Matter Around Us Pure?',26],
      ['atoms-molecules','Atoms and Molecules',28],
      ['structure-of-atom','Structure of the Atom',27],
      ['fundamental-unit-life','The Fundamental Unit of Life',25],
      ['tissues','Tissues',24],
      ['motion','Motion',29],
      ['force-laws','Force and Laws of Motion',30],
      ['gravitation','Gravitation',27],
      ['sound','Sound',25]
    ],
    social: [
      ['french-revolution','The French Revolution',26],
      ['russian-revolution','Socialism in Europe and the Russian Revolution',28],
      ['nazism-hitler','Nazism and the Rise of Hitler',27],
      ['forest-society','Forest Society and Colonialism',22],
      ['india-size-location','India - Size and Location',19],
      ['physical-features','Physical Features of India',23],
      ['what-is-democracy','What is Democracy? Why Democracy?',21],
      ['electoral-politics','Electoral Politics',20],
      ['village-palampur','The Story of Village Palampur',22]
    ],
    english: [
      ['fun-they-had','The Fun They Had',15],
      ['sound-of-music','The Sound of Music',17],
      ['little-girl','The Little Girl',14],
      ['beautiful-mind','A Truly Beautiful Mind',16],
      ['snake-and-mirror','The Snake and the Mirror',15],
      ['my-childhood','My Childhood',16],
      ['reach-for-the-top','Reach for the Top',15],
      ['kathmandu','Kathmandu',14],
      ['road-not-taken','The Road Not Taken',12]
    ],
    hindi: [
      ['do-bailon-ki-katha','दो बैलों की कथा',17],
      ['lhasa-ki-or','ल्हासा की ओर',16],
      ['upbhoktavad','उपभोक्तावाद की संस्कृति',15],
      ['sanwle-sapnon','साँवले सपनों की याद',14],
      ['premchand-ke-joote','प्रेमचंद के फटे जूते',15],
      ['mere-bachpan-ke-din','मेरे बचपन के दिन',16],
      ['ek-kutta-ek-maina','एक कुत्ता और एक मैना',14],
      ['sakhiyan-sabad','साखियाँ एवं सबद',13],
      ['vaakh','वाख',12]
    ]
  }
};

/* index every chapter id -> meta, for the Continue card */
var CHAPTER_INDEX = {};
Object.keys(CURRICULUM).forEach(function(cls){
  SUBJECTS.forEach(function(s){
    (CURRICULUM[cls][s.key] || []).forEach(function(ch, i){
      var id = 'c' + cls + '-' + s.code + '-' + ch[0];
      CHAPTER_INDEX[id] = { cls: parseInt(cls,10), subject: s, slug: ch[0], name: ch[1], mins: ch[2], idx: i };
    });
  });
});

/* ------------------------------------------------------------
   5 · VIEW STATE  (?class= & ?subject= query params)
   ------------------------------------------------------------ */
var params = new URLSearchParams(window.location.search);

/* ------------------------------------------------------------
   CLASS ACCESS CONTROL (strict, zero-tolerance)
   A student may ONLY browse their own class. Their class comes from the
   authenticated session (localStorage 'edulearn_user'), NOT from the URL ,
   so ?class=9 tampering is ignored. Non-students (teacher/parent/admin) may
   browse across classes (they need to see multiple classes by design).
   ------------------------------------------------------------ */
var SESSION_USER = (function(){
  try { return JSON.parse(localStorage.getItem('edulearn_user') || 'null'); } catch(e){ return null; }
})();
// Logged in → drop the whole "Classes" column from the footer. Browsing other
// classes is a signed-out / marketing affordance; a signed-in student has their
// own class already (per review feedback).
if (SESSION_USER) {
  var _footerClasses = document.getElementById('footerClasses');
  if (_footerClasses) _footerClasses.style.display = 'none';
}
function classNumFromLabel(v){
  var m = String(v || '').match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}
// The single class a student is locked to (null for teacher/parent/admin/guest).
var LOCKED_CLASS = (SESSION_USER && SESSION_USER.role === 'student')
  ? classNumFromLabel(SESSION_USER.className)
  : null;

// A locked student shouldn't see other-class links in the footer either.
if (LOCKED_CLASS) {
  (function(){
    function personalizeHero(){
      // Footer: hide other-class links.
      var fc = document.getElementById('footerClasses');
      if (fc) fc.querySelectorAll('a').forEach(function(a){
        var n = (a.getAttribute('href') || '').match(/class=(\d+)/);
        if (n && parseInt(n[1], 10) !== LOCKED_CLASS) {
          var li = a.closest('li'); if (li) li.style.display = 'none';
        }
      });

      // Hero: the generic "all classes unlocked / revisit any class" chips are
      // wrong for a class-locked student and leave a big empty gap. Replace them
      // with the student's OWN class context so the top of the page feels full
      // and personal (name + class + subject/chapter counts).
      var chips = document.querySelector('.hero__chips');
      var sect = (SESSION_USER && SESSION_USER.section) ? (' · ' + SESSION_USER.section) : '';
      var firstName = (SESSION_USER && SESSION_USER.name ? String(SESSION_USER.name).trim().split(/\s+/)[0] : '');
      if (chips){
        var subjCount = (typeof SUBJECTS !== 'undefined') ? SUBJECTS.length : 5;
        var chapCount = (typeof classCount === 'function') ? classCount(LOCKED_CLASS) : '';
        chips.innerHTML =
          '<div class="chip chip--gold">' +
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 8v6M21 8v6M7 11v4a5 3 0 0 0 10 0v-4"/></svg>' +
            '<span>Class ' + LOCKED_CLASS + sect + ' · your syllabus</span>' +
          '</div>' +
          '<div class="chip chip--soft">' +
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>' +
            '<span>' + subjCount + ' subjects · ' + chapCount + ' chapters</span>' +
          '</div>';
      }
      // A warmer, personal heading for the student.
      var title = document.querySelector('.hero__title');
      if (title && firstName){
        title.innerHTML = 'Ready to learn, <em>' + firstName.replace(/</g,'&lt;') + '?</em>';
        title.removeAttribute('data-i18n');
      }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', personalizeHero);
    else personalizeHero();
  })();
}

var activeClass;
if (LOCKED_CLASS && LOCKED_CLASS >= 6 && LOCKED_CLASS <= 9) {
  // Student: always their own class - URL param cannot override it.
  activeClass = LOCKED_CLASS;
} else {
  var urlClass = parseInt(params.get('class'), 10);
  activeClass = (urlClass >= 6 && urlClass <= 9) ? urlClass : 7;
}
var activeSubject = params.get('subject');
if(!SUBJECTS.some(function(s){ return s.key === activeSubject; })) activeSubject = 'science';
var query = '';

/* Which chapters have homework still to hand in: slug -> "due" | "overdue".
   Empty until the API answers, and an absent entry means no dot, showing one
   before we know would be worse than showing none. */
var HW_STATE = {};

/* Fill HW_STATE for the class/subject on screen, then repaint the rows.
   Failure is silent on purpose: homework is an addition to this page, and a
   student whose network dropped should still get their chapter list rather
   than an error where the syllabus used to be. */
function loadHomeworkState(subjKey){
  if (!window.EduAPI || !EduAPI.getAssignedHomework || !EduAPI.getUser || !EduAPI.getUser()) return;
  var subjectName = SUBJECT_API_NAME[subjKey] || '';
  if (!subjectName) return;
  EduAPI.getAssignedHomework(subjectName).then(function(res){
    var next = {};
    (res && res.homework ? res.homework : []).forEach(function(h){
      if (h.status !== 'assigned') return;   // already handed in
      if (!h.chapterSlug) return;
      next[h.chapterSlug] = h.overdue ? 'overdue' : 'due';
    });
    var changed = JSON.stringify(next) !== JSON.stringify(HW_STATE);
    HW_STATE = next;
    if (changed && typeof renderChapters === 'function') renderChapters(false);
  }).catch(function(){ /* the chapter list matters more than the dot */ });
}

/* The Learn subject keys are short ("science"); the API stores the display
   name ("Science"). One place to convert. */
var SUBJECT_API_NAME = {
  maths: 'Maths', science: 'Science', social: 'Social Science',
  english: 'English', hindi: 'Hindi'
};

function syncURL(){
  try{
    window.history.replaceState(window.history.state, '', '/learn?class=' + activeClass + '&subject=' + activeSubject);
  }catch(e){ /* file:// protocol may refuse, fine for demo */ }
}

/* ------------------------------------------------------------
   6 · HELPERS
   ------------------------------------------------------------ */
function esc(str){
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function chapterId(cls, subj, slug){
  return 'c' + cls + '-' + subj.code + '-' + slug;
}

function chapterProgress(id){
  var st = state.chapters[id];
  if(!st) return { pct: 0, mastered: false, completed: false, test: null };
  var v = typeof st.video === 'number' ? st.video : 0;
  var p = typeof st.practice === 'number' ? st.practice : 0;
  // `completed` is what the lesson page's "Mark as complete" writes (and what
  // /api/progress stores). It was being loaded and then never read, so a
  // student could mark a chapter done and the list would look untouched.
  return { pct: Math.round((v + p) / 2), mastered: !!st.mastered, completed: !!st.completed, test: (st.test === 0 || st.test) ? st.test : null };
}

function subjName(s){ return state.lang === 'hi' ? s.hi : s.en; }

function classCount(cls){
  var n = 0;
  SUBJECTS.forEach(function(s){ n += (CURRICULUM[cls][s.key] || []).length; });
  return n;
}

function highlight(name, q){
  if(!q) return esc(name);
  var lower = name.toLowerCase();
  var idx = lower.indexOf(q.toLowerCase());
  if(idx === -1) return esc(name);
  return esc(name.slice(0, idx)) +
         '<mark>' + esc(name.slice(idx, idx + q.length)) + '</mark>' +
         esc(name.slice(idx + q.length));
}

function lessonHref(cls, subj, slug, name){
  var url = 'lesson.html?class=' + cls + '&subject=' + subj.key + '&ch=' + chapterId(cls, subj, slug);
  // Pass the exact chapter title so the lesson hub/notes show the real NCERT
  // name (e.g. "Food: Where Does It Come From?") rather than a title-cased slug.
  if(name) url += '&t=' + encodeURIComponent(name);
  return url;
}

/* ------------------------------------------------------------
   7 · RENDER, class tabs
   ------------------------------------------------------------ */
function renderTabs(){
  var host = document.getElementById('classTabs');
  // A locked student only ever sees their own class, no other class is shown.
  var classes = LOCKED_CLASS ? [LOCKED_CLASS] : [6,7,8,9];
  var html = '';
  classes.forEach(function(cls){
    html +=
      '<button class="ctab' + (cls === activeClass ? ' is-active' : '') + '" data-class="' + cls + '" type="button" aria-pressed="' + (cls === activeClass) + '">' +
        '<span class="ctab__num">' + cls + '</span>' +
        '<span class="ctab__meta">' +
          '<span class="ctab__label">' + t('class_word') + ' ' + cls + '</span>' +
          '<span class="ctab__count">' + classCount(cls) + ' ' + t('chapters_word') + '</span>' +
        '</span>' +
      '</button>';
  });
  host.innerHTML = html;
  host.querySelectorAll('.ctab').forEach(function(btn){
    btn.addEventListener('click', function(){
      var cls = parseInt(btn.getAttribute('data-class'), 10);
      // Students can never switch class; ignore any attempt.
      if(LOCKED_CLASS || cls === activeClass) return;
      activeClass = cls;
      syncURL();
      renderTabs();
      renderContent(true);
      searchInput.setAttribute('placeholder', t('search_ph').replace('{n}', activeClass));
    });
  });
}

/* ------------------------------------------------------------
   8 · RENDER, subject rail
   ------------------------------------------------------------ */
function renderRail(stagger){
  var host = document.getElementById('subjectRail');
  var html = '';
  SUBJECTS.forEach(function(s, i){
    var count = (CURRICULUM[activeClass][s.key] || []).length;
    var delay = stagger ? (i * 60) : 0;
    html +=
      '<button class="subj' + (s.key === activeSubject ? ' is-active' : '') + (stagger ? ' rv' : '') + '"' +
        ' style="--sa:' + s.accent + (stagger ? ';animation-delay:' + delay + 'ms' : '') + '"' +
        ' data-subject="' + s.key + '" type="button" aria-pressed="' + (s.key === activeSubject) + '">' +
        '<span class="subj__icon">' + ICONS[s.icon] + '</span>' +
        '<span class="subj__name">' + esc(subjName(s)) + '</span>' +
        '<span class="subj__count">' + count + ' ' + t('chapters_word') + '</span>' +
      '</button>';
  });
  host.innerHTML = html;
  host.querySelectorAll('.subj').forEach(function(btn){
    btn.addEventListener('click', function(){
      var key = btn.getAttribute('data-subject');
      if(key === activeSubject) return;
      activeSubject = key;
      syncURL();
      renderRail(false);
      renderChapters(true);
      loadHomeworkState(activeSubject);
    });
  });
}

/* ------------------------------------------------------------
   9 · RENDER, chapter list (+ search across the class)
   ------------------------------------------------------------ */
function chapterRowHTML(cls, subj, ch, number, delay, withTag){
  var id = chapterId(cls, subj, ch[0]);
  var prog = chapterProgress(id);
  var cc = CLASS_COLORS[cls];
  var href = lessonHref(cls, subj, ch[0], ch[1]);
  // Each module icon deep-links straight to that resource for THIS chapter:
  //  · Video → lesson hub opened on the video stage, first part auto-playing.
  //  · Notes → lesson hub opened on the notes stage.
  //  · Test  → the Tests page (chapter context passed along for when it's wired).
  // Book & Practice were removed per product direction. These are real <a>s that
  // sit above the row's stretched hit-link, so they navigate independently.
  // Questions are stored by chapter slug, same as Bank and Homework below.
  var testHref = 'mocktest.html?class=' + cls + '&subject=' + subj.key + '&ch=' + ch[0];
  // Bank and Homework are chapter-scoped like the rest, but they key off the
  // chapter SLUG rather than the composite chapter id: the API stores
  // chapterSlug, and building the composite here and taking it apart there
  // would be two places to keep in step for no gain.
  var bankHref = 'bank.html?class=' + cls + '&subject=' + subj.key + '&ch=' + ch[0];
  var hwHref = 'homework.html?class=' + cls + '&subject=' + subj.key + '&ch=' + ch[0];
  // A dot on the icon when this chapter has homework still to hand in. hwState
  // is filled by loadHomeworkState(); before it answers the map is empty and
  // no dot is drawn, which is the right default, an absent dot says "nothing
  // due", and inventing one before we know would be worse than showing none.
  var hwPending = HW_STATE[ch[0]];
  var hwDot = hwPending
    ? '<i class="mod__dot' + (hwPending === 'overdue' ? ' is-overdue' : '') + '"></i>'
    : '';
  var mods =
    '<span class="mods">' +
      // Named buttons, not bare icons: a student should not have to hover to
      // find out what each one opens.
      '<a class="mod" href="' + href + '&view=video" aria-label="Watch the video for this chapter">Video</a>' +
      '<a class="mod" href="' + href + '&view=notes" aria-label="Read the notes for this chapter">Notes</a>' +
      '<a class="mod" href="' + testHref + '" aria-label="Take the test for this chapter">Test</a>' +
      '<a class="mod" href="' + bankHref + '" aria-label="Practise questions for this chapter">Question Bank</a>' +
      '<a class="mod' + (hwPending ? ' has-dot' : '') + '" href="' + hwHref + '" aria-label="Homework for this chapter">Homework' + hwDot + '</a>' +
    '</span>';
  var tag = withTag
    ? '<span class="chrow__subjtag" style="background:' + subj.accent + '">' + esc(subjName(subj)) + '</span>'
    : '';
  var right =
    '<span class="chrow__right">' +
      '<span class="chrow__dur">' + ch[2] + ' min</span>' +
      (prog.mastered
        ? '<span class="badge-mastered">' + ICONS.check + '<span>' + t('mastered') + '</span></span>'
        : prog.completed
          ? '<span class="badge-done">' + ICONS.check + '<span>' + t('done') + '</span></span>'
          : '<span class="chrow__arrow">' + ICONS.arrow + '</span>') +
    '</span>';
  return (
    // --sa carries the SUBJECT accent so each row can be coloured by its own
    // subject (the subject buttons already expose it the same way). --cc is
    // the class colour and stays for the existing progress treatment.
    // The row is a <div> (not an <a>) so the module icons can be real links:
    // chrow__hit is a stretched, transparent link that makes the whole row open
    // the chapter, while the mods sit above it (higher z-index) and navigate on
    // their own, a valid alternative to nesting <a> inside <a>.
    '<div class="chrow rv"' +
      ' style="--cc:' + cc + ';--sa:' + subj.accent + ';animation-delay:' + delay + 'ms">' +
      '<a class="chrow__hit" href="' + href + '" aria-label="Open ' + esc(ch[1]) + '"></a>' +
      '<span class="chrow__num">' + (number < 10 ? '0' : '') + number + '</span>' +
      '<span class="chrow__body">' +
        '<span class="chrow__name">' + tag + highlight(ch[1], query) + '</span>' +
        '<span class="chrow__meta">' +
          mods +
          '<span class="pbar"><span class="pbar__fill' + (prog.pct === 0 ? ' is-zero' : '') + '" style="width:' + prog.pct + '%"></span></span>' +
          '<span class="chrow__pct">' + (prog.pct > 0 ? prog.pct + '%' : '-') + '</span>' +
        '</span>' +
      '</span>' +
      right +
    '</div>'
  );
}

function renderChapters(stagger){
  var host = document.getElementById('chapterList');
  var empty = document.getElementById('emptyState');
  var title = document.getElementById('listTitle');
  var html = '';
  var found = 0;

  if(query){
    /* search across ALL subjects of the active class */
    title.innerHTML = t('results_for') + ' ' + activeClass + ' · <span class="subj-accent" style="color:var(--teal)">“' + esc(query) + '”</span>';
    SUBJECTS.forEach(function(s){
      (CURRICULUM[activeClass][s.key] || []).forEach(function(ch, i){
        if(ch[1].toLowerCase().indexOf(query.toLowerCase()) !== -1){
          found++;
          html += chapterRowHTML(activeClass, s, ch, i + 1, stagger ? Math.min(found * 60, 600) : 0, true);
        }
      });
    });
  } else {
    var subj = SUBJECTS.filter(function(s){ return s.key === activeSubject; })[0] || SUBJECTS[0];
    title.innerHTML =
      esc(subjName(subj)) + ' · <span class="subj-accent" style="color:' + CLASS_COLORS[activeClass] + '">' +
      t('class_word') + ' ' + activeClass + '</span>';
    (CURRICULUM[activeClass][subj.key] || []).forEach(function(ch, i){
      found++;
      html += chapterRowHTML(activeClass, subj, ch, i + 1, stagger ? Math.min(i * 60, 600) : 0, false);
    });
  }

  host.innerHTML = html;
  empty.classList.toggle('is-show', found === 0);
  host.style.display = found === 0 ? 'none' : 'flex';
  if(found === 0) updateEmptySuggestion();
}

/* suggest a chapter that actually exists in the active class */
function updateEmptySuggestion(){
  var list = CURRICULUM[activeClass].maths || [];
  if(!list.length) return;
  var name = list[0][1];
  var btn = document.getElementById('trySuggest');
  btn.textContent = t('try_chip').replace('{name}', name);
  btn.setAttribute('data-suggest', name);
}

function renderContent(stagger){
  renderRail(stagger);
  renderChapters(stagger);
}

/* ------------------------------------------------------------
   10 · RENDER, side panel
   ------------------------------------------------------------ */
function pickContinueChapter(){
  var best = null, bestPct = -1;
  Object.keys(state.chapters).forEach(function(id){
    var st = state.chapters[id];
    if(!st || st.mastered) return;
    if(!CHAPTER_INDEX[id]) return;
    var prog = chapterProgress(id);
    if(prog.pct > 0 && prog.pct < 100 && prog.pct > bestPct){
      bestPct = prog.pct;
      best = id;
    }
  });
  return best;
}

function renderContinue(){
  var host = document.getElementById('continueBody');
  renderTokkyTip();
  var id = pickContinueChapter();
  if(!id){
    host.innerHTML = '<p style="color:var(--muted);font-size:14px">All caught up. ' + tokkySVG(54) + '</p>';
    return;
  }
  var meta = CHAPTER_INDEX[id];
  var prog = chapterProgress(id);
  var C = 2 * Math.PI * 34; /* r = 34 */
  var off = C * (1 - prog.pct / 100);
  host.innerHTML =
    '<div class="ring">' +
      '<svg width="84" height="84" viewBox="0 0 84 84">' +
        '<circle class="ring__track" cx="42" cy="42" r="34" fill="none" stroke-width="6"/>' +
        '<circle cx="42" cy="42" r="34" fill="none" stroke="url(#auroraGrad)" stroke-width="6" stroke-linecap="round"' +
          ' stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      '</svg>' +
      '<span class="ring__pct">' + prog.pct + '%</span>' +
    '</div>' +
    '<div class="continue__body">' +
      '<div class="continue__class" style="color:' + CLASS_COLORS[meta.cls] + '">' +
        t('class_word') + ' ' + meta.cls + ' · ' + esc(subjName(meta.subject)) +
      '</div>' +
      '<div class="continue__name">' + esc(meta.name) + '</div>' +
      '<a class="btn-resume" href="' + lessonHref(meta.cls, meta.subject, meta.slug, meta.name) + '">' +
        ICONS.play + '<span>' + t('resume') + '</span>' +
      '</a>' +
    '</div>';
}

// Real progress tip (was a hardcoded fake "Ananya from Indore... 65%" line
// shown to every user regardless of their actual progress). Reuses the same
// pickContinueChapter()/chapterProgress() the continue-learning card uses.
function renderTokkyTip(){
  var el = document.getElementById('tokkyTip');
  if(!el) return;
  var id = pickContinueChapter();
  if(!id){
    el.textContent = t('tokky_tip_empty');
    return;
  }
  var meta = CHAPTER_INDEX[id];
  var prog = chapterProgress(id);
  el.textContent = t('tokky_tip_progress')
    .replace('{pct}', prog.pct)
    .replace('{title}', meta.name);
}

function renderBeyond(){
  var host = document.getElementById('beyondList');
  // The "Beyond Academics" section was removed from the page. Bail out quietly
  // instead of throwing on a null host, an unguarded innerHTML here used to
  // abort renderAll()/init(), taking the whole chapter list down with it.
  if(!host) return;
  var items = [
    { icon: 'yoga',   key: 'beyond_yoga',   tint: '#3DE8C5' },
    { icon: 'fin',    key: 'beyond_fin',    tint: '#FFB454' },
    { icon: 'music',  key: 'beyond_music',  tint: '#FF7AA2' },
    { icon: 'career', key: 'beyond_career', tint: '#7C9BFF' }
  ];
  var html = '';
  items.forEach(function(it){
    html +=
      '<a class="beyond__row" href="lesson.html?track=' + it.icon + '">' +
        '<span class="beyond__icon" style="color:' + it.tint + '">' + ICONS[it.icon] + '</span>' +
        '<span class="beyond__name">' + t(it.key) + '</span>' +
        ICONS.chev +
      '</a>';
  });
  host.innerHTML = html;
}

/* ------------------------------------------------------------
   11 · SEARCH
   ------------------------------------------------------------ */
var searchInput = document.getElementById('searchInput');
var searchTimer = null;
searchInput.addEventListener('input', function(){
  clearTimeout(searchTimer);
  searchTimer = setTimeout(function(){
    query = searchInput.value.trim();
    renderChapters(true);
  }, 120);
});

document.getElementById('trySuggest').addEventListener('click', function(){
  /* Maths chapter names are English NCERT titles in both languages, so search the English term */
  var name = this.getAttribute('data-suggest') || '';
  searchInput.value = name;
  query = name;
  renderChapters(true);
  searchInput.focus();
});

/* ------------------------------------------------------------
   12 · LANGUAGE TOGGLE (disabled in production, buttons are commented out
   above until Hindi chapter titles exist; guard their absence here too)
   ------------------------------------------------------------ */
if (document.getElementById('langEn')) document.getElementById('langEn').addEventListener('click', function(){ setLang('en'); });
if (document.getElementById('langHi')) document.getElementById('langHi').addEventListener('click', function(){ setLang('hi'); });

/* ------------------------------------------------------------
   13 · SCROLL REVEALS
   ------------------------------------------------------------ */
function setupObserver(){
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.io').forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.io').forEach(function(el){ obs.observe(el); });
}

/* ------------------------------------------------------------
   14 · BOOT
   ------------------------------------------------------------ */
function renderAll(stagger){
  renderTabs();
  renderContent(stagger);
  renderContinue();
  renderBeyond();
}

document.getElementById('emptyTokky').innerHTML = tokkySVG(96);
document.getElementById('panelTokky').innerHTML = tokkySVG(64);

applyI18n();
renderAll(true);
syncURL();
setupObserver();
/* Pending-homework dots. Runs after the first paint on purpose: the chapter
   list must not wait on a network call that only decorates it. */
loadHomeworkState(activeSubject);

// Hydrate real per-user progress from the backend when signed in. A brand-new
// user has empty chapters server-side, so no fake progress is shown; returning
// users see exactly what they've actually completed. Exposed so the loader
// script (after api.js) can call it once EduAPI is available.
window.__eduHydrateProgress = function (progress) {
  if (!progress || typeof progress !== 'object') return;
  // Backend is the source of truth for a logged-in user: replace, don't merge,
  // so stale localStorage demo data can't leak in.
  state.chapters = (progress.chapters && typeof progress.chapters === 'object')
    ? progress.chapters : {};
  if (typeof progress.streak === 'number') state.streak = progress.streak;
  if (typeof progress.minutes === 'number') state.minutes = progress.minutes;
  if (Array.isArray(progress.badges)) state.badges = progress.badges;
  saveState(state);
  renderAll(false);
};

})();


/* ---- next <script> block ---- */


    // Once the API helper is loaded, pull the signed-in user's real progress
    // and re-render. Silent no-op for logged-out visitors (they see the empty
    // course library, not fabricated progress).
    (function () {
      if (!window.EduAPI || !EduAPI.getToken || !EduAPI.getToken()) return;
      if (typeof EduAPI.getProgress !== 'function') return;
      EduAPI.getProgress().then(function (progress) {
        if (progress && window.__eduHydrateProgress) window.__eduHydrateProgress(progress);
      }).catch(function () { /* offline / expired token → keep local view */ });
    })();
  
}
