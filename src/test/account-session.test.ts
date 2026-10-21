import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({ getUser: vi.fn(), verifyOtp: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth } }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  window.history.replaceState({}, "", "/account");
  auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
  auth.verifyOtp.mockResolvedValue({ error: null });
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
    auth.getUser.mockImplementation(async () => {
      expect(window.location.hash).toContain("access_token=test-token");
      return { data: { user: { id: "account-owner" } }, error: null };
    });
    const { initializeAccountSession } = await import("@/lib/account-session");
    expect((await initializeAccountSession()).user?.id).toBe("account-owner");
    expect(auth.verifyOtp).not.toHaveBeenCalled();
  });
});