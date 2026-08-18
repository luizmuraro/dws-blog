import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  recentTerms: string[];
}

const RECENT_LIMIT = 5;

const initialState: SearchState = { recentTerms: [] };

const isSameTerm = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const term = action.payload.trim();

      if (!term) return;

      state.recentTerms = [
        term,
        ...state.recentTerms.filter((recent) => !isSameTerm(recent, term)),
      ].slice(0, RECENT_LIMIT);
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentTerms = state.recentTerms.filter((recent) => !isSameTerm(recent, action.payload));
    },
    clearRecentSearches: (state) => {
      state.recentTerms = [];
    },
  },
});

export const { addRecentSearch, removeRecentSearch, clearRecentSearches } = searchSlice.actions;

export const selectRecentSearches = (state: { search: SearchState }) => state.search.recentTerms;

export default searchSlice.reducer;
