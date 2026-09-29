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

    // The form asks for four things: name, email, phone and password.
    function buildBody() {
      return { name: val('firstName'), email: val('email'), phone: val('phone'), password: val('password') };
    }

    /* ---- Step 2: one tap for the class ---------------------------------
       Everything a student sees is chosen by class, so the class is asked on
       the next screen and sent in the same request as the account. The roll
       number / teacher ID and the section are filled in for the person (both
       can be changed in Settings): a parent links a child by roll number, and
       the API has always required them. */
    var CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9'];
    var ALL_SUBJECTS = ['Maths', 'Science', 'Social Science', 'English', 'Hindi'];
    function code(prefix) {
      var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = '';
      for (var i = 0; i < 6; i++) out += abc.charAt(Math.floor(Math.random() * abc.length));
      return prefix + '-' + out;
    }
    function escHtml(v) {
      return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function options(list, picked) {
      return list.map(function (c) {
        return '<option' + (c === picked ? ' selected' : '') + '>' + escHtml(c) + '</option>';
      }).join('');
    }

    var submitting = false;
    function createAccount(extra, onError, onBusy) {
      if (submitting) return;
      submitting = true;
      if (onBusy) onBusy(true);
      EduAPI.signup(selectedRole, Object.assign(buildBody(), extra)).then(function () {
        // No email/phone verification, signup logs the user straight in.
        window.location.href = 'dashboard.html';
      }).catch(function (err) {
        submitting = false;
        if (onBusy) onBusy(false);
        onError(err);
      });
    }

    function closeStep() {
      document.getElementById('signupFormView').classList.remove('is-step');
    }
    function openStep(kind) {
      var view = document.getElementById('signupFormView');
      var step = document.getElementById('signupStep');
      if (!step) {
        step = document.createElement('div');
        step.id = 'signupStep';
        view.appendChild(step);
      }
      var classButtons = '<div class="step-grid">' + CLASSES.map(function (c) {
        return '<button type="button" class="step-class" data-class="' + c + '">' + c + '</button>';
      }).join('') + '</div>';
      var body;
      if (kind === 'parent') {
        body =
          '<h1>Link your child</h1>' +
          '<p class="subtitle">Enter your child’s details as they are in their account. Their roll number is in their Settings.</p>' +
          '<div class="form-group"><label for="stepRoll">Child’s roll number</label><input type="text" id="stepRoll" autocomplete="off"></div>' +
          '<div class="form-group"><label for="stepChild">Child’s full name</label><input type="text" id="stepChild" autocomplete="off"></div>' +
          '<div class="form-group"><label for="stepChildClass">Child’s class</label><select id="stepChildClass">' + options(CLASSES, 'Class 7') + '</select></div>' +
          '<button type="button" class="step-go" id="stepGo">Create account</button>';
      } else if (kind === 'teacher') {
        body =
          '<h1>Which class do you teach?</h1>' +
          '<p class="subtitle">Pick your subject, then tap your class.</p>' +
          '<div class="form-group"><label for="stepSubject">Subject</label><select id="stepSubject">' + options(ALL_SUBJECTS, 'Science') + '</select></div>' +
          classButtons;
      } else {
        body =
          '<h1>Which class are you in?</h1>' +
          '<p class="subtitle">One tap, and your chapters, quizzes and homework are ready.</p>' +
          classButtons;
      }
      step.innerHTML = body +
        '<div id="stepError" class="auth-error" style="display:none" role="alert"></div>' +
        '<button type="button" class="step-back" id="stepBack">Back</button>';
      view.classList.add('is-step');

      function stepError(err) {
        var el = document.getElementById('stepError');
        el.textContent = (err && err.message) || 'Could not create your account. Please try again.';
        el.style.display = 'block';
      }
      function busy(on) {
        Array.prototype.forEach.call(step.querySelectorAll('button'), function (b) { b.disabled = on; });
      }
      document.getElementById('stepBack').addEventListener('click', closeStep);

      Array.prototype.forEach.call(step.querySelectorAll('.step-class'), function (b) {
        b.addEventListener('click', function () {
          document.getElementById('stepError').style.display = 'none';
          var cls = b.getAttribute('data-class');
          var extra = kind === 'teacher'
            ? { teacherId: code('TCH'), className: cls, section: 'A', subject: val('stepSubject') || 'Science' }
            : { rollNumber: code('BB'), className: cls, section: 'A', board: 'CBSE', subjects: ALL_SUBJECTS };
          var label = b.textContent;
          b.textContent = 'Creating…';
          createAccount(extra, function (err) { b.textContent = label; stepError(err); }, busy);
        });
      });

      var go = document.getElementById('stepGo');
      if (go) go.addEventListener('click', function () {
        document.getElementById('stepError').style.display = 'none';
        if (!val('stepRoll') || !val('stepChild')) { stepError({ message: 'Please enter your child’s roll number and name.' }); return; }
        go.textContent = 'Creating account…';
        createAccount(
          { childRollNumber: val('stepRoll'), childName: val('stepChild'), childClass: val('stepChildClass') },
          function (err) { go.textContent = 'Create account'; stepError(err); }, busy);
      });

      var first = step.querySelector('input, select, .step-class');
      if (first) first.focus();
      // On a phone the card sits below the intro panel; bring it into view.
      try { step.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
    }

    function handleSignup(e) {
      e.preventDefault();
      document.getElementById('signupError').style.display = 'none';
      if (selectedRole !== 'parent') { openStep(selectedRole); return; }

      // A parent can sign up first and link their child later. Only when the
      // server insists on the child's details is the parent asked for them.
      var btn = e.target.querySelector('button[type="submit"] span');
      var original = btn ? btn.textContent : '';
      if (btn) btn.textContent = 'Creating account…';
      createAccount({}, function (err) {
        if (btn) btn.textContent = original;
        if (/child/i.test((err && err.message) || '')) openStep('parent');
        else showError(err.message);
      });
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
