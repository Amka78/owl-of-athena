import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';

const meta = {
    title: 'Molecules/ConfirmDialog',
    component: ConfirmDialog,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
