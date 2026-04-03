import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { OfficialIcon } from '../../components/atoms/OfficialIcon';

const meta = {
  title: 'Atoms/OfficialIcon',
  component: OfficialIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof OfficialIcon>;

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
