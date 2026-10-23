import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import mapWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import type { DistributionPoint } from "../../types/content";

// Worker maplibre tidak ter-resolve oleh Vite/rolldown dev server
// (URL relatif ./maplibre-gl-worker.mjs → 404). Daftarkan eksplisit.
maplibregl.setWorkerUrl(mapWorkerUrl);

const STYLE_URL =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export interface MapHandle {
  focusPoint: (point: DistributionPoint) => void;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function popupHTML(p: DistributionPoint): string {
  const kind = escapeHtml(p.kind.toUpperCase());
  const city = escapeHtml(p.city.toUpperCase());
  const name = escapeHtml(p.name);
  const area = escapeHtml(p.area);
  return (
    `<div class="kga-popup"><p class="kga-popup-kind">${kind} · ${city}</p>` +
    `<p class="kga-popup-name">${name}</p>` +
    `<p class="kga-popup-area">${area}</p></div>`
  );
}

function groupPopupHTML(points: DistributionPoint[], label: string): string {
  const rows = points
    .map(
      (p) =>
        `<p class="kga-popup-area"><strong>${escapeHtml(p.name)}</strong><br>${escapeHtml(p.area)}</p>`,
    )
    .join("");
  return `<div class="kga-popup"><p class="kga-popup-kind">${escapeHtml(label)}</p>${rows}</div>`;
}

interface ScreenGroup {
  points: DistributionPoint[];
  x: number;
  y: number;
}

export default function MapView({
  points,
  ariaLabel,
  onReady,
}: {
  points: DistributionPoint[];
  ariaLabel: string;
  onReady: (api: MapHandle | null) => void;
}): React.JSX.Element {
  const { t } = useTranslation("contact");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const map = new maplibregl.Map({
      container,
      style: STYLE_URL,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    let rendered: maplibregl.Marker[] = [];
    let renderedGroups: Array<{
      points: DistributionPoint[];
      marker: maplibregl.Marker;
    }> = [];

    const renderMarkers = (): void => {
      rendered.forEach((marker) => {
        marker.remove();
      });
      rendered = [];
      renderedGroups = [];

      // Cluster by screen distance. The initial view covers all cities, where
      // individual Ternate pins collapse into a single unclickable pile.
      const groups: ScreenGroup[] = [];
      for (const point of points) {
        const { x, y } = map.project([point.lng, point.lat]);
        const group = groups.find(
          (candidate) => Math.hypot(candidate.x - x, candidate.y - y) <= 32,
        );
        if (group) {
          const count = group.points.length;
          group.x = (group.x * count + x) / (count + 1);
          group.y = (group.y * count + y) / (count + 1);
          group.points.push(point);
        } else {
          groups.push({ points: [point], x, y });
        }
      }

      for (const group of groups) {
        const count = group.points.length;
        const cities = [...new Set(group.points.map((p) => p.city))];
        const label =
          count === 1
            ? `${group.points[0].name}, ${group.points[0].area}`
            : `${cities.join(" / ")} · ${count} ${t("legend.points")}`;
        const el = document.createElement("button");
        el.type = "button";
        el.className =
          count === 1
            ? `kga-marker kga-marker-${group.points[0].kind}`
            : "kga-marker kga-marker-cluster";
        el.setAttribute("aria-label", label);
        el.style.padding = "0";
        if (count > 1) el.textContent = String(count);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(map.unproject([group.x, group.y]))
          .setPopup(
            new maplibregl.Popup({ offset: 24 }).setHTML(
              count === 1
                ? popupHTML(group.points[0])
                : groupPopupHTML(group.points, label),
            ),
          )
          .addTo(map);
        rendered.push(marker);
        renderedGroups.push({ points: group.points, marker });
      }
    };

    let fitted = false;
    const fitMap = (): void => {
      if (fitted) return;
      fitted = true;
      map.resize();
      if (points.length === 0) {
        renderMarkers();
        return;
      }
      const bounds = new maplibregl.LngLatBounds();
      points.forEach((p) => {
        bounds.extend([p.lng, p.lat]);
      });
      map.fitBounds(bounds, { padding: 60, maxZoom: 11 });
      renderMarkers();
    };
    // `load` can wait on every tile/font. Fit as soon as the style is ready,
    // with `idle` as a fallback for styles that never reach a full load.
    map.once("style.load", fitMap);
    map.once("load", fitMap);
    map.once("idle", fitMap);
    map.on("moveend", renderMarkers);
    renderMarkers();

    onReady({
      focusPoint: (point) => {
        map.flyTo({
          center: [point.lng, point.lat],
          zoom: Math.max(map.getZoom(), 12),
        });
        map.once("moveend", () => {
          renderedGroups
            .find((group) => group.points.some((p) => p.id === point.id))
            ?.marker.togglePopup();
        });
      },
    });

    return () => {
      onReady(null);
      map.off("moveend", renderMarkers);
      rendered.forEach((marker) => {
        marker.remove();
      });
      map.remove();
    };
  }, [points, onReady, t]);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label={ariaLabel}
      className="h-full w-full"
    />
  );
}
