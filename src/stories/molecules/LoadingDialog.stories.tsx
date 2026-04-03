import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { LoadingDialog } from '../../components/molecules/LoadingDialog';

const meta = {
    title: 'Molecules/LoadingDialog',
    component: LoadingDialog,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof LoadingDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
