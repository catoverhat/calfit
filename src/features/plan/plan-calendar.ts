export interface IsoWeek {
  week: number;
  year: number;
}

export function toLocalDateKey(date: Date): string {
  return formatDateParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function parseLocalDateKey(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid local date: ${value}`);
  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day), 12);
  if (toLocalDateKey(parsed) !== value) throw new Error(`Invalid local date: ${value}`);
  return parsed;
}

export function compareDateKeys(left: string, right: string): number {
  return left.localeCompare(right);
}

export function addDaysToDateKey(value: string, amount: number): string {
  const date = parseLocalDateKey(value);
  date.setDate(date.getDate() + amount);
  return toLocalDateKey(date);
}

export function getIsoWeek(date: Date): IsoWeek {
  const cursor = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const weekday = cursor.getUTCDay() || 7;
  cursor.setUTCDate(cursor.getUTCDate() + 4 - weekday);
  const year = cursor.getUTCFullYear();
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((cursor.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return { week, year };
}

export function getIsoWeeksInYear(year: number): number {
  return getIsoWeek(new Date(year, 11, 28, 12)).week;
}

export function getIsoWeekDateKeys(year: number, week: number): string[] {
  const maxWeek = getIsoWeeksInYear(year);
  if (!Number.isInteger(week) || week < 1 || week > maxWeek) {
    throw new Error(`Invalid ISO week ${week} for ${year}`);
  }

  const januaryFourth = new Date(Date.UTC(year, 0, 4));
  const januaryFourthWeekday = januaryFourth.getUTCDay() || 7;
  const monday = new Date(januaryFourth);
  monday.setUTCDate(januaryFourth.getUTCDate() - januaryFourthWeekday + 1 + (week - 1) * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + index);
    return formatDateParts(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  });
}

export function getIsoYearDateRange(year: number): { endDate: string; startDate: string } {
  return {
    startDate: getIsoWeekDateKeys(year, 1)[0],
    endDate: getIsoWeekDateKeys(year, getIsoWeeksInYear(year))[6],
  };
}

export function formatWeekRange(dateKeys: string[]): string {
  const first = parseLocalDateKey(dateKeys[0]);
  const last = parseLocalDateKey(dateKeys[dateKeys.length - 1]);
  const sameYear = first.getFullYear() === last.getFullYear();
  const sameMonth = sameYear && first.getMonth() === last.getMonth();
  const monthDay = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (sameMonth) {
    return `${monthDay(first)} – ${last.getDate()}, ${last.getFullYear()}`;
  }
  if (sameYear) {
    return `${monthDay(first)} – ${monthDay(last)}, ${last.getFullYear()}`;
  }
  return `${monthDay(first)}, ${first.getFullYear()} – ${monthDay(last)}, ${last.getFullYear()}`;
}

function formatDateParts(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
