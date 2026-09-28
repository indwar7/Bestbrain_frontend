export interface Subject {
  key: string;
  code: string;
  en: string;
  hi: string;
  accent: string;
  icon: string;
}

export const SUBJECTS: Subject[] = [
  { key: 'maths',   code: 'math', en: 'Mathematics',    hi: '\u0917\u0923\u093F\u0924',           accent: '#7C9BFF', icon: 'maths'   },
  { key: 'science', code: 'sci',  en: 'Science',         hi: '\u0935\u093F\u091C\u094D\u091E\u093E\u0928',         accent: '#3DE8C5', icon: 'science' },
  { key: 'social',  code: 'sst',  en: 'Social Science',  hi: '\u0938\u093E\u092E\u093E\u091C\u093F\u0915 \u0935\u093F\u091C\u094D\u091E\u093E\u0928', accent: '#FFB454', icon: 'social'  },
  { key: 'english', code: 'eng',  en: 'English',         hi: '\u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940',        accent: '#FF7AA2', icon: 'english' },
  { key: 'hindi',   code: 'hin',  en: 'Hindi',           hi: '\u0939\u093F\u0928\u094D\u0926\u0940',           accent: '#A78BFA', icon: 'hindi'   },
];

export const CLASS_COLORS: Record<number, string> = { 6: '#3DE8C5', 7: '#FFB454', 8: '#7C9BFF', 9: '#FF7AA2' };

type ChapterTuple = [string, string, number];

