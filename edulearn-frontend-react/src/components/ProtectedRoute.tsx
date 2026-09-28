import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { guardRedirect } from '../lib/guard';

interface Props {
  page: string;
  children: React.ReactNode;
}

/**
 * Backstop for the pages in PROTECTED_PAGES.
 *
 * Most gated navigations never reach here, useLegacyLinks resolves the same
 * guard on the click and sends the visitor straight to their real
 * destination, which is what keeps the router from walking into a page it is
 * about to bounce out of. This still has to run for the ways in that are not
 * a click: a typed URL, a bookmark, Back/Forward, or a session ending while
 * the page is open.
 */
export default function ProtectedRoute({ page, children }: Props) {
  const { loggedIn, role } = useAuth();

  const redirect = guardRedirect(page, loggedIn, role);
  if (redirect) return <Navigate to={redirect} replace />;

  return <>{children}</>;
}
