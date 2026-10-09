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
  const [buckets, setBuckets] = useState<YearBuckets | undefined>(() => {
    const { buckets: cached } = hydrateYear(year);
    return cached ?? undefined;
  });
  const [state, setState] = useState<YearFetchState>(() => {
    const hydrated = hydrateYear(year);
    if (!hydrated.buckets) return "idle";
    return hydrated.fresh ? "cached-fresh" : "cached-stale";
  });

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
    if (hydrated.fresh) return;

    const controller = new AbortController();
    let cancelled = false;
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

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [year]);

  return { buckets, state };
}
