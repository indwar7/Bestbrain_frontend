/* Generated from edulearn-frontend/videos.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function VideosMarkup() {
  return (
    <>
      <div className="wrap">
        <div className="top">
          <div>
            <h1>
              {"Video "}
              <em>
                Lectures
              </em>
            </h1>
            <p className="sub" id="sub">
              Loading your lectures…
            </p>
          </div>
          <a className="btn ghost" href="dashboard.html">
            ← Dashboard
          </a>
        </div>
        <div className="toolbar">
          {/* Demo/reviewer only: switch which class's library is shown. Hidden for
             real students, who stay locked to their own class. */}
          <div className="filters" id="classToggle" style={{ display: "none" }} aria-label="Class" />
          <div className="filters" id="filters" />
          <div className="grow" />
          <div className="search">
            <svg
              className="sicon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input id="search" type="search" placeholder="Search lectures…" aria-label="Search lectures" />
          </div>
          <div className="vtoggle" role="tablist" aria-label="View">
            <button id="viewRows" className="on" title="Shelves view" aria-label="Shelves view">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
              </svg>
            </button>
            {' '}
            <button id="viewGrid" title="Grid view" aria-label="Grid view">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            {' '}
            <button id="viewList" title="List view" aria-label="List view">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 6h13" />
                <path d="M8 12h13" />
                <path d="M8 18h13" />
                <path d="M3 6h.01" />
                <path d="M3 12h.01" />
                <path d="M3 18h.01" />
              </svg>
            </button>
          </div>
        </div>
        <div id="errBox" />
        <div id="stage" />
      </div>
      <div className="modal" id="modal">
        <div className="player">
          <div className="vidwrap" id="vidwrap">
            <video id="player" playsInline={true} />
            <div className="center-play" id="centerPlay">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            </div>
            <div className="controls" id="controls">
              <input
                type="range"
                id="seek"
                className="seek"
                min="0"
                max="100"
                defaultValue="0"
                step="0.1"
                aria-label="Seek"
               />
              <div className="ctrl-row">
                <button className="cbtn" id="btnPlay" title="Play/Pause (Space)" aria-label="Play or pause">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </button>
                {' '}
                <button className="cbtn" id="btnBack" title="Back 10s (←)" aria-label="Back 10 seconds">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="11 19 2 12 11 5 11 19" />
                    <polygon points="22 19 13 12 22 5 22 19" />
                  </svg>
                  <small>
                    10
                  </small>
                </button>
                {' '}
                <button className="cbtn" id="btnFwd" title="Forward 10s (→)" aria-label="Forward 10 seconds">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="13 19 22 12 13 5 13 19" />
                    <polygon points="2 19 11 12 2 5 2 19" />
                  </svg>
                  <small>
                    10
                  </small>
                </button>
                {' '}
                <span className="time" id="time">
                  0:00 / 0:00
                </span>
                <div className="spacer" />
                <div className="vol">
                  <button className="cbtn" id="btnMute" title="Mute (M)" aria-label="Mute or unmute">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  </button>
                  {' '}
                  <input
                    type="range"
                    id="volume"
                    className="volbar"
                    min="0"
                    max="1"
                    step="0.05"
                    defaultValue="1"
                    aria-label="Volume"
                   />
                </div>
                <select
                  id="speed"
                  className="speed"
                  title="Playback speed"
                  aria-label="Playback speed"
                  defaultValue="1"
                >
                  <option value="0.5">
                    0.5×
                  </option>
                  <option value="1">
                    1×
                  </option>
                  <option value="1.25">
                    1.25×
                  </option>
                  <option value="1.5">
                    1.5×
                  </option>
                  <option value="2">
                    2×
                  </option>
                </select>
                {' '}
                <button className="cbtn" id="btnFull" title="Fullscreen (F)" aria-label="Toggle fullscreen">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="pbar">
            <h3 id="playerTitle" />
            <button className="x" id="closePlayer" aria-label="Close">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Settings + logout. Needs api.js above it, and it renders nothing
         when nobody is signed in. kid-ui moves its buttons into the rail. */}
      {' '}
      {' '}
      {' '}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A88F" />
            <stop offset="48%" stopColor="#3F5BE0" />
            <stop offset="100%" stopColor="#C99A2E" />
          </linearGradient>
        </defs>
      </svg>
      {/* Redesign: look only. Every screen keeps the layout it already has. */}
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
      {' '}
    </>
  );
}
