import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { I18N } from "./i18n";
import { ACCEPT_LABELS } from "./data";

// ---------- Config ----------
export const CONFIG = {
  // Where feedback / "was this useful" answers are POSTed as JSON. Empty = store in the browser only (prototype).
  feedbackEndpoint: "",
  // Yandex.Metrica counter id, e.g. 12345678. Empty = no analytics.
  metrikaId: "",
  defaultLang: "ru",
};

type Lang = "ru" | "en";

const NAV = [
  { to: "/", hash: "map", key: "nav.map", page: "index" },
  { to: "/guide", key: "nav.guide", page: "guide" },
  { to: "/faq", key: "nav.faq", page: "faq" },
  { to: "/why", key: "nav.why", page: "why" },
  { to: "/volunteer", key: "nav.volunteer", page: "volunteer" },
  { to: "/about", key: "nav.about", page: "about" },
  { to: "/feedback", key: "nav.feedback", page: "feedback" },
] as const;

const LangCtx = createContext<{ lang: Lang; toggle: () => void }>({ lang: "ru", toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(CONFIG.defaultLang as Lang);
  useEffect(() => {
    const s = localStorage.getItem("lang");
    if (s === "ru" || s === "en") setLang(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const toggle = () => {
    const n: Lang = lang === "ru" ? "en" : "ru";
    localStorage.setItem("lang", n);
    setLang(n);
  };
  return <LangCtx.Provider value={{ lang, toggle }}>{children}</LangCtx.Provider>;
}

export function useI18n() {
  const { lang, toggle } = useContext(LangCtx);
  const t = (path: string): any =>
    path.split(".").reduce((o: any, k) => (o ? o[k] : undefined), I18N[lang]);
  const tr = (obj: any): any =>
    obj && typeof obj === "object" && !Array.isArray(obj) ? (obj[lang] ?? obj.ru) : obj;
  return { lang, toggle, t, tr };
}

export function pageFromPath(pathname: string) {
  const p = pathname.replace(/^\/+|\/+$/g, "");
  return p === "" ? "index" : p;
}

// ---------- Header / footer (shared by every page) ----------
function NavLinks({ page }: { page: string }) {
  const { t } = useI18n();
  return (
    <>
      {NAV.map((n) => (
        <Link
          key={n.key}
          to={n.to}
          hash={"hash" in n ? n.hash : undefined}
          className={n.page === page ? "active" : ""}
          activeProps={{}}
        >
          {t(n.key)}
        </Link>
      ))}
    </>
  );
}

export function Header() {
  const { t, lang, toggle } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const page = pageFromPath(pathname);
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <div id="hdr">
      <a className="announce" href="https://dobro.ru/event/11840898" target="_blank" rel="noopener">
        <span className="announce-dot"></span>
        <span>{t("announce")}</span>
        <span className="announce-arrow">↗</span>
      </a>
      <header className="header">
        <Link className="brand" to="/">
          <span className="brand-icon">🔋</span>
          <span className="brand-name">{t("siteName")}</span>
        </Link>
        <nav className="nav">
          <NavLinks page={page} />
        </nav>
        <button className="lang-toggle" type="button" aria-label="Switch language" onClick={toggle}>
          {lang === "ru" ? "EN" : "RU"}
        </button>
        <button
          className="menu-btn"
          id="menuBtn"
          type="button"
          aria-label="Menu"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
      <div className="menu" id="menu" hidden={!open}>
        <NavLinks page={page} />
        <div className="menu-soon">
          <span>{t("menu.account")}</span>
          <span className="soon">{t("menu.soon")}</span>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <div id="ftr">
      <footer className="footer">
        <p>
          <strong>{t("siteName")}</strong> · <span>{t("footer.proto")}</span>
        </p>
        <p>
          <span>{t("footer.links")}</span> · <a href="/CREDITS.md">{t("footer.credits")}</a>
        </p>
      </footer>
    </div>
  );
}

// ---------- Helpers ----------
export function Tags({ p }: { p: any }) {
  const { tr, lang } = useI18n();
  return (
    <>
      {p.accepts.map((k: string) => (
        <span key={k} className="tag">
          {tr(ACCEPT_LABELS[k])}
        </span>
      ))}
      {p.accepts.length === 1 && p.accepts[0] === "rechargeable" ? (
        <span className="tag warn">{lang === "ru" ? "только аккумуляторы" : "rechargeable only"}</span>
      ) : null}
    </>
  );
}

// ---------- Transport + analytics ----------
export function send(payload: unknown) {
  if (!CONFIG.feedbackEndpoint) return;
  fetch(CONFIG.feedbackEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
export function track(name: string, params: unknown) {
  const ym = (window as any).ym;
  if (CONFIG.metrikaId && ym) ym(CONFIG.metrikaId, "reachGoal", name, params);
}

export const DESCRIPTION =
  "Проверенные пункты приёма батареек в Чертаново: адреса, часы работы, что принимают и как найти вход.";
export const pageHead = (title: string) => ({
  meta: [
    { title },
    { name: "description", content: DESCRIPTION },
    { property: "og:title", content: title },
    { property: "og:description", content: DESCRIPTION },
  ],
});
