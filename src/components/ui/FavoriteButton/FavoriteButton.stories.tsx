import type { Meta, StoryObj } from '@storybook/react-vite';
import { FavoriteButtonVariant } from '@/constants/favoriteButtonVariant';
import FavoriteButton from './FavoriteButton';

const meta = {
  title: 'UI/FavoriteButton',
  component: FavoriteButton,
  args: { isFavorite: false, onToggle: () => {} },
  parameters: {
    docs: {
      description: {
        component:
          'Renders from its props alone. The favorites slice is bound by useFavorite in whatever composes it.',
      },
    },
  },
} satisfies Meta<typeof FavoriteButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overlay: Story = {};

export const OverlayFavorited: Story = {
  args: { isFavorite: true },
};

export const Inline: Story = {
  args: { variant: FavoriteButtonVariant.Inline },
};

export const InlineFavorited: Story = {
  args: { variant: FavoriteButtonVariant.Inline, isFavorite: true },
};
