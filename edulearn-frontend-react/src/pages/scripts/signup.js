/* Lifted verbatim from edulearn-frontend/signup.html, do not hand-edit.
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

    // Role tab switching, shows the matching field group.
    document.querySelectorAll('.role-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.role-tab').forEach(function (t) {
          t.classList.remove('on'); t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('on'); tab.setAttribute('aria-selected', 'true');
        selectedRole = tab.getAttribute('data-role');
        document.querySelectorAll('.role-fields').forEach(function (g) {
          g.style.display = g.getAttribute('data-fields') === selectedRole ? '' : 'none';
        });
      });
    });

    function val(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }
    function showError(msg){
      var el = document.getElementById('signupError');
      el.textContent = msg; el.style.display = 'block';
    }

    // Signup asks for just name, email, phone and password, for every role.
    // Class, roll number and the like are added later from Settings.
    function buildBody() {
      return { name: val('firstName'), email: val('email'), phone: val('phone'), password: val('password') };
    }

    async function handleSignup(e) {
      e.preventDefault();
      document.getElementById('signupError').style.display = 'none';
      var btn = e.target.querySelector('button[type="submit"] span');
      var original = btn ? btn.textContent : '';
      if (btn) btn.textContent = 'Creating account…';
      try {
        await EduAPI.signup(selectedRole, buildBody());
        // No email/phone verification, signup logs the user straight in.
        window.location.href = 'dashboard.html';
      } catch (err) {
        showError(err.message);
        if (btn) btn.textContent = original;
      }
    }

    // OTP global state
    var otpState = {
      userId: null,
      email: null,
      phone: null,
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

    function showSignupView(e) {
      if (e) e.preventDefault();
      document.getElementById('signupFormView').style.display = '';
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
        var res = await EduAPI.sendOtp(channel, otpState.email, otpState.userId);
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

    function showOtpView(userId, email, phone) {
      otpState.userId = userId;
      otpState.email = email;
      otpState.phone = phone;
      otpState.emailVerified = false;
      otpState.phoneVerified = false;

      document.getElementById('signupFormView').style.display = 'none';
      document.getElementById('otpFormView').style.display = '';
      // Hide channel selector, both are mandatory in sequence
      document.getElementById('otpChannelSelector').style.display = 'none';

      determineNextStep();
    }

    function determineNextStep() {
      var inputs = document.querySelectorAll('.otp-digit');
      inputs.forEach(function(inp){ inp.value = ''; });
      if (inputs[0]) inputs[0].focus();

      if (!otpState.emailVerified) {
        otpState.channel = 'email';
        document.getElementById('otpSubtitle').textContent =
          'Step 1 of 2: Enter the 6-digit code sent to your email ' + (otpState.email || '');
        triggerSendOtp('email');
      } else if (!otpState.phoneVerified) {
        otpState.channel = 'phone';
        document.getElementById('otpSubtitle').textContent =
          'Step 2 of 2: Enter the 6-digit code sent to your phone ' + (otpState.phone || '');
        triggerSendOtp('phone');
      } else {
        // Both verified, go to dashboard
        window.location.href = 'dashboard.html';
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
        var res = await EduAPI.verifyOtp(otpState.channel, code, otpState.email, otpState.userId);
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

    function handleSocial(provider) {
      alert(provider.toUpperCase() + ' signup coming soon! Use email for now.');
    }
  

/* ---- next <script> block ---- */


    (function () { try{if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.add('light-mode');}localStorage.setItem('edulearn-theme','light');}catch(e){if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.add('light-mode');}} })();
  


/* ---- inline on* handlers, re-attached; see extract-page-js.mjs ---- */
;(function () {
  function __bindEvt(sel, type, fn) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener(type, fn);
      onCleanup(function () { el.removeEventListener(type, fn); });
    });
  }
  __bindEvt("#signupFormView > form:nth-of-type(1)", "submit", function (event) { handleSignup(event) });
  __bindEvt("#signupFormView > form:nth-of-type(1) > div:nth-of-type(10) > button:nth-of-type(1)", "click", function (event) { handleSocial('google') });
  __bindEvt("#signupFormView > form:nth-of-type(1) > div:nth-of-type(10) > button:nth-of-type(2)", "click", function (event) { handleSocial('apple') });
  __bindEvt("#channelBtnEmail", "click", function (event) { setOtpChannel('email') });
  __bindEvt("#channelBtnPhone", "click", function (event) { setOtpChannel('phone') });
  __bindEvt("#otpFormView > form:nth-of-type(1)", "submit", function (event) { handleVerifyOtp(event) });
  __bindEvt("#resendOtpLink", "click", function (event) { resendOtp(event) });
  __bindEvt("#otpFormView > form:nth-of-type(1) > div:nth-of-type(4) > a:nth-of-type(1)", "click", function (event) { showSignupView(event) });
})();
}
