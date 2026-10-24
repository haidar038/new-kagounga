import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { localeLink, useLocale } from "../i18n";

/**
 * Renders a tiny inline-markdown subset — [text](url) links and **bold** —
 * as React elements (no dangerouslySetInnerHTML, so locale strings stay safe
 * in prerendered HTML). Link text is itself parsed, so [**bold link**](/x)
 * works. Internal paths become <Link> with locale prefix; mailto/http become
 * plain <a>.
 */
const INLINE_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*/;

const linkClass =
  "font-bold text-ink underline decoration-ink/40 underline-offset-2 transition-colors hover:decoration-ink";

function InlineLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): React.JSX.Element {
  const locale = useLocale();

  if (href.startsWith("/")) {
    return (
      <Link to={localeLink(href, locale)} className={linkClass}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={linkClass}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let index = 0;

  while (rest.length > 0) {
    const match = INLINE_PATTERN.exec(rest);
    if (!match) {
      nodes.push(rest);
      break;
    }
    if (match.index > 0) {
      nodes.push(rest.slice(0, match.index));
    }
    const key = `${keyPrefix}:${index}`;
    if (match[1] !== undefined) {
      nodes.push(
        <InlineLink key={key} href={match[2]}>
          {renderInline(match[1], key)}
        </InlineLink>,
      );
    } else {
      nodes.push(<strong key={key}>{match[3]}</strong>);
    }
    rest = rest.slice(match.index + match[0].length);
    index += 1;
  }

  return nodes;
}

export function MarkdownText({ text }: { text: string }): React.JSX.Element {
  return <>{renderInline(text, "md")}</>;
}
