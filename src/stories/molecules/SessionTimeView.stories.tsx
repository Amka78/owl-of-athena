import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { SessionTimeView } from '../../components/molecules/SessionTimeView';

const meta = {
    title: 'Molecules/SessionTimeView',
    component: SessionTimeView,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof SessionTimeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    args: {
        label: 'Session Time',
        hours: 7,
        minutes: 30,
        mode: 'meridian',
        isDesktop: false,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    args: {
        label: 'Session Time',
        hours: 8,
        minutes: 0,
        mode: 'time',
        isDesktop: true,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
