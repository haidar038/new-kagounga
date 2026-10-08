import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(\*\*.+?\*\*)/g).map((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**") && chunk.length > 4) {
      return <strong key={`${keyPrefix}-${i}`}>{chunk.slice(2, -2)}</strong>;
    }
    const italicParts = chunk.split(/(\*[^*\n]+?\*)/g).map((part, j) => {
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={`${keyPrefix}-${i}-${j}`}>{part.slice(1, -1)}</em>;
      }
      return <span key={`${keyPrefix}-${i}-${j}`}>{part}</span>;
    });
    return <span key={`${keyPrefix}-${i}`}>{italicParts}</span>;
  });
}

/**
 * Minimal markdown renderer for news bodies: blank-line separated
 * paragraphs with **bold** inline. No dependency, no raw HTML.
 */
export function renderMarkdownBody(markdown: string): ReactNode[] {
  return markdown
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((paragraph, i) => (
      <p key={i}>{renderInline(paragraph, `p${i}`)}</p>
    ));
}
