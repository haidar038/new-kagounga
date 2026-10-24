import { Fragment, type ReactNode } from "react";
import type { ArtworkCaptionRun } from "../../data/artworks";

interface CaptionTextProps {
  lines: ArtworkCaptionRun[][];
  className?: string;
}

/**
 * Renders pre-parsed caption runs: outer array = lines, inner = styled runs.
 * Empty line arrays are stanza breaks (poems).
 */
export function CaptionText({
  lines,
  className,
}: CaptionTextProps): ReactNode {
  return (
    <div className={className}>
      {lines.map((runs, i) =>
        runs.length === 0 ? (
          <span key={i} aria-hidden="true" className="block h-3" />
        ) : (
          <span key={i} className="block">
            {runs.map((run, j) => {
              const content: ReactNode = run.bold ? (
                <strong className="font-bold text-ink">{run.text}</strong>
              ) : (
                run.text
              );
              return (
                <Fragment key={j}>
                  {run.italic ? <em className="italic">{content}</em> : content}
                </Fragment>
              );
            })}
          </span>
        ),
      )}
    </div>
  );
}
