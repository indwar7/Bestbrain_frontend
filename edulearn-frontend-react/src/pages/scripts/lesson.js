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
  },
  // Class 7 Science (NCERT Curiosity). Keyed by class: the same slug names a
  // different chapter in another class.
  '7:metals-nonmetals': {
    "read": 8,
    "sections": [
      {
        "h": "Materials All Around Us",
        "body": "<p>Look around your home. The pressure cooker, the steel tumbler, the copper wire in a switchboard and your mother's gold earrings are all made of <b>metals</b>. The oxygen we breathe, the carbon in a pencil lead and the sulphur used in crackers are <b>non-metals</b>.</p><p>Scientists group materials by their <b>properties</b>, that is, how they look, feel and behave. In this chapter we test these properties one by one.</p><div class=\"nterm\">Elements such as iron, copper, aluminium and gold are metals; elements such as carbon, sulphur, oxygen and iodine are non-metals.</div>"
      },
      {
        "h": "Shine, Hardness and Sound",
        "body": "<ul><li><b>Lustre:</b> Metals have a shiny surface. A new copper coin or an aluminium vessel shines. Old metal objects look dull because a layer forms on the surface; rubbing with sandpaper brings back the shine.</li><li><b>Hardness:</b> Most metals, like iron, are hard. Sodium and potassium are exceptions: they are so soft they can be cut with a knife.</li><li><b>Sonorous:</b> Metals make a ringing sound when struck. That is why temple bells and school bells are made of metal, not wood.</li></ul><div class=\"nterm\">A material that produces a ringing sound when struck is called sonorous.</div>"
      },
      {
        "h": "Beating and Drawing Metals",
        "body": "<p>When you hammer a piece of aluminium, it flattens into a sheet instead of breaking. This property is called <b>malleability</b>. Aluminium foil for wrapping rotis and silver varak on sweets are made this way.</p><p>Metals can also be pulled into thin wires. This is called <b>ductility</b>. Copper and aluminium wires in our homes are made because these metals are ductile.</p><div class=\"nterm\">Malleable means can be beaten into thin sheets; ductile means can be drawn into thin wires.</div>"
      },
      {
        "h": "Conducting Heat and Electricity",
        "body": "<p>A steel spoon left in hot tea soon becomes hot at the handle. This shows metals are good <b>conductors of heat</b>. That is why cooking pots are made of metal, but their handles are often made of plastic or wood.</p><p>When a metal is placed in a simple circuit with a cell and a bulb, the bulb glows. Metals are good <b>conductors of electricity</b>, which is why electric wires are made of copper or aluminium.</p><div class=\"nterm\">A conductor allows heat or electricity to pass through it easily.</div>"
      },
      {
        "h": "Properties of Non-metals",
        "body": "<p>Non-metals usually show the opposite properties:</p><ul><li>They are dull, not shiny (iodine is an exception, it has some shine).</li><li>Solid non-metals like sulphur and coal are <b>brittle</b>: they break into pieces when hit.</li><li>They are not sonorous.</li><li>They are poor conductors of heat and electricity. Graphite, a form of carbon used in pencils, is an exception: it conducts electricity.</li></ul><p>Most metals are solid at room temperature, but <b>mercury</b> is a liquid metal. Non-metals can be solids (carbon, sulphur), a liquid (<b>bromine</b>) or gases (oxygen, nitrogen).</p>"
      },
      {
        "h": "Reaction with Oxygen",
        "body": "<p>Iron objects like gates and bicycles left in the rain get a brown flaky coating called <b>rust</b>. Rusting needs both air (oxygen) and water.</p><p>A <b>magnesium</b> ribbon burns with a dazzling white light and forms white ash, <b>magnesium oxide</b>. Dissolved in water, it turns red litmus blue, so it is <b>basic</b>.</p><p>When <b>sulphur</b> burns, it forms <b>sulphur dioxide</b> gas. Dissolved in water, it turns blue litmus red, so it is <b>acidic</b>.</p><div class=\"nterm\">Metal oxides are generally basic, while non-metal oxides are generally acidic.</div>"
      },
      {
        "h": "Reaction with Water and Uses",
        "body": "<p><b>Sodium</b> reacts very fast with water and can catch fire, so it is stored in kerosene. <b>Phosphorus</b>, a non-metal, catches fire in air, so it is stored in water.</p><p>Both groups are useful and even needed by our bodies:</p><ul><li>Metals: iron for bridges and rails, copper for wires, aluminium for utensils, gold and silver for jewellery.</li><li>Non-metals: oxygen for breathing, nitrogen in fertilisers, chlorine to clean drinking water, carbon in fuels.</li><li>Our body needs iron (for blood), calcium (for bones and teeth) and oxygen.</li></ul>"
      }
    ],
    "recap": [
      "Metals are lustrous, hard, sonorous, malleable, ductile and good conductors.",
      "Non-metals are usually dull, brittle, non-sonorous and poor conductors.",
      "Metal oxides are basic, non-metal oxides are acidic.",
      "Sodium is stored in kerosene and phosphorus is stored in water because they react easily."
    ]
  },
  '7:physical-chemical-changes': {
    "read": 8,
    "sections": [
      {
        "h": "Changes Everywhere",
        "body": "<p>Ice melts in a glass of nimbu pani, milk turns into curd, a paper boat gets torn and a matchstick burns. Things around us keep changing.</p><p>Scientists divide these changes into two main kinds: <b>physical changes</b> and <b>chemical changes</b>. The key question is: <b>is a new substance formed?</b></p>"
      },
      {
        "h": "Physical Changes",
        "body": "<p>In a physical change, the shape, size, colour or state of a substance changes, but <b>no new substance is formed</b>.</p><ul><li>Melting of ice into water and freezing water into ice</li><li>Tearing or folding paper</li><li>Boiling water into steam</li><li>Stretching a rubber band</li><li>Dissolving sugar in water</li></ul><p>Many physical changes can be reversed. Water vapour cools back into water drops on the lid of a cooking pot.</p><div class=\"nterm\">A physical change alters properties like shape, size or state without forming a new substance.</div>"
      },
      {
        "h": "Chemical Changes",
        "body": "<p>In a chemical change, <b>one or more new substances are formed</b>. These new substances have different properties. Such changes usually cannot be reversed easily.</p><p>Signs that a chemical change may have happened:</p><ul><li>A new colour appears</li><li>A gas is given off (bubbles)</li><li>Heat or light is produced</li><li>A new smell is produced</li></ul><p>Examples: cooking food, milk turning into curd, burning of wood and ripening of fruits.</p><div class=\"nterm\">A chemical change is a change in which new substances with new properties are formed.</div>"
      },
      {
        "h": "Some Chemical Changes in the Lab",
        "body": "<ul><li><b>Burning magnesium:</b> A magnesium ribbon burns with a bright white light and forms white powdery magnesium oxide.</li><li><b>Baking soda and vinegar:</b> Adding vinegar to baking soda gives fizzing bubbles of <b>carbon dioxide</b> gas. When this gas is passed through lime water, the lime water turns <b>milky</b>. This is the test for carbon dioxide.</li></ul><p>In both cases, new substances are formed, so these are chemical changes.</p>"
      },
      {
        "h": "Rusting of Iron",
        "body": "<p>Iron gates, nails and old bicycles slowly get a reddish brown flaky layer called <b>rust</b>. Rusting is a chemical change. It happens only when iron is in contact with <b>both oxygen (air) and water (moisture)</b>. So iron rusts faster in coastal cities like Mumbai where the air is humid.</p><p>We can prevent rusting by keeping air and water away from iron:</p><ul><li>Painting or applying oil and grease</li><li><b>Galvanisation:</b> coating iron with a layer of zinc, as in the iron sheets used for roofs and buckets</li></ul><div class=\"nterm\">Galvanisation is the process of coating iron with zinc to protect it from rusting.</div>"
      },
      {
        "h": "Crystallisation",
        "body": "<p>Salt is made in places like Gujarat by letting sea water evaporate in the sun. But this salt is not pure and its crystals are small.</p><p>To get large, pure crystals, a substance like copper sulphate is dissolved in hot water, the solution is filtered and then allowed to cool slowly. Beautiful blue crystals form. This process is called <b>crystallisation</b>. It is a physical change because the substance stays the same.</p><div class=\"nterm\">Crystallisation is a method of getting large, pure crystals of a substance from its solution.</div>"
      },
      {
        "h": "Combustion",
        "body": "<p>Burning of wood, LPG, coal or a candle is called <b>combustion</b>. It is a chemical change in which a substance reacts with oxygen and gives off heat and usually light.</p><p>For combustion to happen, three things are needed:</p><ul><li>A <b>fuel</b> (a substance that can burn)</li><li><b>Air (oxygen)</b> to support burning</li><li>Heating the fuel to its <b>ignition temperature</b></li></ul><p>Removing any one of these puts out a fire. That is why sand or a blanket thrown over a small fire cuts off the air.</p><div class=\"nterm\">Ignition temperature is the lowest temperature at which a substance catches fire.</div>"
      }
    ],
    "recap": [
      "Physical changes alter shape, size or state but make no new substance.",
      "Chemical changes form new substances and are usually not easily reversed.",
      "Rusting needs both oxygen and water; painting and galvanisation prevent it.",
      "Combustion needs fuel, oxygen and heating up to the ignition temperature."
    ]
  },
  '7:adolescence': {
    "read": 7,
    "sections": [
      {
        "h": "Growing Up",
        "body": "<p>Have you noticed that your older cousins suddenly grew taller, or that your own clothes have become short? This is because you are entering a special stage of life called <b>adolescence</b>.</p><p>Adolescence is the period between childhood and adulthood, roughly from <b>10 to 19 years</b> of age. The body and mind both change a lot during these years.</p><div class=\"nterm\">Adolescence is the stage of life between childhood and adulthood, roughly from 10 to 19 years.</div>"
      },
      {
        "h": "Puberty and Hormones",
        "body": "<p>The body changes of adolescence begin with <b>puberty</b>. These changes are controlled by chemical messengers in the body called <b>hormones</b>.</p><p>Puberty does not start at the same age for everyone. It usually starts a little earlier in girls than in boys. Every person grows at their own pace, so there is no need to compare yourself with friends.</p><div class=\"nterm\">Puberty is the time when the body starts changing and becomes able to reproduce.</div>"
      },
      {
        "h": "Physical Changes in the Body",
        "body": "<ul><li><b>Sudden increase in height</b>, as the bones of the arms and legs grow longer.</li><li><b>Change in body shape:</b> boys' shoulders often become broader, and girls' hips become wider.</li><li><b>Voice change:</b> boys' voices become deeper and may crack for a while; a bulge called the <b>Adam's apple</b> may appear in the throat. Girls' voices may become higher.</li><li><b>Hair growth</b> in underarms and some other body parts; boys may begin to grow a moustache and beard.</li><li>Sweat and oil glands become more active, which can cause <b>body odour</b> and <b>pimples (acne)</b>.</li><li>Girls begin to have <b>menstruation</b> (periods), a normal and healthy monthly process.</li></ul>"
      },
      {
        "h": "Emotional and Social Changes",
        "body": "<p>Adolescence is not only about the body. You may notice that:</p><ul><li>Your moods change quickly, from happy to upset.</li><li>You want more independence and to make your own choices.</li><li>Friends and what they think start to matter a lot.</li><li>You feel curious, and sometimes shy or confused, about the changes in your body.</li></ul><p>All of this is normal. Talking to parents, teachers, elder siblings or a school counsellor helps. Asking questions is a sign of good sense, not something to be ashamed of.</p>"
      },
      {
        "h": "Healthy Eating",
        "body": "<p>The body grows fast during adolescence, so it needs a <b>balanced diet</b>: dal, roti or rice, green vegetables, fruits, milk, curd, eggs or paneer.</p><ul><li><b>Proteins</b> help in growth.</li><li><b>Calcium</b> from milk and ragi helps build strong bones.</li><li><b>Iron</b> from green leafy vegetables, jaggery, dates and amla helps make healthy blood. Too little iron can cause <b>anaemia</b>, which makes a person tired and weak.</li></ul><p>Eat less junk food like chips and sugary drinks, and drink plenty of water.</p>"
      },
      {
        "h": "Personal Hygiene and Fitness",
        "body": "<ul><li>Take a bath daily and wear clean, dry clothes, especially undergarments.</li><li>Wash your face gently to keep pimples in check, and avoid squeezing them.</li><li>During periods, girls should use clean sanitary pads or cloth, change them regularly and dispose of them properly.</li><li>Play outdoor games, do yoga or cycle. Exercise keeps the body fit and the mind cheerful.</li><li>Get enough sleep: about 8 to 10 hours a night.</li></ul><div class=\"nterm\">Menstrual hygiene means keeping clean and using clean pads or cloth during periods.</div>"
      },
      {
        "h": "Staying Safe and Busting Myths",
        "body": "<p>Some people may try to push young people towards tobacco, alcohol or drugs. These harm the brain and body and are hard to give up. Learn to say a firm <b>no</b> and stay away from such company.</p><p>There are also many myths about growing up. For example, some believe a girl should not enter the kitchen or play sports during her periods. Science shows periods are a natural process and there is no reason to stop normal activities.</p><p>If anything confuses or worries you, speak to a trusted adult.</p>"
      }
    ],
    "recap": [
      "Adolescence is the stage between childhood and adulthood, roughly 10 to 19 years.",
      "Puberty brings changes in height, voice, body shape and hair, controlled by hormones.",
      "A balanced diet rich in protein, calcium and iron supports healthy growth.",
      "Good hygiene, exercise, sleep and saying no to drugs keep adolescents healthy."
    ]
  },
  '7:heat-transfer': {
    "read": 8,
    "sections": [
      {
        "h": "Heat Moves from Hot to Cold",
        "body": "<p>When you hold a cup of hot tea, your hands feel warm. When you hold an ice cube, your hand feels cold. In both cases, <b>heat</b> is moving from the hotter object to the colder one.</p><ul><li>Heat always flows from a hotter object to a colder object.</li><li>It keeps flowing until both objects reach the same temperature.</li><li>Heat can be transferred in three ways: <b>conduction</b>, <b>convection</b> and <b>radiation</b>.</li></ul><div class=\"nterm\">Heat transfer is the movement of heat from a hotter region to a colder region.</div>"
      },
      {
        "h": "Conduction",
        "body": "<p>Put a steel spoon in a bowl of hot dal. After some time, the handle also becomes hot, even though it is not in the dal. Heat has travelled along the spoon from the hot end to the cold end.</p><p>In an activity, wax is used to stick small pins along a metal strip. When one end of the strip is heated, the pins fall one by one, starting from the pin nearest the flame. This shows heat moving through the solid, step by step.</p><ul><li>In conduction, heat moves from particle to particle of the material.</li><li>The particles themselves do not move from their places.</li><li>Conduction mostly happens in solids.</li></ul><div class=\"nterm\">Conduction is the transfer of heat from the hotter part of a solid to its colder part without the particles moving from their places.</div>"
      },
      {
        "h": "Conductors and Insulators",
        "body": "<p>Some materials let heat pass through them easily. Others do not.</p><ul><li><b>Conductors</b>: materials that allow heat to pass easily, like iron, steel, copper and aluminium. This is why cooking pans (kadhai, tava) are made of metal.</li><li><b>Insulators</b>: materials that do not allow heat to pass easily, like wood, plastic, cloth, clay and air.</li><li>Handles of pressure cookers and pans are made of plastic or wood so that we can hold them safely.</li><li>Woollen clothes keep us warm in winter because wool traps air, and air is a poor conductor of heat.</li></ul><div class=\"nterm\">Materials that allow heat to pass through easily are good conductors, and those that do not are insulators (poor conductors).</div>"
      },
      {
        "h": "Convection in Liquids",
        "body": "<p>Heat a beaker of water with a few crystals of potassium permanganate placed gently at the bottom. You will see coloured streams rising from the heated part and moving down along the sides.</p><ul><li>Water near the flame gets hot, becomes lighter and rises up.</li><li>Cooler, heavier water from above moves down to take its place.</li><li>This up and down movement goes on, and all the water gets heated.</li><li>Convection happens in liquids and gases, because their particles can move.</li></ul><div class=\"nterm\">Convection is the transfer of heat by the actual movement of the particles of a liquid or a gas.</div>"
      },
      {
        "h": "Convection in Air: Sea and Land Breeze",
        "body": "<p>Hot air rises, which is why smoke from an incense stick (agarbatti) goes upward. Convection in air also causes breezes near the sea, for example in places like Chennai, Mumbai or Goa.</p><ul><li><b>Sea breeze (day)</b>: land heats up faster than sea water. Air over the land becomes warm and rises. Cooler air from the sea moves in to take its place.</li><li><b>Land breeze (night)</b>: land cools down faster than water. Now air over the sea is warmer and rises. Cooler air from the land moves towards the sea.</li><li>Ventilators are placed near the ceiling so that warm air, which rises, can go out of the room.</li></ul><div class=\"nterm\">Sea breeze blows from sea to land during the day, and land breeze blows from land to sea at night.</div>"
      },
      {
        "h": "Radiation",
        "body": "<p>The Sun is very far away, and there is no air in most of the space between the Sun and the Earth. Still, its heat reaches us. This happens by <b>radiation</b>.</p><ul><li>Radiation does not need any material (medium) to carry heat.</li><li>We feel heat from a fire or a heater (angithi) by radiation even without touching it.</li><li>All hot objects give out heat by radiation.</li><li>Dark coloured objects absorb more heat than light coloured ones. That is why we prefer white or light coloured clothes in summer and dark clothes in winter.</li></ul><div class=\"nterm\">Radiation is the transfer of heat without the need of any medium.</div>"
      },
      {
        "h": "Water Cycle and Groundwater",
        "body": "<p>Heat from the Sun keeps water moving on Earth in a cycle.</p><ul><li><b>Evaporation</b>: the Sun heats water in oceans, rivers and lakes, and it changes into water vapour.</li><li><b>Condensation</b>: water vapour rises, cools and forms tiny droplets that make clouds.</li><li><b>Precipitation</b>: when droplets become heavy, they fall as rain, snow or hail.</li><li>Rainwater flows into rivers, lakes and oceans, and some of it seeps into the ground.</li><li>Water seeping into the soil is called <b>infiltration</b>. It fills the spaces between soil and rocks and becomes <b>groundwater</b>, which we get from wells and handpumps.</li></ul><p>Cutting trees and covering land with concrete reduce infiltration, so we must save and recharge groundwater, for example by rainwater harvesting.</p><div class=\"nterm\">The continuous movement of water between the Earth's surface and the air is called the water cycle.</div>"
      }
    ],
    "recap": [
      "Heat always flows from a hotter object to a colder object.",
      "In solids heat moves by conduction; metals are good conductors, while wood, plastic and air are insulators.",
      "In liquids and gases heat moves by convection, which also causes sea breeze by day and land breeze at night.",
      "Heat from the Sun reaches us by radiation, which needs no medium, and it drives the water cycle."
    ]
  },
  '7:time-and-motion': {
    "read": 8,
    "sections": [
      {
        "h": "Measuring Time in the Past",
        "body": "<p>Long ago, people had no watches. They used regular events in nature, like sunrise, sunset, the phases of the Moon and seasons, to keep track of time.</p><ul><li><b>Sundial</b>: the shadow of a stick moves as the Sun moves across the sky, showing the time of day. The Jantar Mantar in Jaipur and Delhi has large sundials.</li><li><b>Water clock</b>: a bowl with a small hole slowly sinks in water. In India, a water clock called <b>ghatika</b> was used. One ghatika was about 24 minutes.</li><li><b>Sand clock (hourglass)</b>: sand flows from the upper bulb to the lower one in a fixed time.</li><li><b>Candle clock</b>: a candle marked with lines burns down at a steady rate.</li></ul><div class=\"nterm\">Any event that repeats itself after equal intervals of time can be used to measure time.</div>"
      },
      {
        "h": "The Simple Pendulum",
        "body": "<p>A simple pendulum is a small heavy ball (called a <b>bob</b>) hung by a thread from a fixed point. When the bob is pulled to one side and released, it swings to and fro.</p><ul><li>One <b>oscillation</b> is when the bob moves from one extreme end to the other and comes back to the starting end.</li><li>The time taken for one oscillation is called the <b>time period</b>.</li><li>To find the time period, measure the time for 20 oscillations and divide by 20.</li><li>For a given length of thread, the time period stays the same.</li><li>A longer thread gives a longer time period. The time period does not depend on the mass of the bob.</li></ul><div class=\"nterm\">The time period of a pendulum is the time it takes to complete one oscillation.</div>"
      },
      {
        "h": "Units of Time and Modern Clocks",
        "body": "<p>Because a pendulum swings with a fixed time period, it was used to make pendulum clocks. Today we use quartz clocks and digital watches, which are much more accurate. Atomic clocks are the most accurate of all.</p><ul><li>The SI unit of time is the <b>second</b>, written as <b>s</b>.</li><li>60 seconds = 1 minute, and 60 minutes = 1 hour.</li><li>24 hours = 1 day.</li><li>Indian Standard Time (IST) is kept very accurately by the National Physical Laboratory in New Delhi.</li></ul><div class=\"nterm\">The second (s) is the SI unit of time.</div>"
      },
      {
        "h": "Slow or Fast: Speed",
        "body": "<p>In a school race, the student who covers the same distance in the least time is the fastest. To compare how fast things move, we use <b>speed</b>.</p><ul><li>Speed = Distance covered / Time taken</li><li>The SI unit of speed is <b>metre per second (m/s)</b>.</li><li>For vehicles, we often use <b>kilometre per hour (km/h)</b>.</li><li>Example: a bus covers 120 km in 2 hours. Its speed = 120 / 2 = 60 km/h.</li></ul><div class=\"nterm\">Speed is the distance covered by an object in a unit time.</div>"
      },
      {
        "h": "Average Speed",
        "body": "<p>A scooter on a city road rarely moves at the same speed. It slows down at traffic signals and speeds up on open roads. So we usually talk about its <b>average speed</b>.</p><ul><li>Average speed = Total distance covered / Total time taken</li><li>If a train covers 300 km in 5 hours, its average speed is 300 / 5 = 60 km/h, even though it may have gone faster or slower at different times.</li><li>If we know the speed and the time, we can find distance: Distance = Speed x Time.</li></ul><div class=\"nterm\">Average speed is the total distance covered divided by the total time taken.</div>"
      },
      {
        "h": "Uniform and Non-uniform Motion",
        "body": "<p>When an object moves along a straight line, its motion is called <b>linear motion</b>. It can be of two kinds.</p><ul><li><b>Uniform linear motion</b>: the object covers equal distances in equal intervals of time. Its speed stays the same. Example: a train moving on a straight track at a steady speed for some time.</li><li><b>Non-uniform linear motion</b>: the object covers unequal distances in equal intervals of time. Its speed keeps changing. Example: a car in traffic, or a ball rolling and slowing down.</li><li>Most motions around us in daily life are non-uniform.</li></ul><div class=\"nterm\">In uniform linear motion, an object moving along a straight line covers equal distances in equal intervals of time.</div>"
      },
      {
        "h": "Speedometer and Odometer",
        "body": "<p>Look at the dashboard of a car or a motorbike. You will find two useful meters.</p><ul><li><b>Speedometer</b>: shows the speed of the vehicle at that moment, usually in km/h.</li><li><b>Odometer</b>: shows the total distance the vehicle has travelled, usually in km.</li><li>By noting the odometer reading at the start and end of a trip, and the time taken, we can find the average speed of the journey.</li></ul><div class=\"nterm\">A speedometer measures speed, and an odometer measures the distance travelled by a vehicle.</div>"
      }
    ],
    "recap": [
      "Sundials, water clocks (ghatika), sand clocks and pendulums use repeating events to measure time.",
      "The time period of a simple pendulum depends on its length, not on the mass of the bob.",
      "Speed = distance / time; the SI unit of time is the second and of speed is m/s.",
      "In uniform motion equal distances are covered in equal times; in non-uniform motion they are not."
    ]
  },
  '7:life-processes-animals': {
    "read": 9,
    "sections": [
      {
        "h": "Why Animals Need Food and Air",
        "body": "<p>All animals, including us, need energy to walk, play, grow and even to sleep. This energy comes from food. Animals also need oxygen from the air to release energy from food.</p><ul><li>Getting food and using it is called <b>nutrition</b>.</li><li>Taking in oxygen and giving out carbon dioxide is part of <b>respiration</b>.</li><li>Nutrition and respiration are two important <b>life processes</b>.</li></ul><div class=\"nterm\">Life processes are the activities that living beings carry out to stay alive, such as nutrition and respiration.</div>"
      },
      {
        "h": "Digestion Begins: Mouth and Food Pipe",
        "body": "<p>Food like roti and rice is made of large pieces that the body cannot use directly. It has to be broken down into simpler substances. This is called <b>digestion</b>.</p><ul><li><b>Mouth</b>: teeth cut, tear and grind the food. The tongue mixes food with saliva and helps us taste and swallow.</li><li><b>Saliva</b> breaks down starch into sugar. That is why a piece of roti chewed for a long time starts tasting sweet.</li><li><b>Food pipe (oesophagus)</b>: carries food from the mouth to the stomach by wave-like movements of its walls.</li></ul><div class=\"nterm\">Digestion is the process of breaking down complex food into simpler substances that the body can absorb.</div>"
      },
      {
        "h": "Stomach and Small Intestine",
        "body": "<p>The <b>stomach</b> is a bag-like organ. Its walls release digestive juices and an acid (hydrochloric acid). The acid kills many germs in food, and the juices help break down proteins. The inner lining is protected by mucus.</p><ul><li>The <b>small intestine</b> is a long, coiled tube, about 7 metres long in an adult.</li><li>It receives <b>bile</b> from the <b>liver</b>, which helps digest fats, and juices from the <b>pancreas</b>.</li><li>Here digestion of food is completed.</li><li>Digested food passes through the walls of the small intestine into the blood. This is called <b>absorption</b>. Finger-like structures called <b>villi</b> increase the surface for absorption.</li><li>The blood carries digested food to all parts of the body, where it is used. This is <b>assimilation</b>.</li></ul><div class=\"nterm\">Absorption is the passing of digested food through the walls of the small intestine into the blood.</div>"
      },
      {
        "h": "Large Intestine and Egestion",
        "body": "<p>Food that is not digested moves into the <b>large intestine</b>. It is wider but shorter than the small intestine.</p><ul><li>The large intestine absorbs water and some salts from the undigested food.</li><li>The remaining waste becomes semi-solid and is stored in the <b>rectum</b>.</li><li>It is removed from the body through the <b>anus</b>. This is called <b>egestion</b>.</li><li>Eating fibre-rich food like fruits, vegetables, whole grains and dals helps waste move smoothly.</li></ul><div class=\"nterm\">Egestion is the removal of undigested food (faeces) from the body through the anus.</div>"
      },
      {
        "h": "Nutrition in Other Animals",
        "body": "<p>Different animals take in and digest food in different ways.</p><ul><li><b>Ruminants</b> like cows, buffaloes and goats swallow grass quickly and store it in a part of the stomach called the <b>rumen</b>. Later, they bring it back to the mouth in small lumps (cud) and chew it again. This is called <b>rumination</b>, or chewing the cud.</li><li><b>Amoeba</b> is a single-celled organism. It pushes out finger-like projections called <b>pseudopodia</b> to surround and capture food. The food is digested inside a <b>food vacuole</b>.</li><li>Other animals have special body parts for feeding: a snake swallows its prey whole, a butterfly sucks nectar, and a mosquito sucks blood.</li></ul><div class=\"nterm\">Rumination is the process in which animals like cows bring back partly digested food from the stomach to the mouth and chew it again.</div>"
      },
      {
        "h": "Breathing and Respiration in Humans",
        "body": "<p>We breathe in air through the nose. It passes through the windpipe to the two <b>lungs</b> in the chest.</p><ul><li><b>Inhalation</b>: taking air rich in oxygen into the lungs. The chest expands and the <b>diaphragm</b>, a muscular sheet below the lungs, moves down.</li><li><b>Exhalation</b>: giving out air rich in carbon dioxide. The chest contracts and the diaphragm moves up.</li><li>The number of times a person breathes in one minute is the <b>breathing rate</b>. An adult at rest breathes about 12 to 20 times a minute. It increases during running or playing.</li><li>In the cells, oxygen is used to break down food and release energy. Carbon dioxide and water are produced.</li></ul><div class=\"nterm\">Breathing is taking in air and giving it out, while respiration is the process in which food is broken down in cells to release energy.</div>"
      },
      {
        "h": "Respiration in Other Animals",
        "body": "<p>Animals living in different places have different ways of taking in oxygen.</p><ul><li><b>Earthworm</b>: breathes through its moist skin. Gases pass directly through the skin.</li><li><b>Fish</b>: breathe through <b>gills</b>, which take in oxygen dissolved in water.</li><li><b>Insects</b> like grasshoppers and cockroaches: have small openings on their body called <b>spiracles</b>. Air enters through spiracles into a network of air tubes called <b>tracheae</b>.</li><li>Frogs can breathe through lungs and also through their moist skin.</li><li>Mammals, birds and reptiles such as cows, crows and lizards breathe through lungs.</li></ul><div class=\"nterm\">Gills in fish, spiracles and tracheae in insects, and moist skin in earthworms are special organs for exchange of gases.</div>"
      }
    ],
    "recap": [
      "Food is digested step by step in the mouth, stomach and small intestine, and water is absorbed in the large intestine.",
      "Digested food is absorbed into the blood through villi of the small intestine and used by the body.",
      "Cows chew the cud (rumination), and Amoeba captures food with pseudopodia and digests it in a food vacuole.",
      "Humans breathe with lungs, fish with gills, insects with spiracles and tracheae, and earthworms through their skin."
    ]
  },
  '7:life-processes-plants': {
    "read": 8,
    "sections": [
      {
        "h": "Plants make their own food",
        "body": "<p>Animals, including us, eat plants or other animals for food. Green plants are different: they make their own food. Because of this, plants are called <b>autotrophs</b> (auto means self, troph means nourishment).</p><p>Humans and other animals depend on plants, directly or indirectly, for food. The dal, rice, roti and sabzi on your plate all come from plants.</p><div class=\"nterm\">Autotrophs are living things, like green plants, that make their own food.</div>"
      },
      {
        "h": "Photosynthesis: how leaves make food",
        "body": "<p>Leaves are the food factories of a plant. They make food by a process called <b>photosynthesis</b>.</p><p>For photosynthesis, a leaf needs:</p><ul><li><b>Carbon dioxide</b> from the air</li><li><b>Water</b>, taken in by the roots from the soil</li><li><b>Sunlight</b>, which gives the energy</li><li><b>Chlorophyll</b>, the green pigment in leaves that traps sunlight</li></ul><p>The leaf makes food in the form of <b>glucose</b>, a simple sugar, and releases <b>oxygen</b> into the air.</p><p>Carbon dioxide + Water, in the presence of sunlight and chlorophyll, gives Glucose + Oxygen.</p><div class=\"nterm\">Photosynthesis is the process by which green plants use sunlight, water and carbon dioxide to make food and release oxygen.</div>"
      },
      {
        "h": "Stomata and starch",
        "body": "<p>The underside of a leaf has many tiny pores called <b>stomata</b> (singular: stoma). You can see them only with a microscope. Carbon dioxide enters the leaf through stomata, and oxygen and water vapour go out.</p><p>The glucose made in leaves is changed into <b>starch</b> and stored. We can test a leaf for starch using <b>iodine solution</b>: if starch is present, the leaf turns blue-black.</p><p>A leaf from a plant kept in the dark for a few days shows no blue-black colour. This shows that sunlight is needed to make food. Plants store starch in parts like potato tubers, rice and wheat grains, which is why these are good food for us.</p><div class=\"nterm\">Stomata are tiny pores, mostly on the underside of leaves, through which gases move in and out.</div>"
      },
      {
        "h": "Leaves of other colours",
        "body": "<p>Some plants, like red amaranth (lal saag) or coleus, have red, purple or brown leaves. Do they make food? Yes. These leaves also have chlorophyll, but other coloured pigments hide the green colour.</p><p>Plants are also important for the air around us. Photosynthesis adds oxygen to the air, which all animals need to breathe, and removes carbon dioxide.</p>"
      },
      {
        "h": "Do plants respire?",
        "body": "<p>Like animals, plants also need energy to live and grow. They get this energy by breaking down food through <b>respiration</b>. In respiration, glucose is broken down using oxygen, and carbon dioxide, water and energy are released.</p><p>Every part of a plant respires, all the time, day and night:</p><ul><li><b>Leaves</b> take in air through stomata.</li><li><b>Stems</b> exchange gases through small openings on their surface.</li><li><b>Roots</b> take oxygen from the air present in the spaces between soil particles. This is why overwatering a potted plant can harm its roots.</li></ul><p>Germinating seeds (like sprouted moong) also respire. The carbon dioxide they give out turns <b>lime water</b> milky.</p><div class=\"nterm\">Respiration is the process in which food is broken down, usually using oxygen, to release energy.</div>"
      },
      {
        "h": "Transport of water and minerals",
        "body": "<p>Roots absorb water and minerals from the soil. These must reach the leaves, which may be many metres high in a tall tree. Plants have special tube-like tissues, called <b>vascular tissues</b>, for transport:</p><ul><li><b>Xylem</b> carries water and minerals from the roots, up the stem, to the leaves and other parts.</li><li><b>Phloem</b> carries food made in the leaves to all other parts of the plant, including roots and fruits.</li></ul><p>Activity: put a balsam or celery stem in water with a few drops of red ink. After some hours, you can see red lines in the stem. These show the path of water through the xylem.</p><div class=\"nterm\">Xylem carries water and minerals upward from roots, while phloem carries food from leaves to all parts of the plant.</div>"
      },
      {
        "h": "Transpiration",
        "body": "<p>Plants lose a lot of water as water vapour, mostly through the stomata of leaves. This is called <b>transpiration</b>.</p><p>If you tie a clear plastic bag around a leafy branch on a sunny day, you will see water droplets inside the bag after a few hours.</p><p>Transpiration is useful: it creates a pull that helps draw water up through the xylem from the roots, and it helps keep the plant cool. This is one reason why it feels cooler under a big neem or peepal tree.</p><div class=\"nterm\">Transpiration is the loss of water as vapour from the aerial parts of a plant, mainly through the stomata.</div>"
      }
    ],
    "recap": [
      "Green plants are autotrophs: they make their own food by photosynthesis.",
      "Photosynthesis needs carbon dioxide, water, sunlight and chlorophyll, and releases oxygen.",
      "All plant parts respire day and night; roots take oxygen from air in the soil.",
      "Xylem carries water and minerals up; phloem carries food; transpiration helps pull water up."
    ]
  },
  '7:light-shadows': {
    "read": 8,
    "sections": [
      {
        "h": "Sources of light",
        "body": "<p>We see objects when light from them reaches our eyes. Objects that give out their own light are called <b>luminous objects</b>, for example the Sun, a burning candle, a diya and a torch bulb that is switched on.</p><p>Objects that do not give out their own light are <b>non-luminous objects</b>, such as a book, a chair or the Moon. We see them because light from a luminous source falls on them and bounces back to our eyes.</p><div class=\"nterm\">A luminous object gives out its own light; a non-luminous object does not.</div>"
      },
      {
        "h": "Transparent, translucent and opaque",
        "body": "<p>Materials can be grouped by how much light passes through them:</p><ul><li><b>Transparent</b>: almost all light passes through, and we can see clearly through them. Examples: clear glass, clean water, air.</li><li><b>Translucent</b>: some light passes through, but we cannot see clearly. Examples: butter paper, frosted glass, oily paper.</li><li><b>Opaque</b>: no light passes through. Examples: wood, cardboard, a steel plate, a brick wall.</li></ul>"
      },
      {
        "h": "Light travels in a straight line",
        "body": "<p>Light a candle and look at it through a straight pipe. You can see the flame. Now bend the pipe: you cannot see the flame any more. This shows that light travels in a <b>straight line</b>.</p><p>You can also see this when sunlight enters a dark room through a small gap: the beam of light looks straight, with dust particles shining in it.</p>"
      },
      {
        "h": "Shadows",
        "body": "<p>When an opaque object comes in the path of light, it blocks the light. A dark area forms behind it. This dark area is its <b>shadow</b>.</p><p>To see a shadow, we need three things: a <b>source of light</b>, an <b>opaque object</b> and a <b>screen</b> (like a wall or the ground) behind the object.</p><ul><li>Shadows form because light travels in straight lines and cannot bend around the object.</li><li>A shadow is always dark, whatever the colour of the object. A red ball also makes a dark shadow.</li><li>The size of a shadow changes with the distance between the object and the light source. Your shadow is long in the morning and evening, and short around noon.</li><li>Transparent objects make almost no shadow; translucent objects make faint shadows.</li></ul><div class=\"nterm\">A shadow is the dark area formed when an opaque object blocks light.</div>"
      },
      {
        "h": "Pinhole camera",
        "body": "<p>A <b>pinhole camera</b> is a simple box with a tiny hole on one side and a screen of tracing paper (butter paper) on the other side.</p><p>When you point it at a bright object, such as a lit bulb or a tree in sunlight, you see its image on the screen. The image is <b>upside down</b> (inverted). This happens because light from the top of the object travels in a straight line through the hole and reaches the bottom of the screen, and light from the bottom reaches the top.</p><p>Sometimes, under a leafy tree, you see round patches of light on the ground. These are pinhole images of the Sun, formed by small gaps between leaves.</p>"
      },
      {
        "h": "Reflection of light",
        "body": "<p>When light falls on a shiny, smooth surface like a mirror, it bounces back. This is called <b>reflection of light</b>. We see our face in a mirror because of reflection.</p><p>You can change the direction of light using a mirror. For example, children sometimes flash sunlight on a wall with a small mirror. A <b>periscope</b>, used in submarines, uses two mirrors to let a person see over a wall or obstacle.</p><p>The light that falls on a mirror is the <b>incident ray</b>, and the light that bounces back is the <b>reflected ray</b>. For a plane mirror, the angle of incidence is equal to the angle of reflection.</p><div class=\"nterm\">Reflection is the bouncing back of light when it falls on a surface, especially a shiny, smooth one like a mirror.</div>"
      },
      {
        "h": "Image in a plane mirror",
        "body": "<p>A flat mirror, like the one in your bathroom, is a <b>plane mirror</b>. The image formed in it:</p><ul><li>is <b>erect</b> (upright, not upside down),</li><li>is of the <b>same size</b> as the object,</li><li>appears as far <b>behind</b> the mirror as the object is in front of it,</li><li>is <b>laterally inverted</b>: left looks like right and right looks like left. If you raise your right hand, your image seems to raise its left hand.</li></ul><p>This is why the word AMBULANCE is written in reverse on the front of ambulances: drivers ahead read it correctly in their rear-view mirrors.</p><div class=\"nterm\">Lateral inversion means the left and right sides of an object appear swapped in its mirror image.</div>"
      }
    ],
    "recap": [
      "Luminous objects give their own light; materials can be transparent, translucent or opaque.",
      "Light travels in a straight line, so opaque objects form dark shadows.",
      "A pinhole camera forms an upside-down image because light travels in straight lines.",
      "A plane mirror forms an erect, same-size, laterally inverted image by reflection."
    ]
  },
  '7:earth-moon-sun': {
    "read": 8,
    "sections": [
      {
        "h": "Rotation of the Earth",
        "body": "<p>The Earth spins like a top on an imaginary line called its <b>axis</b>, which passes through the North Pole and the South Pole. This spinning is called <b>rotation</b>.</p><p>The Earth rotates from <b>west to east</b>. One full rotation takes about <b>24 hours</b>, which is one day.</p><p>The axis is not straight up: it is tilted.</p><div class=\"nterm\">Rotation is the spinning of the Earth on its own axis, which takes about 24 hours.</div>"
      },
      {
        "h": "Day and night",
        "body": "<p>The Earth is shaped like a ball, so the Sun can light up only half of it at a time. The half facing the Sun has <b>day</b>, and the other half has <b>night</b>.</p><p>As the Earth rotates, places move from the lit half to the dark half and back again. This is how day and night happen one after the other.</p><p>Try it: in a dark room, shine a torch on a ball or globe and slowly turn it. You will see each place get light and then darkness.</p>"
      },
      {
        "h": "Why the Sun seems to move",
        "body": "<p>The Sun appears to rise in the <b>east</b> in the morning and set in the <b>west</b> in the evening. But the Sun is not moving around the Earth. It only seems so because the Earth rotates from west to east.</p><p>It is like sitting in a moving train: trees and poles outside seem to move backwards, even though they are still. In the same way, the Sun, the Moon and the stars seem to move across the sky from east to west.</p><p>Since the Earth rotates west to east, places in the east see the sunrise earlier. The Sun rises in Arunachal Pradesh nearly two hours before it rises in Gujarat.</p>"
      },
      {
        "h": "Revolution of the Earth",
        "body": "<p>While rotating, the Earth also moves around the Sun in a fixed path called its <b>orbit</b>. This movement is called <b>revolution</b>.</p><p>One revolution takes about <b>365 and a quarter days</b>, which is one year. The extra quarter day each year adds up to one full day every four years. So every fourth year, called a <b>leap year</b>, has 366 days, with 29 days in February.</p><div class=\"nterm\">Revolution is the movement of the Earth around the Sun, which takes about one year.</div>"
      },
      {
        "h": "The Moon and its phases",
        "body": "<p>The Moon is the Earth's natural satellite. It does not have its own light; it shines because it reflects sunlight.</p><p>The Moon revolves around the Earth, taking about 27 days for one revolution. It also rotates on its axis in the same time, so we always see the <b>same side</b> of the Moon from Earth.</p><p>Half of the Moon is always lit by the Sun, but as the Moon goes around the Earth, we see different amounts of this lit half. So the Moon seems to change shape. These shapes are called <b>phases of the Moon</b>.</p><ul><li><b>New Moon</b> (Amavasya): the Moon is not visible.</li><li><b>Full Moon</b> (Purnima): the whole round face is visible.</li><li>From new moon to full moon, the lit part grows (waxing, Shukla Paksha); from full moon to new moon, it shrinks (waning, Krishna Paksha).</li></ul><p>The cycle from one new moon to the next takes about 29.5 days. Many Indian festivals, like Diwali (on Amavasya) and Holi (on Purnima), follow the Moon's phases.</p><div class=\"nterm\">Phases of the Moon are the changing shapes of the lit part of the Moon that we see from Earth.</div>"
      },
      {
        "h": "Eclipses",
        "body": "<p>An eclipse happens when the Sun, the Earth and the Moon come in a straight line and one casts a shadow on the other.</p><ul><li><b>Solar eclipse</b>: the Moon comes between the Sun and the Earth. The Moon blocks sunlight, and its shadow falls on part of the Earth. It can happen only on a new moon day.</li><li><b>Lunar eclipse</b>: the Earth comes between the Sun and the Moon. The Earth's shadow falls on the Moon. It can happen only on a full moon night.</li></ul><p>Eclipses do not happen every month because the Moon's orbit is slightly tilted compared to the Earth's orbit, so the three are not in a straight line most months.</p><p><b>Safety:</b> never look at the Sun directly, even during a solar eclipse. It can permanently damage your eyes. Use certified solar viewing glasses or a pinhole projection. A lunar eclipse is safe to watch with bare eyes.</p><div class=\"nterm\">An eclipse happens when one heavenly body blocks the light of the Sun from reaching another.</div>"
      }
    ],
    "recap": [
      "The Earth rotates west to east in about 24 hours, causing day and night.",
      "The Sun seems to rise in the east and set in the west because of Earth's rotation.",
      "The Earth revolves around the Sun in about 365 and a quarter days; the Moon shows phases.",
      "Solar eclipse: Moon between Sun and Earth; lunar eclipse: Earth between Sun and Moon."
    ]
  },
  '7:integers': {
    "read": 8,
    "sections": [
      {
        "h": "Integers and the number line",
        "body": "<p>Integers are the numbers ..., -3, -2, -1, 0, 1, 2, 3, ... They include the positive numbers, the negative numbers and zero. On a number line, positive integers lie to the right of 0 and negative integers lie to the left. Zero is neither positive nor negative.</p><div class=\"nterm\">Of two integers, the one on the right of the number line is greater. So every positive integer is greater than 0, and 0 is greater than every negative integer.</div><p>This is why -2 is greater than -9: -2 is closer to 0 and lies to the right of -9. The smallest positive integer is 1 and the greatest negative integer is -1.</p><p>Example: Arrange -6, 2, -1, 0, -9 in ascending order (smallest first).<br>Solution: Read them from left to right on the number line: -9, -6, -1, 0, 2.</p><p>Example: How many integers lie between -4 and 3?<br>Solution: They are -3, -2, -1, 0, 1, 2, so there are 6 integers.</p>"
      },
      {
        "h": "Adding integers",
        "body": "<p>To add on a number line, start at the first number. Move right to add a positive integer and move left to add a negative integer.</p><div class=\"nterm\">Same signs: add the numbers and keep the sign. Different signs: subtract the smaller number from the bigger one and keep the sign of the bigger one.</div><p>Example: Find (-7) + (-5).<br>Solution: Both are negative, so add 7 and 5 to get 12 and keep the minus sign. The answer is -12.</p><p>Example: Find (-9) + 4.<br>Solution: The signs are different. 9 - 4 = 5 and 9 is the bigger number and it is negative, so the answer is -5.</p><p>Example: Find 12 + (-7).<br>Solution: 12 - 7 = 5, and 12 is positive, so the answer is 5.</p>"
      },
      {
        "h": "Subtracting integers",
        "body": "<p>Subtracting an integer is the same as adding its additive inverse (its opposite).</p><div class=\"nterm\">a - b = a + (-b). So subtracting a negative number means adding the matching positive number.</div><p>Example: Find 6 - (-4).<br>Solution: 6 - (-4) = 6 + 4 = 10.</p><p>Example: Find (-5) - 8.<br>Solution: (-5) - 8 = (-5) + (-8) = -13.</p><p>Example: Find (-5) - (-8).<br>Solution: (-5) - (-8) = (-5) + 8 = 3. Check: 3 + (-8) = -5, so the answer is right.</p>"
      },
      {
        "h": "Properties of addition and subtraction",
        "body": "<ul><li><b>Closure:</b> the sum and the difference of two integers is always an integer. For example 3 - 8 = -5.</li><li><b>Commutative:</b> a + b = b + a. This works for addition only. 5 - 3 = 2 but 3 - 5 = -2.</li><li><b>Associative:</b> (a + b) + c = a + (b + c). This works for addition only. (8 - 3) - 2 = 3 but 8 - (3 - 2) = 7.</li><li><b>Additive identity:</b> a + 0 = a, so 0 is the additive identity.</li><li><b>Additive inverse:</b> a + (-a) = 0, so -a is the additive inverse of a.</li></ul><div class=\"nterm\">Addition of integers is closed, commutative and associative, with identity 0. Subtraction is closed but is neither commutative nor associative.</div><p>Example: Find (-23) + 15 + 23 in the easiest way.<br>Solution: Change the order and group: [(-23) + 23] + 15 = 0 + 15 = 15.</p>"
      },
      {
        "h": "Multiplying integers",
        "body": "<p>Multiplication is repeated addition. For example 3 × (-4) = (-4) + (-4) + (-4) = -12. This gives the sign rules.</p><div class=\"nterm\">Positive × positive = positive. Negative × negative = positive. Positive × negative = negative. A product of an even number of negative integers is positive, and of an odd number is negative.</div><p>Example: Find (-6) × 7 and (-4) × (-9).<br>Solution: (-6) × 7 = -42. (-4) × (-9) = 36.</p><p>Example: Find (-1) × (-1) × (-1).<br>Solution: Three negative factors is an odd number, so the product is negative: -1.</p><p>Properties of multiplication of integers:</p><ul><li>Closed, commutative (a × b = b × a) and associative (a × b) × c = a × (b × c).</li><li>Identity: a × 1 = a, so 1 is the multiplicative identity.</li><li>Multiplying by zero: a × 0 = 0.</li><li>Distributive: a × (b + c) = a × b + a × c.</li></ul><div class=\"nterm\">a × (b + c) = a × b + a × c. Use it to break up or combine products.</div><p>Example: Check the distributive property for 5 × [(-3) + 8].<br>Solution: Left side: 5 × 5 = 25. Right side: 5 × (-3) + 5 × 8 = -15 + 40 = 25. Both sides are equal.</p><p>Example: Find (-25) × 37 × 4.<br>Solution: [(-25) × 4] × 37 = (-100) × 37 = -3700.</p>"
      },
      {
        "h": "Dividing integers",
        "body": "<p>Division is the opposite of multiplication, so the sign rules are the same as for multiplication.</p><div class=\"nterm\">Positive ÷ positive and negative ÷ negative give a positive answer. Positive ÷ negative and negative ÷ positive give a negative answer.</div><p>Example: Find (-48) ÷ 6, (-48) ÷ (-6) and 48 ÷ (-6).<br>Solution: (-48) ÷ 6 = -8. (-48) ÷ (-6) = 8. 48 ÷ (-6) = -8. Check the first: (-8) × 6 = -48.</p><ul><li>Any integer divided by 1 gives the same integer: a ÷ 1 = a.</li><li>Any non-zero integer divided by itself gives 1.</li><li>Zero divided by a non-zero integer gives 0.</li><li>Division by 0 is not defined.</li></ul><div class=\"nterm\">Division of integers is not commutative: a ÷ b is not equal to b ÷ a in general. Integers are also not closed under division.</div><p>Example: Is (-12) ÷ 4 equal to 4 ÷ (-12)?<br>Solution: (-12) ÷ 4 = -3, but 4 ÷ (-12) = -1/3 is not even an integer. So they are not equal, and division is not commutative.</p>"
      },
      {
        "h": "Word problems and expressions",
        "body": "<p>Write gains, rises and deposits as positive numbers. Write losses, falls and withdrawals as negative numbers. Then use the rules above.</p><p>Example: At 9 pm the temperature in Srinagar was 3°C. It fell by 2°C every hour. What was the temperature after 4 hours?<br>Solution: Change = 4 × (-2) = -8. Temperature = 3 + (-8) = -5°C.</p><p>Example: A shopkeeper makes a profit of ₹90 on each of 5 days and a loss of ₹60 on each of 2 days. What is the overall result?<br>Solution: 5 × 90 = 450 and 2 × (-60) = -120. Total = 450 + (-120) = 330, a profit of ₹330.</p><p>Example: A lift at floor 6 goes down 8 floors. Where does it reach?<br>Solution: 6 - 8 = -2, which is basement 2.</p><div class=\"nterm\">In an expression, do multiplication and division first, then addition and subtraction, going from left to right.</div><p>Example: Find (-3) × (-4) + 2.<br>Solution: Multiply first: (-3) × (-4) = 12. Then add: 12 + 2 = 14.</p><p>Example: Find 20 + (-18) ÷ 3.<br>Solution: Divide first: (-18) ÷ 3 = -6. Then 20 + (-6) = 14.</p>"
      }
    ],
    "recap": [
      "On the number line the integer on the right is always greater, and 0 is greater than every negative integer.",
      "Subtracting an integer means adding its opposite, so a - b = a + (-b).",
      "Addition and multiplication are closed, commutative and associative, but subtraction and division are not commutative.",
      "The identity for addition is 0 and for multiplication is 1; a × 0 = 0 and division by 0 is not defined.",
      "Product or quotient of two numbers with the same sign is positive, and with different signs it is negative."
    ]
  },
  '7:fractions-decimals': {
    "read": 8,
    "sections": [
      {
        "h": "Proper, improper and mixed fractions",
        "body": "<p>A <b>proper fraction</b> has a numerator smaller than its denominator, like 3/5. It is always less than 1. An <b>improper fraction</b> has a numerator that is bigger than or equal to its denominator, like 7/4 or 5/5. A <b>mixed fraction</b> has a whole part and a proper fraction part, like 2 1/4.</p><div class=\"nterm\">Mixed to improper: whole × denominator + numerator, all over the denominator. So 2 1/4 = (2 × 4 + 1)/4 = 9/4.</div><p>Example: Write 3 2/5 as an improper fraction. Solution: (3 × 5 + 2)/5 = 17/5.</p><p>To go the other way, divide the numerator by the denominator. The quotient is the whole part and the remainder is the new numerator.</p><p>Example: Write 11/3 as a mixed fraction. Solution: 11 ÷ 3 gives quotient 3 and remainder 2, so 11/3 = 3 2/3.</p>"
      },
      {
        "h": "Multiplying a fraction by a whole number",
        "body": "<p>Multiplying a fraction by a whole number is repeated addition. 3 × 2/5 means 2/5 + 2/5 + 2/5 = 6/5. We only multiply the numerator by the whole number and keep the denominator.</p><div class=\"nterm\">Fraction × whole number: (numerator × whole number)/denominator. Then simplify, and change to a mixed fraction if you like.</div><p>Example: Find 3/5 × 4. Solution: (3 × 4)/5 = 12/5 = 2 2/5.</p><p>The word <b>of</b> means multiply. So 1/2 of 6 is 1/2 × 6 = 3, and 2/3 of 12 is 2/3 × 12 = 24/3 = 8.</p><p>Example: Find 2/3 of 15 litres. Solution: 2/3 × 15 = 30/3 = 10 litres.</p>"
      },
      {
        "h": "Multiplying a fraction by a fraction",
        "body": "<p>To find a part of a part, we multiply the two fractions. 1/2 of 1/4 is 1/2 × 1/4 = 1/8. The product of two proper fractions is smaller than both of them.</p><div class=\"nterm\">Fraction × fraction: (numerator × numerator)/(denominator × denominator).</div><p>Example: Find 2/5 × 3/4. Solution: (2 × 3)/(5 × 4) = 6/20 = 3/10.</p><p>You can save time by cancelling common factors before multiplying.</p><p>Example: Find 4/9 × 3/8. Solution: Cancel 4 with 8 and 3 with 9, which leaves 1/3 × 1/2 = 1/6.</p><p>For mixed fractions, first change them to improper fractions. Example: 1 1/2 × 2/3. Solution: 3/2 × 2/3 = 1.</p>"
      },
      {
        "h": "Reciprocal and dividing fractions",
        "body": "<p>Two numbers whose product is 1 are <b>reciprocals</b> of each other. To find the reciprocal of a fraction, turn it upside down. The reciprocal of 5/8 is 8/5, and the reciprocal of 7 is 1/7. The number 0 has no reciprocal.</p><div class=\"nterm\">Dividing by a fraction means multiplying by its reciprocal: a ÷ (b/c) = a × (c/b).</div><p><b>Whole number ÷ fraction.</b> Example: 6 ÷ 2/3. Solution: 6 × 3/2 = 18/2 = 9.</p><p><b>Fraction ÷ whole number.</b> Example: 3/4 ÷ 3. Solution: 3/4 × 1/3 = 3/12 = 1/4.</p><p><b>Fraction ÷ fraction.</b> Example: 2/3 ÷ 4/5. Solution: 2/3 × 5/4 = 10/12 = 5/6.</p><p>Dividing by a fraction less than 1 gives a bigger answer, because that many small parts fit into the number.</p>"
      },
      {
        "h": "Multiplying decimals",
        "body": "<p>To multiply a decimal by 10, 100 or 1000, move the decimal point to the right by as many places as there are zeros.</p><div class=\"nterm\">× 10: move 1 place right. × 100: move 2 places right. × 1000: move 3 places right.</div><p>Example: Find 3.45 × 10 and 0.007 × 1000. Solution: 3.45 × 10 = 34.5 and 0.007 × 1000 = 7.</p><p>To multiply two decimals, ignore the points and multiply as whole numbers. Then put the point so that the answer has as many decimal places as the two numbers have together.</p><div class=\"nterm\">Decimal places in the product = decimal places in the first number + decimal places in the second number.</div><p>Example: Find 0.3 × 0.12. Solution: 3 × 12 = 36. The numbers have 1 + 2 = 3 decimal places, so the answer is 0.036.</p><p>Example: Find 2.5 × 0.4. Solution: 25 × 4 = 100, with 2 decimal places, so 1.00 = 1.</p>"
      },
      {
        "h": "Dividing decimals",
        "body": "<p>To divide a decimal by 10, 100 or 1000, move the decimal point to the left by as many places as there are zeros.</p><div class=\"nterm\">÷ 10: move 1 place left. ÷ 100: move 2 places left. ÷ 1000: move 3 places left.</div><p>Example: Find 7.8 ÷ 10 and 45 ÷ 1000. Solution: 7.8 ÷ 10 = 0.78 and 45 ÷ 1000 = 0.045.</p><p>To divide a decimal by a whole number, divide as usual and put the decimal point in the answer when you reach the decimal point in the number.</p><p>Example: Find 8.4 ÷ 4. Solution: 84 tenths ÷ 4 = 21 tenths, so the answer is 2.1.</p><div class=\"nterm\">Decimal ÷ decimal: multiply both numbers by 10, 100 or 1000 so that the divisor becomes a whole number. The answer does not change.</div><p>Example: Find 2.4 ÷ 0.06. Solution: Multiply both by 100 to get 240 ÷ 6 = 40.</p><p>Example: Find 1.8 ÷ 0.3. Solution: Multiply both by 10 to get 18 ÷ 3 = 6.</p>"
      },
      {
        "h": "Word problems with fractions and decimals",
        "body": "<p>Read the problem, decide whether to multiply or divide, then write the sum and check that your answer makes sense. Look for clue words: <b>of</b> means multiply, <b>each</b> or <b>per</b> often means multiply, and <b>shared equally</b> or <b>how many pieces</b> means divide.</p><div class=\"nterm\">Always write the units (₹, m, L, kg) in the final answer, and check by reversing the operation.</div><p>Example (money): One notebook costs ₹18.50. What do 4 notebooks cost? Solution: 18.50 × 4 = ₹74.</p><p>Example (length): A 3 m rope is cut into pieces of 3/4 m. How many pieces? Solution: 3 ÷ 3/4 = 3 × 4/3 = 4 pieces.</p><p>Example (capacity): 2 1/2 litres of juice is shared equally among 5 glasses. How much in each? Solution: 5/2 ÷ 5 = 5/2 × 1/5 = 1/2 litre.</p><p>Example (sharing): ₹75.60 is shared equally among 6 friends. Solution: 75.60 ÷ 6 = ₹12.60 each, and 6 × 12.60 = 75.60.</p>"
      }
    ],
    "recap": [
      "Mixed to improper: whole × denominator + numerator, over the denominator.",
      "'Of' means multiply, and fraction × fraction is numerator × numerator over denominator × denominator.",
      "To divide by a fraction, multiply by its reciprocal; 0 has no reciprocal.",
      "Multiplying by 10, 100, 1000 moves the decimal point right; dividing moves it left.",
      "For decimal × decimal, count the total decimal places; for decimal ÷ decimal, make the divisor a whole number first."
    ]
  },
  '7:data-handling': {
    "read": 9,
    "sections": [
      {
        "h": "The arithmetic mean",
        "body": "<p>The <b>arithmetic mean</b> is the most common kind of average. It tells us the value every observation would have if the total were shared out equally.</p><div class=\"nterm\">Mean = (sum of all observations) ÷ (number of observations)</div><p>Example: Find the mean of 4, 7, 9, 12 and 18.<br>Solution: Sum = 4 + 7 + 9 + 12 + 18 = 50. There are 5 observations, so mean = 50 ÷ 5 = 10.</p><p>The mean always lies between the smallest and the largest observation. It need not be one of the observations. For example, the mean of 1 and 2 is 1.5.</p>"
      },
      {
        "h": "Missing values and small grouped data",
        "body": "<p>If we know the mean and the number of observations, we can find the total. This helps us find a missing value.</p><div class=\"nterm\">Total = mean × number of observations</div><p>Example: The mean of 5 numbers is 13. Four of them are 10, 14, 9 and 15. Find the fifth.<br>Solution: Total = 13 × 5 = 65. The four add up to 48. Fifth number = 65 - 48 = 17.</p><p>When values repeat, we can group them. Example: Anita cycled 5 km on each of 3 days and 8 km on each of 2 days. Solution: Total = 3 × 5 + 2 × 8 = 31 km over 5 days, so mean = 31 ÷ 5 = 6.2 km.</p>"
      },
      {
        "h": "Range and mode",
        "body": "<p>The <b>range</b> tells us how spread out the data is.</p><div class=\"nterm\">Range = highest observation - lowest observation</div><p>Example: Marks are 12, 5, 19, 8, 14. Solution: Range = 19 - 5 = 14.</p><p>The <b>mode</b> is the observation that occurs most often.</p><div class=\"nterm\">Mode = the value with the highest frequency. A data set may have one mode, two modes (bimodal) or no mode.</div><p>Example: In 2, 4, 4, 6, 7, 7, 9 both 4 and 7 occur twice, so the modes are 4 and 7. In 1, 4, 6, 9, 11 every value occurs once, so there is no mode.</p>"
      },
      {
        "h": "The median",
        "body": "<p>The <b>median</b> is the middle value of data arranged in order. It splits the data into two equal halves.</p><div class=\"nterm\">Step 1: arrange the data in order. Step 2: odd number of values, take the middle one. Even number of values, take the mean of the two middle ones.</div><p>Example (odd): Find the median of 3, 9, 1, 5, 7.<br>Solution: In order: 1, 3, 5, 7, 9. The middle value is 5.</p><p>Example (even): Find the median of 12, 7, 9, 15, 10, 6.<br>Solution: In order: 6, 7, 9, 10, 12, 15. The middle two are 9 and 10, so median = (9 + 10) ÷ 2 = 9.5.</p><p>Always arrange the data first. Picking the middle of the unsorted list is a common mistake.</p>"
      },
      {
        "h": "Choosing the right average",
        "body": "<p>Mean, median and mode are all averages, but each suits a different job.</p><ul><li><b>Mean</b>: when values are fairly close together and every value matters, such as the average marks of a class.</li><li><b>Median</b>: when a few very large or very small values would pull the mean away from the typical value, such as salaries or house prices.</li><li><b>Mode</b>: when we want the most common choice, such as the most popular shirt size or ice cream flavour.</li></ul><div class=\"nterm\">Use the mean for fair sharing, the median when there are extreme values, and the mode for the most common item.</div><p>Example: Salaries are ₹18,000, ₹20,000, ₹22,000, ₹24,000 and ₹96,000. Solution: Mean = ₹36,000 but the median = ₹22,000. The median is the fairer picture of a typical salary.</p>"
      },
      {
        "h": "Bar graphs and double bar graphs",
        "body": "<p>A <b>bar graph</b> shows data using bars of equal width with equal gaps between them. The height (or length) of a bar shows the value. We read it with the help of a <b>scale</b>.</p><div class=\"nterm\">Height of bar × scale = value shown. If 1 cm = 5 students, a 7 cm bar shows 7 × 5 = 35 students.</div><p>A <b>double bar graph</b> draws two bars side by side for each category, in different colours, so we can compare two sets of data.</p><p>Example: Marks in Maths and Science are Jay: 65 and 75, Kiran: 90 and 85. Which student did better in Science than in Maths?<br>Solution: Compare the two bars for each student. Jay's Science bar (75) is taller than his Maths bar (65), so the answer is Jay.</p>"
      },
      {
        "h": "Chance and outcomes",
        "body": "<p>A <b>random experiment</b> is one whose result we cannot predict in advance, such as tossing a coin or throwing a die. Each possible result is an <b>outcome</b>.</p><ul><li>A coin has 2 outcomes: head and tail.</li><li>A die has 6 outcomes: 1, 2, 3, 4, 5 and 6.</li></ul><div class=\"nterm\">Outcomes are equally likely when each has the same chance of happening, like the faces of a fair coin or a fair die.</div><p>An <b>event</b> is a set of outcomes we are interested in, such as getting an even number on a die. The outcomes that make the event happen are called <b>favourable outcomes</b>.</p>"
      },
      {
        "h": "Finding probability",
        "body": "<div class=\"nterm\">Probability of an event = (number of favourable outcomes) ÷ (total number of outcomes)</div><p>Example: A die is thrown. Find the probability of getting an even number.<br>Solution: Even numbers are 2, 4, 6, so 3 favourable out of 6. Probability = 3/6 = 1/2.</p><p>Example: A bag has 6 red, 4 blue and 5 white marbles. Find the probability of a red marble.<br>Solution: Total = 15, red = 6, so probability = 6/15 = 2/5.</p><div class=\"nterm\">Probability always lies from 0 to 1. An impossible event has probability 0 and a certain event has probability 1.</div><p>Getting 8 on a die is impossible (probability 0). Getting a number less than 7 is certain (probability 1). Probability can never be a negative number or more than 1.</p>"
      }
    ],
    "recap": [
      "Mean = sum of observations ÷ number of observations, and total = mean × number of observations.",
      "Range = highest - lowest. Mode is the most frequent value and a set can have one, two or no modes.",
      "Median is the middle value after arranging in order. For an even count, take the mean of the two middle values.",
      "Use the mean for fair sharing, the median when there are extreme values, and the mode for the most common choice.",
      "Probability = favourable outcomes ÷ total outcomes, always between 0 (impossible) and 1 (certain)."
    ]
  },
  '7:simple-equations': {
    "read": 8,
    "sections": [
      {
        "h": "What is an equation?",
        "body": "<p>An <b>equation</b> is a statement that two expressions are equal. It always has an equals sign (=). The part on the left of the sign is the <b>LHS</b> and the part on the right is the <b>RHS</b>. The letter that stands for an unknown number is the <b>variable</b>.</p><p>In 2x + 3 = 11, the LHS is 2x + 3, the RHS is 11 and the variable is x. Note that 2x + 3 alone is only an <b>expression</b>, because it has no equals sign.</p><div class=\"nterm\">The value of the variable that makes LHS = RHS is called the <b>solution</b> or <b>root</b> of the equation.</div><p>Example: Is x = 4 a solution of 2x + 3 = 11? Solution: Put x = 4. LHS = 2 × 4 + 3 = 11 = RHS. Yes, x = 4 is the root.</p>"
      },
      {
        "h": "The balancing method",
        "body": "<p>Think of an equation as a weighing scale that is level. If you add a weight to one pan, the scale tips. To keep it level you must add the same weight to the other pan too. Equations work the same way.</p><div class=\"nterm\">Do the same thing to both sides of an equation and it stays balanced. You may add, subtract, multiply or divide both sides by the same number (not zero when dividing or multiplying).</div><p>Example: Solve x + 5 = 12. Solution: Subtract 5 from both sides. x + 5 - 5 = 12 - 5, so x = 7.</p><p>Example: Solve x - 9 = 4. Solution: Add 9 to both sides. x = 4 + 9 = 13.</p>"
      },
      {
        "h": "Solving by multiplying and dividing",
        "body": "<p>When the variable is multiplied by a number, divide both sides by that number. When the variable is divided by a number, multiply both sides by it. Each step undoes the operation done to the variable.</p><p>Example: Solve 3x = 21. Solution: Divide both sides by 3. x = 21 ÷ 3 = 7.</p><p>Example: Solve x/6 = 3. Solution: Multiply both sides by 6. x = 3 × 6 = 18.</p><div class=\"nterm\">To get the variable alone, use the opposite operation: the opposite of + is -, and the opposite of × is ÷.</div>"
      },
      {
        "h": "Transposing",
        "body": "<p>Moving a term from one side of the equation to the other is called <b>transposing</b>. It is a quick way of doing the balancing method. Each time a term crosses the equals sign, it does the opposite job.</p><div class=\"nterm\">Transposing: + becomes -, - becomes +, × becomes ÷ and ÷ becomes ×.</div><p>Example: Solve x + 7 = 15. Solution: Transpose +7 to the RHS as -7. x = 15 - 7 = 8.</p><p>Example: Solve 12 - x = 5. Solution: Transpose x to the RHS: 12 = 5 + x. Then transpose 5 to the LHS: 12 - 5 = x, so x = 7.</p>"
      },
      {
        "h": "Equations with two steps and brackets",
        "body": "<p>Some equations need two steps. First remove the number added or subtracted, then deal with the multiplier or divisor.</p><p>Example: Solve 2x + 3 = 11. Solution: Transpose 3: 2x = 11 - 3 = 8. Divide by 2: x = 4.</p><p>Example: Solve x/4 - 2 = 3. Solution: Transpose 2: x/4 = 5. Multiply by 4: x = 20.</p><p>When there is a bracket, you can either open it or first divide both sides by the number outside.</p><p>Example: Solve 3(x - 2) = 12. Solution: Divide both sides by 3: x - 2 = 4. So x = 6.</p><div class=\"nterm\">Work in order: first remove + or - terms, then remove the multiplier or divisor. With brackets, divide by the outside number or open the bracket first.</div>"
      },
      {
        "h": "Forming equations from statements",
        "body": "<p>To solve a puzzle, choose a letter for the unknown number, translate the words into an equation, then solve it.</p><ul><li>Twice a number is 2x. Five more than it is 2x + 5.</li><li>Perimeter of a rectangle is 2 × (length + breadth).</li><li>Three consecutive numbers are x, x + 1, x + 2.</li><li>If someone is x years old now, they will be x + 5 years old after 5 years.</li></ul><p>Example: Five more than twice a number is 17. Find the number. Solution: 2x + 5 = 17, so 2x = 12 and x = 6.</p><p>Example: Meera is 4 years older than Riya. Together they are 30 years old. Find their ages. Solution: Riya = x, Meera = x + 4. x + x + 4 = 30, so 2x = 26 and x = 13. Riya is 13 and Meera is 17.</p><div class=\"nterm\">Steps: (1) Choose a variable. (2) Write the equation from the statement. (3) Solve it. (4) Check in the original words.</div>"
      },
      {
        "h": "Checking and word problems",
        "body": "<p>Always check your answer by putting it back in the equation. If LHS = RHS, the solution is right. Checking also catches silly mistakes with signs.</p><p>Example: Is x = 5 the solution of 4x - 5 = 11? Solution: LHS = 4 × 5 - 5 = 15, which is not 11. So x = 5 is wrong. Try x = 4: LHS = 16 - 5 = 11. Yes.</p><p>Example: A taxi charges a fixed ₹30 plus ₹10 per km. Anil pays ₹130. How many km did he travel? Solution: 30 + 10k = 130, so 10k = 100 and k = 10 km. Check: 30 + 100 = 130.</p><p>Example: The length of a rectangle is 3 m more than its breadth. Its perimeter is 26 m. Find the breadth. Solution: 2(b + b + 3) = 26, so 2b + 3 = 13, 2b = 10 and b = 5 m. The length is 8 m.</p><div class=\"nterm\">A solution is correct only if it makes LHS = RHS. Always give the answer with its unit.</div>"
      }
    ],
    "recap": [
      "An equation has an equals sign; the value of the variable that makes LHS = RHS is its root.",
      "Balancing method: do the same operation on both sides.",
      "Transposing a term changes its sign: + becomes -, - becomes +, × becomes ÷, ÷ becomes ×.",
      "To form an equation, pick a variable, translate the words, solve, then check.",
      "Always check the answer by putting it back in the equation."
    ]
  },
  '7:lines-angles': {
    "read": 8,
    "sections": [
      {
        "h": "Complementary and supplementary angles",
        "body": "<p>An angle is measured in degrees (°). Two angles can be linked by their sum.</p><div class=\"nterm\"><b>Complementary angles</b> add up to 90°. <b>Supplementary angles</b> add up to 180°.</div><p>Each angle in a complementary pair is the <b>complement</b> of the other. In the same way, each angle in a supplementary pair is the <b>supplement</b> of the other.</p><ul><li>Complement of an angle a = 90° - a</li><li>Supplement of an angle a = 180° - a</li></ul><p>Only acute angles (less than 90°) have a complement. An angle of 90° pairs with another 90° to make a supplementary pair.</p><p><b>Example:</b> Find the complement and the supplement of 62°.<br><b>Solution:</b> Complement = 90° - 62° = 28°. Supplement = 180° - 62° = 118°.</p>"
      },
      {
        "h": "Adjacent angles and linear pair",
        "body": "<p>Two angles are <b>adjacent</b> when they share a common vertex and a common arm, and their other arms lie on opposite sides of the common arm. They do not overlap.</p><p>Adjacent angles can have any sum. If the two non-common arms form a straight line, the angles make a special pair.</p><div class=\"nterm\">A <b>linear pair</b> is a pair of adjacent angles whose non-common arms form a straight line. The angles of a linear pair always add up to 180°.</div><p>So every linear pair is supplementary. But a supplementary pair is a linear pair only when the two angles are also adjacent.</p><p><b>Example:</b> One angle of a linear pair is 112°. Find the other.<br><b>Solution:</b> Other angle = 180° - 112° = 68°.</p>"
      },
      {
        "h": "Vertically opposite angles",
        "body": "<p>When two lines cross at a point, they form four angles. The angles that face each other across the crossing point are called <b>vertically opposite angles</b>. They share only the vertex.</p><div class=\"nterm\">Vertically opposite angles are always equal.</div><p>Why? Each of the two opposite angles forms a linear pair with the same neighbouring angle, so each equals 180° minus that neighbour.</p><p>Two crossing lines give two pairs of vertically opposite angles and four linear pairs. The four angles around the point add up to 360°.</p><p><b>Example:</b> Two lines cross and one angle is 40°. Find the other three angles.<br><b>Solution:</b> The opposite angle is 40°. The other two angles are each 180° - 40° = 140°. Check: 40 + 40 + 140 + 140 = 360.</p>"
      },
      {
        "h": "Pairs of lines: intersecting and parallel",
        "body": "<p>Two lines drawn on the same flat surface can be placed in two ways.</p><ul><li><b>Intersecting lines</b> cross each other and have exactly one point in common. If they cross at 90°, they are <b>perpendicular</b>.</li><li><b>Parallel lines</b> never meet, however far they are extended. The distance between them stays the same everywhere.</li></ul><p>The edges of a ruler, the opposite sides of a window and railway tracks are everyday examples of parallel lines. Two roads meeting at a chowk are examples of intersecting lines.</p><div class=\"nterm\">Parallel lines have no common point. Intersecting lines have exactly one common point.</div>"
      },
      {
        "h": "Transversal and the angles it makes",
        "body": "<p>A line that cuts two or more lines at different points is called a <b>transversal</b>. When a transversal cuts two lines, it makes <b>eight angles</b>, four at each point of crossing.</p><p>Some pairs of these angles have special names.</p><ul><li><b>Corresponding angles</b> sit in the same position at the two crossings (for example, both on the upper left).</li><li><b>Alternate interior angles</b> lie between the two lines, on opposite sides of the transversal.</li><li><b>Interior angles on the same side</b> (co-interior angles) lie between the two lines, on the same side of the transversal.</li></ul><div class=\"nterm\">Two lines cut by a transversal make 4 pairs of corresponding angles, 2 pairs of alternate interior angles and 2 pairs of co-interior angles.</div>"
      },
      {
        "h": "Transversal across parallel lines",
        "body": "<p>Things become neat when the two lines are parallel. Then the angle pairs follow fixed rules.</p><div class=\"nterm\">If two lines are parallel and a transversal cuts them: corresponding angles are equal, alternate interior angles are equal, and interior angles on the same side add up to 180°.</div><p>Here is why the second rule holds: an alternate interior angle equals its vertically opposite angle, and that angle equals the corresponding angle.</p><p><b>Example:</b> Lines l and m are parallel and a transversal makes an interior angle of 75° at l, on the left of the transversal. Find the corresponding angle, the alternate interior angle and the co-interior angle at m.<br><b>Solution:</b> Corresponding angle = 75°. Alternate interior angle = 75°. The co-interior angle = 180° - 75° = 105°.</p><p>Out of the eight angles, four are equal to 75° and four are equal to 105°.</p>"
      },
      {
        "h": "Checking whether lines are parallel",
        "body": "<p>The rules also work backwards. If a transversal makes the right kind of angle pair, we can say the lines are parallel.</p><div class=\"nterm\">Two lines are parallel if a transversal makes (a) equal corresponding angles, or (b) equal alternate interior angles, or (c) co-interior angles that add up to 180°.</div><p><b>Example:</b> A transversal cuts two lines. The interior angles on the same side are 105° and 70°. Are the lines parallel?<br><b>Solution:</b> 105° + 70° = 175°, which is not 180°. So the lines are not parallel.</p><p><b>Example:</b> A pair of corresponding angles are both 62°. Are the lines parallel?<br><b>Solution:</b> The corresponding angles are equal, so the lines are parallel.</p>"
      },
      {
        "h": "Finding unknown angles with algebra",
        "body": "<p>When angles are written with x, form an equation from the rule that fits the picture, then solve for x. Always put the value of x back to find the angle.</p><ul><li>Linear pair: sum = 180°</li><li>Complementary: sum = 90°</li><li>Vertically opposite, corresponding or alternate interior (parallel lines): the angles are equal</li><li>Co-interior angles (parallel lines): sum = 180°</li></ul><p><b>Example:</b> Two angles x and 2x are supplementary. Find them.<br><b>Solution:</b> x + 2x = 180, so 3x = 180 and x = 60. The angles are 60° and 120°.</p><p><b>Example:</b> Two vertically opposite angles are (3x + 5)° and (5x - 25)°. Find x.<br><b>Solution:</b> 3x + 5 = 5x - 25, so 30 = 2x and x = 15. Each angle is 3 × 15 + 5 = 50°.</p><div class=\"nterm\">Choose the rule first (sum or equal), write the equation, solve, then check.</div>"
      }
    ],
    "recap": [
      "Complementary angles add up to 90° and supplementary angles add up to 180°.",
      "A linear pair is two adjacent angles on a straight line, so it adds up to 180°. Vertically opposite angles are equal.",
      "A transversal cutting two lines makes eight angles: corresponding, alternate interior and co-interior pairs.",
      "For parallel lines, corresponding and alternate interior angles are equal, and co-interior angles add up to 180°.",
      "To find unknown angles, pick the right rule, form an equation in x, solve it and check your answer."
    ]
  },
  '7:triangle-properties': {
    "read": 9,
    "sections": [
      {
        "h": "Types of triangles",
        "body": "<p>A triangle has three sides, three angles and three vertices. We can sort triangles in two ways: by looking at their <b>sides</b> or by looking at their <b>angles</b>.</p><p><b>By sides:</b></p><ul><li><b>Scalene</b>: all three sides are different.</li><li><b>Isosceles</b>: two sides are equal. The angles opposite the equal sides are also equal.</li><li><b>Equilateral</b>: all three sides are equal, and each angle is 60°.</li></ul><p><b>By angles:</b></p><ul><li><b>Acute-angled</b>: all three angles are less than 90°.</li><li><b>Right-angled</b>: one angle is exactly 90°.</li><li><b>Obtuse-angled</b>: one angle is more than 90°.</li></ul><div class=\"nterm\">A triangle can be named both ways, for example an isosceles right-angled triangle. It can have only one right angle or only one obtuse angle.</div><p>Example: A triangle has angles 35°, 35° and 110°. What type is it?</p><p>Solution: Two angles are equal, so two sides are equal: it is isosceles. One angle (110°) is more than 90°, so it is obtuse-angled. It is an isosceles obtuse-angled triangle.</p>"
      },
      {
        "h": "Median of a triangle",
        "body": "<p>Take any triangle ABC. Find the midpoint D of side BC and join A to D. The segment AD is a <b>median</b>.</p><div class=\"nterm\">A median joins a vertex to the midpoint of the opposite side. Every triangle has 3 medians, one from each vertex.</div><p>A median always lies <b>inside</b> the triangle, whether the triangle is acute, right-angled or obtuse. It cuts the opposite side into two equal parts.</p><p>Example: In triangle ABC, D is the midpoint of BC and BC = 14 cm. Find BD.</p><p>Solution: AD is a median, so D cuts BC into two equal parts. BD = 14 ÷ 2 = 7 cm.</p>"
      },
      {
        "h": "Altitude of a triangle",
        "body": "<p>An <b>altitude</b> is the height of the triangle. From a vertex we draw a line perpendicular to the opposite side (or to that side extended). The point where it meets the side is called the foot.</p><div class=\"nterm\">An altitude is the perpendicular segment from a vertex to the opposite side (or to that side extended). Every triangle has 3 altitudes, one from each vertex.</div><p>Where the altitudes lie depends on the triangle:</p><ul><li><b>Acute-angled triangle:</b> all three altitudes lie inside.</li><li><b>Right-angled triangle:</b> two altitudes are the sides that form the right angle. The third is inside.</li><li><b>Obtuse-angled triangle:</b> the altitude from the obtuse vertex is inside, but the other two lie outside the triangle.</li></ul><p>In an equilateral triangle, the median from a vertex is also the altitude from that vertex.</p><p>Example: In triangle ABC, angle C = 90°. Which sides are the altitudes from A and from B?</p><p>Solution: AC is perpendicular to BC, so the altitude from A to BC is AC itself. In the same way the altitude from B to AC is BC.</p>"
      },
      {
        "h": "Angle sum property",
        "body": "<p>If you tear off the three corners of a paper triangle and place them side by side, they form a straight line. This shows the rule below.</p><div class=\"nterm\">The sum of the three angles of a triangle is 180°.</div><p>This helps us find a missing angle. In a right-angled triangle the two acute angles add up to 90°. In an equilateral triangle each angle is 180° ÷ 3 = 60°.</p><p>Example: The angles of a triangle are x, x + 30° and x + 60°. Find them.</p><p>Solution: x + (x + 30) + (x + 60) = 180, so 3x + 90 = 180, 3x = 90 and x = 30. The angles are 30°, 60° and 90°.</p><p>Example: The angle between the two equal sides of an isosceles triangle is 40°. Find the other two angles.</p><p>Solution: They are equal and add up to 180° - 40° = 140°. Each is 140° ÷ 2 = 70°.</p>"
      },
      {
        "h": "Exterior angle and its property",
        "body": "<p>Extend one side of a triangle beyond a vertex. The angle formed outside the triangle is an <b>exterior angle</b>. The two interior angles that are not next to it are called the <b>interior opposite angles</b>.</p><div class=\"nterm\">Exterior angle of a triangle = sum of its two interior opposite angles.</div><p>Why? The exterior angle and the adjacent interior angle lie on a straight line, so they add up to 180°. The three interior angles also add up to 180°. So the exterior angle must equal the other two interior angles together.</p><p>Example: In triangle ABC, angle A = 45° and angle B = 70°. Side BC is extended to D. Find the exterior angle ACD.</p><p>Solution: Angle ACD = 45° + 70° = 115°.</p><p>Example: An exterior angle of a triangle is 125° and one interior opposite angle is 50°. Find the other interior opposite angle.</p><p>Solution: The other angle = 125° - 50° = 75°.</p>"
      },
      {
        "h": "Two sides of a triangle",
        "body": "<p>Try to make a triangle from sticks of 3 cm, 4 cm and 8 cm. The two short sticks cannot reach across the long one, so no triangle forms. This gives the rule below.</p><div class=\"nterm\">The sum of any two sides of a triangle is greater than the third side. The difference of any two sides is smaller than the third side.</div><p>So if two sides are a and b, the third side x lies between (the difference) and (the sum): the larger of a, b minus the smaller is less than x, and x is less than a + b.</p><p>To check three lengths, add the two shorter ones and compare with the longest.</p><p>Example: Can 5 cm, 8 cm and 12 cm be the sides of a triangle?</p><p>Solution: The two shorter sides add up to 5 + 8 = 13, which is more than 12. Yes, a triangle is possible.</p><p>Example: Two sides of a triangle are 9 cm and 14 cm. Between what lengths must the third side lie?</p><p>Solution: Difference = 14 - 9 = 5 cm and sum = 14 + 9 = 23 cm. The third side is more than 5 cm and less than 23 cm.</p>"
      },
      {
        "h": "Right-angled triangles and Pythagoras theorem",
        "body": "<p>In a right-angled triangle, the side opposite the right angle is the <b>hypotenuse</b>. It is the longest side. The other two sides are the <b>legs</b> (called the base and the perpendicular).</p><div class=\"nterm\">Pythagoras theorem: (hypotenuse)² = (base)² + (perpendicular)². If the legs are a and b and the hypotenuse is c, then a² + b² = c².</div><p>Three whole numbers a, b, c with a² + b² = c² form a <b>Pythagorean triplet</b>. Some famous ones are 3, 4, 5 and 5, 12, 13 and 8, 15, 17. Multiples of a triplet also work, like 6, 8, 10. For any number m greater than 1, the numbers 2m, m² - 1 and m² + 1 form a triplet. For m = 4 we get 8, 15, 17.</p><div class=\"nterm\">Converse: if the squares of two sides add up to the square of the third side, the triangle is right-angled, and the right angle is opposite the third side.</div><p>Example: Is a triangle with sides 7 cm, 24 cm and 25 cm right-angled?</p><p>Solution: 7² + 24² = 49 + 576 = 625 and 25² = 625. They are equal, so yes. The right angle is opposite the 25 cm side.</p><p>Example: Is a triangle with sides 6 cm, 7 cm and 10 cm right-angled?</p><p>Solution: 6² + 7² = 36 + 49 = 85, but 10² = 100. They are not equal, so it is not right-angled.</p>"
      },
      {
        "h": "Using Pythagoras theorem",
        "body": "<p>To find a missing side, first decide whether it is the hypotenuse. Draw a small sketch and mark the right angle.</p><ul><li>Missing hypotenuse: add the squares of the legs, then take the square root.</li><li>Missing leg: subtract the square of the known leg from the square of the hypotenuse, then take the square root.</li></ul><p>Example: The hypotenuse of a right-angled triangle is 17 cm and one leg is 15 cm. Find the other leg.</p><p>Solution: Leg² = 17² - 15² = 289 - 225 = 64. So the leg = 8 cm.</p><p>Example: A wire 20 m long stretches from the top of a pole to a point on the ground 16 m from the foot of the pole. How tall is the pole?</p><p>Solution: The pole, the ground and the wire form a right-angled triangle with the wire as hypotenuse. Height² = 20² - 16² = 400 - 256 = 144, so the pole is 12 m tall.</p><p>The same idea solves ladder-and-wall problems, the diagonal of a rectangle, and the shortest distance between two places when you walk along two perpendicular paths.</p><div class=\"nterm\">Common mistakes: the hypotenuse is always opposite the right angle. Do not forget the square root at the end. When finding a leg, subtract, do not add.</div>"
      }
    ],
    "recap": [
      "Triangles are named by sides (scalene, isosceles, equilateral) and by angles (acute, right, obtuse).",
      "A median joins a vertex to the midpoint of the opposite side, and an altitude is the perpendicular from a vertex. Each triangle has 3 of each.",
      "The three angles of a triangle add up to 180°, and an exterior angle equals the sum of the two interior opposite angles.",
      "Any two sides of a triangle add up to more than the third side, and their difference is less than the third side.",
      "In a right-angled triangle, (hypotenuse)² = (base)² + (perpendicular)², and the hypotenuse is opposite the right angle."
    ]
  },
  '7:congruence': {
    "read": 8,
    "sections": [
      {
        "h": "Congruent figures",
        "body": "<p>Two figures are <b>congruent</b> if they have exactly the same shape and the same size. If you place one on top of the other, they fit exactly. You may turn, slide or flip a figure and it is still congruent to the original.</p><ul><li>Two <b>line segments</b> are congruent if they have the same length.</li><li>Two <b>angles</b> are congruent if they have the same measure. The length of the arms does not matter.</li><li>Two <b>squares</b> are congruent if their sides are equal.</li><li>Two <b>circles</b> are congruent if their radii are equal.</li></ul><div class=\"nterm\">Congruent figures have the same shape and the same size. The symbol for congruent is ≅.</div><p>A photograph and its big poster have the same shape, but not the same size, so they are not congruent.</p><p>Example: Segment AB is 7 cm and segment CD is 7 cm. Is AB ≅ CD?<br>Solution: Both have length 7 cm, so AB ≅ CD.</p><p>Example: Circle 1 has diameter 10 cm and circle 2 has radius 5 cm. Are they congruent?<br>Solution: Circle 1 has radius 10 ÷ 2 = 5 cm, the same as circle 2, so they are congruent.</p>"
      },
      {
        "h": "Congruent triangles and notation",
        "body": "<p>Two triangles are congruent if all three sides and all three angles of one triangle match the other triangle. We write <b>△ABC ≅ △PQR</b>. The order of the letters is important because it tells us which vertices match.</p><p>In △ABC ≅ △PQR, vertex A matches P, B matches Q and C matches R. So the <b>corresponding parts</b> are:</p><ul><li>AB = PQ, BC = QR, CA = RP</li><li>∠A = ∠P, ∠B = ∠Q, ∠C = ∠R</li></ul><div class=\"nterm\">CPCT: Corresponding Parts of Congruent Triangles are equal. Once two triangles are shown congruent, all six matching parts are equal.</div><p>Example: △ABC ≅ △DEF, AB = 6 cm and ∠B = 45°. Find DE and ∠E.<br>Solution: A matches D and B matches E, so DE = AB = 6 cm and ∠E = ∠B = 45°.</p><p>Example: If △ABC ≅ △QRP, which side equals AB?<br>Solution: A matches Q and B matches R, so AB = QR.</p>"
      },
      {
        "h": "SSS criterion",
        "body": "<p>You do not need to check all six parts. Some small sets of equal parts are enough. The first is <b>SSS</b>, which stands for Side, Side, Side.</p><div class=\"nterm\">SSS: If three sides of one triangle are equal to the three sides of another triangle, the triangles are congruent.</div><p>Example: In △ABC, AB = 5 cm, BC = 7 cm and CA = 6 cm. In △PQR, PQ = 5 cm, QR = 7 cm and RP = 6 cm. Are they congruent?<br>Solution: AB = PQ, BC = QR and CA = RP. By SSS, △ABC ≅ △PQR.</p><p>Be careful with the order. If the sides are 3 cm, 4 cm, 5 cm in △ABC and 4 cm, 5 cm, 3 cm in △PQR, you must match 3 cm with 3 cm, so the correct statement is △ABC ≅ △RPQ.</p>"
      },
      {
        "h": "SAS criterion",
        "body": "<p>The second criterion is <b>SAS</b>, which stands for Side, Angle, Side. The angle must be the <b>included angle</b>, that is, the angle between the two equal sides.</p><div class=\"nterm\">SAS: If two sides and the angle between them in one triangle are equal to two sides and the angle between them in another triangle, the triangles are congruent.</div><p>Example: In △ABC, AB = 4 cm, ∠B = 50° and BC = 5 cm. In △PQR, PQ = 4 cm, ∠Q = 50° and QR = 5 cm. What can you say about AC and PR?<br>Solution: The angle B lies between AB and BC, and the angle Q lies between PQ and QR. So △ABC ≅ △PQR by SAS. By CPCT, AC = PR.</p>"
      },
      {
        "h": "ASA criterion",
        "body": "<p>The third criterion is <b>ASA</b>, which stands for Angle, Side, Angle. The side must be the one between the two equal angles.</p><div class=\"nterm\">ASA: If two angles and the side between them in one triangle are equal to two angles and the side between them in another triangle, the triangles are congruent.</div><p>Example: In △ABC, ∠A = 40°, ∠B = 70° and AB = 6 cm. In △PQR, ∠P = 40°, ∠Q = 70° and PQ = 6 cm. Are they congruent? Find ∠R.<br>Solution: AB lies between A and B, and PQ lies between P and Q. So △ABC ≅ △PQR by ASA. Then ∠R = ∠C = 180° - 40° - 70° = 70°.</p><p>Remember that when two angles of a triangle are known, the third angle is found from the angle sum 180°.</p>"
      },
      {
        "h": "RHS criterion",
        "body": "<p>The fourth criterion is only for <b>right-angled triangles</b>. In a right-angled triangle, the side opposite the right angle is the <b>hypotenuse</b>, and it is the longest side. <b>RHS</b> stands for Right angle, Hypotenuse, Side.</p><div class=\"nterm\">RHS: If the hypotenuse and one side of a right-angled triangle are equal to the hypotenuse and one side of another right-angled triangle, the triangles are congruent.</div><p>Example: In △ABC, ∠B = 90°, AC = 10 cm and AB = 6 cm. In △PQR, ∠Q = 90°, PR = 10 cm and PQ = 6 cm. Are they congruent? What is BC if QR = 8 cm?<br>Solution: Both have a right angle, equal hypotenuses and one equal side, so △ABC ≅ △PQR by RHS. By CPCT, BC = QR = 8 cm.</p><p>A ladder leaning on a vertical wall makes a right-angled triangle with the wall and the ground. Two ladders of the same length that reach the same height give congruent triangles by RHS.</p>"
      },
      {
        "h": "What does not work, and how to decide",
        "body": "<p>Two sets of equal parts look helpful but do <b>not</b> prove congruence.</p><ul><li><b>AAA</b>: Three equal angles fix the shape, not the size. A small and a big triangle can have angles 60°, 60°, 60°.</li><li><b>SSA</b>: Two sides and an angle that is not between them. The third side can be placed in two ways, so two different triangles are possible.</li></ul><div class=\"nterm\">Valid criteria: SSS, SAS, ASA and RHS. AAA and SSA are not criteria for congruence.</div><p>To decide whether two triangles are congruent, follow these steps.</p><ol><li>Write down the equal parts that are given.</li><li>Match them with the correct vertices.</li><li>Check whether they form SSS, SAS, ASA or RHS. For SAS and ASA, check that the angle or side is in the correct position.</li></ol><p>Example: In △ABC, AB = 5 cm, BC = 6 cm and ∠A = 50°. In △PQR, PQ = 5 cm, QR = 6 cm and ∠P = 50°. Are they congruent?<br>Solution: The angle A is not between AB and BC, so this is SSA. We cannot say they are congruent.</p>"
      },
      {
        "h": "Isosceles, equilateral and real life",
        "body": "<p>Congruence helps us prove facts about special triangles. Take an isosceles triangle ABC with AB = AC, and let D be the mid-point of BC. Then AB = AC, BD = DC and AD is common to both halves. By SSS, △ABD ≅ △ACD. By CPCT, ∠B = ∠C and ∠ADB = ∠ADC.</p><div class=\"nterm\">In an isosceles triangle, the angles opposite the equal sides are equal. In an equilateral triangle, all three angles are equal, and each is 60°.</div><p>Example: In isosceles △ABC with AB = AC, ∠B = 50°. Find ∠A.<br>Solution: ∠C = ∠B = 50°, so ∠A = 180° - 50° - 50° = 80°.</p><p>Example: In the same triangle ABC (AB = AC, D the mid-point of BC), find ∠ADB.<br>Solution: ∠ADB = ∠ADC and the two angles on a straight line add up to 180°, so ∠ADB = 90°.</p><p><b>Real life:</b> Stamps printed from one sheet, photographs printed in the same size, floor tiles from the same mould and coins of the same type are all congruent. A photograph and its enlarged poster are not congruent because the size changes.</p>"
      }
    ],
    "recap": [
      "Congruent figures have the same shape and the same size, and are written with ≅.",
      "In △ABC ≅ △PQR the letters show matching vertices, and by CPCT all matching sides and angles are equal.",
      "The valid criteria are SSS, SAS (included angle), ASA (included side) and RHS (right-angled triangles only).",
      "AAA and SSA do not prove congruence, because they can give triangles of different size or shape.",
      "In an isosceles triangle the angles opposite equal sides are equal, and each angle of an equilateral triangle is 60°."
    ]
  },
  '7:comparing-quantities': {
    "read": 10,
    "sections": [
      {
        "h": "Ratio: comparing by division",
        "body": "<p>A <b>ratio</b> compares two quantities of the same kind by division. If Priya has 12 pencils and Ravi has 8, the ratio of Priya's pencils to Ravi's is 12:8. We read it as 12 to 8.</p><div class=\"nterm\">A ratio a:b compares two quantities of the same kind. Order matters: 12:8 is not the same as 8:12.</div><p>A ratio is in its <b>simplest form</b> when the two terms have no common factor except 1. To get there, divide both terms by their HCF.</p><p>Example: Write 24:36 in simplest form.<br>Solution: The HCF of 24 and 36 is 12. 24 ÷ 12 = 2 and 36 ÷ 12 = 3, so 24:36 = 2:3.</p><p>Ratios that have the same simplest form are called <b>equivalent ratios</b>. We get them by multiplying or dividing both terms by the same non-zero number, so 2:3 = 4:6 = 6:9.</p><div class=\"nterm\">Multiplying or dividing both terms of a ratio by the same non-zero number gives an equivalent ratio.</div>"
      },
      {
        "h": "Same units and sharing in a ratio",
        "body": "<p>To compare two quantities, both must be in the <b>same unit</b>. Change the bigger unit into the smaller one first.</p><p>Example: Find the ratio of 50 cm to 2 m.<br>Solution: 2 m = 200 cm. So the ratio is 50:200 = 1:4.</p><div class=\"nterm\">Always convert both quantities to the same unit before writing a ratio. A ratio has no unit.</div><p>Ratios are also used to <b>share</b> an amount. Add the parts of the ratio to get the total number of parts, find the value of one part, then multiply.</p><p>Example: Share ₹ 600 between Anil and Bela in the ratio 2:3.<br>Solution: Total parts = 2 + 3 = 5. One part = 600 ÷ 5 = ₹ 120. Anil gets 2 × 120 = ₹ 240 and Bela gets 3 × 120 = ₹ 360. Check: 240 + 360 = 600.</p>"
      },
      {
        "h": "Proportion",
        "body": "<p>When two ratios are equal, we say the four numbers are in <b>proportion</b>. We write 3:4 :: 9:12, which means 3:4 = 9:12. The first and last terms (3 and 12) are the <b>extremes</b>. The middle terms (4 and 9) are the <b>means</b>.</p><div class=\"nterm\">Four numbers a, b, c, d are in proportion if a:b = c:d. Then a × d = b × c, that is, product of extremes = product of means.</div><p>Check: 3 × 12 = 36 and 4 × 9 = 36, so they are in proportion.</p><p>Example: If 5 kg of apples cost ₹ 400, what do 8 kg cost?<br>Solution: 5:400 = 8:x gives 5 × x = 400 × 8, so x = 3200 ÷ 5 = ₹ 640.</p><p>Another way is the <b>unitary method</b>: 1 kg costs 400 ÷ 5 = ₹ 80, so 8 kg cost 8 × 80 = ₹ 640.</p>"
      },
      {
        "h": "Percentages: meaning and conversions",
        "body": "<p><b>Percent</b> means per hundred. The symbol is %. So 35% means 35 out of every 100, or 35/100.</p><div class=\"nterm\">x% = x/100. To change a fraction to a percent, multiply by 100. To change a percent to a fraction, divide by 100 and simplify.</div><p>Example: Write 7/20 as a percent.<br>Solution: 7/20 × 100 = 35, so 7/20 = 35%.</p><p>Example: Write 62% as a fraction.<br>Solution: 62/100 = 31/50.</p><p>To change a <b>decimal</b> to a percent, multiply by 100, that is, move the decimal point two places right. So 0.08 = 8%. To go back, divide by 100: 45% = 0.45.</p><div class=\"nterm\">Decimal to percent: multiply by 100. Percent to decimal: divide by 100.</div>"
      },
      {
        "h": "Percent of a quantity and finding the whole",
        "body": "<p>To find a percent of a quantity, change the percent into a fraction and multiply.</p><p>Example: Find 35% of 240.<br>Solution: 35/100 × 240 = 84.</p><div class=\"nterm\">x% of a quantity = (x/100) × the quantity.</div><p>Sometimes the part is known and we need the <b>whole</b>.</p><p>Example: 18 students are absent, and this is 30% of the class. How many students are in the class?<br>Solution: 30% of the class = 18, so the class = 18 × 100 ÷ 30 = 60 students.</p><div class=\"nterm\">If x% of a number is a, then the number = a × 100 ÷ x.</div><p>Percent is also used to compare a part with its whole. If Arjun gets 36 out of 45 marks, his percentage is 36/45 × 100 = 80%.</p>"
      },
      {
        "h": "Percentage increase and decrease",
        "body": "<p>A change in a quantity is often given as a percent of the <b>original</b> value.</p><p>Example: A price of ₹ 500 increases by 12%. Find the new price.<br>Solution: Increase = 12% of 500 = ₹ 60. New price = 500 + 60 = ₹ 560.</p><p>Example: A price of ₹ 800 decreases by 25%. Find the new price.<br>Solution: Decrease = 25% of 800 = ₹ 200. New price = 800 - 200 = ₹ 600.</p><div class=\"nterm\">Percent change = (change ÷ original value) × 100. New value = original + increase, or original - decrease.</div><p>Example: A price falls from ₹ 80 to ₹ 60. Find the percent decrease.<br>Solution: Change = 20, and 20/80 × 100 = 25%.</p><p>Be careful: a 20% rise followed by a 20% fall does not bring you back. 100 becomes 120, and 20% of 120 is 24, so you end at 96.</p>"
      },
      {
        "h": "Profit and loss",
        "body": "<p>The price at which a shopkeeper buys an article is the <b>cost price (CP)</b>. The price at which it is sold is the <b>selling price (SP)</b>. If SP is more than CP there is a <b>profit</b>. If SP is less than CP there is a <b>loss</b>.</p><div class=\"nterm\">Profit = SP - CP. Loss = CP - SP. Profit% = (Profit ÷ CP) × 100. Loss% = (Loss ÷ CP) × 100.</div><p>Profit and loss percents are always found on the <b>cost price</b>.</p><p>Example: CP = ₹ 600 and SP = ₹ 750. Find the profit percent.<br>Solution: Profit = 750 - 600 = 150. Profit% = 150/600 × 100 = 25%.</p><p>Example: CP = ₹ 500 and SP = ₹ 450. Find the loss percent.<br>Solution: Loss = 500 - 450 = 50. Loss% = 50/500 × 100 = 10%.</p><p>Example: Find SP if CP = ₹ 400 and profit is 20%.<br>Solution: Profit = 20% of 400 = 80, so SP = 400 + 80 = ₹ 480.</p><p>Example: An article is sold for ₹ 540 at a profit of 8%. Find CP.<br>Solution: SP is 108% of CP, so CP = 540 × 100 ÷ 108 = ₹ 500.</p><div class=\"nterm\">Gain: SP = CP × (100 + Profit%) ÷ 100. Loss: SP = CP × (100 - Loss%) ÷ 100.</div>"
      },
      {
        "h": "Simple interest and discount",
        "body": "<p>When you deposit or borrow money, the money is the <b>principal (P)</b>. The extra money paid for using it is the <b>interest (I)</b>. The <b>rate (R)</b> is the interest on every ₹ 100 for one year, written as % per year. <b>Time (T)</b> is in years. The total of principal and interest is the <b>amount (A)</b>.</p><div class=\"nterm\">Simple interest I = P × R × T ÷ 100. Amount A = P + I.</div><p>In simple interest, the interest is found on the original principal every year, so it is the same each year.</p><p>Example: Find I and A for P = ₹ 2,000, R = 5% per year, T = 3 years.<br>Solution: I = 2000 × 5 × 3 ÷ 100 = ₹ 300. A = 2000 + 300 = ₹ 2,300.</p><p>Example: P = ₹ 1,500, I = ₹ 180, T = 2 years. Find R.<br>Solution: R = I × 100 ÷ (P × T) = 180 × 100 ÷ (1500 × 2) = 6% per year.</p><p>Example: Find the interest on ₹ 1,200 at 10% per year for 6 months.<br>Solution: 6 months = 1/2 year, so I = 1200 × 10 × (1/2) ÷ 100 = ₹ 60.</p><p><b>Discount</b> is a reduction on the <b>marked price (MP)</b> of an article.</p><div class=\"nterm\">Discount = MP - SP. Discount% = (Discount ÷ MP) × 100. SP = MP - Discount.</div><p>Example: MP = ₹ 1,500 with a 20% discount. Find SP.<br>Solution: Discount = 20% of 1500 = 300, so SP = 1500 - 300 = ₹ 1,200.</p>"
      }
    ],
    "recap": [
      "A ratio compares two quantities of the same unit; divide both terms by their HCF to get the simplest form.",
      "To share an amount in a ratio, add the parts, find one part, then multiply.",
      "Percent means per hundred: x% = x/100, and x% of a quantity = (x/100) × the quantity.",
      "Profit = SP - CP, Loss = CP - SP, and profit or loss percent is found on the cost price.",
      "Simple interest I = P × R × T ÷ 100 and Amount = P + I; discount = marked price - selling price."
    ]
  },
  '7:rational-numbers': {
    "read": 9,
    "sections": [
      {
        "h": "What is a rational number?",
        "body": "<p>A <b>rational number</b> is a number that can be written in the form p/q, where p and q are integers and q is not 0. The top number p is the <b>numerator</b> and the bottom number q is the <b>denominator</b>.</p><div class=\"nterm\">Rational number = p/q, where p and q are integers and q is not 0.</div><p>Every integer is a rational number, because we can write it with denominator 1. For example, 5 = 5/1, -3 = -3/1 and 0 = 0/1. Fractions like 3/4 are rational too, and so are numbers like -7/2.</p><p>Why can q never be 0? Because division by 0 has no meaning. So 5/0 is not a rational number.</p><p>Example: Name the numerator and denominator of -5/8. Solution: The numerator is -5 and the denominator is 8.</p>"
      },
      {
        "h": "Positive and negative rational numbers",
        "body": "<p>A rational number is <b>positive</b> if its numerator and denominator have the same sign, and <b>negative</b> if they have opposite signs. The number 0 is neither positive nor negative.</p><div class=\"nterm\">Same signs: positive. Opposite signs: negative. 0 is neither.</div><p>Example: Which of 3/(-5), (-3)/(-5) and 0/5 is negative? Solution: 3/(-5) has opposite signs, so it is negative. (-3)/(-5) has the same signs, so it equals 3/5 and is positive. 0/5 equals 0, which is neither.</p><p>Note that 3/(-5), (-3)/5 and -3/5 are all the same number.</p>"
      },
      {
        "h": "Equivalent rational numbers",
        "body": "<p>If we multiply or divide the numerator and denominator of a rational number by the same non-zero integer, its value does not change. The new number is called an <b>equivalent</b> rational number.</p><div class=\"nterm\">p/q = (p × m)/(q × m) = (p ÷ m)/(q ÷ m), for any non-zero integer m (which divides p and q, in the case of division).</div><p>Example: Write three rational numbers equivalent to 2/3. Solution: Multiply top and bottom by 2, 3 and 4: 4/6, 6/9 and 8/12.</p><p>Example: Fill in the blank: 3/5 = __/35. Solution: 35 ÷ 5 = 7, so multiply the top by 7 too: 3 × 7 = 21. The answer is 21.</p>"
      },
      {
        "h": "Standard form",
        "body": "<p>A rational number is in <b>standard form</b> (also called lowest terms) when its denominator is positive and the numerator and denominator have no common factor other than 1.</p><div class=\"nterm\">To get the standard form: make the denominator positive, then divide the top and bottom by their HCF.</div><p>Example: Write 15/(-25) in standard form. Solution: The denominator is negative, so divide top and bottom by -5 (the HCF 5 with a negative sign). 15 ÷ (-5) = -3 and (-25) ÷ (-5) = 5. The standard form is -3/5.</p><p>Example: Write 12/18 in standard form. Solution: The HCF of 12 and 18 is 6. 12 ÷ 6 = 2 and 18 ÷ 6 = 3. The standard form is 2/3.</p>"
      },
      {
        "h": "Rational numbers on the number line",
        "body": "<p>On a number line, positive rational numbers lie to the right of 0 and negative rational numbers lie to the left of 0. To show a rational number with denominator n, divide each unit length into n equal parts.</p><div class=\"nterm\">Positive rational numbers lie to the right of 0. Negative rational numbers lie to the left of 0.</div><p>Example: Show -3/4 on a number line. Solution: Divide the unit between 0 and -1 into 4 equal parts. Start at 0 and move 3 parts to the left. That point is -3/4.</p><p>Example: Between which two integers does -3/2 lie? Solution: -3/2 = -1.5, which is between -2 and -1.</p>"
      },
      {
        "h": "Comparing rational numbers and finding numbers in between",
        "body": "<p>On the number line, the number on the right is greater. Every positive rational number is greater than 0 and every negative rational number is less than 0. To compare two rational numbers, first write them in standard form, then give them the same denominator (use the LCM) and compare the numerators.</p><div class=\"nterm\">With the same positive denominator, the number with the greater numerator is greater.</div><p>Example: Compare -2/3 and -1/2. Solution: LCM of 3 and 2 is 6. -2/3 = -4/6 and -1/2 = -3/6. Since -4 < -3, we get -2/3 < -1/2.</p><p>Between any two different rational numbers there are <b>infinitely many</b> rational numbers. One way to find one is to take the mean (add them and divide by 2).</p><div class=\"nterm\">A rational number between a and b is (a + b) ÷ 2.</div><p>Example: Find a rational number between 1/4 and 1/2. Solution: Write them as 2/8 and 4/8. The number 3/8 lies between them.</p>"
      },
      {
        "h": "Adding and subtracting rational numbers",
        "body": "<p>To add rational numbers with the same denominator, add the numerators and keep the denominator. If the denominators are different, first write the numbers with a common denominator (use the LCM).</p><div class=\"nterm\">The <b>additive inverse</b> of a is -a, because a + (-a) = 0. To subtract, add the additive inverse: a - b = a + (-b).</div><p>Example: Find -3/4 + 1/2. Solution: 1/2 = 2/4, so -3/4 + 2/4 = -1/4.</p><p>Example: Find 2/3 - (-1/6). Solution: Subtracting -1/6 means adding 1/6. 2/3 = 4/6, so 4/6 + 1/6 = 5/6.</p><p>The additive inverse of -7/9 is 7/9, and the additive inverse of 0 is 0.</p>"
      },
      {
        "h": "Multiplying and dividing, and word problems",
        "body": "<p>To multiply rational numbers, multiply the numerators together and the denominators together. If the signs are the same the answer is positive, and if the signs are different the answer is negative.</p><div class=\"nterm\">(a/b) × (c/d) = (a × c)/(b × d)</div><p>The <b>reciprocal</b> (multiplicative inverse) of a/b is b/a, because (a/b) × (b/a) = 1. The number 0 has no reciprocal, because no number multiplied by 0 gives 1. The reciprocal of 1 is 1 and the reciprocal of -1 is -1.</p><div class=\"nterm\">To divide, multiply by the reciprocal: (a/b) ÷ (c/d) = (a/b) × (d/c), where c/d is not 0.</div><p>Example: Find (-4/5) × (15/16). Solution: (-4 × 15)/(5 × 16) = -60/80 = -3/4.</p><p>Example: Find (3/4) ÷ (3/8). Solution: 3/4 × 8/3 = 24/12 = 2.</p><p>Example: A rope 9/2 m long is cut into pieces of 3/4 m each. How many pieces are made? Solution: 9/2 ÷ 3/4 = 9/2 × 4/3 = 36/6 = 6 pieces.</p><p>Example: Kiran had Rs 120. She spent 1/3 on books and then 1/4 of the rest on snacks. How much is left? Solution: Books cost 1/3 of 120 = 40, so 80 is left. Snacks cost 1/4 of 80 = 20. Money left = 80 - 20 = Rs 60.</p>"
      }
    ],
    "recap": [
      "A rational number is p/q with p and q integers and q not 0; every integer is rational.",
      "Equivalent rational numbers come from multiplying or dividing top and bottom by the same non-zero integer; standard form has a positive denominator and lowest terms.",
      "Negative rational numbers lie left of 0 on the number line, and the greater number is always on the right; between two rational numbers there are infinitely many more.",
      "Add by using a common denominator, and subtract by adding the additive inverse.",
      "Multiply numerators and denominators; divide by multiplying by the reciprocal, and remember 0 has no reciprocal."
    ]
  },
  '7:perimeter-area': {
    "read": 9,
    "sections": [
      {
        "h": "What perimeter and area mean",
        "body": "<p><b>Perimeter</b> is the distance all the way around a closed shape. Think of walking once around the edge of a field: the distance you walk is the perimeter. It is measured in units of length such as cm and m.</p><p><b>Area</b> is the amount of flat surface a shape covers. Think of the grass inside the field. It is measured in square units such as cm² and m².</p><div class=\"nterm\">Perimeter = length of the boundary (cm, m). Area = surface covered (cm², m²).</div><p>Remember: if you need a fence or a border, you want the perimeter. If you need paint, tiles or grass, you want the area.</p>"
      },
      {
        "h": "Squares and rectangles",
        "body": "<p>A rectangle has two lengths and two breadths. A square is a rectangle whose four sides are all equal.</p><div class=\"nterm\">Rectangle: perimeter = 2 × (l + b), area = l × b.<br>Square of side a: perimeter = 4 × a, area = a × a = a².</div><p>Example: A rectangle is 15 m long and 8 m wide. Find its perimeter and area.<br>Solution: Perimeter = 2 × (15 + 8) = 2 × 23 = 46 m. Area = 15 × 8 = 120 m².</p><p>Example: Find the perimeter and area of a square of side 6 cm.<br>Solution: Perimeter = 4 × 6 = 24 cm. Area = 6 × 6 = 36 cm².</p>"
      },
      {
        "h": "Finding a missing side",
        "body": "<p>The formulas can be used backwards. If you know the area or the perimeter and one side, you can find the other side.</p><ul><li>From area: other side = area ÷ known side.</li><li>From perimeter of a rectangle: l + b = perimeter ÷ 2, then subtract the known side.</li><li>For a square: side = perimeter ÷ 4, or side = √area.</li></ul><div class=\"nterm\">Rectangle: b = area ÷ l, and b = (perimeter ÷ 2) - l.</div><p>Example: A rectangle has area 72 cm² and length 12 cm. Find its breadth.<br>Solution: b = 72 ÷ 12 = 6 cm.</p><p>Example: A rectangle has perimeter 30 cm and length 9 cm. Find its breadth.<br>Solution: l + b = 30 ÷ 2 = 15, so b = 15 - 9 = 6 cm.</p><p>Example: A square has area 49 m². Find its perimeter.<br>Solution: Side = √49 = 7 m, so perimeter = 4 × 7 = 28 m.</p>"
      },
      {
        "h": "Parallelograms and triangles",
        "body": "<p>A parallelogram has opposite sides equal and parallel. Its <b>height</b> is the perpendicular distance between the base and the opposite side. It is not the slanting side.</p><div class=\"nterm\">Parallelogram: area = base × height.</div><p>If you cut a parallelogram along a diagonal you get two triangles of equal area. So a triangle with the same base and height has half the area.</p><div class=\"nterm\">Triangle: area = 1/2 × base × height.</div><p>Example: A parallelogram has base 15 cm and height 8 cm. Find its area.<br>Solution: Area = 15 × 8 = 120 cm².</p><p>Example: A triangle has base 14 cm and height 9 cm. Find its area.<br>Solution: Area = 1/2 × 14 × 9 = 63 cm².</p><p>Example: A triangle has area 40 cm² and base 10 cm. Find its height.<br>Solution: 1/2 × 10 × h = 40, so 5 × h = 40 and h = 8 cm.</p>"
      },
      {
        "h": "Circles",
        "body": "<p>The <b>radius</b> (r) is the distance from the centre to the edge. The <b>diameter</b> (d) goes across the circle through the centre, so d = 2r. The distance around the circle is its <b>circumference</b>.</p><div class=\"nterm\">Circumference = 2πr (or πd). Area = πr².</div><p>The value of π is about 22/7 or 3.14. Always use the value the question tells you. Use 22/7 when the radius is a multiple of 7, such as 7, 14 or 21, because the 7 cancels.</p><p>Example: Taking π = 22/7, find the circumference and area of a circle of radius 14 cm.<br>Solution: Circumference = 2 × 22/7 × 14 = 88 cm. Area = 22/7 × 14 × 14 = 616 cm².</p><p>Example: Taking π = 3.14, find the circumference and area of a circle of diameter 20 cm.<br>Solution: r = 10 cm. Circumference = 2 × 3.14 × 10 = 62.8 cm. Area = 3.14 × 10 × 10 = 314 cm².</p>"
      },
      {
        "h": "Changing units",
        "body": "<p>Length units change by 100 between m and cm, but area units change by 100 × 100 because area has two lengths multiplied.</p><div class=\"nterm\">1 m = 100 cm. 1 m² = 10000 cm². 1 hectare = 10000 m².</div><p>A <b>hectare</b> is the area of a square of side 100 m. It is used to measure large pieces of land such as farms.</p><p>Example: Change 3.5 m² to cm².<br>Solution: 3.5 × 10000 = 35000 cm².</p><p>Example: A farmer has 2 hectares. Find the area in m².<br>Solution: 2 × 10000 = 20000 m².</p><p>Tip: change all lengths to the same unit before you multiply.</p>"
      },
      {
        "h": "Combined shapes and paths",
        "body": "<p>Some shapes are made of simple shapes joined together, or have a part cut out. Split the figure, find each area, then add or subtract.</p><div class=\"nterm\">Add the areas when shapes are joined. Subtract when a part is removed.</div><p>Example: A lawn is 25 m by 16 m. A circular bed of radius 7 m is made in it. Taking π = 22/7, find the grass area.<br>Solution: Lawn = 25 × 16 = 400 m². Bed = 22/7 × 7 × 7 = 154 m². Grass = 400 - 154 = 246 m².</p><p><b>Paths:</b> a path around a garden is found by subtracting the smaller rectangle from the larger one.</p><p>Example: A garden is 20 m by 12 m with a 1 m wide path outside it all round. Find the path area.<br>Solution: Outer rectangle = 22 × 14 = 308 m². Garden = 20 × 12 = 240 m². Path = 308 - 240 = 68 m².</p><p>For a path inside, the inner rectangle's length and breadth are each smaller by twice the width of the path.</p>"
      },
      {
        "h": "Solving word problems",
        "body": "<p>Read the problem and decide first: is it about the boundary (perimeter) or the surface (area)?</p><ul><li>Fencing, wire, lace, a border: use perimeter.</li><li>Tiles, paint, grass, carpet, ploughing: use area.</li></ul><div class=\"nterm\">Cost = rate × length (for fencing) or rate × area (for covering a surface).</div><p>Example: A field is 50 m by 30 m. It is fenced with 2 rounds of wire at Rs 20 per metre. Find the cost.<br>Solution: Perimeter = 2 × (50 + 30) = 160 m. Two rounds = 320 m. Cost = 320 × 20 = Rs 6400.</p><p>Example: A floor 5 m by 4 m is covered with square tiles of side 50 cm. How many tiles are needed?<br>Solution: Floor = 5 × 4 = 20 m². One tile = 0.5 × 0.5 = 0.25 m². Tiles = 20 ÷ 0.25 = 80.</p><p>Always write the units in your answer.</p>"
      }
    ],
    "recap": [
      "Perimeter is the distance around a shape, area is the surface it covers.",
      "Rectangle: perimeter = 2(l + b), area = l × b. Square: perimeter = 4a, area = a².",
      "Parallelogram area = base × height, and triangle area = 1/2 × base × height.",
      "Circle: circumference = 2πr and area = πr², using the value of π given in the question.",
      "1 m² = 10000 cm² and 1 hectare = 10000 m², so convert lengths before multiplying."
    ]
  },
  '7:thousand-years': {
    "read": 8,
    "sections": [
      {
        "h": "A thousand years of change",
        "body": "<p>This chapter looks at the years from about <b>700 to 1750</b>, a span of roughly a thousand years. Historians ask what changed in these years and what stayed the same. Look at a map from <b>1154</b> by the Arab geographer <b>Al-Idrisi</b>, and one from much later, and you can see how people's knowledge of the subcontinent grew.</p><p>Many things changed together. New tools spread, new foods reached the kitchen, new groups rose to power, and new religious ideas gathered followers.</p><div class=\"nterm\">The period from 700 to 1750 saw changes in technology, farming, society, politics and religion, not just changes of rulers.</div>"
      },
      {
        "h": "Words that change their meaning",
        "body": "<p>Words do not always mean the same thing. <b>Hindustan</b> is a good example. In the thirteenth century the chronicler <b>Minhaj-i-Siraj</b> used it for areas of <b>Punjab, Haryana and the land between the Ganga and Yamuna</b>, the heart of the Delhi Sultan's lands. In the early sixteenth century <b>Babur</b> used it for the geography, animals and culture of the whole subcontinent. The poet <b>Amir Khusrau</b> used the word <b>Hind</b>.</p><p>The word <b>Hindu</b> was first used by Persian speakers for people who lived east of the river <b>Indus</b>. It described a place and its people before it became a name for a religion.</p><p>Sources of this age came in many languages, including <b>Sanskrit, Arabic, Persian and Turkish</b>.</p><div class=\"nterm\">The meaning of a word depends on who uses it and when. Historians must read words as people of that time understood them.</div>"
      },
      {
        "h": "How we know: the sources",
        "body": "<p>Historians build the past from sources. Some important ones are:</p><ul><li><b>Inscriptions</b>: writings carved on stone or metal, often about gifts and rulers.</li><li><b>Coins</b>: they carry names, pictures or dates of rulers.</li><li><b>Manuscripts</b>: handwritten books copied by scribes. Each copy could change a little.</li><li><b>Chronicles</b>: long accounts of a ruler's reign written by court historians.</li></ul><p>Famous writers include <b>Minhaj-i-Siraj</b> and <b>Ziauddin Barani</b>, who wrote about the Delhi Sultans (Barani wrote the <b>Tarikh-i-Firuz Shahi</b>), and <b>Abu'l Fazl</b>, who wrote the <b>Akbarnama</b> for Akbar. Every writer has a point of view, so historians check one source against another.</p><div class=\"nterm\">A chronicle is a record written by a court historian. Historians compare chronicles with inscriptions and coins before trusting them.</div>"
      },
      {
        "h": "Dividing history into periods",
        "body": "<p>To study a long past, historians divide it into periods. Many years ago, British historians divided Indian history into <b>Hindu, Muslim and British</b> periods. They named each age after the religion of its rulers.</p><p>This division has a big problem. It treats the rulers' religion as the main thing about an age. But people in every period were diverse, and rulers of many kinds lived at the same time. Think of the great Vijayanagara kingdom of the south in the age called the Muslim period. Farming, trade, crafts and beliefs changed in ways that have nothing to do with a ruler's religion.</p><p>Today historians usually speak of <b>ancient, medieval and modern</b> periods. The medieval period sits between the ancient and the modern.</p><div class=\"nterm\">Naming a whole age after the rulers' religion hides the variety of society, so most historians no longer use the Hindu, Muslim and British division.</div>"
      },
      {
        "h": "New groups, regions and empires",
        "body": "<p>New social and political groups rose in these years. The <b>Rajputs</b> became known as warrior clans, and many ruled kingdoms. The <b>Marathas</b> rose in Maharashtra, the <b>Ahoms</b> in Assam and the <b>Sikhs</b> in Punjab. The <b>Kayasthas</b> were known as scribes and administrators.</p><p>Large states grew too. The <b>Cholas</b> rose in the 9th century and ruled from the south in what is now Tamil Nadu. The <b>Delhi Sultanate</b> began in 1206, with dynasties such as the Khaljis and Tughlaqs. The <b>Vijayanagara Empire</b> rose in the south from the 14th century, and the <b>Mughal Empire</b> began with <b>Babur</b> in 1526.</p><p>Empires and regions lived side by side. Each region kept its own language, customs and rulers, even when a great empire was near.</p><div class=\"nterm\">In these thousand years, big empires and regional kingdoms existed together, and each region built its own culture.</div>"
      },
      {
        "h": "Old and new religions",
        "body": "<p>This was an age of religious change. <b>Islam</b> had emerged in Arabia in the seventh century and found followers in the subcontinent. At the same time, old traditions of worship kept changing. In the Hindu tradition, many people turned to devotion to gods such as Shiva, Vishnu and Durga.</p><p>The <b>bhakti</b> tradition taught that loving devotion to God was what mattered most. Bhakti saints often sang in the language of ordinary people. The <b>Sufis</b> were Muslim mystics who also stressed love and devotion. Both traditions welcomed people of many backgrounds.</p><div class=\"nterm\">Bhakti and Sufism both stressed loving devotion to God, and their message reached ordinary people.</div>"
      },
      {
        "h": "New tools, crops and trade",
        "body": "<p>Life at work and at home changed in these years. Farmers used the <b>Persian wheel</b>, a wheel with pots turned by animals, to lift water for fields. The <b>spinning wheel</b> helped weavers get more yarn for cloth. <b>Firearms</b> began to be used in combat and changed how armies fought.</p><p>Food changed too. <b>Potatoes, corn, chillies, tea and coffee</b> became part of the food of the subcontinent in this period. Think of how hard it would be to imagine our meals without them.</p><p>With these changes in farming, craft and food, people in markets and villages lived differently from those of earlier centuries.</p><div class=\"nterm\">Persian wheel for farming, spinning wheel for cloth, firearms for combat: new technologies changed work in these years.</div>"
      }
    ],
    "recap": [
      "The chapter covers about a thousand years, from 700 to 1750, when many things changed.",
      "Word meanings change: Hindustan meant different areas to Minhaj-i-Siraj and to Babur.",
      "Historians use inscriptions, coins, manuscripts and chronicles, and compare them with each other.",
      "Dividing history into Hindu, Muslim and British periods hides the diversity of society.",
      "New groups, empires, religions, tools and foods all shaped these thousand years."
    ]
  },
  '7:new-kings': {
    "read": 8,
    "sections": [
      {
        "h": "New dynasties and the samantas",
        "body": "<p>From about the <b>7th century</b>, new dynasties began to rise in many parts of the subcontinent. Many of them started as <b>landlords or warrior chiefs</b> who already held power in their regions. The older kings accepted them as <b>samantas</b>, that is, subordinates.</p><div class=\"nterm\">A <b>samanta</b> was a warrior chief or landlord who accepted a king as overlord, brought him tribute and gifts, attended his court and gave him military help.</div><p>As samantas grew rich and strong, they took bigger titles such as <b>maha-samanta</b> and <b>maha-mandaleshvara</b> (great lord of a region). Some even <b>declared themselves independent</b>. This is how many new kingdoms came into being.</p>"
      },
      {
        "h": "Dantidurga and the Rashtrakutas",
        "body": "<p>A good example is <b>Dantidurga</b>. He was a <b>Rashtrakuta</b> chief, and the Rashtrakutas were at first subordinates of the <b>Chalukyas of Karnataka</b>. In the middle of the 8th century, Dantidurga <b>overthrew his Chalukya overlord</b> and made the Rashtrakutas a ruling power.</p><p>He then performed the <b>hiranyagarbha</b> ritual with the help of <b>Brahmanas</b>.</p><div class=\"nterm\"><b>Hiranyagarbha</b> means 'golden womb'. When performed with the help of Brahmanas, it was believed to lead to the <b>rebirth of the sacrificer as a Kshatriya</b>, even if he was not born one.</div><p>So the ritual helped a chief from a different background to be accepted as a proper ruler.</p>"
      },
      {
        "h": "How the new kingdoms were run",
        "body": "<p>A new king needed resources to rule. Revenue came from <b>peasants, traders and craftspersons</b>. This wealth paid for the <b>army, the officials, forts and temples</b>.</p><p>Rulers also liked to look grand. They took titles such as <b>maha-raja-adhiraja</b> (great king, overlord of kings) and <b>tri-bhuvana-chakravartin</b> (lord of the three worlds).</p><div class=\"nterm\">Cause and effect: stronger revenue meant bigger armies and temples, and a bigger army meant a king could win more land and take grander titles.</div>"
      },
      {
        "h": "The tripartite struggle for Kannauj",
        "body": "<p>Kannauj, a city in the <b>Ganga valley</b>, was seen as a rich and prestigious prize. Three dynasties fought again and again to control it: the <b>Gurjara-Pratiharas</b>, the <b>Palas</b> of Bengal and Bihar, and the <b>Rashtrakutas</b> of the Deccan.</p><div class=\"nterm\">Because <b>three</b> powers took part, historians call this the <b>tripartite struggle</b> for Kannauj.</div><p>The long fighting used up the strength of all three, and none of them won lasting control.</p>"
      },
      {
        "h": "The Cholas: from Uraiyur to Gangaikondacholapuram",
        "body": "<p>The Cholas had an old chiefly family at <b>Uraiyur</b>. <b>Vijayalaya</b> captured the <b>Kaveri delta</b> from the <b>Muttaraiyar</b>, built the town of <b>Thanjavur</b> and a temple there for the goddess <b>Nishumbhasudini</b>.</p><p><b>Rajaraja I</b> became king in <b>985</b> and made the Chola kingdom very powerful. His son <b>Rajendra I</b> carried on his work and built a new capital, <b>Gangaikondacholapuram</b>, 'the town of the Chola who conquered the Ganga'.</p><div class=\"nterm\">Order to remember: Uraiyur (old home), Thanjavur (built by Vijayalaya), Gangaikondacholapuram (built by Rajendra I).</div>"
      },
      {
        "h": "Chola government, land and farming",
        "body": "<p>In the Chola kingdom, villages were grouped into units called <b>nadu</b>. Each village or group had its own bodies:</p><ul><li><b>Ur</b>: the assembly of a village.</li><li><b>Sabha</b>: the assembly of landowning <b>Brahmanas</b> in brahmadeya villages.</li><li><b>Nagaram</b>: the organisation of <b>merchants</b>.</li></ul><p>Land gifts had names: <b>brahmadeya</b> (to Brahmanas), <b>devadana</b> (to temples), <b>shalabhoga</b> (for a school), <b>pallichchhandam</b> (to Jaina institutions) and <b>vellanvagai</b> (land of non-Brahmana peasant owners).</p><p>The <b>Kaveri delta</b> was the heartland, and farming grew with the help of <b>wells and tanks</b>.</p><div class=\"nterm\">Remember: nadu = group of villages, sabha = Brahmana landowners, nagaram = merchants.</div>"
      },
      {
        "h": "Temples, bronzes and prashastis",
        "body": "<p>Chola kings built grand temples to show their <b>devotion, power and wealth</b>. The finest is the great Shiva temple at <b>Thanjavur</b>, built by <b>Rajaraja I</b> and completed in <b>1010</b>. It is known as the <b>Rajarajeshvara</b> or <b>Brihadeshvara</b> temple.</p><p>Temples were more than places of worship. They owned land, received gifts and gave work to many craftspersons, so they were centres of the economy. Chola <b>bronze images</b> are among the finest in the world.</p><p>Many rulers had <b>prashastis</b> engraved in inscriptions.</p><div class=\"nterm\">A <b>prashasti</b> is a piece in praise of a ruler. It may exaggerate, so historians check it against other sources.</div>"
      },
      {
        "h": "Rajputs, Mahmud of Ghazni and Al-Biruni",
        "body": "<p>The <b>Chahamanas</b>, later known as <b>Chauhans</b>, ruled the area around <b>Delhi and Ajmer</b>. <b>Prithviraj III</b> (Prithviraj Chauhan) defeated the Afghan ruler <b>Muhammad Ghori</b> in <b>1191</b> but lost to him in <b>1192</b>.</p><p><b>Mahmud of Ghazni</b> ruled from <b>Ghazni</b> in Afghanistan. He raided the subcontinent almost every year, targeting <b>wealthy temples</b> such as <b>Somnath</b> in Gujarat. He used the loot to build a splendid capital at Ghazni.</p><p><b>Al-Biruni</b>, a scholar, learnt Sanskrit and wrote the <b>Kitab-ul-Hind</b> in Arabic. It is still an important source about the subcontinent of his time.</p><div class=\"nterm\">Al-Biruni's Kitab-ul-Hind: a scholar's account of the subcontinent in the days of Mahmud of Ghazni.</div>"
      }
    ],
    "recap": [
      "From about the 7th century, samantas rose to become rulers, and Dantidurga's Rashtrakutas are a key example.",
      "New kings raised revenue from peasants, traders and craftspersons, took grand titles and performed rituals like hiranyagarbha.",
      "The Palas, Gurjara-Pratiharas and Rashtrakutas fought the tripartite struggle for Kannauj.",
      "The Cholas rose from Vijayalaya to Rajaraja I and Rajendra I, ran villages through nadu, ur, sabha and nagaram, and built the Thanjavur temple.",
      "Prashastis praise rulers; Prithviraj Chauhan, Mahmud of Ghazni and Al-Biruni complete the picture of the age."
    ]
  },
  '7:delhi-sultans': {
    "read": 8,
    "sections": [
      {
        "h": "Delhi becomes a capital",
        "body": "<p>Before the Sultans, Delhi was already a place of importance. It first became the capital of a kingdom under the <b>Tomara Rajputs</b>. In the middle of the twelfth century the <b>Chauhans of Ajmer</b> defeated the Tomaras and took Delhi.</p><p>Under these rulers Delhi grew into an important <b>trading centre</b>. Rich merchants, many of them Jain, lived there and built temples. Coins called <b>dehliwal</b> were minted in Delhi and travelled widely in trade.</p><div class=\"nterm\">Delhi became a capital under the Tomaras and then the Chauhans, and grew into a busy centre of trade with its own dehliwal coins.</div>"
      },
      {
        "h": "Muhammad Ghori and the start of the Sultanate",
        "body": "<p>In 1192 <b>Muhammad Ghori</b> defeated <b>Prithviraj Chauhan</b> in battle and the Chauhan rule over Delhi ended. Ghori's slave general <b>Qutbuddin Aibak</b> took charge of the region.</p><p>In <b>1206</b> Qutbuddin Aibak became the first ruler of the <b>Delhi Sultanate</b>. A <b>Sultan</b> is a ruler who commands the state with full power. From then on Delhi became the capital of a large kingdom that ruled much of north India for over 300 years.</p><div class=\"nterm\">Muhammad Ghori defeated Prithviraj Chauhan in 1192, and the Delhi Sultanate began in 1206 under Qutbuddin Aibak.</div>"
      },
      {
        "h": "The Mamluk (Slave) dynasty",
        "body": "<p>The first dynasty of the Sultanate is called the <b>Mamluk</b> or <b>Slave dynasty</b>, because its early rulers had begun as slave soldiers who rose to high rank. It ruled from 1206 to 1290.</p><ul><li><b>Qutbuddin Aibak</b> (1206 to 1210) was the first Sultan.</li><li><b>Iltutmish</b> (1210 to 1236) strengthened the Sultanate and its administration.</li><li><b>Raziya Sultan</b> (1236 to 1240), the daughter of Iltutmish, was an able ruler. The chronicler Minhaj-i-Siraj said she was more able than all her brothers. But Minhaj-i-Siraj was not comfortable with a queen as ruler, and the nobles were unhappy at her attempts to rule independently. She was removed in 1240.</li><li><b>Balban</b> (1266 to 1287) was a later Sultan of this dynasty.</li></ul><div class=\"nterm\">The Mamluk dynasty (1206 to 1290) began with Qutbuddin Aibak, a former slave general, and included Iltutmish, Raziya and Balban.</div>"
      },
      {
        "h": "The Khalji dynasty",
        "body": "<p>The <b>Khalji dynasty</b> ruled from 1290 to 1320. It was founded by <b>Jalaluddin Khalji</b>. Its best-known ruler was <b>Alauddin Khalji</b> (1296 to 1316).</p><p>In his time the <b>Mongols</b> from Central Asia raided north India again and again. To defend the Sultanate, Alauddin built a <b>large standing army</b> and paid the soldiers in cash. To make this affordable he practised <b>market control</b>: he fixed the prices of goods in the markets so that the soldiers could buy what they needed at low cost.</p><p>Alauddin also sent armies to the south under his general <b>Malik Kafur</b>. These campaigns carried the Sultanate's power into the Deccan and the far south.</p><div class=\"nterm\">Alauddin Khalji met the Mongol threat with a large cash-paid army, kept prices fixed in the markets, and sent Malik Kafur to the Deccan and the south.</div>"
      },
      {
        "h": "The Tughluq dynasty",
        "body": "<p>The <b>Tughluq dynasty</b> ruled from 1320 to 1414. It was founded by <b>Ghiyasuddin Tughluq</b>, and his son <b>Muhammad Tughluq</b> ruled from 1324 to 1351.</p><p>Muhammad Tughluq tried bold ideas. He moved his capital from Delhi to <b>Daulatabad</b>, which was earlier called <b>Devagiri</b>, in the Deccan. He also introduced <b>token currency</b>, cheaper metal coins meant to have the value of silver ones. People did not trust the cheap tokens. They kept their gold and silver coins and paid their taxes in tokens, so the scheme failed.</p><p>After him <b>Firuz Shah Tughluq</b> became Sultan in 1351 and ruled until 1388.</p><div class=\"nterm\">Muhammad Tughluq shifted the capital to Daulatabad and tried token currency, but both experiments are remembered as failures.</div>"
      },
      {
        "h": "The Sayyids and the Lodis",
        "body": "<p>After the Tughluqs came two more dynasties.</p><ul><li>The <b>Sayyid dynasty</b> ruled from 1414 to 1451.</li><li>The <b>Lodi dynasty</b> ruled from 1451 to 1526 and was the last dynasty of the Delhi Sultanate.</li></ul><p>To remember the whole order, think of five dynasties: <b>Mamluk (1206), Khalji (1290), Tughluq (1320), Sayyid (1414), Lodi (1451)</b>. The Lodi rule ended in 1526.</p><div class=\"nterm\">Order of Sultanate dynasties: Mamluk, Khalji, Tughluq, Sayyid, Lodi.</div>"
      },
      {
        "h": "Running the Sultanate: iqtas and coins",
        "body": "<p>The Sultans needed a way to collect revenue and keep an army. They divided their territory into <b>iqtas</b>. The officer who held an iqta was called a <b>muqti</b>.</p><p>A muqti collected revenue from his iqta and kept <b>soldiers</b> for the Sultan out of that money. Iqtas were <b>not hereditary</b>, and muqtis were moved from one iqta to another from time to time. This kept them under the Sultan's control.</p><p>The Sultans also issued standard coins: the silver <b>tanka</b> and the copper <b>jital</b>.</p><div class=\"nterm\">A muqti collected revenue and kept soldiers in his iqta, which was not hereditary. Coins: silver tanka and copper jital.</div>"
      },
      {
        "h": "The Qutb Minar and the Persian chronicles",
        "body": "<p>The <b>Qutb Minar</b> at Mehrauli in Delhi is one of the best-known buildings of this age. It was begun by <b>Qutbuddin Aibak</b> and completed by <b>Iltutmish</b>.</p><p>We learn much about the Sultans from <b>chronicles</b>, called tawarikh, written in <b>Persian</b>. Two famous writers are <b>Minhaj-i-Siraj</b>, who wrote the <i>Tabaqat-i-Nasiri</i>, and <b>Ziyauddin Barani</b>, who wrote the <i>Tarikh-i-Firuz Shahi</i>. These writers were close to the court, so historians read them carefully and compare them with other sources.</p><div class=\"nterm\">Persian chronicles such as Tabaqat-i-Nasiri (Minhaj-i-Siraj) and Tarikh-i-Firuz Shahi (Barani) are major sources on the Sultans.</div>"
      }
    ],
    "recap": [
      "Delhi became a capital under the Tomaras, passed to the Chauhans, and the Sultanate began in 1206 under Qutbuddin Aibak.",
      "Dynasties in order: Mamluk, Khalji, Tughluq, Sayyid and Lodi, ending in 1526.",
      "Raziya was the daughter of Iltutmish; Alauddin Khalji controlled prices and sent Malik Kafur south; Muhammad Tughluq tried token currency and Daulatabad.",
      "Muqtis ran iqtas to collect revenue and keep soldiers; coins were the silver tanka and the copper jital.",
      "The Qutb Minar and Persian chronicles like Tabaqat-i-Nasiri and Tarikh-i-Firuz Shahi tell us about this age."
    ]
  },
  '7:mughal-empire': {
    "read": 8,
    "sections": [
      {
        "h": "Who were the Mughals?",
        "body": "<p>The Mughals were a ruling family that governed large parts of India for over three hundred years, from 1526. The name <b>Mughal</b> is a form of the word <b>Mongol</b>. Through their mothers, the rulers traced their line back to the great Mongol leader <b>Genghis Khan</b>. Through their fathers, they came from <b>Timur</b>, the ruler of Central Asia who had captured Delhi in 1398.</p><p>The Mughals did not like to be called Mongols. They were proud of being descendants of Timur, the ruler who captured Delhi in 1398. Their first ruler arrived from Central Asia, and over time the family became Indian in its home, its customs and its interests.</p><div class=\"nterm\">Mughal = linked to Mongol. Mother's side: Genghis Khan. Father's side: Timur, who took Delhi in 1398.</div>"
      },
      {
        "h": "Babur and the First Battle of Panipat",
        "body": "<p><b>Babur</b> became the ruler of Ferghana in Central Asia when he was only a boy. After losing his homeland, he looked towards India. In <b>1526</b>, at the <b>First Battle of Panipat</b>, he defeated <b>Ibrahim Lodi</b>, the Sultan of Delhi. This victory ended the Delhi Sultanate and began Mughal rule in India.</p><p>Babur did not stop there. In 1527 he defeated the Rajput ruler <b>Rana Sanga</b> of Mewar at the <b>Battle of Khanwa</b>. Babur is regarded as the <b>founder of the Mughal Empire</b>.</p><div class=\"nterm\">1526: Babur beats Ibrahim Lodi at Panipat. 1527: Babur beats Rana Sanga at Khanwa.</div>"
      },
      {
        "h": "Humayun and Sher Shah Suri",
        "body": "<p>Babur's son <b>Humayun</b> ruled from 1530, but he faced trouble from the Afghan leader <b>Sher Khan</b>. Sher Khan defeated Humayun at <b>Chausa in 1539</b> and at <b>Kanauj in 1540</b>. Humayun had to flee, and he spent many years in <b>Iran</b>.</p><p>Sher Khan became <b>Sher Shah Suri</b>, the ruler of the <b>Sur</b> dynasty. He is remembered for his careful rule and for the silver coin called the <b>rupya</b>, whose name lives on in today's rupee. After Sher Shah's family grew weak, Humayun returned and won back Delhi in <b>1555</b>. He died the next year.</p><div class=\"nterm\">Humayun lost to Sher Shah at Chausa (1539) and Kanauj (1540), and regained Delhi in 1555.</div>"
      },
      {
        "h": "Akbar the builder of an empire",
        "body": "<p><b>Akbar</b>, the son of Humayun, became emperor in 1556 while still very young. In the same year, his side won the <b>Second Battle of Panipat</b> against <b>Hemu</b>. Over the years, Akbar's armies spread Mughal rule over large regions, including <b>Gujarat</b> and <b>Bengal</b>.</p><p>Akbar understood that to rule such a large land he needed friends. Many <b>Rajput</b> rulers accepted his authority and were given high ranks in his service. The <b>Sisodiya</b> Rajputs of Mewar, led by Rana Udai Singh, refused for a long time, and Akbar's army besieged the fort of <b>Chittor</b> in 1568.</p><div class=\"nterm\">Akbar won at Second Panipat (1556), expanded the empire, and won Rajput support by giving rulers high ranks.</div>"
      },
      {
        "h": "Akbar's ideas and Abu'l Fazl",
        "body": "<p>Akbar was curious about religion. At the <b>Ibadat Khana</b> in Fatehpur Sikri he held discussions with Muslim scholars, Brahmanas, Jesuit priests and Zoroastrians. From these talks grew his idea of <b>sulh-i-kul</b>, meaning <b>universal peace</b>: all people, of all faiths, should be treated fairly.</p><p>His friend and court historian <b>Abu'l Fazl</b> wrote the <b>Akbarnama</b>. Its third book is the <b>Ain-i-Akbari</b>, which describes the army, officials, revenue and people of the empire. Together they are priceless sources for historians.</p><div class=\"nterm\">Sulh-i-kul = universal peace. Akbarnama and Ain-i-Akbari were written by Abu'l Fazl.</div>"
      },
      {
        "h": "Jahangir, Shah Jahan and Aurangzeb",
        "body": "<p>Akbar's son <b>Jahangir</b> ruled from 1605. His wife <b>Nur Jahan</b> was very powerful at the court. Jahangir's son <b>Shah Jahan</b> became emperor in 1627. He is famous for his buildings, including the <b>Taj Mahal</b> at Agra, built in memory of his wife Mumtaz Mahal, and the <b>Red Fort</b> and city of Shahjahanabad in Delhi.</p><p>When Shah Jahan fell ill, his sons fought for the throne. <b>Aurangzeb</b> won, imprisoned his father and ruled from 1658 until 1707. He spent many years in the <b>Deccan</b> and conquered <b>Bijapur</b> and <b>Golconda</b>. These long wars were very costly for the empire.</p><div class=\"nterm\">Jahangir (1605), Shah Jahan (1627), Aurangzeb (1658 to 1707). Taj Mahal: Shah Jahan.</div>"
      },
      {
        "h": "Mansabdars, jagirdars and land revenue",
        "body": "<p>Akbar organised his officers in the <b>mansabdari</b> system. <b>Mansab</b> means rank. Each <b>mansabdar</b> had two numbers: <b>zat</b>, which showed his personal rank and salary, and <b>sawar</b>, the number of horsemen he had to keep. Mansabdars were usually paid through <b>jagirs</b>, which gave them the right to collect revenue from an area. They did not live there: their servants collected the money.</p><p>Land revenue was fixed under the <b>zabt</b> system. With the help of <b>Todar Mal</b>, crop yields, prices and cultivated land were carefully studied, and a cash rate was set for each crop. <b>Zamindars</b>, local headmen and chiefs, helped to collect the revenue from peasants.</p><div class=\"nterm\">Zat = personal rank and salary. Sawar = number of horsemen. Jagir = right to collect revenue. Zabt = cash rates for each crop.</div>"
      },
      {
        "h": "Succession and the decline of the empire",
        "body": "<p>The Mughals did not follow the rule that only the eldest son inherits. Every son could claim a share, so princes often fought each other when an emperor died. This is why a war of succession broke out among Shah Jahan's sons.</p><p>In Aurangzeb's last years the number of mansabdars grew but good jagirs were few. Many mansabdars waited long for a jagir, and some jagirdars squeezed peasants for more revenue. After Aurangzeb died in 1707, the empire grew weak. Governors of provinces such as Awadh, Bengal and Hyderabad began to act almost like independent rulers. In 1739, <b>Nadir Shah</b> of Iran attacked Delhi and carried away great treasures.</p><div class=\"nterm\">Every son had a claim, so succession wars were common. After 1707 the empire weakened and provinces went their own way.</div>"
      }
    ],
    "recap": [
      "The Mughals came from Genghis Khan on the mother's side and Timur on the father's side; Babur founded the empire at Panipat in 1526.",
      "Humayun lost to Sher Shah Suri in 1539 and 1540 but regained Delhi in 1555.",
      "Akbar won at Second Panipat in 1556, expanded the empire, won Rajput support and promoted sulh-i-kul; Abu'l Fazl wrote the Akbarnama and Ain-i-Akbari.",
      "Mansabdars had zat and sawar and were paid through jagirs; the zabt system fixed cash revenue rates for crops, with zamindars helping to collect.",
      "Jahangir, Shah Jahan and Aurangzeb followed Akbar; wars of succession, the Deccan wars and Nadir Shah's attack in 1739 led to decline."
    ]
  },
  '7:rulers-buildings': {
    "read": 8,
    "sections": [
      {
        "h": "Why rulers built",
        "body": "<p>Between the 8th and the 18th centuries, kings and sultans built forts, palaces, gardens, tombs, <b>temples</b> and <b>mosques</b>. They also built tanks, wells and bazaars for ordinary people. Why did they spend so much on stone and labour?</p><ul><li><b>Religion:</b> rulers wanted to show devotion to God.</li><li><b>Power:</b> a huge building told everyone how strong the ruler was.</li><li><b>Prestige:</b> a famous building brought fame and respect, even from rival kings.</li></ul><div class=\"nterm\">Grand buildings were built for religion, but also to show a ruler's power, wealth and prestige.</div>"
      },
      {
        "h": "How buildings stood up",
        "body": "<p>Builders in India used two main methods. In <b>post-and-lintel</b> (also called <b>trabeate</b>) construction, a horizontal beam, the <b>lintel</b>, rests across two upright columns. This was used for doors, windows and roofs of many early temples, mosques and tombs.</p><p>The second method is <b>arcuate</b>. An <b>arch</b> is a curve of stones over an opening. It carries the weight above it to its sides, so wider doors and halls become possible. A <b>dome</b> is a rounded, hollow roof, and a <b>vault</b> is an arched ceiling.</p><div class=\"nterm\">Trabeate = beams across columns. Arcuate = arches, domes and vaults.</div><p>Builders also used <b>lime mortar</b> to join stones. When it is mixed with stone chips and sets hard, it becomes <b>concrete</b>, which gave walls and domes great strength.</p>"
      },
      {
        "h": "Chola temples as symbols of power",
        "body": "<p>The Chola king <b>Rajaraja</b> built the huge <b>Rajarajeshvara temple</b> at <b>Thanjavur</b>, a temple of Shiva. Its name joins the king's own name with Ishvara, the Lord. The temple showed the king's devotion and also his power.</p><p>His son <b>Rajendra</b> built a new capital with a grand temple at <b>Gangaikondacholapuram</b>. These temples were built of stone, with tall towers, and they told every visitor how rich and strong the Cholas were.</p><div class=\"nterm\">Rajarajeshvara temple (Thanjavur) was built by Rajaraja. Gangaikondacholapuram was built by his son Rajendra.</div>"
      },
      {
        "h": "Delhi Sultans and their buildings",
        "body": "<p>The Delhi Sultans brought arches and domes into wide use. In Delhi, the <b>Qutb Minar</b> was begun by <b>Qutbuddin Aybak</b> and completed by <b>Iltutmish</b>. Next to it is the <b>Quwwat-ul-Islam mosque</b>. <b>Alauddin Khalji</b> built the <b>Alai Darwaza</b>, a gateway with arches, in the same complex.</p><p><b>Ghiyasuddin Tughluq</b> built the fortified city of <b>Tughluqabad</b> near Delhi.</p><div class=\"nterm\">Qutb complex: Qutb Minar (Aybak and Iltutmish), Quwwat-ul-Islam mosque, Alai Darwaza (Alauddin Khalji).</div>"
      },
      {
        "h": "Mughal tombs, gardens and Fatehpur Sikri",
        "body": "<p>The Mughals loved gardens. A <b>charbagh</b> is a garden divided into four parts by walkways or water channels. <b>Humayun's tomb</b> in Delhi stands in such a garden. <b>Sher Shah's tomb</b> is at <b>Sasaram</b> in Bihar.</p><p><b>Akbar</b> built a new city, <b>Fatehpur Sikri</b>, near Agra. Its tall gateway, the <b>Buland Darwaza</b>, was built to celebrate his victory in <b>Gujarat</b>.</p><div class=\"nterm\">Charbagh = a garden in four parts, split by walkways or water channels.</div>"
      },
      {
        "h": "Shah Jahan's buildings",
        "body": "<p>Shah Jahan built the <b>Taj Mahal</b> at Agra, on the bank of the Yamuna, in memory of his wife <b>Mumtaz Mahal</b>. It is made of white marble and stands in a charbagh garden.</p><p>In Delhi he built a new city called <b>Shahjahanabad</b>, with the <b>Red Fort</b> and the <b>Jama Masjid</b>. The Red Fort has walls of red sandstone. Inside it, the <b>Diwan-i-Am</b> was the hall where the emperor met the public and listened to their requests.</p><div class=\"nterm\">Shah Jahan: Taj Mahal (Agra), Red Fort and Jama Masjid (Delhi).</div>"
      },
      {
        "h": "Vijayanagara and regional styles",
        "body": "<p>The Vijayanagara empire had its capital at <b>Hampi</b>, on the banks of the <b>Tungabhadra</b> in Karnataka. The <b>Virupaksha temple</b>, a temple of Shiva, stands there.</p><p>Temples and mosques in different regions looked different, because builders used local materials, skills and traditions. Southern temples were built of stone, while Delhi's monuments used arches and domes.</p><div class=\"nterm\">Regions had their own building styles, shaped by local materials and craft traditions.</div>"
      },
      {
        "h": "Who really built them",
        "body": "<p>The ruler gave the orders and paid the cost, so we remember his name. But the actual work was done by thousands of people. <b>Architects</b> planned the buildings. <b>Masons</b>, <b>stone carvers</b> and other craftspeople cut the stone, carved it and raised the walls, arches and domes.</p><ul><li>The ruler was the <b>patron</b>.</li><li>The architect made the plan.</li><li>The craftspeople built it.</li></ul><div class=\"nterm\">Great monuments are the joint work of rulers, architects and skilled craftspeople.</div>"
      }
    ],
    "recap": [
      "Rulers built temples, mosques, tombs and forts for religion, power and prestige.",
      "Trabeate buildings use beams across columns; arcuate buildings use arches, domes and vaults, with lime mortar and concrete.",
      "Chola kings built Rajarajeshvara (Thanjavur) and Gangaikondacholapuram; Delhi Sultans built the Qutb complex and Tughluqabad.",
      "The Mughals built Humayun's tomb, Fatehpur Sikri and Buland Darwaza, and Shah Jahan built the Taj Mahal, Red Fort and Jama Masjid.",
      "Charbagh gardens have four parts; Hampi was the Vijayanagara capital; masons, carvers and architects did the building."
    ]
  },
  '7:environment': {
    "read": 8,
    "sections": [
      {
        "h": "What is the environment?",
        "body": "<p>The word <b>environment</b> means our surroundings. It is everything around us: the land we walk on, the water we drink, the air we breathe, the plants and animals, our homes, and even the people we live with.</p><div class=\"nterm\">Environment: everything around us, living and non-living, that affects our life.</div><p>Think of your own street. It has trees and birds, but also houses, shops and neighbours. All of these together are part of your environment, and each one affects you in some way.</p>"
      },
      {
        "h": "Natural, human-made and human environment",
        "body": "<p>We can sort the environment into three kinds.</p><ul><li><b>Natural environment:</b> things made by nature, such as mountains, rivers, soil, air, forests and animals.</li><li><b>Human-made environment:</b> things built by people, such as houses, roads, bridges, parks, factories and vehicles.</li><li><b>Human environment:</b> the human side of life, such as families, friendships, communities, customs and festivals.</li></ul><div class=\"nterm\">Natural elements come from nature, human-made elements are built by people, and the human environment is about relationships among people.</div><p>A village pond is natural, the bridge over a river is human-made, and the way neighbours help each other during a festival belongs to the human environment.</p>"
      },
      {
        "h": "The four domains of the earth",
        "body": "<p>The natural environment of the earth is divided into four big parts called <b>domains</b>.</p><ul><li><b>Lithosphere:</b> the solid, rocky crust of the earth. It has mountains, plateaus, plains, rocks, soil and minerals.</li><li><b>Hydrosphere:</b> all the water of the earth, in oceans, rivers, lakes and ice. Water covers about 71% of the earth's surface.</li><li><b>Atmosphere:</b> the thin layer of air around the earth. It is about 78% nitrogen and 21% oxygen, with small amounts of other gases. It gives us air to breathe and protects us from harmful rays of the sun.</li><li><b>Biosphere:</b> the narrow zone where land, water and air meet and life exists.</li></ul><div class=\"nterm\">Biosphere: the zone of contact of the lithosphere, hydrosphere and atmosphere where living things are found.</div>"
      },
      {
        "h": "Ecosystem: living and non-living together",
        "body": "<p>Plants, animals and other living things never live alone. They depend on their surroundings and on each other. An <b>ecosystem</b> is a system in which living things and their non-living surroundings interact.</p><div class=\"nterm\">Ecosystem: a community of living things (biotic) and their non-living surroundings (abiotic) that depend on each other.</div><ul><li><b>Biotic components:</b> living parts, such as fish, frogs, trees, grass and birds.</li><li><b>Abiotic components:</b> non-living parts, such as water, soil, air, sunlight and rocks.</li></ul><p>A pond is a good example. Fish, insects and water plants live in it, and they depend on the water, mud and sunlight. A forest is another ecosystem, with trees, deer, birds, soil, air and rain. If one part is harmed, the others suffer too. If a pond dries up, the fish and water plants die.</p>"
      },
      {
        "h": "Humans and the environment",
        "body": "<p>People and the environment affect each other. We take food, water, wood and minerals from nature. In early times people lived with very little change to nature. Today we change it in many ways.</p><ul><li><b>Farming:</b> farmers clear land, plough fields and irrigate crops to grow food.</li><li><b>Building cities:</b> forests are cleared for houses, roads and factories.</li><li><b>Pollution:</b> smoke, waste and noise add harmful things to the environment.</li></ul><p>Some changes are useful, but too much change harms nature. Cutting forests destroys the homes of animals and birds. When we take care, the environment stays in <b>balance</b>.</p><div class=\"nterm\">Balance in the environment: living and non-living parts exist together without one being badly harmed.</div>"
      },
      {
        "h": "Pollution and why we must protect the environment",
        "body": "<p><b>Pollution</b> is the addition of harmful things to air, water, soil or sound. It has several types.</p><ul><li><b>Air pollution:</b> smoke from vehicles, factories and burning garbage.</li><li><b>Water pollution:</b> factory waste, sewage and garbage thrown into rivers and lakes.</li><li><b>Soil pollution:</b> chemicals and plastic waste that spoil the soil.</li><li><b>Noise pollution:</b> loud horns, loudspeakers and machines.</li></ul><p>Pollution causes diseases, kills fish and harms crops. We must protect the environment because we depend on it for air, water and food, and because future generations will need it too.</p><div class=\"nterm\">Protecting the environment means using resources wisely so that nature and people can both stay healthy.</div><p>We can help by planting trees, saving water, disposing waste properly and using less plastic.</p>"
      },
      {
        "h": "Water cycle and natural resources",
        "body": "<p>Water keeps moving between the domains in the <b>water cycle</b>. The heat of the sun turns water from oceans, rivers and lakes into vapour. This is <b>evaporation</b>, and the water moves from the hydrosphere into the atmosphere. High up, the vapour cools and forms tiny droplets that make clouds. This is <b>condensation</b>. The water then falls as rain, snow or hail, called <b>precipitation</b>, and flows back to rivers and oceans.</p><div class=\"nterm\">Water cycle: evaporation, condensation and precipitation keep water moving between the hydrosphere and the atmosphere.</div><p>Nature also gives us <b>natural resources</b>. <b>Renewable resources</b>, such as sunlight, wind and water, are replaced by nature. <b>Non-renewable resources</b>, such as coal, petroleum and natural gas, take millions of years to form and can get used up, so we must use them carefully.</p>"
      }
    ],
    "recap": [
      "The environment is everything around us, living and non-living, and it affects our life.",
      "It can be natural, human-made or human (relationships and communities).",
      "The four domains are lithosphere, hydrosphere, atmosphere and biosphere.",
      "An ecosystem has biotic (living) and abiotic (non-living) parts that depend on each other.",
      "Pollution harms the balance of the environment, so we must protect it and use resources wisely."
    ]
  },
  '7:inside-our-earth': {
    "read": 8,
    "sections": [
      {
        "h": "A journey to the centre of the Earth",
        "body": "<p>The Earth looks solid and still, but inside it is made of different <b>layers</b>. The distance from the surface to the centre is about 6371 km. Nobody can dig that far, so scientists study the inside by looking at volcanoes, rocks that come up from below, and the waves made by earthquakes.</p><p>There are three main layers: the <b>crust</b> on the outside, the <b>mantle</b> in the middle and the <b>core</b> at the centre. One thing is true all the way down: the deeper we go, the <b>hotter</b> it gets. Miners in very deep mines feel this heat.</p><div class=\"nterm\">Layers from the surface inwards: crust, mantle, outer core, inner core. Temperature rises with depth.</div>"
      },
      {
        "h": "The crust: our thin outer skin",
        "body": "<p>The <b>crust</b> is the outermost layer. It is solid and it is the thinnest of all the layers. Under the continents it is about <b>35 km</b> thick, but under the oceans it is only about <b>5 km</b> thick.</p><p>The two kinds of crust are made of different materials:</p><ul><li><b>Continental crust</b> is rich in silica and alumina, so it is called <b>sial</b>.</li><li><b>Oceanic crust</b> is rich in silica and magnesium, so it is called <b>sima</b>.</li></ul><div class=\"nterm\">Sial = silica + alumina (continents). Sima = silica + magnesium (ocean floors).</div>"
      },
      {
        "h": "The mantle and the core",
        "body": "<p>Just below the crust is the <b>mantle</b>. It goes down to a depth of about <b>2900 km</b>. It is much hotter than the crust, and it is the layer from which hot molten rock called <b>magma</b> can rise.</p><p>At the very centre is the <b>core</b>. Its radius is about <b>3500 km</b>. It is made mainly of <b>nickel and iron</b>, so it is called <b>nife</b>. The core has very high temperature and pressure. It has two parts: the <b>outer core</b> is liquid, and the <b>inner core</b> is solid because the pressure there is so high.</p><div class=\"nterm\">Core = nife (nickel + iron). Outer core: liquid. Inner core: solid. The core is the hottest part of the Earth.</div>"
      },
      {
        "h": "Igneous rocks: born from fire",
        "body": "<p>A <b>rock</b> is a natural mass of mineral material that makes up the crust. There are three main kinds. The first are <b>igneous rocks</b>. They form when hot molten magma cools and becomes solid. Because they are the first rocks to form, and other rocks are made from them, they are also called <b>primary rocks</b>.</p><ul><li><b>Extrusive igneous rocks</b> form when lava comes out onto the surface and cools quickly. The grains are tiny. <b>Basalt</b> is an example, and the Deccan plateau has lots of it.</li><li><b>Intrusive igneous rocks</b> form when magma cools slowly deep inside the crust. The grains are large. <b>Granite</b> is an example, used for grinding stones.</li></ul><div class=\"nterm\">Igneous rock = cooled magma or lava. Extrusive (surface, fast cooling, e.g. basalt). Intrusive (underground, slow cooling, e.g. granite).</div>"
      },
      {
        "h": "Sedimentary and metamorphic rocks",
        "body": "<p>Wind, water and ice break rocks into small pieces called <b>sediments</b>. Rivers carry them away and drop them in layers. Over a very long time the layers are pressed and stick together to form <b>sedimentary rocks</b>, such as <b>sandstone</b> (from sand) and <b>limestone</b>. Dead plants and animals can get buried in these layers, and their remains are called <b>fossils</b>. Fossils are found in sedimentary rocks.</p><p>When any rock is squeezed and heated deep in the Earth, it changes its form. The new rock is a <b>metamorphic rock</b>.</p><ul><li>Clay changes into <b>slate</b>.</li><li>Limestone changes into <b>marble</b>.</li><li>Sandstone changes into <b>quartzite</b>.</li></ul><div class=\"nterm\">Sedimentary rock = sediments pressed in layers, may hold fossils. Metamorphic rock = an old rock changed by heat and pressure.</div>"
      },
      {
        "h": "The rock cycle",
        "body": "<p>Rocks do not stay the same for ever. One kind of rock can slowly change into another, and then another, and the process goes round and round. This is the <b>rock cycle</b>.</p><ol><li>Igneous rocks are broken into small pieces by wind and water.</li><li>The pieces are carried away and deposited, and in time they become sedimentary rock.</li><li>Heat and pressure change sedimentary (or igneous) rock into metamorphic rock.</li><li>If rock goes deep enough it melts into magma. When magma cools, new igneous rock forms and the cycle starts again.</li></ol><div class=\"nterm\">Rock cycle: igneous, sedimentary and metamorphic rocks keep changing from one kind into another.</div>"
      },
      {
        "h": "Minerals and their uses",
        "body": "<p>Rocks are made up of one or more <b>minerals</b>. A mineral is a natural substance that has a definite chemical composition. We use minerals every day:</p><ul><li><b>Iron</b> is used to make steel for tools, bridges and machines.</li><li><b>Copper</b> is used for electric wires.</li><li><b>Coal</b> is a mineral fuel, formed from buried plants, and is burnt for energy.</li><li><b>Gold</b> is used to make jewellery.</li></ul><p>Rocks are used too. Stone is used to build houses and roads, and marble is used for beautiful buildings.</p><div class=\"nterm\">Mineral = a natural substance with a definite chemical composition. Rocks are made of minerals.</div>"
      },
      {
        "h": "Moving plates, earthquakes and volcanoes",
        "body": "<p>The crust is not one piece. It is broken into large slabs called <b>plates</b>, which move very slowly. When plates move, the surface can shake. This shaking is an <b>earthquake</b>.</p><ul><li>The <b>focus</b> is the place inside the crust where the movement starts.</li><li>The <b>epicentre</b> is the point on the surface directly above the focus. The shaking is felt first here.</li><li>The vibrations that spread out are <b>seismic waves</b>. A <b>seismograph</b> records them, and the <b>Richter scale</b> tells the magnitude (strength).</li></ul><p>Deep inside, rock can melt into hot <b>magma</b>. In a <b>volcano</b> it rises through a <b>vent</b> and comes out of the <b>crater</b> as <b>lava</b>. A volcano that erupts is <b>active</b>; one that is quiet but may erupt again is <b>dormant</b>.</p><div class=\"nterm\">Magma is molten rock below the surface; lava is molten rock that has come out onto the surface.</div>"
      }
    ],
    "recap": [
      "The Earth has a thin crust, a thick mantle and a core made mainly of nickel and iron, and it gets hotter with depth.",
      "Continental crust is sial (about 35 km thick); oceanic crust is sima (about 5 km thick).",
      "Igneous rocks form from cooled magma, sedimentary rocks from pressed sediments (with fossils), and metamorphic rocks from heat and pressure.",
      "In the rock cycle, rocks keep changing from one kind into another.",
      "Earthquakes have a focus and an epicentre and are recorded by a seismograph; magma becomes lava when it erupts from a volcano."
    ]
  },
  '7:on-equality': {
    "read": 7,
    "sections": [
      {
        "h": "What equality means in a democracy",
        "body": "<p>Every one of us wants to be treated as a person who matters. In a <b>democracy</b> this wish is a promise: every person is equal, whether rich or poor, man or woman, whatever their caste or religion. The people of India chose to be a democracy, and so the idea of <b>equality</b> stands at the centre of our Constitution.</p><p>Equality does not mean that everyone earns the same money or does the same job. It means that every person has the same rights and must be given the same respect.</p><div class=\"nterm\">Equality in a democracy: every person is of equal worth, has equal rights and deserves equal respect.</div>"
      },
      {
        "h": "One person, one vote",
        "body": "<p>The clearest sign of equality in India is the right to vote. Under <b>universal adult franchise</b>, every adult citizen can vote. The voting age is <b>18 years</b>. A person does not need to own land, pay tax, be educated or belong to a certain caste or religion.</p><p>Each person has <b>one vote</b>, and every vote has <b>equal value</b>. Think of a rich landowner and the labourer who works on his field. On election day both stand in the same queue, and both votes count the same.</p><div class=\"nterm\">Universal adult franchise: all adult citizens (18 or above) can vote, each has one vote, and every vote has equal value.</div>"
      },
      {
        "h": "Recognising dignity",
        "body": "<p>Equality also means <b>dignity</b>, the feeling of being respected and valued. Yet in daily life many people are denied it. Take a <b>domestic worker</b> who cleans, cooks and washes in other people's homes. She may be given tea in a separate cup, told to sit on the floor, or spoken to rudely. Her work is looked down upon, and so is she.</p><p>People also face unequal treatment because of their <b>caste, religion, gender</b> or <b>poverty</b>. Such unfair treatment is called <b>discrimination</b>. Dalits suffered <b>untouchability</b> for centuries. Girls are sometimes told that they need not study. Poor children leave school to earn money.</p><ul><li>Discrimination hurts a person's dignity.</li><li>Every person deserves respect, whatever their work or background.</li></ul>"
      },
      {
        "h": "The Constitution and the Right to Equality",
        "body": "<p>The Indian <b>Constitution</b> came into force on 26 January 1950. It lists <b>Fundamental Rights</b> that the Constitution guarantees, and the <b>Right to Equality</b> is one of them. Three Articles are the most important for us.</p><ul><li><b>Article 14:</b> all persons are equal before the law. The same law applies to everyone, rich or poor.</li><li><b>Article 15:</b> no discrimination on grounds of religion, race, caste, sex or place of birth. Everyone can use shops, restaurants, wells, roads and other public places.</li><li><b>Article 17:</b> untouchability is abolished, and practising it is a punishable offence.</li></ul><div class=\"nterm\">Article 14: equality before the law. Article 15: no discrimination. Article 17: untouchability abolished.</div><p>The Constitution was drafted by a committee headed by <b>Dr B. R. Ambedkar</b>.</p>"
      },
      {
        "h": "Inequality in everyday life",
        "body": "<p>Although the Constitution promises equality, it is not always found in real life. A rich child may study in a school with a library and computers, while a poor child studies in a broken building, or cannot go to school at all. A person using a wheelchair may find that a public building has only steps. A Dalit family may still be stopped from using a common well, even though this is against the law.</p><p>This shows an important truth: a law on paper is not enough. People must follow the law, and they must also change their attitudes and give up prejudice.</p>"
      },
      {
        "h": "How the government promotes equality",
        "body": "<p>A democratic government has the duty to work for equality. It does this in two main ways: by making <b>laws</b> and by running <b>schemes</b>.</p><ul><li><b>Laws:</b> laws against untouchability and discrimination, and the <b>Persons with Disabilities Act</b>, which aims to give people with disabilities equal rights and a fair chance to take part in society. Ramps in public buildings are one way to make this real.</li><li><b>Schemes:</b> the <b>mid-day meal scheme</b> gives a free cooked meal in government schools. Poor children who might otherwise stay hungry or stay at home can attend school and learn. Children also sit and eat together.</li></ul><div class=\"nterm\">The government promotes equality through laws and schemes that help those who are treated unequally.</div>"
      },
      {
        "h": "Struggles for equality",
        "body": "<p>Equality has rarely been given freely. Ordinary people have joined together to demand their rights, and to win dignity. <b>Dalit movements</b> have struggled against untouchability and for equal rights, and have asked for respect in everyday life. The <b>disability rights movement</b> has asked for equal access to schools, jobs and public places, and for a say in decisions that affect people with disabilities.</p><p>These movements helped to bring new laws and schemes. They also teach us that equality is something we must protect every day, by treating every person around us with respect.</p>"
      }
    ],
    "recap": [
      "In a democracy every person is equal and deserves equal respect and equal rights.",
      "Universal adult franchise means one person, one vote, at the age of 18, and every vote has equal value.",
      "Article 14 gives equality before the law, Article 15 forbids discrimination, and Article 17 abolishes untouchability.",
      "Inequality still exists in daily life, so laws must be followed and attitudes must change.",
      "The government uses laws and schemes like the mid-day meal scheme and the Persons with Disabilities Act, and people struggle together for dignity."
    ]
  },
  '7:markets-around-us': {
    "read": 8,
    "sections": [
      {
        "h": "What is a market?",
        "body": "<p>Every day we buy and sell things. A <b>market</b> is any place or arrangement where buyers and sellers meet to exchange goods and services. In a market, the buyer gives <b>money</b> and the seller gives goods or a service in return.</p><p>Markets come in many shapes. There are weekly markets, neighbourhood shops, hawkers, shopping complexes and big malls. Some are only a few stalls, and some are huge buildings. In all of them, people meet to buy and sell.</p><div class=\"nterm\">A market is where buyers and sellers meet to exchange goods and services for money.</div>"
      },
      {
        "h": "The weekly market",
        "body": "<p>A <b>weekly market</b> is held on one particular day of the week in a fixed place, such as a street or open ground. The <b>traders</b> there do not have permanent shops. They put up temporary stalls, sell their goods, and move to another market on the next day.</p><p>You can find a wide variety of things, from vegetables and fruits to clothes, utensils and toys. Prices are usually <b>low</b>. This is because the traders do not pay rent for a permanent shop and have fewer other costs, so they can sell cheaper.</p><p>Buyers often <b>bargain</b>. Bargaining means the buyer and the seller talk about the price until both agree. Many families with small incomes buy their weekly needs here, and buying local goods also helps local sellers earn a living.</p><div class=\"nterm\">Weekly market: held on a fixed day, no permanent shops, low prices, wide variety and bargaining.</div>"
      },
      {
        "h": "Neighbourhood shops, complexes and malls",
        "body": "<p>Near our homes there are <b>neighbourhood shops</b>. They are close by and open on most days, so we can buy daily needs like milk, bread, soap and a few eggs whenever we want. They sell goods in small quantities, and the shopkeeper often knows the customers well.</p><p>In towns and cities we also see <b>shopping complexes</b>. These have many permanent shops in one building or compound, selling different goods in the same place. A <b>mall</b> is a larger, often air-conditioned, multi-storey building with many shops on different floors.</p><p>Goods in malls are usually sold at <b>fixed prices</b>, and the prices are generally higher than in weekly markets. This is because the shops pay rent and other costs. Some customers still like malls for the comfort and the choice of brands.</p><div class=\"nterm\">Neighbourhood shop: near home, open most days. Mall: many shops, fixed prices, often higher prices.</div>"
      },
      {
        "h": "Hawkers",
        "body": "<p>A <b>hawker</b> is a seller who goes from street to street carrying goods on a cart, a cycle or even on the head. A hawker has no fixed shop. You may hear one calling out in your lane to sell vegetables, toys, bangles or utensils.</p><p>Hawkers are useful because they bring goods to people's <b>doorsteps</b>. Someone who lives far from the market need not travel to buy small things. Buyers can also bargain with hawkers, just as in a weekly market.</p>"
      },
      {
        "h": "Wholesale and retail traders",
        "body": "<p>Traders are of two kinds. A <b>wholesale trader</b> buys goods in large quantities from producers and sells them to other traders, not to ordinary families. A <b>retail trader</b> buys from wholesalers and sells goods in small quantities to <b>consumers</b>, the people who use the goods.</p><p>For example, a grocery shopkeeper buys sacks of rice and dal from a wholesale trader. She then sells one kilo or half a kilo at a time to the families in her colony. The neighbourhood shopkeeper, the vegetable seller in the weekly market and the hawker are all retail traders.</p><div class=\"nterm\">Wholesale trader: buys and sells in large lots to other traders. Retail trader: sells small quantities to consumers.</div>"
      },
      {
        "h": "The market chain",
        "body": "<p>Most things we buy reach us through a <b>market chain</b>, a series of buyers and sellers between the producer and the consumer. Think of a cotton shirt. A farmer grows the cotton and sells it to a trader. The cotton is then turned into yarn, cloth and finally a shirt, and the shirt is sold by a shop to the consumer.</p><p>For vegetables the chain is simpler: <b>farmer, trader, shopkeeper, consumer</b>. The people between the producer and the consumer are called <b>middlemen</b>. Each person in the chain pays the one before him and keeps something for his own work, so the price goes up at every step.</p><p>The chain shows how a market links people in many places. A farmer in a village and a buyer in a city never meet, yet they are joined by many sellers and buyers in between.</p><div class=\"nterm\">A market chain links the producer to the consumer through traders, and the price rises as the goods pass along it.</div>"
      },
      {
        "h": "Goods, services and money",
        "body": "<p>Markets sell <b>goods</b>, such as rice, shoes and books, which are things we can touch and own. They also offer <b>services</b>, such as a haircut, a doctor's check-up, tailoring or a bus ride. A service is work done for us.</p><p>In both cases, the exchange uses <b>money</b>. The buyer pays money and gets goods or a service. A seller earns money and uses it to buy other things from the market. In this way, a market connects many people who depend on each other.</p><div class=\"nterm\">Goods are things we can touch and own; services are work done for us. Both are bought with money.</div>"
      },
      {
        "h": "Markets, fairness and consumer awareness",
        "body": "<p>Not everyone gains equally from markets. In the cotton shirt chain, a small farmer or weaver who needs money quickly or owes money to a trader has little power to bargain and often gets a small share of the final price. A large trader with plenty of money and storage can buy in bulk, wait for a better price and earn much more.</p><p>This is why <b>rules</b> matter. Weights, quality and prices must be checked so that ordinary buyers and small sellers are not cheated. A fair market gives sellers a fair price and buyers honest goods.</p><p>As consumers we must also be <b>aware</b>. Read the label, check the <b>MRP</b>, which is the Maximum Retail Price and the highest price a seller can charge, and look at the expiry date. Ask for a bill, and compare prices before buying a costly item.</p><div class=\"nterm\">A fair market needs rules, and an aware consumer checks MRP, expiry date and bills.</div>"
      }
    ],
    "recap": [
      "A market is where buyers and sellers meet to exchange goods and services for money.",
      "Weekly markets have low prices because traders have no permanent shop to pay for, and buyers can bargain.",
      "Wholesale traders sell large lots to other traders, while retail traders and hawkers sell small quantities to consumers.",
      "In a market chain, goods pass from producer to trader to shopkeeper to consumer, and small producers often earn the least.",
      "Rules and aware consumers who check MRP, expiry date and bills help make markets fair."
    ]
  }
};

