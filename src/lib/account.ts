import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Session persists in browser storage, so people stay signed in after closing the site.
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    supabase.auth.getUser().then(({ data: d }) => {
      setUser(d.user ?? null);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return { user, ready };
}

export function useFavorites(userId: string | undefined) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    if (!userId) return setIds([]);
    supabase
      .from("favorites")
      .select("point_id")
      .then(({ data }) => setIds((data ?? []).map((r) => r.point_id)));
  }, [userId]);
  const toggle = async (pointId: string) => {
    if (!userId) return;
    if (ids.includes(pointId)) {
      setIds(ids.filter((x) => x !== pointId));
      await supabase.from("favorites").delete().eq("point_id", pointId);
    } else {
      setIds([...ids, pointId]);
      await supabase.from("favorites").insert({ user_id: userId, point_id: pointId });
    }
  };
  return { ids, toggle };
}
