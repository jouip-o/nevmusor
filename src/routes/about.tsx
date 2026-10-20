import { createFileRoute } from "@tanstack/react-router";
import { pageHead, useI18n } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => pageHead("О проекте — Не в мусор"),
  component: About,
});

function About() {
  const { t } = useI18n();
  return (
    <>
      <div className="page-hero full no-photo">
        <h1>{t("about.title")}</h1>
      </div>
      <section className="section page-top narrow">
        <p>{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
        <p>{t("about.p3")}</p>
      </section>
    </>
  );
}
