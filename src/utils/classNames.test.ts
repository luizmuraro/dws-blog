import { describe, expect, it } from 'vitest';
import { cx } from './classNames';

describe('cx', () => {
  it('joins the given class names', () => {
    expect(cx('card', 'active')).toBe('card active');
  });

  it('drops falsy values instead of leaving blanks', () => {
    expect(cx('card', false, null, undefined, 'active')).toBe('card active');
  });

  it('returns an empty string when nothing applies', () => {
    expect(cx(false, undefined)).toBe('');
  });
});
