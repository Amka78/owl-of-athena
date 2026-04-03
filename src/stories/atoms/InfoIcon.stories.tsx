import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { InfoIcon } from '../../components/atoms/Infocon';

const meta = {
  title: 'Atoms/InfoIcon',
  component: InfoIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof InfoIcon>;

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
