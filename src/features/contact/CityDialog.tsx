import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { DistributionPoint } from "../../types/content";
import type { CityGroup } from "../../data/locations";

/** Location list modal per region. Same pattern as ProductDialog. */
export function CityDialog({
  group,
  onClose,
  onSelect,
}: {
  group: CityGroup | null;
  onClose: () => void;
  onSelect: (point: DistributionPoint) => void;
}): React.JSX.Element {
  const ref = useRef<HTMLDialogElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (group) {
      prevFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
      prevFocus.current?.focus?.();
      prevFocus.current = null;
    }
  }, [group]);

  return (
    <dialog
      ref={ref}
      aria-label={group ? `Locations in ${group.city}` : "Location list"}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto max-h-[90vh] w-[calc(100%-2.5rem)] max-w-lg overflow-y-auto rounded-3xl border border-ink/10 bg-white p-0 text-ink shadow-2xl"
    >
      {group && (
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-ink/50">
                {group.points.length} points
              </p>
              <h3 className="mt-1 text-2xl font-bold">{group.city}</h3>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close location list"
              autoFocus
              className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/15 hover:border-ink/40"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <ul className="mt-5 grid max-h-[50vh] gap-2 overflow-y-auto">
            {group.points.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(p);
                    ref.current?.close();
                  }}
                  className="w-full rounded-2xl border border-ink/10 bg-white p-4 text-left transition hover:border-ink/40"
                >
                  <p className="font-bold">{p.name}</p>
                  <p className="mt-0.5 text-[13px] text-ink/60">{p.area}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  );
}
