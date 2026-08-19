import type { Meta, StoryObj } from '@storybook/react-vite';
import { makeAuthor, makeCategory, makePost } from '@/test/factories';
import SearchResultItem from './SearchResultItem';

const post = makePost({
  id: 'post-1',
  title: 'Understanding React hooks',
  thumbnailUrl: 'https://picsum.photos/seed/dws-result/160/160',
  publishedAt: '2024-03-05T12:00:00.000Z',
  author: makeAuthor({ name: 'Ada Lovelace' }),
  categories: [makeCategory({ id: 'category-1', name: 'Frontend' })],
});

const meta = {
  title: 'Features/SearchResultItem',
  component: SearchResultItem,
  args: { post, query: 'hooks', onSelect: () => {} },
  parameters: { layout: 'padded', backgrounds: { value: 'surface' } },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchResultItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutHighlight: Story = {
  args: { query: '' },
};

export const ManyCategories: Story = {
  args: {
    post: makePost({
      ...post,
      categories: [
        makeCategory({ id: 'category-1', name: 'Frontend' }),
        makeCategory({ id: 'category-2', name: 'Design' }),
      ],
    }),
  },
};
