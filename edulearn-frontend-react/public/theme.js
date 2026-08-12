// Theme Manager - Works across all pages
class ThemeManager {
  constructor() {
    this.storageKey = 'edulearn-theme';
    this.darkModeClass = 'dark-mode';
    this.init();
  }

  init() {
    // Apply theme before rendering to avoid flash
    this.applyStoredThemeSync();
    // Then setup event listeners
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupThemeToggleButtons());
    } else {
      this.setupThemeToggleButtons();
    }
  }

  // BestBrain is LIGHT ONLY. Dark mode is retired.
  //
  // The per-page html.dark-mode{} blocks (249 rules across 13 files) are left
  // in place but can never match, because this class is never added and any
  // stored 'dark' preference is cleared on load. That keeps the change small
  // and fully reversible — restoring dark mode means restoring this one method,
  // not re-authoring hundreds of rules.
  //
  // login.html and signup.html are the inverse: they are dark BY DEFAULT and
  // opt in to light via html.light-mode, so they get that class forced on.
  applyStoredThemeSync() {
    const el = document.documentElement;
    // ...unless the redesign skin is driving the theme. ui/boot.js runs first,
    // in <head>, and sets .kid-dark before a single stylesheet parses, exactly
    // so the first frame is already dark. Stripping .dark-mode here — which ran
    // on every page load — dropped the page back to its light token set for the
    // frames between this script and kid-bg.js's first pass, which then puts
    // .dark-mode straight back. That flip-flop is the "old design flashes for a
    // second" on every navigation. Whoever set .kid-dark owns the theme; leave
    // it alone. With no skin present, the light-only behaviour below stands.
    if (el.classList.contains('kid-dark') || el.classList.contains('kidbg')) return;
    el.classList.remove(this.darkModeClass);
    el.classList.add('light-mode');
    try {
      if (localStorage.getItem(this.storageKey) !== 'light') {
        localStorage.setItem(this.storageKey, 'light');
      }
    } catch (e) { /* storage unavailable — light is already applied above */ }
  }

  setupThemeToggleButtons() {
    // Find all theme toggle buttons
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme(button);
      });
      this.updateButtonIcon(button);
    });
  }

  // No-op: the product is light only, so toggling is disabled. The toggle
  // buttons are also hidden in vivid.css; this guards the case where one is
  // still reachable (an old cached page, a toggle added later).
  toggleTheme() {
    this.applyStoredThemeSync();
  }

  updateButtonIcon(button) {
    const isDarkMode = document.documentElement.classList.contains(this.darkModeClass);
    const sun = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7"/></svg>';
    const moon = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';
    button.innerHTML = isDarkMode ? sun : moon;
    button.title = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
    button.setAttribute('aria-label', button.title);
  }

  isDarkMode() {
    return document.documentElement.classList.contains(this.darkModeClass);
  }

  setDarkMode(isDark) {
    if (isDark) {
      document.documentElement.classList.add(this.darkModeClass);
      localStorage.setItem(this.storageKey, 'dark');
    } else {
      document.documentElement.classList.remove(this.darkModeClass);
      localStorage.setItem(this.storageKey, 'light');
    }
    const allButtons = document.querySelectorAll('[data-theme-toggle]');
    allButtons.forEach(btn => this.updateButtonIcon(btn));
  }
}

// Initialize immediately
const themeManager = new ThemeManager();
window.themeManager = themeManager;
