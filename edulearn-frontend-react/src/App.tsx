import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuroraDefs from './components/AuroraDefs';
import ErrorBoundary from './components/ErrorBoundary';
import FeatureFooter from './components/FeatureFooter';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { guardRedirect } from './lib/guard';
import { useLegacyLinks } from './lib/useLegacyLinks';
import { useScrollReset } from './lib/useScrollReset';
import { usePageChrome } from './lib/usePageChrome';
import { useKidSkin } from './lib/useKidSkin';
import { pageFromPath } from './lib/pages';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Lesson from './pages/Lesson';
import Pal from './pages/Pal';
import Tutor from './pages/Tutor';
import Challenge from './pages/Challenge';
import MockTest from './pages/MockTest';
import TakeTest from './pages/TakeTest';
import CreateTest from './pages/CreateTest';
import Live from './pages/Live';
import Videos from './pages/Videos';
import Upload from './pages/Upload';
import Admin from './pages/Admin';
import Bank from './pages/Bank';
import Homework from './pages/Homework';
import HomeworkAssign from './pages/HomeworkAssign';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

/**
 * login.html and signup.html are the only pages with no shared nav, they own
 * the full viewport as an .auth-shell. Rendering the nav there would also trip
 * vivid.css's `:not(:has(.auth-shell))` guard into styling a surface it
 * deliberately excludes.
 */
/*
  privacy and terms are here for a different reason than login/signup: not a
  layout conflict, but that the product nav, with its streak chip, coin
  balance and role menu, is noise on a page whose only job is to be read.
  LegalLayout provides its own way back instead.
*/
const CHROMELESS = ['/login', '/signup', '/privacy', '/terms'];

/**
 * Pages that render the shared <FeatureFooter/>, the main content pages whose
 * body is 1600px wide, so the footer matches the content width. Dashboard,
 * landing and the narrow form/reader/chat pages are intentionally left out.
 */
const FOOTER_PAGES = new Set(['learn', 'live', 'challenge', 'mocktest', 'videos']);

