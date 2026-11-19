import { describe, it, expect } from 'vitest';
import { resolveTurkeyTimestamp } from '../date-resolver';

describe('resolveTurkeyTimestamp', () => {
  const DUMMY_PATH = 'non-existent-file.md';

  it('preserves local datetime provided in Pages CMS format (YYYY-MM-DDTHH:mm)', () => {
    const raw = '2026-11-06T17:18';
    const resolved = resolveTurkeyTimestamp(raw, DUMMY_PATH);
    expect(resolved).toBe('2026-11-06T17:18:00+03:00');
  });

  it('preserves local datetime with seconds (YYYY-MM-DDTHH:mm:ss)', () => {
    const raw = '2026-11-06T14:30:45';
    const resolved = resolveTurkeyTimestamp(raw, DUMMY_PATH);
    expect(resolved).toBe('2026-11-06T14:30:45+03:00');
  });

  it('resolves date-only string (YYYY-MM-DD) to a valid Turkey timestamp ending with +03:00', () => {
    const raw = '2026-05-15';
    const resolved = resolveTurkeyTimestamp(raw, DUMMY_PATH);
    expect(resolved).toMatch(/^2026-05-15T\d{2}:\d{2}:\d{2}\+03:00$/);
  });

  it('resolves explicit midnight (00:00:00) with a fallback time and preserves date part and +03:00 offset', () => {
    const raw = '2026-11-06T00:00:00';
    const resolved = resolveTurkeyTimestamp(raw, DUMMY_PATH);
    expect(resolved).toMatch(/^2026-11-06T\d{2}:\d{2}:\d{2}\+03:00$/);
  });

  it('formats non-midnight JavaScript Date objects to Turkey timezone (+03:00)', () => {
    // 12:00:00 UTC = 15:00:00 in Turkey (+03:00)
    const dateObj = new Date('2026-08-10T12:00:00Z');
    const resolved = resolveTurkeyTimestamp(dateObj, DUMMY_PATH);
    expect(resolved).toBe('2026-08-10T15:00:00+03:00');
  });
});
