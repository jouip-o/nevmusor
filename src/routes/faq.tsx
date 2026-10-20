import { createFileRoute } from "@tanstack/react-router";
import { pageHead, useI18n } from "@/lib/site";
import { FaqList } from "@/lib/faq";

export const Route = createFileRoute("/faq")({
  head: () => pageHead("Вопросы — Не в мусор"),
  component: Faq,
});

function Faq() {
  const { t } = useI18n();
  return (
    <>
      <div className="page-hero full no-photo">
        <h1>{t("faq.title")}</h1>
      </div>
      <section className="section page-top narrow">
        <FaqList />
      </section>
    </>
  );
}
