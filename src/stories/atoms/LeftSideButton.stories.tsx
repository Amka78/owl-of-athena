import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { LeftSideButton } from '../../components/atoms/LeftSideButton';

const meta = {
  title: 'Atoms/LeftSideButton',
  component: LeftSideButton,
  tags: ['autodocs'],
  decorators: [
    (Story: any) => <Provider theme={Theme}><Story /></Provider>,
  ],
} satisfies Meta<typeof LeftSideButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Left Button',
    screenWidth: 375,
    needMargin: true,
  },
  play: async ({ canvasElement }) => {
    
    expect(canvasElement).toBeTruthy();
  },
};

export const WithPressHandler: Story = {
  args: {
    children: 'Left Button',
    screenWidth: 375,
    needMargin: true,
    onPress: fn(),
  },
};

export const NoMargin: Story = {
  args: {
    children: 'Left Button',
    screenWidth: 375,
    needMargin: false,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Left Button',
    screenWidth: 375,
    needMargin: true,
    disabled: true,
  },
};
