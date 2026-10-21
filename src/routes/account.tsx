import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { POINTS } from "@/lib/data";
import { pageHead, useI18n } from "@/lib/site";
import { useFavorites, useUser } from "@/lib/account";
import { Button } from "@/components/ui/button";
import { BatteryStats } from "@/lib/battery-stats";
import { Referrals } from "@/lib/referrals";
import { accountEmailRedirect } from "@/lib/referral-storage";

export const Route = createFileRoute("/account")({
  head: () =>
    pageHead(
      "Личный кабинет — Не в мусор",
      "Вход по ссылке из письма и избранные пункты приёма батареек в Чертаново.",
    ),
  component: AccountPage,
});

function AccountPage() {
  const { user, ready, linkError } = useUser();
  if (!ready) return <section className="section narrow account" />;
  return (
    <section className="section narrow account">
      {user ? <Profile userId={user.id} email={user.email ?? ""} /> : <SignIn linkError={linkError} />}
    </section>
  );
}

function SignIn({ linkError }: { linkError: boolean }) {
  const { lang } = useI18n();
  const ru = lang === "ru";
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"enter" | "sent">("enter");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true, emailRedirectTo: accountEmailRedirect(window.location.origin) },
      });
      if (error) return setErr(ru ? "Не удалось отправить письмо. Попробуйте чуть позже." : "Unable to send the email. Please try again shortly.");
      setStep("sent");
    } catch {
      setErr(ru ? "Нет соединения. Попробуйте ещё раз." : "Connection failed. Please try again.");
    } finally { setBusy(false); }
  };

  return (
    <>
      <h1>{ru ? "Вход и регистрация" : "Sign in or register"}</h1>
      <p>{ru ? "Без пароля — мы пришлём ссылку для входа на email." : "No password — we'll email you a sign-in link."}</p>
      {linkError && step === "enter" ? <p className="acc-err" role="alert">{ru ? "Ссылка уже использована или устарела. Запросите новое письмо для входа." : "This link has already been used or has expired. Request a new sign-in email."}</p> : null}
      {step === "enter" ? (
        <form className="acc-form" onSubmit={sendLink}>
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <Button type="submit" className="btn btn-primary" disabled={busy}>{busy ? (ru ? "Отправляем…" : "Sending…") : ru ? "Получить ссылку" : "Send sign-in link"}</Button>
        </form>
      ) : (
        <div className="acc-form">
          <p role="status">{ru ? `Мы отправили письмо на ${email.trim()}. Нажмите ссылку в письме, чтобы войти.` : `We emailed ${email.trim()}. Tap the link in the email to sign in.`}</p>
          <p>{ru ? "Откройте самое новое письмо. Ссылка работает только один раз; вход откроется в том браузере, где вы её нажмёте." : "Open the newest email. The link works once; you will be signed in in the browser where you open it."}</p>
          <form onSubmit={sendLink}>
            <Button type="submit" className="btn btn-primary" disabled={busy}>{busy ? (ru ? "Отправляем…" : "Sending…") : ru ? "Отправить новую ссылку" : "Send a new link"}</Button>
          </form>
          <Button type="button" variant="link" className="back" onClick={() => { setStep("enter"); setErr(""); }}>
            ← {ru ? "Другой email" : "Different email"}
          </Button>
        </div>
      )}
      {err ? <p className="acc-err" role="alert">{err}</p> : null}
    </>
  );
}

function Profile({ userId, email }: { userId: string; email: string }) {
  const { lang, tr } = useI18n();
  const ru = lang === "ru";
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const { ids, toggle } = useFavorites(userId);

  useEffect(() => {
    supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle()
      .then(({ data }) => setName(data?.display_name ?? ""));
  }, [userId]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("profiles").upsert({ id: userId, display_name: name.trim() || null, updated_at: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const favs = POINTS.filter((p: any) => ids.includes(p.id));
  return (
    <>
      <h1>{name ? (ru ? `Привет, ${name}!` : `Hi, ${name}!`) : ru ? "Личный кабинет" : "My account"}</h1>
      <p>{email}</p>
      <form className="acc-form" onSubmit={save}>
        <label>
          {ru ? "Имя" : "Name"}
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
        </label>
        <button className="btn btn-primary">{saved ? (ru ? "Сохранено ✓" : "Saved ✓") : ru ? "Сохранить" : "Save"}</button>
      </form>
      <BatteryStats userId={userId} ru={ru} />
      <Referrals userId={userId} ru={ru} />
      <h2>{ru ? "Избранные пункты" : "Favourite points"}</h2>
      {favs.length ? (
        <ul className="acc-favs">
          {favs.map((p: any) => (
            <li key={p.id}>
              <Link to="/point" search={{ p: p.id }}>{tr(p.name)}</Link> — {tr(p.address)}
              <button type="button" className="back" onClick={() => toggle(p.id)}>✕</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="acc-note">{ru ? "Пока пусто. Нажмите ☆ на странице пункта, чтобы сохранить его." : "Nothing yet. Tap ☆ on a point's page to save it."}</p>
      )}
      <button type="button" className="btn" onClick={() => supabase.auth.signOut()}>
        {ru ? "Выйти" : "Sign out"}
      </button>
    </>
  );
}
