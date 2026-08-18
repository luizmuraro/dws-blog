import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { readFavoriteIds, writeFavoriteIds } from '@/utils/storage';
import favoritesReducer, {
  clearFavorites,
  selectFavoriteIds,
  toggleFavorite,
} from './favoritesSlice';

const persistenceMiddleware = createListenerMiddleware();

persistenceMiddleware.startListening({
  matcher: isAnyOf(toggleFavorite, clearFavorites),
  effect: (_action, listenerApi) => {
    writeFavoriteIds(selectFavoriteIds(listenerApi.getState() as RootState));
  },
});

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
  preloadedState: {
    favorites: { ids: readFavoriteIds() },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(persistenceMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
