import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import PostCardSkeleton from './PostCardSkeleton';

describe('PostCardSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<PostCardSkeleton />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
