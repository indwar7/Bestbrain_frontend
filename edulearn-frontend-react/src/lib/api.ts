const API_DEFAULT = 'https://api.bestbrainplus.com';
const TOKEN_KEY = 'edulearn_token';
const USER_KEY = 'edulearn_user';

function resolveApiBase(): string {
  let base = API_DEFAULT;

  /*
    VITE_API_ORIGIN wins everywhere, before any host sniffing below.

    Vite reads it from .env / .env.production / .env.local at BUILD time and
    inlines the literal, there is no runtime env on a static site, so it has
    to be set before `npm run build`, not when the server starts. See
    .env.example.

    It is checked ahead of the per-host rules so one build can be pointed at
    any backend (staging, a laptop, a new box) without touching this file. The
    hardcoded values below stay as the defaults for the deployments we already
    have, so an unset variable keeps today's behaviour.
  */
  const configured = import.meta.env.VITE_API_ORIGIN?.trim();
  if (configured) return configured.replace(/\/+$/, '');

  try {
    // Dev: go through Vite's proxy (see vite.config.ts) so calls are
    // same-origin. Hitting the deployed API directly from :5173 would be
    // blocked, production CORS deliberately allows only :8000 and the Vercel
    // origin, and a blocked response surfaces as a misleading "Failed to
    // fetch" rather than an explicit CORS error.
    // Must be a non-empty, same-origin absolute URL rather than ''. The lifted
    // page scripts resolve their base as
    //     (window.EduAPI && EduAPI.API_BASE) || '/backend-api'
    // and an empty string is falsy, so '' would silently fall through to
    // /backend-api, which the dev server does not proxy, returning index.html
    // and failing as "Unexpected token '<'".
    if (isLocalHost(location.hostname)) return location.origin;

    if (location.protocol === 'https:') {
      /*
        HTTPS deployments call the backend's own HTTPS origin directly.

        This replaces the 2026-08-24 directed change that pointed here at
        http://ec2-65-2-183-7..., a plain-http origin. That was mixed content
        (an HTTPS page calling an HTTP API), which browsers block at the
        network layer with no code-level override, so every call died in the
        browser. It also pointed at a box that is no longer serving.

        api.bestbrainplus.com resolves the whole problem properly: it is a
        real HTTPS origin with its own certificate, so there is no mixed
        content left to block, and its CORS allowlist already returns
        Access-Control-Allow-Origin: https://bestbrainplus.com, verified
        against a live preflight, not assumed.

        VITE_API_ORIGIN still wins over this (handled above) and
        localStorage.edulearn_api still overrides at runtime, just below.
      */
      base = 'https://api.bestbrainplus.com';
    }
  } catch { /* non-browser */ }

  try {
    const override = localStorage.getItem('edulearn_api');
    if (override) {
      const clean = override.replace(/\/+$/, '');
      const httpOnHttps = location.protocol === 'https:' && clean.startsWith('http://');
      if (!httpOnHttps) base = clean;
    }
  } catch { /* storage unavailable */ }

  return base;
}

function isLocalHost(h: string) {
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1';
}

export const API_BASE = resolveApiBase();

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  className?: string;
  section?: string;
  board?: string;
  rollNumber?: string;
  teacherId?: string;
  phone?: string;
  childRollNumber?: string;
  childName?: string;
  childClass?: string;
  preferences?: {
    language?: string;
    theme?: string;
    emailNotifications?: boolean;
  };
}

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || '';
}

export function getUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

/**
 * Announce that the stored session changed, so AuthProvider re-reads it.
 *
 * The lifted page scripts call these module functions directly, login.js does
 * `EduAPI.login(...)`, not AuthContext's wrappers. Without this, React state
 * keeps whatever it read at mount, and a user who just logged in is still
 * `loggedIn: false` to ProtectedRoute, which bounces them straight back out.
 */
function announceSession() {
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export const SESSION_EVENT = 'edulearn:session';

function setSession(token: string, user: User) {
  clearUserDataKeys();
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  announceSession();
}

function clearUserDataKeys() {
  const USER_DATA_KEYS = [
    'edulearn_pal_chats', 'edulearn_live', 'edutok_state',
    'edulearn_mock', 'edulearn_arena', 'edulearn_state',
  ];
  const doomed: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (USER_DATA_KEYS.includes(k) || k.startsWith('edulearn_pal_chats_')) {
      doomed.push(k);
    }
  }
  doomed.forEach(k => localStorage.removeItem(k));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearUserDataKeys();
  announceSession();
}

let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(API_BASE + '/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const token = data?.accessToken;
        if (token) localStorage.setItem(TOKEN_KEY, token);
        return token || null;
      })
      .catch(() => null)
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

function isAuthPath(path: string) {
  return path.startsWith('/api/auth/');
}

