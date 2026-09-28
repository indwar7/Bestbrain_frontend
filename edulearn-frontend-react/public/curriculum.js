/* ============================================================
   BestBrain - SHARED CURRICULUM
   ------------------------------------------------------------
   Extracted verbatim from learn.html so the dashboard can use the
   SAME chapter data instead of its own 5-entry demo stub.

   The dashboard's "Continue learning" card was permanently empty
   because it looked chapters up in a hardcoded CHAPTER_META of 5
   entries. The id scheme was right ('c7-sci-adolescence') but only
   5 of the 49 chapters existed in it, and nothing ever wrote the
   progress it keyed off. Sharing one curriculum fixes the first
   half of that; hydrating progress from the API fixes the second.

   Chapter tuple: [slug, title, estimatedMinutes]
   Chapter id:    'c' + class + '-' + subjectCode + '-' + slug
   ============================================================ */
(function (global) {
'use strict';

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
    // Ordered so the chapters that already carry full content (videos + notes)
    // surface first, electricity, metals, physical/chemical changes and
    // adolescence, followed by chapters 7 (heat) and 8 (time & motion). The
    // remaining chapters keep their original relative order below. Chapter
    // identity is by slug, so reordering here doesn't disturb saved progress.
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

/* id -> meta, for the dashboard's Continue card and the subject map */
var CHAPTER_INDEX = {};
Object.keys(CURRICULUM).forEach(function (cls) {
  SUBJECTS.forEach(function (s) {
    (CURRICULUM[cls][s.key] || []).forEach(function (ch, i) {
      CHAPTER_INDEX['c' + cls + '-' + s.code + '-' + ch[0]] = {
        cls: parseInt(cls, 10), subject: s, slug: ch[0],
        name: ch[1], mins: ch[2], idx: i
      };
    });
  });
});

function chapterCount(cls, subjectKey) {
  return ((CURRICULUM[cls] || {})[subjectKey] || []).length;
}
function totalChapters(cls) {
  return SUBJECTS.reduce(function (n, s) { return n + chapterCount(cls, s.key); }, 0);
}

global.EduCurriculum = {
  SUBJECTS: SUBJECTS,
  CLASS_COLORS: CLASS_COLORS,
  CURRICULUM: CURRICULUM,
  CHAPTER_INDEX: CHAPTER_INDEX,
  chapterCount: chapterCount,
  totalChapters: totalChapters
};
})(window);
