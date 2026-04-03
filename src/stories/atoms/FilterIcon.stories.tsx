import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import { FilterIcon } from '../../components/atoms/FilterIcon';

const meta = {
  title: 'Atoms/FilterIcon',
  component: FilterIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof FilterIcon>;

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
