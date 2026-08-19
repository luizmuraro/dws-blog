import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export const useFocusOnOpen = (
  isOpen: boolean,
  targetRef: RefObject<HTMLInputElement | null>,
  restoreRef: RefObject<HTMLElement | null>,
): void => {
  const wasOpen = useRef(false);

  useEffect(() => {
    if (isOpen) {
      targetRef.current?.focus();
      targetRef.current?.select();
    } else if (wasOpen.current) {
      restoreRef.current?.focus();
    }

    wasOpen.current = isOpen;
  }, [isOpen, targetRef, restoreRef]);
};
