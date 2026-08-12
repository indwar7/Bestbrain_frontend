/* Lifted verbatim from edulearn-frontend/login.html — do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {

    (function(){try{var t=localStorage.getItem('edulearn_token');var u=localStorage.getItem('edulearn_user');if(t&&u&&JSON.parse(u)){location.replace('dashboard.html');return;}}catch(e){}})();
  

/* ---- next <script> block ---- */

try{if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.add('light-mode');}localStorage.setItem('edulearn-theme','light');}catch(e){if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.add('light-mode');}}

/* ---- next <script> block ---- */


    // Already signed in (e.g. arrived here via a stale bookmark or the logo
    // fallback) — skip the login form entirely instead of asking to re-enter
    // credentials for a session that's still valid.
    if (window.EduAPI && EduAPI.getUser()) {
      location.replace('dashboard.html');
    }

    var selectedRole = 'student';

    // Show/hide password toggle.
    (function () {
      var toggle = document.getElementById('pwToggle');
      var input = document.getElementById('password');
      if (!toggle || !input) return;
      toggle.addEventListener('click', function () {
        var shown = input.type === 'text';
        input.type = shown ? 'password' : 'text';
        toggle.classList.toggle('is-shown', !shown);
        toggle.setAttribute('aria-pressed', String(!shown));
        toggle.setAttribute('aria-label', shown ? 'Show password' : 'Hide password');
      });
    })();

    document.querySelectorAll('.role-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.role-tab').forEach(function (t) {
          t.classList.remove('on');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('on');
        tab.setAttribute('aria-selected', 'true');
        selectedRole = tab.getAttribute('data-role');
      });
    });

    function showError(msg) {
      var el = document.getElementById('loginError');
      el.textContent = msg;
      el.style.display = 'block';
    }

    // OTP global state
    var otpState = {
      userId: null,
      email: null,
      phone: null,
      emailVerified: false,
      phoneVerified: false,
      channel: 'email',
      resendTimer: null,
      resendCountdown: 0
    };

    function setupOtpInputs() {
      var inputs = document.querySelectorAll('.otp-digit');
      inputs.forEach(function (input, idx) {
        input.addEventListener('input', function (e) {
          var val = input.value;
          if (val.length === 1 && idx < inputs.length - 1) {
            inputs[idx + 1].focus();
          }
        });
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && input.value === '' && idx > 0) {
            inputs[idx - 1].focus();
          }
        });
        input.addEventListener('paste', function (e) {
          e.preventDefault();
          var pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
          if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
            inputs.forEach(function (inp, i) {
              inp.value = pasteData[i];
            });
            inputs[5].focus();
          }
        });
      });
    }

    function showLoginView(e) {
      if (e) e.preventDefault();
      document.getElementById('loginFormView').style.display = '';
      document.getElementById('otpFormView').style.display = 'none';
      if (otpState.resendTimer) clearInterval(otpState.resendTimer);
    }

    function startResendTimer() {
      var resendLink = document.getElementById('resendOtpLink');
      var timerText = document.getElementById('resendTimerText');
      var countdownVal = document.getElementById('resendCountdown');
      
      otpState.resendCountdown = 60;
      resendLink.style.display = 'none';
      timerText.style.display = 'inline';
      countdownVal.textContent = otpState.resendCountdown;

      if (otpState.resendTimer) clearInterval(otpState.resendTimer);

      otpState.resendTimer = setInterval(function () {
        otpState.resendCountdown--;
        countdownVal.textContent = otpState.resendCountdown;
        if (otpState.resendCountdown <= 0) {
          clearInterval(otpState.resendTimer);
          resendLink.style.display = 'inline';
          timerText.style.display = 'none';
        }
      }, 1000);
    }

    async function triggerSendOtp(channel) {
      document.getElementById('otpError').style.display = 'none';
      document.getElementById('devCodeAlert').style.display = 'none';
      otpState.channel = channel;
      try {
        var res = await EduAPI.sendOtp(channel, undefined, otpState.userId);
        if (res.devCode) {
          document.getElementById('devCodeVal').textContent = res.devCode;
          document.getElementById('devCodeAlert').style.display = 'block';
        }
        startResendTimer();
      } catch (err) {
        var el = document.getElementById('otpError');
        el.textContent = err.message;
        el.style.display = 'block';
      }
    }

    async function resendOtp(e) {
      if (e) e.preventDefault();
      if (otpState.resendCountdown > 0) return;
      await triggerSendOtp(otpState.channel);
    }

    function showOtpView(userId, email, phone, emailVerified, phoneVerified) {
      otpState.userId = userId;
      otpState.email = email;
      otpState.phone = phone;
      otpState.emailVerified = !!emailVerified;
      otpState.phoneVerified = !!phoneVerified;

      document.getElementById('loginFormView').style.display = 'none';
      document.getElementById('otpFormView').style.display = '';

      determineNextStep();
    }

    function determineNextStep() {
      var inputs = document.querySelectorAll('.otp-digit');
      inputs.forEach(function (inp) { inp.value = ''; });
      if (inputs[0]) inputs[0].focus();

      // Count how many steps are needed
      var needEmail = !otpState.emailVerified;
      var needPhone = !otpState.phoneVerified;
      var totalSteps = (needEmail ? 1 : 0) + (needPhone ? 1 : 0);

      if (needEmail) {
        otpState.channel = 'email';
        var prefix = totalSteps > 1 ? 'Step 1 of 2: ' : '';
        document.getElementById('otpSubtitle').textContent = prefix + 'Please enter the 6-digit code sent to your email ' + otpState.email;
        triggerSendOtp('email');
      } else if (needPhone) {
        otpState.channel = 'phone';
        var prefix = totalSteps > 1 ? 'Step 2 of 2: ' : '';
        document.getElementById('otpSubtitle').textContent = prefix + 'Enter the 6-digit code sent to your phone ' + otpState.phone;
        triggerSendOtp('phone');
      } else {
        completeVerification();
      }
    }

    async function completeVerification() {
      var email = document.getElementById('email').value.trim();
      var password = document.getElementById('password').value;
      try {
        await EduAPI.login(email, password, selectedRole);
        window.location.href = 'dashboard.html';
      } catch (err) {
        var el = document.getElementById('otpError');
        el.textContent = err.message;
        el.style.display = 'block';
      }
    }

    async function handleVerifyOtp(e) {
      e.preventDefault();
      document.getElementById('otpError').style.display = 'none';
      var inputs = document.querySelectorAll('.otp-digit');
      var code = '';
      inputs.forEach(function (inp) {
        code += inp.value.trim();
      });
      if (code.length !== 6) {
        var el = document.getElementById('otpError');
        el.textContent = 'Please enter all 6 digits.';
        el.style.display = 'block';
        return;
      }

      var verifyBtn = document.getElementById('verifyOtpBtn');
      var btnSpan = verifyBtn.querySelector('span');
      var original = btnSpan ? btnSpan.textContent : '';
      if (btnSpan) btnSpan.textContent = 'Verifying…';

      try {
        var res = await EduAPI.verifyOtp(otpState.channel, code, undefined, otpState.userId);
        if (res.verified) {
          if (otpState.channel === 'email') {
            otpState.emailVerified = true;
          } else {
            otpState.phoneVerified = true;
          }
          if (btnSpan) btnSpan.textContent = original;
          determineNextStep();
        } else {
          throw new Error('Verification failed.');
        }
      } catch (err) {
        var el = document.getElementById('otpError');
        el.textContent = err.message;
        el.style.display = 'block';
        if (btnSpan) btnSpan.textContent = original;
      }
    }

    // Call input binding setup
    setupOtpInputs();

    async function handleLogin(e) {
      e.preventDefault();
      document.getElementById('loginError').style.display = 'none';
      var email = document.getElementById('email').value.trim();
      var password = document.getElementById('password').value;
      var btn = e.target.querySelector('button[type="submit"] span');
      var original = btn ? btn.textContent : '';
      if (btn) btn.textContent = 'Signing in…';

      try {
        var user = await EduAPI.login(email, password, selectedRole);
        window.location.href = 'dashboard.html';
      } catch (err) {
        if (err.code === 'VERIFICATION_REQUIRED') {
          if (btn) btn.textContent = original;
          showOtpView(err.userId, err.email, err.phone, err.emailVerified, err.phoneVerified);
        } else {
          showError(err.message);
          if (btn) btn.textContent = original;
        }
      }
    }

    function handleSocial(provider) {
      alert(provider.toUpperCase() + ' login coming soon! Use the demo accounts for now.');
    }
  

