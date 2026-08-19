import { describe, expect, it } from 'vitest';
import { formatPostDate } from './date';

describe('formatPostDate', () => {
  it('formats an ISO timestamp as a short en-US date', () => {
    expect(formatPostDate('2024-03-05T12:00:00.000Z')).toBe('Mar 5, 2024');
  });

  it('does not pad the day number', () => {
    expect(formatPostDate('2023-12-09T12:00:00.000Z')).toBe('Dec 9, 2023');
  });

  it('returns an empty string for an unparseable date', () => {
    expect(formatPostDate('not a date')).toBe('');
  });

  it('returns an empty string for an empty input', () => {
    expect(formatPostDate('')).toBe('');
  });
});
