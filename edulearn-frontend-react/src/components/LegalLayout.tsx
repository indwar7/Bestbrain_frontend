import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { usePageCss } from '../lib/usePageCss';
import css from '../styles/pages/legal.css?inline';

/**
 * Shared reading layout for the static legal pages (Privacy, Terms).
 *
 * These are the only two routes whose job is reading a document, and they are
 * chromeless (see CHROMELESS in App.tsx): no nav, no student rail, no mascot,
 * no aurora. That means the layout owns the whole page, including the way
 * back, hence the "BestBrain" pill at the top and the sibling links at the
 * bottom, which are the only navigation a visitor gets here.
 *
 * Styling moved out of inline style props and into legal.css. It had to:
 * boot.js paints every p/li/h1-h6 pure white with !important at runtime, so
 * the muted greys need a selector that can outrank it, which an inline style
 * object cannot express.
 */
export default function LegalLayout({
  title,
  updated,
  lede,
  children,
}: {
  title: string;
  updated: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  usePageCss(css);

  return (
    <main className="legal-page">
      <Link className="legal-back" to="/">
        <span className="ar">←</span> BestBrain
      </Link>

      <h1>{title}</h1>
      <p className="legal-meta">
        Last updated: {updated}
        <br />
        BestBrain Learning Pvt. Ltd. · Made for Bharat
      </p>

      {lede ? <p className="legal-lede">{lede}</p> : null}

      <div className="legal-body">{children}</div>

      <div className="legal-foot">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/">Home</Link>
        <span>© 2026 BestBrain</span>
      </div>
    </main>
  );
}

/** A titled section, an h2 plus its paragraphs/lists. */
export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2>{heading}</h2>
      {children}
    </section>
  );
}
