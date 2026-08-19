import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

const GROUP_SELECTOR = '[data-dropdown-group]';

export interface UseDropdownResult<T extends HTMLElement> {
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
  close: () => void;
  containerRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<T | null>;
}

export const useDropdown = <T extends HTMLElement = HTMLButtonElement>(): UseDropdownResult<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<T>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((isCurrentlyOpen) => !isCurrentlyOpen), []);

  useEffect(() => {
    if (!isOpen) return;

    // Avoid navigating to some page when trying to close dropdowns
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const container = containerRef.current;

      if (container?.contains(target)) return;

      setIsOpen(false);

      if (container?.closest(GROUP_SELECTOR)?.contains(target)) return;

      event.preventDefault();
      event.stopPropagation();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      setIsOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return { isOpen, open, toggle, close, containerRef, triggerRef };
};
