import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createAppStore, type AppStore, type RootState } from '@/store';

export const makeTestState = (overrides: Partial<RootState> = {}): RootState => ({
  favorites: { ids: [] },
  search: { recentTerms: [] },
  ...overrides,
});

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  initialEntries?: string[];
  path?: string;
}

export interface RenderWithProvidersResult extends RenderResult {
  store: AppStore;
  user: ReturnType<typeof userEvent.setup>;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState,
    store = createAppStore(makeTestState(preloadedState)),
    initialEntries = ['/'],
    path,
    ...renderOptions
  }: RenderWithProvidersOptions = {},
): RenderWithProvidersResult => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        {path ? <Routes>{<Route path={path} element={children} />}</Routes> : children}
      </MemoryRouter>
    </Provider>
  );

  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
