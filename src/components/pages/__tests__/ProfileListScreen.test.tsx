import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ProfileListScreen } from "../ProfileListScreen";

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
}));



const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("ProfileListScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<ProfileListScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<ProfileListScreen />)).not.toThrow();
    });
});
