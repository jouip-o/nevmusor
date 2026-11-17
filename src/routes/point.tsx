import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { KIND_LABELS, POINTS } from "@/lib/data";
import { pageHead, Tags, track, useI18n } from "@/lib/site";

export const Route = createFileRoute("/point")({
  validateSearch: (s: Record<string, unknown>): { p?: string } => {
    const v = s["p"];
    return v == null ? {} : { p: String(v) };
  },
  head: () => pageHead("Пункт приёма — Не в мусор"),
  component: PointPage,
});

function PointPage() {
  const { t, tr } = useI18n();
  const { p: id } = Route.useSearch();
  const p = POINTS.find((x: any) => x.id === id);

  useEffect(() => {
    if (!p) return;
    track("point_view", { id });
  }, [id]);

  useEffect(() => {
    if (p) document.title = `${tr(p.name)}, ${tr(p.address)} — ${t("siteName")}`;
  });

  if (!p) {
    return (
      <div id="detailBody">
        <p>{t("detail.notFound")}</p>
        <p>
          <Link className="btn btn-primary" to="/" hash="map">{t("detail.back")}</Link>
        </p>
      </div>
    );
  }

  const yandex = `https://yandex.ru/maps/?pt=${p.lng},${p.lat}&z=17&l=map`;
  const building = p.photos.building;

  return (
    <div id="detailBody">
      <div className={`page-hero full point-hero${building ? "" : " no-photo"}`}>
        {building ? <img src={building} alt="" /> : null}
        <div className="page-hero-text">
          <span className="pill">{tr(KIND_LABELS[p.kind])}</span>
          <h1>{tr(p.name)}</h1>
          <p>{tr(p.address)}</p>
        </div>
      </div>
      <div className="detail-body narrow">
        <p className="detail-bar" style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
          <Link className="back" to="/" hash="map">← {t("detail.back")}</Link>
        </p>
        <div className="addr">
          <a href={yandex} target="_blank" rel="noopener">{t("detail.route")} ↗</a>
        </div>
        <div className="facts">
          <div className="fact"><div className="k">{t("detail.hours")}</div><div className="v">{tr(p.hours)}</div></div>
          <div className="fact"><div className="k">{t("detail.accepts")}</div><div className="tags"><Tags p={p} /></div></div>
          <div className="fact"><div className="k">{t("detail.limit")}</div><div className="v">{tr(p.limit)}</div></div>
          <div className="fact"><div className="k">{t("detail.bonus")}</div><div className="v">{tr(p.bonus)}</div></div>
          <div className="fact"><div className="k">{t("detail.contact")}</div><div className="v">{tr(p.contact)}</div></div>
          <div className="fact"><div className="k">{t("detail.verified")}</div><div className="v">{p.verified}</div></div>
        </div>
        <h2>{t("detail.howto")}</h2>
        <ol className="steps">
          {tr(p.access).map((s: string) => <li key={s}>{s}</li>)}
        </ol>
      </div>
    </div>
  );
}
