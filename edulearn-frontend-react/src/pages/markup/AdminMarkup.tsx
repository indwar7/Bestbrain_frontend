/* Generated from edulearn-frontend/admin.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function AdminMarkup() {
  return (
    <>
      <div className="wrap">
        <div className="top">
          <div>
            <h1>
              {"Live "}
              <em>
                Database
              </em>
            </h1>
            <p className="sub">
              {"Every user registered on BestBrain — straight from MongoDB. "}
              <span className="live">
                <span className="dot" />
                <span className="mono" id="auto">
                  auto-refresh 5s
                </span>
              </span>
            </p>
          </div>
          <button className="btn">
            ↻ Refresh now
          </button>
        </div>
        <div className="stats" id="stats" />
        <div className="filters" id="filters">
          <button className="on" data-f="all">
            All
          </button>
          {' '}
          <button data-f="student">
            Students
          </button>
          {' '}
          <button data-f="teacher">
            Teachers
          </button>
          {' '}
          <button data-f="parent">
            Parents
          </button>
        </div>
        <div id="errBox" />
        <div className="tablecard">
          <table>
            <thead>
              <tr>
                <th>
                  Name
                </th>
                <th>
                  Email
                </th>
                <th>
                  Phone
                </th>
                <th>
                  Role
                </th>
                <th>
                  ID / Roll
                </th>
                <th>
                  Class
                </th>
                <th>
                  Registered
                </th>
              </tr>
            </thead>
            <tbody id="rows">
              <tr>
                <td colSpan={7} className="empty">
                  Loading…
                </td>
              </tr>
            </tbody>
          </table>
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
