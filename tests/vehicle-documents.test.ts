import { describe, expect, it } from "vitest";
import { evaluateVehicleDocuments } from "../src/vehicle-documents";

describe("evaluateVehicleDocuments", () => {
  it("evaluates generic vehicle document expiry states", () => {
    const result = evaluateVehicleDocuments(
      [
        { type: "registration", expiryDate: "2026-07-15" },
        { type: "technical_inspection", expiryDate: "2026-06-10" },
        { type: "tachograph_inspection", expiryDate: "2026-05-31" },
        { type: "insurance", expiryDate: null },
        { type: "custom", label: "Emission certificate", expiryDate: "2026-06-20", warningDays: 15 }
      ],
      { fromDate: "2026-06-01", warningDays: 30 }
    );

    expect(result.map((item) => item.status)).toEqual(["valid", "warning", "expired", "missing", "valid"]);
    expect(result.map((item) => item.label)).toEqual([
      "Registration",
      "Technical inspection",
      "Tachograph inspection",
      "Insurance",
      "Emission certificate"
    ]);
  });

  it("preserves Date object inputs as date-only strings", () => {
    expect(
      evaluateVehicleDocuments([{ type: "registration", expiryDate: new Date(2026, 5, 2, 12) }], {
        fromDate: "2026-06-01"
      })[0]
    ).toMatchObject({
      expiryDate: "2026-06-02",
      status: "warning",
      daysUntilExpiry: 1
    });
  });
});
