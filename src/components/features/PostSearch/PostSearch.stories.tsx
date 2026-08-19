import { useLayoutEffect, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { makeApiCategory, makeApiPost } from '@/test/factories';
import PostSearch from './PostSearch';

const posts = [
  makeApiPost({ id: 'post-1', title: 'Understanding React hooks' }),
  makeApiPost({ id: 'post-2', title: 'Design systems at scale' }),
  makeApiPost({ id: 'post-3', title: 'Testing React in practice' }),
  makeApiPost({ id: 'post-4', title: 'Hooks beyond state' }),
];

const categories = [
  makeApiCategory({ id: 'category-1', name: 'Design' }),
  makeApiCategory({ id: 'category-2', name: 'Frontend' }),
  makeApiCategory({ id: 'category-3', name: 'Startups' }),
];

// Both panels fetch on demand, so the story serves posts and categories itself.
const withApi: Decorator = function WithApi(Story) {
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const original = window.fetch;

    window.fetch = async (input) => {
      const payload = String(input).includes('/categories') ? categories : posts;

      return new Response(JSON.stringify(payload), { status: 200 });
    };
    setIsReady(true);

    return () => {
      window.fetch = original;
    };
  }, []);

  return isReady ? <Story /> : <></>;
};

const meta = {
  title: 'Features/PostSearch',
  component: PostSearch,
  decorators: [withApi],
  parameters: {
    layout: 'padded',
    preloadedState: {
      favorites: { ids: [] },
      search: { recentTerms: ['react', 'design systems'] },
    },
    docs: {
      description: {
        component:
          'Focus the field to see the suggestions panel, then type at least two characters to swap it for results.',
      },
    },
  },
} satisfies Meta<typeof PostSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCommittedQuery: Story = {
  parameters: {
    route: '/?q=react',
    docs: { description: { story: 'The field is seeded from the query already in the url.' } },
  },
};

export const WithoutRecentSearches: Story = {
  parameters: {
    preloadedState: { favorites: { ids: [] }, search: { recentTerms: [] } },
  },
};