/* The same slug can name chapters in two classes (Class 6 and Class 7 both
   have "light-shadows"), so class-specific notes are keyed "<class>:<slug>"
   and win over a bare slug. */
function noteFor(){
  if(!LESSON.slug) return null;
  return NOTES[String(LESSON.cls).replace(/\D/g, '') + ':' + LESSON.slug] || NOTES[LESSON.slug] || null;
}

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
  var note = noteFor();
  var host = $('notesBody');
  // Uploaded notes can arrive after the student has left the lesson.
  if(!host) return;
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
    var hasStatic = !!noteFor();
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
    if(noteFor()){ notesTag.classList.add('is-live'); notesTagTxt.textContent = 'Notes ready'; }
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
    // The same lecture uploaded twice (a "▶" web copy next to its heavy
    // original) is one part, not two: keep one per title, the ▶ copy first.
    var byTitle = {};
    (videos || []).forEach(function(v){
      var key = String(v.title || '').replace(/▶/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
      var kept = byTitle[key];
      if (!kept || (/▶/.test(v.title || '') && !/▶/.test(kept.title || ''))) byTitle[key] = v;
    });
    videos = (videos || []).filter(function(v){
      var key = String(v.title || '').replace(/▶/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
      return byTitle[key] === v;
    });
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
      // A lecture exists but would not play: say that, not "nothing uploaded".
      var sub = document.getElementById('placeholderSub');
      if (sub) sub.textContent = 'This video could not be played right now. Check your connection and try again, or open it in Chrome.';
      if (window.HUB) window.HUB.setVideoState('none');
    });
  })
  .catch(function(){ if (window.HUB) window.HUB.setVideoState('none'); });
})();

}
