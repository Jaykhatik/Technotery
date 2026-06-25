/**
 * public/theme/theme-toggle.js
 * Handles dark/light theme toggle with localStorage persistence.
 * Applies theme BEFORE paint to avoid flash of wrong theme.
 */

(function () {
  const STORAGE_KEY = "stay-retro-theme";
  const ROOT = document.documentElement;

  // ── Apply saved theme immediately (runs before DOMContentLoaded) ──
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark") {
    ROOT.setAttribute("data-theme", "dark");
  } else {
    ROOT.removeAttribute("data-theme");
  }

  // ── Wire up the button once the DOM is ready ──
  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("theme-toggle-btn");
    if (!btn) return;

    // Keep button state in sync with current theme
    function syncBtn() {
      const isDark = ROOT.getAttribute("data-theme") === "dark";
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
    }

    syncBtn();

    btn.addEventListener("click", function () {
      const isDark = ROOT.getAttribute("data-theme") === "dark";
      if (isDark) {
        ROOT.removeAttribute("data-theme");
        localStorage.setItem(STORAGE_KEY, "light");
      } else {
        ROOT.setAttribute("data-theme", "dark");
        localStorage.setItem(STORAGE_KEY, "dark");
      }
      syncBtn();
    });
  });
})();
