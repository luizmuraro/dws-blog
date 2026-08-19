import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders the message', () => {
    render(<EmptyState message="No posts found" />);

    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });

  it('renders the message inside a paragraph', () => {
    const { container } = render(<EmptyState message="No posts found" />);

    expect(container.querySelector('p')).toHaveTextContent('No posts found');
  });
});
