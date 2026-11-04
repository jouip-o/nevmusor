import { beforeEach, describe, expect, it } from "vitest";
import { accountEmailRedirect, accountReturnPath, captureReferral, clearReferral, pendingReferral } from "@/lib/referral-storage";

beforeEach(() => localStorage.clear());

describe("Referral sign-in", () => {
  it("returns preview sign-in emails to nevmusor.site rather than Lovable registration", () => {
    expect(accountEmailRedirect("https://id-preview--b70b3d06-c3c5-4647-b13e-094b8017ed59.lovable.app"))
      .toBe("https://nevmusor.site/?to=account");
  });

  it("preserves referral credit when sending email from the editor preview", () => {
    captureReferral("https://nevmusor.site/?ref=abcd1234");
    expect(accountEmailRedirect("https://id-preview--b70b3d06-c3c5-4647-b13e-094b8017ed59.lovable.app"))
      .toBe("https://nevmusor.site/?to=account&ref=abcd1234");
  });

  it("email links on nevmusor.site land on the site root, which static hosting always serves", () => {
    expect(accountEmailRedirect("https://nevmusor.site")).toBe("https://nevmusor.site/?to=account");
  });

  it("moves an email return to the account page keeping sign-in tokens and referral", () => {
    expect(accountReturnPath("https://nevmusor.site/?to=account&ref=abcd1234#access_token=t&refresh_token=r"))
      .toBe("/account?ref=abcd1234#access_token=t&refresh_token=r");
    expect(accountReturnPath("https://nevmusor.site/?ref=abcd1234")).toBeNull();
  });

  it("captures referral credit without changing email callback tokens", () => {
    window.history.replaceState({}, "", "/account?ref=abcd1234#access_token=token&refresh_token=refresh");
    captureReferral(window.location.href);
    expect(pendingReferral()).toBe("abcd1234");
    expect(window.location.hash).toBe("#access_token=token&refresh_token=refresh");
  });

  it("does not erase a newer referral when an earlier claim finishes", () => {
    captureReferral("https://nevmusor.site/?ref=next1234");
    clearReferral("abcd1234");
    expect(pendingReferral()).toBe("next1234");
  });
});
