import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { toggleItem } from '@/utils/array';

export interface FavoritesState {
  ids: string[];
}

const initialState: FavoritesState = { ids: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      state.ids = toggleItem(state.ids, action.payload);
    },
    clearFavorites: (state) => {
      state.ids = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

export const selectFavoriteIds = (state: { favorites: FavoritesState }) => state.favorites.ids;

export const selectFavoritesCount = (state: { favorites: FavoritesState }) =>
  state.favorites.ids.length;

export const selectIsFavorite = (postId: string) => (state: { favorites: FavoritesState }) =>
  state.favorites.ids.includes(postId);

export default favoritesSlice.reducer;
