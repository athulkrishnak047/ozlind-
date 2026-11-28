"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "ozlind:theme:v1";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let savedTheme: Theme | null = null;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") savedTheme = saved;
    } catch {
      // Theme preference is optional; the workspace remains usable without storage.
    }
    const frame = window.requestAnimationFrame(() => {
      if (savedTheme) setTheme(savedTheme);
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#000000" : "#ffffff");
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Private browsing may disable storage.
    }
  }, [theme, ready]);

  useEffect(() => {
    function syncTheme(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      if (event.newValue === "light" || event.newValue === "dark") setTheme(event.newValue);
    }
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((current) => current === "dark" ? "light" : "dark")
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useOzlindTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useOzlindTheme must be used inside ThemeProvider");
  return context;
}
