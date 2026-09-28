/**
 * The brand mark fills itself with `url(#auroraGrad)`, and every static page
 * carried this hidden <svg> at the end of its <body> to define that gradient.
 * In the SPA it only needs to exist once, mounted for the whole app.
 *
 * Stop colours are the current (post-vivid) ones, teal/indigo/gold, not the
 * older #3DE8C5 set still referenced by some inline page markup.
 */
export default function AuroraDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="auroraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A88F" />
          <stop offset="48%" stopColor="#3F5BE0" />
          <stop offset="100%" stopColor="#C99A2E" />
        </linearGradient>
      </defs>
    </svg>
  );
}
