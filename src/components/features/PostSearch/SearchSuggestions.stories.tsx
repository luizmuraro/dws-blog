import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchVariant } from '@/constants/searchVariant';
import { makeCategory } from '@/test/factories';
import SearchSuggestions from './SearchSuggestions';

const SearchFieldFrame = ({ children }: { children: ReactNode }) => (
  <div style={{ paddingBottom: '26rem' }}>
    <div style={{ position: 'relative', width: 'min(33.5rem, 100%)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '3.5rem',
          padding: '0 var(--space-16)',
          color: 'var(--color-neutral-dark)',
          backgroundColor: 'var(--color-neutral-white)',
          border: '1px solid var(--color-neutral-extra-light)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: '0 3px 18.1px rgb(91 123 193 / 29%)',
        }}
      >
        Search
      </div>
      {children}
    </div>
  </div>
);

const categories = {
  categories: [
    makeCategory({ id: 'category-1', name: 'Design' }),
    makeCategory({ id: 'category-2', name: 'Frontend' }),
    makeCategory({ id: 'category-3', name: 'Startups' }),
  ],
  isLoading: false,
};

const withRecent = (recentTerms: string[]) => ({
  preloadedState: { favorites: { ids: [] }, search: { recentTerms } },
});

const meta = {
  title: 'Features/SearchSuggestions',
  component: SearchSuggestions,
  args: {
    variant: SearchVariant.Desktop,
    categories,
    onSelectTerm: () => {},
    onSelectCategory: () => {},
    onClose: () => {},
  },
  decorators: [(Story) => <SearchFieldFrame>{Story()}</SearchFieldFrame>],
  parameters: {
    layout: 'padded',
    ...withRecent(['react', 'design systems', 'testing']),
    docs: {
      description: {
        component:
          'The panel is absolutely positioned under the search field, so these stories reproduce the field as its containing block.',
      },
    },
  },
} satisfies Meta<typeof SearchSuggestions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = {
  args: { variant: SearchVariant.Mobile },
  parameters: {
    docs: { description: { story: 'Drops the footer, which is desktop only.' } },
  },
};

export const CategoriesOnly: Story = {
  parameters: withRecent([]),
};

export const RecentOnly: Story = {
  args: { categories: { categories: [], isLoading: false } },
};

export const LoadingCategories: Story = {
  args: { categories: { categories: [], isLoading: true } },
};
