import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { SessionBlankScreenTemplate } from '../../components/templates/SessionBlankScreenTemplate';

const meta = {
    title: 'Templates/SessionBlankScreenTemplate',
    component: SessionBlankScreenTemplate,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof SessionBlankScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
