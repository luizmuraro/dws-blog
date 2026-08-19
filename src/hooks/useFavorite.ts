import { useCallback } from 'react';
import { selectIsFavorite, toggleFavorite } from '@/store/favoritesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export interface UseFavoriteResult {
  isFavorite: boolean;
  toggle: () => void;
}

export const useFavorite = (postId: string): UseFavoriteResult => {
  const isFavorite = useAppSelector(selectIsFavorite(postId));
  const dispatch = useAppDispatch();

  const toggle = useCallback(() => {
    dispatch(toggleFavorite(postId));
  }, [dispatch, postId]);

  return { isFavorite, toggle };
};
