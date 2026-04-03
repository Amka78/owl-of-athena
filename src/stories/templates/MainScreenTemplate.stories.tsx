import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, within } from '@storybook/test';
import React from 'react';
import { Provider } from 'react-native-paper';
import { Theme } from '../../constants';
import { MainScreenTemplate } from '../../components/templates/MainScreenTemplate';
import { ConnectionStates } from '../../sdk';

jest.mock('../../navigation/MainDrawerNavigator', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return () => <View><Text>MainDrawerNavigator</Text></View>;
});

const mobileDimens = {
    fontScale: 1, scale: 1, height: 800, width: 400,
    isDesktop: false, isLargeWidth: false, isSmallHeight: false,
    isVertical: true, isHorizontal: false,
};

const desktopDimens = {
    fontScale: 1, scale: 1, height: 1200, width: 1400,
    isDesktop: true, isLargeWidth: true, isSmallHeight: false,
    isVertical: false, isHorizontal: true,
};

const defaultArgs = {
    onBluetoothConnectPress: fn(),
    bluetoothConnect: ConnectionStates.DISCONNECTED,
    currentFirmwareVersion: '2.1.0',
    error: '',
    batteryLevel: 85,
    onHomePress: fn(),
    onProfilesPress: fn(),
    onSessionsPress: fn(),
    onSettingsPress: fn(),
};

const meta = {
    title: 'Templates/MainScreenTemplate',
    component: MainScreenTemplate,
    tags: ['autodocs'],
    decorators: [
        (Story: any) => <Provider theme={Theme}><Story /></Provider>,
    ],
} satisfies Meta<typeof MainScreenTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
    args: { ...defaultArgs, dimens: mobileDimens, locale: 'en-US' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const Desktop: Story = {
    args: { ...defaultArgs, dimens: desktopDimens, locale: 'en-US' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};

export const Connected: Story = {
    args: {
        ...defaultArgs,
        bluetoothConnect: ConnectionStates.CONNECTED,
        dimens: mobileDimens,
        locale: 'en-US',
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        expect(canvas.baseElement).toBeTruthy();
    },
};
