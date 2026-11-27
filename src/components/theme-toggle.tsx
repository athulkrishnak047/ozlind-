"use client";

import { useOzlindTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useOzlindTheme();
  const isDark = theme === "dark";
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="theme-toggle-icon" aria-hidden="true">{isDark ? "☼" : "☾"}</span>
      <span className="theme-toggle-label">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
