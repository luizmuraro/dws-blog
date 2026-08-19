import type { Meta, StoryObj } from '@storybook/react-vite';
import { withSearchFieldFrame } from '#storybook/decorators';
import { SearchVariant } from '@/constants/searchVariant';
import type { UsePostSearchResult } from '@/hooks';
import { makePost } from '@/test/factories';
import SearchResults from './SearchResults';

const results = Array.from({ length: 5 }, (_, index) =>
  makePost({
    id: `post-${index + 1}`,
    title: `Understanding React hooks, part ${index + 1}`,
    thumbnailUrl: `https://picsum.photos/seed/dws-search-${index}/160/160`,
  }),
);

const search = (overrides: Partial<UsePostSearchResult> = {}): UsePostSearchResult => ({
  term: 'react',
  results,
  isLoading: false,
  isPending: false,
  hasQuery: true,
  error: null,
  retry: () => {},
  ...overrides,
});

const meta = {
  title: 'Features/SearchResults',
  component: SearchResults,
  args: {
    variant: SearchVariant.Desktop,
    search: search(),
    resultsPath: '/?q=react',
    onClose: () => {},
  },
  decorators: [withSearchFieldFrame('30rem')],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The panel is absolutely positioned under the search field, so these stories reproduce the field as its containing block.',
      },
    },
  },
} satisfies Meta<typeof SearchResults>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  parameters: {
    docs: { description: { story: 'Previews three results and links to the rest.' } },
  },
};

export const DesktopWithoutOverflow: Story = {
  args: { search: search({ results: results.slice(0, 2) }) },
  parameters: {
    docs: { description: { story: 'No footer, because everything already fits the preview.' } },
  },
};

export const Mobile: Story = {
  args: { variant: SearchVariant.Mobile },
  parameters: {
    docs: { description: { story: 'Previews four results and always offers the see-all button.' } },
  },
};

export const Loading: Story = {
  args: { search: search({ isLoading: true, results: [] }) },
};

export const Pending: Story = {
  args: { search: search({ isPending: true }) },
  parameters: {
    docs: {
      description: {
        story: 'The typed term has not settled yet, so placeholders stand in for stale results.',
      },
    },
  },
};

export const Empty: Story = {
  args: { search: search({ term: 'kubernetes', results: [] }) },
};

export const Failed: Story = {
  args: { search: search({ error: new Error('offline'), results: [] }) },
};
