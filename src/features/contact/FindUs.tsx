import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import type { LocationKind } from "../../types/content";
import type { StockistCityGroup } from "../../data/stockists";
import { getStockistCities, loadStockistCities } from "../../data/stockists";
import { localeLink, useLocale } from "../../i18n";
import { Reveal } from "../../components/Reveal";
import { CityDialog } from "./CityDialog";
import type { MapHandle } from "./MapView";

// MapLibre + its CSS live in their own chunk; load only when the map is near
// the viewport so the contact route stays light on first paint.
const LazyMap = lazy(() => import("./MapView"));

export function FindUs(): React.JSX.Element {
  const { t } = useTranslation("contact");
  const locale = useLocale();
  const mapWrapRef = useRef<HTMLDivElement>(null);
  const mapApi = useRef<MapHandle | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [activeCity, setActiveCity] = useState<StockistCityGroup | null>(null);
  const fallbackCities = useMemo(() => getStockistCities(locale), [locale]);
  const [cached, setCached] = useState(() => ({ locale, cities: fallbackCities }));
  const cities = cached.locale === locale ? cached.cities : fallbackCities;
  const points = useMemo(() => cities.flatMap((city) => city.points), [cities]);
  const groups = useMemo<StockistCityGroup[]>(
    () => cities.map(({ city, slug, points: cityPoints }) => ({ city, slug, points: cityPoints })),
    [cities],
  );

  useEffect(() => {
    let on = true;
    loadStockistCities(locale, fallbackCities).then((result) => {
      if (on && result.source === "cms") setCached({ locale, cities: result.items });
    });
    return () => {
      on = false;
    };
  }, [locale, fallbackCities]);

  useEffect(() => {
    const el = mapWrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMapReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, []);

  const onMapReady = useCallback((api: MapHandle | null): void => {
    mapApi.current = api;
  }, []);

  const focusPoint = useCallback((point: Parameters<MapHandle["focusPoint"]>[0]): void => {
    mapApi.current?.focusPoint(point);
  }, []);

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
            {t("findUs.lede", { count: points.length })}
          </p>
        </Reveal>
        <div className="mt-8 border-t border-cream/20" />

        <Reveal>
          <div
            ref={mapWrapRef}
            className="mt-8 h-[40vh] min-h-80 w-full overflow-hidden rounded-3xl border border-cream/10 bg-cream/5 md:h-[55vh] md:min-h-105"
          >
            {mapReady ? (
              <Suspense
                fallback={
                  <div className="grid h-full place-items-center text-[13px] text-cream/70">
                    {t("findUs.map")}
                  </div>
                }
              >
                <LazyMap
                  points={points}
                  ariaLabel={t("findUs.map")}
                  onReady={onMapReady}
                />
              </Suspense>
            ) : (
              <div
                aria-hidden="true"
                className="grid h-full place-items-center text-[13px] text-cream/70"
              >
                {t("findUs.map")}
              </div>
            )}
          </div>
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
            <Reveal key={group.city} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-cream/10 bg-white/6 p-6">
                <Link
                  to={localeLink(`/stockists/${group.slug}`, locale)}
                  className="group flex-1"
                >
                  <p className="display text-5xl font-black text-lime">
                    {group.points.length}
                  </p>
                  <p className="mt-2 font-bold text-cream group-hover:text-lime">
                    {group.city}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-cream/60">
                    {t("legend.viewPage")}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCity(group);
                  }}
                  aria-haspopup="dialog"
                  className="mt-4 border-t border-cream/15 pt-3 text-left text-[12px] font-bold text-cream/70 hover:text-cream"
                >
                  {t("legend.viewList")}
                </button>
              </article>
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
