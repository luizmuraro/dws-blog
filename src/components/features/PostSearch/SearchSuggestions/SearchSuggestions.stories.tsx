import type { Meta, StoryObj } from '@storybook/react-vite';
import { withSearchFieldFrame } from '#storybook/decorators';
import { SearchVariant } from '@/constants/searchVariant';
import { makeCategory } from '@/test/factories';
import SearchSuggestions from './SearchSuggestions';

const categories = [
  makeCategory({ id: 'category-1', name: 'Design' }),
  makeCategory({ id: 'category-2', name: 'Frontend' }),
  makeCategory({ id: 'category-3', name: 'Startups' }),
];

const withRecent = (recentTerms: string[]) => ({
  preloadedState: { favorites: { ids: [] }, search: { recentTerms } },
});

const meta = {
  title: 'Features/SearchSuggestions',
  component: SearchSuggestions,
  args: {
    id: 'search-panel',
    variant: SearchVariant.Desktop,
    categories,
    isCategoriesLoading: false,
    onSelectTerm: () => {},
    onSelectCategory: () => {},
    onClose: () => {},
  },
  decorators: [withSearchFieldFrame('26rem')],
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
  args: { categories: [] },
};

export const LoadingCategories: Story = {
  args: { categories: [], isCategoriesLoading: true },
};
