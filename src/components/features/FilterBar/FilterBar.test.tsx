import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FilterOption } from '@/types/ui';
import FilterBar from './FilterBar';
import FilterBarSkeleton from './FilterBarSkeleton';

const categories: FilterOption[] = [
  { id: 'Design', name: 'Design' },
  { id: 'Frontend', name: 'Frontend' },
];

const authors: FilterOption[] = [
  { id: 'author-1', name: 'Lovelace' },
  { id: 'author-2', name: 'Turing' },
];

const renderBar = (props: Partial<Parameters<typeof FilterBar>[0]> = {}) => {
  const onCategoryChange = vi.fn();
  const onAuthorChange = vi.fn();
  const user = userEvent.setup();

  render(
    <FilterBar
      categories={categories}
      authors={authors}
      selectedCategoryIds={[]}
      selectedAuthorIds={[]}
      onCategoryChange={onCategoryChange}
      onAuthorChange={onAuthorChange}
      {...props}
    />,
  );

  return { onCategoryChange, onAuthorChange, user };
};

describe('FilterBar', () => {
  it('groups the controls under a single accessible name', () => {
    renderBar();

    expect(screen.getByRole('group', { name: 'Filters' })).toBeInTheDocument();
  });

  it('renders a dropdown per dimension', () => {
    renderBar();

    expect(screen.getByRole('button', { name: 'Category' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Author' })).toBeInTheDocument();
  });

  it('leaves the favorites scope to the tabs above it', () => {
    renderBar();

    expect(screen.queryByRole('button', { name: /Favorites/ })).not.toBeInTheDocument();
  });

  it('reports a category selection', async () => {
    const { user, onCategoryChange } = renderBar();

    await user.click(screen.getByRole('button', { name: 'Category' }));
    await user.click(
      within(screen.getByRole('list', { name: 'Category' })).getByRole('button', {
        name: 'Design',
      }),
    );

    expect(onCategoryChange).toHaveBeenCalledWith(['Design']);
  });

  it('reports an author selection', async () => {
    const { user, onAuthorChange } = renderBar();

    await user.click(screen.getByRole('button', { name: 'Author' }));
    await user.click(
      within(screen.getByRole('list', { name: 'Author' })).getByRole('button', {
        name: 'Turing',
      }),
    );

    expect(onAuthorChange).toHaveBeenCalledWith(['author-2']);
  });

  it('shows the current selection on each trigger', () => {
    renderBar({ selectedCategoryIds: ['Design'], selectedAuthorIds: ['author-1'] });

    expect(screen.getByRole('button', { name: 'Design' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lovelace' })).toBeInTheDocument();
  });
});

describe('FilterBarSkeleton', () => {
  it('is hidden from assistive technology and offers no controls', () => {
    const { container } = render(<FilterBarSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
