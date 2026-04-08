import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { MainScreen } from "../MainScreen";

jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));
jest.mock("@react-navigation/drawer", () => ({
    createDrawerNavigator: () => ({
        Navigator: ({ children }: any) => children,
        Screen: () => null,
    }),
    DrawerContentScrollView: ({ children }: any) => children,
    DrawerItemList: () => null,
}));
jest.mock("@react-navigation/material-top-tabs", () => ({
    createMaterialTopTabNavigator: () => ({
        Navigator: ({ children }: any) => children,
        Screen: () => null,
    }),
}));
jest.mock("../../../navigation/MainDrawerNavigator", () => () => null);

jest.mock("../../../hooks/useMain", () => ({
    useMain: () => ({
        connect: "DISCONNECTED",
        onConnectionStatesPress: jest.fn(),
        onHomePress: jest.fn(),
        onProfilesPress: jest.fn(),
        onSessionsPress: jest.fn(),
        onSettingsPress: jest.fn(),
        batteryLevel: 85,
        currentFirmwareVersion: "1.0.0",
        error: "",
    }),
}));

jest.mock("../../../hooks", () => ({
    useLocale: jest.fn(),
    useConvertibleHeader: jest.fn(),
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
        onConnectionStatesPress: jest.fn(),
        onHomePress: jest.fn(),
        onProfilesPress: jest.fn(),
        onSessionsPress: jest.fn(),
        onSettingsPress: jest.fn(),
        batteryLevel: 85,
        currentFirmwareVersion: "1.0.0",
        error: "",
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
