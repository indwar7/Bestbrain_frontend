# BestBrain, local preview (demo only)

A redesigned skin for the existing site, rendered **at runtime on localhost**.
Nothing in this folder runs unless you start it by hand.

## Safety, read this first

- **No page in the repo is modified.** This folder is additive; `git diff` on
  the app itself is empty. Pull this branch and the site behaves exactly as it
  did before.
- **Nothing starts automatically.** It is not in any npm script, build step,
  CI job, deploy or `<script>` tag. Stop the process and the site is
  byte-for-byte what git has.
- **Loopback only.** The server binds to `127.0.0.1`, so even if it is started
  on a host by mistake it cannot be reached from outside that machine.
- **Do not run it in production.** `/api/auth/login` here accepts *any* email
  and password, that is the point of an offline demo, and exactly why it must
  never sit on a public interface.

## Run it

```bash
node preview/preview-server.mjs      # from the repo root
# → http://localhost:5500
```

Node 18+, no dependencies, no install step. `Ctrl-C` to stop.

## How it works

The server reads files straight from this checkout and rewrites each `.html`
response **in memory** on the way out, adding the scripts below. The files on
disk are never written to.

| file | what it does |
|---|---|
| `boot.js` | first thing in `<head>`: paints the canvas dark before any stylesheet parses, so switching pages never flashes white |
| `session.js` | seeds a demo student session and points `api.js` at this server |
| `kid-bg.js` | the animated sky (stars, science icons, formulas), dark design tokens, and the passes that keep every surface seamless and every glyph readable |
| `kid-ui.js` | glass design system, sidebar rail, top HUD |
| `kid-home.js` | the redesigned homepage (`index.html` only) |
| `kid-auth.js` | login / signup, rebuilt as a split screen |
| `kid-call.js` | the AI-tutor call skin |
| `kid-quiz.js` | "Test" → "Quiz" wording, clearer answer options, and the explainer video that plays on a wrong answer |
| `probe.js` | debugging only, opt-in via `?__probe=1`; never loads otherwise |

The passes in `kid-bg.js` are deliberately **measured, not hard-coded**: full
bleed slabs are found by shape, blue is found by hue, and ink colour is chosen
by comparing the contrast of white and black against the surface actually
painted behind each piece of text. That is why the skin holds up on pages it
was never specifically written for.

## Offline demo endpoints

The real backend needs production CORS and a real JWT, so the preview answers a
few routes itself, in exactly the shape `api.js` expects:

- `POST /api/auth/login`, `/api/auth/signup/:role`, `/api/auth/send-otp`,
  `/api/auth/verify-otp`, any credentials succeed
- `POST /api/pal/tutor/stream`, an on-device Class 6 tutor, streamed as SSE

Every other `/api/*` call returns `503 {"code":"DEMO"}` so the UI shows its
normal "backend not connected" state instead of hanging.
