import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterSidebar from './FilterSidebar';
import FilterSidebarSkeleton from './FilterSidebarSkeleton';

const categories = [
  { id: 'Design', name: 'Design' },
  { id: 'Frontend', name: 'Frontend' },
  { id: 'Startups', name: 'Startups' },
];

const authors = [
  { id: 'author-1', name: 'Lovelace' },
  { id: 'author-2', name: 'Turing' },
  { id: 'author-3', name: 'Hopper' },
];

const meta = {
  title: 'Features/FilterSidebar',
  component: FilterSidebar,
  args: {
    categories,
    authors,
    selectedCategoryIds: [],
    selectedAuthorIds: [],
    onCategoryChange: () => {},
    onAuthorChange: () => {},
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Selections are staged locally: pressing an option only updates the draft, Apply commits it, and Clear resets both dimensions immediately.',
      },
    },
  },
} satisfies Meta<typeof FilterSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAppliedFilters: Story = {
  args: { selectedCategoryIds: ['Design'], selectedAuthorIds: ['author-1'] },
  parameters: {
    docs: { description: { story: 'Only an applied filter reveals the Clear filters button.' } },
  },
};

export const CategoriesOnly: Story = {
  args: { authors: [] },
};

export const Loading: StoryObj<typeof FilterSidebarSkeleton> = {
  render: () => <FilterSidebarSkeleton />,
};
