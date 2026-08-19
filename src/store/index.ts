import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit';
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

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  search: searchReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const createPersistenceMiddleware = () => {
  const middleware = createListenerMiddleware();

  middleware.startListening({
    matcher: isAnyOf(toggleFavorite, clearFavorites),
    effect: (_action, listenerApi) => {
      writeStringArray(
        StorageKey.Favorites,
        selectFavoriteIds(listenerApi.getState() as RootState),
      );
    },
  });

  middleware.startListening({
    matcher: isAnyOf(addRecentSearch, removeRecentSearch, clearRecentSearches),
    effect: (_action, listenerApi) => {
      writeStringArray(
        StorageKey.RecentSearches,
        selectRecentSearches(listenerApi.getState() as RootState),
      );
    },
  });

  return middleware;
};

const readPersistedState = (): RootState => ({
  favorites: { ids: readStringArray(StorageKey.Favorites) },
  search: { recentTerms: readStringArray(StorageKey.RecentSearches) },
});

export const createAppStore = (preloadedState: RootState = readPersistedState()) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(createPersistenceMiddleware().middleware),
  });

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];

export const store = createAppStore();
