/* ============================================================
   BESTBRAIN — LOCAL PREVIEW SERVER  (scratchpad only)
   ------------------------------------------------------------
   Serves the real site straight from the repo WITHOUT modifying a
   single file. Each .html response is rewritten in memory to add
   preview-only scripts:

     session.js  — after <head>, before role-guard.js, so guarded
                   pages open without a login round-trip
     kid-bg.js   — the seamless animated background + dark tokens
     kid-ui.js   — glass design system, sidebar rail, top HUD
     kid-home.js — the premium homepage (index.html only)
     kid-auth.js — login/signup surface
     kid-call.js — the AI-tutor video-call skin

   It also answers /api/pal/tutor/stream itself: tutor.html's voice
   loop is on-device, but the TEXT goes to the server over SSE. The
   real backend needs prod CORS and a real JWT, so the demo brain
   below replies in exactly the frame format api.js parses.

   Stop the server and the site is byte-for-byte what git has.
   ============================================================ */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';

const HERE = path.dirname(new URL(import.meta.url).pathname);
/* The repo root is this file's parent — derived, never hard-coded, so a fresh
   clone serves its own checkout instead of somebody else's home directory. */
const ROOT = path.resolve(HERE, '..');
const PORT = 5500;
/* Loopback only. This server answers /api/auth/login for ANY email and
   password so the offline demo can sign in — harmless on a laptop, a wide
   open door on a host. Binding to 127.0.0.1 means that even if someone starts
   it on a server by mistake, nothing outside that machine can reach it. */
const HOST = '127.0.0.1';
const HOME = '/edulearn-frontend/index.html';

/* ------------------------------------------------------------------
   THE REAL BACKEND
   Everything under /api/ is forwarded to the actual server when it is
   running, so Learn, Videos, Lessons, Live, Quizzes and Arena work on
   real data instead of stubs. Forwarding (rather than pointing the
   frontend straight at :4000) keeps every call same-origin, so cookies
   and the refresh flow behave exactly as they do in production and CORS
   never enters the picture.

   When the backend is NOT running the demo brain below answers instead,
   so the preview still opens on a laptop with nothing else started.
   ------------------------------------------------------------------ */
const BACKEND = process.env.BESTBRAIN_BACKEND || 'http://localhost:4000';

let backendUp = false;
let probedAt = 0;

async function backendLive() {
  const now = Date.now();
  if (now - probedAt < 4000) return backendUp;   // don't probe on every asset
  probedAt = now;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 900);
    const r = await fetch(BACKEND + '/', { signal: ctl.signal });
    clearTimeout(timer);
    backendUp = r.status < 500;
  } catch {
    backendUp = false;
  }
  return backendUp;
}

const HOP_BY_HOP = new Set([
  'connection', 'keep-alive', 'transfer-encoding', 'upgrade',
  'proxy-authenticate', 'proxy-authorization', 'te', 'trailer',
  'content-encoding', 'content-length'
]);

async function readRaw(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}

/* Returns true when the call was handled upstream. A transport failure
   returns false so the caller can fall back to the demo answers. */
async function proxyApi(req, res) {
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (!HOP_BY_HOP.has(k) && k !== 'host') headers[k] = v;
  }
  const init = { method: req.method, headers, redirect: 'manual' };
  if (req.method !== 'GET' && req.method !== 'HEAD') init.body = await readRaw(req);

  let upstream;
  try {
    upstream = await fetch(BACKEND + req.url, init);
  } catch {
    backendUp = false;              // it died mid-session; demo takes over
    return false;
  }

  const out = {};
  upstream.headers.forEach((v, k) => { if (!HOP_BY_HOP.has(k)) out[k] = v; });
  const cookies = upstream.headers.getSetCookie ? upstream.headers.getSetCookie() : null;
  if (cookies && cookies.length) { delete out['set-cookie']; out['Set-Cookie'] = cookies; }

  res.writeHead(upstream.status, out);
  if (!upstream.body) { res.end(); return true; }
  /* piped, never buffered — the tutor replies over SSE and a buffered
     proxy would hold the whole answer back until the stream closed */
  Readable.fromWeb(upstream.body).pipe(res);
  return true;
}

/* The tutor gets its own proxy because it is the one call that can fail
   *after* it has started answering: the backend streams `event: error`
   with pal_not_configured when its AI credentials are missing, which is a
   200 response carrying a failure. So the first frame is read before any
   header is written — if it is an error, nothing has been committed yet and
   the on-device brain answers instead. A student asking a doubt gets an
   answer either way. */
