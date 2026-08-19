import type { Meta, StoryObj } from '@storybook/react-vite';
import ErrorState from './ErrorState';

const meta = {
  title: 'UI/ErrorState',
  component: ErrorState,
  args: { message: 'We could not load the posts.', onRetry: () => {} },
} satisfies Meta<typeof ErrorState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PostDetail: Story = {
  args: { message: 'We could not load this post.' },
};
