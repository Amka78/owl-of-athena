import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-native-paper';
import { Theme } from '../../../constants';
import { MainScreenTemplate } from '../MainScreenTemplate';

jest.mock('../../../navigation/MainDrawerNavigator', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return () => <View><Text>MainDrawerNavigator</Text></View>;
});

jest.mock('../../../sdk', () => ({
    ConnectionStates: {
        IDLE: 0,
        CONNECTED: 4,
        DISCONNECTED: 7,
    },
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const ConnectionStates = {
    IDLE: 0,
    CONNECTED: 4,
    DISCONNECTED: 7,
};

const mobileDimens = {
    isDesktop: false, isLargeWidth: false, isSmallHeight: false,
    isVertical: true, isHorizontal: false,
};

const desktopDimens = {
    fontScale: 1, scale: 1, height: 1200, width: 1400,
    isDesktop: true, isLargeWidth: true, isSmallHeight: false,
    isVertical: false, isHorizontal: true,
};

const defaultProps = {
    onBluetoothConnectPress: jest.fn(),
    bluetoothConnect: ConnectionStates.DISCONNECTED,
    currentFirmwareVersion: '2.1.0',
    error: '',
    batteryLevel: 85,
    onHomePress: jest.fn(),
    onProfilesPress: jest.fn(),
    onSessionsPress: jest.fn(),
    onSettingsPress: jest.fn(),
};

describe('MainScreenTemplate', () => {
    it('renders correctly in mobile mode', () => {
        const { toJSON } = renderWithProvider(
            <MainScreenTemplate {...defaultProps} dimens={mobileDimens} locale="en-US" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly in desktop mode', () => {
        const { toJSON } = renderWithProvider(
            <MainScreenTemplate {...defaultProps} dimens={desktopDimens} locale="en-US" />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders correctly when connected', () => {
        const { toJSON } = renderWithProvider(
            <MainScreenTemplate
                {...defaultProps}
                bluetoothConnect={ConnectionStates.CONNECTED}
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('renders error message when error is provided', () => {
        const { toJSON } = renderWithProvider(
            <MainScreenTemplate
                {...defaultProps}
                error="Connection failed"
                dimens={mobileDimens}
                locale="en-US"
            />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
