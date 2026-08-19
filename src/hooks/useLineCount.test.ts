import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useLineCount } from './useLineCount';

let triggerResize: () => void;

const mountParagraph = (clientHeight: number) => {
  const element = document.createElement('p');

  Object.defineProperty(element, 'clientHeight', { value: clientHeight, configurable: true });
  document.body.append(element);

  return element;
};

const stubLineHeight = (lineHeight: string) => {
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({ lineHeight } as CSSStyleDeclaration);
};

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        triggerResize = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

describe('useLineCount', () => {
  it('reports a single line before the ref is attached', () => {
    const { result } = renderHook(() => useLineCount<HTMLParagraphElement>());

    expect(result.current.lineCount).toBe(1);
    expect(result.current.ref.current).toBeNull();
  });

  it('derives the line count from the height and the line height', () => {
    const element = mountParagraph(72);
    stubLineHeight('24px');

    const { result } = renderHook(() => {
      const lineCount = useLineCount<HTMLParagraphElement>();
      lineCount.ref.current = element;

      return lineCount;
    });

    expect(result.current.lineCount).toBe(3);
  });

  it('rounds a fractional measurement to the nearest line', () => {
    const element = mountParagraph(50);
    stubLineHeight('24px');

    const { result } = renderHook(() => {
      const lineCount = useLineCount<HTMLParagraphElement>();
      lineCount.ref.current = element;

      return lineCount;
    });

    expect(result.current.lineCount).toBe(2);
  });

  it('never reports fewer than one line', () => {
    const element = mountParagraph(0);
    stubLineHeight('24px');

    const { result } = renderHook(() => {
      const lineCount = useLineCount<HTMLParagraphElement>();
      lineCount.ref.current = element;

      return lineCount;
    });

    expect(result.current.lineCount).toBe(1);
  });

  it('keeps the previous count when the line height is not resolvable', () => {
    const element = mountParagraph(72);
    stubLineHeight('normal');

    const { result } = renderHook(() => {
      const lineCount = useLineCount<HTMLParagraphElement>();
      lineCount.ref.current = element;

      return lineCount;
    });

    expect(result.current.lineCount).toBe(1);
  });

  it('remeasures when the element resizes', () => {
    const element = mountParagraph(24);
    stubLineHeight('24px');

    const { result } = renderHook(() => {
      const lineCount = useLineCount<HTMLParagraphElement>();
      lineCount.ref.current = element;

      return lineCount;
    });

    expect(result.current.lineCount).toBe(1);

    Object.defineProperty(element, 'clientHeight', { value: 48, configurable: true });
    act(() => triggerResize());

    expect(result.current.lineCount).toBe(2);
  });
});
