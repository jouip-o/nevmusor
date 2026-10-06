import { useI18n } from "./site";

export function FaqList() {
  const { t } = useI18n();
  return (
    <div className="faq" id="faqList">
      {t("faq.items").map((f: any) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
