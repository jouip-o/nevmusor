const KEY = "ref_code";

export function pendingReferral() {
  try {
    const code = localStorage.getItem(KEY);
    return code && /^[a-z0-9]{4,32}$/i.test(code) ? code : null;
  } catch { return null; }
}

export function captureReferral(href: string) {
  const code = new URL(href).searchParams.get("ref");
  if (!code || !/^[a-z0-9]{4,32}$/i.test(code)) return;
  try { localStorage.setItem(KEY, code); } catch { /* Referral storage must not block sign-in. */ }
}

export function clearReferral(code: string) {
  try {
    if (pendingReferral() === code) localStorage.removeItem(KEY);
  } catch { /* Sign-in remains available when storage is restricted. */ }
}

export function accountEmailRedirect(origin: string) {
  const url = new URL("/account", origin);
  const code = pendingReferral();
  if (code) url.searchParams.set("ref", code);
  return url.href;
}