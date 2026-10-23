import { describe, expect, it } from "vitest";
import {
  lexicalToMarkdown,
  mdToLexical,
  type LexicalDocument,
} from "../../src/lib/lexical-markdown";
import { NEWS_POSTS } from "../../src/data/news";

// Fixture subset yang DIDUKUNG konverter (paragraf, h1–h3, list, quote,
// link, bold/italic/code — tanpa nesting campur). Fixture identik dengan
// suite CMS `kagounga-cms/tests/unit/lexical-markdown.spec.ts` (D-010/D-031).
const ROUNDTRIP_FIXTURES: string[] = [
  "Plain paragraph.",
  "# Title\n\n## Subtitle\n\n### Section",
  "- Sago starch\n- Turmeric seasoning\n- 1 collectible artwork",
  "1. First\n2. Second\n3. Third",
  "> A quoted line.",
  "See [the catalog](https://kagounga.com/catalog) now.",
  "Plain **bold**, *italic* and `code` inline.",
];

describe("mdToLexical", () => {
  it("parses headings with tags", () => {
    const [h1, h3] = mdToLexical("# A\n\n### B").root.children;
    expect(h1).toMatchObject({ type: "heading", tag: "h1" });
    expect(h3).toMatchObject({ type: "heading", tag: "h3" });
  });

  it("parses bullet and numbered lists", () => {
    expect(mdToLexical("- a").root.children[0]).toMatchObject({
      type: "list",
      listType: "bullet",
    });
    expect(mdToLexical("1. a").root.children[0]).toMatchObject({
      type: "list",
      listType: "number",
    });
  });

  it("parses quotes and links", () => {
    expect(mdToLexical("> hi").root.children[0]?.type).toBe("quote");
    const link = mdToLexical("[x](https://a.b)").root.children[0]?.children[0];
    expect(link).toMatchObject({ type: "link", fields: { url: "https://a.b" } });
  });

  it("produces an empty document for empty input", () => {
    expect(lexicalToMarkdown(mdToLexical(""))).toBe("");
  });
});

describe("lexicalToMarkdown", () => {
  it("renders bolditalic from format bits (md side tidak parsing `***`)", () => {
    const doc: LexicalDocument = {
      root: {
        type: "root",
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
        children: [
          {
            type: "paragraph",
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
            children: [
              {
                type: "text",
                text: "x",
                format: 1 | 2,
                detail: 0,
                mode: "normal",
                style: "",
                version: 1,
              },
            ],
          },
        ],
      },
    };
    expect(lexicalToMarkdown(doc)).toBe("***x***");
  });
});

describe("roundtrip", () => {
  it("is exact for the supported markdown subset", () => {
    for (const md of ROUNDTRIP_FIXTURES) {
      expect(lexicalToMarkdown(mdToLexical(md))).toBe(md);
    }
  });

  it("is stable (idempotent) for the seeded news bodies, EN and ID", () => {
    for (const post of NEWS_POSTS) {
      for (const body of [post.bodyMarkdown, post.bodyMarkdownId]) {
        if (!body) continue;
        const once = lexicalToMarkdown(mdToLexical(body));
        expect(lexicalToMarkdown(mdToLexical(once))).toBe(once);
      }
    }
  });
});
