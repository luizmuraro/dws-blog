import type { Meta, StoryObj } from '@storybook/react-vite';
import { makeAuthor, makeCategory, makePost } from '@/test/factories';
import PostArticle from './PostArticle';
import PostArticleSkeleton from './PostArticleSkeleton';

const post = makePost({
  id: 'post-1',
  title: 'Understanding React hooks',
  paragraphs: [
    'Hooks let you reuse stateful logic without rewriting your component hierarchy, which keeps the tree flat and the intent visible.',
    'The rules are few but strict: call them at the top level, and only from React functions. Everything else follows from those two.',
    'In practice the hard part is not writing a hook, it is deciding what belongs inside one and what should stay in the component.',
  ],
  thumbnailUrl: 'https://picsum.photos/seed/dws-article/1200/525',
  publishedAt: '2024-03-05T12:00:00.000Z',
  author: makeAuthor({
    name: 'Ada Lovelace',
    profilePicture: 'https://picsum.photos/seed/dws-author/96/96',
  }),
  categories: [makeCategory({ id: 'category-1', name: 'Frontend' })],
});

const meta = {
  title: 'Features/PostArticle',
  component: PostArticle,
  args: { post },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PostArticle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Favorited: Story = {
  parameters: { preloadedState: { favorites: { ids: ['post-1'] }, search: { recentTerms: [] } } },
};

export const ShortPost: Story = {
  args: { post: makePost({ ...post, paragraphs: [post.paragraphs[0]] }) },
};

export const Loading: StoryObj<typeof PostArticleSkeleton> = {
  render: () => <PostArticleSkeleton />,
};
