import { beforeEach, describe, expect, it } from "vitest";
import { accountEmailRedirect, captureReferral, clearReferral, pendingReferral } from "@/lib/referral-storage";

beforeEach(() => localStorage.clear());

describe("Referral sign-in", () => {
  it("returns preview sign-in emails to the public website rather than Lovable registration", () => {
    expect(accountEmailRedirect("https://id-preview--b70b3d06-c3c5-4647-b13e-094b8017ed59.lovable.app"))
      .toBe("https://nevmusor.lovable.app/account");
  });

  it("preserves referral credit when sending email from the editor preview", () => {
    captureReferral("https://nevmusor.lovable.app/?ref=abcd1234");
    expect(accountEmailRedirect("https://id-preview--b70b3d06-c3c5-4647-b13e-094b8017ed59.lovable.app"))
      .toBe("https://nevmusor.lovable.app/account?ref=abcd1234");
  });

  it("keeps sign-in on a visitor's custom website domain", () => {
    expect(accountEmailRedirect("https://nevmusor.site")).toBe("https://nevmusor.site/account");
  });

  it("carries the referral into the email return address for a different browser", () => {
    captureReferral("https://nevmusor.lovable.app/?ref=abcd1234");
    expect(accountEmailRedirect("https://nevmusor.lovable.app")).toBe("https://nevmusor.lovable.app/account?ref=abcd1234");
  });

  it("captures referral credit without changing email callback tokens", () => {
    window.history.replaceState({}, "", "/account?ref=abcd1234#access_token=token&refresh_token=refresh");
    captureReferral(window.location.href);
    expect(pendingReferral()).toBe("abcd1234");
    expect(window.location.hash).toBe("#access_token=token&refresh_token=refresh");
  });

  it("does not erase a newer referral when an earlier claim finishes", () => {
    captureReferral("https://nevmusor.lovable.app/?ref=next1234");
    clearReferral("abcd1234");
    expect(pendingReferral()).toBe("next1234");
  });
});