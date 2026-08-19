import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FilterOption } from '@/types/ui';
import FilterDropdown from './FilterDropdown';

const options: FilterOption[] = [
  { id: 'Design', name: 'Design' },
  { id: 'Frontend', name: 'Frontend' },
];

const renderDropdown = (props: Partial<Parameters<typeof FilterDropdown>[0]> = {}) => {
  const onChange = vi.fn();
  const user = userEvent.setup();

  render(
    <FilterDropdown
      label="Category"
      options={options}
      selectedIds={[]}
      onChange={onChange}
      {...props}
    />,
  );

  return {
    onChange,
    user,
    trigger: screen.getByRole('button', { name: /Category|Design|Frontend/ }),
  };
};

describe('FilterDropdown trigger', () => {
  it('shows the label while nothing is selected', () => {
    renderDropdown();

    expect(screen.getByRole('button', { name: 'Category' })).toBeInTheDocument();
  });

  it('shows the selected names instead of the label', () => {
    renderDropdown({ selectedIds: ['Design', 'Frontend'] });

    expect(screen.getByRole('button', { name: 'Design, Frontend' })).toBeInTheDocument();
  });

  it('starts collapsed', () => {
    const { trigger } = renderDropdown();

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('points at the panel it controls', async () => {
    const { trigger, user } = renderDropdown();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('list', { name: 'Category' })).toHaveAttribute(
      'id',
      trigger.getAttribute('aria-controls'),
    );
  });
});

describe('FilterDropdown panel', () => {
  it('lists every option once opened', async () => {
    const { trigger, user } = renderDropdown();

    await user.click(trigger);

    expect(screen.getByRole('button', { name: 'Design' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Frontend' })).toBeInTheDocument();
  });

  it('marks the selected options as pressed', async () => {
    const { trigger, user } = renderDropdown({ selectedIds: ['Design'] });

    await user.click(trigger);

    // The trigger shows the selected name too, so the options are scoped to the panel.
    const panel = within(screen.getByRole('list', { name: 'Category' }));

    expect(panel.getByRole('button', { name: 'Design' })).toHaveAttribute('aria-pressed', 'true');
    expect(panel.getByRole('button', { name: 'Frontend' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('adds an option to the selection', async () => {
    const { trigger, user, onChange } = renderDropdown();

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Design' }));

    expect(onChange).toHaveBeenCalledWith(['Design']);
  });

  it('removes an option that was already selected', async () => {
    const { trigger, user, onChange } = renderDropdown({ selectedIds: ['Design', 'Frontend'] });

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Design' }));

    expect(onChange).toHaveBeenCalledWith(['Frontend']);
  });

  it('closes when clicking outside', async () => {
    const { trigger, user } = renderDropdown();

    await user.click(trigger);
    await user.click(document.body);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const { trigger, user } = renderDropdown();

    await user.click(trigger);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe('FilterDropdown clear button', () => {
  it('is hidden while nothing is selected', () => {
    renderDropdown();

    expect(screen.queryByRole('button', { name: 'Clear category filter' })).not.toBeInTheDocument();
  });

  it('appears once something is selected', () => {
    renderDropdown({ selectedIds: ['Design'] });

    expect(screen.getByRole('button', { name: 'Clear category filter' })).toBeInTheDocument();
  });

  it('lowercases the label in its accessible name', () => {
    renderDropdown({ label: 'Author', selectedIds: ['Design'] });

    expect(screen.getByRole('button', { name: 'Clear author filter' })).toBeInTheDocument();
  });

  it('clears the selection and closes the panel', async () => {
    const { trigger, user, onChange } = renderDropdown({ selectedIds: ['Design'] });

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Clear category filter' }));

    expect(onChange).toHaveBeenCalledWith([]);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
