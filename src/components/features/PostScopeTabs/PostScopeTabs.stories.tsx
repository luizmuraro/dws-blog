import type { Meta, StoryObj } from '@storybook/react-vite';
import PostScopeTabs from './PostScopeTabs';
import PostScopeTabsSkeleton from './PostScopeTabsSkeleton';

const meta = {
  title: 'Features/PostScopeTabs',
  component: PostScopeTabs,
  args: {
    allCount: 24,
    favoritesCount: 2,
    showFavoritesOnly: false,
    onShowFavoritesOnlyChange: () => {},
  },
  globals: { viewport: { value: 'ipad' } },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Mobile and tablet only: from 1024px up the tabs are hidden and the toolbar favorites pill takes over, so these stories render at a tablet viewport.',
      },
    },
  },
} satisfies Meta<typeof PostScopeTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllPosts: Story = {};

export const FavoritesActive: Story = {
  args: { showFavoritesOnly: true },
};

export const NoFavorites: Story = {
  args: { favoritesCount: 0 },
};

export const Loading: StoryObj<typeof PostScopeTabsSkeleton> = {
  render: () => <PostScopeTabsSkeleton />,
};
