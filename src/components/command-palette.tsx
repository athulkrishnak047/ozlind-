"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { OzlindIcon, type OzlindIconName } from "./ozlind-icon";

type Command = {
  id: string;
  label: string;
  detail: string;
  icon: OzlindIconName;
  shortcut?: string;
  run: () => void;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onFocusComposer: () => void;
  onExport: () => void;
  onClear: () => void;
  onToggleWeb: () => void;
};

export function CommandPalette({ open, onClose, onNewChat, onFocusComposer, onExport, onClear, onToggleWeb }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => [
    { id: "new", label: "Start a new chat", detail: "Create a fresh conversation", icon: "oz-new-chat", shortcut: "N", run: onNewChat },
    { id: "focus", label: "Focus message composer", detail: "Jump to the message input", icon: "oz-edit", shortcut: "M", run: onFocusComposer },
    { id: "web", label: "Toggle web research", detail: "Turn live web search on or off", icon: "oz-globe", run: onToggleWeb },
    { id: "export", label: "Export conversation", detail: "Download this chat as Markdown", icon: "oz-download", run: onExport },
    { id: "clear", label: "Clear conversation", detail: "Remove messages from this chat", icon: "oz-trash", run: onClear },
  ], [onNewChat, onFocusComposer, onToggleWeb, onExport, onClear]);

  const filtered = commands.filter((command) =>
    (command.label + " " + command.detail).toLowerCase().includes(query.trim().toLowerCase())
  );

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  function close() {
    setQuery("");
    setActiveIndex(0);
    onClose();
  }

  if (!open) return null;

  function run(command: Command) {
    close();
    window.requestAnimationFrame(command.run);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(0, filtered.length - 1)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter" && filtered[activeIndex]) {
      event.preventDefault();
      run(filtered[activeIndex]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }

  return (
    <div className="command-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) close();
    }}>
      <section className="command-dialog" role="dialog" aria-modal="true" aria-labelledby="command-title">
        <div className="command-search-row">
          <OzlindIcon name="oz-search" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="What would you like to do?"
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>ESC</kbd>
        </div>
        <div className="command-list" role="listbox" aria-label="Available commands">
          <p className="command-section-label" id="command-title">QUICK ACTIONS</p>
          {filtered.length ? filtered.map((command, index) => (
            <button
              className={`command-option ${index === activeIndex ? "active" : ""}`}
              key={command.id}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => run(command)}
            >
              <span className="command-option-icon" aria-hidden="true"><OzlindIcon name={command.icon} size={17} /></span>
              <span className="command-option-copy"><strong>{command.label}</strong><small>{command.detail}</small></span>
              {command.shortcut && <kbd>{command.shortcut}</kbd>}
              <span className="command-option-arrow" aria-hidden="true"><OzlindIcon name="oz-chevron-right" size={15} /></span>
            </button>
          )) : <p className="command-empty">No matching actions. Try another search.</p>}
        </div>
        <footer className="command-footer"><span>Up / Down Navigate</span><span>Enter Run action</span><span>Esc Close</span></footer>
      </section>
    </div>
  );
}
