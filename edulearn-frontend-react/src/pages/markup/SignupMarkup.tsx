/* Generated from edulearn-frontend/signup.html — do not hand-edit.
   Regenerate with `npm run sync:markup`. */
export default function SignupMarkup() {
  return (
    <>
      <div className="auth-shell">
        <aside className="brand-panel">
          <div className="brand-logo">
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
          </div>
          <div className="brand-mid">
            <span className="brand-eyebrow">
              Start free · No card needed
            </span>
            <h2 className="brand-head">
              {"Your "}
              <em>
                learning
              </em>
              <br />
              starts here.
            </h2>
            <p className="brand-sub">
              Join 50,000+ students, teachers and parents across Bharat learning the smart way.
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
                {" Free access to 9,000+ lessons"}
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
                    <path d="M3 3v18h18" />
                    <path d="m7 14 4-4 3 3 5-6" />
                  </svg>
                </span>
                {" Track progress across every subject"}
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
                {" AI tutor for instant doubt-solving"}
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
                Classes 6-9
              </div>
              <div className="l">
                CBSE · NCERT
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
        <main className="auth-panel">
          <div className="container">
            <div className="logo">
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
            </div>
            <div id="signupFormView">
              <h1>
                Create your account
              </h1>
              <p className="subtitle">
                Sign up as a student, teacher, or parent
              </p>
              {/* Role tabs */}
              <div className="role-tabs" id="roleTabs" role="tablist" aria-label="Sign up as">
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
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      First Name
                    </label>
                    {' '}
                    <input type="text" id="firstName" autoComplete="given-name" required={true} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">
                      Last Name
                    </label>
                    {' '}
                    <input type="text" id="lastName" autoComplete="family-name" required={true} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address
                    </label>
                    {' '}
                    <input type="email" id="email" placeholder="you@example.com" autoComplete="email" required={true} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number
                    </label>
                    {' '}
                    <input type="tel" id="phone" placeholder="+91 98765 43210" autoComplete="tel" required={true} />
                  </div>
                </div>
                <div className="form-group form-row full">
                  <label htmlFor="password">
                    Password
                  </label>
                  <div className="pw-field">
                    <input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      required={true}
                      minLength={6}
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
                        width="18"
                        height="18"
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
                        width="18"
                        height="18"
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
                {/* ============ STUDENT fields ============ */}
                <div className="role-fields" data-fields="student">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="s_roll">
                        Roll Number
                      </label>
                      {' '}
                      <input type="text" id="s_roll" placeholder="e.g. 7A-045" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="s_board">
                        Board
                      </label>
                      {' '}
                      <select id="s_board">
                        <option value="CBSE">
                          CBSE
                        </option>
                        <option value="ICSE">
                          ICSE
                        </option>
                        <option value="State">
                          State
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="s_class">
                        Class
                      </label>
                      {' '}
                      <select id="s_class" defaultValue="Class 7">
                        <option value="Class 6">
                          Class 6
                        </option>
                        <option value="Class 7">
                          Class 7
                        </option>
                        <option value="Class 8">
                          Class 8
                        </option>
                        <option value="Class 9">
                          Class 9
                        </option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="s_section">
                        Section
                      </label>
                      {' '}
                      <select id="s_section">
                        <option value="A">
                          A
                        </option>
                        <option value="B">
                          B
                        </option>
                        <option value="C">
                          C
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* ============ TEACHER fields ============ */}
                <div className="role-fields" data-fields="teacher" style={{ display: "none" }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="t_id">
                        Teacher ID
                      </label>
                      {' '}
                      <input type="text" id="t_id" placeholder="e.g. TCH-217" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="t_subject">
                        Subject
                      </label>
                      {' '}
                      <input type="text" id="t_subject" placeholder="Science" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="t_class">
                        Class
                      </label>
                      {' '}
                      <select id="t_class" defaultValue="Class 7">
                        <option value="Class 6">
                          Class 6
                        </option>
                        <option value="Class 7">
                          Class 7
                        </option>
                        <option value="Class 8">
                          Class 8
                        </option>
                        <option value="Class 9">
                          Class 9
                        </option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="t_section">
                        Section
                      </label>
                      {' '}
                      <select id="t_section">
                        <option value="A">
                          A
                        </option>
                        <option value="B">
                          B
                        </option>
                        <option value="C">
                          C
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* ============ PARENT fields ============ */}
                <div className="role-fields" data-fields="parent" style={{ display: "none" }}>
                  <p className="role-hint">
                    Link to your child's account using their details:
                  </p>
                  <div className="form-group form-row full">
                    <label htmlFor="p_roll">
                      Child's Roll Number
                    </label>
                    {' '}
                    <input type="text" id="p_roll" placeholder="As given by their school" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="p_name">
                        Child's Full Name
                      </label>
                      {' '}
                      <input type="text" id="p_name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="p_class">
                        Child's Class
                      </label>
                      {' '}
                      <select id="p_class" defaultValue="Class 7">
                        <option value="Class 6">
                          Class 6
                        </option>
                        <option value="Class 7">
                          Class 7
                        </option>
                        <option value="Class 8">
                          Class 8
                        </option>
                        <option value="Class 9">
                          Class 9
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div id="signupError" className="auth-error" style={{ display: "none" }} />
                <div className="checkbox-group">
                  <input type="checkbox" id="terms" required={true} />
                  {' '}
                  <label htmlFor="terms">
                    {"I agree to the "}
                    <a href="#">
                      Terms of Service
                    </a>
                    {" and "}
                    <a href="#">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                <button type="submit" className="btn btn-primary">
                  <span>
                    Create Account
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
                <div className="divider">
                  or sign up with
                </div>
                <div className="social-logins">
                  <button type="button" className="social-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M17.05 13.5c-.91 2.13-.505 4.26 1.75 5.59.94.565 2.05.96 3.25 1.12-.15 1.17-.915 2.08-1.915 2.38-1.94.585-4.42.19-6.64-1.05-.68-.37-1.28-.86-1.81-1.41-.53.55-1.13 1.04-1.81 1.41-2.22 1.24-4.7 1.635-6.64 1.05-1-.3-1.765-1.21-1.915-2.38 1.2-.16 2.31-.555 3.25-1.12 2.255-1.33 2.66-3.46 1.75-5.59-1.755-4.18-7.805-5.06-7.805-5.06 0-.39.04-.78.11-1.16 6.265-.365 8.715 2.645 10.985 4.47 2.27-1.825 4.72-4.835 10.985-4.47.07.38.11.77.11 1.16 0 0-6.05.88-7.805 5.06z"
                       />
                    </svg>
                    {" Apple "}
                  </button>
                </div>
              </form>
              <p className="signin-link">
                {" Already have an account? "}
                <a href="login.html">
                  Sign in
                </a>
              </p>
              <div className="features">
                <div className="feature">
                  <span className="feature-icon">
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
                      <path d="m9 12 2 2 4-4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </span>
                  {' '}
                  <span>
                    Free access to 9,000+ lessons
                  </span>
                </div>
                <div className="feature">
                  <span className="feature-icon">
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
                      <path d="m9 12 2 2 4-4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </span>
                  {' '}
                  <span>
                    Track your progress
                  </span>
                </div>
                <div className="feature">
                  <span className="feature-icon">
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
                      <path d="m9 12 2 2 4-4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </span>
                  {' '}
                  <span>
                    All classes & boards
                  </span>
                </div>
                <div className="feature">
                  <span className="feature-icon">
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
                      <path d="m9 12 2 2 4-4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </span>
                  {' '}
                  <span>
                    Learn at your own pace
                  </span>
                </div>
              </div>
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
                    Verify & Get Started
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
                <div
                  style={{ textAlign: "center", fontSize: "14px", display: "flex", justifyContent: "center", gap: "12px" }}
                >
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
                    {" Back"}
                  </a>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      {/* /auth-shell */}
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
