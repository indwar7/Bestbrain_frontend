/* ============================================================
   BestBrain — shared frontend API helper
   Connects the static pages to the BestBrain backend.
   ============================================================ */
(function (global) {
  // Backend base URL — points directly at the backend EC2 origin.
  // For local dev, override it: localStorage.setItem('edulearn_api','http://localhost:4000')
  //
  // The override is READ here. It used to be documented (and preserved across
  // logout by clearSession) but never actually applied, so every local dev
  // session silently talked to production while videos/upload/admin/live-video
  // — which read the key themselves — talked to localhost. Same key, two
  // different backends in one tab.
  // Resolution order:
  //   1. an explicit localStorage['edulearn_api'] override (always wins)
  //   2. http://localhost:4000 when the PAGE ITSELF is served from localhost
  //   3. the deployed EC2 origin directly, even when the page is on HTTPS —
  //      see the DIRECTED CHANGE comment below for why, and the real risk
  //      (mixed content) this reintroduces
  //   4. the deployed EC2 origin (plain-http contexts, e.g. file://) — same
  //      value as 3, kept as a separate branch for the non-HTTPS case
  //
  // Step 2 exists because step 1 alone is a footgun: localStorage is scoped per
  // ORIGIN, so setting the override while on localhost:8080 does nothing on
  // localhost:8081, and nothing on 127.0.0.1 either — same machine, three
  // separate stores. The symptom is a confusing "Cannot reach the server. Is
  // the backend running on http://65.2.183.7?", which names the PROD host and
  // reads like the server is down when really the browser was never pointed at
  // the local one. (Production also returns no Access-Control-Allow-* headers
  // on a preflight from a localhost origin, so the browser blocks the call and
  // fetch rejects — indistinguishable from "offline" at this layer.)
  //
  // Anything served from a real domain is unaffected and still hits EC2.
  var API_DEFAULT = 'http://65.2.183.7';
  var API_LOCAL = 'http://localhost:4000';
  var API_BASE = API_DEFAULT;

  function isLocalHost(h) {
    return h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1';
  }

  try {
    // NOTE: a localhost page used to be auto-pointed at API_LOCAL here. That is
    // deliberately GONE. The real content (49 uploaded videos, the live
    // curriculum) lives on the deployed backend, while a fresh local database
    // is empty — so auto-switching meant opening the app locally silently
    // showed "no videos" and looked like data loss. Defaulting to the deployed
    // backend means a local page shows real content with no setup.
    //
    // To work against a LOCAL backend, opt in explicitly:
    //   localStorage.setItem('edulearn_api', 'http://localhost:4000')
    //
    // Serve the local frontend from http://localhost:8000 — the deployed
    // backend's CORS allowlist contains that origin and no other localhost
    // port, so any other port is blocked by the browser.
    if (location.protocol === 'https:' && !isLocalHost(location.hostname)) {
      // DIRECTED CHANGE (2026-08-24, explicit instruction, relayed from a
      // senior, after being shown this exact mixed-content risk and
      // confirming anyway) — see the matching comment in
      // edulearn-frontend-react/src/lib/api.ts for the full reasoning this
      // used to hold: an https:// page calling http://65.2.183.7 directly is
      // MIXED CONTENT, which browsers block outright — no code-level fix
      // exists for that, only serving the backend over HTTPS does. If login
      // breaks again after this, check the browser console for a
      // "Mixed Content" error before assuming anything else.
      API_BASE = 'http://ec2-65-2-183-7.ap-south-1.compute.amazonaws.com';
    }
  } catch (e) { /* no location (non-browser context) — keep the default */ }

  try {
    var apiOverride = localStorage.getItem('edulearn_api');
    if (apiOverride) {
      apiOverride = apiOverride.replace(/\/+$/, '');
      // A plain-http override on an https page is mixed content — the browser
      // blocks every request before it leaves, so honouring it can only break
      // the site (classic case: a stale 'http://65.2.183.7' saved in
      // localStorage long ago, silently poisoning the deployed site forever,
      // since logout deliberately preserves this key). Ignore it and keep the
      // working same-origin proxy instead.
      var httpOnHttps =
        location.protocol === 'https:' && apiOverride.indexOf('http://') === 0;
      if (!httpOnHttps) API_BASE = apiOverride;
    }
  } catch (e) { /* storage unavailable — keep whatever was resolved above */ }

  var TOKEN_KEY = 'edulearn_token';
  var USER_KEY = 'edulearn_user';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || '';
  }
  function setSession(token, user) {
    // A previous session on this device may not have been cleanly logged out
    // (tab closed, direct navigation, etc.) — its per-user data would still be
    // sitting in localStorage. Wipe it before establishing the new session so
    // it never leaks into this login/signup, even for the same returning user.
    clearUserDataKeys();
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  function clearUserDataKeys() {
    var USER_DATA_KEYS = [
      'edulearn_pal_chats',
      'edulearn_live',
      'edutok_state',
      'edulearn_mock',
      'edulearn_arena',
      'edulearn_state',
    ];
    var doomed = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (!k) continue;
      if (
        USER_DATA_KEYS.indexOf(k) !== -1 ||
        k.indexOf('edulearn_pal_chats_') === 0
      ) {
        doomed.push(k);
      }
    }
    doomed.forEach(function (k) {
      localStorage.removeItem(k);
    });
  }
  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }
  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Wipe per-user cached data so the next person on a shared device never
    // sees the previous user's chats, bookings or progress. Keeps device-level
    // settings like the API override ('edulearn_api').
    clearUserDataKeys();
  }

  // Access tokens are short-lived (~15 min); the refresh token lives in an
  // httpOnly cookie. When a call 401s we refresh ONCE and replay the call, so
  // a student who logged in this morning can still open the Arena tonight.
  // All concurrent 401s share one in-flight refresh instead of racing.
  var refreshPromise = null;
  function refreshAccessToken() {
    if (!refreshPromise) {
      refreshPromise = fetch(API_BASE + '/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          var token = data && data.accessToken;
          // NOT setSession — that wipes per-user localStorage; same user, new token.
          if (token) localStorage.setItem(TOKEN_KEY, token);
          return token || null;
        })
        .catch(function () { return null; })
        .finally(function () { refreshPromise = null; });
    }
    return refreshPromise;
  }

  // A 401 from these means "bad credentials", not "stale access token" —
  // refreshing and replaying would just 401 again (or loop on refresh itself).
  function isAuthPath(path) {
    return path.indexOf('/api/auth/') === 0;
  }

  // Core fetch wrapper. Adds JSON headers + bearer token, parses errors nicely.
  async function request(path, options, isRetry) {
    options = options || {};
    var headers = Object.assign(
      { 'Content-Type': 'application/json' },
      options.headers || {}
    );
    var token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    var res;
    try {
      res = await fetch(API_BASE + path, {
        method: options.method || 'GET',
        headers: headers,
        credentials: 'include',
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (networkErr) {
      // fetch() rejects identically whether the server is down OR the browser
      // blocked the response (CORS/mixed-content), so do not assert it is down.
      throw new Error(
        'Could not reach ' + API_BASE + '. It may be down, or the browser may ' +
        'have blocked the response (CORS). Check the Network tab for details.'
      );
    }

    if (res.status === 401 && !isRetry && token && !isAuthPath(path)) {
      var fresh = await refreshAccessToken();
      if (fresh) return request(path, options, true);
    }

    var data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    if (!res.ok) {
      var err = new Error(data.error || 'Request failed (' + res.status + ')');
      err.status = res.status;
      err.code = data.code;
      err.userId = data.userId;
      err.email = data.email;
      err.phone = data.phone;
      err.emailVerified = data.emailVerified;
      err.phoneVerified = data.phoneVerified;
      throw err;
    }
    return data;
  }

  // ---- Auth calls ----
  async function login(email, password, role) {
    var data = await request('/api/auth/login', {
      method: 'POST',
      body: { email: email, password: password, role: role },
    });
    setSession(data.accessToken, data.user);
    return data.user;
  }

  async function signup(role, fields) {
    var data = await request('/api/auth/signup/' + role, {
      method: 'POST',
      body: fields,
    });
    setSession(data.accessToken, data.user);
    return data.user;
  }

  // Re-verify and replace a parent's child link (fixes a mismatched link
  // without requiring a brand-new signup). This isn't a new login, so — unlike
  // setSession — it must NOT wipe this parent's own per-user data.
  async function relinkChild(childRollNumber, childName, childClass) {
    var data = await request('/api/auth/relink-child', {
      method: 'POST',
      body: { childRollNumber: childRollNumber, childName: childName, childClass: childClass },
    });
    if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  }

  async function getDashboard() {
    return request('/api/dashboard');
  }

  // Real per-user progress snapshot: { progress: { chapters, streak, minutes, badges, ... } }.
  async function getProgress() {
    var data = await request('/api/progress');
    return (data && data.progress) || null;
  }

  // Persist a partial or full progress object (merged server-side).
  async function saveProgress(fields) {
    var data = await request('/api/progress', { method: 'PUT', body: fields });
    return (data && data.progress) || null;
  }

  // Public — no auth required. { subscriptionButtonId, pricePaise, currency,
  // webhookConfigured }. webhookConfigured lets the UI warn instead of taking
  // a payment it can never actually apply to the account.
  async function getSubscriptionConfig() {
    return request('/api/subscription/config');
  }

  // The signed-in user's entitlement: { active, status, paidThrough, subscriptionId }.
  async function getSubscription() {
    return request('/api/subscription/me');
  }

  // { balance, recent } — recent is the last 25 ledger lines (delta, reason,
  // balanceAfter, createdAt). PAL questions and video views deduct from this
  // balance server-side; this is read-only, there is no client grant path.
  async function getCoins() {
    return request('/api/coins');
  }

  async function me() {
    return request('/api/auth/me');
  }

  // Full profile (includes role-specific fields + preferences).
  async function getProfile() {
    return request('/api/users/me');
  }

  // Update profile + preferences. Returns the updated user.
  async function updateProfile(fields) {
    var data = await request('/api/users/me/profile', {
      method: 'PUT',
      body: fields,
    });
    if (data.user) {
      // Keep the cached session user fresh.
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data.user;
  }

  function logout() {
    request('/api/auth/logout', { method: 'POST' }).catch(function () {});
    clearSession();
    window.location.href = 'login.html';
  }

  // ---- OTP calls ----
  async function sendOtp(channel, emailOrPhone, userId) {
    var body = { channel: channel };
    if (userId) body.userId = userId;
    else if (emailOrPhone) body.email = emailOrPhone;
    return request('/api/auth/send-otp', {
      method: 'POST',
      body: body,
    });
  }

  async function verifyOtp(channel, code, emailOrPhone, userId) {
    var body = { channel: channel, code: code };
    if (userId) body.userId = userId;
    else if (emailOrPhone) body.email = emailOrPhone;
    return request('/api/auth/verify-otp', {
      method: 'POST',
      body: body,
    });
  }

  // ---- Live class calls ----
  // List the live sessions the current user is eligible for.
  // Student → live classes for their class+section+subjects.
  // Teacher → their own live sessions.
  async function listLive() {
    var data = await request('/api/live');
    return data.sessions || [];
  }

  // Teacher only: start a targeted live class. Returns the created session.
  async function createLive(fields) {
    var data = await request('/api/live', { method: 'POST', body: fields });
    return data.session;
  }

  // Eligibility-checked join. Returns room info ({ ok, session }).
  async function joinLive(id) {
    return request('/api/live/' + id + '/join', { method: 'POST' });
  }

  // Join via short code (e.g. "SCI-7A-4821"). Same eligibility as joinLive.
  // Returns room info ({ ok, session }).
  async function joinLiveByCode(code) {
    return request('/api/live/join-by-code', {
      method: 'POST',
      body: { code: code },
    });
  }

  // Teacher only: end the session (tears down the video room for everyone).
  async function endLive(id) {
    return request('/api/live/' + id + '/end', { method: 'POST' });
  }

  // Teacher only: full class roster with live presence ({ roster, joined, total }).
  async function liveRoster(id) {
    return request('/api/live/' + id + '/roster');
  }

  // ---- Video calls ----
  // List uploaded lecture videos, optionally filtered by class/subject/topic.
  async function listVideos(filters) {
    filters = filters || {};
    var qs = Object.keys(filters)
      .filter(function (k) { return filters[k]; })
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(filters[k]); })
      .join('&');
    var data = await request('/api/videos' + (qs ? '?' + qs : ''));
    return data.videos || [];
  }

  // Fire-and-forget view count bump (no auth required server-side).
  function recordVideoView(id) {
    request('/api/videos/' + id + '/view', { method: 'POST' }).catch(function () {});
  }

  // ---- Notes calls ----
  // List uploaded chapter notes (PDF/images), filtered like videos. Each note
  // carries a `fileUrl` the lesson hub turns into a token-authed link.
  async function listNotes(filters) {
    filters = filters || {};
    var qs = Object.keys(filters)
      .filter(function (k) { return filters[k]; })
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(filters[k]); })
      .join('&');
    var data = await request('/api/notes' + (qs ? '?' + qs : ''));
    return data.notes || [];
  }

  // ---- Live-class attention/monitoring reports ----
  // Persist a report server-side so it survives a device change and reaches the
  // linked parent. Returns the saved report, or null if the endpoint isn't
  // available yet (older backend) — callers fall back to local storage.
  async function submitLiveReport(report) {
    try {
      var data = await request('/api/live/reports', { method: 'POST', body: report });
      return (data && data.report) || null;
    } catch (e) {
      return null; // backend not deployed / offline → caller keeps the local copy
    }
  }

  // Student: own reports. Parent: a linked child's (optional childId).
  // Returns [] on any failure so the UI can fall back to local reports.
  async function listLiveReports(childId) {
    try {
      var qs = childId ? ('?childId=' + encodeURIComponent(childId)) : '';
      var data = await request('/api/live/reports' + qs);
      return (data && data.reports) || [];
    } catch (e) {
      return [];
    }
  }

  // ---- PAL AI calls ----
  async function listPalSessions() {
    return request('/api/pal/sessions');
  }

  async function getPalSession(id) {
    return request('/api/pal/sessions/' + id);
  }

  async function chatPal(message, sessionId) {
    var body = { message: message };
    if (sessionId) body.sessionId = sessionId;
    return request('/api/pal/chat', {
      method: 'POST',
      body: body
    });
  }

  // ---- AI Tutor (live doubt session) ----
  // Streams a voice-optimized PAL reply over SSE (POST /api/pal/tutor/stream).
  // EventSource can't POST, so this reads the response body stream directly.
  // handlers: { onChunk(text), signal? (AbortSignal) }
  // Resolves { sessionId } once the stream finishes; rejects with err.status /
  // err.code set (like request()) on HTTP or in-stream errors. Retries once
  // through the shared refresh flow when the access token has expired.
  async function tutorStream(message, sessionId, handlers, isRetry) {
    handlers = handlers || {};
    var headers = { 'Content-Type': 'application/json' };
    var token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    var res;
    try {
      res = await fetch(API_BASE + '/api/pal/tutor/stream', {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(
          sessionId ? { message: message, sessionId: sessionId } : { message: message }
        ),
        signal: handlers.signal,
      });
    } catch (networkErr) {
      if (networkErr && networkErr.name === 'AbortError') throw networkErr;
      throw new Error(
        'Could not reach ' + API_BASE + '. It may be down, or the browser may ' +
        'have blocked the response (CORS). Check the Network tab for details.'
      );
    }

    if (res.status === 401 && !isRetry && token) {
      var fresh = await refreshAccessToken();
      if (fresh) return tutorStream(message, sessionId, handlers, true);
    }

    if (!res.ok) {
      var data = null;
      try { data = await res.json(); } catch (e) { data = {}; }
      var err = new Error(data.error || 'Request failed (' + res.status + ')');
      err.status = res.status;
      err.code = data.code;
      throw err;
    }

    // Minimal SSE parser: frames are separated by a blank line; each frame has
    // "event: <name>" and "data: <json>" lines (matches the backend's writer).
    var reader = res.body.getReader();
    var decoder = new TextDecoder();
    var buf = '';
    var result = { sessionId: null };

    function handleFrame(frame) {
      var ev = 'message';
      var data = '';
      frame.split('\n').forEach(function (line) {
        if (line.indexOf('event: ') === 0) ev = line.slice(7).trim();
        else if (line.indexOf('data: ') === 0) data += line.slice(6);
      });
      var payload = {};
      try { payload = JSON.parse(data || '{}'); } catch (e) {}
      if (ev === 'chunk') {
        if (handlers.onChunk && payload.text) handlers.onChunk(payload.text);
      } else if (ev === 'done') {
        result.sessionId = payload.sessionId || null;
      } else if (ev === 'error') {
        // The stream already sent a 200, so errors arrive as events.
        var serr = new Error(payload.error || 'PAL is unavailable right now');
        serr.code = payload.code;
        throw serr;
      }
    }

    for (;;) {
      var r = await reader.read();
      if (r.done) break;
      buf += decoder.decode(r.value, { stream: true });
      var idx;
      while ((idx = buf.indexOf('\n\n')) !== -1) {
        var frame = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        if (frame.trim()) handleFrame(frame);
      }
    }
    return result;
  }

  async function renamePalSession(id, title) {
    return request('/api/pal/sessions/' + id, {
      method: 'PATCH',
      body: { title: title }
    });
  }

  async function deletePalSession(id) {
    return request('/api/pal/sessions/' + id, {
      method: 'DELETE'
    });
  }

  // ---- Assessments (mock tests) ----
  async function startMockTest(subject, chapterSlug, count) {
    var body = { subject: subject };
    if (chapterSlug) body.chapterSlug = chapterSlug;
    if (count) body.count = count;
    return request('/api/assessments/mock/start', {
      method: 'POST',
      body: body
    });
  }

  // Grades a single question mid-test so the student can read the worked
  // solution before moving on. Returns { chosen, correct, correctIndex,
  // explanation }. The answer is locked server-side once revealed.
  async function answerMockQuestion(attemptId, index, chosenIndex) {
    return request('/api/assessments/mock/' + attemptId + '/answer', {
      method: 'POST',
      body: { index: index, chosenIndex: chosenIndex }
    });
  }

  // Server-grades the attempt and returns { score, total, review[] }.
  async function submitMockTest(attemptId, answers) {
    return request('/api/assessments/mock/' + attemptId + '/submit', {
      method: 'POST',
      body: { answers: answers }
    });
  }

  // Persist a completed client-side (adaptive) test so it survives re-login,
  // syncs across devices, and is visible server-side.
  // fields: { subject, testName?, score, total, mastery? }
  async function recordMockAttempt(fields) {
    return request('/api/assessments/mock/record', {
      method: 'POST',
      body: fields
    });
  }

  // The student's past attempts: { attempts: [{ subject, testName, score, total, mastery, finishedAt }] }
  async function getMockHistory() {
    return request('/api/assessments/mock/history');
  }

  // Teacher/admin only: author one question into the bank (used by the test
  // builder — one call per question, all tagged with the same chapterSlug so
  // a test's questions form their own isolated pool).
  async function createQuestion(fields) {
    return request('/api/assessments/questions', {
      method: 'POST',
      body: fields
    });
  }


  // ---- Assessments (question bank) ----
  // Chapter practice, not a test: nothing is started or submitted, so these
  // are just "give me questions" and "was this one right". The class is
  // decided by the server from the signed-in account, never sent from here.
  async function getQuestionBank(subject, chapterSlug, count, difficulty) {
    var qs = '?subject=' + encodeURIComponent(subject);
    if (chapterSlug) qs += '&chapterSlug=' + encodeURIComponent(chapterSlug);
    if (count) qs += '&count=' + encodeURIComponent(count);
    if (difficulty) qs += '&difficulty=' + encodeURIComponent(difficulty);
    return request('/api/assessments/bank' + qs);
  }

  // Returns { correct, correctIndex, explanation, coinsAwarded, balance }.
  // Coins land on the first correct answer to a question and never again.
  async function answerBankQuestion(questionId, chosenIndex) {
    return request('/api/assessments/bank/answer', {
      method: 'POST',
      body: { questionId: questionId, chosenIndex: chosenIndex }
    });
  }

  // { chapters: { "<slug>": count } } — lets Learn show a chapter's bank size
  // and hide the module where there is nothing to practise yet.
  async function getBankChapterCounts(subject) {
    return request('/api/assessments/bank/chapters?subject=' + encodeURIComponent(subject));
  }

  // ---- Homework ----
  // Student: their own class's published assignments, with status and dueAt.
  async function getAssignedHomework(subject, chapterSlug) {
    var qs = [];
    if (subject) qs.push('subject=' + encodeURIComponent(subject));
    if (chapterSlug) qs.push('chapterSlug=' + encodeURIComponent(chapterSlug));
    return request('/api/homework/assigned' + (qs.length ? '?' + qs.join('&') : ''));
  }

  // Student: the questions, WITHOUT answers.
  async function getHomework(id) {
    return request('/api/homework/' + id);
  }

  // Student: grade and store. answers = [{ questionId, selectedIndex }].
  // Returns { submission, review } where review carries the solutions — the
  // only point at which answers travel to a student.
  async function submitHomework(id, answers) {
    return request('/api/homework/' + id + '/submit', {
      method: 'POST',
      body: { answers: answers }
    });
  }

  // Teacher: assign, list, edit, delete, and read the roster.
  // Teacher: browse the authored bank to pick questions for an assignment.
  // chapterSlug matters here — assigning is a per-chapter job.
  async function listQuestions(className, subject, chapterSlug, usage) {
    var qs = [];
    if (className) qs.push('className=' + encodeURIComponent(className));
    if (subject) qs.push('subject=' + encodeURIComponent(subject));
    if (chapterSlug) qs.push('chapterSlug=' + encodeURIComponent(chapterSlug));
    if (usage) qs.push('usage=' + encodeURIComponent(usage));
    return request('/api/assessments/questions' + (qs.length ? '?' + qs.join('&') : ''));
  }

  async function createHomework(payload) {
    return request('/api/homework', { method: 'POST', body: payload });
  }
  async function listHomework(className, subject) {
    var qs = [];
    if (className) qs.push('className=' + encodeURIComponent(className));
    if (subject) qs.push('subject=' + encodeURIComponent(subject));
    return request('/api/homework' + (qs.length ? '?' + qs.join('&') : ''));
  }
  async function updateHomework(id, patch) {
    return request('/api/homework/' + id, { method: 'PATCH', body: patch });
  }
  async function deleteHomework(id) {
    return request('/api/homework/' + id, { method: 'DELETE' });
  }
  async function getHomeworkSubmissions(id) {
    return request('/api/homework/' + id + '/submissions');
  }

  // ---- Assessments (hourly challenge / Arena) ----
  // Real per-hour question (or { alreadyPlayed: true, points } if already played).
  async function getChallenge() {
    return request('/api/assessments/challenge');
  }

  async function answerChallenge(questionId, chosenIndex, msTaken) {
    return request('/api/assessments/challenge/answer', {
      method: 'POST',
      body: { questionId: questionId, chosenIndex: chosenIndex, msTaken: msTaken }
    });
  }

  // Real leaderboard for this hour: { hourKey, leaderboard: [{rank,name,points}], you }
  async function getChallengeLeaderboard() {
    return request('/api/assessments/challenge/leaderboard');
  }

  // Guard: redirect to login if not authenticated. Optionally require a role.
  function requireAuth(requiredRole) {
    var user = getUser();
    if (!getToken() || !user) {
      window.location.href = 'login.html';
      return null;
    }
    if (requiredRole && user.role !== requiredRole) {
      // Logged in but wrong dashboard — send them to their own.
      window.location.href = 'dashboard.html';
      return null;
    }
    return user;
  }

  global.EduAPI = {
    API_BASE: API_BASE,
    login: login,
    signup: signup,
    logout: logout,
    me: me,
    getProfile: getProfile,
    updateProfile: updateProfile,
    getDashboard: getDashboard,
    getProgress: getProgress,
    saveProgress: saveProgress,
    getSubscriptionConfig: getSubscriptionConfig,
    getSubscription: getSubscription,
    getCoins: getCoins,
    getUser: getUser,
    getToken: getToken,
    requireAuth: requireAuth,
    relinkChild: relinkChild,
    clearSession: clearSession,
    listLive: listLive,
    createLive: createLive,
    joinLive: joinLive,
    joinLiveByCode: joinLiveByCode,
    endLive: endLive,
    liveRoster: liveRoster,
    listVideos: listVideos,
    recordVideoView: recordVideoView,
    listNotes: listNotes,
    submitLiveReport: submitLiveReport,
    listLiveReports: listLiveReports,
    startMockTest: startMockTest,
    answerMockQuestion: answerMockQuestion,
    submitMockTest: submitMockTest,
    recordMockAttempt: recordMockAttempt,
    getMockHistory: getMockHistory,
    createQuestion: createQuestion,
    listQuestions: listQuestions,
    getQuestionBank: getQuestionBank,
    answerBankQuestion: answerBankQuestion,
    getBankChapterCounts: getBankChapterCounts,
    getAssignedHomework: getAssignedHomework,
    getHomework: getHomework,
    submitHomework: submitHomework,
    createHomework: createHomework,
    listHomework: listHomework,
    updateHomework: updateHomework,
    deleteHomework: deleteHomework,
    getHomeworkSubmissions: getHomeworkSubmissions,
    getChallenge: getChallenge,
    answerChallenge: answerChallenge,
    getChallengeLeaderboard: getChallengeLeaderboard,
    sendOtp: sendOtp,
    verifyOtp: verifyOtp,
    listPalSessions: listPalSessions,
    getPalSession: getPalSession,
    chatPal: chatPal,
    tutorStream: tutorStream,
    renamePalSession: renamePalSession,
    deletePalSession: deletePalSession,
  };
})(window);
