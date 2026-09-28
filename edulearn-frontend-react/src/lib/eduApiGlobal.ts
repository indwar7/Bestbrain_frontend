import * as api from './api';

/**
 * Re-expose the API surface as window.EduAPI.
 *
 * features-panel.js is carried over from the static site unchanged, where
 * api.js published this global. It reads getToken() and getDashboard() to show
 * real progress inside the feature tour, and degrades to a signed-out message
 * when neither is available, so it stays correct even though, under Vite, the
 * module graph may finish executing after the deferred script has run.
 */
declare global {
  interface Window {
    EduAPI?: typeof api;
  }
}

export function installEduApiGlobal(): void {
  window.EduAPI = api;
}
