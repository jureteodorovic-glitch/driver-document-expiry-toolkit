import { toDateOnly, type DateInput } from "./date-utils.js";
import { getExpiryStatus, type ExpiryStatus } from "./expiry-status.js";

export type VehicleDocumentType =
  | "registration"
  | "technical_inspection"
  | "tachograph_inspection"
  | "insurance"
  | "custom";

export interface VehicleDocumentInput {
  type: VehicleDocumentType | string;
  label?: string;
  expiryDate?: DateInput | null;
  warningDays?: number;
}

export interface EvaluateVehicleDocumentsOptions {
  warningDays?: number;
  fromDate?: DateInput;
}

export interface EvaluatedVehicleDocument {
  type: string;
  label: string;
  expiryDate: string | null;
  status: ExpiryStatus;
  daysUntilExpiry: number | null;
}

const DEFAULT_VEHICLE_LABELS: Record<VehicleDocumentType, string> = {
  registration: "Registration",
  technical_inspection: "Technical inspection",
  tachograph_inspection: "Tachograph inspection",
  insurance: "Insurance",
  custom: "Custom"
};

export function evaluateVehicleDocuments(
  documents: VehicleDocumentInput[],
  options: EvaluateVehicleDocumentsOptions = {}
): EvaluatedVehicleDocument[] {
  return documents.map((document) => {
    const warningDays = document.warningDays ?? options.warningDays;
    const statusResult = getExpiryStatus({
      expiryDate: document.expiryDate,
      warningDays,
      fromDate: options.fromDate
    });

    return {
      type: document.type,
      label: document.label ?? getDefaultVehicleLabel(document.type),
      expiryDate: normalizeExpiryDate(document.expiryDate),
      status: statusResult.status,
      daysUntilExpiry: statusResult.daysUntilExpiry
    };
  });
}

function getDefaultVehicleLabel(type: string): string {
  return DEFAULT_VEHICLE_LABELS[type as VehicleDocumentType] ?? type;
}

function normalizeExpiryDate(expiryDate: DateInput | null | undefined): string | null {
  if (expiryDate == null || (typeof expiryDate === "string" && expiryDate.trim() === "")) {
    return null;
  }

  return toDateOnly(expiryDate);
}
