import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { MainScreen } from "../MainScreen";

vi.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));
vi.mock("@react-navigation/drawer", () => ({
    createDrawerNavigator: () => ({
        Navigator: ({ children }: any) => children,
        Screen: () => null,
    }),
    DrawerContentScrollView: ({ children }: any) => children,
    DrawerItemList: () => null,
}));
vi.mock("@react-navigation/material-top-tabs", () => ({
    createMaterialTopTabNavigator: () => ({
        Navigator: ({ children }: any) => children,
        Screen: () => null,
    }),
}));
vi.mock("../../../navigation/MainDrawerNavigator", () => ({ default: () => null }));

vi.mock("../../../hooks/useMain", () => ({
    useMain: () => ({
        connect: "DISCONNECTED",
        onConnectionStatesPress: vi.fn(),
        onHomePress: vi.fn(),
        onProfilesPress: vi.fn(),
        onSessionsPress: vi.fn(),
        onSettingsPress: vi.fn(),
        onDeviceInfoPress: vi.fn(),
        onDevicePress: vi.fn(),
        batteryLevel: 85,
        currentFirmwareVersion: "1.0.0",
        error: "",
        unsyncedCount: 0,
    }),
}));

vi.mock("../../../hooks", () => ({
    useLocale: vi.fn(),
    useConvertibleHeader: vi.fn(),
    useWindowDimensions: () => ({
        width: 375,
        height: 800,
        isDesktop: false,
        isLargeWidth: false,
        isSmallHeight: false,
        isVertical: true,
        isHorizontal: false,
        fontScale: 1,
        scale: 2,
    }),
    useMain: () => ({
        connect: "DISCONNECTED",
        onConnectionStatesPress: vi.fn(),
        onHomePress: vi.fn(),
        onProfilesPress: vi.fn(),
        onSessionsPress: vi.fn(),
        onSettingsPress: vi.fn(),
        onDeviceInfoPress: vi.fn(),
        onDevicePress: vi.fn(),
        batteryLevel: 85,
        currentFirmwareVersion: "1.0.0",
        error: "",
        unsyncedCount: 0,
    }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("MainScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<MainScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<MainScreen />)).not.toThrow();
    });
});
