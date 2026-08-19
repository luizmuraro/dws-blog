import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostMeta from './PostMeta';

describe('PostMeta', () => {
  it('renders every item', () => {
    render(<PostMeta items={['Mar 5, 2024', 'Lovelace']} />);

    expect(screen.getByText('Mar 5, 2024')).toBeInTheDocument();
    expect(screen.getByText('Lovelace')).toBeInTheDocument();
  });

  it('puts a separator between items but not before the first', () => {
    const { container } = render(<PostMeta items={['one', 'two', 'three']} />);

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });

  it('renders no separator for a single item', () => {
    const { container } = render(<PostMeta items={['only']} />);

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });

  it('renders nothing visible for an empty list', () => {
    const { container } = render(<PostMeta items={[]} />);

    expect(container.querySelector('p')).toBeEmptyDOMElement();
  });
});
