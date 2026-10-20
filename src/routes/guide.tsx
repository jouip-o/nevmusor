import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead, useI18n } from "@/lib/site";

export const Route = createFileRoute("/guide")({
  head: () => pageHead("Что принимают — Не в мусор"),
  component: Guide,
});

function Guide() {
  const { t } = useI18n();
  const li = (k: string) => t(k).map((i: string) => <li key={i}>{i}</li>);
  return (
    <>
      <div className="page-hero full">
        <img src="/img/guide.jpg" alt="" width="1600" height="685" />
        <h1>{t("guide.title")}</h1>
      </div>
      <section className="section page-top narrow">
        <div className="two-col">
          <div className="card-plain ok">
            <h3>{t("guide.yesTitle")}</h3>
            <ul id="guideYes">{li("guide.yes")}</ul>
          </div>
          <div className="card-plain no">
            <h3>{t("guide.noTitle")}</h3>
            <ul id="guideNo">{li("guide.no")}</ul>
          </div>
        </div>
        <div className="prep">
          <div>
            <h2 className="mt">{t("prep.title")}</h2>
            <ol className="steps" id="prepList">{li("prep.items")}</ol>
          </div>
        </div>
        <div className="callout">
          <strong>{t("bonus.title")}</strong>
          <p>{t("bonus.text")}</p>
        </div>
        <p className="mt">
          <Link className="btn btn-primary" to="/" hash="map">{t("hero.cta")}</Link>
        </p>
      </section>
    </>
  );
}
