import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { POINTS } from "@/lib/data";
import { pageHead, useI18n } from "@/lib/site";
import { useFavorites, useUser } from "@/lib/account";

export const Route = createFileRoute("/account")({
  head: () =>
    pageHead(
      "Личный кабинет — Сдай батарейку",
      "Вход по коду из письма и избранные пункты приёма батареек в Чертаново.",
    ),
  component: AccountPage,
});

function AccountPage() {
  const { user, ready } = useUser();
  if (!ready) return <section className="section narrow account" />;
  return (
    <section className="section narrow account">
      {user ? <Profile userId={user.id} email={user.email ?? ""} /> : <SignIn />}
    </section>
  );
}

function SignIn() {
  const { lang } = useI18n();
  const ru = lang === "ru";
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"enter" | "code">("enter");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true, emailRedirectTo: window.location.origin + "/account" },
    });
    setBusy(false);
    if (error) return setErr(error.message);
    setStep("code");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: "email" });
    setBusy(false);
    if (error) setErr(ru ? "Неверный или устаревший код" : "Wrong or expired code");
  };

  return (
    <>
      <h1>{ru ? "Вход и регистрация" : "Sign in or register"}</h1>
      <p>{ru ? "Без пароля — мы пришлём код." : "No password — we'll send you a code."}</p>
      <div className="rate-row">
        <button type="button" className={`rate-btn ${method === "email" ? "active" : ""}`} onClick={() => setMethod("email")}>
          Email
        </button>
        <button type="button" className={`rate-btn ${method === "phone" ? "active" : ""}`} onClick={() => setMethod("phone")}>
          {ru ? "Телефон" : "Phone"}
        </button>
      </div>
      {method === "phone" ? (
        <p className="acc-note">
          {ru ? "Вход по номеру телефона скоро появится. Пока используйте email." : "Phone sign-in is coming soon. Please use email for now."}
        </p>
      ) : step === "enter" ? (
        <form className="acc-form" onSubmit={sendCode}>
          <label>
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <button className="btn btn-primary" disabled={busy}>{ru ? "Получить код" : "Send code"}</button>
        </form>
      ) : (
        <form className="acc-form" onSubmit={verify}>
          <p>{ru ? `Мы отправили письмо на ${email}. Введите код из письма или нажмите ссылку в нём.` : `We emailed ${email}. Enter the code or tap the link in the email.`}</p>
          <label>
            {ru ? "Код" : "Code"}
            <input inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          <button className="btn btn-primary" disabled={busy}>{ru ? "Войти" : "Sign in"}</button>
          <button type="button" className="back" onClick={() => { setStep("enter"); setCode(""); }}>
            ← {ru ? "Другой email" : "Different email"}
          </button>
        </form>
      )}
      {err ? <p className="acc-err">{err}</p> : null}
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
