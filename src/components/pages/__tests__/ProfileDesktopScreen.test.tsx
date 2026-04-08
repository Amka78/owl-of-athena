import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ProfileDesktopScreen } from "../ProfileDesktopScreen";

jest.mock("../../../navigation/ProfileTabNavigator", () => () => null);
jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

jest.mock("../../../hooks/profiles/useProfileList", () => ({
    useProfileList: () => ({
        showFilter: false,
        filterCondition: {
            showOfficial: true,
            showCommunity: true,
            showPrivate: true,
        },
        onShowOfficialPress: jest.fn(),
        onShowCommunityPress: jest.fn(),
        onShowPrivatePress: jest.fn(),
        onFilterPress: jest.fn(),
        onRefreshPress: jest.fn(),
        userId: "guest",
        list: [],
        onStarPress: jest.fn(),
        onSelectProfile: jest.fn(),
        onDeleteProfile: jest.fn(),
    }),
}));

jest.mock("../../../hooks", () => ({
    useScreenDimensions: () => ({ isDesktop: false, isSmallHeight: false }),
    useLocale: jest.fn(),
    useConvertibleHeader: jest.fn(),
    useWindowDimensions: () => ({
        width: 1200,
        height: 900,
        isDesktop: true,
        isLargeWidth: true,
        isSmallHeight: false,
        isVertical: false,
        isHorizontal: true,
        fontScale: 1,
        scale: 1,
    }),
}));


const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("ProfileDesktopScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<ProfileDesktopScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<ProfileDesktopScreen />)).not.toThrow();
    });
});
