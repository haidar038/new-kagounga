/**
 * Cermin verbatim `kagounga-cms/src/utils/lexical-markdown.ts`.
 * Tanpa workspace, dua file dijaga sinkron manual (D-010). Ubah satu = ubah dua.
 * Subset didukung: paragraf, heading #–###, list bullet/number, quote,
 * link [teks](url), inline **bold** *italic* `code`.
 * Dipakai: adapter CMS M4 (lexical→md, kompatibel `lib/markdown.tsx`).
 */

const BOLD = 1
const ITALIC = 2
const CODE = 16

export interface LexicalTextNode {
  [key: string]: unknown
  type: 'text'
  text: string
  format: number
  detail: number
  mode: 'normal' | 'token' | 'segmented'
  style: string
  version: 1
}

export type LexicalElementType = 'paragraph' | 'heading' | 'list' | 'listitem' | 'quote' | 'link'

export interface LexicalElementNode {
  [key: string]: unknown
  type: LexicalElementType
  children: LexicalNode[]
  direction: 'ltr' | null
  format: ''
  indent: number
  version: 1
  tag?: string
  listType?: 'bullet' | 'number'
  fields?: { url: string; newTab?: boolean }
}

export type LexicalNode = LexicalTextNode | LexicalElementNode

export interface LexicalDocument {
  [key: string]: unknown
  root: {
    [key: string]: unknown
    type: 'root'
    children: LexicalNode[]
    direction: 'ltr'
    format: ''
    indent: 0
    version: 1
  }
}

function textNode(text: string, format = 0): LexicalTextNode {
  return { type: 'text', text, format, detail: 0, mode: 'normal', style: '', version: 1 }
}

function element(
  type: LexicalElementType,
  children: LexicalNode[],
  extra: Partial<LexicalElementNode> = {},
): LexicalElementNode {
  return { type, children, direction: 'ltr', format: '', indent: 0, version: 1, ...extra }
}

function splitKeep(text: string, re: RegExp): string[] {
  return text.split(re).filter((s) => s.length > 0)
}

/** Inline md → nodes. Urut: code → link → bold → italic (tanpa nesting campur). */
function inlineNodes(text: string): LexicalNode[] {
  const out: LexicalNode[] = []
  for (const chunk of splitKeep(text, /(`[^`]+`)/g)) {
    if (chunk.startsWith('`') && chunk.endsWith('`') && chunk.length > 2) {
      out.push(textNode(chunk.slice(1, -1), CODE))
      continue
    }
    out.push(...inlineLinks(chunk))
  }
  return out
}

function inlineLinks(text: string): LexicalNode[] {
  const out: LexicalNode[] = []
  for (const chunk of splitKeep(text, /(\[[^\]]+\]\([^)]+\))/g)) {
    const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(chunk)
    if (m) {
      out.push(element('link', inlineBoldItalic(m[1]), { fields: { url: m[2] } }))
      continue
    }
    out.push(...inlineBoldItalic(chunk))
  }
  return out
}

function inlineBoldItalic(text: string): LexicalNode[] {
  const out: LexicalNode[] = []
  for (const chunk of splitKeep(text, /(\*\*[^*]+\*\*)/g)) {
    if (chunk.startsWith('**') && chunk.endsWith('**')) {
      out.push(...inlineItalic(chunk.slice(2, -2), BOLD))
      continue
    }
    out.push(...inlineItalic(chunk, 0))
  }
  return out
}

function inlineItalic(text: string, base: number): LexicalNode[] {
  const out: LexicalNode[] = []
  for (const chunk of splitKeep(text, /(\*[^*]+\*)/g)) {
    if (chunk.startsWith('*') && chunk.endsWith('*') && chunk.length > 2) {
      out.push(textNode(chunk.slice(1, -1), base | ITALIC))
      continue
    }
    out.push(textNode(chunk, base))
  }
  return out
}

function inlineText(nodes: LexicalNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === 'text') return n.text
      const el = n as LexicalElementNode
      return inlineText(el.children)
    })
    .join('')
}

/** Markdown minimal → dokumen Lexical. */
export function mdToLexical(md: string): LexicalDocument {
  const children: LexicalNode[] = []
  for (const raw of md.split(/\n{2,}/)) {
    const block = raw.trim()
    if (!block) continue
    const heading = /^(#{1,3})\s+(.*)$/s.exec(block)
    if (heading) {
      children.push(element('heading', inlineNodes(heading[2]), { tag: `h${heading[1].length}` }))
      continue
    }
    const lines = block.split('\n').map((l) => l.trim())
    if (lines.every((l) => l.startsWith('>'))) {
      children.push(
        element('quote', inlineNodes(lines.map((l) => l.replace(/^>\s?/, '')).join(' '))),
      )
      continue
    }
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      children.push(
        element(
          'list',
          lines.map((l) =>
            element('listitem', inlineNodes(l.replace(/^[-*]\s+/, '')), { direction: null }),
          ),
          { listType: 'bullet' },
        ),
      )
      continue
    }
    if (lines.every((l) => /^\d+\.\s+/.test(l))) {
      children.push(
        element(
          'list',
          lines.map((l) =>
            element('listitem', inlineNodes(l.replace(/^\d+\.\s+/, '')), { direction: null }),
          ),
          { listType: 'number' },
        ),
      )
      continue
    }
    children.push(element('paragraph', inlineNodes(block.replace(/\n/g, ' '))))
  }
  return { root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } }
}

function inlineMarkdown(nodes: LexicalNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === 'text') {
        if (n.format & CODE) return `\`${n.text}\``
        if (n.format & BOLD && n.format & ITALIC) return `***${n.text}***`
        if (n.format & BOLD) return `**${n.text}**`
        if (n.format & ITALIC) return `*${n.text}*`
        return n.text
      }
      const el = n as LexicalElementNode
      if (el.type === 'link') return `[${inlineMarkdown(el.children)}](${el.fields?.url ?? ''})`
      return inlineMarkdown(el.children)
    })
    .join('')
}

function blockMarkdown(node: LexicalNode): string {
  const el = node as LexicalElementNode
  switch (el.type) {
    case 'heading': {
      const level = el.tag === 'h1' ? '#' : el.tag === 'h3' ? '###' : '##'
      return `${level} ${inlineMarkdown(el.children)}`
    }
    case 'quote':
      return `> ${inlineMarkdown(el.children)}`
    case 'list': {
      const items = el.children.map((li) => inlineText([li]))
      return items
        .map((t, i) => (el.listType === 'number' ? `${i + 1}. ${t}` : `- ${t}`))
        .join('\n')
    }
    default:
      return inlineMarkdown(el.children)
  }
}

/** Dokumen Lexical → markdown minimal. */
export function lexicalToMarkdown(doc: LexicalDocument): string {
  return doc.root.children.map(blockMarkdown).join('\n\n')
}
