/* Generated from edulearn-frontend/mocktest.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
import type { CSSProperties } from 'react';

export default function MockTestMarkup() {
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
        {/* ============ SETUP ============ */}
        <div id="setupView">
          <section className="hero">
            <div className="mono rv" style={{ animationDelay: ".05s" }}>
              <span style={{ color: "var(--cream)" }}>
                Tests
              </span>
            </div>
            <h1 className="rv" style={{ animationDelay: ".12s", marginTop: "14px" }}>
              {"Tests that "}
              <em>
                adapt
              </em>
              {" to you."}
            </h1>
            <p className="hero__sub rv" style={{ animationDelay: ".2s" }}>
              Answer well and the questions climb with you. Struggle, and the test quietly steps back — just like PAL practice.
            </p>
            <div className="hero__chips rv" style={{ animationDelay: ".28s" }}>
              <span className="chip">
                <span className="dot" />
                10 questions
              </span>
              {' '}
              <span className="chip">
                <span className="dot" />
                60s per question
              </span>
              {' '}
              <span className="chip">
                <span className="dot" />
                Difficulty moves with you
              </span>
            </div>
          </section>
          <div className="pickgrid rv" style={{ animationDelay: ".34s" }}>
            <article className="pick" style={{ '--sa': "var(--peri)" } as CSSProperties}>
              <div className="pick__subj">
                Class 9 · Mathematics
              </div>
              <h3>
                Polynomials & Number Systems
              </h3>
              <p>
                Degrees, zeroes, factor theorem, identities, rational and irrational numbers — a 24-question adaptive bank.
              </p>
              <button className="btn-primary" data-test="maths" type="button">
                Start test
              </button>
            </article>
            <article className="pick" style={{ '--sa': "var(--teal)" } as CSSProperties}>
              <div className="pick__subj">
                Class 9 · Science
              </div>
              <h3>
                Motion & Force
              </h3>
              <p>
                Graphs, equations of motion, momentum and Newton’s laws — a 24-question adaptive bank.
              </p>
              <button className="btn-primary" data-test="science" type="button">
                Start test
              </button>
            </article>
          </div>
          <div className="howcard rv" style={{ animationDelay: ".42s" }}>
            <div className="pcard__eyebrow">
              How adaptive scoring works
            </div>
            <div className="weights">
              <span className="wchip">
                <i style={{ background: "var(--teal)" }} />
                Easy — 1 point
              </span>
              {' '}
              <span className="wchip">
                <i style={{ background: "var(--peri)" }} />
                Medium — 2 points
              </span>
              {' '}
              <span className="wchip">
                <i style={{ background: "var(--rose)" }} />
                Hard — 3 points
              </span>
              {' '}
              <span className="wchip">
                Mastery = your points ÷ the maximum on your path
              </span>
            </div>
          </div>
          <div className="attcard rv" style={{ animationDelay: ".5s" }}>
            <div className="pcard__eyebrow">
              Previous attempts
            </div>
            <div id="attList">
              <p className="empty-hint">
                No attempts yet — your history and mastery levels will appear here.
              </p>
            </div>
          </div>
        </div>
        {/* ============ TEST ============ */}
        <div id="testView">
          <div className="tbar">
            <h2 id="tName">
              Test
            </h2>
            <span className="count" id="tCount">
              1 / 10
            </span>
            <div className="qtimer">
              <svg width="54" height="54" viewBox="0 0 54 54">
                <circle cx="27" cy="27" r="22" fill="none" stroke="var(--line)" strokeWidth="5" />
                <circle
                  id="qArc"
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
              <span className="qtimer__num" id="qNum">
                60
              </span>
            </div>
          </div>
          <div className="testgrid">
            <div className="qcard">
              <div className="dpath" id="dPath" />
              <span className="dchip" id="dChip" />
              <div className="qtext" id="qText" />
              <div className="opts" id="optGrid" role="radiogroup" aria-labelledby="qText" />
              {/* role=status so the verdict and worked solution are read out on reveal */}
              <div className="solution" id="solution" role="status" hidden={true}>
                <span className="mono">
                  Solution
                </span>
                <div className="solution__verdict" id="solVerdict" />
                <div className="solution__body" id="solBody" />
              </div>
              <div className="toast" id="toast" />
              <div className="qactions">
                <button className="btn-primary" id="submitBtn" type="button" disabled={true}>
                  Submit answer
                </button>
                {' '}
                <button className="btn-primary" id="nextBtn" type="button" hidden={true}>
                  Next question
                </button>
                {' '}
                <span className="hint" id="qHint">
                  Pick an option, then submit.
                </span>
              </div>
            </div>
            <aside className="ladder">
              <span className="mono">
                Difficulty
              </span>
              <div className="rung" id="rung-h" style={{ '--rc': "var(--rose)" } as CSSProperties}>
                <i />
                Hard
              </div>
              <div className="rung" id="rung-m" style={{ '--rc': "var(--peri)" } as CSSProperties}>
                <i />
                Medium
              </div>
              <div className="rung" id="rung-e" style={{ '--rc': "var(--teal)" } as CSSProperties}>
                <i />
                Easy
              </div>
            </aside>
          </div>
        </div>
        {/* ============ RESULT ============ */}
        <div id="resultView">
          <div className="result">
            <div className="rescard">
              <div className="mono" id="resName">
                Result
              </div>
              <div className="res__top" style={{ marginTop: "16px" }}>
                <div className="bigring">
                  <svg width="130" height="130" viewBox="0 0 130 130">
                    <circle cx="65" cy="65" r="55" fill="none" stroke="var(--line)" strokeWidth="10" />
                    <circle
                      id="resArc"
                      cx="65"
                      cy="65"
                      r="55"
                      fill="none"
                      stroke="url(#auroraGrad)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="345.6"
                      strokeDashoffset="345.6"
                     />
                  </svg>
                  {' '}
                  <span className="bigring__num">
                    <span id="resPct">
                      0%
                    </span>
                    <small>
                      mastery
                    </small>
                  </span>
                </div>
                <div className="res__verdict" id="resVerdict" />
              </div>
              <div className="journey">
                <div className="mono" style={{ marginBottom: "10px" }}>
                  Your difficulty journey
                </div>
                <svg id="journeySvg" viewBox="0 0 560 130" aria-hidden="true" />
              </div>
              <div className="stats" id="resStats" />
              <div className="reco" id="resReco" />
              <div className="mono" style={{ marginBottom: "10px" }}>
                Question review
              </div>
              <div className="review" id="resReview" />
              <div className="res__acts">
                <button className="btn-primary" id="retakeBtn" type="button">
                  Retake
                </button>
                {' '}
                <button className="btn-ghost" id="otherBtn" type="button">
                  Try the other test
                </button>
                {' '}
                <a className="btn-ghost" href="learn.html">
                  Back to Learn
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="wrap footer__base">
        <span className="mono">
          © 2026 BestBrain Learning Pvt. Ltd. · Noida, India
        </span>
      </footer>
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
