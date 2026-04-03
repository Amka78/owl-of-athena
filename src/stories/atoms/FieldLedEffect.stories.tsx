import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { FieldLedEffect } from '../../components/atoms/FieldLedEffect';

const meta = {
  title: 'Atoms/FieldLedEffect',
  component: FieldLedEffect,
  tags: ['autodocs'],
  decorators: [
    (Story: any) => <Provider theme={Theme}><Story /></Provider>,
  ],
} satisfies Meta<typeof FieldLedEffect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: 'blink',
    disabled: false,
    onPreviewEffectPress: fn(),
    onValueChange: fn(),
  },
  play: async ({ canvasElement }) => {
    
    expect(canvasElement).toBeTruthy();
  },
};

export const Disabled: Story = {
  args: {
    value: 'blink',
    disabled: true,
    onPreviewEffectPress: fn(),
    onValueChange: fn(),
  },
};
