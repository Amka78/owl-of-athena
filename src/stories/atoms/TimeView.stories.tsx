import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { TimeView } from '../../components/atoms/TimeView';

const meta = {
  title: 'Atoms/TimeView',
  component: TimeView,
  tags: ['autodocs'],
  decorators: [
    (Story: any) => <Provider theme={Theme}><Story /></Provider>,
  ],
} satisfies Meta<typeof TimeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    hours: 24,
    minutes: 59,
    mode: 'time',
  },
  play: async ({ canvasElement }) => {
    
    expect(canvasElement).toBeTruthy();
  },
};

export const MidDay: Story = {
  args: {
    hours: 12,
    minutes: 0,
    mode: 'meridian',
  },
};
