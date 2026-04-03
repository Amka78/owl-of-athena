import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { LogoutIcon } from '../../components/atoms/LogoutIcon';

const meta = {
  title: 'Atoms/LogoutIcon',
  component: LogoutIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof LogoutIcon>;

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
