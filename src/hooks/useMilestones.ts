import { useEffect, useState } from "react";
import type { CalYear, YearBuckets, YearFetchState } from "../types/calendar";
import { bucketEvents, fetchYear, hydrateYear } from "../lib/calendar";

export interface MilestonesYear {
  buckets: YearBuckets | undefined;
  state: YearFetchState;
}

/**
 * Remote-wins per year: once buckets exist (live or disk cache) they fully
 * replace the static fallback, even when holding zero events.
 */
export function useMilestonesYear(year: CalYear): MilestonesYear {
  const [prevYear, setPrevYear] = useState<CalYear>(year);
  // Deterministic first render for hydration; cache is applied after mount.
  const [buckets, setBuckets] = useState<YearBuckets | undefined>(undefined);
  const [state, setState] = useState<YearFetchState>("idle");

  // Render-phase sync on year change: keeps initializer logic correct
  // without synchronous setState inside an effect.
  if (prevYear !== year) {
    setPrevYear(year);
    const hydrated = hydrateYear(year);
    setBuckets(hydrated.buckets ?? undefined);
    setState(
      !hydrated.buckets
        ? "idle"
        : hydrated.fresh
          ? "cached-fresh"
          : "cached-stale",
    );
  }

  useEffect(() => {
    const hydrated = hydrateYear(year);
    const cached = hydrated.buckets;
    if (cached) {
      // Async sync avoids synchronous setState-in-effect; hydration already
      // rendered the static fallback, so this only replaces it after mount.
      void Promise.resolve().then(() => {
        setBuckets(cached);
        setState(hydrated.fresh ? "cached-fresh" : "cached-stale");
      });
    }
    if (hydrated.fresh) return;

    // The events API (Google Apps Script) is below-the-fold data: delay the
    // network refresh so its connection + response never compete with the
    // LCP hero during the load window. Cache paint above stays instant.
    const controller = new AbortController();
    let cancelled = false;
    const timer = setTimeout(() => {
      void (async () => {
        setState((s) => (s === "cached-fresh" ? s : "pending"));
        try {
          const rows = await fetchYear(year, controller.signal);
          if (cancelled) return;
          if (rows) {
            setBuckets((prev) => {
              const next = bucketEvents(rows);
              return JSON.stringify(prev ?? null) === JSON.stringify(next)
                ? prev
                : next;
            });
            setState("live");
          } else {
            setState(hydrated.buckets ? "cached-stale" : "failed");
          }
        } catch {
          if (!cancelled) {
            setState(hydrated.buckets ? "cached-stale" : "failed");
          }
        }
      })();
    }, 3500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [year]);

  return { buckets, state };
}
