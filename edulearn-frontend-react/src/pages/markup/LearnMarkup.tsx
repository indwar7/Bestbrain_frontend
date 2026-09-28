/* Generated from edulearn-frontend/learn.html, do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function LearnMarkup() {
  return (
    <>
      {/* ===== shared SVG defs (aurora gradient referenced everywhere) ===== */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3DE8C5" />
            <stop offset="48%" stopColor="#7C9BFF" />
            <stop offset="100%" stopColor="#FFB454" />
          </linearGradient>
        </defs>
      </svg>
      {/* ===== atmosphere ===== */}
      <div className="blobs" aria-hidden="true">
        <div className="blob blob--teal" />
        <div className="blob blob--peri" />
        <div className="blob blob--amber" />
      </div>
      <svg className="grain" aria-hidden="true" width="100%" height="100%">
        <filter id="grainF">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainF)" />
      </svg>
      {/* ============================================================
       NAV
       ============================================================ */}
      <main className="wrap">
        {/* ============================================================
         HERO STRIP
         ============================================================ */}
        <section className="hero">
          <div className="hero__crumb mono rv" style={{ animationDelay: ".05s" }}>
            <span style={{ color: "var(--cream)" }}>
              Learn
            </span>
          </div>
          <div className="hero__row">
            <div className="hero__lead">
              <h1 className="hero__title rv" style={{ animationDelay: ".12s" }} data-i18n="hero_title">
                {"Choose your "}
                <em>
                  battlefield.
                </em>
              </h1>
              <p className="hero__sub rv" style={{ animationDelay: ".18s" }}>
                Pick a subject to open its chapters, watch the lecture, read the notes, and pick up right where you left off. Your whole syllabus, in one place.
              </p>
            </div>
            <div className="hero__chips">
              <div className="chip chip--gold rv" style={{ animationDelay: ".22s" }}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2.5" />
                  <path d="M7 11 V7 a5 5 0 0 1 9.9 -1" />
                  <circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" />
                </svg>
                {' '}
                <span data-i18n="chip1">
                  One subscription, all classes unlocked
                </span>
              </div>
              <div className="chip chip--soft rv" style={{ animationDelay: ".3s" }}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12 h6 m6 0 h6" />
                  <path d="M9 12 a3 3 0 0 1 6 0 a3 3 0 0 1 -6 0" />
                  <path d="M12 3 v3 m0 12 v3" />
                </svg>
                {' '}
                <span data-i18n="chip2">
                  Study ahead or revisit any class, no stigma
                </span>
              </div>
            </div>
          </div>
          {/* class switcher */}
          <div
            className="classes rv"
            style={{ animationDelay: ".38s" }}
            id="classTabs"
            role="group"
            aria-label="Class"
           />
        </section>
        {/* ============================================================
         SPLIT: browser + sticky panel
         ============================================================ */}
        <section className="split">
          <div id="contentArea">
            {/* subject rail */}
            <div className="rail" id="subjectRail" role="group" aria-label="Subject" />
            {/* list head + search */}
            <div className="listhead">
              <h2 className="listhead__title" id="listTitle" aria-live="polite" />
              <div className="search">
                <svg
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
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21 l-4.3 -4.3" />
                </svg>
                {' '}
                <input
                  type="text"
                  id="searchInput"
                  data-i18n-ph="search_ph"
                  placeholder="Search Class 9 chapters..."
                  aria-label="Search chapters"
                  autoComplete="off"
                 />
              </div>
            </div>
            {/* chapter rows */}
            <div className="chapters" id="chapterList" />
            {/* empty state */}
            <div className="empty" id="emptyState">
              <div id="emptyTokky" />
              <div>
                <div className="empty__title" data-i18n="empty_title">
                  No chapters found
                </div>
                <div className="empty__hint">
                  <span data-i18n="empty_pre">
                    Tokky suggests ,
                  </span>
                  {' '}
                  <button type="button" id="trySuggest" />
                </div>
              </div>
            </div>
          </div>
          {/* ===== sticky side panel ===== */}
          <aside className="panel">
            <div className="pcard io" id="continueCard">
              <div className="pcard__eyebrow" data-i18n="continue_title">
                Continue learning
              </div>
              <div className="continue" id="continueBody" />
            </div>
            <div className="pcard pcard--tokky io" style={{ transitionDelay: ".2s" }}>
              <div id="panelTokky" />
              <p>
                <strong data-i18n="tokky_name">
                  Tokky says:
                </strong>
                {' '}
                <span id="tokkyTip" />
              </p>
            </div>
          </aside>
        </section>
      </main>
      {/* ============================================================
       FOOTER
       ============================================================ */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__mark" aria-hidden="true">
            BestBrain
          </div>
          <div className="footer__cols io">
            <div className="footer__brandcol">
              <a className="brand" href="index.html">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 1.5 L14.6 9.4 L22.5 12 L14.6 14.6 L12 22.5 L9.4 14.6 L1.5 12 L9.4 9.4 Z"
                    fill="url(#auroraGrad)"
                   />
                </svg>
                {' '}
                <span className="brand__word" style={{ fontSize: "19px" }}>
                  BestBrain
                </span>
              </a>
              <p className="footer__tag" data-i18n="footer_tag">
                Made for Bharat. Works fully offline.
              </p>
              <p className="footer__boards">
                CBSE · NCERT · 20+ State Boards
              </p>
            </div>
            <div className="fcol">
              <h4>
                Product
              </h4>
              <ul>
                <li>
                  <a href="learn.html" data-i18n="nav_learn">
                    Learn
                  </a>
                </li>
                <li>
                  <a href="live.html" data-i18n="nav_live">
                    Live
                  </a>
                </li>
                <li>
                  <a href="challenge.html" data-i18n="nav_arena">
                    Arena
                  </a>
                </li>
                <li>
                  <a href="mocktest.html" data-i18n="nav_tests">
                    Tests
                  </a>
                </li>
                <li>
                  <a href="pal.html" data-i18n="nav_pal">
                    PAL AI
                  </a>
                </li>
                <li>
                  <a href="dashboard.html" data-i18n="nav_dash">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="index.html">
                    Pricing - ₹299/mo
                  </a>
                </li>
              </ul>
            </div>
            <div className="fcol" id="footerClasses">
              <h4>
                Classes
              </h4>
              <ul>
                <li>
                  <a href="learn.html?class=6">
                    Class 6
                  </a>
                </li>
                <li>
                  <a href="learn.html?class=7">
                    Class 7
                  </a>
                </li>
                <li>
                  <a href="learn.html?class=8">
                    Class 8
                  </a>
                </li>
                <li>
                  <a href="learn.html?class=9">
                    Class 9
                  </a>
                </li>
              </ul>
            </div>
            <div className="fcol">
              <h4>
                Company
              </h4>
              <ul>
                <li>
                  <a href="index.html">
                    About us
                  </a>
                </li>
                <li>
                  <a href="index.html">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="index.html">
                    For schools
                  </a>
                </li>
                <li>
                  <a href="index.html">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="fcol">
              <h4>
                Languages
              </h4>
              <ul>
                <li>
                  <span>
                    हिंदी
                  </span>
                </li>
                <li>
                  <span>
                    தமிழ்
                  </span>
                </li>
                <li>
                  <span>
                    తెలుగు
                  </span>
                </li>
                <li>
                  <span>
                    বাংলা
                  </span>
                </li>
                <li>
                  <span>
                    मराठी
                  </span>
                </li>
                <li>
                  <span>
                    ગુજરાતી
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer__base">
            <span className="mono">
              © 2026 BestBrain Learning Pvt. Ltd. · Noida, India
            </span>
            {' '}
            <span className="mono">
              CBSE · NCERT · 20+ State Boards
            </span>
          </div>
        </div>
      </footer>
      {' '}
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
