/**
 * The one simple footer shared by the feature pages (learn, live, arena, tests,
 * videos, pal, lesson, take-test, create-test, upload, admin). Rendered from App
 * for exactly those routes, so they all show the identical copyright line ,
 * replacing the mix each page used to ship (learn had a mega footer, some had a
 * one-liner, most had none).
 *
 * Deliberately NOT applied to the dashboard (keeps its own footer), the public
 * landing (its marketing <SiteFooter/>) or login/signup (chromeless). The old
 * per-page `.footer` / `.footer__base` footers are hidden in vivid.css so this
 * never doubles up.
 */
export default function FeatureFooter() {
  return (
    <footer className="feat-foot">
      <style>{FOOT_CSS}</style>
      <div className="feat-foot__inner">
        <span>© 2026 BestBrain Learning Pvt. Ltd. · Noida, India</span>
      </div>
    </footer>
  );
}

const FOOT_CSS = `
.feat-foot{margin-top:auto;}
.feat-foot__inner{max-width:none;margin:0;padding:24px clamp(24px,2.6vw,60px);border-top:1px solid rgba(15,23,42,.12);font-family:'Fragment Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#5B6472;text-align:center;}
@media (max-width:640px){.feat-foot__inner{padding:22px;}}
`;
