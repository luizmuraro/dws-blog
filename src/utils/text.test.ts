import { describe, expect, it } from 'vitest';
import { getLastName, splitParagraphs } from './text';

describe('getLastName', () => {
  it('returns the last part of a full name', () => {
    expect(getLastName('Ada Lovelace')).toBe('Lovelace');
  });

  it('returns the last part of a name with more than two words', () => {
    expect(getLastName('Maria da Silva Santos')).toBe('Santos');
  });

  it('returns the name itself when there is a single word', () => {
    expect(getLastName('Prince')).toBe('Prince');
  });

  it('ignores surrounding and repeated whitespace', () => {
    expect(getLastName('  Ada   Lovelace  ')).toBe('Lovelace');
  });

  it('returns an empty string for an empty name', () => {
    expect(getLastName('')).toBe('');
    expect(getLastName('   ')).toBe('');
  });
});

describe('splitParagraphs', () => {
  it('splits the content on blank lines', () => {
    expect(splitParagraphs('First.\n\nSecond.\n\nThird.')).toEqual(['First.', 'Second.', 'Third.']);
  });

  it('trims each paragraph', () => {
    expect(splitParagraphs('  First.  \n\n  Second.  ')).toEqual(['First.', 'Second.']);
  });

  it('drops empty paragraphs', () => {
    expect(splitParagraphs('First.\n\n\n\nSecond.')).toEqual(['First.', 'Second.']);
  });

  it('keeps single line breaks inside a paragraph', () => {
    expect(splitParagraphs('First line\nsame paragraph')).toEqual(['First line\nsame paragraph']);
  });

  it('returns an empty list for blank content', () => {
    expect(splitParagraphs('')).toEqual([]);
    expect(splitParagraphs('\n\n   \n\n')).toEqual([]);
  });
});
