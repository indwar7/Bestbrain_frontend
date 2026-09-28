import { roleAllows } from '../context/AuthContext';

/**
 * The pages App wraps in <ProtectedRoute>.
 *
 * Kept here rather than read back off the JSX so the click interceptor in
 * useLegacyLinks and the route guard itself can never disagree about which
 * pages are gated. The unguarded pages are deliberately absent: upload,
 * create-test, admin, bank, homework and homework-assign gate themselves
 * in-page, and videos / take-test were never guarded at all, see the route
 * table in App.tsx for why.
 */
export const PROTECTED_PAGES = new Set([
  'dashboard', 'learn', 'lesson', 'pal', 'tutor', 'challenge', 'mocktest', 'live',
]);

/**
 * Pages that stay ungated for a signed-IN visitor but that a signed-OUT one
 * should never be dropped into.
 *
 * These four self-gate: each renders its own "Please log in as a student to
 * practise" / "You must be logged in as a teacher" state, which is the right
 * thing when you are already inside the product and clicked through to a page
 * your role cannot open. It is the wrong thing as the answer to a landing-page
 * card, a visitor who taps "Question Bank" on the homepage gets an empty
 * inner screen and a login link, when what they were asking for was the
 * product. The eight cards that link to PROTECTED_PAGES already resolve to
 * signup for them; this makes the rest behave the same.
 *
 * Deliberately NOT in PROTECTED_PAGES, which would run roleAllows() as well:
 * ACCESS is a line-for-line port of role-guard.js and lists neither 'bank' nor
 * 'homework', so a signed-in student clicking either would be bounced to the
 * dashboard. Signed in, this set does nothing at all.
 */
export const SIGNUP_WHEN_SIGNED_OUT = new Set([
  'bank', 'homework', 'videos', 'create-test',
]);

/**
 * Where a visitor aiming at `page` should actually end up, or null if they may
 * stay put.
 *
 * Signed out, a gated page sends them to signup rather than back to the
 * landing page. The click was an expression of interest in the feature;
 * dropping them on the marketing page they just left reads as the button
 * being broken, since nothing on screen changes except the scroll position.
 *
 * Signed in but out of role keeps the old destination, the dashboard is the
 * one page every role can open.
 */
export function guardRedirect(page: string, loggedIn: boolean, role: string): string | null {
  if (!loggedIn && SIGNUP_WHEN_SIGNED_OUT.has(page)) return '/signup';
  if (!PROTECTED_PAGES.has(page)) return null;
  if (!loggedIn) return '/signup';
  if (!roleAllows(role, page)) return '/dashboard';
  return null;
}
