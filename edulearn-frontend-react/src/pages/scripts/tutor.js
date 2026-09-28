/* Lifted verbatim from edulearn-frontend/tutor.html, do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {

(function(){
'use strict';

/* ============================================================
   LIVE DOUBT SESSION, voice call with PAL
   ------------------------------------------------------------
   Turn loop: listen (browser SpeechRecognition) → send the final
   transcript to /api/pal/tutor/stream (SSE) → speak the reply
   sentence-by-sentence AS CHUNKS ARRIVE (speechSynthesis), so the
   student hears the start of the answer within seconds → listen
   again. No audio ever leaves the device, only text goes to the
   server, which keeps the whole loop fast and free.
   ============================================================ */

var micBtn = document.getElementById('micBtn');
var endBtn = document.getElementById('endBtn');
var typeToggle = document.getElementById('typeToggle');
var typeBar = document.getElementById('typeBar');
var typeInput = document.getElementById('typeInput');
var statusText = document.getElementById('statusText');
var caption = document.getElementById('caption');
var micHint = document.getElementById('micHint');
var stage = document.getElementById('stage');
var tList = document.getElementById('tList');
var langSel = document.getElementById('langSel');

// role-guard already redirected logged-out users; this is belt-and-braces so
// EduAPI calls never run without a token (e.g. token wiped mid-session).
var user = EduAPI.requireAuth && EduAPI.requireAuth();
if (!user) return;

var LANG_KEY = 'edulearn_tutor_lang';
try { langSel.value = localStorage.getItem(LANG_KEY) || 'en-IN'; } catch(e){}
langSel.addEventListener('change', function(){
  try { localStorage.setItem(LANG_KEY, langSel.value); } catch(e){}
  cachedVoice = null; // re-pick a TTS voice for the new language
});

/* ---------- state machine ---------- */
// idle | listening | thinking | speaking
var state = 'idle';
var sessionId = null;    // backend ChatSession id (mode:"voice")
var aborter = null;      // AbortController for the in-flight stream
var recognition = null;  // active SpeechRecognition instance
var speakQueue = [];     // sentences waiting for TTS
var speaking = false;    // an utterance is currently playing
var streamDone = true;   // the SSE stream has finished
// Auto-listen again after PAL finishes, but only once the student has tapped
// the mic themselves, so a typed-only session never springs a mic prompt.
var handsFree = false;

function setState(next, label){
  state = next;
  stage.classList.remove('is-listening','is-thinking','is-speaking');
  if (next === 'listening') stage.classList.add('is-listening');
  if (next === 'thinking') stage.classList.add('is-thinking');
  if (next === 'speaking') stage.classList.add('is-speaking');
  if (label) statusText.textContent = label;
}

/* ---------- transcript pane ---------- */
function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function addTurn(who, text){
  var div = document.createElement('div');
  div.className = 'turn' + (who === 'user' ? ' turn--user' : '');
  div.innerHTML = '<span class="who">' + (who === 'user' ? 'You' : 'PAL') + '</span><span class="tx"></span>';
  div.querySelector('.tx').textContent = text || '';
  tList.appendChild(div);
  tList.scrollTop = tList.scrollHeight;
  return div.querySelector('.tx');
}

/* ---------- speech recognition (STT) ---------- */
var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SR) {
  // No STT in this browser (e.g. Firefox), fall back to typed questions;
  // PAL still answers OUT LOUD, so the call experience mostly survives.
  micBtn.disabled = true;
  typeBar.classList.add('is-open');
  micHint.textContent = 'Voice input is not supported in this browser, type your doubt below and PAL will still answer aloud. (Chrome or Edge enable full voice.)';
  statusText.textContent = 'Type your doubt below';
}

