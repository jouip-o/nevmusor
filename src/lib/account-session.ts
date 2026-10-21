import { supabase } from "@/integrations/supabase/client";

const emailTypes = ["email", "signup", "magiclink", "recovery", "invite", "email_change"] as const;
type EmailType = (typeof emailTypes)[number];

export function readAccountCallback(href: string) {
  const url = new URL(href);
  const hash = new URLSearchParams(url.hash.slice(1));
  const get = (key: string) => url.searchParams.get(key) ?? hash.get(key);
  const type = get("type");
  return {
    failed: Boolean(get("error") || get("error_code") || get("error_description")),
    tokenHash: get("token_hash"),
    type: emailTypes.find((value) => value === type) as EmailType | undefined,
  };
}

let pending: ReturnType<typeof initialize> | undefined;

async function initialize() {
  const callback = readAccountCallback(window.location.href);
  let callbackFailed = callback.failed;
  if (!callback.failed && callback.tokenHash) {
    if (callback.type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash: callback.tokenHash, type: callback.type });
      callbackFailed = Boolean(error);
    } else callbackFailed = true;
  }
  // getUser waits for the SDK's implicit/PKCE callback initialization and validates
  // the session. Never clear those callback parameters before it finishes.
  const { data, error } = await supabase.auth.getUser();
  if (callback.failed || callback.tokenHash) {
    const url = new URL(window.location.href);
    for (const key of ["error", "error_code", "error_description", "token_hash", "type"]) url.searchParams.delete(key);
    if (callback.failed) url.hash = "";
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }
  return { user: data.user, linkError: !data.user && (callbackFailed || Boolean(error && callback.tokenHash)) };
}

// All account/map consumers share one callback exchange, including remounts.
export function initializeAccountSession() {
  pending ??= initialize().catch(() => ({ user: null, linkError: true }));
  return pending.then(async (result) => {
    // Revalidate on later page mounts rather than reusing a cached signed-in user
    // after sign-out or an account switch.
    const { data } = await supabase.auth.getUser();
    return { user: data.user, linkError: !data.user && result.linkError };
  });
}