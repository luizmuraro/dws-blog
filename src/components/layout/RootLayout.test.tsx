import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders } from '@/test/renderWithProviders';
import { stubFetchJson } from '@/test/mockFetch';
import RootLayout from './RootLayout';

const renderLayout = () => {
  stubFetchJson([]);

  return renderWithProviders(
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<p>page content</p>} />
      </Route>
    </Routes>,
  );
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('RootLayout', () => {
  it('renders the header above the routed page', () => {
    renderLayout();

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('page content');
  });

  it('links the logo back home', () => {
    renderLayout();

    expect(screen.getByRole('link', { name: 'DWS Blog home' })).toHaveAttribute('href', '/');
  });

  it('carries the search field in the header', () => {
    renderLayout();

    expect(screen.getAllByRole('combobox', { name: 'Search posts' })[0]).toBeInTheDocument();
  });

  it('keeps the background decoration out of the accessibility tree', () => {
    const { container } = renderLayout();

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