async function proxyTutor(req, res, raw) {
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (!HOP_BY_HOP.has(k) && k !== 'host') headers[k] = v;
  }
  let upstream;
  try {
    upstream = await fetch(BACKEND + req.url, { method: 'POST', headers, body: raw });
  } catch {
    backendUp = false;
    return false;
  }
  if (!upstream.ok || !upstream.body) return false;

  const reader = upstream.body.getReader();
  let first;
  try { first = await reader.read(); } catch { return false; }
  const head = first.value ? Buffer.from(first.value).toString('utf8') : '';
  if (/event:\s*error/.test(head)) {
    console.log('  tutor .. backend could not answer — using the on-device brain');
    try { await reader.cancel(); } catch { /* already gone */ }
    return false;
  }

  const out = {};
  upstream.headers.forEach((v, k) => { if (!HOP_BY_HOP.has(k)) out[k] = v; });
  res.writeHead(upstream.status, out);
  if (first.value) res.write(Buffer.from(first.value));
  if (first.done) { res.end(); return true; }

  (async () => {
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
    } catch { /* client hung up */ }
    res.end();
  })();
  return true;
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.mp4': 'video/mp4', '.pdf': 'application/pdf'
};

/* boot.js must be the first thing the parser runs — it paints the canvas dark
   before the page's own stylesheets get a chance to flash white */
/* The very first bytes of <head>. `color-scheme` tells the browser to paint
   its own canvas dark for THIS document before a single stylesheet is parsed,
   which is what removes the white frame the browser shows between documents.
   The inline <style> follows for the same reason it is inline: an external
   file would still cost a round trip, and one slow round trip is exactly how
   long a white flash lasts. */
const HEAD_TAG =
  '\n<!-- preview only --><meta name="color-scheme" content="dark">' +
  '\n<!-- preview only --><style>' +
    'html{background:#050505!important;color-scheme:dark}' +
    'html body{background:#050505}' +
  '</style>' +
  '\n<!-- preview only --><script src="/__preview/boot.js"></script>' +
  '\n<!-- preview only --><script src="/__preview/session.js"></script>';
const BODY_TAG =
  '\n<!-- preview only --><script src="/__preview/kid-bg.js"></script>' +
  '\n<!-- preview only --><script src="/__preview/kid-ui.js"></script>' +
  '\n<!-- preview only --><script src="/__preview/kid-home.js"></script>' +
  '\n<!-- preview only --><script src="/__preview/kid-auth.js"></script>' +
  '\n<!-- preview only --><script src="/__preview/kid-call.js"></script>' +
  '\n<!-- preview only --><script src="/__preview/kid-quiz.js"></script>' +
  '\n<!-- preview only --><script src="/__preview/kid-content.js"></script>' +
  '\n<!-- preview only --><script src="/__preview/kid-pdf.js"></script>\n';

/* A debugging probe, opt-in via ?__probe=1 so ordinary browsing never sees it.
   It reports computed styles into <title>, which headless --dump-dom prints. */
const PROBE_TAG = '\n<!-- preview only --><script src="/__preview/probe.js"></script>\n';

function inject(html, probe, live) {
  let out = html;
  /* Tell the page whether a real backend is answering. session.js seeds a demo
     session only when it is NOT — against a live backend a fake token would be
     rejected on the first call, and every screen would look broken. */
  const flag = '\n<!-- preview only --><script>window.__PREVIEW_BACKEND_LIVE__=' +
    (live ? 'true' : 'false') + ';</script>';
  const head = out.match(/<head[^>]*>/i);
  out = head ? out.replace(head[0], head[0] + flag + HEAD_TAG) : flag + HEAD_TAG + out;
  const close = out.lastIndexOf('</body>');
  const tail = probe ? BODY_TAG + PROBE_TAG : BODY_TAG;
  return close === -1 ? out + tail : out.slice(0, close) + tail + out.slice(close);
}

/* ============================================================
   MOCK PAL BRAIN — class-6 answers written to be SPOKEN
   ============================================================ */
