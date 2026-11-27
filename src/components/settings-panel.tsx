"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { OzlindMark } from "./ozlind-mark";
const PREFS_KEY = "ozlind:preferences:v1";
const PROFILE_KEY = "ozlind:profile:v1";
const HISTORY_KEY = "ozlind:conversations:v1";
type Preferences = { reducedMotion: boolean; compactMode: boolean };
const defaults: Preferences = { reducedMotion: false, compactMode: false };
export function SettingsPanel() {
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [displayName, setDisplayName] = useState("Ozlind user");
  const [saved, setSaved] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) setPreferences({ ...defaults, ...(JSON.parse(raw) as Partial<Preferences>) });
      const profile = localStorage.getItem(PROFILE_KEY);
      if (profile) setDisplayName(profile.slice(0, 48));
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (Array.isArray(history)) setHistoryCount(history.length);
    } catch { /* Optional browser persistence. */ }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = preferences.reducedMotion ? "reduced" : "full";
    document.documentElement.dataset.density = preferences.compactMode ? "compact" : "comfortable";
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(preferences)); } catch { /* Optional persistence. */ }
  }, [preferences]);
  function saveProfile() {
    const name = displayName.trim().slice(0, 48) || "Ozlind user";
    setDisplayName(name);
    try { localStorage.setItem(PROFILE_KEY, name); } catch { /* Optional persistence. */ }
    window.dispatchEvent(new CustomEvent("ozlind:profile-updated", { detail: name }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }
  function clearLocalHistory() {
    if (!window.confirm("Delete all conversations saved in this browser? This cannot be undone.")) return;
    try { localStorage.removeItem(HISTORY_KEY); setHistoryCount(0); }
    catch { window.alert("Browser storage is unavailable. Your history could not be cleared."); }
  }
  return <main className="settings-shell">
    <aside className="settings-rail">
      <Link href="/workspace" className="settings-brand"><OzlindMark /><span>ozlind<span>.</span></span></Link>
      <p className="settings-rail-label">WORKSPACE</p><Link href="/workspace" className="settings-rail-link"><span>⌂</span> Assistant</Link>
      <p className="settings-rail-label">PREFERENCES</p>
      <a href="#appearance" className="settings-rail-link active"><span>◐</span> Appearance</a>
      <a href="#account" className="settings-rail-link"><span>◎</span> Account</a>
      <a href="#privacy" className="settings-rail-link"><span>◇</span> Privacy & data</a>
      <div className="settings-rail-spacer" /><Link href="/workspace" className="settings-back-link">← Back to workspace</Link>
    </aside>
    <section className="settings-content">
      <header className="settings-header"><div><p className="settings-eyebrow">OZLIND / PREFERENCES</p><h1>Settings</h1><p>Make your workspace feel right for the way you work.</p></div><ThemeToggle /></header>
      <section className="settings-section" id="appearance">
        <div className="settings-section-heading"><div><span>01</span><h2>Appearance</h2></div><p>Keep the interface comfortable across every session.</p></div>
        <div className="settings-card settings-theme-card"><div className="settings-card-copy"><strong>Color theme</strong><span>Switch between pure black and pure white canvases.</span></div><div className="settings-theme-choice"><span className="settings-theme-preview dark-preview" /> Dark</div><div className="settings-theme-choice"><span className="settings-theme-preview light-preview" /> Light</div><ThemeToggle /></div>
        <div className="settings-card settings-toggle-card"><div className="settings-card-copy"><strong>Reduced motion</strong><span>Minimize animations and transitions.</span></div><button type="button" role="switch" aria-checked={preferences.reducedMotion} className={`settings-switch ${preferences.reducedMotion ? "on" : ""}`} onClick={() => setPreferences(p => ({ ...p, reducedMotion: !p.reducedMotion }))}><span /></button></div>
        <div className="settings-card settings-toggle-card"><div className="settings-card-copy"><strong>Compact workspace</strong><span>Reduce spacing to fit more content on screen.</span></div><button type="button" role="switch" aria-checked={preferences.compactMode} className={`settings-switch ${preferences.compactMode ? "on" : ""}`} onClick={() => setPreferences(p => ({ ...p, compactMode: !p.compactMode }))}><span /></button></div>
      </section>
      <section className="settings-section" id="account">
        <div className="settings-section-heading"><div><span>02</span><h2>Account & profile</h2></div><p>Your local workspace identity on this device.</p></div>
        <div className="settings-card profile-settings-card"><div className="settings-profile-avatar">{displayName.trim().charAt(0).toUpperCase() || "O"}</div><div className="settings-profile-fields"><label htmlFor="display-name">Display name</label><input id="display-name" maxLength={48} value={displayName} onChange={e => setDisplayName(e.target.value)} /><small>This is a local profile only. Sign-in and synced accounts are not enabled yet.</small></div><button type="button" className="settings-save-button" onClick={saveProfile}>{saved ? "Saved ✓" : "Save profile"}</button></div>
      </section>
      <section className="settings-section" id="privacy">
        <div className="settings-section-heading"><div><span>03</span><h2>Privacy & data</h2></div><p>Understand what stays on this browser.</p></div>
        <div className="settings-card data-card"><div className="settings-card-copy"><strong>Conversation history</strong><span>{historyCount} conversation{historyCount === 1 ? "" : "s"} stored locally in this browser. No account sync.</span></div><button type="button" className="settings-danger-button" onClick={clearLocalHistory}>Clear local history</button></div>
        <div className="settings-note"><span>i</span><p>AI requests are sent to the selected model provider to generate responses. Avoid entering passwords, payment details, or other sensitive information.</p></div>
      </section>
      <footer className="settings-footer"><OzlindMark /><span>Ozlind · A clearer space to think.</span><Link href="/workspace">Return to chat ↗</Link></footer>
    </section>
  </main>;
}
