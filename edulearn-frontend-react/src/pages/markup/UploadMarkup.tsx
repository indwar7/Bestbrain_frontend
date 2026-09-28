/* Generated from edulearn-frontend/upload.html, do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function UploadMarkup() {
  return (
    <>
      <div className="wrap">
        <h1>
          {"Upload "}
          <em id="uploadKind">
            Video Lecture
          </em>
        </h1>
        <p className="sub">
          Teachers & admins, add a lecture video or chapter notes for a class & subject.
        </p>
        <div id="gate" className="gate" style={{ display: "none" }}>
          {" You must be logged in as a "}
          <b>
            teacher
          </b>
          {" to upload. "}
          <a href="login.html">
            Login
          </a>
        </div>
        <div className="card" id="form">
          <div className="utype" id="utype" role="tablist" aria-label="What to upload">
            <button type="button" className="utype__tab on" data-utype="video" role="tab" aria-selected="true">
              Video Lecture
            </button>
            {' '}
            <button type="button" className="utype__tab" data-utype="note" role="tab" aria-selected="false">
              Notes
            </button>
          </div>
          <label id="titleLabel">
            Video Title *
          </label>
          {' '}
          <input id="title" placeholder="Numericals - Whole Numbers" />
          <div className="row">
            <div>
              <label htmlFor="className">
                Class *
              </label>
              {' '}
              <select id="className">
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
              <label htmlFor="subject">
                Subject *
              </label>
              {' '}
              <select id="subject">
                <option>
                  Maths
                </option>
                <option>
                  Science
                </option>
                <option>
                  English
                </option>
                <option>
                  Social Studies
                </option>
              </select>
            </div>
          </div>
          <label>
            Topic
          </label>
          {' '}
          <input id="topic" placeholder="Numericals" />
          {' '}
          <label>
            Description
          </label>
          {' '}
          <textarea id="description" rows={2} placeholder="What this lecture covers…" />
          {' '}
          <label id="fileLabel">
            Video File *
          </label>
          <div className="drop" id="drop">
            <div className="ico">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 13v8" />
                <path d="m8 17 4-4 4 4" />
                <path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24" />
              </svg>
            </div>
            <div className="t" id="dropText">
              Click or drop a video here
            </div>
            <div className="s" id="dropHint">
              MP4, up to 500 MB
            </div>
            <div className="file-name" id="fileName" />
          </div>
          <input type="file" id="file" accept="video/*" style={{ display: "none" }} />
          <div className="bar" id="bar">
            <span id="barFill" />
          </div>
          <button className="btn" id="submit">
            Upload Lecture
          </button>
          <div className="msg" id="msg" />
          <div className="links">
            <a href="videos.html">
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
                style={{ verticalAlign: "-3px" }}
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              {" View video library"}
            </a>
            {" · "}
            <a href="dashboard.html">
              Dashboard
            </a>
          </div>
        </div>
      </div>
      {/* Settings + logout. Needs api.js above it, and it renders nothing
         when nobody is signed in. kid-ui moves its buttons into the rail. */}
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
