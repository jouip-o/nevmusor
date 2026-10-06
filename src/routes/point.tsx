import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KIND_LABELS, POINTS } from "@/lib/data";
import { pageHead, send, Tags, track, useI18n } from "@/lib/site";

export const Route = createFileRoute("/point")({
  validateSearch: (s: Record<string, unknown>): { p?: string } => ({
    p: typeof s.p === "string" ? s.p : s.p != null ? String(s.p) : undefined,
  }),
  head: () => pageHead("Пункт приёма — Сдай батарейку"),
  component: PointPage,
});

function PointPage() {
  const { t, tr } = useI18n();
  const { p: id } = Route.useSearch();
  const p = POINTS.find((x: any) => x.id === id);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!p) return;
    setSaved(JSON.parse(localStorage.getItem("rate:" + p.id) || "{}"));
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
  const slots = [
    { src: p.photos.building, cap: t("detail.photoBuilding") },
    { src: p.photos.entrance, cap: t("detail.photoEntrance") },
    { src: p.photos.point, cap: t("detail.photoPoint") },
    ...(p.photos.more || []).map((src: string, i: number) => ({ src, cap: `${t("detail.photoMore")} ${i + 1}` })),
  ];
  const gal = (s: any, i: number, cls: string) =>
    s.src ? (
      <figure className={cls} key={i}>
        <img src={s.src} alt={s.cap} loading="lazy" />
        <figcaption>{s.cap}</figcaption>
      </figure>
    ) : (
      <figure className={cls} key={i}>
        <div className={`ph ph-${(i % 4) + 1}`}>
          <span className="ph-icon">{["🏬", "🚪", "🔋", "📷"][Math.min(i, 3)]}</span>
          <span className="ph-txt">{t("detail.photoSoon")}</span>
        </div>
        <figcaption>{s.cap}</figcaption>
      </figure>
    );

  const rate = (q: string, v: boolean) => {
    const next = { ...saved, [q]: v };
    localStorage.setItem("rate:" + p.id, JSON.stringify(next));
    send({ kind: "rating", point: p.id, ...next });
    track("rating", { id: p.id, q, v: String(v) });
    setSaved(next);
  };
  const rb = (q: string, v: boolean, label: string) => (
    <button type="button" className={`rate-btn ${saved[q] === v ? "active" : ""}`} data-q={q} data-v={String(v)} onClick={() => rate(q, v)}>
      {label}
    </button>
  );

  return (
    <div id="detailBody">
      <div className="page-hero full point-hero">
        {slots[0].src ? (
          <img src={slots[0].src} alt="" />
        ) : (
          <div className={`ph ph-${(POINTS.indexOf(p) % 4) + 1}`}>
            <span className="ph-icon">🏬</span>
            <span className="ph-txt">{t("detail.photoSoon")}</span>
          </div>
        )}
        <div className="page-hero-text">
          <span className="pill">{tr(KIND_LABELS[p.kind])}</span>
          <h1>{tr(p.name)}</h1>
          <p>{tr(p.address)}</p>
        </div>
      </div>
      <div className="detail-body narrow">
        <p className="detail-bar">
          <Link className="back" to="/" hash="map">← {t("detail.back")}</Link>
        </p>
        <div className="g-strip">{slots.slice(1).map((s, i) => gal(s, i + 1, "g-thumb"))}</div>
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
        <div className="rate" id="rate">
          <p>{t("detail.usefulQ")}</p>
          <div className="rate-row">
            {rb("useful", true, `👍 ${t("detail.yes")}`)}
            {rb("useful", false, `👎 ${t("detail.no")}`)}
          </div>
          <p>{t("detail.planQ")}</p>
          <div className="rate-row">
            {rb("plan", true, t("detail.planYes"))}
            {rb("plan", false, t("detail.planNo"))}
          </div>
          <p className="thanks" hidden={!Object.keys(saved).length}>{t("detail.thanks")}</p>
        </div>
      </div>
    </div>
  );
}
