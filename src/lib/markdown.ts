export type MarkdownBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; level: number; text: string }
  | { kind: "unordered-list"; items: string[] }
  | { kind: "ordered-list"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "code"; language: string; code: string }
  | { kind: "rule" };

function isBlockStart(line: string): boolean {
  return /^#{1,6}\s+/.test(line) ||
    /^\s*(?:[-*+]\s+|\d+[.)]\s+)/.test(line) ||
    /^>\s?/.test(line) ||
    /^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line);
}

function parseTextBlocks(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length, text: heading[2].trim() });
      index += 1;
      continue;
    }

    if (/^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line)) {
      blocks.push({ kind: "rule" });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ kind: "quote", text: quote.join("\n") });
      continue;
    }

    const unordered = /^\s*[-*+]\s+(.*)$/.exec(line);
    const ordered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    if (unordered || ordered) {
      const items: string[] = [];
      const kind = unordered ? "unordered-list" : "ordered-list";
      while (index < lines.length) {
        const match = kind === "unordered-list"
          ? /^\s*[-*+]\s+(.*)$/.exec(lines[index])
          : /^\s*\d+[.)]\s+(.*)$/.exec(lines[index]);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }
      blocks.push({ kind, items });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
      paragraph.push(lines[index]);
      index += 1;
    }
    if (paragraph.length === 0) {
      paragraph.push(lines[index]);
      index += 1;
    }
    blocks.push({ kind: "paragraph", text: paragraph.join("\n") });
  }

  return blocks;
}

export function parseMarkdown(source: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const fence = /```([^\n`]*)(?:\n)([\s\S]*?)```/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = fence.exec(source)) !== null) {
    blocks.push(...parseTextBlocks(source.slice(cursor, match.index)));
    blocks.push({
      kind: "code",
      language: match[1].trim().slice(0, 32),
      code: match[2].replace(/\n$/, "")
    });
    cursor = match.index + match[0].length;
  }

  blocks.push(...parseTextBlocks(source.slice(cursor)));
  return blocks;
}
