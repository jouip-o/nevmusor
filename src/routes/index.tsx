import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { POINTS } from "@/lib/data";
import { pageHead, useI18n } from "@/lib/site";
import { FaqList } from "@/lib/faq";

export const Route = createFileRoute("/")({
  head: () => pageHead("Сдай батарейку — Чертаново"),
  component: Index,
});

// Hotspots sit on the numbers baked into /img/map-screenshot.jpg,
// which was drawn with this same bounding box. If the image is regenerated, keep MAP_BBOX in sync.
const MAP_BBOX = { north: 55.65279803318956, south: 55.590763384885264, west: 37.529296875, east: 37.68310546875, w: 1792, h: 1280 };
const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 180 / 2));

function Index() {
  const { t, tr } = useI18n();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const hash = useRouterState({ select: (s) => s.location.hash });

  useEffect(() => {
    if (hash) document.getElementById(hash)?.scrollIntoView();
  }, [hash]);

  const setActive = (id: string) => setActiveId((cur) => (cur === id ? null : id));

  useEffect(() => {
    if (!activeId) return;
    const row = document.querySelector(`.place[data-id="${activeId}"]`);
    if (row) row.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".hot, .place")) setActiveId(null);
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

  const { north, south, west, east, h } = MAP_BBOX;
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
      <section className="hero full" id="top">
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
          <img className="hero-art" src="/img/hero-illustration.jpg" alt="" width="1254" height="1254" />
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
            <img src="/img/map-screenshot.jpg" alt={t("map.title")} width="1792" height="1280" />
            {POINTS.map((p: any, i: number) => {
              const x = ((p.lng - west) / (east - west)) * 100;
              const y = ((((merc(north) - merc(p.lat)) / (merc(north) - merc(south))) * h - 32) / h) * 100;
              const cls = ["hot", activeId === p.id ? "active" : "", previewId === p.id ? "preview" : ""].join(" ").trim();
              return (
                <button
                  key={p.id}
                  type="button"
                  className={cls}
                  data-id={p.id}
                  style={{ left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%` }}
                  aria-label={`${i + 1}. ${tr(p.name)}, ${tr(p.address)}`}
                  onClick={(e) => {
                    if ((e.target as Element).closest("a")) return;
                    setActive(p.id);
                  }}
                >
                  <span className="hot-tip">
                    <b>
                      {i + 1}. {tr(p.name)}
                    </b>
                    {tr(p.address)}
                    <span className="hot-more">
                      🕘 {tr(p.hours)}
                      <Link to="/point" search={{ p: p.id }}>
                        {t("map.details")} →
                      </Link>
                    </span>
                  </span>
                </button>
              );
            })}
            <span className="mcredit">© OpenStreetMap</span>
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
