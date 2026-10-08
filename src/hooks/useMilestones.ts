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
  const [buckets, setBuckets] = useState<YearBuckets | undefined>(() => {
    const { buckets: cached } = hydrateYear(year);
    return cached ?? undefined;
  });
  const [state, setState] = useState<YearFetchState>(() =>
    hydrateYear(year).buckets ? "cached-stale" : "idle",
  );

  useEffect(() => {
    const hydrated = hydrateYear(year);
    if (hydrated.buckets) {
      setBuckets(hydrated.buckets);
      if (hydrated.fresh) {
        setState("cached-fresh");
        return;
      }
      setState("cached-stale");
    } else {
      setBuckets(undefined);
      setState("idle");
    }

    const controller = new AbortController();
    setState((s) => (s === "cached-fresh" ? s : "pending"));
    if (hydrated.fresh) return undefined;

    let cancelled = false;
    void (async () => {
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
