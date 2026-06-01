export type DateInput = Date | string;

const ISO_DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toDateOnly(input: DateInput): string {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) {
      throw new Error("Invalid Date object.");
    }

    return formatDateParts(input.getFullYear(), input.getMonth() + 1, input.getDate());
  }

  if (typeof input !== "string" || input.trim() === "") {
    throw new Error("Date value is required.");
  }

  const value = input.trim();
  const match = ISO_DATE_PREFIX.exec(value);

  if (!match) {
    throw new Error(`Invalid date: ${value}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!isValidCalendarDate(year, month, day)) {
    throw new Error(`Invalid date: ${value}`);
  }

  return formatDateParts(year, month, day);
}

export function daysUntil(targetDate: DateInput, fromDate: DateInput = new Date()): number {
  const target = dateOnlyToUtcTime(toDateOnly(targetDate));
  const from = dateOnlyToUtcTime(toDateOnly(fromDate));

  return Math.round((target - from) / MS_PER_DAY);
}

export function isPastDate(targetDate: DateInput, fromDate: DateInput = new Date()): boolean {
  return daysUntil(targetDate, fromDate) < 0;
}

export function isWithinDays(targetDate: DateInput, days: number, fromDate: DateInput = new Date()): boolean {
  assertNonNegativeNumber(days, "days");

  const difference = daysUntil(targetDate, fromDate);
  return difference >= 0 && difference <= days;
}

function formatDateParts(year: number, month: number, day: number): string {
  const monthText = String(month).padStart(2, "0");
  const dayText = String(day).padStart(2, "0");

  return `${year}-${monthText}-${dayText}`;
}

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function dateOnlyToUtcTime(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function assertNonNegativeNumber(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative number.`);
  }
}
