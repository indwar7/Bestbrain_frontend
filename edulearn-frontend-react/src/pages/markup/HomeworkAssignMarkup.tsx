/* Generated from edulearn-frontend/homework-assign.html, do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function HomeworkAssignMarkup() {
  return (
    <>
      <div className="wrap">
        <a className="top-link" href="dashboard.html">
          ← Back to dashboard
        </a>
        <h1>
          {"Assign "}
          <em>
            Homework
          </em>
        </h1>
        <p className="sub">
          Pick a chapter, choose questions from the bank, set a due date. Students see it on Learn.
        </p>
        <div id="gate" className="gate" hidden={true}>
          {" You must be logged in as a "}
          <strong>
            teacher
          </strong>
          {" to assign homework. "}
          <a href="login.html">
            Log in
          </a>
        </div>
        <div id="main">
          <div className="card">
            <h2>
              1 · Which chapter
            </h2>
            <div className="row3">
              <div>
                <label htmlFor="fClass">
                  Class
                </label>
                {' '}
                <select id="fClass">
                  <option>
                    Class 6
                  </option>
                  <option>
                    Class 7
                  </option>
                  <option>
                    Class 8
                  </option>
                  <option>
                    Class 9
                  </option>
                </select>
              </div>
              <div>
                <label htmlFor="fSubject">
                  Subject
                </label>
                {' '}
                <select id="fSubject">
                  <option>
                    Science
                  </option>
                  <option>
                    Maths
                  </option>
                  <option>
                    Social Science
                  </option>
                  <option>
                    English
                  </option>
                  <option>
                    Hindi
                  </option>
                </select>
              </div>
              <div>
                <label htmlFor="fChapter">
                  Chapter
                </label>
                {' '}
                <select id="fChapter">
                  <option value="">
                    All chapters
                  </option>
                </select>
              </div>
            </div>
            <button className="btn-ghost" id="loadQs" type="button">
              Load questions
            </button>
          </div>
          <div className="card" id="pickCard" hidden={true}>
            <h2>
              2 · Choose questions
            </h2>
            <p className="muted" id="pickCount">
              Nothing selected yet.
            </p>
            <div id="qlist" />
          </div>
          <div className="card" id="detailCard" hidden={true}>
            <h2>
              3 · Title and due date
            </h2>
            <label htmlFor="fTitle">
              Title *
            </label>
            {' '}
            <input id="fTitle" type="text" placeholder="e.g. Light and shadows, chapter check" />
            {' '}
            <label htmlFor="fInstructions">
              Instructions
            </label>
            {' '}
            <textarea id="fInstructions" placeholder="Anything the student should know before starting." />
            <div className="row">
              <div>
                <label htmlFor="fDue">
                  Due date *
                </label>
                {' '}
                <input id="fDue" type="date" />
              </div>
              <div>
                <label htmlFor="fPublished">
                  Visible to students
                </label>
                {' '}
                <select id="fPublished">
                  <option value="yes">
                    Yes, assign now
                  </option>
                  <option value="no">
                    No, save as draft
                  </option>
                </select>
              </div>
            </div>
            <button className="btn" id="assignBtn" type="button">
              Assign homework
            </button>
            <div className="msg" id="msg" />
          </div>
          <div className="card">
            <h2>
              Your assignments
            </h2>
            <div id="mine">
              <p className="muted">
                Loading…
              </p>
            </div>
          </div>
        </div>
      </div>
      {' '}
      {' '}
      {' '}
      {' '}
    </>
  );
}
