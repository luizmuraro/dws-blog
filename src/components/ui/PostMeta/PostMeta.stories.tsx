import type { Meta, StoryObj } from '@storybook/react-vite';
import PostMeta from './PostMeta';

const meta = {
  title: 'UI/PostMeta',
  component: PostMeta,
  args: { items: ['Mar 5, 2024', 'Lovelace'] },
} satisfies Meta<typeof PostMeta>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleItem: Story = {
  args: { items: ['Mar 5, 2024'] },
};

export const AuthorAndDate: Story = {
  args: { items: ['Ada Lovelace', 'Mar 5, 2024'] },
};
