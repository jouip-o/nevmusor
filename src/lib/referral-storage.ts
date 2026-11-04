const KEY = "ref_code";
const PUBLIC_ORIGIN = "https://nevmusor.site";

function emailReturnOrigin(origin: string) {
  const { hostname } = new URL(origin);
  const editorZone = ["lovable.app", "lovableproject.com", "lovableproject-dev.com", "gpt-eng.com", "gptengineer.run"]
    .some((zone) => hostname.endsWith(`.${zone}`));
  const previewHost = /^(?:id-preview(?:-[a-z0-9]+)?--|project--|preview--|[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?:[.-]|$))/i.test(hostname);
  // Editor previews require a Lovable account; visitor email links must not land there.
  return editorZone && previewHost ? PUBLIC_ORIGIN : origin;
}

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

// Email links land on the site root ("/?to=account") because plain static hosts
// (e.g. nginx without an SPA fallback) only serve index.html at "/"; the app then
// moves the visitor to /account in the browser, keeping the sign-in tokens.
export function accountEmailRedirect(origin: string) {
  const url = new URL("/", emailReturnOrigin(origin));
  url.searchParams.set("to", "account");
  const code = pendingReferral();
  if (code) url.searchParams.set("ref", code);
  return url.href;
}

export function accountReturnPath(href: string) {
  const url = new URL(href);
  if (url.pathname !== "/" || url.searchParams.get("to") !== "account") return null;
  url.searchParams.delete("to");
  return `/account${url.search}${url.hash}`;
}