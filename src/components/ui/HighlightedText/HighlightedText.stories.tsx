import type { Meta, StoryObj } from '@storybook/react-vite';
import HighlightedText from './HighlightedText';

const meta = {
  title: 'UI/HighlightedText',
  component: HighlightedText,
  args: { text: 'Understanding React hooks', query: 'hooks' },
} satisfies Meta<typeof HighlightedText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoMatch: Story = {
  args: { query: 'vue' },
};

export const EveryOccurrence: Story = {
  args: { text: 'Hooks, hooks and more hooks', query: 'hooks' },
};

export const CaseInsensitive: Story = {
  args: { query: 'REACT' },
  parameters: {
    docs: {
      description: { story: 'Matching ignores case, but the original casing is preserved.' },
    },
  },
};
