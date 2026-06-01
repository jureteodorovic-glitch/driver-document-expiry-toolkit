import { describe, expect, it } from "vitest";
import { summarizeExpiryWarnings } from "../src/reminders";

describe("summarizeExpiryWarnings", () => {
  it("summarizes evaluated document statuses", () => {
    expect(
      summarizeExpiryWarnings([
        { status: "missing" },
        { status: "valid" },
        { status: "valid" },
        { status: "warning" },
        { status: "expired" }
      ])
    ).toEqual({
      total: 5,
      missing: 1,
      valid: 2,
      warning: 1,
      expired: 1,
      needsAttention: 3
    });
  });

  it("returns zero counts for an empty list", () => {
    expect(summarizeExpiryWarnings([])).toEqual({
      total: 0,
      missing: 0,
      valid: 0,
      warning: 0,
      expired: 0,
      needsAttention: 0
    });
  });
});