export default function App() {
  const { pathname } = useLocation();
  const { loggedIn, role } = useAuth();

  /*
    The chrome follows where the visitor is actually going, not where the URL
    currently points.

    Everything below, usePageChrome and <Navbar>, sits outside <Routes>, so
    it used to render the gated page's chrome for the one commit before
    <ProtectedRoute> redirected away from it: the wrong nav, a different
    Google Fonts URL and, on the ways in that skip the click interceptor
    (a typed URL, Back/Forward, a session ending), the account FAB and
    features panel flashing in. Asking the same guard where this visitor ends
    up keeps the chrome on the destination from the first frame.
  */
  const routedPage = pageFromPath(pathname);
  const guardTo = guardRedirect(routedPage, loggedIn, role);
  const page = guardTo ? pageFromPath(guardTo) : routedPage;
  const chromeless = CHROMELESS.includes(guardTo ?? pathname);

  // The ported markup still links to "learn.html" etc., exactly as the static
  // pages did; this turns those into in-app navigations.
  useLegacyLinks();

  // A client-side navigation keeps the outgoing page's scroll position, so
  // the landing page's footer links opened their destination mid-document.
  useScrollReset();

  // Only load the shared assets this route's original page loaded.
  usePageChrome(page);

  // Last, so the skin measures the stylesheet the two hooks above just put in
  // place, and before this commit paints.
  useKidSkin(pathname);

  return (
    <>
      {/* No wrapper class here on purpose. The active page's own stylesheet
          owns body/background, exactly as it did on the static site. */}
      {/* The account menu is account-menu.js, loaded in index.html exactly as
          the static pages loaded it, and gated per route by usePageChrome. */}
      {!chromeless && <Navbar page={page} />}

      <ErrorBoundary resetKey={pathname}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/*
          Only these seven loaded role-guard.js, so only these get the hard
          redirect it performed. The remaining pages deliberately did not:
          upload, create-test and admin are teacher/admin tools that gate
          themselves in-page (a student sees "You must be logged in as a
          teacher"), and videos / take-test were never guarded at all.
          Guarding them here would bounce users the static site let through.
        */}
        <Route path="/dashboard" element={<ProtectedRoute page="dashboard"><Dashboard /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute page="learn"><Learn /></ProtectedRoute>} />
        <Route path="/lesson/:chapterId" element={<ProtectedRoute page="lesson"><Lesson /></ProtectedRoute>} />
        {/*
          A lesson URL that lost its :chapterId, e.g. a full-page load of
          "lesson.html?ch=…" that nginx 301s to bare "/lesson" (dropping the
          query), or the browser Back button landing there. Without this it
          matches no route and the page renders blank. Send it back to Learn,
          the lesson's parent.
        */}
        <Route path="/lesson" element={<Navigate to="/learn" replace />} />
        <Route path="/pal" element={<ProtectedRoute page="pal"><Pal /></ProtectedRoute>} />
        {/* Live doubt session, the voice call with PAL. Student-only, like
            the static site's tutor.html (see AuthContext ACCESS). */}
        <Route path="/tutor" element={<ProtectedRoute page="tutor"><Tutor /></ProtectedRoute>} />
        <Route path="/challenge" element={<ProtectedRoute page="challenge"><Challenge /></ProtectedRoute>} />
        <Route path="/mocktest" element={<ProtectedRoute page="mocktest"><MockTest /></ProtectedRoute>} />
        <Route path="/live" element={<ProtectedRoute page="live"><Live /></ProtectedRoute>} />

        {/* Unguarded, matching the originals, each self-gates where needed. */}
        <Route path="/take-test" element={<TakeTest />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin" element={<Admin />} />

        {/*
          Still ungated for a signed-in visitor - ProtectedRoute only redirects
          these when SIGNUP_WHEN_SIGNED_OUT applies, i.e. nobody is logged in.
          Wrapped because useLegacyLinks only resolves the guard on a CLICK;
          a typed URL, a bookmark or Back/Forward reaches the route directly.
        */}
        <Route path="/create-test" element={<ProtectedRoute page="create-test"><CreateTest /></ProtectedRoute>} />
        <Route path="/videos" element={<ProtectedRoute page="videos"><Videos /></ProtectedRoute>} />

        {/*
          Question bank and homework. Both gate themselves in-page, the bank
          and the student's homework list ask the API, which answers 403 to
          anyone who is not a student, and homework-assign checks for a teacher
          before it renders. That matches how upload/create-test/admin already
          behave, and it is why they are not wrapped in ProtectedRoute: a
          router-level guard here would bounce a signed-out visitor to the
          landing page instead of showing them the "please log in" state the
          page already has.
        */}
        <Route path="/bank" element={<ProtectedRoute page="bank"><Bank /></ProtectedRoute>} />
        <Route path="/homework" element={<ProtectedRoute page="homework"><Homework /></ProtectedRoute>} />
        <Route path="/homework-assign" element={<HomeworkAssign />} />

        {/* Public legal pages, linked from the landing footer. */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* Legacy ".html" aliases in case an old link is followed. */}
        <Route path="/privacy.html" element={<Navigate to="/privacy" replace />} />
        <Route path="/terms.html" element={<Navigate to="/terms" replace />} />

        {/*
          Catch-all: any URL that matches no route above, a stale ".html"
          link, a mistyped path, or a Back/redirect that dropped its params ,
          used to render nothing (a white screen). Fall back to the dashboard,
          which itself sends logged-out users to the landing page.
        */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </ErrorBoundary>

      {/*
        One shared footer on the main content feature pages, all 1600px wide,
        so the footer's width matches the page content exactly (no negative
        space). Deliberately excludes the dashboard (keeps its own footer), the
        landing (its <SiteFooter/>), login/signup (chromeless), and the narrow
        form/reader/chat pages (a 1600px footer would overhang their content).
      */}
      {FOOTER_PAGES.has(page) && <FeatureFooter />}

      {/* Defines url(#auroraGrad), which the brand mark fills itself with. */}
      <AuroraDefs />
    </>
  );
}
