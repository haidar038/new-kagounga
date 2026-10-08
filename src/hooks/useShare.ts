import { useCallback, useEffect, useRef, useState } from "react";

export interface SharePayload {
  title: string;
  text: string;
  url: string;
}

export function useShareLink(): {
  copied: boolean;
  share: (data: SharePayload) => void;
} {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const share = useCallback((data: SharePayload) => {
    if (typeof navigator.share === "function") {
      void navigator.share(data).catch(() => {
        // dismissed, stay silent like legacy
      });
      return;
    }
    void navigator.clipboard
      ?.writeText(data.url)
      .then(() => {
        setCopied(true);
        timer.current = window.setTimeout(() => {
          setCopied(false);
        }, 1600);
      })
      .catch(() => {
        // clipboard unavailable, stay silent like legacy
      });
  }, []);

  return { copied, share };
}
