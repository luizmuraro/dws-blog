import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryTag from './CategoryTag';

describe('CategoryTag', () => {
  it('renders the category name', () => {
    render(<CategoryTag name="Frontend" />);

    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  it('stays a plain label without a handler', () => {
    render(<CategoryTag name="Frontend" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('reports the click when a handler is given', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CategoryTag name="Frontend" onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'Frontend' }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
