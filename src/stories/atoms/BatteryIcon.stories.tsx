import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import { BatteryIcon } from '../../components/atoms/BatteryIcon';

const meta = {
  title: 'Atoms/BatteryIcon',
  component: BatteryIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof BatteryIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    isUSBConnected: false,
    batteryLevel: 100,
  },
  play: async ({ canvasElement }) => {
    
    expect(canvasElement).toBeTruthy();
  },
};

export const USBConnected: Story = {
  args: {
    isUSBConnected: true,
    batteryLevel: 50,
  },
};

export const LowBattery: Story = {
  args: {
    isUSBConnected: false,
    batteryLevel: 10,
  },
};
