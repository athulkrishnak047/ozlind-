"use client";

import { useOzlindTheme } from "./theme-provider";
import { OzlindIcon } from "./ozlind-icon";

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
      aria-pressed={isDark}
    >
      <OzlindIcon className="theme-toggle-icon" name={isDark ? "oz-sun" : "oz-moon"} size={16} />
      <span className="theme-toggle-label">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
