import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { SettingsIcon } from '../../components/atoms/SettingsIcon';

const meta = {
  title: 'Atoms/SettingsIcon',
  component: SettingsIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof SettingsIcon>;

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
