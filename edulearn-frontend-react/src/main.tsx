import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { installEduApiGlobal } from './lib/eduApiGlobal';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';

// No global CSS import here. index.html loads theme.css and vivid.css as real
// <link> tags in a deliberate order, and each route swaps its own stylesheet
// into the <style id="page-css"> slot between them. A CSS import from JS would
// be appended after vivid.css and outrank the theme.

// features-panel.js (loaded from index.html, verbatim from the static site)
// reads window.EduAPI to show real progress.
installEduApiGlobal();

// Deliberately not wrapped in <StrictMode>. Its double-invoked effects would
// run each page's lifted script twice per mount, and that legacy code is not
// idempotent, it appends nodes and binds handlers imperatively, so a second
// pass duplicates UI rather than being a no-op.
/**
 * Top-level guard: wraps the ENTIRE app (nav + hooks + routes) so a render
 * error anywhere, including on a browser Back navigation, shows a recoverable
 * card instead of a blank white screen. Keyed by pathname so it clears on the
 * next navigation. App also boundaries its own <Routes>; this additionally
 * covers App-level code (the nav, useLegacyLinks/usePageChrome) that renders
 * outside that inner boundary.
 */
function GuardedApp() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary resetKey={pathname}>
      <App />
    </ErrorBoundary>
  );
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <GuardedApp />
    </AuthProvider>
  </BrowserRouter>,
);
