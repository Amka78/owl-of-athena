import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { LabeledTimeView } from '../../components/molecules/LabeledTimeView';

const meta = {
    title: 'Molecules/LabeledTimeView',
    component: LabeledTimeView,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof LabeledTimeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: 'Wake Up Time',
        hours: 7,
        minutes: 30,
        mode: 'meridian',
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const TimeMode: Story = {
    args: {
        label: 'Session Duration',
        hours: 8,
        minutes: 0,
        mode: 'time',
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