export const CURRICULUM: Record<number, Record<string, ChapterTuple[]>> = {
  6: {
    maths: [
      ['knowing-numbers','Knowing Our Numbers',24],['whole-numbers','Whole Numbers',21],
      ['playing-numbers','Playing with Numbers',26],['geometrical-ideas','Basic Geometrical Ideas',19],
      ['elementary-shapes','Understanding Elementary Shapes',23],['integers','Integers',20],
      ['fractions','Fractions',28],['decimals','Decimals',22],
      ['data-handling','Data Handling',17],['mensuration','Mensuration',25],
    ],
    science: [
      ['food-sources','Food: Where Does It Come From?',16],['components-of-food','Components of Food',19],
      ['fibre-to-fabric','Fibre to Fabric',18],['sorting-materials','Sorting Materials into Groups',17],
      ['separation','Separation of Substances',21],['changes-around-us','Changes Around Us',15],
      ['getting-to-know-plants','Getting to Know Plants',22],['body-movements','Body Movements',20],
      ['living-organisms','The Living Organisms and Their Surroundings',24],
      ['light-shadows','Light, Shadows and Reflections',23],
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
      ['understanding-diversity','Understanding Diversity',16],
    ],
    english: [
      ['patricks-homework',"Who Did Patrick's Homework?",14],
      ['dog-new-master','How the Dog Found Himself a New Master',15],
      ["taros-reward","Taro's Reward",16],
      ['kalpana-chawla','An Indian-American Woman in Space',18],
      ['different-school','A Different Kind of School',15],
      ['who-i-am','Who I Am',13],['fair-play','Fair Play',14],
      ['game-of-chance','A Game of Chance',15],['banyan-tree','The Banyan Tree',17],
    ],
    hindi: [
      ['vah-chidiya','\u0935\u0939 \u091A\u093F\u0921\u093C\u093F\u092F\u093E \u091C\u094B',12],['bachpan','\u092C\u091A\u092A\u0928',14],
      ['nadan-dost','\u0928\u093E\u0926\u093E\u0928 \u0926\u094B\u0938\u094D\u0924',15],
      ['chand-se-gappein','\u091A\u093E\u0901\u0926 \u0938\u0947 \u0925\u094B\u0921\u093C\u0940-\u0938\u0940 \u0917\u092A\u094D\u092A\u0947\u0902',13],
      ['aksharon-ka-mahatva','\u0905\u0915\u094D\u0937\u0930\u094B\u0902 \u0915\u093E \u092E\u0939\u0924\u094D\u0935',16],
      ['par-nazar-ke','\u092A\u093E\u0930 \u0928\u091C\u093C\u0930 \u0915\u0947',15],
      ['saathi-haath','\u0938\u093E\u0925\u0940 \u0939\u093E\u0925 \u092C\u0922\u093C\u093E\u0928\u093E',12],
      ['ticket-album','\u091F\u093F\u0915\u091F-\u0905\u0932\u092C\u092E',14],
      ['jhansi-ki-rani','\u091D\u093E\u0901\u0938\u0940 \u0915\u0940 \u0930\u093E\u0928\u0940',18],
    ],
  },
  7: {
    maths: [
      ['integers','Integers',22],['fractions-decimals','Fractions and Decimals',26],
      ['data-handling','Data Handling',18],['simple-equations','Simple Equations',24],
      ['lines-angles','Lines and Angles',21],['triangle-properties','The Triangle and its Properties',25],
      ['congruence','Congruence of Triangles',20],['comparing-quantities','Comparing Quantities',23],
      ['rational-numbers','Rational Numbers',24],['perimeter-area','Perimeter and Area',22],
    ],
    science: [
      ['evolving-science','The Ever-Evolving World of Science',18],
      ['acidic-basic-neutral','Exploring Substances: Acidic, Basic & Neutral',22],
      ['electricity-circuits','Electricity: Circuits and their Components',26],
      ['metals-nonmetals','The World of Metals and Non-metals',22],
      ['physical-chemical-changes','Changes Around Us: Physical and Chemical',24],
      ['adolescence','Adolescence: A Stage of Growth and Change',26],
      ['heat-transfer','Heat Transfer in Nature',24],
      ['time-and-motion','Measurement of Time and Motion',22],
      ['life-processes-animals','Life Processes in Animals',24],
      ['life-processes-plants','Life Processes in Plants',22],
      ['light-shadows','Light: Shadows and Reflections',23],
      ['earth-moon-sun','Earth, Moon and the Sun',20],
    ],
    social: [
      ['thousand-years','Tracing Changes Through a Thousand Years',20],
      ['new-kings','New Kings and Kingdoms',21],['delhi-sultans','The Delhi Sultans',23],
      ['mughal-empire','The Mughal Empire',26],['rulers-buildings','Rulers and Buildings',19],
      ['environment','Environment',18],['inside-our-earth','Inside Our Earth',20],
      ['on-equality','On Equality',17],['markets-around-us','Markets Around Us',16],
    ],
    english: [
      ['three-questions','Three Questions',15],['gift-of-chappals','A Gift of Chappals',16],
      ['gopal-hilsa','Gopal and the Hilsa-Fish',14],
      ['ashes-trees-bloom','The Ashes That Made Trees Bloom',17],
      ['quality','Quality',15],['expert-detectives','Expert Detectives',16],
      ['vita-wonk','The Invention of Vita-Wonk',14],
      ['fire-friend-foe','Fire: Friend and Foe',15],
      ['story-of-cricket','The Story of Cricket',18],
    ],
    hindi: [
      ['hum-panchhi','\u0939\u092E \u092A\u0902\u091B\u0940 \u0909\u0928\u094D\u092E\u0941\u0915\u094D\u0924 \u0917\u0917\u0928 \u0915\u0947',12],
      ['dadi-maa','\u0926\u093E\u0926\u0940 \u092E\u093E\u0901',15],
      ['himalay-betiyan','\u0939\u093F\u092E\u093E\u0932\u092F \u0915\u0940 \u092C\u0947\u091F\u093F\u092F\u093E\u0901',14],
      ['kathputli','\u0915\u0920\u092A\u0941\u0924\u0932\u0940',11],
      ['mithaiwala','\u092E\u093F\u0920\u093E\u0908\u0935\u093E\u0932\u093E',16],
      ['rakt-sharir','\u0930\u0915\u094D\u0924 \u0914\u0930 \u0939\u092E\u093E\u0930\u093E \u0936\u0930\u0940\u0930',17],
      ['papa-kho-gaye','\u092A\u093E\u092A\u093E \u0916\u094B \u0917\u090F',15],
      ['shaam-ek-kisan','\u0936\u093E\u092E - \u090F\u0915 \u0915\u093F\u0938\u093E\u0928',12],
      ['chidiya-ki-bachchi','\u091A\u093F\u0921\u093C\u093F\u092F\u093E \u0915\u0940 \u092C\u091A\u094D\u091A\u0940',14],
    ],
  },
  8: {
    maths: [
      ['rational-numbers','Rational Numbers',25],['linear-equations','Linear Equations in One Variable',27],
      ['quadrilaterals','Understanding Quadrilaterals',23],['data-handling','Data Handling',19],
      ['squares-roots','Squares and Square Roots',26],['cubes-roots','Cubes and Cube Roots',21],
      ['comparing-quantities','Comparing Quantities',24],
      ['algebraic-identities','Algebraic Expressions and Identities',28],
      ['mensuration','Mensuration',25],['factorisation','Factorisation',23],
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
      ['friction','Friction',22],['sound','Sound',24],
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
      ['judiciary','Judiciary',19],
    ],
    english: [
      ['best-christmas-present','The Best Christmas Present in the World',17],
      ['tsunami','The Tsunami',15],['glimpses-of-past','Glimpses of the Past',18],
      ["bepin-choudhury","Bepin Choudhury's Lapse of Memory",16],
      ['summit-within','The Summit Within',15],["jodys-fawn","This is Jody's Fawn",14],
      ['visit-to-cambridge','A Visit to Cambridge',16],
      ['monsoon-diary','A Short Monsoon Diary',13],
      ['great-stone-face','The Great Stone Face - I',15],
    ],
    hindi: [
      ['dhwani','\u0927\u094D\u0935\u0928\u093F',11],
      ['lakh-ki-choodiyan','\u0932\u093E\u0916 \u0915\u0940 \u091A\u0942\u0921\u093C\u093F\u092F\u093E\u0901',15],
      ['bus-ki-yatra','\u092C\u0938 \u0915\u0940 \u092F\u093E\u0924\u094D\u0930\u093E',14],
      ['deewanon-ki-hasti','\u0926\u0940\u0935\u093E\u0928\u094B\u0902 \u0915\u0940 \u0939\u0938\u094D\u0924\u0940',12],
      ['chitthiyon-ki-duniya','\u091A\u093F\u0920\u094D\u0920\u093F\u092F\u094B\u0902 \u0915\u0940 \u0905\u0928\u0942\u0920\u0940 \u0926\u0941\u0928\u093F\u092F\u093E',16],
      ['bhagwan-ke-dakiye','\u092D\u0917\u0935\u093E\u0928 \u0915\u0947 \u0921\u093E\u0915\u093F\u090F',13],
      ['kya-nirash-hua-jaye','\u0915\u094D\u092F\u093E \u0928\u093F\u0930\u093E\u0936 \u0939\u0941\u0906 \u091C\u093E\u090F',15],
      ['kabir-ki-sakhiyan','\u0915\u092C\u0940\u0930 \u0915\u0940 \u0938\u093E\u0916\u093F\u092F\u093E\u0901',14],
      ['kaamchor','\u0915\u093E\u092E\u091A\u094B\u0930',16],
    ],
  },
  9: {
    maths: [
      ['number-systems','Number Systems',28],['polynomials','Polynomials',30],
      ['coordinate-geometry','Coordinate Geometry',24],
      ['linear-equations-2var','Linear Equations in Two Variables',27],
      ["euclids-geometry","Introduction to Euclid\u2019s Geometry",22],
      ['lines-angles','Lines and Angles',25],['triangles','Triangles',29],
      ['quadrilaterals','Quadrilaterals',26],["herons-formula","Heron\u2019s Formula",21],
      ['statistics','Statistics',23],
    ],
    science: [
      ['matter-surroundings','Matter in Our Surroundings',24],
      ['is-matter-pure','Is Matter Around Us Pure?',26],
      ['atoms-molecules','Atoms and Molecules',28],
      ['structure-of-atom','Structure of the Atom',27],
      ['fundamental-unit-life','The Fundamental Unit of Life',25],
      ['tissues','Tissues',24],['motion','Motion',29],
      ['force-laws','Force and Laws of Motion',30],
      ['gravitation','Gravitation',27],['sound','Sound',25],
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
      ['village-palampur','The Story of Village Palampur',22],
    ],
    english: [
      ['fun-they-had','The Fun They Had',15],['sound-of-music','The Sound of Music',17],
      ['little-girl','The Little Girl',14],['beautiful-mind','A Truly Beautiful Mind',16],
      ['snake-and-mirror','The Snake and the Mirror',15],
      ['my-childhood','My Childhood',16],['reach-for-the-top','Reach for the Top',15],
      ['kathmandu','Kathmandu',14],['road-not-taken','The Road Not Taken',12],
    ],
    hindi: [
      ['do-bailon-ki-katha','\u0926\u094B \u092C\u0948\u0932\u094B\u0902 \u0915\u0940 \u0915\u0925\u093E',17],
      ['lhasa-ki-or','\u0932\u094D\u0939\u093E\u0938\u093E \u0915\u0940 \u0913\u0930',16],
      ['upbhoktavad','\u0909\u092A\u092D\u094B\u0915\u094D\u0924\u093E\u0935\u093E\u0926 \u0915\u0940 \u0938\u0902\u0938\u094D\u0915\u0943\u0924\u093F',15],
      ['sanwle-sapnon','\u0938\u093E\u0901\u0935\u0932\u0947 \u0938\u092A\u0928\u094B\u0902 \u0915\u0940 \u092F\u093E\u0926',14],
      ['premchand-ke-joote','\u092A\u094D\u0930\u0947\u092E\u091A\u0902\u0926 \u0915\u0947 \u092B\u091F\u0947 \u091C\u0942\u0924\u0947',15],
      ['mere-bachpan-ke-din','\u092E\u0947\u0930\u0947 \u092C\u091A\u092A\u0928 \u0915\u0947 \u0926\u093F\u0928',16],
      ['ek-kutta-ek-maina','\u090F\u0915 \u0915\u0941\u0924\u094D\u0924\u093E \u0914\u0930 \u090F\u0915 \u092E\u0948\u0928\u093E',14],
      ['sakhiyan-sabad','\u0938\u093E\u0916\u093F\u092F\u093E\u0901 \u090F\u0935\u0902 \u0938\u092C\u0926',13],
      ['vaakh','\u0935\u093E\u0916',12],
    ],
  },
};

export interface ChapterMeta {
  cls: number;
  subject: Subject;
  slug: string;
  name: string;
  mins: number;
  idx: number;
}

export const CHAPTER_INDEX: Record<string, ChapterMeta> = {};
Object.keys(CURRICULUM).forEach(cls => {
  const classNum = parseInt(cls, 10);
  SUBJECTS.forEach(s => {
    (CURRICULUM[classNum]?.[s.key] || []).forEach((ch, i) => {
      CHAPTER_INDEX[`c${cls}-${s.code}-${ch[0]}`] = {
        cls: classNum, subject: s, slug: ch[0],
        name: ch[1], mins: ch[2], idx: i,
      };
    });
  });
});

export function chapterCount(cls: number, subjectKey: string): number {
  return (CURRICULUM[cls]?.[subjectKey] || []).length;
}

export function totalChapters(cls: number): number {
  return SUBJECTS.reduce((n, s) => n + chapterCount(cls, s.key), 0);
}