export interface ApiError extends Error {
  status: number;
  code?: string;
  userId?: string;
  email?: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

async function request<T = any>(
  path: string,
  options: { method?: string; body?: any; headers?: Record<string, string> } = {},
  isRetry = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  let res: Response;
  try {
    res = await fetch(API_BASE + path, {
      method: options.method || 'GET',
      headers,
      credentials: 'include',
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error(
      `Could not reach ${API_BASE}. It may be down, or the browser may have blocked the response (CORS).`
    );
  }

  if (res.status === 401 && !isRetry && token && !isAuthPath(path)) {
    const fresh = await refreshAccessToken();
    if (fresh) return request(path, options, true);
  }

  let data: any = {};
  try { data = await res.json(); } catch { data = {}; }

  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`) as ApiError;
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

// Auth
export async function login(email: string, password: string, role: string) {
  const data = await request<{ accessToken: string; user: User }>('/api/auth/login', {
    method: 'POST', body: { email, password, role },
  });
  setSession(data.accessToken, data.user);
  return data.user;
}

export async function signup(role: string, fields: Record<string, any>) {
  const data = await request<{ accessToken: string; user: User }>(`/api/auth/signup/${role}`, {
    method: 'POST', body: fields,
  });
  setSession(data.accessToken, data.user);
  return data.user;
}

export async function relinkChild(childRollNumber: string, childName: string, childClass: string) {
  const data = await request<{ user: User }>('/api/auth/relink-child', {
    method: 'POST', body: { childRollNumber, childName, childClass },
  });
  if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

export function logout() {
  request('/api/auth/logout', { method: 'POST' }).catch(() => {});
  // Leave for the sign-in screen BEFORE the session goes. Clearing it first
  // let the current page's route guard fire and send a signed-out visitor to
  // "Create your account", which reads as if the account is gone.
  window.dispatchEvent(new CustomEvent('edulearn:navigate', { detail: { to: '/login', replace: true } }));
  clearSession();
}

// OTP
export function sendOtp(channel: string, emailOrPhone?: string, userId?: string) {
  const body: any = { channel };
  if (userId) body.userId = userId;
  else if (emailOrPhone) body.email = emailOrPhone;
  return request('/api/auth/send-otp', { method: 'POST', body });
}

export function verifyOtp(channel: string, code: string, emailOrPhone?: string, userId?: string) {
  const body: any = { channel, code };
  if (userId) body.userId = userId;
  else if (emailOrPhone) body.email = emailOrPhone;
  return request('/api/auth/verify-otp', { method: 'POST', body });
}

// Dashboard & Progress
export function getDashboard() { return request('/api/dashboard'); }
export async function getProgress() {
  const data = await request<{ progress: any }>('/api/progress');
  return data?.progress || null;
}
export async function saveProgress(fields: any) {
  const data = await request<{ progress: any }>('/api/progress', { method: 'PUT', body: fields });
  return data?.progress || null;
}

// Subscription (BestBrain Plus)
export function getSubscriptionConfig() {
  return request<{ subscriptionButtonId: string; pricePaise: number; currency: string; webhookConfigured: boolean }>(
    '/api/subscription/config'
  );
}
export function getSubscription() {
  return request<{ active: boolean; status: string; paidThrough: string | null; subscriptionId: string }>(
    '/api/subscription/me'
  );
}
export function getCoins() {
  return request<{ balance: number; recent: Array<{ delta: number; reason: string; balanceAfter: number; createdAt: string }> }>(
    '/api/coins'
  );
}

// Profile
export function me() { return request('/api/auth/me'); }
export function getProfile() { return request('/api/users/me'); }
export async function updateProfile(fields: any) {
  const data = await request<{ user: User }>('/api/users/me/profile', { method: 'PUT', body: fields });
  if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

// Live classes
export async function listLive() {
  const data = await request<{ sessions: any[] }>('/api/live');
  return data.sessions || [];
}
export async function createLive(fields: any) {
  const data = await request<{ session: any }>('/api/live', { method: 'POST', body: fields });
  return data.session;
}
export function joinLive(id: string) {
  return request(`/api/live/${id}/join`, { method: 'POST' });
}
export function joinLiveByCode(code: string) {
  return request('/api/live/join-by-code', { method: 'POST', body: { code } });
}
export function endLive(id: string) {
  return request(`/api/live/${id}/end`, { method: 'POST' });
}
export function liveRoster(id: string) {
  return request(`/api/live/${id}/roster`);
}

// Videos
export async function listVideos(filters: Record<string, string> = {}) {
  const qs = Object.entries(filters)
    .filter(([, v]) => v)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  const data = await request<{ videos: any[] }>('/api/videos' + (qs ? '?' + qs : ''));
  return data.videos || [];
}
export function recordVideoView(id: string) {
  request(`/api/videos/${id}/view`, { method: 'POST' }).catch(() => {});
}

// Notes, chapter notes (usually a PDF) a teacher uploaded. Same class/subject/
// topic filtering as videos; each note carries a `fileUrl` the lesson hub turns
// into a token-authed link.
export async function listNotes(filters: Record<string, string> = {}) {
  const qs = Object.entries(filters)
    .filter(([, v]) => v)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  const data = await request<{ notes: any[] }>('/api/notes' + (qs ? '?' + qs : ''));
  return data.notes || [];
}

// Live reports
export async function submitLiveReport(report: any) {
  try {
    const data = await request<{ report: any }>('/api/live/reports', { method: 'POST', body: report });
    return data?.report || null;
  } catch { return null; }
}
export async function listLiveReports(childId?: string) {
  try {
    const qs = childId ? `?childId=${encodeURIComponent(childId)}` : '';
    const data = await request<{ reports: any[] }>('/api/live/reports' + qs);
    return data?.reports || [];
  } catch { return []; }
}

// PAL AI
export function listPalSessions() { return request('/api/pal/sessions'); }
export function getPalSession(id: string) { return request(`/api/pal/sessions/${id}`); }
export function chatPal(message: string, sessionId?: string) {
  const body: any = { message };
  if (sessionId) body.sessionId = sessionId;
  return request('/api/pal/chat', { method: 'POST', body });
}
/**
 * AI Tutor (live doubt session), streams a voice-optimized PAL reply over SSE
 * (POST /api/pal/tutor/stream). EventSource can't POST, so this reads the
 * response body stream directly. Port of api.js's tutorStream, kept in sync
 * because the lifted tutor.js page script calls it via window.EduAPI.
 * Resolves { sessionId } when the stream finishes; rejects with status/code
 * set like request(). Retries once through the shared refresh flow on 401.
 */
export async function tutorStream(
  message: string,
  sessionId: string | null,
  handlers: { onChunk?: (text: string) => void; signal?: AbortSignal } = {},
  isRetry = false
): Promise<{ sessionId: string | null }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  let res: Response;
  try {
    res = await fetch(API_BASE + '/api/pal/tutor/stream', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(sessionId ? { message, sessionId } : { message }),
      signal: handlers.signal,
    });
  } catch (networkErr) {
    if ((networkErr as Error)?.name === 'AbortError') throw networkErr;
    throw new Error(
      `Could not reach ${API_BASE}. It may be down, or the browser may have blocked the response (CORS).`
    );
  }

  if (res.status === 401 && !isRetry && token) {
    const fresh = await refreshAccessToken();
    if (fresh) return tutorStream(message, sessionId, handlers, true);
  }

  if (!res.ok) {
    let data: any = {};
    try { data = await res.json(); } catch { data = {}; }
    const err = new Error(data.error || `Request failed (${res.status})`) as ApiError;
    err.status = res.status;
    err.code = data.code;
    throw err;
  }

  // Minimal SSE parser: frames separated by a blank line, each frame carrying
  // "event: <name>" and "data: <json>" lines (matches the backend's writer).
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  const result: { sessionId: string | null } = { sessionId: null };

  const handleFrame = (frame: string) => {
    let ev = 'message';
    let data = '';
    for (const line of frame.split('\n')) {
      if (line.startsWith('event: ')) ev = line.slice(7).trim();
      else if (line.startsWith('data: ')) data += line.slice(6);
    }
    let payload: any = {};
    try { payload = JSON.parse(data || '{}'); } catch { /* keep {} */ }
    if (ev === 'chunk') {
      if (handlers.onChunk && payload.text) handlers.onChunk(payload.text);
    } else if (ev === 'done') {
      result.sessionId = payload.sessionId || null;
    } else if (ev === 'error') {
      // The stream already sent a 200, so errors arrive as events.
      const serr = new Error(payload.error || 'PAL is unavailable right now') as ApiError;
      serr.code = payload.code;
      throw serr;
    }
  };

  for (;;) {
    const r = await reader.read();
    if (r.done) break;
    buf += decoder.decode(r.value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\n\n')) !== -1) {
      const frame = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      if (frame.trim()) handleFrame(frame);
    }
  }
  return result;
}

export function renamePalSession(id: string, title: string) {
  return request(`/api/pal/sessions/${id}`, { method: 'PATCH', body: { title } });
}
export function deletePalSession(id: string) {
  return request(`/api/pal/sessions/${id}`, { method: 'DELETE' });
}

// Assessments - Mock tests
export function startMockTest(subject: string, chapterSlug?: string, count?: number) {
  const body: any = { subject };
  if (chapterSlug) body.chapterSlug = chapterSlug;
  if (count) body.count = count;
  return request('/api/assessments/mock/start', { method: 'POST', body });
}
export function answerMockQuestion(attemptId: string, index: number, chosenIndex: number) {
  return request(`/api/assessments/mock/${attemptId}/answer`, {
    method: 'POST', body: { index, chosenIndex },
  });
}
export function submitMockTest(attemptId: string, answers: any[]) {
  return request(`/api/assessments/mock/${attemptId}/submit`, { method: 'POST', body: { answers } });
}
export function recordMockAttempt(fields: any) {
  return request('/api/assessments/mock/record', { method: 'POST', body: fields });
}
export function getMockHistory() { return request('/api/assessments/mock/history'); }
export function createQuestion(fields: any) {
  return request('/api/assessments/questions', { method: 'POST', body: fields });
}

// Assessments - Arena / Challenge
// Assessments - Question bank
//
// These live here as well as in the static edulearn-frontend/api.js because
// the two clients are separate: the static pages load api.js, while the React
// app publishes window.EduAPI from THIS module (see eduApiGlobal.ts). A method
// added to only one of them exists on only one of the two sites, which is
// exactly how the homework dot on Learn came out blank the first time.
export function getQuestionBank(subject: string, chapterSlug?: string, count?: number, difficulty?: string) {
  const qs = new URLSearchParams({ subject });
  if (chapterSlug) qs.set('chapterSlug', chapterSlug);
  if (count) qs.set('count', String(count));
  if (difficulty) qs.set('difficulty', difficulty);
  return request(`/api/assessments/bank?${qs.toString()}`);
}
export function answerBankQuestion(questionId: string, chosenIndex: number) {
  return request('/api/assessments/bank/answer', { method: 'POST', body: { questionId, chosenIndex } });
}
export function getBankChapterCounts(subject: string) {
  return request(`/api/assessments/bank/chapters?subject=${encodeURIComponent(subject)}`);
}
export function listQuestions(className?: string, subject?: string, chapterSlug?: string, usage?: string) {
  const qs = new URLSearchParams();
  if (className) qs.set('className', className);
  if (subject) qs.set('subject', subject);
  if (chapterSlug) qs.set('chapterSlug', chapterSlug);
  if (usage) qs.set('usage', usage);
  const q = qs.toString();
  return request('/api/assessments/questions' + (q ? `?${q}` : ''));
}

// Homework
export function getAssignedHomework(subject?: string, chapterSlug?: string) {
  const qs = new URLSearchParams();
  if (subject) qs.set('subject', subject);
  if (chapterSlug) qs.set('chapterSlug', chapterSlug);
  const q = qs.toString();
  return request('/api/homework/assigned' + (q ? `?${q}` : ''));
}
export function getHomework(id: string) { return request(`/api/homework/${id}`); }
export function submitHomework(id: string, answers: any[]) {
  return request(`/api/homework/${id}/submit`, { method: 'POST', body: { answers } });
}
export function createHomework(payload: Record<string, any>) {
  return request('/api/homework', { method: 'POST', body: payload });
}
export function listHomework(className?: string, subject?: string) {
  const qs = new URLSearchParams();
  if (className) qs.set('className', className);
  if (subject) qs.set('subject', subject);
  const q = qs.toString();
  return request('/api/homework' + (q ? `?${q}` : ''));
}
export function updateHomework(id: string, patch: Record<string, any>) {
  return request(`/api/homework/${id}`, { method: 'PATCH', body: patch });
}
export function deleteHomework(id: string) {
  return request(`/api/homework/${id}`, { method: 'DELETE' });
}
export function getHomeworkSubmissions(id: string) {
  return request(`/api/homework/${id}/submissions`);
}

export function getChallenge() { return request('/api/assessments/challenge'); }
export function answerChallenge(questionId: string, chosenIndex: number, msTaken: number) {
  return request('/api/assessments/challenge/answer', {
    method: 'POST', body: { questionId, chosenIndex, msTaken },
  });
}
export function getChallengeLeaderboard() { return request('/api/assessments/challenge/leaderboard'); }

/**
 * Port of api.js's requireAuth, kept because the lifted page scripts call it.
 *
 * ProtectedRoute already enforces this before a page mounts, so in practice
 * this only ever returns the user. The redirects stay for the cases the router
 * cannot see, a page script asserting a specific role for itself, and go
 * through the SPA by dispatching to the shim rather than reloading the app.
 */
export function requireAuth(requiredRole?: string): User | null {
  const user = getUser();
  if (!getToken() || !user) {
    window.dispatchEvent(new CustomEvent('edulearn:navigate', { detail: { to: '/login', replace: true } }));
    return null;
  }
  if (requiredRole && user.role !== requiredRole) {
    window.dispatchEvent(new CustomEvent('edulearn:navigate', { detail: { to: '/dashboard', replace: true } }));
    return null;
  }
  return user;
}
