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
            <div className="orb" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="9" r="4" fill="#3DE8C5" />
                <line x1="50" y1="21" x2="50" y2="12" stroke="#7C9BFF" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="50" cy="56" r="34" fill="#121C30" stroke="url(#auroraGrad)" strokeWidth="2.5" />
                <rect className="blink blink-l" x="36" y="44" width="8" height="14" rx="4" fill="#F2EDE3" />
                <rect className="blink blink-r" x="56" y="44" width="8" height="14" rx="4" fill="#F2EDE3" />
                <path d="M42 67 q8 7 16 0" fill="none" stroke="#F2EDE3" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
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
