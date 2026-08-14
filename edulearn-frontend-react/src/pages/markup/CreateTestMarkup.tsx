/* Generated from edulearn-frontend/create-test.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function CreateTestMarkup() {
  return (
    <>
      <div className="wrap">
        <a className="top-link" href="dashboard.html">
          ← Back to dashboard
        </a>
        <h1>
          {"Create a "}
          <em>
            Test
          </em>
        </h1>
        <p className="sub">
          Set how many questions, how long per question, then write the questions — your students get a real, timed, auto-graded test.
        </p>
        <div id="gate" className="gate" style={{ display: "none" }}>
          {" You must be logged in as a "}
          <b>
            teacher
          </b>
          {" to create a test. "}
          <a href="login.html">
            Login
          </a>
        </div>
        <form id="form">
          <div className="card">
            <h2>
              Test settings
            </h2>
            <label htmlFor="title">
              Test title
            </label>
            {' '}
            <input type="text" id="title" placeholder="e.g. Heat — Chapter Test" required={true} />
            <div className="row3">
              <div>
                <label htmlFor="classSubject">
                  Class & subject
                </label>
                {' '}
                <select id="classSubject" required={true} />
              </div>
              <div>
                <label htmlFor="seconds">
                  Seconds per question
                </label>
                {' '}
                <input type="number" id="seconds" min="5" max="300" defaultValue="30" required={true} />
              </div>
              <div>
                <label htmlFor="numQuestions">
                  Number of questions
                </label>
                {' '}
                <input type="number" id="numQuestions" min="1" max="30" defaultValue="7" required={true} />
              </div>
            </div>
          </div>
          <div id="questionsHost" />
          <div className="actions" style={{ marginBottom: "20px" }}>
            <button type="button" className="btn-ghost" id="addQBtn">
              + Add another question
            </button>
          </div>
          <div className="card">
            <div className="actions">
              <button type="submit" className="btn" id="submitBtn">
                Create test
              </button>
              {' '}
              <span id="formMsg" className="msg" style={{ marginTop: "0", flexBasis: "100%" }} />
            </div>
          </div>
        </form>
        <div className="card" id="resultCard" style={{ display: "none" }}>
          <h2>
            Test created
          </h2>
          <p className="sub" style={{ marginBottom: "14px" }}>
            Share this link with your class — each student who opens it gets their own timed attempt.
          </p>
          <div className="link-box">
            <span id="testLink" />
            {' '}
            <button type="button" className="btn-ghost" id="copyLinkBtn" style={{ flex: "none" }}>
              Copy
            </button>
          </div>
          <div className="actions" style={{ marginTop: "16px" }}>
            <a className="btn-ghost" id="openLinkBtn" href="#" target="_blank">
              Open as a preview
            </a>
            {' '}
            <button type="button" className="btn" id="createAnotherBtn">
              Create another test
            </button>
          </div>
        </div>
      </div>
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
