import { useParams, useLocation } from 'react-router-dom';
import { usePageCss } from '../lib/usePageCss';
import { usePageScript } from '../lib/usePageScript';
import LessonMarkup from './markup/LessonMarkup';
import css from '../styles/pages/lesson.css?inline';
import script from './scripts/lesson.js';

/**
 * Lesson, lesson.html's real stylesheet, markup and script.
 *
 * The chapter arrived as `lesson.html?class=&subject=&ch=<id>&t=&view=` and the
 * script still reads it all from location.search. The SPA carries the chapter as
 * a path param and the rest as query params, so the full query string is rebuilt
 * for the script. Missing class/subject would leave the video/notes lookup dead
 * (it gates on them); missing `view` would skip the deep-link to video/notes.
 */
export default function Lesson() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  if (chapterId) params.set('ch', chapterId);
  usePageCss(css);
  usePageScript(script, `?${params.toString()}`);
  return <LessonMarkup />;
}
