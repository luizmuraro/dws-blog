import type { Meta, StoryObj } from '@storybook/react-vite';
import FavoritesToggle from './FavoritesToggle';

const meta = {
  title: 'UI/FavoritesToggle',
  component: FavoritesToggle,
  args: { active: false, count: 3, onToggle: () => {} },
} satisfies Meta<typeof FavoritesToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Inactive: Story = {};

export const Active: Story = {
  args: { active: true },
};

export const NoFavorites: Story = {
  args: { count: 0 },
};
