import { useEffect, useRef, useState } from 'react';
import { getCategories } from '@/api';
import type { Category } from '@/types/domain';

export interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
}

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value));

export const useCategories = (enabled: boolean): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasBeenEnabled, setHasBeenEnabled] = useState(enabled);
  const hasLoadedRef = useRef(false);

  if (enabled && !hasBeenEnabled) {
    setHasBeenEnabled(true);
  }

  useEffect(() => {
    if (!hasBeenEnabled || hasLoadedRef.current) return;

    const controller = new AbortController();
    setIsLoading(true);

    const load = async () => {
      try {
        const loaded = await getCategories(controller.signal);

        if (controller.signal.aborted) return;

        hasLoadedRef.current = true;
        setCategories(loaded);
        setError(null);
      } catch (cause: unknown) {
        if (controller.signal.aborted) return;

        setError(toError(cause));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void load();

    return () => controller.abort();
  }, [hasBeenEnabled]);

  return { categories, isLoading, error };
};
