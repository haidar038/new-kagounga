import { useEffect } from "react";

export interface DocumentMeta {
  title: string;
  description: string;
}

export function useDocumentMeta({ title, description }: DocumentMeta): void {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }, [title, description]);
}
