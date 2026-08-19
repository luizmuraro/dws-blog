import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from './ErrorState';

describe('ErrorState', () => {
  it('announces itself as an alert with the message', () => {
    render(<ErrorState message="We could not load the posts." onRetry={() => {}} />);

    expect(screen.getByRole('alert')).toHaveTextContent('We could not load the posts.');
  });

  it('calls onRetry when the retry button is pressed', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    render(<ErrorState message="Something failed" onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
