import { useEffect, useRef, useState } from 'react';
import { getCategories } from '@/api';
import type { Category } from '@/types/domain';

export interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
}

export const useCategories = (enabled: boolean): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasBeenEnabled, setHasBeenEnabled] = useState(enabled);
  const hasLoadedRef = useRef(false);

  if (enabled && !hasBeenEnabled) {
    setHasBeenEnabled(true);
  }

  useEffect(() => {
    if (!hasBeenEnabled || hasLoadedRef.current) return;

    const controller = new AbortController();
    setIsLoading(true);

    getCategories(controller.signal)
      .then((loaded) => {
        if (controller.signal.aborted) return;

        hasLoadedRef.current = true;
        setCategories(loaded);
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [hasBeenEnabled]);

  return { categories, isLoading };
};
