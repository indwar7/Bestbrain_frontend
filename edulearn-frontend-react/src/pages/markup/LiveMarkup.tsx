/* Generated from edulearn-frontend/live.html, do not hand-edit.
   Regenerate with `npm run sync:markup`. */
import type { CSSProperties } from 'react';

export default function LiveMarkup() {
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
      <main className="wrap">
        {/* ============ BROWSE ============ */}
        <div id="browseView">
          <section className="hero">
            <div className="mono rv" style={{ animationDelay: ".05s" }}>
              <span style={{ color: "var(--cream)" }}>
                Live
              </span>
            </div>
            <h1 className="rv" id="liveHero" style={{ animationDelay: ".12s", marginTop: "14px" }}>
              {"Learn live, "}
              <em>
                face to face.
              </em>
            </h1>
            <p className="hero__sub rv" style={{ animationDelay: ".2s" }}>
              Small-group classes with real tutors. Book a seat, get it on your calendar, join in one tap.
            </p>
            <div className="hero__chips rv" style={{ animationDelay: ".28s" }}>
              <span className="chip">
                <span className="dot" />
                Max 15 students per class
              </span>
              {' '}
              <span className="chip">
                <span className="dot" />
                AI camera attention report after every session
              </span>
            </div>
            <div className="hero__cta rv" style={{ animationDelay: ".34s" }}>
              <button className="btn-try" id="tryAttn" type="button">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {" Try AI attention monitoring "}
              </button>
              {' '}
              <span className="hero__cta-note">
                Joins a demo class and asks for camera permission
              </span>
            </div>
          </section>
          {/* Live actions: start a class (teacher) or join by code. The "Live now"
           list was removed; currently-live classes are joined via their code. */}
          <div className="live-actions">
            {/* Teacher: start a real live class (shown only for teacher accounts) */}
            <div className="pcard rv composer" id="teacherComposer" style={{ animationDelay: ".3s" }}>
              <div className="pcard__eyebrow">
                Start a live class
              </div>
              <form id="startForm" className="composer__form">
                <input
                  id="startTitle"
                  type="text"
                  className="composer__field"
                  placeholder="Class topic, e.g. Photosynthesis"
                  required={true}
                 />
                {/* Options are populated by script, so there is no visible label to
                 attach a `for` to; without a name it is announced as an unnamed
                 combobox. */}
                <select
                  id="startAssign"
                  className="composer__field"
                  required={true}
                  aria-label="Assign this class to a batch"
                 />
                {' '}
                <input
                  id="startMeetLink"
                  type="url"
                  className="composer__field"
                  placeholder="Optional: paste a Google Meet link (meet.google.com/...) to use Meet instead of in-app video"
                  pattern="https://meet\\.google\\.com/.*"
                 />
                {' '}
                <button className="btn-try composer__go" type="submit">
                  Go live
                </button>
                {' '}
                <span id="startMsg" className="empty-hint composer__msg" />
              </form>
            </div>
            {/* Join with a class code, full-width band so the top reads as a
             complete section, not a stray input floating on empty space. */}
            <div className="joinband rv" id="joinCodeBox" style={{ animationDelay: ".30s" }}>
              <div className="joinband__main">
                <div className="joinband__eyebrow">
                  Join a live class
                </div>
                <h2 className="joinband__title">
                  Got a class code from your teacher?
                </h2>
                <div className="joinband__row">
                  <input
                    id="joinCodeInput"
                    type="text"
                    className="composer__field"
                    style={{ flex: "1", minWidth: "200px", textTransform: "uppercase", letterSpacing: "1px" }}
                    placeholder="e.g. SCI-7A-4821"
                    autoComplete="off"
                    spellCheck="false"
                   />
                  {' '}
                  <button className="btn-join" id="joinCodeBtn" type="button">
                    Join with code
                  </button>
                </div>
                <span id="joinCodeMsg" className="empty-hint" style={{ display: "block", margin: "12px 0 0" }} />
              </div>
              <div className="joinband__steps">
                <div className="joinstep">
                  <span className="joinstep__n">
                    1
                  </span>
                  <div>
                    <b>
                      Get the code
                    </b>
                    <span>
                      Your teacher shares a code like SCI-7A-4821 when class begins.
                    </span>
                  </div>
                </div>
                <div className="joinstep">
                  <span className="joinstep__n">
                    2
                  </span>
                  <div>
                    <b>
                      Enter & join
                    </b>
                    <span>
                      Paste it above and you're in the classroom in one tap.
                    </span>
                  </div>
                </div>
                <div className="joinstep">
                  <span className="joinstep__n">
                    3
                  </span>
                  <div>
                    <b>
                      Camera on
                    </b>
                    <span>
                      Keep your camera on for a live attention report after class.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Class 7 NCERT syllabus at a glance, the real chapters of every
           subject, with the foundational / high-weightage "must-do" ones
           starred. Fills the browse view with genuine study content. */}
          <section className="syl">
            <div className="syl__head">
              <div>
                <h2 className="sect-title rv" style={{ margin: "0", animationDelay: ".1s" }}>
                  Class 7 NCERT, the must-do syllabus
                </h2>
                <p className="syl__sub rv" style={{ animationDelay: ".16s" }}>
                  Every subject, chapter by chapter, straight from the NCERT syllabus. Start with the starred chapters, they carry the most weight and everything else builds on them.
                </p>
              </div>
              <span className="syl__legend rv" style={{ animationDelay: ".2s" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--amber)" aria-hidden="true">
                  <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                </svg>
                {" Must-do, foundational / high-weightage "}
              </span>
            </div>
            <div className="syl__grid">
              {/* SCIENCE */}
              <article
                className="sylc rv"
                style={{ '--sa': "var(--teal)", animationDelay: ".22s" } as CSSProperties}
              >
                <div className="sylc__hd">
                  <span className="sylc__ic">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 2h6M10 2v6.5L5.2 17A2 2 0 0 0 7 20h10a2 2 0 0 0 1.8-3L14 8.5V2" />
                      <path d="M7.5 14h9" />
                    </svg>
                  </span>
                  <div>
                    <div className="sylc__name">
                      Science
                    </div>
                    <div className="sylc__count">
                      12 chapters
                    </div>
                  </div>
                </div>
                <ul className="sylc__list">
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      01
                    </span>
                    <span className="sylc__t">
                      Electricity: Circuits and their Components
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      02
                    </span>
                    <span className="sylc__t">
                      The World of Metals and Non-metals
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      03
                    </span>
                    <span className="sylc__t">
                      Changes Around Us: Physical and Chemical
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      04
                    </span>
                    <span className="sylc__t">
                      Adolescence: A Stage of Growth and Change
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      05
                    </span>
                    <span className="sylc__t">
                      Heat Transfer in Nature
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      06
                    </span>
                    <span className="sylc__t">
                      Measurement of Time and Motion
                    </span>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      07
                    </span>
                    <span className="sylc__t">
                      The Ever-Evolving World of Science
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      08
                    </span>
                    <span className="sylc__t">
                      Exploring Substances: Acidic, Basic & Neutral
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      09
                    </span>
                    <span className="sylc__t">
                      Life Processes in Animals
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      10
                    </span>
                    <span className="sylc__t">
                      Life Processes in Plants
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      11
                    </span>
                    <span className="sylc__t">
                      Light: Shadows and Reflections
                    </span>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      12
                    </span>
                    <span className="sylc__t">
                      Earth, Moon and the Sun
                    </span>
                  </li>
                </ul>
              </article>
              {/* MATHS */}
              <article
                className="sylc rv"
                style={{ '--sa': "var(--peri)", animationDelay: ".26s" } as CSSProperties}
              >
                <div className="sylc__hd">
                  <span className="sylc__ic">
                    <span
                      style={{ fontFamily: "'Fraunces',serif", fontWeight: "700", fontSize: "18px", lineHeight: "1" }}
                    >
                      x²
                    </span>
                  </span>
                  <div>
                    <div className="sylc__name">
                      Mathematics
                    </div>
                    <div className="sylc__count">
                      10 chapters
                    </div>
                  </div>
                </div>
                <ul className="sylc__list">
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      01
                    </span>
                    <span className="sylc__t">
                      Integers
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      02
                    </span>
                    <span className="sylc__t">
                      Fractions and Decimals
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      03
                    </span>
                    <span className="sylc__t">
                      Data Handling
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      04
                    </span>
                    <span className="sylc__t">
                      Simple Equations
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      05
                    </span>
                    <span className="sylc__t">
                      Lines and Angles
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      06
                    </span>
                    <span className="sylc__t">
                      The Triangle and its Properties
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      07
                    </span>
                    <span className="sylc__t">
                      Congruence of Triangles
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      08
                    </span>
                    <span className="sylc__t">
                      Comparing Quantities
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      09
                    </span>
                    <span className="sylc__t">
                      Rational Numbers
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      10
                    </span>
                    <span className="sylc__t">
                      Perimeter and Area
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                </ul>
              </article>
              {/* SOCIAL SCIENCE */}
              <article
                className="sylc rv"
                style={{ '--sa': "var(--amber)", animationDelay: ".30s" } as CSSProperties}
              >
                <div className="sylc__hd">
                  <span className="sylc__ic">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18" />
                      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18" />
                    </svg>
                  </span>
                  <div>
                    <div className="sylc__name">
                      Social Science
                    </div>
                    <div className="sylc__count">
                      9 chapters
                    </div>
                  </div>
                </div>
                <ul className="sylc__list">
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      01
                    </span>
                    <span className="sylc__t">
                      Tracing Changes Through a Thousand Years
                    </span>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      02
                    </span>
                    <span className="sylc__t">
                      New Kings and Kingdoms
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      03
                    </span>
                    <span className="sylc__t">
                      The Delhi Sultans
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      04
                    </span>
                    <span className="sylc__t">
                      The Mughal Empire
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      05
                    </span>
                    <span className="sylc__t">
                      Rulers and Buildings
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      06
                    </span>
                    <span className="sylc__t">
                      Environment
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      07
                    </span>
                    <span className="sylc__t">
                      Inside Our Earth
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      08
                    </span>
                    <span className="sylc__t">
                      On Equality
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      09
                    </span>
                    <span className="sylc__t">
                      Markets Around Us
                    </span>
                  </li>
                </ul>
              </article>
              {/* ENGLISH */}
              <article
                className="sylc rv"
                style={{ '--sa': "var(--rose)", animationDelay: ".34s" } as CSSProperties}
              >
                <div className="sylc__hd">
                  <span className="sylc__ic">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </span>
                  <div>
                    <div className="sylc__name">
                      English
                    </div>
                    <div className="sylc__count">
                      9 chapters · Honeycomb
                    </div>
                  </div>
                </div>
                <ul className="sylc__list">
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      01
                    </span>
                    <span className="sylc__t">
                      Three Questions
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      02
                    </span>
                    <span className="sylc__t">
                      A Gift of Chappals
                    </span>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      03
                    </span>
                    <span className="sylc__t">
                      Gopal and the Hilsa-Fish
                    </span>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      04
                    </span>
                    <span className="sylc__t">
                      The Ashes That Made Trees Bloom
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      05
                    </span>
                    <span className="sylc__t">
                      Quality
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      06
                    </span>
                    <span className="sylc__t">
                      Expert Detectives
                    </span>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      07
                    </span>
                    <span className="sylc__t">
                      The Invention of Vita-Wonk
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      08
                    </span>
                    <span className="sylc__t">
                      Fire: Friend and Foe
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      09
                    </span>
                    <span className="sylc__t">
                      The Story of Cricket
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                </ul>
              </article>
              {/* HINDI */}
              <article className="sylc rv" style={{ '--sa': "#8B5CF6", animationDelay: ".38s" } as CSSProperties}>
                <div className="sylc__hd">
                  <span className="sylc__ic">
                    <span
                      style={{ fontFamily: "'Nunito',sans-serif", fontWeight: "800", fontSize: "19px", lineHeight: "1" }}
                    >
                      अ
                    </span>
                  </span>
                  <div>
                    <div className="sylc__name">
                      Hindi
                    </div>
                    <div className="sylc__count">
                      9 chapters · वसंत
                    </div>
                  </div>
                </div>
                <ul className="sylc__list">
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      01
                    </span>
                    <span className="sylc__t">
                      हम पंछी उन्मुक्त गगन के
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      02
                    </span>
                    <span className="sylc__t">
                      दादी माँ
                    </span>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      03
                    </span>
                    <span className="sylc__t">
                      हिमालय की बेटियाँ
                    </span>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      04
                    </span>
                    <span className="sylc__t">
                      कठपुतली
                    </span>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      05
                    </span>
                    <span className="sylc__t">
                      मिठाईवाला
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch is-key">
                    <span className="sylc__n">
                      06
                    </span>
                    <span className="sylc__t">
                      रक्त और हमारा शरीर
                    </span>
                    <svg className="sylc__key" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                    </svg>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      07
                    </span>
                    <span className="sylc__t">
                      पापा खो गए
                    </span>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      08
                    </span>
                    <span className="sylc__t">
                      शाम, एक किसान
                    </span>
                  </li>
                  <li className="sylc__ch">
                    <span className="sylc__n">
                      09
                    </span>
                    <span className="sylc__t">
                      चिड़िया की बच्ची
                    </span>
                  </li>
                </ul>
              </article>
            </div>
          </section>
          {/* Booking: today's scheduled sessions + the student's own bookings and
           past attentiveness reports. Moved below the syllabus; "Live now" removed. */}
          <section className="split">
            <div>
              <h2 className="sect-title rv" style={{ animationDelay: ".1s" }} id="todayTitle">
                Today’s sessions
              </h2>
              <div className="sessions" id="sessionGrid" />
            </div>
            <aside className="panel">
              <div className="pcard rv" style={{ animationDelay: ".14s" }}>
                <div className="pcard__eyebrow">
                  My sessions
                </div>
                <div id="myList">
                  <p className="empty-hint">
                    Nothing booked yet, grab a seat from today’s sessions.
                  </p>
                </div>
              </div>
              <div className="pcard rv" style={{ animationDelay: ".2s" }}>
                <div className="pcard__eyebrow">
                  Past session reports
                </div>
                <div id="reportList">
                  <p className="empty-hint">
                    Join a class and your attentiveness report will appear here, and on the parent dashboard.
                  </p>
                </div>
              </div>
            </aside>
          </section>
        </div>
        {/* ============ CLASSROOM ============ */}
        <div id="classView">
          <div className="cls-head">
            <span className="tag tag--live">
              Live
            </span>
            <h2 id="clsTopic">
              Class
            </h2>
            <span className="mono" id="clsClock">
              00:00
            </span>
            {' '}
            <span className="mono" id="clsCount" style={{ display: "none" }} />
            <div className="attn">
              <div className="attn__ring">
                <svg width="54" height="54" viewBox="0 0 54 54">
                  <circle cx="27" cy="27" r="22" fill="none" stroke="var(--line)" strokeWidth="5" />
                  <circle
                    id="attnArc"
                    cx="27"
                    cy="27"
                    r="22"
                    fill="none"
                    stroke="var(--teal)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="138.2"
                    strokeDashoffset="0"
                   />
                </svg>
                {' '}
                <span className="attn__num" id="attnNum">
                  100
                </span>
              </div>
              <span className="attn__label">
                Attentiveness, tracked for your parent report
              </span>
            </div>
          </div>
          <div className="cam-consent" id="camConsent">
            <div className="cam-consent__ic">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="cam-consent__body">
              <b>
                Turn on camera attention monitoring
              </b>
              {' '}
              <span>
                PAL watches whether you're looking at the screen and shares a focus report with your parent and teacher. Video stays on your device, only the attention score is saved.
              </span>
            </div>
            <div className="cam-consent__acts">
              <button className="btn-cam" id="enableCam" type="button">
                Enable camera
              </button>
              {' '}
              <button className="btn-skip" id="skipCam" type="button">
                Not now
              </button>
            </div>
          </div>
          <div className="stagegrid">
            <div>
              <div className="stage">
                {/* Real LiveKit video stage (shown when connected) */}
                <div id="lkStage" style={{ display: "none", width: "100%" }}>
                  <video
                    id="lkMainVideo"
                    autoPlay={true}
                    playsInline={true}
                    style={{ width: "100%", borderRadius: "14px", background: "#000", maxHeight: "60vh" }}
                   />
                </div>
                {/* Real in-app lecture stage: plays an actual lecture video as the
                 class content (used when there's no live LiveKit broadcast).
                 Camera attention monitoring runs alongside in the same tab. */}
                <div id="lectureStage" style={{ display: "none", width: "100%", position: "relative" }}>
                  <video
                    id="lectureVideo"
                    playsInline={true}
                    controls={true}
                    controlsList="nodownload"
                    style={{ width: "100%", borderRadius: "14px", background: "#000", maxHeight: "60vh", display: "block" }}
                   />
                  <span
                    id="lectureTitle"
                    style={{ position: "absolute", top: "12px", left: "14px", background: "rgba(8,14,30,.6)", backdropFilter: "blur(4px)", color: "#fff", fontSize: "13px", fontWeight: "600", padding: "6px 12px", borderRadius: "9px", maxWidth: "80%" }}
                   />
                </div>
                {/* Kept outside #lkStage so connection/permission errors stay
                 visible even when the stage is hidden (e.g. still showing the
                 placeholder avatar) instead of disappearing along with it. */}
                <div
                  id="lkStatus"
                  style={{ marginTop: "8px", fontFamily: "'Fragment Mono',monospace", fontSize: "12px", color: "var(--muted)" }}
                 />
                <div className="stage__avatar" id="simAvatar" style={{ display: "none" }}>
                  <div className="stage__circle" id="tutorCircle">
                    PS
                  </div>
                  <div className="wave" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                {/* Static chalkboard shown as the tutor's screen: polynomial formulas
                 written on a board (fallback when there's no live video). */}
                <div className="board" id="boardStage">
                  <div className="board__head">
                    {"Polynomials - Formula Board "}
                    <small>
                      Class 9 · Maths
                    </small>
                  </div>
                  <div className="board__grid">
                    <div>
                      p(x) = ax
                      <b>
                        ³
                      </b>
                      {" + bx"}
                      <b>
                        ²
                      </b>
                      {" + cx + d"}
                    </div>
                    <div>
                      (a + b)
                      <b>
                        ²
                      </b>
                      {" = a"}
                      <b>
                        ²
                      </b>
                      {" + 2ab + b"}
                      <b>
                        ²
                      </b>
                    </div>
                    <div>
                      (a − b)
                      <b>
                        ²
                      </b>
                      {" = a"}
                      <b>
                        ²
                      </b>
                      {" − 2ab + b"}
                      <b>
                        ²
                      </b>
                    </div>
                    <div>
                      a
                      <b>
                        ²
                      </b>
                      {" − b"}
                      <b>
                        ²
                      </b>
                      {" = (a + b)(a − b)"}
                    </div>
                    <div>
                      (x + a)(x + b) = x
                      <b>
                        ²
                      </b>
                      {" + (a+b)x + ab"}
                    </div>
                    <div>
                      (a + b)
                      <b>
                        ³
                      </b>
                      {" = a"}
                      <b>
                        ³
                      </b>
                      {" + 3a"}
                      <b>
                        ²
                      </b>
                      b + 3ab
                      <b>
                        ²
                      </b>
                      {" + b"}
                      <b>
                        ³
                      </b>
                    </div>
                    <div>
                      <span className="sub">
                        Factor thm:
                      </span>
                      {" p(a)=0 ⇒ (x−a) is a factor"}
                    </div>
                    <div>
                      <span className="sub">
                        Remainder thm:
                      </span>
                      {" p(x)÷(x−a) ⇒ rem = p(a)"}
                    </div>
                  </div>
                </div>
                <span className="stage__name" id="tutorName">
                  Priya Sharma · Tutor
                </span>
                {' '}
                <span className="handchip" id="handChip">
                  Hand raised
                </span>
                <div className="selftile" id="selfTile">
                  <video id="selfCam" autoPlay={true} muted={true} playsInline={true} />
                  <span className="self-fallback" id="selfFallback">
                    <span className="you" id="selfInitials">
                      You
                    </span>
                  </span>
                  {' '}
                  <span className="gaze-badge" id="gazeBadge">
                    Looking
                  </span>
                  {' '}
                  <span className="st" id="selfStatus">
                    mic on · cam on
                  </span>
                </div>
              </div>
              <div className="stage__note" id="stageNote">
                Your camera is used only for attention monitoring. The video stays on your device.
              </div>
              <div className="controls">
                <button className="ctl" id="micBtn" type="button">
                  Mic on
                </button>
                {' '}
                <button className="ctl" id="camBtn" type="button">
                  Camera on
                </button>
                {' '}
                <button className="ctl" id="handBtn" type="button">
                  Raise hand
                </button>
                {' '}
                <button className="ctl ctl--leave" id="leaveBtn" type="button">
                  Leave class
                </button>
              </div>
            </div>
            <div>
              {/* Teacher-only: live class roster (who has joined / who's missing) */}
              <div className="roster" id="roster">
                <div className="roster__head">
                  <span>
                    Class roster
                  </span>
                  <span className="roster__count" id="rosterCount">
                    0 / 0 joined
                  </span>
                </div>
                <div className="roster__list" id="rosterList" />
              </div>
              {/* Student-only: "you've been called on" prompt */}
              <div className="calledon" id="calledOn">
                <span>
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
                    style={{ display: "block" }}
                  >
                    <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
                    <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
                    <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
                    <path
                      d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"
                     />
                  </svg>
                </span>
                {' '}
                <span>
                  <b id="calledByName">
                    Your teacher
                  </b>
                  {" called on you"}
                  <span id="calledText" />
                </span>
                {' '}
                <span className="calledon__x" id="calledOnClose">
                  Dismiss
                </span>
              </div>
              <div className="chat">
                <div className="chat__head">
                  <span>
                    Class chat
                  </span>
                  <span className="mono" id="chatHint">
                    +5 attention per question
                  </span>
                </div>
                <div className="chat__log" id="chatLog" aria-live="polite" />
                <div className="chat__tagged" id="chatTagged">
                  {"Tagging "}
                  <b id="chatTaggedName" style={{ margin: "0 2px" }} />
                  <button type="button" id="chatTaggedClear" aria-label="Clear tag">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ display: "block" }}
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
                <form className="chat__form" id="chatForm">
                  <input
                    type="text"
                    id="chatInput"
                    placeholder="Ask a doubt..."
                    autoComplete="off"
                    aria-label="Chat message"
                   />
                  {' '}
                  <button className="chat__send" type="submit">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* ============ REPORT ============ */}
        <div id="reportView">
          <div className="report">
            <div className="mono">
              Session report
            </div>
            <h2 id="repTopic">
              Session
            </h2>
            <div className="mono" id="repDate" />
            <div className="report__top">
              <div className="bigring">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="9" />
                  <circle
                    id="repArc"
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#auroraGrad)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray="314.2"
                    strokeDashoffset="314.2"
                   />
                </svg>
                {' '}
                <span className="bigring__num" id="repScore">
                  0
                </span>
              </div>
              <div className="verdict" id="repVerdict" />
            </div>
            <div className="stats" id="repStats" />
            <div className="mono" style={{ marginTop: "18px" }}>
              Attention timeline
            </div>
            <div className="tl" id="repTimeline" />
            <div className="sentbanner">
              <span className="mono">
                Sent
              </span>
              {" Report sent to parent, visible on the Parent dashboard. "}
            </div>
            <div className="report__acts">
              <button className="btn-primary" id="backBtn" type="button">
                Back to live classes
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="wrap footer__base">
        <span className="mono">
          © 2026 BestBrain Learning Pvt. Ltd. · Noida, India
        </span>
      </footer>
      {/* QA S-03: the syllabus section below was hand-authored for Class 7 only
       and shown to every class regardless, a Class 6 student was looking at
       Newton's laws and polynomials. curriculum.js is the same shared source
       dashboard.html already builds chapter data from; loading it here lets
       the syllabus panel rebuild itself for the signed-in student's real
       class instead of lying about which one they're in. */}
      {' '}
      {' '}
      {' '}
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
