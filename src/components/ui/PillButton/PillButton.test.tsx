import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PillButton from './PillButton';

describe('PillButton', () => {
  it('renders its children', () => {
    render(<PillButton>See all results</PillButton>);

    expect(screen.getByRole('button', { name: 'See all results' })).toBeInTheDocument();
  });

  it('defaults to a non-submitting button', () => {
    render(<PillButton>Apply filters</PillButton>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('lets the caller override the type', () => {
    render(<PillButton type="submit">Search</PillButton>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('forwards the remaining button props', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <PillButton onClick={onClick} aria-label="Apply" disabled={false}>
        Apply
      </PillButton>,
    );
    await user.click(screen.getByRole('button', { name: 'Apply' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('can be disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <PillButton onClick={onClick} disabled>
        Apply
      </PillButton>,
    );
    await user.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});
