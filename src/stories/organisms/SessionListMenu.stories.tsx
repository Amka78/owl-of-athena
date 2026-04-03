import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { SessionListMenu } from '../../components/organisms/sessions/SessionListMenu';
import { FilterByDateValues } from '../../state/SessionState';

const meta = {
    title: 'Organisms/SessionListMenu',
    component: SessionListMenu,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => (
            <Provider theme={Theme}>
                <Story />
            </Provider>
        ),
    ],
} satisfies Meta<typeof SessionListMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        onPickerValueChange: fn(),
        selectedPickerValue: FilterByDateValues.ANY_TIME,
        anyTimePickerValue: FilterByDateValues.ANY_TIME,
        pastWeekPickerValue: FilterByDateValues.PAST_WEEK,
        pastMonthPickerValue: FilterByDateValues.PAST_MONTH,
        showStarredCheckBoxStatus: 'unchecked',
        onShowStarredCheckBoxPress: fn(),
        showNoteCheckBoxStatus: 'checked',
        onShowNoteCheckBoxPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};

export const PastWeek: Story = {
    args: {
        onPickerValueChange: fn(),
        selectedPickerValue: FilterByDateValues.PAST_WEEK,
        anyTimePickerValue: FilterByDateValues.ANY_TIME,
        pastWeekPickerValue: FilterByDateValues.PAST_WEEK,
        pastMonthPickerValue: FilterByDateValues.PAST_MONTH,
        showStarredCheckBoxStatus: 'checked',
        onShowStarredCheckBoxPress: fn(),
        showNoteCheckBoxStatus: 'checked',
        onShowNoteCheckBoxPress: fn(),
    },
    play: async ({ canvasElement }) => {
        expect(canvasElement).toBeTruthy();
    },
};
