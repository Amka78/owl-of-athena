import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { SessionNoteScreenTemplate } from '../../components/templates/SessionNoteScreenTemplate';

const meta = {
    title: 'Templates/SessionNoteScreenTemplate',
    component: SessionNoteScreenTemplate,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof SessionNoteScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    args: {
        value: '',
        onChangeText: fn(),
        onBlur: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const WithNote: Story = {
    args: {
        value: 'Had a vivid dream about flying over mountains.',
        onChangeText: fn(),
        onBlur: fn(),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
