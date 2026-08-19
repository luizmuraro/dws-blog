import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { SearchVariant } from '@/constants/searchVariant';
import type { UsePostSearchResult } from '@/hooks';
import { makePost } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';
import type { Post } from '@/types/domain';
import SearchResults from './SearchResults';

const makeResults = (count: number): Post[] =>
  Array.from({ length: count }, (_, index) =>
    makePost({ id: `post-${index + 1}`, title: `Result ${index + 1}` }),
  );

const makeSearch = (overrides: Partial<UsePostSearchResult> = {}): UsePostSearchResult => ({
  term: 'react',
  results: [],
  isLoading: false,
  isPending: false,
  hasQuery: true,
  error: null,
  retry: vi.fn(),
  ...overrides,
});

const renderResults = (
  search: UsePostSearchResult,
  variant: SearchVariant = SearchVariant.Desktop,
) => {
  const onClose = vi.fn();

  return {
    onClose,
    ...renderWithProviders(
      <SearchResults
        id="search-panel"
        variant={variant}
        search={search}
        resultsPath="/?q=react"
        onClose={onClose}
      />,
    ),
  };
};

describe('SearchResults body', () => {
  it('keeps the Posts heading in every state', () => {
    renderResults(makeSearch({ results: [] }));

    expect(screen.getByRole('heading', { level: 2, name: 'Posts' })).toBeInTheDocument();
  });

  it('shows placeholders while the listing loads', () => {
    const { container } = renderResults(makeSearch({ isLoading: true }));

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows placeholders while the typed term has not settled', () => {
    renderResults(makeSearch({ isPending: true, results: makeResults(2) }));

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('reports a failed listing with a retry', async () => {
    const retry = vi.fn();
    const { user } = renderResults(makeSearch({ error: new Error('boom'), retry }));

    expect(screen.getByRole('alert')).toHaveTextContent('We could not load the posts.');

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it('quotes the term when nothing matched', () => {
    renderResults(makeSearch({ term: 'kubernetes' }));

    expect(screen.getByText('No posts found for “kubernetes”')).toBeInTheDocument();
  });

  it('lists the matching posts', () => {
    renderResults(makeSearch({ results: makeResults(2) }));

    expect(screen.getByRole('link', { name: 'Result 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Result 2' })).toBeInTheDocument();
  });
});

describe('SearchResults preview limits', () => {
  it('previews at most three results on desktop', () => {
    renderResults(makeSearch({ results: makeResults(5) }));

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
  });

  it('previews at most four results on mobile', () => {
    renderResults(makeSearch({ results: makeResults(6) }), SearchVariant.Mobile);

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
  });
});

describe('SearchResults footer', () => {
  it('hides the desktop footer when everything already fits', () => {
    renderResults(makeSearch({ results: makeResults(3) }));

    expect(screen.queryByRole('link', { name: /See all/ })).not.toBeInTheDocument();
  });

  it('offers a see-all link on desktop once results overflow', () => {
    renderResults(makeSearch({ results: makeResults(5) }));

    expect(screen.getByRole('link', { name: 'See all 5 results' })).toHaveAttribute(
      'href',
      '/?q=react',
    );
  });

  it('always offers the see-all button on mobile', () => {
    renderResults(makeSearch({ results: makeResults(2) }), SearchVariant.Mobile);

    expect(screen.getByRole('button', { name: 'See all 2 results' })).toBeInTheDocument();
  });

  it('shows the result count on mobile only', () => {
    const { unmount } = renderResults(
      makeSearch({ results: makeResults(2) }),
      SearchVariant.Mobile,
    );

    expect(screen.getByText('2 results')).toBeInTheDocument();
    unmount();

    renderResults(makeSearch({ results: makeResults(2) }));
    expect(screen.queryByText('2 results')).not.toBeInTheDocument();
  });

  it('hides the footer entirely while there are no results', () => {
    renderResults(makeSearch({ results: [] }), SearchVariant.Mobile);

    expect(screen.queryByRole('button', { name: /See all/ })).not.toBeInTheDocument();
  });
});

describe('SearchResults committing the term', () => {
  it('remembers the term and closes when a result is opened', async () => {
    const search = makeSearch({ results: makeResults(2) });
    const { store, user, onClose } = renderResults(search);

    await user.click(screen.getByRole('link', { name: 'Result 1' }));

    expect(store.getState().search.recentTerms).toEqual(['react']);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('remembers the term when the desktop see-all link is followed', async () => {
    const { store, user, onClose } = renderResults(makeSearch({ results: makeResults(5) }));

    await user.click(screen.getByRole('link', { name: 'See all 5 results' }));

    expect(store.getState().search.recentTerms).toEqual(['react']);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('remembers the term when the mobile see-all button is pressed', async () => {
    const { store, user, onClose } = renderResults(
      makeSearch({ results: makeResults(2) }),
      SearchVariant.Mobile,
    );

    await user.click(screen.getByRole('button', { name: 'See all 2 results' }));

    expect(store.getState().search.recentTerms).toEqual(['react']);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
