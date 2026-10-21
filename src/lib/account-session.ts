import { supabase } from "@/integrations/supabase/client";
import { captureReferral } from "./referral-storage";

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
    accessToken: get("access_token"),
    refreshToken: get("refresh_token"),
    code: get("code"),
    type: emailTypes.find((value) => value === type) as EmailType | undefined,
  };
}

let pending: ReturnType<typeof initialize> | undefined;
let lastCallback = "";

async function initialize() {
  captureReferral(window.location.href);
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
  // The SDK only reads callback tokens when its client is first created. An
  // email link can also return to an already-running SPA in the same tab.
  await supabase.auth.getUser();
  const remaining = readAccountCallback(window.location.href);
  if (!callback.failed && remaining.accessToken && remaining.refreshToken) {
    const { error } = await supabase.auth.setSession({ access_token: remaining.accessToken, refresh_token: remaining.refreshToken });
    callbackFailed = Boolean(error);
  } else if (!callback.failed && remaining.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(remaining.code);
    callbackFailed = Boolean(error);
  }
  const { data, error } = await supabase.auth.getUser();
  if (callback.failed || callback.tokenHash) {
    const url = new URL(window.location.href);
    for (const key of ["error", "error_code", "error_description", "token_hash", "type"]) url.searchParams.delete(key);
    if (callback.failed) url.hash = "";
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }
  if (callback.accessToken || callback.code) {
    const url = new URL(window.location.href);
    for (const key of ["access_token", "refresh_token", "expires_in", "expires_at", "token_type", "type", "code"]) url.searchParams.delete(key);
    if (callback.accessToken) url.hash = "";
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }
  return { user: data.user, linkError: !data.user && (callbackFailed || Boolean(error && callback.tokenHash)) };
}

// All account/map consumers share one callback exchange, including remounts.
export function initializeAccountSession() {
  const callback = readAccountCallback(window.location.href);
  const identity = callback.tokenHash || callback.accessToken || callback.code || (callback.failed ? "failed" : "");
  if (identity && identity !== lastCallback) {
    lastCallback = identity;
    pending = undefined;
  }
  pending ??= initialize().catch(() => ({ user: null, linkError: true }));
  return pending.then(async (result) => {
    // Revalidate on later page mounts rather than reusing a cached signed-in user
    // after sign-out or an account switch.
    const { data } = await supabase.auth.getUser();
    return { user: data.user, linkError: !data.user && result.linkError };
  });
}