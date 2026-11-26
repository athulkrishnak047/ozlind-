"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";

type Role = "user" | "assistant";
type ChatMessage = { id: string; role: Role; content: string; provider?: string; model?: string; fallback?: boolean };
type Provider = "auto" | "gemini" | "groq";
type StreamEvent = { event: string; data: Record<string, unknown> };
type Conversation = { id: string; title: string; updatedAt: number; messages: ChatMessage[] };
const HISTORY_KEY = "ozlind:conversations:v1";
const MAX_SAVED_CONVERSATIONS = 12;
const MAX_SAVED_MESSAGES = 40;

function isConversation(value: unknown): value is Conversation {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.updatedAt === "number" &&
    Array.isArray(item.messages) &&
    item.messages.every((message) => {
      if (!message || typeof message !== "object") return false;
      const entry = message as Record<string, unknown>;
      return typeof entry.id === "string" &&
        (entry.role === "user" || entry.role === "assistant") &&
        typeof entry.content === "string";
    });
}
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId);
  const messages = activeConversation?.messages ?? [];

  function setMessages(updater: (current: ChatMessage[]) => ChatMessage[]) {
    if (!activeConversationId) return;
    setConversations((current) => current.map((conversation) => {
      if (conversation.id !== activeConversationId) return conversation;
      const nextMessages = updater(conversation.messages);
      const firstUserMessage = nextMessages.find((message) => message.role === "user");
      return {
        ...conversation,
        messages: nextMessages,
        title: firstUserMessage ? firstUserMessage.content.trim().slice(0, 48) : "New chat",
        updatedAt: Date.now()
      };
    }));
  }
  const [draft, setDraft] = useState("");
  const [provider, setProvider] = useState<Provider>("auto");
  const [status, setStatus] = useState<"idle" | "connecting" | "streaming">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const isBusy = status !== "idle";

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(HISTORY_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      const recent = Array.isArray(parsed)
        ? parsed.filter(isConversation).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_SAVED_CONVERSATIONS)
        : [];
      if (recent.length > 0) {
        setConversations(recent);
        setActiveConversationId(recent[0].id);
      } else {
        const initial: Conversation = { id: newId(), title: "New chat", updatedAt: Date.now(), messages: [] };
        setConversations([initial]);
        setActiveConversationId(initial.id);
      }
    } catch {
      const initial: Conversation = { id: newId(), title: "New chat", updatedAt: Date.now(), messages: [] };
      setConversations([initial]);
      setActiveConversationId(initial.id);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!historyLoaded) return;
    try {
      const recent = [...conversations]
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, MAX_SAVED_CONVERSATIONS)
        .map((conversation) => ({ ...conversation, messages: conversation.messages.slice(-MAX_SAVED_MESSAGES) }));
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(recent));
    } catch {
      setErrorMessage("This browser could not save chat history. You can continue chatting, but history may not persist.");
    }
  }, [conversations, historyLoaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => () => {
    abortRef.current?.abort();
    if (recorderRef.current) {
      recorderRef.current.onstop = null;
      recorderRef.current.stream.getTracks().forEach((track) => track.stop());
      if (recorderRef.current.state !== "inactive") recorderRef.current.stop();
    }
  }, []);


  function startNewChat() {
    abortRef.current?.abort();
    abortRef.current = null;
    const conversation: Conversation = { id: newId(), title: "New chat", updatedAt: Date.now(), messages: [] };
    setConversations((current) => [conversation, ...current].slice(0, MAX_SAVED_CONVERSATIONS));
    setActiveConversationId(conversation.id);
    setDraft("");
    setStatus("idle");
    setErrorMessage("");
  }

  function openConversation(conversationId: string) {
    if (isBusy || conversationId === activeConversationId) return;
    abortRef.current?.abort();
    abortRef.current = null;
    setActiveConversationId(conversationId);
    setDraft("");
    setStatus("idle");
    setErrorMessage("");
  }

  async function toggleVoiceRecording() {
    if (isRecording) {
      recorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setErrorMessage("Voice recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]
        .find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = preferredType
        ? new MediaRecorder(stream, { mimeType: preferredType })
        : new MediaRecorder(stream);
      recordingChunksRef.current = [];
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordingChunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setErrorMessage("The microphone recording failed. Please try again.");
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
        const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        recordingChunksRef.current = [];
        if (!blob.size) return;
        if (blob.size > 4 * 1024 * 1024) {
          setErrorMessage("This recording is too large. Please record a shorter message (under 4 MB).");
          return;
        }
        setStatus("connecting");
        setErrorMessage("");
        try {
          const form = new FormData();
          const extension = blob.type.includes("mp4") ? "m4a" : "webm";
          form.append("audio", blob, `voice-message.${extension}`);
          const response = await fetch("/api/transcribe", { method: "POST", body: form, cache: "no-store" });
          const body: unknown = await response.json().catch(() => null);
          if (!response.ok) throw new Error(errorText(body, `Transcription failed (HTTP ${response.status}).`));
          const transcript = body && typeof body === "object" && "text" in body ? (body as { text?: unknown }).text : null;
          if (typeof transcript !== "string" || !transcript.trim()) throw new Error("No speech could be detected.");
          setDraft((current) => current ? `${current.trim()} ${transcript.trim()}` : transcript.trim());
        } catch (error) {
          setErrorMessage(error instanceof Error ? error.message : "Voice transcription failed.");
        } finally {
          setStatus("idle");
        }
      };
      recorder.start(250);
      setIsRecording(true);
      setErrorMessage("");
    } catch {
      setErrorMessage("Allow microphone access in your browser to use voice input.");
      setIsRecording(false);
    }
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
      if (controller.signal.aborted && !receivedText) {
        setMessages((current) => current.filter((message) => message.id !== assistantMessage.id));
      }
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
        <Link className="brand" href="/" aria-label="Ozlind home">
          <span className="brand-symbol" aria-hidden="true"><span /></span>
          <span className="brand-word">ozlind<span className="brand-period">.</span></span>
        </Link>

        <button className="new-chat-button" type="button" onClick={startNewChat} disabled={!historyLoaded}>
          <span aria-hidden="true">＋</span> New chat

        </button>

        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>
          <div className="nav-item active"><span aria-hidden="true">✳</span> Assistant</div>
        </div>

        <div className="sidebar-section recent-chats">
          <p className="sidebar-label">RECENT CHATS</p>
          {conversations.filter((conversation) => conversation.messages.length > 0).map((conversation) => (
            <button className={`nav-item history-item ${conversation.id === activeConversationId ? "active" : ""}`} key={conversation.id} type="button" onClick={() => openConversation(conversation.id)} disabled={isBusy}>
              <span aria-hidden="true">◷</span><span className="history-title">{conversation.title}</span>
            </button>
          ))}
          {conversations.every((conversation) => conversation.messages.length === 0) && <p className="history-empty">Your conversations will appear here.</p>}
        </div>

        <div className="sidebar-spacer" />
        <div className="sidebar-note">
          <span className="note-icon" aria-hidden="true">◇</span>
          <p>Thoughtful AI, built with care.</p>
          <span>History saved on this device</span>
        </div>
        <div className="profile-row">
          <div className="profile-avatar">O</div>
          <div><strong>Ozlind</strong><span>AI workspace</span></div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-separator">/</span><strong>Assistant</strong></div>
          <div className="topbar-actions">
            <span className="privacy-pill"><span /> Public workspace</span>
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
                <span>{activeConversation?.title || "NEW CONVERSATION"}</span>
                <button type="button" onClick={startNewChat}>New chat</button>
              </div>
              {messages.map((message) => (
                <article className={`message-row ${message.role}`} key={message.id}>
                  <div className={`message-avatar ${message.role === "assistant" ? "assistant-avatar" : "user-avatar"}`}>
                    {message.role === "assistant" ? "✳" : "U"}
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
                <button className={`voice-button ${isRecording ? "recording" : ""}`} type="button" onClick={() => void toggleVoiceRecording()} disabled={isBusy} aria-label={isRecording ? "Stop voice recording" : "Start voice recording"} title={isRecording ? "Stop recording" : "Speak your message"}>{isRecording ? "■" : "🎙"}</button>
                <span className="composer-hint">{isRecording ? "Listening… tap stop when finished" : "Shift + Enter for a new line"}</span>
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

    </main>
  );
}
