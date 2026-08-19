import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterBar from './FilterBar';
import FilterBarSkeleton from './FilterBarSkeleton';

const categories = [
  { id: 'Design', name: 'Design' },
  { id: 'Frontend', name: 'Frontend' },
  { id: 'Startups', name: 'Startups' },
];

const authors = [
  { id: 'author-1', name: 'Lovelace' },
  { id: 'author-2', name: 'Turing' },
];

const meta = {
  title: 'Features/FilterBar',
  component: FilterBar,
  args: {
    categories,
    authors,
    selectedCategoryIds: [],
    selectedAuthorIds: [],
    showFavoritesOnly: false,
    favoritesCount: 0,
    onCategoryChange: () => {},
    onAuthorChange: () => {},
    onFavoritesOnlyChange: () => {},
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FilterBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { selectedCategoryIds: ['Design'], selectedAuthorIds: ['author-2'] },
};

export const FavoritesActive: Story = {
  args: { showFavoritesOnly: true, favoritesCount: 4 },
};

export const Loading: StoryObj<typeof FilterBarSkeleton> = {
  render: () => <FilterBarSkeleton />,
};
