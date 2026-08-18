import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { StorageKey, readStringArray, writeStringArray } from '@/utils/storage';
import favoritesReducer, {
  clearFavorites,
  selectFavoriteIds,
  toggleFavorite,
} from './favoritesSlice';
import searchReducer, {
  addRecentSearch,
  clearRecentSearches,
  removeRecentSearch,
  selectRecentSearches,
} from './searchSlice';

const persistenceMiddleware = createListenerMiddleware();

persistenceMiddleware.startListening({
  matcher: isAnyOf(toggleFavorite, clearFavorites),
  effect: (_action, listenerApi) => {
    writeStringArray(StorageKey.Favorites, selectFavoriteIds(listenerApi.getState() as RootState));
  },
});

persistenceMiddleware.startListening({
  matcher: isAnyOf(addRecentSearch, removeRecentSearch, clearRecentSearches),
  effect: (_action, listenerApi) => {
    writeStringArray(
      StorageKey.RecentSearches,
      selectRecentSearches(listenerApi.getState() as RootState),
    );
  },
});

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    search: searchReducer,
  },
  preloadedState: {
    favorites: { ids: readStringArray(StorageKey.Favorites) },
    search: { recentTerms: readStringArray(StorageKey.RecentSearches) },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(persistenceMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
