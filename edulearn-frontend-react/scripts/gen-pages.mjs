/**
 * Scaffold a page component per route: its lifted stylesheet plus its
 * converted markup.
 *
 * This is what makes every route render the real UI. Behaviour is then ported
 * into these files one page at a time — a page listed here with no logic yet
 * shows its static content correctly, while regions the original built
 * imperatively stay empty until their logic lands.
 *
 * Only writes files that do not already exist, so a page that has had its
 * behaviour ported is never clobbered.
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '../src/pages');

/** component -> [css basename, markup component] */
const PAGES = {
  Dashboard: ['dashboard', 'DashboardMarkup'],
  Learn: ['learn', 'LearnMarkup'],
  Lesson: ['lesson', 'LessonMarkup'],
  Videos: ['videos', 'VideosMarkup'],
  MockTest: ['mocktest', 'MockTestMarkup'],
  TakeTest: ['take-test', 'TakeTestMarkup'],
  CreateTest: ['create-test', 'CreateTestMarkup'],
  Challenge: ['challenge', 'ChallengeMarkup'],
  Pal: ['pal', 'PalMarkup'],
  Tutor: ['tutor', 'TutorMarkup'],
  Live: ['live', 'LiveMarkup'],
  Login: ['login', 'LoginMarkup'],
  Signup: ['signup', 'SignupMarkup'],
  Upload: ['upload', 'UploadMarkup'],
  Admin: ['admin', 'AdminMarkup'],
};

mkdirSync(OUT, { recursive: true });

const made = [];
for (const [comp, [cssName, markup]] of Object.entries(PAGES)) {
  const file = join(OUT, `${comp}.tsx`);
  if (existsSync(file)) { made.push([comp, 'kept (already ported)']); continue; }

  const src =
    `import { usePageCss } from '../lib/usePageCss';\n` +
    `import { usePageScript } from '../lib/usePageScript';\n` +
    `import ${markup} from './markup/${markup}';\n` +
    `import css from '../styles/pages/${cssName}.css?inline';\n` +
    `import script from './scripts/${cssName}.js';\n` +
    `\n` +
    `/**\n` +
    ` * ${comp} — ${cssName}.html's real stylesheet, markup and script.\n` +
    ` *\n` +
    ` * All three are lifted from the original page rather than reimplemented,\n` +
    ` * so the behaviour is the code that was already working, running against\n` +
    ` * markup that reproduces the same element ids it queries.\n` +
    ` */\n` +
    `export default function ${comp}() {\n` +
    `  usePageCss(css);\n` +
    `  usePageScript(script);\n` +
    `  return <${markup} />;\n` +
    `}\n`;

  writeFileSync(file, src);
  made.push([comp, 'scaffolded']);
}

for (const [c, note] of made) console.log(`${c.padEnd(14)} ${note}`);
