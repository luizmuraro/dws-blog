import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavoritesToggle from './FavoritesToggle';

describe('FavoritesToggle', () => {
  it('renders the label and the count', () => {
    render(<FavoritesToggle active={false} count={3} onToggle={() => {}} />);

    const toggle = screen.getByRole('button');

    expect(toggle).toHaveTextContent('Favorites');
    expect(toggle).toHaveTextContent('3');
  });

  it('is not pressed while it is inactive', () => {
    render(<FavoritesToggle active={false} count={0} onToggle={() => {}} />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('is pressed while it is active', () => {
    render(<FavoritesToggle active count={1} onToggle={() => {}} />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onToggle when pressed', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(<FavoritesToggle active={false} count={0} onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledOnce();
  });
});
