import { describe, expect, it } from "vitest";
import { parseMarkdown } from "./markdown";

describe("parseMarkdown", () => {
  it("parses headings, paragraphs, and lists", () => {
    expect(parseMarkdown("# Title\nA paragraph.\n\n- first\n- second")).toEqual([
      { kind: "heading", level: 1, text: "Title" },
      { kind: "paragraph", text: "A paragraph." },
      { kind: "unordered-list", items: ["first", "second"] }
    ]);
  });

  it("preserves fenced code and its language label", () => {
    expect(parseMarkdown("Before\n\n```ts\nconst answer = 42;\n```\nAfter")).toEqual([
      { kind: "paragraph", text: "Before" },
      { kind: "code", language: "ts", code: "const answer = 42;" },
      { kind: "paragraph", text: "After" }
    ]);
  });

  it("parses ordered lists, quotes, and rules", () => {
    expect(parseMarkdown("1. first\n2. second\n\n> quoted\n> line\n\n---")).toEqual([
      { kind: "ordered-list", items: ["first", "second"] },
      { kind: "quote", text: "quoted\nline" },
      { kind: "rule" }
    ]);
  });

  it("keeps raw HTML as text rather than interpreting it", () => {
    expect(parseMarkdown("<script>alert(1)</script>")).toEqual([
      { kind: "paragraph", text: "<script>alert(1)</script>" }
    ]);
  });
});
