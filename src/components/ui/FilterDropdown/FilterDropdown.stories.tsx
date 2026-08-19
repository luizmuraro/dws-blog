import type { Meta, StoryObj } from '@storybook/react-vite';
import FilterDropdown from './FilterDropdown';

const categories = [
  { id: 'Frontend', name: 'Frontend' },
  { id: 'Design', name: 'Design' },
  { id: 'Startups', name: 'Startups' },
];

const meta = {
  title: 'UI/FilterDropdown',
  component: FilterDropdown,
  args: {
    label: 'Category',
    options: categories,
    selectedIds: [],
    onChange: () => {},
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FilterDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const WithSelection: Story = {
  args: { selectedIds: ['Design'] },
  parameters: {
    docs: {
      description: {
        story: 'The trigger swaps the label for the selection and reveals the clear button.',
      },
    },
  },
};

export const MultipleSelected: Story = {
  args: { selectedIds: ['Design', 'Frontend'] },
};

export const Authors: Story = {
  args: {
    label: 'Author',
    options: [
      { id: 'author-1', name: 'Lovelace' },
      { id: 'author-2', name: 'Turing' },
    ],
  },
};
