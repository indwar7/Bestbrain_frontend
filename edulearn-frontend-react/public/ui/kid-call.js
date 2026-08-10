/* ============================================================
   BESTBRAIN — AMBER OS · AI TUTOR CALL SKIN
   ------------------------------------------------------------
   Local preview only. tutor.html already runs the whole doubt loop
   (SpeechRecognition in, SSE out, speechSynthesis back). This layer
   only makes it FEEL like a live video call: a webcam self-view, a
   call timer, and a presenter lower-third for PAL.

   It reads the page's existing state classes (is-listening /
   is-speaking) rather than hooking its logic, so the call itself
   keeps working untouched.
   ============================================================ */
(function () {
  'use strict';

  var last = (location.pathname.split('/').pop() || '').toLowerCase();
  if (last.replace(/\.html$/, '') !== 'tutor') return;

  var CSS =
  '#kc-self{position:absolute;top:16px;right:16px;z-index:30;width:184px;aspect-ratio:4/3;' +
    'border-radius:18px;overflow:hidden;background:#141010;' +
    'border:1px solid rgba(255,122,0,.45);' +
    'box-shadow:0 16px 42px rgba(0,0,0,.6),0 0 26px rgba(255,122,0,.25);}' +
  '#kc-self video{width:100%;height:100%;object-fit:cover;display:block;transform:scaleX(-1);}' +
  '#kc-self .fb{position:absolute;inset:0;display:grid;place-items:center;font-weight:900;font-size:34px;' +
    'color:#FFD8AE;background:linear-gradient(135deg,#2A1B0A,#4A2A08);}' +
  '#kc-self .tag{position:absolute;left:9px;bottom:9px;padding:3px 10px;border-radius:8px;' +
    'background:rgba(5,5,5,.72);backdrop-filter:blur(6px);font-size:11px;font-weight:800;color:#fff;}' +
  '#kc-self .mic{position:absolute;right:9px;bottom:9px;width:22px;height:22px;border-radius:50%;' +
    'display:grid;place-items:center;background:rgba(5,5,5,.72);}' +
  '#kc-self .mic i{width:8px;height:8px;border-radius:50%;background:#6B6B6B;transition:background .3s ease;}' +
  '#kc-self.live .mic i{background:#FF4D4D;box-shadow:0 0 10px #FF4D4D;animation:kc-p 1.4s ease-in-out infinite;}' +
  '@keyframes kc-p{0%,100%{transform:scale(1)}50%{transform:scale(1.35)}}' +

  '#kc-hud{position:absolute;top:16px;left:16px;z-index:30;display:flex;gap:8px;align-items:center;}' +
  '#kc-hud .chip{display:inline-flex;align-items:center;gap:7px;padding:7px 14px;border-radius:99px;' +
    'background:rgba(255,255,255,.08);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);' +
    'border:1px solid rgba(255,255,255,.15);font-size:11.5px;font-weight:800;letter-spacing:.06em;color:#fff;' +
    'font-variant-numeric:tabular-nums;}' +
  '#kc-hud .dot{width:8px;height:8px;border-radius:50%;background:#FF4D4D;box-shadow:0 0 10px #FF4D4D;' +
    'animation:kc-p 1.6s ease-in-out infinite;}' +

  '#kc-name{position:absolute;left:16px;bottom:16px;z-index:30;display:flex;align-items:center;gap:11px;' +
    'padding:9px 17px 9px 10px;border-radius:16px;background:rgba(255,255,255,.08);' +
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);' +
    'border:1px solid rgba(255,179,71,.35);}' +
  '#kc-name .av{width:31px;height:31px;border-radius:11px;display:grid;place-items:center;font-size:16px;' +
    'background:linear-gradient(135deg,#FF7A00,#FFB347);}' +
  '#kc-name b{display:block;font-size:13px;font-weight:800;color:#fff;line-height:1.2;}' +
  '#kc-name span{font-size:10.5px;font-weight:700;color:rgba(255,255,255,.6);}' +
  '#kc-name .eqz{display:flex;align-items:flex-end;gap:2.5px;height:15px;margin-left:6px;}' +
  '#kc-name .eqz i{width:3px;border-radius:2px;background:#FFB347;height:4px;}' +
  '.kc-talking #kc-name .eqz i{animation:kc-eq .7s ease-in-out infinite alternate;}' +
  '#kc-name .eqz i:nth-child(2){animation-delay:.15s}#kc-name .eqz i:nth-child(3){animation-delay:.3s}' +
  '#kc-name .eqz i:nth-child(4){animation-delay:.1s}' +
  '@keyframes kc-eq{from{height:3px}to{height:15px}}' +
  '@media(max-width:760px){#kc-self{width:112px;top:10px;right:10px}#kc-name span{display:none}}' +
  '@media(prefers-reduced-motion:reduce){#kc-self.live .mic i,#kc-hud .dot,.kc-talking #kc-name .eqz i{animation:none!important}}';

  function build() {
    var stage = document.getElementById('stage');
    if (!stage || document.getElementById('kc-self')) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    if (getComputedStyle(stage).position === 'static') stage.style.position = 'relative';

    var hud = document.createElement('div');
    hud.id = 'kc-hud';
    hud.innerHTML = '<span class="chip"><span class="dot"></span>LIVE</span>' +
                    '<span class="chip" id="kc-timer">00:00</span>';
    stage.appendChild(hud);

    var name = document.createElement('div');
    name.id = 'kc-name';
    name.innerHTML = '<span class="av">🤖</span>' +
      '<span><b>PAL — AI Tutor</b><span>Class 6 · Science &amp; Maths doubts</span></span>' +
      '<span class="eqz"><i></i><i></i><i></i><i></i></span>';
    stage.appendChild(name);

    var self = document.createElement('div');
    self.id = 'kc-self';
    self.innerHTML = '<div class="fb">A</div><span class="tag">You</span><span class="mic"><i></i></span>';
    stage.appendChild(self);

    var fb = self.querySelector('.fb');
    try {
      var u = JSON.parse(localStorage.getItem('edulearn_user') || 'null');
      if (u && u.name) fb.textContent = String(u.name).trim().charAt(0).toUpperCase();
    } catch (e) { /* keep A */ }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 480 }, audio: false })
        .then(function (stream) {
          var v = document.createElement('video');
          v.autoplay = true; v.muted = true; v.playsInline = true;
          v.srcObject = stream;
          self.insertBefore(v, fb);
          fb.style.display = 'none';
          window.addEventListener('beforeunload', function () {
            stream.getTracks().forEach(function (t) { t.stop(); });
          });
        })
        .catch(function () { /* camera declined — the initials tile stays */ });
    }

    var t0 = Date.now(), timer = document.getElementById('kc-timer');
    setInterval(function () {
      var s = Math.floor((Date.now() - t0) / 1000);
      timer.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }, 1000);

    /* mirror the page's own state — equaliser while PAL talks, red mic dot
       while the student's mic is hot */
    setInterval(function () {
      document.documentElement.classList.toggle('kc-talking', stage.classList.contains('is-speaking'));
      self.classList.toggle('live', stage.classList.contains('is-listening'));
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

/* ============================================================
   AI TUTOR — CHAT ALONGSIDE THE CALL
   ------------------------------------------------------------
   The call answers out loud, which is the point of it — and the
   wrong tool when a student is in a quiet room, wants to paste a
   question, or needs the answer to stay on screen while they copy
   it into a notebook. The right-hand column gets a real one-to-one
   chat that talks to the same tutor endpoint the call uses, so
   both are the same PAL with the same syllabus, differing only in
   how the answer arrives.

   It streams. A tutor that thinks for six seconds and then dumps a
   paragraph feels broken; one that starts answering immediately
   feels like a person.
   ============================================================ */
(function () {
  'use strict';

  var page = (location.pathname.split('/').pop() || '').toLowerCase().replace(/\.html$/, '');
  if (page !== 'tutor') return;

  function api() {
    try {
      if (window.EduAPI && window.EduAPI.API_BASE) return window.EduAPI.API_BASE;
    } catch (e) {}
    try {
      var o = localStorage.getItem('edulearn_api');
      if (o) return o.replace(/\/+$/, '');
    } catch (e) {}
    return location.origin;
  }
  function token() {
    try { return localStorage.getItem('edulearn_token') || ''; } catch (e) { return ''; }
  }

  var CSS =
  '#kx{display:flex;flex-direction:column;gap:10px;margin-top:16px;min-height:0;flex:1;}' +
  '#kx-hd{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:900;' +
    'letter-spacing:.12em;text-transform:uppercase;' +
    'color:#FFC98A!important;-webkit-text-fill-color:#FFC98A!important;}' +
  '#kx-hd .d{width:7px;height:7px;border-radius:50%;background:#34D399;box-shadow:0 0 10px #34D399;}' +
  '#kx-log{flex:1;min-height:120px;max-height:46vh;overflow:auto;display:flex;flex-direction:column;' +
    'gap:10px;padding:4px 2px;}' +
  '.kx-msg{max-width:92%;padding:11px 14px;border-radius:16px;font-size:13.5px;line-height:1.6;' +
    'white-space:pre-wrap;word-break:break-word;' +
    'animation:kx-in .28s cubic-bezier(.22,1,.36,1);}' +
  '@keyframes kx-in{from{opacity:0;transform:translateY(6px)}}' +
  '.kx-msg.me{align-self:flex-end;background:linear-gradient(120deg,#FF7A00,#FFA726);' +
    'border-radius:16px 16px 5px 16px;' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;font-weight:700;}' +
  '.kx-msg.pal{align-self:flex-start;background:rgba(255,255,255,.07);' +
    'border:1px solid rgba(255,255,255,.13);border-radius:16px 16px 16px 5px;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;}' +
  '.kx-msg.pal.think::after{content:"";display:inline-block;width:6px;height:6px;margin-left:4px;' +
    'border-radius:50%;background:#FFB347;animation:kx-blink 1s ease-in-out infinite;}' +
  '@keyframes kx-blink{0%,100%{opacity:1}50%{opacity:.2}}' +
  '#kx-form{display:flex;gap:8px;align-items:flex-end;}' +
  '#kx-in{flex:1;resize:none;max-height:110px;padding:12px 14px;border-radius:14px;' +
    'font-family:inherit;font-size:14px;line-height:1.5;' +
    'background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.16)!important;' +
    'color:#fff!important;-webkit-text-fill-color:#fff!important;outline:none;' +
    'transition:border-color .22s ease,box-shadow .22s ease;}' +
  '#kx-in:focus{border-color:rgba(255,150,60,.75)!important;box-shadow:0 0 0 4px rgba(255,122,0,.16);}' +
  '#kx-in::placeholder{color:rgba(255,255,255,.5)!important;' +
    '-webkit-text-fill-color:rgba(255,255,255,.5)!important;}' +
  '#kx-send{width:46px;height:46px;flex:none;border:0;border-radius:14px;cursor:pointer;' +
    'display:grid;place-items:center;background:linear-gradient(120deg,#FF7A00,#FFA726);' +
    'box-shadow:0 10px 24px rgba(255,122,0,.4);' +
    'transition:transform .22s cubic-bezier(.22,1,.36,1),opacity .2s ease;}' +
  '#kx-send:hover:not(:disabled){transform:translateY(-2px);}' +
  '#kx-send:disabled{opacity:.5;cursor:default;}' +
  '#kx-send svg{width:18px;height:18px;color:#0A0A0A;}' +
  '#kx-hint{font-size:11.5px;' +
    'color:rgba(255,255,255,.6)!important;-webkit-text-fill-color:rgba(255,255,255,.6)!important;}';

  function style() {
    if (document.getElementById('kx-css')) return;
    var s = document.createElement('style');
    s.id = 'kx-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var log, input, send, sessionId = null, busy = false;

  function bubble(who, text) {
    var b = document.createElement('div');
    b.className = 'kx-msg ' + who;
    b.textContent = text;              // model output stays text, always
    log.appendChild(b);
    log.scrollTop = log.scrollHeight;
    return b;
  }

  function ask(q) {
    if (busy || !q.trim()) return;
    busy = true;
    send.disabled = true;
    bubble('me', q.trim());
    input.value = '';
    input.style.height = '';

    var reply = bubble('pal', '');
    reply.classList.add('think');

    var body = sessionId ? { message: q, sessionId: sessionId } : { message: q };

    fetch(api() + '/api/pal/tutor/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token() },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok || !res.body) throw new Error('no stream');
      var reader = res.body.getReader();
      var dec = new TextDecoder();
      var buf = '';

      /* The reply arrives as SSE frames. Render each chunk as it lands rather
         than waiting for the stream to close — a tutor that pauses and then
         dumps a paragraph reads as broken. */
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) return;
          buf += dec.decode(r.value, { stream: true });
          var frames = buf.split('\n\n');
          buf = frames.pop();
          frames.forEach(function (f) {
            var ev = (f.match(/event:\s*(\w+)/) || [])[1];
            var dm = f.match(/data:\s*(.+)/);
            if (!dm) return;
            var data;
            try { data = JSON.parse(dm[1]); } catch (e) { return; }
            if (ev === 'chunk' && data.text) {
              reply.classList.remove('think');
              reply.textContent += data.text;
              log.scrollTop = log.scrollHeight;
            } else if (ev === 'done') {
              if (data.sessionId) sessionId = data.sessionId;
            } else if (ev === 'error') {
              reply.classList.remove('think');
              reply.textContent = data.error || 'PAL could not answer that just now.';
            }
          });
          return pump();
        });
      }
      return pump();
    }).catch(function () {
      reply.classList.remove('think');
      if (!reply.textContent) reply.textContent = 'Could not reach PAL. Check your connection and try again.';
    }).then(function () {
      reply.classList.remove('think');
      if (!reply.textContent) reply.textContent = 'PAL had nothing to say — try asking it another way.';
      busy = false;
      send.disabled = false;
      input.focus();
    });
  }

  function build() {
    if (document.getElementById('kx')) return;
    /* the transcript column is the natural home: same subject, same session */
    var host = document.querySelector('.transcript') ||
               document.querySelector('.tr-panel,.side,aside');
    if (!host) return;

    style();

    var wrap = document.createElement('div');
    wrap.id = 'kx';
    wrap.innerHTML =
      '<div id="kx-hd"><span class="d"></span>Ask by chat</div>' +
      '<div id="kx-log"></div>' +
      '<form id="kx-form">' +
        '<textarea id="kx-in" rows="1" placeholder="Type your doubt…"></textarea>' +
        '<button id="kx-send" type="submit" aria-label="Send">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
          'stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>' +
        '</button>' +
      '</form>' +
      '<div id="kx-hint">Enter to send · Shift + Enter for a new line</div>';
    host.appendChild(wrap);

    log = wrap.querySelector('#kx-log');
    input = wrap.querySelector('#kx-in');
    send = wrap.querySelector('#kx-send');

    bubble('pal', 'Type a doubt and I will answer here. Prefer to talk? Tap the mic.');

    wrap.querySelector('#kx-form').addEventListener('submit', function (e) {
      e.preventDefault();
      ask(input.value);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input.value); }
    });
    input.addEventListener('input', function () {
      input.style.height = 'auto';
      input.style.height = Math.min(110, input.scrollHeight) + 'px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(build, 400); });
  } else {
    setTimeout(build, 400);
  }
  setTimeout(build, 1500);   // the panel is rendered by the page's own script
})();
