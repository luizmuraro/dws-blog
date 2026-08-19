import type { Meta, StoryObj } from '@storybook/react-vite';
import CategoryTag from './CategoryTag';

const meta = {
  title: 'UI/CategoryTag',
  component: CategoryTag,
  args: { name: 'Frontend' },
} satisfies Meta<typeof CategoryTag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongName: Story = {
  args: { name: 'Software Architecture' },
};

export const Interactive: Story = {
  args: { onClick: () => {} },
};
