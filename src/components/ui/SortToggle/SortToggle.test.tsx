import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortOrder } from '@/constants/sortOrder';
import SortToggle from './SortToggle';
import SortToggleSkeleton from './SortToggleSkeleton';

describe('SortToggle', () => {
  it('labels the newest order', () => {
    render(<SortToggle order={SortOrder.Newest} onToggle={() => {}} />);

    expect(screen.getByRole('button', { name: /Newest first/ })).toBeInTheDocument();
  });

  it('labels the oldest order', () => {
    render(<SortToggle order={SortOrder.Oldest} onToggle={() => {}} />);

    expect(screen.getByRole('button', { name: /Oldest first/ })).toBeInTheDocument();
  });

  it('renders the sort prefix', () => {
    render(<SortToggle order={SortOrder.Newest} onToggle={() => {}} />);

    expect(screen.getByText('Sort by:')).toBeInTheDocument();
  });

  it('calls onToggle when pressed', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(<SortToggle order={SortOrder.Newest} onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledOnce();
  });
});

describe('SortToggleSkeleton', () => {
  it('renders without a control to interact with', () => {
    render(<SortToggleSkeleton />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
