import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as maplibregl from "maplibre-gl";
import { ArrowRight } from "lucide-react";
import type { DistributionPoint, LocationKind } from "../../types/content";
import {
  LOCATIONS,
  groupByCity,
  type CityGroup,
} from "../../data/locations";
import mapWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import { Reveal } from "../../components/Reveal";
import { CityDialog } from "./CityDialog";

// Worker maplibre tidak ter-resolve oleh Vite/rolldown dev server
// (URL relatif ./maplibre-gl-worker.mjs → 404). Daftarkan eksplisit.
maplibregl.setWorkerUrl(mapWorkerUrl);

const STYLE_URL =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

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

export function FindUs(): React.JSX.Element {
  const { t } = useTranslation("contact");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [activeCity, setActiveCity] = useState<CityGroup | null>(null);
  const groups = useMemo(() => groupByCity(LOCATIONS), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const map = new maplibregl.Map({
      container,
      style: STYLE_URL,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const markers = new Map<string, maplibregl.Marker>();
    LOCATIONS.forEach((p) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `kga-marker kga-marker-${p.kind}`;
      el.setAttribute("aria-label", `${p.name}, ${p.area}`);
      el.style.padding = "0";
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .setPopup(new maplibregl.Popup({ offset: 24 }).setHTML(popupHTML(p)))
        .addTo(map);
      markers.set(p.id, marker);
    });

    map.on("load", () => {
      const bounds = new maplibregl.LngLatBounds();
      LOCATIONS.forEach((p) => {
        bounds.extend([p.lng, p.lat]);
      });
      map.fitBounds(bounds, { padding: 60, maxZoom: 11 });
    });

    mapRef.current = map;
    markersRef.current = markers;
    return () => {
      markers.clear();
      map.remove();
    };
  }, []);

  const focusPoint = (p: DistributionPoint): void => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 12) });
    markersRef.current.get(p.id)?.togglePopup();
  };

  return (
    <section id="find-us" className="bg-ink pt-16 text-cream md:pt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h1 className="display text-5xl md:text-6xl">
            <span className="font-bold">{t("findUs.titleBold")}</span>{" "}
            <span className="font-light">{t("findUs.titleLight")}</span>
          </h1>
        </Reveal>
        <Reveal>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-cream/70">
            {t("findUs.lede", { count: LOCATIONS.length })}
          </p>
        </Reveal>
        <div className="mt-8 border-t border-cream/20" />

        <Reveal>
          <div
            ref={containerRef}
            role="application"
            aria-label={t("findUs.map")}
            className="mt-8 h-[40vh] min-h-80 w-full overflow-hidden rounded-3xl border border-cream/10 md:h-[55vh] md:min-h-105"
          />
        </Reveal>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-bold text-cream/60">
          {(["retail", "partner", "hub"] as LocationKind[]).map((kind) => (
            <span key={kind} className="flex items-center gap-1.5">
              <span className={`kga-legend kga-marker-${kind}`} /> {t(`kinds.${kind}`)}
            </span>
          ))}
        </div>

        <div className="grid gap-4 py-10 sm:grid-cols-2 md:py-12 lg:grid-cols-5">
          {groups.map((group) => (
            <Reveal key={group.city}>
              <button
                type="button"
                onClick={() => {
                  setActiveCity(group);
                }}
                aria-haspopup="dialog"
                className="w-full rounded-3xl border border-cream/10 bg-white/6 p-6 text-left transition hover:border-lime/60"
              >
                <p className="display text-5xl font-black text-lime">
                  {group.points.length}
                </p>
                <p className="mt-2 font-bold text-cream">{group.city}</p>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-cream/60">
                  {t("legend.viewList")}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </p>
              </button>
            </Reveal>
          ))}
        </div>

        <CityDialog
          group={activeCity}
          onClose={() => {
            setActiveCity(null);
          }}
          onSelect={focusPoint}
        />
      </div>
    </section>
  );
}