/* ---- next <script> block ---- */


    (function () {
      try{if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.add('light-mode');}localStorage.setItem('edulearn-theme','light');}catch(e){if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.add('light-mode');}}
    })();
  


/* ---- inline on* handlers, re-attached; see extract-page-js.mjs ---- */
;(function () {
  function __bindEvt(sel, type, fn) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener(type, fn);
      onCleanup(function () { el.removeEventListener(type, fn); });
    });
  }
  __bindEvt("#loginFormView > form:nth-of-type(1)", "submit", function (event) { handleLogin(event) });
  __bindEvt("#loginFormView > form:nth-of-type(1) > div:nth-of-type(6) > button:nth-of-type(1)", "click", function (event) { handleSocial('google') });
  __bindEvt("#loginFormView > form:nth-of-type(1) > div:nth-of-type(6) > button:nth-of-type(2)", "click", function (event) { handleSocial('apple') });
  __bindEvt("#channelBtnEmail", "click", function (event) { setOtpChannel('email') });
  __bindEvt("#channelBtnPhone", "click", function (event) { setOtpChannel('phone') });
  __bindEvt("#otpFormView > form:nth-of-type(1)", "submit", function (event) { handleVerifyOtp(event) });
  __bindEvt("#resendOtpLink", "click", function (event) { resendOtp(event) });
  __bindEvt("#otpFormView > form:nth-of-type(1) > div:nth-of-type(4) > a:nth-of-type(1)", "click", function (event) { showLoginView(event) });
})();
}
