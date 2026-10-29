/// <reference types="jest" />

import { formatDateLabel, parseDateKey, toDateKey } from './date-field-value';

test('round-trips local date keys and rejects impossible dates', () => {
  const date = parseDateKey('2024-02-29');
  expect(date && toDateKey(date)).toBe('2024-02-29');
  expect(parseDateKey('2026-02-30')).toBeNull();
  expect(parseDateKey('')).toBeNull();
  expect(formatDateLabel('not a date')).toBeNull();
  expect(formatDateLabel('2026-10-29')).toContain('2026');
});
