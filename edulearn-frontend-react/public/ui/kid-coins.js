/* ============================================================
   BestBrain coin store.
   window.KidCoins.open() shows the student's balance, the three packs on
   sale (paid through Razorpay Checkout) and the free ways to earn coins.
   Anything with [data-buy-coins] opens it, as does the coins chip in the
   top bar. The server credits coins only after it has verified the payment.
   ============================================================ */
(function () {
  'use strict';
  if (window.KidCoins) return;

  var CSS =
  '#kc-wrap{position:fixed;inset:0;z-index:100001;display:flex;align-items:center;justify-content:center;padding:18px;' +
    'background:rgba(0,0,0,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:Nunito,system-ui,sans-serif;}' +
  '#kc-box{position:relative;width:100%;max-width:520px;max-height:92vh;overflow:auto;padding:26px 22px 22px;border-radius:22px;' +
    'background:#15110C!important;border:1px solid rgba(255,179,71,.35);box-shadow:0 24px 70px rgba(0,0,0,.6);}' +
  '#kc-box *{color:#FFFFFF;-webkit-text-fill-color:#FFFFFF;}' +
  '#kc-box h2{margin:0 0 4px;font-family:Fraunces,serif;font-size:26px;font-weight:600;}' +
  '#kc-box .kc-bal{font-size:15px;opacity:.85;margin-bottom:18px;}' +
  '#kc-box .kc-bal b{color:#FFC400!important;-webkit-text-fill-color:#FFC400!important;font-size:18px;}' +
  '#kc-close{position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:50%;cursor:pointer;font-size:20px;line-height:1;' +
    'background:rgba(255,255,255,.08)!important;border:1px solid rgba(255,255,255,.2)!important;}' +
  '.kc-packs{display:grid;gap:10px;margin-bottom:18px;}' +
  '.kc-pack{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;' +
    'background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.16)!important;}' +
  '.kc-pack.best{border-color:#FFC400!important;}' +
  '.kc-pack .c{flex:1;font-size:18px;font-weight:900;}' +
  '.kc-pack .c small{display:block;font-size:12px;font-weight:700;opacity:.7;margin-top:2px;}' +
  '.kc-buy{flex:none;min-width:96px;height:42px;padding:0 16px;border-radius:999px;cursor:pointer;font-family:inherit;font-size:16px;font-weight:900;' +
    'background:linear-gradient(120deg,#FFC400,#FFDD3C)!important;border:2px solid #0A0A0A!important;' +
    'color:#0A0A0A!important;-webkit-text-fill-color:#0A0A0A!important;}' +
  '.kc-buy:disabled{opacity:.55;cursor:default;}' +
  '.kc-msg{min-height:1.2em;margin:0 0 14px;font-size:14px;font-weight:700;}' +
  '.kc-msg.ok{color:#34D399!important;-webkit-text-fill-color:#34D399!important;}' +
  '.kc-msg.err{color:#FCA5A5!important;-webkit-text-fill-color:#FCA5A5!important;}' +
  '.kc-earn{padding:14px 16px;border-radius:16px;background:rgba(255,179,71,.1)!important;border:1px solid rgba(255,179,71,.3)!important;font-size:14px;line-height:1.7;}' +
  '.kc-earn b{color:#FFB347!important;-webkit-text-fill-color:#FFB347!important;}' +
  '.kc-use{margin-top:12px;font-size:13px;opacity:.75;}' +
  '.kc-plan{margin-top:12px;padding:12px 14px;border-radius:14px;font-size:14px;background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.16)!important;}' +
  '.kc-plan:empty{display:none;}' +
  '.kc-plan b{color:#FFC400!important;-webkit-text-fill-color:#FFC400!important;}' +
  '#kid-hud-coins{cursor:pointer;}';

  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstChild; }
  function api() { return window.EduAPI; }

  function setBalance(n) {
    var b = document.getElementById('kc-balance');
    if (b) b.textContent = n;
    var chip = document.getElementById('kid-hud-coins');
    if (chip) chip.textContent = '⭐ ' + n + ' coins';
  }

  var checkoutLoading = null;
  function loadCheckout() {
    if (window.Razorpay) return Promise.resolve();
    if (checkoutLoading) return checkoutLoading;
    checkoutLoading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = function () { resolve(); };
      s.onerror = function () { checkoutLoading = null; reject(new Error('Could not load the payment window.')); };
      document.head.appendChild(s);
    });
    return checkoutLoading;
  }

  function close() {
    var w = document.getElementById('kc-wrap');
    if (w) w.remove();
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  function open() {
    if (!api()) return;
    close();
    if (!document.getElementById('kc-css')) {
      var st = document.createElement('style'); st.id = 'kc-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    var wrap = el(
      '<div id="kc-wrap" role="dialog" aria-modal="true" aria-labelledby="kc-title"><div id="kc-box">' +
        '<button id="kc-close" type="button" aria-label="Close">×</button>' +
        '<h2 id="kc-title">Your coins</h2>' +
        '<div class="kc-bal">You have <b id="kc-balance">…</b> coins</div>' +
        '<div class="kc-packs" id="kc-packs"></div>' +
        '<p class="kc-msg" id="kc-msg" role="status"></p>' +
        '<div class="kc-earn"><b>Earn free coins in the Arena</b><br>' +
          '+5 for playing each day · +5 for a right answer · +20 for finishing in the top 3 of the hour</div>' +
        '<div class="kc-use">Coins are for the AI features: each PAL answer and each AI Tutor answer uses 3. Lectures, notes, quizzes and homework are free.</div>' +
        '<div class="kc-plan" id="kc-plan"></div>' +
      '</div></div>');
    document.body.appendChild(wrap);
    document.addEventListener('keydown', onKey);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.getElementById('kc-close').addEventListener('click', close);

    var msg = document.getElementById('kc-msg');
    function say(text, kind) { msg.textContent = text; msg.className = 'kc-msg' + (kind ? ' ' + kind : ''); }

    api().getCoinBalance().then(function (r) { setBalance(r.balance); }).catch(function () {});
    if (api().getSubscriptionConfig) api().getSubscriptionConfig().then(function (c) {
      var plan = document.getElementById('kc-plan');
      if (!plan || !c || !c.price) return;
      plan.innerHTML = '<b>BestBrain Plus</b> · ₹' + c.price + '/month · ' + (c.monthlyCoins || c.price) +
        ' coins every month' + (c.checkoutEnabled ? '' : ' · <i>coming soon</i>');
    }).catch(function () {});
    api().getCoinPacks().then(function (r) {
      var host = document.getElementById('kc-packs');
      if (!host) return;
      // Buying is switched off for now: no packs, just the free ways to earn.
      if (!r.enabled || !r.packs.length) { host.remove(); return; }
      host.innerHTML = r.packs.map(function (p, i) {
        return '<div class="kc-pack' + (i === r.packs.length - 1 ? ' best' : '') + '">' +
          '<span class="c">' + p.coins + ' coins<small>' + p.label + '</small></span>' +
          '<button class="kc-buy" type="button" data-pack="' + p.id + '">₹' + p.price + '</button></div>';
      }).join('');
      Array.prototype.forEach.call(host.querySelectorAll('.kc-buy'), function (b) {
        b.disabled = !r.enabled;
        b.addEventListener('click', function () { buy(b.getAttribute('data-pack'), b); });
      });
    }).catch(function () { say('Could not load the coin packs. Check your connection.', 'err'); });

    function buy(packId, btn) {
      var buttons = document.querySelectorAll('#kc-packs .kc-buy');
      var label = btn.textContent;
      var busy = function (on) {
        Array.prototype.forEach.call(buttons, function (x) { x.disabled = on; });
        btn.textContent = on ? 'Wait…' : label;
      };
      busy(true);
      say('');
      Promise.all([api().createCoinOrder(packId), loadCheckout()]).then(function (res) {
        var o = res[0];
        var rz = new window.Razorpay({
          key: o.keyId,
          order_id: o.orderId,
          amount: o.amount,
          currency: o.currency,
          name: o.name,
          description: o.description,
          prefill: o.prefill,
          theme: { color: '#FF7A00' },
          handler: function (p) {
            say('Confirming your payment…');
            api().verifyCoinPayment(p.razorpay_order_id, p.razorpay_payment_id, p.razorpay_signature)
              .then(function (v) {
                setBalance(v.balance);
                say('Payment done. ' + v.coins + ' coins added.', 'ok');
                busy(false);
              })
              .catch(function () {
                say('Payment received. Your coins will appear in a minute.', 'ok');
                busy(false);
              });
          },
          modal: { ondismiss: function () { busy(false); } }
        });
        rz.on('payment.failed', function (r) {
          say((r && r.error && r.error.description) || 'Payment failed. No money was taken.', 'err');
          busy(false);
        });
        rz.open();
      }).catch(function (e) {
        say((e && e.message) || 'Could not start the payment.', 'err');
        busy(false);
      });
    }
  }

  // The coins chip in the top bar, and any [data-buy-coins] link or button.
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('#kid-hud-coins, [data-buy-coins]');
    if (!t) return;
    var u = null;
    try { u = JSON.parse(localStorage.getItem('edulearn_user') || 'null'); } catch (err) {}
    if (!u || u.role !== 'student') return;
    e.preventDefault();
    open();
  });

  window.KidCoins = { open: open, close: close };
  window.addEventListener('edulearn:pageleave', close);
})();
