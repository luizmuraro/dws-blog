import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategoryTag from './CategoryTag';

describe('CategoryTag', () => {
  it('renders the category name', () => {
    render(<CategoryTag name="Frontend" />);

    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });
});
