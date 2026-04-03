import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { PrivateIcon } from '../../components/atoms/PrivateIcon';

const meta = {
  title: 'Atoms/PrivateIcon',
  component: PrivateIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof PrivateIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    
    expect(canvasElement).toBeTruthy();
  },
};

export const WithPressHandler: Story = {
  args: {
    onPress: fn(),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
