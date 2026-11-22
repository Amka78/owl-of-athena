import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { MainScreenTemplate } from "../MainScreenTemplate";

vi.mock("../../../navigation/MainDrawerNavigator", () => {
    const React = require("react");
    const { View, Text } = require("react-native");
    return {
        default: () => (
            <View>
                <Text>MainDrawerNavigator</Text>
            </View>
        ),
    };
});

vi.mock("../../../sdk", () => ({
    ConnectionStates: {
        IDLE: 0,
        CONNECTED: 4,
        DISCONNECTED: 7,
    },
    SleepStates: {
        INIT: 0,
        CONFIGURING: 1,
        SLEEPING: 2,
        WAKING: 3,
        AWAKE: 4,
        SYNCING: 5,
        SYNCING_ERROR: 6,
    },
    AuroraInstance: {
        on: () => () => {},
        off: () => {},
        once: () => () => {},
        emit: () => {},
        queueCmd: async () => undefined,
        connect: async () => undefined,
        disconnect: async () => undefined,
        destroy: async () => undefined,
    },
    Aurora: class Aurora {},
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const ConnectionStates = {
    IDLE: 0,
    CONNECTED: 4,
    DISCONNECTED: 7,
};

const mobileDimens = {
    fontScale: 1,
    scale: 1,
    height: 800,
    width: 400,
    isDesktop: false,
    isLargeWidth: false,
    isSmallHeight: false,
    isVertical: true,
    isHorizontal: false,
};

const desktopDimens = {
    fontScale: 1,
    scale: 1,
    height: 1200,
    width: 1400,
    isDesktop: true,
    isLargeWidth: true,
    isSmallHeight: false,
    isVertical: false,
    isHorizontal: true,
};

const defaultProps = {
    onBluetoothConnectPress: vi.fn(),
    bluetoothConnect: ConnectionStates.DISCONNECTED,
    currentFirmwareVersion: "2.1.0",
    error: "",
    batteryLevel: 85,
    unsyncedCount: 0,
    onHomePress: vi.fn(),
    onProfilesPress: vi.fn(),
    onSessionsPress: vi.fn(),
    onSettingsPress: vi.fn(),
    onDeviceInfoPress: vi.fn(),
    onDevicePress: vi.fn(),
};

describe("MainScreenTemplate", () => {
    it("renders correctly in mobile mode", () => {
        const { toJSON } = renderWithProvider(
            <MainScreenTemplate {...defaultProps} dimens={mobileDimens} locale="en-US" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly in desktop mode", () => {
        const { toJSON } = renderWithProvider(
            <MainScreenTemplate {...defaultProps} dimens={desktopDimens} locale="en-US" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("shows the unsynced session badge when connected", () => {
        const { getByTestId } = renderWithProvider(
            <MainScreenTemplate
                {...defaultProps}
                bluetoothConnect={ConnectionStates.CONNECTED}
                unsyncedCount={3}
                dimens={mobileDimens}
                locale="en-US"
            />,
        );

        expect(getByTestId("session-badge-text").props.children).toBe("3");
    });

    it("opens the device screen from the status bar", () => {
        const onDevicePress = vi.fn();
        const { getByTestId } = renderWithProvider(
            <MainScreenTemplate
                {...defaultProps}
                dimens={mobileDimens}
                locale="en-US"
                onDevicePress={onDevicePress}
            />,
        );

        fireEvent.press(getByTestId("device-info-icon"));

        expect(onDevicePress).toHaveBeenCalledTimes(1);
    });

    it("renders correctly when connected", () => {
        const { toJSON } = renderWithProvider(
            <MainScreenTemplate
                {...defaultProps}
                bluetoothConnect={ConnectionStates.CONNECTED}
                dimens={mobileDimens}
                locale="en-US"
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders error message when error is provided", () => {
        const { toJSON } = renderWithProvider(
            <MainScreenTemplate
                {...defaultProps}
                error="Connection failed"
                dimens={mobileDimens}
                locale="en-US"
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
