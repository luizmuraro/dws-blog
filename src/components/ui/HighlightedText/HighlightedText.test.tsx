import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import HighlightedText from './HighlightedText';

const marks = (container: HTMLElement) =>
  [...container.querySelectorAll('mark')].map((mark) => mark.textContent);

describe('HighlightedText', () => {
  it('wraps the matching part in a mark', () => {
    const { container } = render(<HighlightedText text="React hooks rule" query="hooks" />);

    expect(marks(container)).toEqual(['hooks']);
    expect(container).toHaveTextContent('React hooks rule');
  });

  it('marks every occurrence', () => {
    const { container } = render(<HighlightedText text="hook, hook, hook" query="hook" />);

    expect(marks(container)).toEqual(['hook', 'hook', 'hook']);
  });

  it('preserves the original casing of the match', () => {
    const { container } = render(<HighlightedText text="React hooks" query="REACT" />);

    expect(marks(container)).toEqual(['React']);
  });

  it('marks nothing when the query does not match', () => {
    const { container } = render(<HighlightedText text="React hooks" query="vue" />);

    expect(marks(container)).toEqual([]);
    expect(screen.getByText('React hooks')).toBeInTheDocument();
  });

  it('marks nothing for an empty query', () => {
    const { container } = render(<HighlightedText text="React hooks" query="" />);

    expect(marks(container)).toEqual([]);
    expect(container).toHaveTextContent('React hooks');
  });

  it('keeps the full text when the whole string matches', () => {
    const { container } = render(<HighlightedText text="React" query="react" />);

    expect(marks(container)).toEqual(['React']);
  });
});
