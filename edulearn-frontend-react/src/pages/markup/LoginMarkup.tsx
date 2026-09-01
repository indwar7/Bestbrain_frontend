/* Generated from edulearn-frontend/login.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function LoginMarkup() {
  return (
    <>
      <div className="auth-shell">
        {/* LEFT: brand / relevance panel */}
        <aside className="brand-panel">
          <a className="brand-logo" href="index.html" aria-label="BestBrain home">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 1.5 L14.6 9.4 L22.5 12 L14.6 14.6 L12 22.5 L9.4 14.6 L1.5 12 L9.4 9.4 Z"
                fill="url(#auroraGrad)"
               />
            </svg>
            {' '}
            <span className="logo-text">
              BestBrain
            </span>
          </a>
          <div className="brand-mid">
            <span className="brand-eyebrow">
              CBSE · NCERT · 20+ State Boards
            </span>
            <h2 className="brand-head">
              {"Learn "}
              <em>
                smarter
              </em>
              ,
              <br />
              {"score "}
              <em>
                better
              </em>
              .
            </h2>
            <p className="brand-sub">
              Animated lessons, adaptive practice and an AI tutor that never sleeps — for Classes 6–9.
            </p>
            <div className="brand-feats">
              <div className="brand-feat">
                <span className="fi">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 12 2 2 4-4" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </span>
                {" 9,000+ interactive video lessons"}
              </div>
              <div className="brand-feat">
                <span className="fi">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
                    <path d="M3 8v6M21 8v6M7 11v4a5 3 0 0 0 10 0v-4" />
                  </svg>
                </span>
                {" Live classes with real tutors"}
              </div>
              <div className="brand-feat">
                <span className="fi">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2Z" />
                    <path d="M9 22h6" />
                  </svg>
                </span>
                {" PAL — your personal AI doubt solver"}
              </div>
            </div>
          </div>
          <div className="brand-foot">
            <div className="brand-stat">
              <div className="n">
                50,000+
              </div>
              <div className="l">
                Active learners
              </div>
            </div>
            <div className="brand-divider" />
            <div className="brand-stat">
              <div className="n">
                9,000+
              </div>
              <div className="l">
                Video lessons
              </div>
            </div>
            <div className="brand-divider" />
            <div className="brand-stat">
              <div className="n">
                4.9★
              </div>
              <div className="l">
                Learner rating
              </div>
            </div>
          </div>
        </aside>
        {/* RIGHT: glassmorphism auth card */}
        <main className="auth-panel">
          <div className="container">
            <a className="logo reveal d1" href="index.html" aria-label="BestBrain home">
              <svg className="logo-mark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 1.5 L14.6 9.4 L22.5 12 L14.6 14.6 L12 22.5 L9.4 14.6 L1.5 12 L9.4 9.4 Z"
                  fill="url(#auroraGrad)"
                 />
              </svg>
              {' '}
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3DE8C5" />
                    <stop offset="48%" stopColor="#7C9BFF" />
                    <stop offset="100%" stopColor="#FFB454" />
                  </linearGradient>
                </defs>
              </svg>
              {' '}
              <span className="logo-text">
                BestBrain
              </span>
            </a>
            <div id="loginFormView">
              <h1 className="reveal d2">
                Welcome back
              </h1>
              <p className="subtitle reveal d2">
                Sign in to continue your learning journey
              </p>
              {/* Role tabs */}
              <div className="role-tabs reveal d3" id="roleTabs" role="tablist" aria-label="Login as">
                <button type="button" className="role-tab on" data-role="student" role="tab" aria-selected="true">
                  Student
                </button>
                {' '}
                <button type="button" className="role-tab" data-role="teacher" role="tab" aria-selected="false">
                  Teacher
                </button>
                {' '}
                <button type="button" className="role-tab" data-role="parent" role="tab" aria-selected="false">
                  Parent
                </button>
              </div>
              <form>
                <div className="form-group reveal d4">
                  <label htmlFor="email">
                    Email Address
                  </label>
                  <div className="field-wrap">
                    <svg
                      className="field-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                      <path d="m3 6 9 6 9-6" />
                    </svg>
                    {' '}
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      autoComplete="username"
                      required={true}
                     />
                  </div>
                </div>
                <div className="form-group reveal d4">
                  <label htmlFor="password">
                    Password
                  </label>
                  <div className="pw-field field-wrap">
                    <svg
                      className="field-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
                      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
                    </svg>
                    {' '}
                    <input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required={true}
                     />
                    {' '}
                    <button
                      type="button"
                      className="pw-toggle"
                      id="pwToggle"
                      aria-label="Show password"
                      aria-pressed="false"
                    >
                      <svg
                        className="eye"
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {' '}
                      <svg
                        className="eye-off"
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 3l18 18" />
                        <path
                          d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10.5 7 10.5 7a15.7 15.7 0 0 1-3.4 4.2M6.7 6.7C3.9 8.5 1.5 12 1.5 12s4 7 10.5 7c1.5 0 2.9-.3 4.1-.9"
                         />
                        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div id="loginError" className="auth-error" style={{ display: "none" }} />
                <div className="forgot-password reveal d4">
                  <a href="#">
                    Forgot password?
                  </a>
                </div>
                <button type="submit" className="btn btn-primary reveal d5">
                  <span>
                    Sign In
                  </span>
                  {' '}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="divider reveal d6">
                  or continue with
                </div>
                <div className="social-logins reveal d6">
                  <button type="button" className="social-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                       />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                       />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                       />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                       />
                    </svg>
                    {" Google "}
                  </button>
                  {' '}
                  <button type="button" className="social-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M17.05 13.5c-.91 2.13-.505 4.26 1.75 5.59.94.565 2.05.96 3.25 1.12-.15 1.17-.915 2.08-1.915 2.38-1.94.585-4.42.19-6.64-1.05-.68-.37-1.28-.86-1.81-1.41-.53.55-1.13 1.04-1.81 1.41-2.22 1.24-4.7 1.635-6.64 1.05-1-.3-1.765-1.21-1.915-2.38 1.2-.16 2.31-.555 3.25-1.12 2.255-1.33 2.66-3.46 1.75-5.59-1.755-4.18-7.805-5.06-7.805-5.06 0-.39.04-.78.11-1.16 6.265-.365 8.715 2.645 10.985 4.47 2.27-1.825 4.72-4.835 10.985-4.47.07.38.11.77.11 1.16 0 0-6.05.88-7.805 5.06z"
                       />
                    </svg>
                    {" Apple "}
                  </button>
                </div>
              </form>
              <p className="signup-link reveal d6">
                {" Don't have an account? "}
                <a href="signup.html">
                  Sign up for free
                </a>
              </p>
            </div>
            {/* OTP Form View */}
            <div id="otpFormView" style={{ display: "none" }}>
              <h1>
                Verification Code
              </h1>
              <p className="subtitle" id="otpSubtitle" style={{ marginBottom: "20px" }}>
                Please enter the 6-digit code sent to your email
              </p>
              {/* Channel selector if both email and phone are available */}
              <div
                id="otpChannelSelector"
                style={{ display: "none", marginBottom: "16px", textAlign: "center" }}
              >
                <span style={{ fontSize: "13px", color: "#6B7280" }}>
                  Send code via:
                </span>
                {' '}
                <button
                  type="button"
                  id="channelBtnEmail"
                  className="social-btn"
                  style={{ display: "inline-flex", padding: "6px 12px", fontSize: "12px", marginLeft: "6px" }}
                >
                  Email
                </button>
                {' '}
                <button
                  type="button"
                  id="channelBtnPhone"
                  className="social-btn"
                  style={{ display: "inline-flex", padding: "6px 12px", fontSize: "12px", marginLeft: "6px" }}
                >
                  Phone
                </button>
              </div>
              <div id="devCodeAlert" className="demo-info" style={{ display: "none" }}>
                <strong>
                  Demo OTP:
                </strong>
                {' '}
                <span
                  id="devCodeVal"
                  style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: "bold", letterSpacing: "1px" }}
                 />
              </div>
              <form>
                {/* OTP Inputs */}
                <div
                  style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "24px" }}
                  className="otp-inputs-wrapper"
                >
                  <input
                    type="text"
                    className="otp-digit"
                    maxLength={1}
                    pattern="[0-9]"
                    inputMode="numeric"
                    required={true}
                   />
                  {' '}
                  <input
                    type="text"
                    className="otp-digit"
                    maxLength={1}
                    pattern="[0-9]"
                    inputMode="numeric"
                    required={true}
                   />
                  {' '}
                  <input
                    type="text"
                    className="otp-digit"
                    maxLength={1}
                    pattern="[0-9]"
                    inputMode="numeric"
                    required={true}
                   />
                  {' '}
                  <input
                    type="text"
                    className="otp-digit"
                    maxLength={1}
                    pattern="[0-9]"
                    inputMode="numeric"
                    required={true}
                   />
                  {' '}
                  <input
                    type="text"
                    className="otp-digit"
                    maxLength={1}
                    pattern="[0-9]"
                    inputMode="numeric"
                    required={true}
                   />
                  {' '}
                  <input
                    type="text"
                    className="otp-digit"
                    maxLength={1}
                    pattern="[0-9]"
                    inputMode="numeric"
                    required={true}
                   />
                </div>
                <div id="otpError" className="auth-error" style={{ display: "none" }} />
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="verifyOtpBtn"
                  style={{ marginBottom: "16px" }}
                >
                  <span>
                    Verify & Continue
                  </span>
                  {' '}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <div style={{ textAlign: "center", fontSize: "14px", color: "#6B7280", marginBottom: "16px" }}>
                  {" Didn't receive the code? "}
                  <a
                    href="#"
                    id="resendOtpLink"
                    style={{ color: "var(--teal)", textDecoration: "none", fontWeight: "700" }}
                  >
                    Resend Code
                  </a>
                  {' '}
                  <span id="resendTimerText" style={{ display: "none" }}>
                    {"in "}
                    <span id="resendCountdown">
                      60
                    </span>
                    s
                  </span>
                </div>
                <div style={{ textAlign: "center", fontSize: "14px" }}>
                  <a href="#" style={{ color: "#6B7280", textDecoration: "none", fontWeight: "600" }}>
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
                      <path d="M19 12H5" />
                      <path d="m12 19-7-7 7-7" />
                    </svg>
                    {" Back to Login"}
                  </a>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      {/* /auth-shell */}
      {' '}
      {/* Auth pages are DARK by default (premium look). Theme is chosen from
         Settings (after login), not here — this just honours a saved 'light'. */}
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
