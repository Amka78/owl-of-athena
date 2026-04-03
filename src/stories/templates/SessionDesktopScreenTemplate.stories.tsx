import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { SessionDesktopScreenTemplate } from '../../components/templates/SessionDesktopScreenTemplate';
import { FilterByDateValues } from '../../state/SessionState';

jest.mock('../../navigation/SessionTabNavigator', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return () => <View><Text>SessionTabNavigator</Text></View>;
});

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

const meta = {
    title: 'Templates/SessionDesktopScreenTemplate',
    component: SessionDesktopScreenTemplate,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof SessionDesktopScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithList: Story = {
    args: {
        showFilter: false,
        filterMenuProps,
        sessionList: [],
        onStarPress: fn(),
        onDeletePress: fn(),
        onMenuPress: fn(),
        onRefreshPress: fn(),
        onFilterPress: fn(),
        selected: undefined,
        locale: 'en-US',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const NoList: Story = {
    args: {
        showFilter: false,
        filterMenuProps,
        sessionList: undefined,
        onStarPress: fn(),
        onDeletePress: fn(),
        onMenuPress: fn(),
        onRefreshPress: fn(),
        onFilterPress: fn(),
        selected: undefined,
        locale: 'en-US',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
