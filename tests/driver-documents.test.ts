import { describe, expect, it } from "vitest";
import { evaluateDriverDocuments } from "../src/driver-documents";

describe("evaluateDriverDocuments", () => {
  it("evaluates generic driver document expiry states", () => {
    const result = evaluateDriverDocuments(
      [
        { type: "driving_license", expiryDate: "2026-07-15" },
        { type: "medical_certificate", label: "Medical certificate", expiryDate: "2026-06-10" },
        { type: "professional_competence", expiryDate: "2026-05-31" },
        { type: "driver_card", expiryDate: null },
        { type: "custom", label: "Local permit", expiryDate: "2026-06-20", warningDays: 15 }
      ],
      { fromDate: "2026-06-01", warningDays: 30 }
    );

    expect(result).toEqual([
      {
        type: "driving_license",
        label: "Driving license",
        expiryDate: "2026-07-15",
        status: "valid",
        daysUntilExpiry: 44
      },
      {
        type: "medical_certificate",
        label: "Medical certificate",
        expiryDate: "2026-06-10",
        status: "warning",
        daysUntilExpiry: 9
      },
      {
        type: "professional_competence",
        label: "Professional competence",
        expiryDate: "2026-05-31",
        status: "expired",
        daysUntilExpiry: -1
      },
      {
        type: "driver_card",
        label: "Driver card",
        expiryDate: null,
        status: "missing",
        daysUntilExpiry: null
      },
      {
        type: "custom",
        label: "Local permit",
        expiryDate: "2026-06-20",
        status: "valid",
        daysUntilExpiry: 19
      }
    ]);
  });

  it("uses custom labels for unknown document types", () => {
    expect(
      evaluateDriverDocuments([{ type: "training_record", expiryDate: "2026-06-02" }], {
        fromDate: "2026-06-01"
      })[0]
    ).toMatchObject({
      type: "training_record",
      label: "training_record",
      status: "warning",
      daysUntilExpiry: 1
    });
  });
});
