import { describe, expect, it } from "vitest";
import { getExpiryStatus } from "../src/expiry-status";

describe("getExpiryStatus", () => {
  it("returns missing for null, undefined, and empty dates", () => {
    expect(getExpiryStatus({ expiryDate: null, fromDate: "2026-06-01" })).toEqual({
      status: "missing",
      daysUntilExpiry: null
    });
    expect(getExpiryStatus({ expiryDate: undefined, fromDate: "2026-06-01" }).status).toBe("missing");
    expect(getExpiryStatus({ expiryDate: "", fromDate: "2026-06-01" }).status).toBe("missing");
  });

  it("returns expired for yesterday", () => {
    expect(getExpiryStatus({ expiryDate: "2026-05-31", fromDate: "2026-06-01" })).toEqual({
      status: "expired",
      daysUntilExpiry: -1
    });
  });

  it("returns warning for today and dates inside the default warning window", () => {
    expect(getExpiryStatus({ expiryDate: "2026-06-01", fromDate: "2026-06-01" })).toEqual({
      status: "warning",
      daysUntilExpiry: 0
    });
    expect(getExpiryStatus({ expiryDate: "2026-07-01", fromDate: "2026-06-01" })).toEqual({
      status: "warning",
      daysUntilExpiry: 30
    });
  });

  it("returns valid for dates outside the warning window", () => {
    expect(getExpiryStatus({ expiryDate: "2026-07-02", fromDate: "2026-06-01" })).toEqual({
      status: "valid",
      daysUntilExpiry: 31
    });
  });

  it("supports custom warning days", () => {
    expect(getExpiryStatus({ expiryDate: "2026-06-11", warningDays: 10, fromDate: "2026-06-01" }).status).toBe("warning");
    expect(getExpiryStatus({ expiryDate: "2026-06-12", warningDays: 10, fromDate: "2026-06-01" }).status).toBe("valid");
  });

  it("propagates invalid date errors", () => {
    expect(() => getExpiryStatus({ expiryDate: "not-a-date", fromDate: "2026-06-01" })).toThrow("Invalid date: not-a-date");
  });
});