function startListening(){
  if (!SR || state === 'listening') return;
  stopSpeaking();          // never listen while TTS is playing (it hears itself)
  cancelStream();
  var rec = new SR();
  recognition = rec;
  rec.lang = langSel.value;
  rec.interimResults = true;
  rec.continuous = false;  // ends itself after a natural pause = end of turn
  var finalText = '';

  rec.onresult = function(ev){
    var interim = '';
    for (var i = ev.resultIndex; i < ev.results.length; i++) {
      var r = ev.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    caption.innerHTML = '<em>' + esc(finalText + interim) + '</em>';
  };
  rec.onerror = function(ev){
    if (rec !== recognition) return; // a stale instance, ignore
    if (ev.error === 'no-speech') return; // onend will restart the loop
    recognition = null;
    if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
      setState('idle', 'Microphone is blocked');
      caption.textContent = 'Allow microphone access for this site (padlock icon in the address bar), or type your doubt instead.';
      typeBar.classList.add('is-open');
    } else {
      setState('idle', 'Tap the mic and ask your doubt');
    }
  };
  rec.onend = function(){
    if (rec !== recognition) return; // superseded (interrupt / end call)
    recognition = null;
    var text = finalText.trim();
    if (text) { ask(text); return; }
    // Silence: quietly keep listening in hands-free mode, else go idle.
    if (state === 'listening') {
      if (handsFree) startListening();
      else setState('idle', 'Tap the mic and ask your doubt');
    }
  };

  try { rec.start(); } catch(e) { recognition = null; return; }
  setState('listening', 'Listening…');
  caption.textContent = 'Ask your doubt - I\'m listening.';
}

function stopListening(){
  if (recognition) {
    var rec = recognition;
    recognition = null;  // mark stale BEFORE abort so onend/onerror ignore it
    try { rec.abort(); } catch(e){}
  }
}

/* ---------- text-to-speech (TTS) ---------- */
var cachedVoice = null;
function pickVoice(){
  if (cachedVoice) return cachedVoice;
  var voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  if (!voices.length) return null;
  var lang = langSel.value; // 'en-IN' | 'hi-IN'
  function find(pred){ for (var i=0;i<voices.length;i++) if (pred(voices[i])) return voices[i]; return null; }
  cachedVoice =
    find(function(v){ return v.lang === lang && /Google/i.test(v.name); }) ||
    find(function(v){ return v.lang === lang; }) ||
    find(function(v){ return v.lang && v.lang.indexOf(lang.slice(0,2)) === 0; }) ||
    find(function(v){ return /en[-_](GB|US)/i.test(v.lang || ''); }) || null;
  return cachedVoice;
}
if (window.speechSynthesis && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = function(){ cachedVoice = null; };
}

function speakNext(){
  if (speaking || !speakQueue.length) { maybeFinishTurn(); return; }
  var sentence = speakQueue.shift();
  speaking = true;
  setState('speaking', 'PAL is answering… (tap mic to interrupt)');
  caption.textContent = sentence;
  var u = new SpeechSynthesisUtterance(sentence);
  var v = pickVoice();
  if (v) u.voice = v;
  u.lang = langSel.value;
  u.rate = 1.02;
  u.onend = u.onerror = function(){
    speaking = false;
    speakNext();
  };
  try { speechSynthesis.speak(u); }
  catch(e) { speaking = false; maybeFinishTurn(); }
}

function stopSpeaking(){
  speakQueue = [];
  speaking = false;
  try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch(e){}
}

// After the stream has ended AND the last utterance has played, the turn is
// over, hands-free mode flows straight back into listening.
function maybeFinishTurn(){
  if (!streamDone || speaking || speakQueue.length) return;
  if (state !== 'speaking' && state !== 'thinking') return;
  if (handsFree && SR) startListening();
  else setState('idle', 'Tap the mic for your next doubt');
}

