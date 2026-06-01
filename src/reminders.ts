import type { ExpiryStatus } from "./expiry-status.js";

export interface ExpirySummaryItem {
  status: ExpiryStatus;
}

export interface ExpiryWarningSummary {
  total: number;
  missing: number;
  valid: number;
  warning: number;
  expired: number;
  needsAttention: number;
}

export function summarizeExpiryWarnings(items: ExpirySummaryItem[]): ExpiryWarningSummary {
  const summary = {
    total: items.length,
    missing: 0,
    valid: 0,
    warning: 0,
    expired: 0,
    needsAttention: 0
  };

  for (const item of items) {
    summary[item.status] += 1;
  }

  summary.needsAttention = summary.missing + summary.warning + summary.expired;

  return summary;
}
