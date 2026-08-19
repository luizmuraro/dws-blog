import { useLayoutEffect, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { makeApiPost } from '@/test/factories';
import LatestArticles from './LatestArticles';

const listing = Array.from({ length: 4 }, (_, index) =>
  makeApiPost({
    id: `post-${index + 1}`,
    title: `Understanding React hooks, part ${index + 1}`,
    thumbnail_url: `https://picsum.photos/seed/dws-latest-${index}/640/360`,
    createdAt: `2024-0${index + 1}-05T12:00:00.000Z`,
  }),
);

// The section fetches the listing itself, so each story serves its own payload.
const withListing = (payload: unknown, status = 200): Decorator =>
  function WithListing(Story) {
    const [isReady, setIsReady] = useState(false);

    useLayoutEffect(() => {
      const original = window.fetch;

      window.fetch = async () => new Response(JSON.stringify(payload), { status });
      setIsReady(true);

      return () => {
        window.fetch = original;
      };
    }, []);

    return isReady ? <Story /> : <></>;
  };

const meta = {
  title: 'Features/LatestArticles',
  component: LatestArticles,
  args: { currentPostId: 'post-1' },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof LatestArticles>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [withListing(listing)],
  parameters: {
    docs: {
      description: { story: 'Drops the post being read and keeps the three most recent.' },
    },
  },
};

export const Loading: Story = {
  decorators: [
    function NeverResolves(Story) {
      const [isReady, setIsReady] = useState(false);

      useLayoutEffect(() => {
        const original = window.fetch;

        window.fetch = () => new Promise<Response>(() => {});
        setIsReady(true);

        return () => {
          window.fetch = original;
        };
      }, []);

      return isReady ? <Story /> : <></>;
    },
  ],
};

export const HiddenWhenEmpty: Story = {
  decorators: [withListing([])],
  parameters: {
    docs: {
      description: {
        story: 'Renders nothing at all: an empty or failed listing hides the whole section.',
      },
    },
  },
};

export const HiddenWhenFailed: Story = {
  decorators: [withListing('', 500)],
};