/* ---------- sentence chunking ---------- */
// Feed streamed text in; emit complete sentences to the TTS queue as soon as
// they close ('.', '!', '?', or the Hindi danda '।'). This is what makes the
// answer AUDIBLE within seconds, sentence one plays while the model is still
// writing sentence three.
var pendingText = '';
function feedTts(text){
  pendingText += text;
  var m;
  while ((m = pendingText.match(/[\s\S]*?[.!?।](?=\s|$)/))) {
    var sentence = m[0];
    pendingText = pendingText.slice(sentence.length);
    queueSentence(sentence);
  }
}
function flushTts(){
  queueSentence(pendingText);
  pendingText = '';
}
function queueSentence(s){
  // Defensive cleanup: strip any markdown the model slipped in - TTS would
  // read "asterisk asterisk" otherwise.
  s = s.replace(/[*_#`]+/g, '').replace(/\s+/g, ' ').trim();
  if (!s) return;
  speakQueue.push(s);
  speakNext();
}

/* ---------- ask the backend ---------- */
function cancelStream(){
  if (aborter) { try { aborter.abort(); } catch(e){} aborter = null; }
  streamDone = true;
}

function ask(text, isRetry){
  stopListening();
  stopSpeaking();
  cancelStream();
  pendingText = '';

  if (!isRetry) addTurn('user', text);
  var palTx = addTurn('pal', '');
  var full = '';

  setState('thinking', 'PAL is thinking…');
  caption.textContent = '…';
  streamDone = false;
  aborter = (typeof AbortController !== 'undefined') ? new AbortController() : null;

  EduAPI.tutorStream(text, sessionId, {
    signal: aborter && aborter.signal,
    onChunk: function(piece){
      full += piece;
      palTx.textContent = full;
      tList.scrollTop = tList.scrollHeight;
      feedTts(piece);
    }
  }).then(function(res){
    if (res && res.sessionId) sessionId = res.sessionId;
    streamDone = true;
    flushTts();
    if (!full) palTx.textContent = '(no reply)';
    // If TTS already drained the queue before the stream closed, nothing else
    // will advance the turn, check here too (no-op while speech is playing).
    maybeFinishTurn();
  }).catch(function(err){
    streamDone = true;
    if (err && err.name === 'AbortError') return; // interrupted on purpose
    // A stale sessionId (deleted elsewhere) 404s forever, drop it and retry
    // once as a fresh session, same recovery as the PAL chat page.
    if (err && err.status === 404 && sessionId && !isRetry) {
      sessionId = null;
      var deadTurn = palTx.parentNode; // the empty PAL bubble from this attempt
      if (deadTurn && deadTurn.parentNode) deadTurn.parentNode.removeChild(deadTurn);
      ask(text, true);
      return;
    }
    var msg = (err && err.code === 'pal_not_configured')
      ? 'PAL’s AI service is not set up on the server right now. This needs an admin to fix, please report it.'
      : (err && err.status === 429)
        ? 'You’re asking very fast! Give PAL a few seconds, then ask again.'
        : 'Sorry, I could not reach PAL just now. Please check your connection and try again.';
    palTx.textContent = msg;
    setState('idle', 'Something went wrong');
    caption.textContent = msg;
  });
}

/* ---------- controls ---------- */
micBtn.addEventListener('click', function(){
  if (state === 'listening') {
    // Tap while listening = pause the call.
    stopListening();
    handsFree = false;
    setState('idle', 'Paused, tap the mic to continue');
    return;
  }
  // Tap while speaking/thinking = interrupt and ask something new.
  handsFree = true;
  startListening();
});

endBtn.addEventListener('click', function(){
  stopListening();
  stopSpeaking();
  cancelStream();
  window.location.href = 'pal.html';
});

typeToggle.addEventListener('click', function(){
  typeBar.classList.toggle('is-open');
  if (typeBar.classList.contains('is-open')) typeInput.focus();
});

typeBar.addEventListener('submit', function(ev){
  ev.preventDefault();
  var text = (typeInput.value || '').trim();
  if (!text) return;
  typeInput.value = '';
  ask(text);
});

// Leaving the page must never leave TTS talking to an empty room.
function teardown(){
  stopSpeaking();
  cancelStream();
  stopListening();
}
window.addEventListener('beforeunload', teardown);
// In the SPA this script runs inside pageScriptEnv, which passes onCleanup
// for route-change teardown (beforeunload never fires there). On the static
// site the identifier doesn't exist, typeof keeps that safe.
if (typeof onCleanup === 'function') onCleanup(teardown);
})();

}
