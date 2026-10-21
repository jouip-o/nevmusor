import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { initializeAccountSession } from "./account-session";

// Session persists in browser storage, so people stay signed in after closing the site.
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState(false);
  useEffect(() => {
    let active = true;
    let changed = false;
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!active) return;
      if (_e !== "INITIAL_SESSION") changed = true;
      setUser(session?.user ?? null);
      if (session?.user) { setLinkError(false); setReady(true); }
    });
    initializeAccountSession().then((result) => {
      if (!active) return;
      if (!changed) { setUser(result.user ?? null); setLinkError(result.linkError); }
      setReady(true);
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);
  return { user, ready, linkError };
}

export function useFavorites(userId: string | undefined) {
  const [ids, setIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setIds([]);
    setReady(false);
    setError("");
    if (!userId) { setReady(true); return; }
    supabase
      .from("favorites")
      .select("point_id")
      .eq("user_id", userId)
      .then(({ data, error: readError }) => {
        if (!active) return;
        if (readError) setError(readError.message);
        else setIds((data ?? []).map((r) => r.point_id));
        setReady(true);
      });
    return () => { active = false; };
  }, [userId]);
  const toggle = async (pointId: string) => {
    if (!userId || busy || !ready) return;
    setBusy(true);
    setError("");
    const saved = ids.includes(pointId);
    try {
      const { error: writeError } = saved
        ? await supabase.from("favorites").delete().eq("user_id", userId).eq("point_id", pointId)
        : await supabase.from("favorites").insert({ user_id: userId, point_id: pointId });
      if (writeError) { setError(writeError.message); return; }
      setIds((current) => saved ? current.filter((x) => x !== pointId) : [...current, pointId]);
    } catch {
      setError("Unable to save favourite");
    } finally {
      setBusy(false);
    }
  };
  return { ids, toggle, busy, ready, error };
}
