import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { UpdateSnackBarCore } from '../../components/atoms/UpdateSnackBar';

const meta = {
  title: 'Atoms/UpdateSnackBar',
  component: UpdateSnackBarCore,
  tags: ['autodocs'],
  decorators: [
    (Story: any) => <Provider theme={Theme}><Story /></Provider>,
  ],
} satisfies Meta<typeof UpdateSnackBarCore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    showReload: true,
  },
  play: async ({ canvasElement }) => {
    
    expect(canvasElement).toBeTruthy();
  },
};

export const Hidden: Story = {
  args: {
    showReload: false,
  },
};
