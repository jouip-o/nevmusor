import { createFileRoute } from "@tanstack/react-router";
import { pageHead, useI18n } from "@/lib/site";

export const Route = createFileRoute("/volunteer")({
  head: () => pageHead("Волонтёрам — Сдай батарейку"),
  component: Volunteer,
});

function Volunteer() {
  const { t } = useI18n();
  return (
    <>
      <div className="page-hero full">
        <img src="/img/volunteer.jpg" alt="" width="1600" height="685" />
        <h1>{t("vol.title")}</h1>
      </div>
      <section className="section page-top event-wide">
        <p className="muted">{t("vol.sub")}</p>
        <div className="events" id="events">
          {t("vol.events").map((e: any) => (
            <article className="event" key={e.name}>
              <a className="event-img" href={e.url} target="_blank" rel="noopener">
                <img src="/img/box-yellow.jpg" alt="" loading="lazy" />
              </a>
              <div className="event-body">
                <div className="fmt">{e.format}</div>
                <h3>
                  <a href={e.url} target="_blank" rel="noopener">{e.name}</a>
                </h3>
                <p>{e.desc}</p>
                <div className="meta">
                  {e.hours}
                  <br />
                  {e.who}
                </div>
                <a className="btn btn-primary event-cta" href={e.url} target="_blank" rel="noopener">
                  {e.cta} ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
