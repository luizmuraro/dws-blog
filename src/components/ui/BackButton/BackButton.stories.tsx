import type { Meta, StoryObj } from '@storybook/react-vite';
import BackButton from './BackButton';

const meta = {
  title: 'UI/BackButton',
  component: BackButton,
} satisfies Meta<typeof BackButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
