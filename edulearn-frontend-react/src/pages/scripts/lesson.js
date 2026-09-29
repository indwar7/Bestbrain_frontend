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
