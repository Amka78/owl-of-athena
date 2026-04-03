import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { SessionListScreenTemplate } from '../../components/templates/SessionListScreenTemplate';
import { FilterByDateValues } from '../../state/SessionState';
import { AuroraSession } from '../../sdk/models';

const filterMenuProps = {
    onPickerValueChange: fn(),
    selectedPickerValue: FilterByDateValues.ANY_TIME,
    anyTimePickerValue: FilterByDateValues.ANY_TIME,
    pastWeekPickerValue: FilterByDateValues.PAST_WEEK,
    pastMonthPickerValue: FilterByDateValues.PAST_MONTH,
    showStarredCheckBoxStatus: 'unchecked' as const,
    onShowStarredCheckBoxPress: fn(),
    showNoteCheckBoxStatus: 'unchecked' as const,
    onShowNoteCheckBoxPress: fn(),
};

const sampleSessions: AuroraSession[] = [];

const meta = {
    title: 'Templates/SessionListScreenTemplate',
    component: SessionListScreenTemplate,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof SessionListScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EnUSLocale: Story = {
    args: {
        showFilter: false,
        filterMenuProps,
        sessionList: sampleSessions,
        onStarPress: fn(),
        onDeletePress: fn(),
        onMenuPress: fn(),
        locale: 'en-US',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const JaJPLocale: Story = {
    args: {
        showFilter: false,
        filterMenuProps,
        sessionList: sampleSessions,
        onStarPress: fn(),
        onDeletePress: fn(),
        onMenuPress: fn(),
        locale: 'ja-JP',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const WithFilter: Story = {
    args: {
        showFilter: true,
        filterMenuProps,
        sessionList: sampleSessions,
        onStarPress: fn(),
        onDeletePress: fn(),
        onMenuPress: fn(),
        locale: 'en-US',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
