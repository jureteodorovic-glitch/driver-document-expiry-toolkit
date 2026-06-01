import { describe, expect, it } from "vitest";
import { daysUntil, isPastDate, isWithinDays, toDateOnly } from "../src/date-utils";

describe("date utilities", () => {
  it("formats Date objects as calendar dates", () => {
    expect(toDateOnly(new Date(2026, 5, 1, 23, 59, 59))).toBe("2026-06-01");
  });

  it("formats ISO date strings as date-only values", () => {
    expect(toDateOnly("2026-06-01")).toBe("2026-06-01");
    expect(toDateOnly("2026-06-01T18:30:00.000Z")).toBe("2026-06-01");
  });

  it("calculates positive, zero, and negative day differences using calendar dates", () => {
    expect(daysUntil("2026-06-02", "2026-06-01")).toBe(1);
    expect(daysUntil("2026-06-01T23:59:59.000Z", "2026-06-01T00:00:01.000Z")).toBe(0);
    expect(daysUntil("2026-05-31", "2026-06-01")).toBe(-1);
  });

  it("detects past dates", () => {
    expect(isPastDate("2026-05-31", "2026-06-01")).toBe(true);
    expect(isPastDate("2026-06-01", "2026-06-01")).toBe(false);
    expect(isPastDate("2026-06-02", "2026-06-01")).toBe(false);
  });

  it("detects dates within a day window including today", () => {
    expect(isWithinDays("2026-06-01", 30, "2026-06-01")).toBe(true);
    expect(isWithinDays("2026-07-01", 30, "2026-06-01")).toBe(true);
    expect(isWithinDays("2026-07-02", 30, "2026-06-01")).toBe(false);
    expect(isWithinDays("2026-05-31", 30, "2026-06-01")).toBe(false);
  });

  it("rejects invalid dates with clear errors", () => {
    expect(() => toDateOnly("")).toThrow("Date value is required.");
    expect(() => toDateOnly("2026-02-30")).toThrow("Invalid date: 2026-02-30");
    expect(() => toDateOnly(new Date(Number.NaN))).toThrow("Invalid Date object.");
    expect(() => isWithinDays("2026-06-01", -1, "2026-06-01")).toThrow("days must be a non-negative number.");
  });
});
