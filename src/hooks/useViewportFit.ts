import { useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export interface UseViewportFitOptions {
  bottomGap?: number;
  minHeight?: number;
}

export interface UseViewportFitResult<T extends HTMLElement> {
  ref: RefObject<T | null>;
  maxHeight: number | undefined;
}

export const useViewportFit = <T extends HTMLElement>({
  bottomGap = 0,
  minHeight = 0,
}: UseViewportFitOptions = {}): UseViewportFitResult<T> => {
  const ref = useRef<T>(null);
  const [maxHeight, setMaxHeight] = useState<number>();

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    const measure = () => {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY;

      setMaxHeight(Math.max(minHeight, window.innerHeight - offsetTop - bottomGap));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [bottomGap, minHeight]);

  return { ref, maxHeight };
};
