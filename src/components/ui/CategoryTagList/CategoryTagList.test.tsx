import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { makeCategory } from '@/test/factories';
import CategoryTagList from './CategoryTagList';

describe('CategoryTagList', () => {
  it('renders one item per category', () => {
    render(
      <CategoryTagList
        categories={[
          makeCategory({ id: 'category-1', name: 'Frontend' }),
          makeCategory({ id: 'category-2', name: 'Design' }),
        ]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });

  it('renders nothing when there are no categories', () => {
    const { container } = render(<CategoryTagList categories={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('keeps categories that share a name but not an id', () => {
    render(
      <CategoryTagList
        categories={[
          makeCategory({ id: 'category-1', name: 'Frontend' }),
          makeCategory({ id: 'category-2', name: 'Frontend' }),
        ]}
      />,
    );

    expect(screen.getAllByText('Frontend')).toHaveLength(2);
  });
});
