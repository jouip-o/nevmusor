import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead, useI18n } from "@/lib/site";

export const Route = createFileRoute("/why")({
  head: () => pageHead("Почему это важно — Не в мусор"),
  component: Why,
});

function Why() {
  const { t } = useI18n();
  const li = (k: string) => t(k).map((i: string) => <li key={i}>{i}</li>);
  return (
    <>
      <div className="page-hero full">
        <img src="/img/why.jpg" alt="" width="1600" height="685" />
        <h1>{t("problem.title")}</h1>
      </div>
      <section className="section page-top narrow">
        <ul className="bullets" id="problemList">{li("problem.items")}</ul>
        <h2 className="mt">{t("why.title")}</h2>
        <ul className="bullets checks" id="whyList">{li("why.items")}</ul>
        <p className="mt">
          <Link className="btn btn-primary" to="/" hash="map">{t("hero.cta")}</Link>
        </p>
      </section>
    </>
  );
}
