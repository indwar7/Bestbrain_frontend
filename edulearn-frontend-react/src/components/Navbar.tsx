import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, roleAllows } from '../context/AuthContext';
import { ROUTE_BY_PAGE } from '../lib/pages';

/**
 * The shared nav, markup-identical to the static site's.
 *
 * The class names are load-bearing: vivid.css owns every visual rule here
 * (.nav / .nav__inner / .nav__links / .nav__link.is-current / .brand /
 * .brand__mark / .brand__word / .nav__right / .btn-primary) and several of
 * them use !important specifically to beat per-page nav rules. Renaming
 * anything, or styling this component locally, breaks the "nav is identical on
 * every screen" guarantee.
 *
 * Link order matches the static nav exactly.
 */
const NAV_LINKS: { page: string; label: string; i18n: string }[] = [
  { page: 'dashboard', label: 'Dashboard', i18n: 'nav_dash' },
  { page: 'learn', label: 'Learn', i18n: 'nav_learn' },
  { page: 'live', label: 'Live', i18n: 'nav_live' },
  { page: 'challenge', label: 'Arena', i18n: 'nav_arena' },
  { page: 'mocktest', label: 'Tests', i18n: 'nav_tests' },
  { page: 'pal', label: 'PAL AI', i18n: 'nav_pal' },
];

/**
 * Signed-out visitors see a marketing nav, not the app sections, those pages
 * are for authenticated users and just bounce a logged-out click back to the
 * landing page. These anchor to real sections of the landing page (see
 * LandingMarkup: #features, #stats), so there are no dead links.
 */
const MARKETING_LINKS: { href: string; label: string }[] = [
  { href: '/#features', label: 'Features' },
  { href: '/#stats', label: 'Results' },
];

/**
 * Only these pages loaded role-guard.js, and its nav cosmetics, hiding the
 * "Start free" CTA, repointing the brand at the dashboard, hiding links the
 * role cannot open, ran nowhere else. videos.html and the teacher tools show
 * the signed-out CTA even to a signed-in user for exactly this reason, so the
 * cosmetics are applied per page rather than globally.
 */
const GUARDED = new Set(['dashboard', 'learn', 'lesson', 'mocktest', 'challenge', 'pal', 'live']);

/**
 * Which nav item each page marked `is-current`.
 *
 * Six pages are not themselves in the nav and highlighted their parent
 * section instead, a lesson is part of Learn, creating a test is part of
 * Tests, and the teacher tools sit under Dashboard. Deriving this from the
 * route alone leaves those pages with no highlight at all, which is what the
 * pixel diff caught on upload, admin, videos, lesson and create-test.
 */
const CURRENT_NAV: Record<string, string> = {
  dashboard: 'dashboard',
  learn: 'learn',
  lesson: 'learn',
  videos: 'learn',
  mocktest: 'mocktest',
  'take-test': 'mocktest',
  'create-test': 'mocktest',
  challenge: 'challenge',
  pal: 'pal',
  live: 'live',
  upload: 'dashboard',
  admin: 'dashboard',
  // index deliberately absent: the landing page highlights nothing.
};

