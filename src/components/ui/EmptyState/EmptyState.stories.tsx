import type { Meta, StoryObj } from '@storybook/react-vite';
import EmptyState from './EmptyState';

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  args: { message: 'No posts found' },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSearchTerm: Story = {
  args: { message: 'No posts found for “kubernetes”' },
};

export const NoFavoritesYet: Story = {
  args: {
    message: 'You have not favorited any posts yet. Tap the star on a post to save it here.',
  },
};
