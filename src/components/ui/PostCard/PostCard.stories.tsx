import type { Meta, StoryObj } from '@storybook/react-vite';
import { makeAuthor, makeCategory, makePost } from '@/test/factories';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';

const post = makePost({
  id: 'post-1',
  title: 'Understanding React hooks',
  paragraphs: [
    'Hooks let you reuse stateful logic without rewriting your component hierarchy, which keeps the tree flat and the intent visible.',
  ],
  thumbnailUrl: 'https://picsum.photos/seed/dws-card/640/360',
  author: makeAuthor({ name: 'Ada Lovelace' }),
  categories: [makeCategory({ id: 'category-1', name: 'Frontend' })],
});

const meta = {
  title: 'UI/PostCard',
  component: PostCard,
  args: { post },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Favorited: Story = {
  parameters: { preloadedState: { favorites: { ids: ['post-1'] }, search: { recentTerms: [] } } },
};

export const LongTitle: Story = {
  args: {
    post: makePost({
      ...post,
      title: 'A considerably longer headline that wraps onto three separate lines',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'The lead paragraph clamps to whatever lines the title leaves free.',
      },
    },
  },
};

export const WithoutLead: Story = {
  args: { post: makePost({ ...post, paragraphs: [] }) },
};

export const ManyCategories: Story = {
  args: {
    post: makePost({
      ...post,
      categories: [
        makeCategory({ id: 'category-1', name: 'Frontend' }),
        makeCategory({ id: 'category-2', name: 'Design' }),
        makeCategory({ id: 'category-3', name: 'Startups' }),
      ],
    }),
  },
};

export const Loading: StoryObj<typeof PostCardSkeleton> = {
  render: () => <PostCardSkeleton />,
};
