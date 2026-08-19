import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import RouteErrorBoundary from './RouteErrorBoundary';

const renderWithError = (loader: () => never) => {
  const router = createMemoryRouter([
    { path: '/', loader, element: <p>never rendered</p>, errorElement: <RouteErrorBoundary /> },
  ]);

  return render(<RouterProvider router={router} />);
};

describe('RouteErrorBoundary', () => {
  it('always offers a way home', async () => {
    renderWithError(() => {
      throw new Error('boom');
    });

    expect(
      await screen.findByRole('heading', { name: 'Something went wrong' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
  });

  it('shows the status of a route response', async () => {
    renderWithError(() => {
      throw new Response('', { status: 404, statusText: 'Not Found' });
    });

    expect(await screen.findByText('404 Not Found')).toBeInTheDocument();
  });

  it('shows the message of a thrown error', async () => {
    renderWithError(() => {
      throw new Error('the loader failed');
    });

    expect(await screen.findByText('the loader failed')).toBeInTheDocument();
  });

  it('falls back for anything else that was thrown', async () => {
    renderWithError(() => {
      throw 'just a string';
    });

    expect(await screen.findByText('An unexpected error occurred.')).toBeInTheDocument();
  });
});
