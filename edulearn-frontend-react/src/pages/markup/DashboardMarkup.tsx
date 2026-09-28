/* Generated from edulearn-frontend/dashboard.html, do not hand-edit.
   Regenerate with `npm run sync:markup`. */
import type { CSSProperties } from 'react';

export default function DashboardMarkup() {
  return (
    <>
      {/* ======== atmosphere ======== */}
      <div className="blobs" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>
      <svg className="grain" aria-hidden="true" width="100%" height="100%">
        <filter id="grainF">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainF)" />
      </svg>
      {/* shared svg defs */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="auroraG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3DE8C5" />
            <stop offset="48%" stopColor="#7C9BFF" />
            <stop offset="100%" stopColor="#FFB454" />
          </linearGradient>
          <linearGradient id="auroraRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3DE8C5" />
            <stop offset="55%" stopColor="#7C9BFF" />
            <stop offset="100%" stopColor="#FFB454" />
          </linearGradient>
          <linearGradient id="barAurora" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3DE8C5" />
            <stop offset="60%" stopColor="#7C9BFF" />
            <stop offset="100%" stopColor="#FFB454" />
          </linearGradient>
          <linearGradient id="areaFillG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3DE8C5" stopOpacity=".32" />
            <stop offset="60%" stopColor="#7C9BFF" stopOpacity=".10" />
            <stop offset="100%" stopColor="#7C9BFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="areaLineG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3DE8C5" />
            <stop offset="100%" stopColor="#7C9BFF" />
          </linearGradient>
          <linearGradient id="flameG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFB454" />
            <stop offset="100%" stopColor="#FF7AA2" />
          </linearGradient>
        </defs>
      </svg>
      {/* ============================================================
       NAV
  ============================================================ */}
      <main className="shell">
        {/* ============================================================
         TOP STRIP, greeting · streak · sync · role switcher
    ============================================================ */}
        <header className="topstrip">
          <div className="greet pl" style={{ '--d': "160ms" } as CSSProperties}>
            <h1 id="greetLine">
              {"Good "}
              <em>
                evening
              </em>
              , Ananya.
            </h1>
            <div className="greet-sub">
              <span className="mono greet-date" id="greetDate">
                TUESDAY · 10 JUNE
              </span>
              {' '}
              <span className="streak" title="Learning streak">
                <svg
                  className="flame"
                  width="16"
                  height="18"
                  viewBox="0 0 24 26"
                  fill="rgba(255,180,84,.16)"
                  stroke="url(#flameG)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M12 2.6c.9 3-1.4 4.8-2.8 6.8C7.9 11.2 7 13 7 15a5.5 5.5 0 0 0 11 0c0-2.7-1.4-4.7-2.9-6.5-.4 1.1-1 1.9-2 2.5.4-2.7-.6-6-3.1-8.4z"
                   />
                  <path
                    d="M12 21.5a3 3 0 0 1-1.6-5.5c.1 1 .6 1.6 1.4 2 .1-.9.5-1.6 1.2-2.1a3 3 0 0 1-1 5.6z"
                    fill="rgba(255,180,84,.5)"
                    stroke="none"
                   />
                </svg>
                {' '}
                <b id="streakNum">
                  12
                </b>
                {' '}
                <span data-i18n="strip.streak">
                  day streak
                </span>
              </span>
              {/* Hidden until loadCoinChip() resolves (see script), same reasoning
               as #plusCard: a slow/failed fetch must never show 0 and look like
               an empty wallet. Low-balance styling is a CSS state (.low), set
               from script once the real number is known. */}
              <span className="coin-chip" id="coinChip" style={{ display: "none" }} title="BestBrain coins">
                <svg
                  className="coin-ic"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 9.3c0-1 1.2-1.6 3-1.6s3 .7 3 1.7c0 2.1-6 1.2-6 3.3 0 1 1.2 1.7 3 1.7s3-.5 3-1.5" />
                  <path d="M12 6.3v11.4" />
                </svg>
                {' '}
                <b id="coinBalance">
                  0
                </b>
                {' '}
                <span>
                  coins
                </span>
              </span>
              {/* REMOVED: the "Offline data, synced 2h ago" chip.
               It was static markup with no code behind it, so it claimed a sync
               that happened 2 hours ago on every single page load, forever ,
               including the very first load of a brand-new account, and including
               loads where the fetch had just failed. A status indicator that is
               not wired to any status is worse than no indicator. Restore it only
               alongside a real lastSyncedAt value. */}
              <span className="today-chip" id="todayChip" />
            </div>
          </div>
          <div className="role-wrap pl" style={{ '--d': "240ms" } as CSSProperties}>
            <div className="role-switch" role="tablist" aria-label="Dashboard role">
              <span className="ind" id="roleInd" />
              {' '}
              <button
                role="tab"
                aria-selected="true"
                className="on"
                data-role="student"
                data-i18n="role.student"
              >
                Student
              </button>
              {' '}
              <button role="tab" aria-selected="false" data-role="teacher" data-i18n="role.teacher">
                Teacher
              </button>
              {' '}
              <button role="tab" aria-selected="false" data-role="parent" data-i18n="role.parent">
                Parent
              </button>
            </div>
            <span className="role-note" data-i18n="role.note">
              One platform · three views
            </span>
            {/* Shown once logged in: who you are + logout */}
            {/* Styling moved out of inline attributes into .userchip below so it
             follows the same black-border / bold-black-text system as the rest of
             the page. It was 11px monospace in --muted grey, the least readable
             combination on the dashboard. NOTE: display is toggled from JS, so
             the rule below must not hardcode a display value. */}
            <div id="userChip" className="userchip">
              <span id="userChipText" className="userchip__txt" />
              {' '}
              <button id="logoutBtn" className="userchip__out" type="button">
                Log out
              </button>
            </div>
          </div>
        </header>
        {/* ============================================================
         LOW COIN BALANCE, shown only when balance < 100 (see script).
         role="alert" so a screen reader announces it the moment it appears,
         same reasoning as showLoadFailure()'s banner elsewhere on this page.
    ============================================================ */}
        <div id="lowCoinBanner" className="low-coin-banner" role="alert" style={{ display: "none" }}>
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
          {' '}
          <span>
            {"Coins running low - "}
            <b id="lowCoinBalance">
              0
            </b>
            {" left. Recharge again to enjoy learning at its best!"}
          </span>
        </div>
        {/* ============================================================
         BESTBRAIN PLUS, subscription upsell / active badge.
         Hidden until loadSubscriptionCard() resolves (see script), so a slow
         or failed /api/subscription/* call never shows a half-built card.
         Entitlement itself is decided server-side from signed Razorpay
         webhooks only, this card only ever reads it, never sets it.
    ============================================================ */}
        <div id="plusCard" className="pluscard" style={{ display: "none" }}>
          <div className="pluscard__head">
            <span className="pluscard__badge" aria-hidden="true">
              ★
            </span>
            <div className="pluscard__copy">
              <h3 id="plusTitle">
                BestBrain Plus
              </h3>
              <p id="plusSub">
                Unlock every class, every subject, unlimited PAL doubts.
              </p>
            </div>
          </div>
          <div id="plusAction" className="pluscard__action" />
        </div>
        {/* ============================================================
         LAYOUT: BOARDS + RIGHT RAIL
    ============================================================ */}
        <div className="layout">
          <div className="boards">
            {/* ░░░░░░░░░░░░░░░░░ STUDENT VIEW ░░░░░░░░░░░░░░░░░ */}
            <section className="view" id="view-student" aria-label="Student dashboard">
              <div className="vgrid">
                {/* ============================================================
                 NEXT UP, the single most important thing on the page.
                 An 11-year-old should never have to work out what to do next.
                 Filled by buildNextUp() from STATE.chapters + CHAPTER_META.
            ============================================================ */}
                <div
                  className="card span12 stag nextup"
                  style={{ '--i': "0" } as CSSProperties}
                  id="nextUpCard"
                 />
                {/* STUDENT feature menu */}
                {/* ============================================================
                 YOUR WEEK, a slim stats STRIP, not four large cards.
                 These are secondary numbers. At full-card size a quiet week
                 renders as a wall of giant zeros, which is the most
                 discouraging thing a student can open the app to.
            ============================================================ */}
                <div className="feat-label stag" style={{ '--i': "0" } as CSSProperties}>
                  My Learning
                </div>
                <nav
                  className="feat-menu stag"
                  style={{ '--i': "0" } as CSSProperties}
                  aria-label="Student features"
                >
                  <a className="feat-card" href="learn.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Learn
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Browse chapters & video lessons
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="videos.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M3 9h18M7 4l2 5M13 4l2 5" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Video Lectures
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Watch lectures for your class
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="mocktest.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Mock Tests
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Practice & track your scores
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="pal.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="4" y="8" width="16" height="12" rx="3" />
                        <path d="M12 8V4M9 14h.01M15 14h.01" />
                        <circle cx="12" cy="3" r="1" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      PAL AI Tutor
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Ask doubts, get step-by-step help
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="challenge.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M14.5 14.5 20 20l-1 1-6-5.5" />
                        <path d="M9.5 14.5 4 20l1 1 6-5.5" />
                        <path d="M18 3h3v3l-8.5 8.5-3-3z" />
                        <path d="M6 3H3v3l8.5 8.5" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Arena
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Challenges & leaderboards
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="live.html" id="liveClassCard">
                    <span className="fc-ico" id="liveClassIco">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m23 7-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" />
                      </svg>
                    </span>
                    <span className="fc-title" id="liveClassTitle">
                      Join Live Class
                    </span>
                    {' '}
                    <span className="fc-sub" id="liveClassSub">
                      Attend your scheduled classes
                    </span>
                  </a>
                </nav>
                <div className="feat-label stag" style={{ '--i': "0" } as CSSProperties}>
                  My subjects
                </div>
                <div className="subjmap stag" style={{ '--i': "0" } as CSSProperties} id="subjMap" />
                <div className="feat-label stag" style={{ '--i': "0" } as CSSProperties}>
                  Your week
                </div>
                <div className="weekgrid stag" style={{ '--i': "0" } as CSSProperties} id="weekGrid" />
                {/* The PAL LEVEL chip was removed.
                 It read STATE.pal.level, and nothing in the app ever writes
                 STATE.pal, api.js only deletes the key. So it was pinned to
                 "LEVEL 1 · SPARK" permanently, for every student, forever. On a
                 child's dashboard a level badge that can never go up is a
                 permanent "you are at the bottom" label, which is the opposite
                 of what it was meant to do. Bring it back when PAL actually
                 reports a level. */}
                <div
                  className="span12 stag"
                  style={{ '--i': "0", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px" } as CSSProperties}
                >
                  <span className="mono" style={{ color: "#3A4150" }} id="weekRange" />
                </div>
                {/* (a) weekly minutes */}
                <div className="card span7 stag" style={{ '--i': "1" } as CSSProperties}>
                  <div className="card-head">
                    <h3 className="card-title" data-i18n="s.minutes">
                      Weekly minutes
                    </h3>
                    <span className="eyebrow" data-i18n="s.minutesSub">
                      Last 7 days
                    </span>
                  </div>
                  <div className="chart-wrap">
                    <svg
                      className="barchart"
                      id="barchart"
                      viewBox="0 0 380 188"
                      role="img"
                      aria-label="Bar chart of minutes learned per day"
                     />
                    <div className="chart-tip" id="barTip" style={{ display: "none" }} />
                  </div>
                  <div className="bar-foot">
                    <div className="big">
                      <span id="weekTotal">
                        0
                      </span>
                      <small data-i18n="s.minWeek">
                        min this week
                      </small>
                    </div>
                    <span className="delta-chip" id="weekDelta" style={{ display: "none" }} />
                  </div>
                </div>
                {/* (b) subject mastery donuts */}
                <div className="card span5 stag" style={{ '--i': "2" } as CSSProperties}>
                  <div className="card-head">
                    <h3 className="card-title" data-i18n="s.mastery">
                      Subject mastery
                    </h3>
                    <span className="eyebrow" id="masteryClassLabel">
                      NCERT · CL 7
                    </span>
                  </div>
                  <div className="donut-grid" id="donutGrid" />
                </div>
                {/* (c) badge shelf */}
                <div className="card span12 stag" style={{ '--i': "3" } as CSSProperties}>
                  <div className="card-head">
                    <h3 className="card-title" data-i18n="s.badges">
                      Badge shelf
                    </h3>
                    <span className="eyebrow" id="badgeCount">
                      3 OF 6 EARNED
                    </span>
                  </div>
                  <div className="shelf" id="badgeShelf" />
                  <div className="shelf-ledge" />
                </div>
                {/* (d) AI recommends */}
                <div className="card span8 stag" style={{ '--i': "4" } as CSSProperties}>
                  <div className="reco-head">
                    <svg className="tokky" viewBox="0 0 80 92" aria-label="Tokky, your learning buddy">
                      <defs>
                        <linearGradient id="tokG1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3DE8C5" />
                          <stop offset="48%" stopColor="#7C9BFF" />
                          <stop offset="100%" stopColor="#FFB454" />
                        </linearGradient>
                      </defs>
                      <line
                        x1="40"
                        y1="22"
                        x2="40"
                        y2="10"
                        stroke="url(#tokG1)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                       />
                      <circle className="tip" cx="40" cy="8" r="4" fill="#3DE8C5" />
                      <circle cx="40" cy="8" r="7" fill="rgba(61,232,197,.18)" />
                      <circle cx="40" cy="55" r="32" fill="#121C30" stroke="url(#tokG1)" strokeWidth="2.5" />
                      <rect className="eye" x="27" y="45" width="8" height="14" rx="4" fill="#F2EDE3" />
                      <rect className="eye" x="45" y="45" width="8" height="14" rx="4" fill="#F2EDE3" />
                      <path
                        d="M32 68 Q40 74 48 68"
                        stroke="#F2EDE3"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                       />
                    </svg>
                    <div>
                      <h3 className="card-title" data-i18n="s.reco">
                        AI recommends
                      </h3>
                      <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }} id="recoSub">
                        Personalised gap analysis appears here as you practise.
                      </p>
                    </div>
                  </div>
                  {/* Real, per-student gap analysis is rendered into #recoGrid once the
                   backend surfaces it. Until then, an honest empty state (no fake
                   "Fractions/Light/Percentages" demo cards). */}
                  <div className="reco-grid" id="recoGrid">
                    <p
                      className="empty-hint"
                      style={{ gridColumn: "1/-1", color: "var(--muted)", fontSize: "13.5px", padding: "6px 2px" }}
                    >
                      {" No gaps flagged yet, take a mock test or complete a chapter and Tokky will point out exactly what to revise. "}
                    </p>
                  </div>
                </div>
                {/* (e) learning rhythm, sits beside "AI recommends" rather than in a
                 rail of its own, so the calendar isn't stranded in a full-width band */}
                <div className="card span4 stag" style={{ '--i': "5" } as CSSProperties}>
                  {/* .hm-wrap shrink-wraps the calendar and centres the whole block ,
                   title, eyebrow, grid and legend together, so the caption and
                   the LESS/MORE ramp line up with the grid they describe instead
                   of overhanging it on both sides. */}
                  <div className="hm-wrap">
                    <div className="card-head" style={{ marginBottom: "12px" }}>
                      <h3 className="card-title" style={{ fontSize: "18px" }} data-i18n="rail.rhythm">
                        Learning rhythm
                      </h3>
                    </div>
                    {/* filled by buildHeatmap() with the current month + year */}
                    <p className="eyebrow" style={{ marginBottom: "4px" }} id="hmMonth">
                      THIS MONTH
                    </p>
                    <div className="heatmap" id="heatmap" aria-label="Calendar heatmap of daily learning" />
                    <div className="hm-foot">
                      {/* filled by buildHeatmap(); the heatmap spans the current
                     calendar month, so this caption cannot be static markup */}
                      <span className="mono" style={{ color: "var(--muted)" }} id="hmRange" />
                      <div className="hm-scale" aria-hidden="true">
                        <span className="mono" style={{ fontSize: "9px", color: "var(--muted)" }}>
                          LESS
                        </span>
                        {/* GitHub's contribution ramp; must match .hcell.l1-.l4 */}
                        <i style={{ background: "#EBEDF0" }} />
                        {' '}
                        <i style={{ background: "#9BE9A8" }} />
                        {' '}
                        <i style={{ background: "#40C463" }} />
                        {' '}
                        <i style={{ background: "#30A14E" }} />
                        {' '}
                        <i style={{ background: "#216E39" }} />
                        {' '}
                        <i style={{ background: "#3DE8C5" }} />
                        {' '}
                        <span className="mono" style={{ fontSize: "9px", color: "var(--muted)" }}>
                          MORE
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* /.hm-wrap */}
                </div>
                {/* (f) continue learning */}
                <div className="card span12 stag" style={{ '--i': "6" } as CSSProperties}>
                  <div className="card-head">
                    <h3 className="card-title" data-i18n="s.continue">
                      Continue learning
                    </h3>
                    <a
                      className="eyebrow"
                      href="learn.html"
                      style={{ transition: "color .3s ease" }}
                      data-i18n="s.all"
                    >
                      All chapters →
                    </a>
                  </div>
                  <div className="cont-grid" id="contGrid" />
                </div>
              </div>
            </section>
            {/* ░░░░░░░░░░░░░░░░░ TEACHER VIEW ░░░░░░░░░░░░░░░░░ */}
            <section className="view" id="view-teacher" aria-label="Teacher dashboard">
              <div className="vgrid">
                {/* TEACHER feature menu */}
                <div className="feat-label stag" style={{ '--i': "0" } as CSSProperties}>
                  Teaching Tools
                </div>
                <nav
                  className="feat-menu stag"
                  style={{ '--i': "0" } as CSSProperties}
                  aria-label="Teacher features"
                >
                  <a className="feat-card" href="upload.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <path d="M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Upload Lecture
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Add an animated video lecture
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="videos.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M3 9h18M7 4l2 5M13 4l2 5" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Video Library
                    </span>
                    {' '}
                    <span className="fc-sub">
                      All lectures on the platform
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="live.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m23 7-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Start Live Class
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Host a class for your section
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="create-test.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Create a Test
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Timed, auto-graded, get a link to share
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="#rosterAnchor">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Class Roster
                    </span>
                    {' '}
                    <span className="fc-sub">
                      View students & performance
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="pal.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="4" y="8" width="16" height="12" rx="3" />
                        <path d="M12 8V4M9 14h.01M15 14h.01" />
                        <circle cx="12" cy="3" r="1" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      PAL for Teachers
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Lesson planning & insights
                    </span>
                  </a>
                </nav>
                <div className="span12 stag t-head" style={{ '--i': "0" } as CSSProperties}>
                  <h2 id="tClassHead">
                    {"Your class · "}
                    <em>
                      loading…
                    </em>
                  </h2>
                  <a className="btn-primary" href="create-test.html">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="18" cy="18" r="3" />
                      <path d="M8.7 10.6l6.6-3.2" />
                      <path d="M8.7 13.4l6.6 3.2" />
                    </svg>
                    {' '}
                    <span>
                      Create a test
                    </span>
                  </a>
                </div>
                {/* (a) class average ring */}
                <div className="card span4 stag" style={{ '--i': "1" } as CSSProperties}>
                  <div className="card-head">
                    <h3 className="card-title" data-i18n="t.avg">
                      Class average
                    </h3>
                  </div>
                  <svg className="ring-big" viewBox="0 0 130 130" role="img" aria-label="Class average mastery">
                    <circle className="trk" cx="65" cy="65" r="56" />
                    <circle className="val" id="avgRing" cx="65" cy="65" r="56" />
                    <text className="ring-num" id="avgNum" x="65" y="68">
                      0%
                    </text>
                    <text className="ring-sub" x="65" y="86">
                      MASTERY
                    </text>
                  </svg>
                  <div className="avg-foot">
                    <span className="delta-chip" id="avgDelta" style={{ display: "none" }} />
                  </div>
                </div>
                {/* (b) weak topics */}
                <div className="card span8 stag" style={{ '--i': "2" } as CSSProperties}>
                  <div className="card-head">
                    <h3 className="card-title" data-i18n="t.weak">
                      Weak topics this week
                    </h3>
                    <span className="eyebrow">
                      AVG CORRECT %
                    </span>
                  </div>
                  <div className="hbars" id="hbars" />
                </div>
                {/* (c) roster table */}
                <div className="card span12 stag" style={{ '--i': "3" } as CSSProperties} id="rosterAnchor">
                  <div className="card-head">
                    <h3 className="card-title" data-i18n="t.students">
                      Students
                    </h3>
                    <span className="eyebrow" data-i18n="t.sortHint">
                      Click mastery to sort
                    </span>
                  </div>
                  <div className="tbl-wrap">
                    <table className="roster">
                      <thead>
                        <tr>
                          <th>
                            Student
                          </th>
                          <th>
                            Time this week
                          </th>
                          {/* tabindex/role/aria-sort: the sort was click-only, so a
                           keyboard user could not sort at all, and the only sort
                           indicator was a CSS chevron rotation that was never
                           announced. */}
                          <th className="sortable" id="masteryTh" tabIndex={0} role="button" aria-sort="none">
                            {"Mastery "}
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </th>
                          <th>
                            Weak topic
                          </th>
                          <th>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody id="rosterBody" />
                    </table>
                  </div>
                </div>
              </div>
            </section>
            {/* ░░░░░░░░░░░░░░░░░ PARENT VIEW ░░░░░░░░░░░░░░░░░ */}
            <section className="view" id="view-parent" aria-label="Parent dashboard">
              <div className="vgrid">
                {/* PARENT feature menu */}
                <div className="feat-label stag" style={{ '--i': "0" } as CSSProperties}>
                  Parent Tools
                </div>
                <nav
                  className="feat-menu stag"
                  style={{ '--i': "0" } as CSSProperties}
                  aria-label="Parent features"
                >
                  <a className="feat-card" href="#childProgress">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 3v18h18" />
                        <path d="m7 14 4-4 3 3 5-6" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Child's Progress
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Streak, minutes & chapters
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="#attnCard">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      Attendance
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Class attendance & activity
                    </span>
                  </a>
                  {' '}
                  <a className="feat-card" href="pal.html">
                    <span className="fc-ico">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="4" y="8" width="16" height="12" rx="3" />
                        <path d="M12 8V4M9 14h.01M15 14h.01" />
                        <circle cx="12" cy="3" r="1" />
                      </svg>
                    </span>
                    <span className="fc-title">
                      PAL for Parents
                    </span>
                    {' '}
                    <span className="fc-sub">
                      Guidance to support learning
                    </span>
                  </a>
                </nav>
                {/* (a) child summary */}
                <div
                  className="card span5 stag child-card"
                  style={{ '--i': "0" } as CSSProperties}
                  id="childProgress"
                >
                  <div className="child-top">
                    <svg width="58" height="58" viewBox="0 0 58 58" aria-hidden="true">
                      <defs>
                        <linearGradient id="avAnanya" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFB454" />
                          <stop offset="100%" stopColor="#FF7AA2" />
                        </linearGradient>
                      </defs>
                      <circle cx="29" cy="29" r="28" fill="url(#avAnanya)" />
                      <text
                        x="29"
                        y="30"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="Fraunces,serif"
                        fontSize="21"
                        fontWeight="600"
                        fill="#05080F"
                        id="childAvatarTxt"
                      >
                        …
                      </text>
                    </svg>
                    <div>
                      <div className="cname" id="childName">
                        Loading…
                      </div>
                      <div className="ccls" id="childClass" />
                    </div>
                  </div>
                  <div className="child-stats">
                    <div className="cstat">
                      <b id="pStreak">
                        ,
                      </b>
                      <span data-i18n="p.streak">
                        day streak
                      </span>
                    </div>
                    <div className="cstat">
                      <b id="pHours">
                        ,
                      </b>
                      <span data-i18n="p.week">
                        this week
                      </span>
                    </div>
                    <div className="cstat">
                      <b id="pAllTime">
                        ,
                      </b>
                      <span data-i18n="p.total">
                        all-time
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--teal)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3.2 2" />
                    </svg>
                    {' '}
                    <span className="mono" style={{ color: "var(--muted)" }} id="childLastActive" />
                  </div>
                  <button
                    type="button"
                    id="relinkChildToggle"
                    className="mono"
                    aria-expanded="false"
                    aria-controls="relinkChildForm"
                    style={{ background: "none", border: "none", color: "var(--muted)", textDecoration: "underline", cursor: "pointer", padding: "10px 0 0", fontSize: "12px" }}
                  >
                    Wrong child linked? Fix it
                  </button>
                  {/* These three inputs carried a placeholder and nothing else.
                   Placeholders disappear the moment you type, so a screen-reader
                   or magnifier user lost the field identity mid-entry. Real
                   (visually-hidden) labels fix that without changing the design.
                   #relinkMsg carries "Checking…", "Fixed, reloading…" and API
                   errors, so it needs role="status" or none of that is announced. */}
                  <form
                    id="relinkChildForm"
                    style={{ display: "none", marginTop: "10px", paddingTop: "12px", borderTop: "1px solid var(--line)", gap: "8px", flexDirection: "column" }}
                  >
                    <label htmlFor="relinkRoll" className="sr-only">
                      Child's roll number
                    </label>
                    {' '}
                    <input
                      type="text"
                      id="relinkRoll"
                      placeholder="Child's roll number"
                      required={true}
                      style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--bg)", color: "inherit", fontSize: "13px" }}
                     />
                    {' '}
                    <label htmlFor="relinkName" className="sr-only">
                      Child's full name
                    </label>
                    {' '}
                    <input
                      type="text"
                      id="relinkName"
                      placeholder="Child's full name"
                      required={true}
                      style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--bg)", color: "inherit", fontSize: "13px" }}
                     />
                    {' '}
                    <label htmlFor="relinkClass" className="sr-only">
                      Child's class, for example Class 7
                    </label>
                    {' '}
                    <input
                      type="text"
                      id="relinkClass"
                      placeholder="Child's class (e.g. Class 7)"
                      required={true}
                      style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--bg)", color: "inherit", fontSize: "13px" }}
                     />
                    {' '}
                    <button type="submit" className="btn-fix" style={{ justifyContent: "center" }}>
                      Re-link child
                    </button>
                    {' '}
                    <span id="relinkMsg" role="status" aria-live="polite" style={{ fontSize: "12px" }} />
                  </form>
                </div>
                {/* (b) area chart */}
                <div className="card span7 stag" style={{ '--i': "1" } as CSSProperties}>
                  <div className="card-head">
                    <h3 className="card-title" data-i18n="p.screen">
                      Learning time this week
                    </h3>
                    <span className="eyebrow">
                      MIN / DAY
                    </span>
                  </div>
                  <svg
                    className="areachart"
                    id="areachart"
                    viewBox="0 0 380 175"
                    role="img"
                    aria-label="Area chart of learning minutes per day"
                   />
                </div>
                {/* (c) alerts */}
                <div className="card span7 stag" style={{ '--i': "2" } as CSSProperties}>
                  <div className="card-head">
                    <h3 className="card-title" data-i18n="p.alerts">
                      Alerts
                    </h3>
                    <span className="eyebrow">
                      THIS WEEK
                    </span>
                  </div>
                  {/* Real activity alerts render here once the child has activity.
                   No fabricated "85% in Science" / medallion demo rows. */}
                  <div className="alerts" id="parentAlerts">
                    <p
                      className="empty-hint"
                      style={{ color: "var(--muted)", fontSize: "13.5px", padding: "6px 2px" }}
                    >
                      {" No activity yet this week, alerts about your child's tests, streaks and gaps will appear here. "}
                    </p>
                  </div>
                </div>
                {/* (c2) live-class camera attention */}
                <div className="card span12 stag" style={{ '--i': "3" } as CSSProperties} id="attnCard">
                  <div className="card-head">
                    <h3 className="card-title">
                      Live class attention
                    </h3>
                    <span className="eyebrow">
                      CAMERA-MONITORED
                    </span>
                  </div>
                  <div
                    id="attnBody"
                    style={{ display: "flex", alignItems: "center", gap: "26px", flexWrap: "wrap" }}
                   />
                </div>
                {/* (d) reassurance */}
                <div className="card span5 stag reassure" style={{ '--i': "4" } as CSSProperties}>
                  <h4 data-i18n="p.reassureH">
                    Built to never block learning
                  </h4>
                  <p data-i18n="p.reassureP">
                    All learning works offline, videos, practice and tests run without internet, and usage syncs automatically when you are back online.
                  </p>
                  <div className="divide" />
                  <div className="note">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--teal)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5V6a2 2 0 0 1 2-2h14v13.5" />
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
                    </svg>
                    {' '}
                    <span>
                      <b>
                        Multi-grade access:
                      </b>
                      {" your child can revisit any earlier-class chapter anytime, quietly, stigma-free. PAL never labels, it just bridges."}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      {/* Heatmap hover tooltip. Lives at top level on purpose: it is position:fixed
       and JS-positions itself from getBoundingClientRect(), so it must not sit
       inside the rhythm card - .stag keeps a transform (translateY(0) is still a
       transform), which would make it a containing block for fixed descendants
       and offset the tooltip, and .card{overflow:hidden} would clip it. */}
      <div className="chart-tip" id="hmTip" style={{ position: "fixed" }}>
        23 MIN · MON 12 MAY
      </div>
      {/* ============================================================
       FOOTER (slim)
  ============================================================ */}
      <footer>
        <div className="foot-word" aria-hidden="true">
          BestBrain
        </div>
        <div className="foot-inner">
          <div className="foot-cols rv">
            <div>
              <div className="logo" style={{ marginBottom: "14px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="url(#auroraG)">
                  <path
                    d="M12 1.6C13.1 7.6 16.4 10.9 22.4 12C16.4 13.1 13.1 16.4 12 22.4C10.9 16.4 7.6 13.1 1.6 12C7.6 10.9 10.9 7.6 12 1.6Z"
                   />
                </svg>
                {' '}
                <span className="wordmark" style={{ fontSize: "19px" }}>
                  BestBrain
                </span>
              </div>
              <p className="foot-tag" data-i18n="foot.tag">
                Made for Bharat. Works fully offline.
              </p>
              <p className="foot-mono">
                CBSE · NCERT · 20+ STATE BOARDS
              </p>
            </div>
            <div id="footProductCol">
              <h5>
                Product
              </h5>
              <a href="learn.html" className="foot-learn-link">
                Learn
              </a>
              {' '}
              <a href="lesson.html">
                Lessons
              </a>
              {' '}
              <a href="pal.html">
                PAL Adaptive AI
              </a>
              {' '}
              <a href="dashboard.html">
                Dashboard
              </a>
            </div>
            <div id="footClassesCol">
              <h5>
                Classes
              </h5>
              <a href="learn.html" style={{ color: "var(--teal)" }}>
                Class 6
              </a>
              {' '}
              <a href="learn.html" style={{ color: "var(--amber)" }}>
                Class 7
              </a>
              {' '}
              <a href="learn.html" style={{ color: "var(--peri)" }}>
                Class 8
              </a>
              {' '}
              <a href="learn.html" style={{ color: "var(--rose)" }}>
                Class 9
              </a>
            </div>
            <div>
              <h5>
                Company
              </h5>
              <a href="index.html">
                About
              </a>
              {' '}
              <a href="index.html">
                For schools
              </a>
              {' '}
              <a href="index.html">
                Careers
              </a>
              {' '}
              <a href="index.html">
                Contact
              </a>
            </div>
            <div>
              <h5>
                Languages
              </h5>
              <li>
                English · हिन्दी
              </li>
              <li>
                मराठी · বাংলা
              </li>
              <li>
                தமிழ் · తెలుగు
              </li>
              <li>
                + 5 more
              </li>
            </div>
          </div>
        </div>
      </footer>
      {/* shared curriculum (190 chapters) - MUST load before the inline
       script below derives CHAPTER_META from window.EduCurriculum */}
      {' '}
      {' '}
      {' '}
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
