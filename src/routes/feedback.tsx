import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { pageHead, send, track, useI18n } from "@/lib/site";

export const Route = createFileRoute("/feedback")({
  head: () => pageHead("Обратная связь — Сдай батарейку"),
  component: Feedback,
});

function Feedback() {
  const { t, lang } = useI18n();
  const [note, setNote] = useState<{ key: string; err: boolean } | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const el = f.elements as any;
    const msg = el.message.value.trim();
    if (!msg) {
      setNote({ key: "fb.empty", err: true });
      return;
    }
    const payload = {
      kind: "feedback",
      type: el.type.value,
      message: msg,
      contact: el.contact.value.trim(),
      recycled: el.recycled.checked,
      lang,
      at: new Date().toISOString(),
    };
    send(payload);
    const all = JSON.parse(localStorage.getItem("feedback") || "[]");
    all.push(payload);
    localStorage.setItem("feedback", JSON.stringify(all));
    track("feedback", { type: el.type.value, recycled: el.recycled.checked });
    f.reset();
    setNote({ key: "fb.thanks", err: false });
  };

  return (
    <>
      <div className="page-hero full">
        <img src="/img/box-yellow.jpg" alt="" width="900" height="675" />
        <h1>{t("fb.title")}</h1>
      </div>
      <section className="section page-top narrow">
        <p className="muted">{t("fb.sub")}</p>
        <form className="form" id="feedbackForm" noValidate onSubmit={onSubmit}>
          <label>
            <span>{t("fb.type")}</span>
            <select name="type" id="fbType">
              {t("fb.types").map((x: string) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{t("fb.message")}</span>
            <textarea name="message" rows={4} required></textarea>
          </label>
          <label>
            <span>{t("fb.contact")}</span>
            <input name="contact" type="text" autoComplete="off" />
          </label>
          <label className="check">
            <input name="recycled" type="checkbox" />
            <span>{t("fb.recycled")}</span>
          </label>
          <button className="btn btn-primary" type="submit">{t("fb.send")}</button>
          <p className={note?.err ? "form-note err" : "form-note"} id="fbNote" hidden={!note}>
            {note ? t(note.key) : ""}
          </p>
        </form>
      </section>
    </>
  );
}
