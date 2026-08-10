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
