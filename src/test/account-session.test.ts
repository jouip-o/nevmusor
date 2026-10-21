import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ getUser: vi.fn(), verifyOtp: vi.fn(), setSession: vi.fn(), exchangeCodeForSession: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth } }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  window.history.replaceState({}, "", "/account");
  auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
  auth.verifyOtp.mockResolvedValue({ error: null });
  auth.setSession.mockResolvedValue({ error: null });
  auth.exchangeCodeForSession.mockResolvedValue({ error: null });
  localStorage.clear();
});

describe("Account email callbacks", () => {
  it("recognizes expired one-use links and removes the error from the address", async () => {
    window.history.replaceState({}, "", "/account#error=access_denied&error_code=otp_expired");
    const { initializeAccountSession } = await import("@/lib/account-session");
    expect(await initializeAccountSession()).toEqual({ user: null, linkError: true });
    expect(window.location.hash).toBe("");
  });

  it("exchanges an email token once even when multiple consumers initialize", async () => {
    window.history.replaceState({}, "", "/account?token_hash=test-one-use-token&type=magiclink");
    auth.getUser.mockResolvedValue({ data: { user: { id: "account-owner" } }, error: null });
    const { initializeAccountSession } = await import("@/lib/account-session");
    const results = await Promise.all([initializeAccountSession(), initializeAccountSession()]);
    expect(auth.verifyOtp).toHaveBeenCalledTimes(1);
    expect(auth.verifyOtp).toHaveBeenCalledWith({ token_hash: "test-one-use-token", type: "magiclink" });
    expect(results[0].user?.id).toBe("account-owner");
    expect(window.location.search).toBe("");
  });

  it("does not discard an existing account session when a consumed link is reopened", async () => {
    window.history.replaceState({}, "", "/account#error_code=otp_expired");
    auth.getUser.mockResolvedValue({ data: { user: { id: "account-owner" } }, error: null });
    const { initializeAccountSession } = await import("@/lib/account-session");
    expect((await initializeAccountSession()).linkError).toBe(false);
  });

  it("leaves implicit tokens available until the standard client reads them", async () => {
    window.history.replaceState({}, "", "/account#access_token=test-token&refresh_token=test-refresh&type=signup");
    auth.getUser.mockImplementationOnce(async () => {
      expect(window.location.hash).toContain("access_token=test-token");
      window.history.replaceState({}, "", "/account");
      return { data: { user: { id: "account-owner" } }, error: null };
    });
    auth.getUser.mockResolvedValue({ data: { user: { id: "account-owner" } }, error: null });
    const { initializeAccountSession } = await import("@/lib/account-session");
    expect((await initializeAccountSession()).user?.id).toBe("account-owner");
    expect(auth.verifyOtp).not.toHaveBeenCalled();
    expect(auth.setSession).not.toHaveBeenCalled();
  });

  it("does not restore a cached user after signing out and returning to account", async () => {
    auth.getUser.mockResolvedValue({ data: { user: { id: "account-owner" } }, error: null });
    const { initializeAccountSession } = await import("@/lib/account-session");
    expect((await initializeAccountSession()).user?.id).toBe("account-owner");
    auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect((await initializeAccountSession()).user).toBeNull();
  });

  it("handles an email callback arriving after a signed-out referral visit in the same tab", async () => {
    window.history.replaceState({}, "", "/?ref=abcd1234");
    const { initializeAccountSession } = await import("@/lib/account-session");
    expect((await initializeAccountSession()).user).toBeNull();
    window.history.replaceState({}, "", "/account?ref=abcd1234#access_token=new-token&refresh_token=new-refresh&type=magiclink");
    auth.setSession.mockImplementation(async () => {
      auth.getUser.mockResolvedValue({ data: { user: { id: "invited-user" } }, error: null });
      return { error: null };
    });
    const results = await Promise.all([initializeAccountSession(), initializeAccountSession()]);
    expect(auth.setSession).toHaveBeenCalledTimes(1);
    expect(auth.setSession).toHaveBeenCalledWith({ access_token: "new-token", refresh_token: "new-refresh" });
    expect(results[0].user?.id).toBe("invited-user");
    expect(localStorage.getItem("ref_code")).toBe("abcd1234");
    expect(window.location.hash).toBe("");
  });
});