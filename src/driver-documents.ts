import { toDateOnly, type DateInput } from "./date-utils.js";
import { getExpiryStatus, type ExpiryStatus } from "./expiry-status.js";

export type DriverDocumentType =
  | "driving_license"
  | "medical_certificate"
  | "professional_competence"
  | "driver_card"
  | "custom";

export interface DriverDocumentInput {
  type: DriverDocumentType | string;
  label?: string;
  expiryDate?: DateInput | null;
  warningDays?: number;
}

export interface EvaluateDriverDocumentsOptions {
  warningDays?: number;
  fromDate?: DateInput;
}

export interface EvaluatedDriverDocument {
  type: string;
  label: string;
  expiryDate: string | null;
  status: ExpiryStatus;
  daysUntilExpiry: number | null;
}

const DEFAULT_DRIVER_LABELS: Record<DriverDocumentType, string> = {
  driving_license: "Driving license",
  medical_certificate: "Medical certificate",
  professional_competence: "Professional competence",
  driver_card: "Driver card",
  custom: "Custom"
};

export function evaluateDriverDocuments(
  documents: DriverDocumentInput[],
  options: EvaluateDriverDocumentsOptions = {}
): EvaluatedDriverDocument[] {
  return documents.map((document) => {
    const warningDays = document.warningDays ?? options.warningDays;
    const statusResult = getExpiryStatus({
      expiryDate: document.expiryDate,
      warningDays,
      fromDate: options.fromDate
    });

    return {
      type: document.type,
      label: document.label ?? getDefaultDriverLabel(document.type),
      expiryDate: normalizeExpiryDate(document.expiryDate),
      status: statusResult.status,
      daysUntilExpiry: statusResult.daysUntilExpiry
    };
  });
}

function getDefaultDriverLabel(type: string): string {
  return DEFAULT_DRIVER_LABELS[type as DriverDocumentType] ?? type;
}

function normalizeExpiryDate(expiryDate: DateInput | null | undefined): string | null {
  if (expiryDate == null || (typeof expiryDate === "string" && expiryDate.trim() === "")) {
    return null;
  }

  return toDateOnly(expiryDate);
}
