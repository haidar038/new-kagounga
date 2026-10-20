import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  // Deterministic first render for SSR hydration; effect applies the real match.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent): void => {
      setMatches(e.matches);
    };
    mq.addEventListener("change", onChange);
    // Async sync avoids synchronous setState-in-effect while still
    // correcting stale state when `query` changes.
    void Promise.resolve().then(() => {
      setMatches(mq.matches);
    });
    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, [query]);

  return matches;
}