export default function Navbar({ page }: { page: string }) {
  const { loggedIn, role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const guarded = GUARDED.has(page);
  const currentNav = CURRENT_NAV[page];
  // role-guard.js rewrote the brand href to the dashboard once signed in, so
  // clicking it never bounces an authenticated user out to the landing page.
  const brandHref = loggedIn && guarded ? '/dashboard' : '/';

  // A route change means the drawer did its job, never leave it covering the
  // page you just navigated to.
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  /*
    While the drawer is open the page behind it must not scroll, or a swipe
    over the scrim drags the page instead of doing nothing. body (not html)
    carries the lock because the lifted page stylesheets set the scroll
    context on body. Escape closes, as for any modal surface.
  */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    /*
      account-menu.js and features-panel.js append their floating buttons to
      <body>, so they are not siblings of anything this component renders and
      CSS here cannot reach them. A body class is the only handle: without it
      the settings FAB (z-index 9000) and the Features button (99998) keep
      floating over the drawer's scrim.
    */
    document.body.classList.add('nav-drawer-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
      document.body.classList.remove('nav-drawer-open');
    };
  }, [menuOpen]);

  /*
    One list drives both the desktop row and the drawer. Rendering the links
    twice from two different sources is how a role filter ends up applied to
    one and not the other, the drawer would leak Learn/Arena/Tests to a
    teacher exactly as the nav once did.
  */
  const items = loggedIn
    ? NAV_LINKS.filter((l) => roleAllows(role, l.page)).map((l) => ({
        key: l.page,
        to: ROUTE_BY_PAGE[l.page],
        label: l.label,
        i18n: l.i18n as string | undefined,
        current: l.page === currentNav,
        spa: true,
      }))
    : MARKETING_LINKS.map((m) => ({
        key: m.href, to: m.href, label: m.label,
        i18n: undefined, current: false, spa: false,
      }));

  const renderItem = (it: (typeof items)[number], extraClass = '') => {
    const cls = `nav__link${it.current ? ' is-current' : ''}${extraClass ? ` ${extraClass}` : ''}`;
    // Plain anchors for the marketing hashes so a same-page hash still scrolls.
    return it.spa ? (
      <Link key={it.key} className={cls} to={it.to} data-i18n={it.i18n}
        onClick={() => setMenuOpen(false)}>{it.label}</Link>
    ) : (
      <a key={it.key} className={cls} href={it.to}
        onClick={() => setMenuOpen(false)}>{it.label}</a>
    );
  };

  return (
    <nav className="nav">
      {/*
        The --mobilenav marker is what opts this bar into the phone collapse in
        vivid.css. That file is shared with the legacy static pages, whose
        hand-written nav has no burger, collapsing them too would leave them
        with no navigation at all. The class travels with the component that
        renders the burger, so the two can never drift apart.
      */}
      <div className="nav__inner nav__inner--mobilenav">
        {/*
          The burger sits LEFT of the brand on purpose. account-menu.js pins its
          settings FAB to `position:fixed; top:18px; right:18px` on nine app
          pages, which lands on top of the bar's right-hand end at phone widths
         , a burger there would sit underneath it.
        */}
        <button
          type="button"
          className="nav__burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="navDrawer"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            {menuOpen
              ? <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>
              : <><path d="M3.5 7h17" /><path d="M3.5 12h17" /><path d="M3.5 17h17" /></>}
          </svg>
        </button>

        <Link className="brand" to={brandHref} aria-label="BestBrain home">
          <svg className="brand__mark" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 1.5 L14.6 9.4 L22.5 12 L14.6 14.6 L12 22.5 L9.4 14.6 L1.5 12 L9.4 9.4 Z"
              fill="url(#auroraGrad)"
            />
          </svg>
          <span className="brand__word">BestBrain</span>
        </Link>

        {/*
          Signed in: only the sections this role can open, on every page, not
          just the role-guarded ones. Otherwise a teacher on the upload/dashboard
          tools saw student links (Learn/Arena/Tests) that aren't theirs.
          Signed out: marketing links only.
          Hidden below 900px by vivid.css; the drawer below takes over.
        */}
        <div className="nav__links">{items.map((it) => renderItem(it))}</div>

        <div className="nav__right">
          {/*
            #backLink lives here, not in the page body. The lesson bootstrap
            reads it by id and points it at the chapter's subject listing; when
            it went missing before, `back.href = ...` threw and aborted the
            bootstrap before LESSON.cls/.subject/.slug were set, silently
            killing the video lookup gated on them. It must render before the
            CTA, as it did in lesson.html.
          */}
          {page === 'lesson' && (
            <a className="btn-back" id="backLink" href="learn.html">← Back</a>
          )}

          {/* "Start free" points at the login screen, only ever shown to a
              signed-out visitor. A signed-in user manages their session through
              the account menu instead. */}
          {!loggedIn && (
            <Link className="btn-primary" to="/login" data-i18n="nav_cta">
              Start free
            </Link>
          )}

          {/* PAL's sidebar toggle also sat inside .nav__right. */}
          {page === 'pal' && (
            <button className="menu-btn" id="menuBtn" type="button" aria-label="Toggle sidebar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          )}
        </div>
      </div>

      {/*
        Phone navigation, portalled to <body> rather than rendered here.

        Every page's own stylesheet gives `.nav` a backdrop-filter:blur(20px),
        and a filtered element becomes the containing block for its
        position:fixed descendants. Inside <nav> the drawer therefore sized
        itself against the 60px bar instead of the viewport - `top:0;bottom:0`
        collapsed to bar height and the panel rendered as a clipped sliver.
        Portalling to <body> puts it back on the viewport, where a fixed
        overlay belongs; #root is display:contents, so this is also where the
        rest of the layout already lives.

        Rendered at every breakpoint and only made visible below 900px by
        vivid.css, so there is no JS width check to drift out of sync with the
        CSS breakpoint. `inert` keeps the closed drawer's links out of the tab
        order and off the accessibility tree.
      */}
      {createPortal(
        <>
          <div
            className={`nav__scrim${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="navDrawer"
            className={`nav__drawer${menuOpen ? ' is-open' : ''}`}
            inert={!menuOpen}
          >
            {/*
              The open drawer sits above the bar, so the burger that opened it
              is underneath, without this the only ways out are Escape (no
              keyboard on a phone) and guessing that the dimmed strip is
              tappable. It sits where the burger was, so the control reads as
              having turned into an X.
            */}
            <div className="nav__drawer-head">
              <button
                type="button"
                className="nav__drawer-close"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12" /><path d="M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="nav__drawer-links">
              {items.map((it) => renderItem(it, 'nav__drawer-link'))}
            </div>
          </div>
        </>,
        document.body,
      )}
    </nav>
  );
}