const BRAIN = [
  { k: ['metal', 'metals', 'धातु'],
    a: 'Metals! Look around your kitchen — the steel plate, the copper bottom of a pan, the aluminium foil. Metals are usually hard and shiny, and they have superpowers: electricity and heat pass through them easily, which is why wires are copper and pans are metal. Hit a metal with a hammer and it flattens into a sheet instead of breaking — that property is called being malleable. Iron, copper, aluminium, gold and silver are all metals. Compare that with wood or coal — dull, breaks easily, no electricity — those are non-metals!' },
  { k: ['non-metal', 'non metal', 'nonmetal', 'अधातु'],
    a: 'Non-metals are the opposite team! They are usually dull, not shiny, and they break into pieces if you hammer them, like coal or sulphur. Electricity and heat do not pass through them easily, which is actually useful — that is why electric wires are covered with plastic or rubber to keep you safe. And the amazing one: oxygen, which you breathe, and carbon, which your pencil lead is made of, are both non-metals. Life itself runs on non-metals!' },
  { k: ['photosynthesis', 'plants make', 'make their food', 'प्रकाश संश्लेषण'],
    a: 'Photosynthesis is how a plant cooks its own food, and the leaf is the kitchen. It takes water from the roots, carbon dioxide from the air, and energy from sunlight. The green colour, chlorophyll, catches that sunlight. Mixing all three, the leaf makes glucose — the plant food — and releases oxygen, the same oxygen you are breathing right now. So every breath you take, thank a leaf!' },
  { k: ['fraction', 'fractions', 'भिन्न'],
    a: 'Think of a chapati! Cut it into four equal pieces and eat three — you ate three by four. The bottom number says how many equal pieces the whole was cut into, the top number says how many you have. And remember, the bigger the bottom number, the smaller each piece. That is why half a chapati is more than one-eighth!' },
  { k: ['shadow', 'light travels', 'परछाई', 'छाया'],
    a: 'Light always travels in a straight line — it never bends around corners on its own. So when something solid blocks its path, the light cannot reach behind it, and that dark patch is your shadow. Try this tonight: hold a torch close to your hand and the shadow grows huge, move it away and it shrinks. That is the angle of the straight rays changing!' },
  { k: ['water cycle', 'evaporation', 'बारिश'],
    a: 'The water cycle is nature\'s recycling machine. The sun heats rivers and seas, and water rises as invisible vapour — evaporation. High up it cools into tiny droplets that make clouds — condensation. When the drops get heavy they fall as rain — precipitation. The rain fills the rivers, and it all restarts. The water you drank today might once have been a cloud over the sea!' },
  { k: ['gravity', 'गुरुत्व', 'why do things fall'],
    a: 'Gravity is an invisible pull that every big object has, and Earth is very big, so it pulls everything towards itself. That is why your ball always comes down instead of floating away. The Moon has about one-sixth of Earth\'s gravity, so there you could jump six times higher. Even now, gravity is politely holding you in your chair!' },
  { k: ['integer', 'integers', 'number line', 'negative number'],
    a: 'Integers are all the whole numbers — positive, negative and zero. Picture a number line: zero in the middle, positives marching right, negatives marching left. One golden rule — left is always smaller, right is always bigger. So minus five is smaller than minus two because it sits further left. Think of a lift: floors above ground are positive, the basements are negative!' },
  { k: ['magnet', 'magnets', 'चुंबक'],
    a: 'Magnets pull things made of iron, nickel and cobalt, but not plastic, wood, or even every metal. Every magnet has two poles, north and south. Opposite poles attract, same poles push away — bring two north poles together and feel them fight! And a hanging magnet always turns to point north-south, which is exactly how a compass helps sailors find their way.' },
  { k: ['electric', 'circuit', 'bulb glow', 'battery', 'current'],
    a: 'Electricity flows like water in a pipe, but it needs a complete loop called a circuit. Battery, wire, bulb, back to the battery — if the loop is complete, the bulb glows. Break it anywhere and it goes dark, which is exactly what a switch does. Electricity flows easily through copper, so wires are copper inside and rubber outside. Never poke anything into a socket — respect the current!' },
  { k: ['states of matter', 'solid', 'liquid and gas'],
    a: 'Everything around you is solid, liquid or gas. In a solid like ice, the tiny particles are packed tight and hold their shape. In a liquid like water they are looser, so it flows and takes the shape of the glass. In a gas like steam they fly around freely and fill the room. And the magic — the same water can be all three. Only the particle packing changes!' },
  { k: ['decimal', 'decimals', 'दशमलव'],
    a: 'Decimals are fractions wearing a different dress! The dot separates the whole from the part. Money is the easiest way to see it: one rupee fifty paise is one point five zero. That point five is half a rupee, which is the fraction one by two. After the dot, the first place is tenths, the second is hundredths. You have been doing decimals every time you count change!' },
  { k: ['separation', 'sieving', 'winnowing', 'filtration', 'handpicking'],
    a: 'How do you get stones out of rice? Separation methods! Handpicking — pick the big bits out. Sieving — shake through a jaali, small falls, big stays. Winnowing — let the wind blow the light husk away while heavy grain drops straight down. Filtration — pour through a cloth, water passes and tea leaves stay, exactly like a chai ki chhanni. Each method uses one difference: size, weight, or solubility.' },
  { k: ['air', 'atmosphere', 'हवा'],
    a: 'Air is all around you even though you cannot see it. It is a mixture — mostly nitrogen, then oxygen, plus a little carbon dioxide and water vapour. You breathe in the oxygen, plants take the carbon dioxide. Want proof air exists? Wave a book at your face — that push is air. An empty bottle is never really empty: flip it underwater and watch the bubbles escape!' },
  { k: ['fibre', 'fabric', 'cotton', 'wool comes from'],
    a: 'Your clothes have a journey behind them! Fibres are the thin threads everything starts from. Cotton comes from the fluffy boll on a plant, picked, cleaned and spun into yarn. Wool comes from a sheep\'s warm coat, cut like a haircut that grows back. Silk comes from a silkworm\'s cocoon. Then yarn is woven — over, under, over, under — into the fabric of your school uniform!' },
  { k: ['body movement', 'joints', 'skeleton', 'bones'],
    a: 'Your body bends because of joints, the places where two bones meet. The ball-and-socket joint in your shoulder spins your arm in a full circle. The hinge joint in your knee works like a door, only back and forth. The pivot joint in your neck lets you say no. Feel your elbow while you bend it — that is a hinge joint working. Without joints you would be as stiff as a statue!' },
  { k: ['earliest people', 'hunter', 'gatherer', 'stone age', 'cave'],
    a: 'The earliest people were hunter-gatherers — they hunted animals and gathered fruits, nuts and roots. Here is the interesting part: they never stayed in one place. They moved because animals moved, because plants ripen in different seasons, and because they needed water. They made sharp tools from stone and painted on cave walls — and those paintings still exist thousands of years later!' },
  { k: ['taro', 'waterfall'],
    a: 'Taro\'s Reward is a lovely story. Taro was a poor, hardworking woodcutter who loved his old parents. One cold day his father wished for something warm to drink, but Taro had no money. While working he found a magical waterfall that gave sake instead of water! Because Taro was honest and kind, the waterfall rewarded him. When greedy neighbours tried, they got only plain water. Kindness brings its own reward.' },
  { k: ['living', 'non-living', 'habitat', 'organisms'],
    a: 'What makes something alive? Living things eat, breathe, grow, move, respond and reproduce — and they need a home suited to them, called a habitat. A camel\'s wide feet are perfect for hot sand, a fish\'s gills pull breath from water. Now the tricky one: is a car alive? It moves and drinks petrol, but it cannot grow or make baby cars — so no. A seed looks dead, but plant it and it grows. Very much alive!' },
  { k: ['quiz me on motion', 'motion quiz', 'quiz on motion'],
    a: 'Quiz time! Question one: a car on a straight road shows which type of motion — straight line, circular, or periodic? Question two: what motion does a fan blade show? Question three: a swing goes to and fro again and again — what is that motion called? Think about them, then tell me your answers one by one and I will check!' },
  { k: ['hello', 'hi pal', 'namaste', 'नमस्ते', 'who are you'],
    a: 'Namaste! I am PAL, your AI study buddy from BestBrain. Ask me any doubt from your Class 6 books — maths, science, history, English, anything. Try asking: what are metals? Or, explain fractions with a chapati. I will explain it out loud, nice and simple. What shall we learn today?' }
];

