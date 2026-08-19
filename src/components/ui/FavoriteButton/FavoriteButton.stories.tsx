import type { Meta, StoryObj } from '@storybook/react-vite';
import { FavoriteButtonVariant } from '@/constants/favoriteButtonVariant';
import FavoriteButton from './FavoriteButton';

const meta = {
  title: 'UI/FavoriteButton',
  component: FavoriteButton,
  args: { postId: 'post-1' },
  parameters: {
    docs: {
      description: {
        component:
          'Reads and writes the favorites slice, so pressing it in any story updates that story own store.',
      },
    },
  },
} satisfies Meta<typeof FavoriteButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overlay: Story = {};

export const OverlayFavorited: Story = {
  parameters: { preloadedState: { favorites: { ids: ['post-1'] }, search: { recentTerms: [] } } },
};

export const Inline: Story = {
  args: { variant: FavoriteButtonVariant.Inline },
};

export const InlineFavorited: Story = {
  args: { variant: FavoriteButtonVariant.Inline },
  parameters: { preloadedState: { favorites: { ids: ['post-1'] }, search: { recentTerms: [] } } },
};
