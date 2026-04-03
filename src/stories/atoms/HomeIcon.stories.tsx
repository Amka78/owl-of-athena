import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { HomeIcon } from '../../components/atoms/HomeIcon';

const meta = {
  title: 'Atoms/HomeIcon',
  component: HomeIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof HomeIcon>;

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
