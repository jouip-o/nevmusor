import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { POINTS } from "@/lib/data";
import { pageHead, useI18n } from "@/lib/site";
import { FaqList } from "@/lib/faq";

export const Route = createFileRoute("/")({
  head: () => pageHead("Сдай батарейку — Чертаново"),
  component: Index,
});

// Yandex Maps JS API 2.1 (the key is issued for 2.1; the v3 endpoint rejects it).
let ymapsPromise: Promise<any> | null = null;
function loadYmaps(lang: string) {
  if (ymapsPromise) return ymapsPromise;
  ymapsPromise = new Promise((resolve, reject) => {
    const key = "1363fda3-718d-4325-a45a-7c4a546af50d";
    const sc = document.createElement("script");
    sc.src = `https://api-maps.yandex.ru/2.1/?lang=${lang === "en" ? "en_US" : "ru_RU"}&apikey=${key}`;
    sc.onload = () => (window as any).ymaps.ready(() => resolve((window as any).ymaps));
    sc.onerror = reject;
    document.head.appendChild(sc);
  });
  return ymapsPromise;
}

function Index() {
  const { t, tr } = useI18n();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    if (hash) document.getElementById(hash)?.scrollIntoView();
  }, [hash]);

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const marksRef = useRef<Record<string, any>>({});
  const { lang } = useI18n();

  useEffect(() => {
    let map: any;
    let dead = false;
    loadYmaps(lang).then((ymaps) => {
      if (dead || !mapEl.current) return;
      map = new ymaps.Map(mapEl.current, { center: [55.622, 37.6], zoom: 13, controls: ["zoomControl", "geolocationControl"] }, { suppressMapOpenBlock: true });
      map.behaviors.enable("scrollZoom");
      mapRef.current = map;
      marksRef.current = {};
      POINTS.forEach((p: any, i: number) => {
        const m = new ymaps.Placemark(
          [p.lat, p.lng],
          {
            iconContent: String(i + 1),
            hintContent: `${tr(p.name)}, ${tr(p.address)}`,
            balloonContentHeader: `${i + 1}. ${tr(p.name)}`,
            balloonContentBody: `${tr(p.address)}<br>🕘 ${tr(p.hours)}`,
            balloonContentFooter: `<a href="/point?p=${p.id}">${t("map.details")} →</a>`,
          },
          { preset: "islands#brownStretchyIcon", balloonPanelMaxMapArea: 0, balloonMaxWidth: 260 }
        );
        m.events.add("click", () => setActiveId(p.id));
        map.geoObjects.add(m);
        marksRef.current[p.id] = m;
      });
      const b = map.geoObjects.getBounds();
      if (b) map.setBounds(b, { checkZoomRange: true, zoomMargin: 40 });
    });
    return () => {
      dead = true;
      map?.destroy();
      mapRef.current = null;
    };
  }, [lang]);

  useEffect(() => {
    const m = activeId && marksRef.current[activeId];
    if (m && mapRef.current) {
      mapRef.current.panTo(m.geometry.getCoordinates());
      m.balloon.open();
    }
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;
    const row = document.querySelector(`.place[data-id="${activeId}"]`);
    if (row && window.matchMedia("(min-width: 900px)").matches) row.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".lmap, .place")) setActiveId(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [activeId]);

  const groups: { name: string; items: any[] }[] = [];
  POINTS.forEach((p: any) => {
    const name = tr(p.name);
    let g = groups.find((x) => x.name === name);
    if (!g) {
      g = { name, items: [] };
      groups.push(g);
    }
    g.items.push(p);
  });

  return (
    <>
      <section className="hero full hero-photo" id="top">
        <img className="hero-img" src="/img/hero-illustration.jpg" alt="" />
        <div className="hero-inner">
          <div className="hero-text">
            <span className="pill">{t("hero.pilot")}</span>
            <h1>{t("hero.title")}</h1>
            <a className="btn btn-big" href="#map">
              {t("hero.cta")}
            </a>
            <p className="hero-hint">
              <span id="statPoints">{POINTS.length}</span> <span>{t("hero.statPoints")}</span> ·{" "}
              <span>{t("hero.statVerified")}</span> <span>{t("hero.statVerifiedVal")}</span>
            </p>
          </div>
        </div>
        <a className="scroll-arrow" href="#map" aria-label="Scroll to map">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M12 4v16M5 13l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      <section className="map-section full" id="map">
        <div className="map-grid">
          <div className="lmap" id="lmap" role="region" aria-label="Map">
            <div ref={mapEl} className="ymap" />
          </div>
          <aside className="places">
            <div className="places-scroll">
              <h2>{t("map.title")}</h2>
              <p className="places-sub">{t("map.sub")}</p>
              <div id="places">
                {groups.map((g) => (
                  <div className="pg" key={g.name}>
                    <h3>{g.name}</h3>
                    {g.items.map((p) => (
                      <Link
                        key={p.id}
                        className={`place ${activeId === p.id ? "active" : ""}`}
                        data-id={p.id}
                        to="/point"
                        search={{ p: p.id }}
                        onClick={(e) => {
                          if (mapRef.current) {
                            e.preventDefault();
                            setActiveId(p.id);
                            document.getElementById("lmap")?.scrollIntoView({ block: "start", behavior: "smooth" });
                          }
                        }}
                        onMouseEnter={() => setPreviewId(p.id)}
                        onMouseLeave={() => setPreviewId(null)}
                        onFocus={() => setPreviewId(p.id)}
                        onBlur={() => setPreviewId(null)}
                      >
                        <span className="n">{POINTS.indexOf(p) + 1}</span>
                        <span className="pa">
                          {tr(p.address)}
                          <small>{tr(p.hours)}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section mission" id="mission">
        <h2>{t("mission.title")}</h2>
        <p>{t("mission.text")}</p>
      </section>

      <section className="section faq-wide" id="faq">
        <h2>{t("faq.title")}</h2>
        <FaqList />
      </section>
    </>
  );
}
