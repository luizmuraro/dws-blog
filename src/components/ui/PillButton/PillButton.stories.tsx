import type { Meta, StoryObj } from '@storybook/react-vite';
import PillButton from './PillButton';

const meta = {
  title: 'UI/PillButton',
  component: PillButton,
  args: { children: 'Apply filters' },
} satisfies Meta<typeof PillButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const LongLabel: Story = {
  args: { children: 'See all 128 results' },
};
