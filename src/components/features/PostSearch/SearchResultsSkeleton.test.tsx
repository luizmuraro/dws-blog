import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import SearchResultsSkeleton from './SearchResultsSkeleton';

describe('SearchResultsSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<SearchResultsSkeleton count={3} />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders one placeholder per requested row', () => {
    const { container } = render(<SearchResultsSkeleton count={4} />);

    expect(container.firstElementChild?.children).toHaveLength(4);
  });
});
