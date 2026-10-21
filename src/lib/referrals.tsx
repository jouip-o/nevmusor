import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { captureReferral, clearReferral, pendingReferral } from "./referral-storage";
import { useRouterState } from "@tanstack/react-router";

/** Remember ?ref=CODE from any landing page. */
export function useCaptureReferral() {
  const href = useRouterState({ select: (state) => state.location.href });
  useEffect(() => {
    captureReferral(window.location.href);
  }, [href]);
}

type Stat = { user_id: string; email: string; display_name: string | null; referral_code: string | null; referred_count: number };

export function Referrals({ userId, ru }: { userId: string; ru: boolean }) {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const pending = pendingReferral();
    if (pending) supabase.rpc("claim_referral", { _code: pending }).then(({ error }) => {
      if (!error) clearReferral(pending);
    });
    supabase.from("profiles").select("referral_code").eq("id", userId).maybeSingle()
      .then(({ data }) => setCode(data?.referral_code ?? ""));
    supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setIsAdmin(true);
        supabase.rpc("admin_referral_stats").then(({ data: s }) => setStats((s as Stat[]) ?? []));
      });
  }, [userId]);

  const link = code ? `${window.location.origin}/?ref=${code}` : "";
  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <h2>{ru ? "Пригласить друзей" : "Invite friends"}</h2>
      <p className="acc-note">{ru ? "Ваша личная ссылка — поделитесь ей:" : "Your personal link — share it:"}</p>
      <div className="acc-form acc-ref">
        <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} aria-label={ru ? "Реферальная ссылка" : "Referral link"} />
        <button type="button" className="btn btn-primary" onClick={copy} disabled={!link}>{copied ? (ru ? "Скопировано ✓" : "Copied ✓") : ru ? "Копировать" : "Copy"}</button>
      </div>
      {isAdmin ? (
        <div className="acc-admin">
          <h2>{ru ? "Админ: приглашения" : "Admin: referrals"}</h2>
          <table>
            <thead><tr><th>{ru ? "Пользователь" : "User"}</th><th>{ru ? "Привёл" : "Brought"}</th></tr></thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.user_id}><td>{s.display_name ? `${s.display_name} — ` : ""}{s.email}</td><td>{s.referred_count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
