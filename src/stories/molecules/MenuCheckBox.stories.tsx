import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { MenuCheckBox } from '../../components/molecules/MenuCheckBox';

const meta = {
    title: 'Molecules/MenuCheckBox',
    component: MenuCheckBox,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof MenuCheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
    args: {
        label: 'Enable feature',
        status: 'checked',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const Unchecked: Story = {
    args: {
        label: 'Enable feature',
        status: 'unchecked',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
