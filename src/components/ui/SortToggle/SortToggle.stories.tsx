import type { Meta, StoryObj } from '@storybook/react-vite';
import { SortOrder } from '@/constants/sortOrder';
import SortToggle from './SortToggle';
import SortToggleSkeleton from './SortToggleSkeleton';

const meta = {
  title: 'UI/SortToggle',
  component: SortToggle,
  args: { order: SortOrder.Newest, onToggle: () => {} },
} satisfies Meta<typeof SortToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NewestFirst: Story = {};

export const OldestFirst: Story = {
  args: { order: SortOrder.Oldest },
};

export const Loading: StoryObj<typeof SortToggleSkeleton> = {
  render: () => <SortToggleSkeleton />,
};
