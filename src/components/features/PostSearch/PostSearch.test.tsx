import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { makeApiCategory, makeApiPost } from '@/test/factories';
import { renderWithProviders } from '@/test/renderWithProviders';
import PostSearch from './PostSearch';

const LocationProbe = () => <p data-testid="location">{useLocation().search}</p>;

const posts = [
  makeApiPost({ id: 'post-1', title: 'Understanding React hooks' }),
  makeApiPost({ id: 'post-2', title: 'Design systems at scale' }),
];

const categories = [
  makeApiCategory({ id: 'category-1', name: 'Design' }),
  makeApiCategory({ id: 'category-2', name: 'Frontend' }),
];

const stubApi = () => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const payload = String(input).includes('/categories') ? categories : posts;

    return new Response(JSON.stringify(payload), { status: 200 });
  });

  vi.stubGlobal('fetch', fetchMock);
};

const renderSearch = (options?: Parameters<typeof renderWithProviders>[1]) =>
  renderWithProviders(
    <>
      <PostSearch />
      <LocationProbe />
    </>,
    options,
  );

const currentSearch = () => screen.getByTestId('location');

const desktopInput = () => screen.getAllByRole('combobox', { name: 'Search posts' })[0];

beforeEach(() => {
  stubApi();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('PostSearch desktop field', () => {
  it('renders an empty search field', () => {
    renderSearch();

    expect(desktopInput()).toHaveValue('');
  });

  it('seeds the field from the committed query', () => {
    renderSearch({ initialEntries: ['/?q=react'] });

    expect(desktopInput()).toHaveValue('react');
  });

  it('keeps the panel closed until the field is used', () => {
    renderSearch();

    expect(screen.queryByRole('heading', { name: 'Browse by category' })).not.toBeInTheDocument();
  });

  it('opens the suggestions on focus', async () => {
    const { user } = renderSearch();

    await user.click(desktopInput());

    expect(await screen.findByRole('heading', { name: 'Browse by category' })).toBeInTheDocument();
  });

  it('reports the collapsed panel to assistive tech', () => {
    renderSearch();

    expect(desktopInput()).toHaveAttribute('aria-expanded', 'false');
    expect(desktopInput()).not.toHaveAttribute('aria-controls');
  });

  it('points at the panel it opened', async () => {
    const { user } = renderSearch();

    await user.click(desktopInput());

    const panel = await screen.findByRole('dialog', { name: 'Search suggestions' });

    expect(desktopInput()).toHaveAttribute('aria-expanded', 'true');
    expect(desktopInput()).toHaveAttribute('aria-controls', panel.id);
  });

  it('swaps suggestions for results once the query is long enough', async () => {
    const { user } = renderSearch();

    await user.type(desktopInput(), 'react');

    expect(await screen.findByRole('heading', { name: 'Posts' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Browse by category' })).not.toBeInTheDocument();
  });

  it('closes the panel on Escape', async () => {
    const { user } = renderSearch();

    await user.click(desktopInput());
    expect(await screen.findByRole('heading', { name: 'Browse by category' })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('heading', { name: 'Browse by category' })).not.toBeInTheDocument();
  });
});

describe('PostSearch submitting', () => {
  it('navigates to the results and remembers the term', async () => {
    const { store, user } = renderSearch();

    await user.type(desktopInput(), 'react{Enter}');

    await waitFor(() => expect(currentSearch()).toHaveTextContent('?q=react'));
    expect(store.getState().search.recentTerms).toEqual(['react']);
    expect(desktopInput()).toHaveValue('react');
  });

  it('trims the term before committing it', async () => {
    const { store, user } = renderSearch();

    await user.type(desktopInput(), '  react  {Enter}');

    await waitFor(() => expect(store.getState().search.recentTerms).toEqual(['react']));
  });

  it('ignores a submit with an empty term', async () => {
    const { store, user } = renderSearch();

    await user.click(desktopInput());
    await user.keyboard('{Enter}');

    expect(store.getState().search.recentTerms).toEqual([]);
  });

  it('closes the panel after submitting', async () => {
    const { user } = renderSearch();

    await user.type(desktopInput(), 'react');
    expect(await screen.findByRole('heading', { name: 'Posts' })).toBeInTheDocument();

    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Posts' })).not.toBeInTheDocument(),
    );
  });
});

describe('PostSearch suggestions', () => {
  it('runs a recent search when it is picked', async () => {
    const { store, user } = renderSearch({
      preloadedState: { search: { recentTerms: ['design'] } },
    });

    await user.click(desktopInput());
    await user.click(await screen.findByRole('button', { name: 'design' }));

    await waitFor(() => expect(desktopInput()).toHaveValue('design'));
    expect(store.getState().search.recentTerms).toEqual(['design']);
  });

  it('browses a category instead of searching for it', async () => {
    const { user } = renderSearch();

    await user.click(desktopInput());
    await user.click(await screen.findByRole('button', { name: 'Frontend' }));

    await waitFor(() => expect(currentSearch()).toHaveTextContent('?category=Frontend'));
    expect(desktopInput()).toHaveValue('');
    expect(screen.queryByRole('heading', { name: 'Browse by category' })).not.toBeInTheDocument();
  });
});

describe('PostSearch mobile', () => {
  it('starts collapsed behind a trigger', () => {
    renderSearch();

    expect(screen.getByRole('button', { name: 'Open search' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('button', { name: 'Close search' })).not.toBeInTheDocument();
  });

  it('expands into its own field', async () => {
    const { user } = renderSearch();

    await user.click(screen.getByRole('button', { name: 'Open search' }));

    expect(screen.getByRole('button', { name: 'Close search' })).toBeInTheDocument();
    expect(screen.getAllByRole('combobox', { name: 'Search posts' })).toHaveLength(2);
  });

  it('clears the field without collapsing', async () => {
    const { user } = renderSearch({ initialEntries: ['/?q=react'] });

    await user.click(screen.getByRole('button', { name: 'Open search' }));
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(desktopInput()).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Close search' })).toBeInTheDocument();
  });

  it('restores the committed term when it collapses', async () => {
    const { user } = renderSearch({ initialEntries: ['/?q=react'] });

    await user.click(screen.getByRole('button', { name: 'Open search' }));
    await user.clear(screen.getAllByRole('combobox', { name: 'Search posts' })[1]);
    await user.click(screen.getByRole('button', { name: 'Close search' }));

    expect(desktopInput()).toHaveValue('react');
  });
});

describe('PostSearch announcements', () => {
  it('announces the settled result count', async () => {
    const { user } = renderSearch();

    await user.type(desktopInput(), 'react');

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('1 result for react'));
  });

  it('stays silent while there is no query', () => {
    renderSearch();

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('shows the count next to the field', async () => {
    const { user } = renderSearch();

    await user.type(desktopInput(), 'react');

    await waitFor(() =>
      expect(within(screen.getAllByRole('search')[0]).getByText('1 result')).toBeInTheDocument(),
    );
  });
});
