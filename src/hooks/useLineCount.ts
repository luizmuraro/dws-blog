import { useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export interface UseLineCountResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  lineCount: number;
}

export const useLineCount = <T extends HTMLElement>(): UseLineCountResult<T> => {
  const ref = useRef<T>(null);
  const [lineCount, setLineCount] = useState(1);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);

      if (!lineHeight) return;

      setLineCount(Math.max(1, Math.round(element.clientHeight / lineHeight)));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, lineCount };
};
