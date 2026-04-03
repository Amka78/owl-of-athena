import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { RightSideButton } from '../../components/molecules/RightSideButton';

const meta = {
    title: 'Molecules/RightSideButton',
    component: RightSideButton,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof RightSideButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMargin: Story = {
    args: {
        children: 'Save',
        needMargin: true,
        screenWidth: 375,
        onPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const NoMargin: Story = {
    args: {
        children: 'Cancel',
        needMargin: false,
        screenWidth: 375,
        onPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
