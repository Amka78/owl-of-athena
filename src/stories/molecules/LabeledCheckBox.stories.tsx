import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { LabeledCheckBox } from '../../components/molecules/LabeledCheckBox';

const meta = {
    title: 'Molecules/LabeledCheckBox',
    component: LabeledCheckBox,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
    argTypes: {
        checkBoxColor: { control: 'color' },
        checkBoxUncheckedColor: { control: 'color' },
    },
} satisfies Meta<typeof LabeledCheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: 'Accept terms',
        labelPlace: 'right',
        status: 'checked',
        onPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const Unchecked: Story = {
    args: {
        label: 'Unchecked item',
        labelPlace: 'left',
        status: 'unchecked',
        onPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const WithDescription: Story = {
    args: {
        label: 'Option',
        description: 'This is a description',
        labelPlace: 'right',
        status: 'unchecked',
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
