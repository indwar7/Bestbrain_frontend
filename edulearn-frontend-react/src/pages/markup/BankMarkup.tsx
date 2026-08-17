/* Generated from edulearn-frontend/bank.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function BankMarkup() {
  return (
    <>
      <div className="wrap">
        <a className="top-link" href="learn.html">
          ← Back to Learn
        </a>
        <h1>
          {"Question "}
          <em>
            Bank
          </em>
        </h1>
        <p className="sub" id="sub">
          Practise this chapter. No timer, no marks — answer, see why, keep going.
        </p>
        <div id="gate" className="gate" hidden={true}>
          {" Please "}
          <a href="login.html">
            log in
          </a>
          {" as a student to practise. "}
        </div>
        <div id="empty" className="empty" hidden={true}>
          No practice questions for this chapter yet.
        </div>
        <div id="quiz" hidden={true}>
          <div className="card">
            <div className="qnum">
              <span id="qnum">
                Question 1
              </span>
              <span className="diff" id="diff" />
            </div>
            <p className="qtext" id="qtext" />
            <div className="opts" id="opts" />
            <div id="feedback" />
            <div className="navrow">
              <button className="btn" id="nextBtn" type="button" hidden={true}>
                Next question
              </button>
              {' '}
              <button className="btn-ghost" id="moreBtn" type="button" hidden={true}>
                Practise more
              </button>
              {' '}
              <span className="tally" id="tally" />
            </div>
          </div>
        </div>
      </div>
      {' '}
      {' '}
      {' '}
    </>
  );
}
