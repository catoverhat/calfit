/// <reference types="jest" />

import {
  addDaysToDateKey,
  formatWeekRange,
  getIsoWeek,
  getIsoWeekDateKeys,
  getIsoWeeksInYear,
  parseLocalDateKey,
  toLocalDateKey,
} from './plan-calendar';

describe('plan calendar', () => {
  it('uses Monday through Sunday ISO weeks across year boundaries', () => {
    expect(getIsoWeek(new Date(2027, 0, 1, 12))).toEqual({ week: 53, year: 2026 });
    expect(getIsoWeekDateKeys(2026, 53)).toEqual([
      '2026-12-28', '2026-12-29', '2026-12-30', '2026-12-31',
      '2027-01-01', '2027-01-02', '2027-01-03',
    ]);
  });

  it('reports 52 and 53 week years', () => {
    expect(getIsoWeeksInYear(2025)).toBe(52);
    expect(getIsoWeeksInYear(2026)).toBe(53);
  });

  it('round trips local date keys and crosses leap day', () => {
    expect(toLocalDateKey(parseLocalDateKey('2028-02-29'))).toBe('2028-02-29');
    expect(addDaysToDateKey('2028-02-28', 1)).toBe('2028-02-29');
    expect(() => parseLocalDateKey('2027-02-29')).toThrow('Invalid local date');
  });

  it('formats ranges without duplicating years at ISO boundaries', () => {
    expect(formatWeekRange(getIsoWeekDateKeys(2026, 43))).toBe('Oct 19 – 25, 2026');
    expect(formatWeekRange(getIsoWeekDateKeys(2026, 53))).toBe('Dec 28, 2026 – Jan 3, 2027');
  });
});
