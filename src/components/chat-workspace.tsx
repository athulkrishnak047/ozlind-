"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";

type Role = "user" | "assistant";
type ChatMessage = { id: string; role: Role; content: string; provider?: string; model?: string; fallback?: boolean };
type Provider = "auto" | "gemini" | "groq";
type StreamEvent = { event: string; data: Record<string, unknown> };

const suggestions = [
  { title: "Think through an idea", prompt: "Help me think through an idea. Ask focused questions before proposing a solution." },
  { title: "Explain something clearly", prompt: "Explain a difficult topic clearly, with an intuitive example and the important caveats." },
  { title: "Build a plan", prompt: "Help me turn a goal into a practical plan with milestones, risks, and measurable outcomes." },
  { title: "Review my code", prompt: "Review the code I share for correctness, security, performance, and maintainability." }
];

function newId(): string {
  return globalThis.crypto.randomUUID();
}

function readEvent(frame: string): StreamEvent | null {
  let event = "message";
  const data: string[] = [];
  for (const line of frame.split(/\r?\n/)) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    if (line.startsWith("data:")) data.push(line.slice(5).trim());
  }
  if (data.length === 0) return null;
  try {
    const parsed: unknown = JSON.parse(data.join("\n"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return { event, data: parsed as Record<string, unknown> };
  } catch {
    return null;
  }
}

function errorText(value: unknown, fallback: string): string {
  if (value && typeof value === "object" && "error" in value) {
    const error = (value as { error?: { message?: unknown } }).error;
    if (typeof error?.message === "string") return error.message;
  }
  return fallback;
}

export function ChatWorkspace() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [provider, setProvider] = useState<Provider>("auto");
  const [serviceToken, setServiceToken] = useState("");
  const [tokenDraft, setTokenDraft] = useState("");
  const [connectOpen, setConnectOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "connecting" | "streaming">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const isBusy = status !== "idle";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (!connectOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.getElementById("service-token")?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setConnectOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      previousFocus?.focus();
    };
  }, [connectOpen]);

  function startNewChat() {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setDraft("");
    setStatus("idle");
    setErrorMessage("");
  }

  function saveToken() {
    const value = tokenDraft.trim();
    if (value.length < 32) {
      setErrorMessage("The service token must contain at least 32 characters.");
      return;
    }
    setServiceToken(value);
    setTokenDraft("");
    setConnectOpen(false);
    setErrorMessage("");
  }

  async function copyMessage(message: ChatMessage) {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(""), 1400);
    } catch {
      setErrorMessage("Clipboard access is unavailable in this browser.");
    }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isBusy) return;
    if (!serviceToken) {
      setConnectOpen(true);
      setErrorMessage("Connect the protected AI service before sending a message.");
      return;
    }

    const userMessage: ChatMessage = { id: newId(), role: "user", content };
    const assistantMessage: ChatMessage = { id: newId(), role: "assistant", content: "" };
    const previousMessages: { role: Role; content: string }[] = [];
    let remainingChars = 24_000 - content.length;
    for (let index = messages.length - 1; index >= 0 && previousMessages.length < 19; index -= 1) {
      const item = messages[index];
      if (item.content.length > remainingChars) continue;
      previousMessages.unshift({ role: item.role, content: item.content });
      remainingChars -= item.content.length;
    }
    const requestMessages = [
      ...previousMessages,
      { role: "user" as const, content }
    ];
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setDraft("");
    setErrorMessage("");
    setStatus("connecting");

    const controller = new AbortController();
    abortRef.current = controller;
    let receivedText = false;
    let receivedDone = false;
    let streamHadError = false;
    let buffer = "";

    const handleFrame = (frame: string) => {
      const item = readEvent(frame);
      if (!item) return;
      if (item.event === "start") {
        const providerName = typeof item.data.provider === "string" ? item.data.provider : "";
        const modelName = typeof item.data.model === "string" ? item.data.model : "";
        setMessages((current) => current.map((message) =>
          message.id === assistantMessage.id
            ? { ...message, provider: providerName, model: modelName, fallback: item.data.fallback === true }
            : message
        ));
        setStatus("streaming");
      } else if (item.event === "delta" && typeof item.data.text === "string") {
        receivedText = true;
        setStatus("streaming");
        setMessages((current) => current.map((message) =>
          message.id === assistantMessage.id
            ? { ...message, content: message.content + (item.data.text as string) }
            : message
        ));
      } else if (item.event === "done") {
        receivedDone = true;
      } else if (item.event === "error") {
        streamHadError = true;
        setErrorMessage(typeof item.data.message === "string" ? item.data.message : "The response was interrupted.");
      }
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceToken}`
        },
        body: JSON.stringify({ provider, messages: requestMessages }),
        signal: controller.signal,
        cache: "no-store"
      });

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        throw new Error(errorText(body, `The service returned HTTP ${response.status}.`));
      }
      if (!response.body) throw new Error("Streaming is not available in this browser.");

      setStatus("streaming");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() ?? "";
        for (const frame of frames) handleFrame(frame);
      }
      buffer += decoder.decode();
      if (buffer.trim()) handleFrame(buffer);
      if (!receivedDone && !controller.signal.aborted && !streamHadError) {
        setErrorMessage("The connection ended before Ozlind completed its response.");
      }
      if (!receivedText) {
        setMessages((current) => current.filter((message) => message.id !== assistantMessage.id));
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
        setMessages((current) => current.filter((message) =>
          message.id !== assistantMessage.id || message.content.length > 0
        ));
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setStatus("idle");
    }
  }

  function handleComposerKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <main className="workspace">
      <aside className="sidebar" aria-label="Workspace navigation">
        <a className="brand" href="/" aria-label="Ozlind home">
          <span className="brand-symbol" aria-hidden="true"><span /></span>
          <span className="brand-word">ozlind<span className="brand-period">.</span></span>
        </a>

        <button className="new-chat-button" type="button" onClick={startNewChat}>
          <span aria-hidden="true">＋</span> New chat
          <kbd>⌘ K</kbd>
        </button>

        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>
          <div className="nav-item active"><span aria-hidden="true">✳</span> Assistant</div>
          <div className="nav-item muted"><span aria-hidden="true">◷</span> Current session</div>
        </div>

        <div className="sidebar-spacer" />
        <div className="sidebar-note">
          <span className="note-icon" aria-hidden="true">◇</span>
          <p>Thoughtful AI, built with care.</p>
          <span>Private preview · v0.3</span>
        </div>
        <div className="profile-row">
          <div className="profile-avatar">O</div>
          <div><strong>Ozlind workspace</strong><span>Preview access</span></div>
          <button className="icon-button profile-menu" type="button" aria-label="Connect AI service" onClick={() => setConnectOpen(true)}>•••</button>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-separator">/</span><strong>Assistant</strong></div>
          <div className="topbar-actions">
            <span className="privacy-pill"><span /> Private preview</span>
            <button className="connect-button" type="button" onClick={() => setConnectOpen(true)}>
              <span aria-hidden="true">⌘</span> {serviceToken ? "Token in this tab" : "Add access token"}
            </button>
          </div>
        </header>

        <div className="chat-scroll">
          {messages.length === 0 ? (
            <section className="welcome" aria-labelledby="welcome-title">
              <div className="welcome-mark"><span className="welcome-spark">✳</span></div>
              <p className="welcome-kicker">A CLEARER WAY TO THINK</p>
              <h1 id="welcome-title">What’s on your <span>mind?</span></h1>
              <p className="welcome-copy">Ask a question, explore an idea, or work through something complex. Let’s make progress together.</p>
              <div className="suggestion-grid">
                {suggestions.map((suggestion, index) => (
                  <button className="suggestion-card" key={suggestion.title} type="button" onClick={() => setDraft(suggestion.prompt)}>
                    <span className={`suggestion-icon suggestion-icon-${index + 1}`} aria-hidden="true">{["✧", "⌘", "↗", "⌁"][index]}</span>
                    <span><strong>{suggestion.title}</strong><small>{["Explore possibilities", "Get to the heart of it", "Turn goals into action", "Improve quality"][index]}</small></span>
                    <span className="suggestion-arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <div className="welcome-footnote"><span>✦</span> Ozlind can make mistakes. Verify important information.</div>
            </section>
          ) : (
            <section className="conversation" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
              <div className="conversation-heading">
                <span>THIS SESSION</span>
                <button type="button" onClick={startNewChat}>Clear conversation</button>
              </div>
              {messages.map((message) => (
                <article className={`message-row ${message.role}`} key={message.id}>
                  <div className={`message-avatar ${message.role === "assistant" ? "assistant-avatar" : "user-avatar"}`}>
                    {message.role === "assistant" ? "✳" : "Y"}
                  </div>
                  <div className="message-body">
                    <div className="message-meta">
                      <strong>{message.role === "assistant" ? "Ozlind" : "You"}</strong>
                      {message.role === "assistant" && message.provider && <span>{[message.provider, message.model].filter(Boolean).join(" · ")}{message.fallback ? " · fallback" : ""}</span>}
                    </div>
                    {message.content ? (
                      <div className="message-content">{message.content}</div>
                    ) : (
                      <div className="typing-indicator" aria-label="Ozlind is thinking"><i /><i /><i /></div>
                    )}
                    {message.role === "assistant" && message.content && (
                      <div className="message-actions">
                        <button type="button" onClick={() => void copyMessage(message)}>{copiedId === message.id ? "Copied" : "Copy"}</button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
              <div ref={bottomRef} />
            </section>
          )}
        </div>

        <div className="composer-area">
          {errorMessage && <div className="error-banner" role="alert"><span>!</span>{errorMessage}<button type="button" onClick={() => setErrorMessage("")} aria-label="Dismiss error">×</button></div>}
          <form className="composer" onSubmit={sendMessage}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Message Ozlind..."
              rows={1}
              aria-label="Message Ozlind"
              maxLength={8000}
            />
            <div className="composer-toolbar">
              <div className="composer-options">
                <label className="provider-select-label" htmlFor="provider-select">MODEL</label>
                <select id="provider-select" value={provider} onChange={(event) => setProvider(event.target.value as Provider)} disabled={isBusy}>
                  <option value="auto">Auto</option>
                  <option value="gemini">Gemini</option>
                  <option value="groq">Groq</option>
                </select>
                <span className="composer-hint">Shift + Enter for a new line</span>
              </div>
              {isBusy ? (
                <button className="send-button stop-button" type="button" onClick={() => abortRef.current?.abort()} aria-label="Stop generating">■</button>
              ) : (
                <button className="send-button" type="submit" disabled={!draft.trim()} aria-label="Send message">↑</button>
              )}
            </div>
          </form>
          <p className="composer-disclaimer">Ozlind is an AI assistant. Check important details independently.</p>
        </div>
      </section>

      {connectOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConnectOpen(false); }}>
          <section className="connect-modal" role="dialog" aria-modal="true" aria-labelledby="connect-title">
            <button className="modal-close" type="button" onClick={() => setConnectOpen(false)} aria-label="Close">×</button>
            <div className="modal-mark">⌘</div>
            <p className="welcome-kicker">PRIVATE SERVICE ACCESS</p>
            <h2 id="connect-title">Connect Ozlind AI</h2>
            <p className="modal-copy">Enter the <code>OZLIND_AI_ACCESS_TOKEN</code> configured by the project owner in Vercel. This token stays in this tab’s memory only and is never saved to browser storage.</p>
            <label className="token-label" htmlFor="service-token">Service access token</label>
            <input id="service-token" type="password" autoComplete="off" value={tokenDraft} onChange={(event) => setTokenDraft(event.target.value)} placeholder="Paste your private service token" />
            <button className="modal-submit" type="button" onClick={saveToken} disabled={tokenDraft.trim().length < 32}>Use token for this tab <span>→</span></button>
            {serviceToken && <button className="disconnect-button" type="button" onClick={() => { setServiceToken(""); setTokenDraft(""); setConnectOpen(false); }}>Disconnect current token</button>}
            <p className="modal-footnote">Do not share this token. Public user accounts and shared usage limits are not part of this preview.</p>
          </section>
        </div>
      )}
    </main>
  );
}
