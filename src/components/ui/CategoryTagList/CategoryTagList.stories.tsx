import type { Meta, StoryObj } from '@storybook/react-vite';
import CategoryTagList from './CategoryTagList';

const meta = {
  title: 'UI/CategoryTagList',
  component: CategoryTagList,
  args: {
    categories: [
      { id: 'category-1', name: 'Frontend' },
      { id: 'category-2', name: 'Design' },
    ],
  },
} satisfies Meta<typeof CategoryTagList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleCategory: Story = {
  args: { categories: [{ id: 'category-1', name: 'Startups' }] },
};

export const Empty: Story = {
  args: { categories: [] },
  parameters: {
    docs: { description: { story: 'Renders nothing at all rather than an empty list.' } },
  },
};
