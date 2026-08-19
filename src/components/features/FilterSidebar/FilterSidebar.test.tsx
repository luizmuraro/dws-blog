import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FilterOption } from '@/types/ui';
import FilterSidebar from './FilterSidebar';
import FilterSidebarSkeleton from './FilterSidebarSkeleton';

const categories: FilterOption[] = [
  { id: 'Design', name: 'Design' },
  { id: 'Frontend', name: 'Frontend' },
];

const authors: FilterOption[] = [
  { id: 'author-1', name: 'Lovelace' },
  { id: 'author-2', name: 'Turing' },
];

const renderSidebar = (props: Partial<Parameters<typeof FilterSidebar>[0]> = {}) => {
  const onCategoryChange = vi.fn();
  const onAuthorChange = vi.fn();
  const user = userEvent.setup();

  const view = render(
    <FilterSidebar
      categories={categories}
      authors={authors}
      selectedCategoryIds={[]}
      selectedAuthorIds={[]}
      onCategoryChange={onCategoryChange}
      onAuthorChange={onAuthorChange}
      {...props}
    />,
  );

  return { ...view, onCategoryChange, onAuthorChange, user };
};

const categoryOption = (name: string) =>
  within(screen.getByRole('list', { name: 'Category' })).getByRole('button', { name });

const authorOption = (name: string) =>
  within(screen.getByRole('list', { name: 'Author' })).getByRole('button', { name });

describe('FilterSidebar layout', () => {
  it('names itself for assistive technology', () => {
    renderSidebar();

    expect(screen.getByRole('complementary', { name: 'Filters' })).toBeInTheDocument();
  });

  it('renders a group per dimension', () => {
    renderSidebar();

    expect(screen.getByRole('list', { name: 'Category' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Author' })).toBeInTheDocument();
  });

  it('hides a group that has no options', () => {
    renderSidebar({ authors: [] });

    expect(screen.getByRole('list', { name: 'Category' })).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Author' })).not.toBeInTheDocument();
  });

  it('reflects the applied selection on first render', () => {
    renderSidebar({ selectedCategoryIds: ['Design'] });

    expect(categoryOption('Design')).toHaveAttribute('aria-pressed', 'true');
    expect(categoryOption('Frontend')).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('FilterSidebar staging', () => {
  it('marks an option as selected without reporting it yet', async () => {
    const { user, onCategoryChange } = renderSidebar();

    await user.click(categoryOption('Design'));

    expect(categoryOption('Design')).toHaveAttribute('aria-pressed', 'true');
    expect(onCategoryChange).not.toHaveBeenCalled();
  });

  it('commits both dimensions when the filters are applied', async () => {
    const { user, onCategoryChange, onAuthorChange } = renderSidebar();

    await user.click(categoryOption('Design'));
    await user.click(authorOption('Turing'));
    await user.click(screen.getByRole('button', { name: 'Apply filters' }));

    expect(onCategoryChange).toHaveBeenCalledWith(['Design']);
    expect(onAuthorChange).toHaveBeenCalledWith(['author-2']);
  });

  it('deselects a staged option before applying', async () => {
    const { user, onCategoryChange } = renderSidebar();

    await user.click(categoryOption('Design'));
    await user.click(categoryOption('Design'));
    await user.click(screen.getByRole('button', { name: 'Apply filters' }));

    expect(onCategoryChange).toHaveBeenCalledWith([]);
  });

  it('applies an empty selection when nothing was staged', async () => {
    const { user, onCategoryChange, onAuthorChange } = renderSidebar();

    await user.click(screen.getByRole('button', { name: 'Apply filters' }));

    expect(onCategoryChange).toHaveBeenCalledWith([]);
    expect(onAuthorChange).toHaveBeenCalledWith([]);
  });

  it('resyncs the draft when the applied selection changes from outside', async () => {
    const { user, rerender } = renderSidebar();

    await user.click(categoryOption('Frontend'));
    expect(categoryOption('Frontend')).toHaveAttribute('aria-pressed', 'true');

    rerender(
      <FilterSidebar
        categories={categories}
        authors={authors}
        selectedCategoryIds={['Design']}
        selectedAuthorIds={[]}
        onCategoryChange={vi.fn()}
        onAuthorChange={vi.fn()}
      />,
    );

    expect(categoryOption('Design')).toHaveAttribute('aria-pressed', 'true');
    expect(categoryOption('Frontend')).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('FilterSidebar clearing', () => {
  it('hides the clear button while nothing is applied', () => {
    renderSidebar();

    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
  });

  it('keeps the clear button hidden while the selection is only staged', async () => {
    const { user } = renderSidebar();

    await user.click(categoryOption('Design'));

    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
  });

  it('shows the clear button once a filter is applied', () => {
    renderSidebar({ selectedAuthorIds: ['author-1'] });

    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });

  it('clears both dimensions immediately, without waiting for Apply', async () => {
    const { user, onCategoryChange, onAuthorChange } = renderSidebar({
      selectedCategoryIds: ['Design'],
      selectedAuthorIds: ['author-1'],
    });

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(onCategoryChange).toHaveBeenCalledWith([]);
    expect(onAuthorChange).toHaveBeenCalledWith([]);
    expect(categoryOption('Design')).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('FilterSidebarSkeleton', () => {
  it('is hidden from assistive technology and offers no controls', () => {
    const { container } = render(<FilterSidebarSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
