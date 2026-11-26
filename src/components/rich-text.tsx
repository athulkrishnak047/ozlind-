"use client";

import { useState, type ReactNode } from "react";
import { parseMarkdown, type MarkdownBlock } from "@/lib/markdown";

function safeHref(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function InlineContent({ value }: { value: string }) {
  const tokenPattern = /(\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s<>()]+|`[^`\n]+`|\*\*[^*\n]+\*\*|~~[^~\n]+~~|\*[^*\n]+\*)/g;
  const parts = value.split(tokenPattern).filter(Boolean);

  return (
    <>
      {parts.map((part, index) => {
        const markdownLink = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.exec(part);
        if (markdownLink) {
          const href = safeHref(markdownLink[2]);
          return href
            ? <a key={index} href={href} target="_blank" rel="noopener noreferrer">{markdownLink[1]}</a>
            : <span key={index}>{part}</span>;
        }

        if (/^https?:\/\//.test(part)) {
          const href = safeHref(part.replace(/[.,!?;:]+$/, ""));
          if (href) {
            const suffix = part.slice(href.length);
            return <span key={index}><a href={href} target="_blank" rel="noopener noreferrer">{href}</a>{suffix}</span>;
          }
        }
        if (part.startsWith("`") && part.endsWith("`")) return <code className="inline-code" key={index}>{part.slice(1, -1)}</code>;
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("~~") && part.endsWith("~~")) return <del key={index}>{part.slice(2, -2)}</del>;
        if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function CodeBlock({ block }: { block: Extract<MarkdownBlock, { kind: "code" }> }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(block.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rich-code-block">
      <div className="rich-code-header">
        <span>{block.language || "Code"}</span>
        <button type="button" onClick={() => void copyCode()} aria-label="Copy code">{copied ? "Copied" : "Copy code"}</button>
      </div>
      <pre><code>{block.code}</code></pre>
    </div>
  );
}

function renderBlock(block: MarkdownBlock, index: number): ReactNode {
  switch (block.kind) {
    case "heading": {
      const content = <InlineContent value={block.text} />;
      if (block.level === 1) return <h2 key={index}>{content}</h2>;
      if (block.level === 2) return <h3 key={index}>{content}</h3>;
      return <h4 key={index}>{content}</h4>;
    }
    case "paragraph":
      return <p key={index}><InlineContent value={block.text} /></p>;
    case "unordered-list":
      return <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineContent value={item} /></li>)}</ul>;
    case "ordered-list":
      return <ol key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineContent value={item} /></li>)}</ol>;
    case "quote":
      return <blockquote key={index}><InlineContent value={block.text} /></blockquote>;
    case "rule":
      return <hr key={index} />;
    case "code":
      return <CodeBlock block={block} key={index} />;
  }
}

export function RichText({ content }: { content: string }) {
  return <div className="rich-text">{parseMarkdown(content).map(renderBlock)}</div>;
}
