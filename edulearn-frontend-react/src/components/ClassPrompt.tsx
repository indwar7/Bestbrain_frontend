import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../lib/api';

/**
 * Everything a student sees (chapters, quizzes, homework, lectures) is chosen
 * by class. Signup asks for it, but an account that reached here without one
 * is asked once, before anything else, instead of being left on empty screens
 * until the student finds Settings.
 */
const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9'];

export default function ClassPrompt() {
  const { user, loggedIn } = useAuth();
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');

  if (!loggedIn || user?.role !== 'student' || (user.className || '').trim()) return null;

  async function choose(className: string) {
    if (saving) return;
    setSaving(className);
    setError('');
    try {
      await updateProfile({ className, section: (user?.section || '').trim() || 'A' });
      // Every page script and the sidebar read the class when they start, so
      // start them again with it. This happens once per account.
      window.location.reload();
    } catch (e) {
      setSaving('');
      setError(e instanceof Error && e.message ? e.message : 'Could not save your class. Please try again.');
    }
  }

  return (
    <div className="class-prompt" role="dialog" aria-modal="true" aria-labelledby="classPromptTitle">
      <style>{CSS}</style>
      <div className="class-prompt__card">
        <h2 id="classPromptTitle">Which class are you in?</h2>
        <p>We will show you the chapters, quizzes and homework for your class. You can change it later in Settings.</p>
        <div className="class-prompt__grid">
          {CLASSES.map((c) => (
            <button key={c} type="button" disabled={!!saving} onClick={() => choose(c)} autoFocus={c === CLASSES[0]}>
              {saving === c ? 'Saving…' : c}
            </button>
          ))}
        </div>
        {error && <div className="class-prompt__err" role="alert">{error}</div>}
      </div>
    </div>
  );
}

const CSS = `
.class-prompt{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;
  padding:20px;background:rgba(5,5,5,.88);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  font-family:'Nunito',system-ui,sans-serif;}
.class-prompt__card{width:100%;max-width:440px;padding:30px 26px;border-radius:22px;
  background:#15110C !important;border:1px solid rgba(255,179,71,.35);box-shadow:0 24px 70px rgba(0,0,0,.6);}
.class-prompt h2{margin:0 0 8px;font-family:'Fraunces',serif;font-weight:600;font-size:27px;line-height:1.15;
  color:#FFFFFF !important;-webkit-text-fill-color:#FFFFFF !important;}
.class-prompt p{margin:0 0 22px;font-size:15px;line-height:1.5;
  color:rgba(255,255,255,.78) !important;-webkit-text-fill-color:rgba(255,255,255,.78) !important;}
.class-prompt__grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.class-prompt__grid button{min-height:58px;border-radius:16px;border:2px solid #0A0A0A !important;cursor:pointer;
  background:linear-gradient(120deg,#FFC400,#FFDD3C) !important;
  color:#0A0A0A !important;-webkit-text-fill-color:#0A0A0A !important;
  font-family:inherit;font-size:17px !important;font-weight:900 !important;transition:transform .15s ease;}
.class-prompt__grid button:hover:not(:disabled){transform:translateY(-2px);}
.class-prompt__grid button:disabled{opacity:.6;cursor:default;}
.class-prompt__err{margin-top:16px;padding:10px 14px;border-radius:12px;font-size:14px;
  background:rgba(244,63,94,.14) !important;border:1px solid rgba(244,63,94,.5);
  color:#FFD7DE !important;-webkit-text-fill-color:#FFD7DE !important;}
`;
