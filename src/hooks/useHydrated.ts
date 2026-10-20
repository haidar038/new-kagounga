import { useSyncExternalStore } from "react";

const subscribe = (): (() => void) => () => {};

/**
 * False during SSR and hydration, true after the first client render.
 * Use to read browser-only state without hydration mismatches.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
