/* Generated from edulearn-frontend/lesson.html, do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function LessonMarkup() {
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
      <main>
        {/* CHAPTER HUB: the two-option chooser shown when a student opens a chapter. */}
        <div className="hub" id="hubStage">
          <div className="hub__head">
            <div className="hub__crumb mono" id="hubCrumb">
              Lesson
            </div>
            <h1 className="hub__title" id="hubTitle">
              This chapter
            </h1>
            <p className="hub__sub">
              Pick how you'd like to learn this chapter, read the notes or watch the video lecture.
            </p>
          </div>
          <div className="hub__grid">
            <button className="optcard optcard--notes" id="optNotes" type="button">
              <span className="optcard__go" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              {' '}
              <span className="optcard__icon" aria-hidden="true">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H16l4 4v12.5A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5z" />
                  <path d="M15 3v4.5H20M8 12h8M8 16h6" />
                </svg>
              </span>
              {' '}
              <span className="optcard__body">
                <span className="optcard__name">
                  Read Notes
                </span>
                {' '}
                <span className="optcard__desc">
                  Concise, exam-ready notes that cover the whole chapter.
                </span>
                {' '}
                <span className="optcard__tag" id="notesTag">
                  <span className="dot" />
                  <span id="notesTagText">
                    Notes
                  </span>
                </span>
              </span>
            </button>
            {' '}
            <button className="optcard optcard--video" id="optVideo" type="button">
              <span className="optcard__go" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              {' '}
              <span className="optcard__icon" aria-hidden="true">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2.5" y="5" width="14" height="14" rx="3" />
                  <path d="M21.5 8.5 16.5 12l5 3.5z" />
                </svg>
              </span>
              {' '}
              <span className="optcard__body">
                <span className="optcard__name">
                  Watch Video Lecture
                </span>
                {' '}
                <span className="optcard__desc">
                  An animated lecture that walks you through every concept.
                </span>
                {' '}
                <span className="optcard__tag" id="videoTag">
                  <span className="dot" />
                  <span id="videoTagText">
                    Checking…
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>
        {/* NOTES view: rendered from the NOTES data for this chapter. */}
        <div className="notes" id="notesStage" style={{ display: "none" }}>
          <button className="subback" type="button" data-tohub="" aria-label="Back to chapter options">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 12 H4 M11 5 l-7 7 7 7" />
            </svg>
            {' '}
            <span>
              Back to chapter
            </span>
          </button>
          <div className="notes__card" id="notesBody" />
        </div>
        {/* Real video: shown when a teacher has uploaded a lecture that matches
         this chapter's class + subject + topic. */}
        <div className="vstage" id="videoStage" style={{ display: "none" }}>
          <button className="subback" type="button" data-tohub="" aria-label="Back to chapter options">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 12 H4 M11 5 l-7 7 7 7" />
            </svg>
            {' '}
            <span>
              Back to chapter
            </span>
          </button>
          <div className="vstage__crumb mono" id="videoCrumb">
            Lesson
          </div>
          <h1 className="vstage__title" id="videoTitle">
            Lecture
          </h1>
          <div className="vplayer-wrap">
            <video id="player" controls={true} playsInline={true} />
          </div>
          <div className="vmeta">
            <span className="tag" id="videoClassTag" />
            {' '}
            <span className="tag" id="videoSubjectTag" />
            {' '}
            <span id="videoByline" />
          </div>
          <div className="vplaylist" id="videoPlaylist" style={{ display: "none" }} />
        </div>
        {/* Placeholder: shown when no video has been uploaded yet for this chapter. */}
        <div className="stage" id="placeholderStage" style={{ display: "none" }}>
          <svg className="tokky" width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="9" r="4" fill="#3DE8C5" />
            <line x1="50" y1="21" x2="50" y2="12" stroke="#7C9BFF" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="56" r="34" fill="#121C30" stroke="url(#auroraGrad)" strokeWidth="2.5" />
            <rect x="36" y="44" width="8" height="14" rx="4" fill="#F2EDE3" />
            <rect x="56" y="44" width="8" height="14" rx="4" fill="#F2EDE3" />
            <path d="M42 67 q8 7 16 0" fill="none" stroke="#F2EDE3" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="stage__crumb mono" id="lessonCrumb">
            Lesson
          </div>
          <h1 className="stage__title" id="lessonTitle">
            This lesson
          </h1>
          <p className="stage__sub" id="placeholderSub">
            No video lecture has been uploaded for this chapter yet. It will appear here as soon as your teacher uploads it.
          </p>
          <div className="stage__mods" aria-hidden="true">
            <span className="modchip">
              Video
            </span>
            {' '}
            <span className="modchip">
              Notes
            </span>
            {' '}
            <span className="modchip">
              Test
            </span>
          </div>
          <button
            className="subback"
            type="button"
            data-tohub=""
            aria-label="Back to chapter options"
            style={{ alignSelf: "center" }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 12 H4 M11 5 l-7 7 7 7" />
            </svg>
            {' '}
            <span>
              Back to chapter
            </span>
          </button>
        </div>
      </main>
      {/* ============================================================
       CHAPTER HUB CONTROLLER + NOTES CONTENT
       Two options ("Read Notes" / "Watch Video Lecture") plus the
       exam-ready notes for the Class 6 Science chapters.
       ============================================================ */}
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
