import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { SearchVariant } from '@/constants/searchVariant';
import type { UseCategoriesResult } from '@/hooks';
import { makeCategory } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';
import SearchSuggestions from './SearchSuggestions';

const loadedCategories: UseCategoriesResult = {
  categories: [
    makeCategory({ id: 'category-1', name: 'Design' }),
    makeCategory({ id: 'category-2', name: 'Frontend' }),
  ],
  isLoading: false,
};

const emptyCategories: UseCategoriesResult = { categories: [], isLoading: false };

interface RenderOptions {
  categories?: UseCategoriesResult;
  recentTerms?: string[];
  variant?: SearchVariant;
}

const renderSuggestions = ({
  categories = loadedCategories,
  recentTerms = [],
  variant = SearchVariant.Desktop,
}: RenderOptions = {}) => {
  const onSelectTerm = vi.fn();
  const onSelectCategory = vi.fn();
  const onClose = vi.fn();

  return {
    onSelectTerm,
    onSelectCategory,
    onClose,
    ...renderWithProviders(
      <SearchSuggestions
        variant={variant}
        categories={categories}
        onSelectTerm={onSelectTerm}
        onSelectCategory={onSelectCategory}
        onClose={onClose}
      />,
      { preloadedState: { search: { recentTerms } } },
    ),
  };
};

describe('SearchSuggestions visibility', () => {
  it('renders nothing without recent searches and without categories', () => {
    const { container } = renderSuggestions({ categories: emptyCategories });

    expect(container).toBeEmptyDOMElement();
  });

  it('renders for recent searches alone', () => {
    renderSuggestions({ categories: emptyCategories, recentTerms: ['react'] });

    expect(screen.getByRole('heading', { name: 'Recent searches' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Browse by category' })).not.toBeInTheDocument();
  });

  it('renders for categories alone', () => {
    renderSuggestions();

    expect(screen.getByRole('heading', { name: 'Browse by category' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Recent searches' })).not.toBeInTheDocument();
  });

  it('renders while the categories are still loading', () => {
    renderSuggestions({ categories: { categories: [], isLoading: true } });

    expect(screen.getByRole('heading', { name: 'Browse by category' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Design' })).not.toBeInTheDocument();
  });
});

describe('SearchSuggestions recent searches', () => {
  it('lists the stored terms', () => {
    renderSuggestions({ recentTerms: ['react', 'design'] });

    expect(screen.getByRole('button', { name: 'react' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'design' })).toBeInTheDocument();
  });

  it('reports the term the user picked', async () => {
    const { user, onSelectTerm } = renderSuggestions({ recentTerms: ['react'] });

    await user.click(screen.getByRole('button', { name: 'react' }));

    expect(onSelectTerm).toHaveBeenCalledWith('react');
  });

  it('removes a single term from the store', async () => {
    const { store, user } = renderSuggestions({ recentTerms: ['react', 'design'] });

    await user.click(screen.getByRole('button', { name: 'Remove “react” from recent searches' }));

    expect(store.getState().search.recentTerms).toEqual(['design']);
  });

  it('clears every term from the store', async () => {
    const { store, user } = renderSuggestions({ recentTerms: ['react', 'design'] });

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(store.getState().search.recentTerms).toEqual([]);
    expect(screen.queryByRole('heading', { name: 'Recent searches' })).not.toBeInTheDocument();
  });
});

describe('SearchSuggestions categories', () => {
  it('offers a chip per category', () => {
    renderSuggestions();

    expect(screen.getByRole('button', { name: 'Design' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Frontend' })).toBeInTheDocument();
  });

  it('reports the category the user picked', async () => {
    const { user, onSelectCategory } = renderSuggestions();

    await user.click(screen.getByRole('button', { name: 'Design' }));

    expect(onSelectCategory).toHaveBeenCalledWith('Design');
  });
});

describe('SearchSuggestions footer', () => {
  it('offers the browse link on desktop', async () => {
    const { user, onClose } = renderSuggestions();
    const browse = screen.getByRole('link', { name: 'Browse all posts' });

    expect(browse).toHaveAttribute('href', '/');

    await user.click(browse);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('drops the footer on mobile', () => {
    renderSuggestions({ variant: SearchVariant.Mobile });

    expect(screen.queryByRole('link', { name: 'Browse all posts' })).not.toBeInTheDocument();
  });
});
