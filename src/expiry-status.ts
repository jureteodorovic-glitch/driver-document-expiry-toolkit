import { daysUntil, type DateInput } from "./date-utils.js";

export type ExpiryStatus = "missing" | "valid" | "warning" | "expired";

export interface ExpiryStatusInput {
  expiryDate: DateInput | null | undefined;
  warningDays?: number;
  fromDate?: DateInput;
}

export interface ExpiryStatusResult {
  status: ExpiryStatus;
  daysUntilExpiry: number | null;
}

export function getExpiryStatus(input: ExpiryStatusInput): ExpiryStatusResult {
  const { expiryDate, fromDate } = input;
  const warningDays = input.warningDays ?? 30;

  assertNonNegativeNumber(warningDays, "warningDays");

  if (expiryDate == null || (typeof expiryDate === "string" && expiryDate.trim() === "")) {
    return {
      status: "missing",
      daysUntilExpiry: null
    };
  }

  const daysUntilExpiry = daysUntil(expiryDate, fromDate);

  if (daysUntilExpiry < 0) {
    return {
      status: "expired",
      daysUntilExpiry
    };
  }

  if (daysUntilExpiry <= warningDays) {
    return {
      status: "warning",
      daysUntilExpiry
    };
  }

  return {
    status: "valid",
    daysUntilExpiry
  };
}

function assertNonNegativeNumber(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative number.`);
  }
}
