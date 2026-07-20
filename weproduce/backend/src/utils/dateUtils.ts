/**
 * All dates are normalized to UTC midnight to keep DB comparisons exact
 * regardless of the server's local timezone.
 */
export function toUtcMidnight(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function todayUtc(): Date {
  return toUtcMidnight(new Date());
}

/** ISO week starts Monday. Returns UTC-midnight Monday for the given date's week. */
export function getIsoWeekStart(date: Date): Date {
  const d = toUtcMidnight(date);
  const day = d.getUTCDay(); // 0 = Sunday
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

export function getIsoWeekEnd(weekStart: Date): Date {
  const d = toUtcMidnight(weekStart);
  d.setUTCDate(d.getUTCDate() + 6);
  return d;
}

export function isConsecutiveDay(previous: Date, current: Date): boolean {
  const oneDayMs = 24 * 60 * 60 * 1000;
  return toUtcMidnight(current).getTime() - toUtcMidnight(previous).getTime() === oneDayMs;
}

export function isSameUtcDay(a: Date, b: Date): boolean {
  return toUtcMidnight(a).getTime() === toUtcMidnight(b).getTime();
}
