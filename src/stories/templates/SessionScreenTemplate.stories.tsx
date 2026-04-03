import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { SessionScreenTemplate } from '../../components/templates/SessionScreenTemplate';
import { AuroraSession } from '../../sdk/models';

const meta = {
    title: 'Templates/SessionScreenTemplate',
    component: SessionScreenTemplate,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof SessionScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
    asleepAtTimeLabel: { hours: 23, minutes: 0 },
    chartRadialProgress: { value: 75, valueLabel: '75' },
    awakeTimeLabel: { hours: 7, minutes: 30 },
    leftSelectButton: { onPress: fn() },
    rightSelectButton: { onPress: fn() },
    currentChart: 'SleepChart' as const,
    sessionSleepChart: {
        scaleXDomain: [],
        isFilterEnabled: false,
        sessionDetail: { sleepEvents: [], movementEvents: [] } as any,
        totalSleepHour: 8,
    },
    sessionChartPie: {
        session: null as unknown as AuroraSession,
    },
    sleepDurationLabel: { hours: 8, minutes: 30 },
    remDurationLabel: { hours: 1, minutes: 45 },
    deepDurationLabel: { hours: 0, minutes: 45 },
};

export const EnUSLocale: Story = {
    args: { ...defaultArgs, locale: 'en-US' },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const JaJPLocale: Story = {
    args: { ...defaultArgs, locale: 'ja-JP' },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
