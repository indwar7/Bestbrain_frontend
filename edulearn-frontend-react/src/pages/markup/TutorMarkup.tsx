/* Generated from edulearn-frontend/tutor.html, do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function TutorMarkup() {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3DE8C5" />
            <stop offset="48%" stopColor="#7C9BFF" />
            <stop offset="100%" stopColor="#FFB454" />
          </linearGradient>
        </defs>
      </svg>
      {' '}
      <div className="call">
        {/* ============ CALL STAGE ============ */}
        <section className="stage" id="stage" aria-live="polite">
          <div className="stage__label">
            <span className="livepill">
              <span className="dot" />
              {" Live doubt session"}
            </span>
          </div>
          <div className="orbwrap">
            <span className="ring ring--1" />
            {' '}
            <span className="ring ring--2" />
            {' '}
            <span className="ring ring--3" />
            <div className="orb orb--avatar" aria-hidden="true">
              {/* AI teacher avatar. The mouth shape is driven from JS (data-mouth
               on #avatar) while the TTS voice talks; everything else (blink,
               listening tilt, thinking brows, speaking nod) is CSS off the
               stage's is-* state classes. */}
              <svg id="avatar" className="av" viewBox="0 0 200 200" data-mouth="rest">
                <defs>
                  <clipPath id="avClip">
                    <circle cx="100" cy="100" r="100" />
                  </clipPath>
                </defs>
                <g clipPath="url(#avClip)">
                  <circle cx="100" cy="100" r="100" fill="#E6F4F1" />
                  <circle cx="100" cy="100" r="78" fill="#D5EEE8" />
                  {/* body */}
                  <path d="M34 200 Q38 152 100 146 Q162 152 166 200 Z" fill="#0F766E" />
                  <path d="M84 147 L100 170 L116 147 Z" fill="#0B5A54" />
                  <path d="M118 148 Q150 156 160 200 L138 200 Q132 168 112 152 Z" fill="#F59E0B" opacity=".92" />
                  <rect x="89" y="124" width="22" height="28" rx="9" fill="#C8906E" />
                  <g className="av-head">
                    {/* hair behind + bun */}
                    <circle cx="100" cy="40" r="20" fill="#2A1A16" />
                    <ellipse cx="100" cy="88" rx="44" ry="48" fill="#2A1A16" />
                    {/* ears + earrings */}
                    <ellipse cx="62" cy="96" rx="6" ry="9" fill="#D39A76" />
                    <ellipse cx="138" cy="96" rx="6" ry="9" fill="#D39A76" />
                    <circle cx="62" cy="108" r="2.6" fill="#F59E0B" />
                    <circle cx="138" cy="108" r="2.6" fill="#F59E0B" />
                    {/* face */}
                    <ellipse cx="100" cy="94" rx="37" ry="42" fill="#DDA582" />
                    {/* hair front, side parting */}
                    <path
                      d="M61 92 Q58 50 100 47 Q142 50 139 92 Q134 68 114 60 Q98 72 72 72 Q64 80 61 92 Z"
                      fill="#2A1A16"
                     />
                    {/* brows */}
                    <g className="av-brows" stroke="#2A1A16" strokeWidth="3" strokeLinecap="round" fill="none">
                      <path d="M75 78 Q84 73 93 77" />
                      <path d="M107 77 Q116 73 125 78" />
                    </g>
                    {/* eyes */}
                    <g className="av-eyes" fill="#2A1A16">
                      <ellipse className="av-eye" cx="84" cy="90" rx="4.3" ry="5.2" />
                      <ellipse className="av-eye" cx="116" cy="90" rx="4.3" ry="5.2" />
                    </g>
                    <circle cx="85.6" cy="88.2" r="1.3" fill="#fff" />
                    <circle cx="117.6" cy="88.2" r="1.3" fill="#fff" />
                    {/* glasses */}
                    <g stroke="#334155" strokeWidth="1.8" fill="none">
                      <rect x="72" y="80" width="24" height="20" rx="8" />
                      <rect x="104" y="80" width="24" height="20" rx="8" />
                      <path d="M96 88 Q100 85 104 88" />
                    </g>
                    {/* nose + cheeks */}
                    <path
                      d="M100 95 Q96.5 106 101 108"
                      stroke="#B87A5A"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                     />
                    <circle cx="78" cy="108" r="6" fill="#E57F72" opacity=".22" />
                    <circle cx="122" cy="108" r="6" fill="#E57F72" opacity=".22" />
                    {/* mouth: one shape per viseme, CSS shows the one data-mouth names */}
                    <g className="av-mouth">
                      <path
                        className="m-rest"
                        d="M89 119 Q100 127 111 119"
                        stroke="#9A3B3B"
                        strokeWidth="2.6"
                        fill="none"
                        strokeLinecap="round"
                       />
                      <path
                        className="m-m"
                        d="M91 121 Q100 123 109 121"
                        stroke="#9A3B3B"
                        strokeWidth="2.6"
                        fill="none"
                        strokeLinecap="round"
                       />
                      <g className="m-a">
                        <path d="M89 118 Q100 116 111 118 Q107 133 100 133 Q93 133 89 118 Z" fill="#6B1F2A" />
                        <path d="M92 119 Q100 118 108 119 L107 122 Q100 121 93 122 Z" fill="#fff" />
                        <ellipse cx="100" cy="129" rx="5" ry="2.6" fill="#D9566B" />
                      </g>
                      <g className="m-e">
                        <path d="M87 119 Q100 115 113 119 Q100 128 87 119 Z" fill="#6B1F2A" />
                        <path d="M90 119 Q100 117 110 119 L109 121 Q100 120 91 121 Z" fill="#fff" />
                      </g>
                      <ellipse className="m-o" cx="100" cy="121" rx="5.5" ry="7" fill="#6B1F2A" />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <div className="avname">
            {"PAL "}
            <span>
              · your AI teacher
            </span>
          </div>
          <div className="eq" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="status" id="statusText">
            Tap the mic and ask your doubt
          </div>
          <div className="caption" id="caption">
            PAL listens, thinks, and answers out loud, like a teacher on a call.
          </div>
          <div className="controls">
            <button
              className="ctl"
              id="typeToggle"
              type="button"
              aria-label="Type instead"
              title="Type instead"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
                <path d="M6.5 10h.01M10.2 10h.01M13.9 10h.01M17.6 10h.01M7.5 14h9" />
              </svg>
            </button>
            {' '}
            <button className="ctl ctl--mic" id="micBtn" type="button" aria-label="Start or stop listening">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="2.5" width="6" height="11.5" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3.5" />
              </svg>
            </button>
            {' '}
            <button
              className="ctl ctl--end"
              id="endBtn"
              type="button"
              aria-label="End session"
              title="End session"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M3 12c5.5-5 12.5-5 18 0l-2.6 2.9a1.8 1.8 0 0 1-2.3.3l-1.6-1a1.8 1.8 0 0 1-.8-1.7l.1-1.1a13.4 13.4 0 0 0-3.6 0l.1 1.1a1.8 1.8 0 0 1-.8 1.7l-1.6 1a1.8 1.8 0 0 1-2.3-.3Z"
                 />
              </svg>
            </button>
          </div>
          <form className="typebar" id="typeBar">
            <input
              id="typeInput"
              type="text"
              placeholder="Type your doubt…"
              aria-label="Type your doubt"
              autoComplete="off"
             />
            {' '}
            <button className="go" type="submit">
              Ask
            </button>
          </form>
          <div className="hint" id="micHint">
            Speak naturally in English, Hindi or Hinglish, tap the mic again to interrupt PAL.
          </div>
        </section>
        {/* ============ TRANSCRIPT ============ */}
        <aside className="transcript">
          <div className="transcript__head">
            <span className="transcript__title">
              Transcript
            </span>
            {' '}
            <select className="langsel" id="langSel" aria-label="Voice language">
              <option value="en-IN">
                English (India)
              </option>
              <option value="hi-IN">
                हिन्दी
              </option>
            </select>
          </div>
          <div className="tlist" id="tList" />
          <div className="transcript__foot">
            This call is saved to your PAL history so you can revisit the answers. PAL can make mistakes, verify with your textbook before exams.
          </div>
        </aside>
      </div>
      {' '}
      {' '}
      {' '}
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
