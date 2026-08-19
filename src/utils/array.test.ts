import { describe, expect, it } from 'vitest';
import { toggleItem } from './array';

describe('toggleItem', () => {
  it('appends an item that is not in the list', () => {
    expect(toggleItem(['a', 'b'], 'c')).toEqual(['a', 'b', 'c']);
  });

  it('removes an item that is already in the list', () => {
    expect(toggleItem(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
  });

  it('removes every occurrence of a duplicated item', () => {
    expect(toggleItem(['a', 'b', 'a'], 'a')).toEqual(['b']);
  });

  it('appends to an empty list', () => {
    expect(toggleItem<string>([], 'a')).toEqual(['a']);
  });

  it('does not mutate the original list', () => {
    const items = ['a', 'b'];

    toggleItem(items, 'a');
    toggleItem(items, 'c');

    expect(items).toEqual(['a', 'b']);
  });

  it('works with non-string items', () => {
    expect(toggleItem([1, 2, 3], 2)).toEqual([1, 3]);
  });
});
