/* Generated from edulearn-frontend/homework.html, do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function HomeworkMarkup() {
  return (
    <>
      <div className="wrap">
        <a className="top-link" href="learn.html">
          ← Back to Learn
        </a>
        <h1>
          {"Your "}
          <em>
            Homework
          </em>
        </h1>
        <p className="sub" id="sub">
          Work your teacher has set for your class.
        </p>
        <div id="gate" className="gate" hidden={true}>
          {" Please "}
          <a href="login.html">
            log in
          </a>
          {" as a student to see your homework. "}
        </div>
        {/* list view */}
        <div id="listView">
          <div id="list" />
          <div id="empty" className="empty" hidden={true}>
            No homework set for this chapter yet.
          </div>
        </div>
        {/* attempt view */}
        <div id="attemptView" hidden={true}>
          <div className="card">
            <div className="qnum" id="qnum">
              Question 1
            </div>
            <p className="qtext" id="qtext" />
            <div className="opts" id="opts" />
            <div className="navrow">
              <button className="btn-ghost" id="prevBtn" type="button">
                Previous
              </button>
              {' '}
              <button className="btn-ghost" id="nextBtn" type="button">
                Next
              </button>
              {' '}
              <button className="btn" id="submitBtn" type="button">
                Submit homework
              </button>
              {' '}
              <span className="prog" id="prog" />
            </div>
            <div id="attemptMsg" />
          </div>
          <div id="writtenAttempt" />
        </div>
        {/* results view */}
        <div id="resultView" hidden={true}>
          <div className="card">
            <div className="score" id="score" />
            <p className="sub" id="scoreNote" style={{ marginTop: "10px" }} />
            <button className="btn-ghost" id="backBtn" type="button">
              Back to homework
            </button>
          </div>
          <div id="writtenResult" />
          <div id="review" />
        </div>
      </div>
      {' '}
      {' '}
      {' '}
    </>
  );
}
