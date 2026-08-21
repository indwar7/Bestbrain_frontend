# Fixing login/signup on bestbrainplus.com (Hostinger)

## What's actually broken

`bestbrainplus.com` is served by **Hostinger** (its DNS points at Hostinger's
IPs, and the site's HTML/CSS/JS come from there), not by Vercel — even though
this repo's `vercel.json` still assumes Vercel is the one serving traffic.

`vercel.json` contains the rule that forwards `/backend-api/*` (and
`/socket.io/*`) to the real backend on EC2. That rule only means something to
Vercel. Hostinger has never read it, so every login/signup/API call the
frontend makes hits Hostinger's own server on a path nothing is listening on
— which is the "503, server is temporarily busy" page you were seeing (it
just showed up as a stuck "Creating account…" with no visible error, because
the app has no timeout/error UI for a proxy that fails at the hosting layer
rather than the API layer).

The backend itself is healthy — confirmed directly against the EC2 box,
responses come back in ~100ms.

## The fix: two files, try them in order

### 1. `htaccess-snippet.txt` — try this first

Open (or create) the `.htaccess` file in the **same directory as
bestbrainplus.com's live `index.html`** on Hostinger (hPanel → File Manager,
or FTP), and paste in the contents of `htaccess-snippet.txt`. If a
`.htaccess` already exists there, add to it — don't replace it.

Then test: visit `https://bestbrainplus.com/backend-api/api/health`.
- **Fixed:** you see `{"status":"ok","service":"edulearn-backend"}`
- **Still broken (Hostinger's 503 page):** something didn't save/upload right — double check the file landed in the right directory.
- **500 error:** this hosting plan has Apache's `mod_proxy` disabled. Use step 2 instead.

### 2. `backend-api-proxy.php` — fallback if step 1 gives a 500

1. Upload `backend-api-proxy.php` to that same directory.
2. Add this to `.htaccess` instead of the block from step 1:
   ```
   RewriteEngine On
   RewriteCond %{REQUEST_URI} ^/backend-api/
   RewriteRule ^backend-api/(.*)$ backend-api-proxy.php?path=$1 [QSA,L]
   ```
3. Test the same URL as above.

I ran this script locally against the real production backend (both a GET
and a POST signup call) before handing it over — it correctly passes through
status codes and JSON bodies.

**Limitation:** this PHP fallback does not support WebSockets, so
`/socket.io/*` (the live-class real-time connection) will still be broken
under it — PHP's request/response model can't hold a socket open. If live
classes need to work, step 1 (or moving API traffic off Hostinger) is the
only real fix for that part.

## This isn't the whole story

Fixing the proxy makes login/signup work again, but it doesn't address the
bigger mismatch: **whatever currently publishes to Hostinger is a separate,
disconnected process from `git push` → Vercel.** Hostinger's copy of the site
right now doesn't have the last two rounds of changes I made and pushed to
`origin/main` (the mobile nav, the new feature cards, this branding work).
Until that's reconciled — either by finding and re-running whatever process
uploads to Hostinger, or by switching Hostinger to actually proxy the whole
site through Vercel rather than hosting a static copy — every future push
will keep landing on Vercel while bestbrainplus.com keeps showing something
older. Worth flagging to whoever set up the Hostinger side originally.