const FALLBACK =
  'Interesting question! I am running in demo mode right now, so my full brain is not connected to the server. But I know plenty of Class 6 topics well — ask me: what are metals? Why do shadows form? Explain photosynthesis, fractions, decimals, magnets, electric circuits, the water cycle, states of matter, or the story of Taro\'s Reward — and I will explain it step by step!';
const FALLBACK_HI =
  'बहुत अच्छा सवाल! अभी मैं demo mode में हूँ, इसलिए मेरा पूरा दिमाग नहीं जुड़ा है। लेकिन आप मुझसे धातु, photosynthesis, भिन्न, परछाई, चुंबक या जल चक्र के बारे में पूछो — मैं अच्छे से समझाऊँगा!';

function tutorReply(message) {
  const m = String(message || '').toLowerCase();
  for (const item of BRAIN) if (item.k.some(k => m.includes(k))) return item.a;
  return /[ऀ-ॿ]/.test(m) ? FALLBACK_HI : FALLBACK;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function readJson(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  try { return JSON.parse(body || '{}'); } catch { return {}; }
}

async function serveTutorStream(req, res, preRead) {
  let body = preRead;
  if (body === undefined) {
    body = '';
    for await (const chunk of req) body += chunk;
  }
  let msg = '';
  try { msg = JSON.parse(body || '{}').message || ''; } catch { /* keep '' */ }
  console.log('  tutor <<', JSON.stringify(msg).slice(0, 90));

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
    'Connection': 'keep-alive'
  });

  const words = tutorReply(msg).split(' ');
  for (let i = 0; i < words.length; i += 3) {
    const text = (i ? ' ' : '') + words.slice(i, i + 3).join(' ');
    res.write('event: chunk\ndata: ' + JSON.stringify({ text }) + '\n\n');
    await sleep(45);
  }
  res.write('event: done\ndata: ' + JSON.stringify({ sessionId: 'demo-session' }) + '\n\n');
  res.end();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === '/' || pathname === '/index.html') {
    res.writeHead(302, { Location: HOME });
    return res.end();
  }

  if (pathname.startsWith('/api/')) {
    console.log(new Date().toISOString().slice(11, 19), req.method, pathname,
      'origin=' + (req.headers.origin || '-'));
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

    /* Real backend first. Only if it is not there — or dies mid-call — do the
       demo answers below take over, so a laptop with nothing else running
       still opens the preview. */
    const isTutor = pathname === '/api/pal/tutor/stream' && req.method === 'POST';
    if (await backendLive()) {
      if (isTutor) {
        const raw = await readRaw(req);
        if (await proxyTutor(req, res, raw)) return;
        return serveTutorStream(req, res, raw.toString('utf8'));
      }
      if (await proxyApi(req, res)) return;
    }
  }
  if (pathname === '/api/pal/tutor/stream' && req.method === 'POST') {
    return serveTutorStream(req, res);
  }

  /* ---- demo auth ----
     The sign-in form is real: it posts to /api/auth/login and redirects to the
     dashboard only when the call succeeds. With no backend behind the preview
     every attempt failed, so the demo answers it here. Any email and password
     are accepted — this is a local demo, there is nothing to authenticate
     against — and the reply is shaped exactly as api.js expects:
     { accessToken, user }. PUT/PATCH are allowed above so progress saves that
     the app fires after login do not surface as errors. */
  if (/^\/api\/auth\/(login|signup(\/[a-z]+)?|verify-otp|send-otp|refresh)$/.test(pathname)
      && req.method === 'POST') {
    return readJson(req).then((body) => {
      const role =
        (pathname.startsWith('/api/auth/signup/') && pathname.split('/').pop()) ||
        body.role || 'student';
      const cls = Number(body.class || body.studentClass || 6) || 6;
      const first = (body.firstName || '').trim();
      const last = (body.lastName || '').trim();
      const name = (first || last) ? (first + ' ' + last).trim()
        : role === 'teacher' ? 'Priya Sharma'
        : role === 'parent' ? 'Rakesh Bhatia'
        : 'Aarav Bhatia';

      if (pathname === '/api/auth/send-otp' || pathname === '/api/auth/verify-otp') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, verified: true, devCode: '123456' }));
      }

      const user = {
        id: 'preview-' + role,
        name,
        email: (body.email || 'aarav@bestbrain.local').trim(),
        role,
        class: cls,
        className: 'Class ' + cls,
        board: body.board || 'CBSE',
        emailVerified: true,
        phoneVerified: true,
      };
      console.log('           demo auth →', role, user.email);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ accessToken: 'preview-demo-token', user }));
    }).catch(() => {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Bad request' }));
    });
  }

  if (pathname.startsWith('/api/')) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Demo preview — backend not connected.', code: 'DEMO' }));
  }

  if (pathname.startsWith('/__preview/')) {
    try {
      const body = await readFile(path.join(HERE, path.basename(pathname)));
      res.writeHead(200, { 'Content-Type': MIME['.js'], 'Cache-Control': 'no-store' });
      return res.end(body);
    } catch {
      res.writeHead(404); return res.end('preview asset not found');
    }
  }

  const file = path.normalize(path.join(ROOT, pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('nope'); }

  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      res.writeHead(302, { Location: path.posix.join(pathname, 'index.html') });
      return res.end();
    }
    const ext = path.extname(file).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    if (ext === '.html') {
      const html = await readFile(file, 'utf8');
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      return res.end(inject(html, /__probe=1/.test(req.url || ''), await backendLive()));
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    return res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>404</h1><p>Not in the repo: ' + pathname + '</p>');
  }
});

server.listen(PORT, HOST, () => {
  console.log('preview  → http://localhost:' + PORT + '  (lands on the homepage)');
  console.log('serving  ← ' + ROOT + '  — files are never modified');
});
