import { describe, expect, it } from 'vitest';
import { cn, formatDate, formatDuration, formatNumber } from '../../lib/utils';

describe('Utility Functions', () => {
  describe('formatDuration', () => {
    it('formats duration in milliseconds to minutes and seconds', () => {
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(30000)).toBe('0:30');
      expect(formatDuration(60000)).toBe('1:00');
      expect(formatDuration(90000)).toBe('1:30');
      expect(formatDuration(3600000)).toBe('60:00');
    });

    it('handles negative values', () => {
      expect(formatDuration(-1000)).toBe('0:00');
    });

    it('pads seconds with leading zero', () => {
      expect(formatDuration(61000)).toBe('1:01');
      expect(formatDuration(70000)).toBe('1:10');
    });
  });

  describe('formatDate', () => {
    it('formats date string to readable format', () => {
      const date = '2024-01-01T12:00:00Z';
      expect(formatDate(date)).toMatch(/January 1, 2024/);
    });

    it('handles invalid date strings', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with commas for thousands', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('handles decimal numbers', () => {
      expect(formatNumber(1000.5)).toBe('1,001');
      expect(formatNumber(1000.4)).toBe('1,000');
    });

    it('handles negative numbers', () => {
      expect(formatNumber(-1000)).toBe('-1,000');
      expect(formatNumber(-1000000)).toBe('-1,000,000');
    });

    it('handles zero and non-numeric values', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(NaN)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
    });
  });

  describe('cn (classNames utility)', () => {
    it('merges class names', () => {
      expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
      expect(cn('btn', undefined, 'btn-large')).toBe('btn btn-large');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const isDisabled = false;

      expect(cn('btn', isActive && 'active', isDisabled && 'disabled')).toBe('btn active');
    });

    it('handles arrays and objects', () => {
      expect(cn('btn', ['primary', 'large'], { active: true, disabled: false })).toBe(
        'btn primary large active',
      );
    });

    it('handles falsy values', () => {
      expect(cn('btn', false, undefined, null, '')).toBe('btn');
    });

    it('handles empty arguments', () => {
      expect(cn()).toBe('');
    });
  });
});
