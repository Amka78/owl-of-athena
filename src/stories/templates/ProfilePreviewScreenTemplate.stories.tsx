import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { ProfilePreviewScreenTemplate } from '../../components/templates/ProfilePreviewScreenTemplate';

const meta = {
    title: 'Templates/ProfilePreviewScreenTemplate',
    component: ProfilePreviewScreenTemplate,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof ProfilePreviewScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        content: JSON.stringify({ name: 'default.prof', version: '1.0.0' }, null, 2),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const Empty: Story = {
    args: {
        content: '',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
