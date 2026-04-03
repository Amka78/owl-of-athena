import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { ProfilesIcon } from '../../components/atoms/ProfilesIcon';

const meta = {
  title: 'Atoms/ProfilesIcon',
  component: ProfilesIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof ProfilesIcon>;

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
