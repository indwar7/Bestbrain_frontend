# BestBrainplus

**Learn smarter, score better.** An iPrep-style K-12 learning platform for Bharat — CBSE / NCERT + 20 state boards, Classes 6–9, built mobile-first and offline-first, with adaptive AI at its core.

### Live demo



> Tip: open the live URL (not the local file) so the camera-based attention monitoring works — webcam access needs HTTPS.

---

## What's inside

A working web prototype. Every page is self-contained HTML/CSS/JS with a shared dark/light theme and bilingual (English / हिंदी) UI. State persists per-browser via `localStorage`.

| Page | What it does |
|---|---|
| [`index.html`](edulearn-frontend/index.html) | Animated, character-driven landing page (web + mobile showcase) |
| [`learn.html`](edulearn-frontend/learn.html) | Course browser — Classes 6–9 × 5 subjects, ~190 NCERT chapters, search, progress |
| [`live.html`](edulearn-frontend/live.html) | Live classes — booking + calendar invite, in-app classroom, **AI camera attention monitoring** |
| [`pal.html`](edulearn-frontend/pal.html) | PAL — a GPT-style AI assistant with Student / Parent / Teacher modes |
| [`challenge.html`](edulearn-frontend/challenge.html) | Arena — one timed question every hour, speed scoring, streaks, leaderboard |
| [`mocktest.html`](edulearn-frontend/mocktest.html) | Progressive (adaptive) mock tests — difficulty rises and falls with the student |
| [`dashboard.html`](edulearn-frontend/dashboard.html) | Role dashboards — Student, Parent, Teacher |
| [`lesson.html`](edulearn-frontend/lesson.html) | Lesson player (AI animated video lectures — in progress) |
| [`login.html`](edulearn-frontend/login.html) · [`signup.html`](edulearn-frontend/signup.html) | Auth screens |

A floating **Features** button on every page opens a full feature tour, with a link to jump straight to each module.

## Highlight features

- **AI attention monitoring** — real webcam gaze detection during live classes (consent-first; video stays on the device, only the focus score is saved) → report sent to parent and teacher.
- **PAL AI assistant** — ask doubts, get notes, summaries and quizzes; separate Student / Parent / Teacher experiences.
- **Adaptive mock tests** — answer well and questions get harder; struggle and they step back, with a visible difficulty ladder.
- **Hourly Arena** — the whole school sees the same question each hour with a 45-second window; speed is the anti-cheat.
- **Bharat-first** — dark/light themes, English / Hindi UI, designed for offline use.

## Tech

Plain HTML, CSS and vanilla JavaScript — no build step, no framework. Shared theming lives in [`theme.css`](theme.css) and [`theme.js`](theme.js); the feature tour in [`features-panel.js`](features-panel.js). Deployed as static files on **Vercel** (auto-deploys on every push to `main`).

## Run locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/> (redirects to the landing page).

## Roadmap

- AI animated video lectures wired into the lesson player
- Live LLM API behind PAL
- Offline-first PWA + Android app with chapter downloads
- Phone-OTP auth, UPI payments, school-admin dashboard

---

© 2026 EduLearn Learning Pvt. Ltd. · Made for Bharat
