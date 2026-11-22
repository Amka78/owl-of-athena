import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { ProfileDesktopScreenTemplate } from "../ProfileDesktopScreenTemplate";

vi.mock("../../../navigation/ProfileTabNavigator", () => {
    const React = require("react");
    const { View, Text } = require("react-native");
    return {
        default: () => (
            <View>
                <Text>ProfileTabNavigator</Text>
            </View>
        ),
    };
});

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

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

const filterMenuProps = {
    showOfficialCheckBoxStatus: "checked" as const,
    onShowOfficialCheckBoxPress: vi.fn(),
    showCommunityCheckBoxStatus: "unchecked" as const,
    onShowCommunityCheckBoxPress: vi.fn(),
    showPrivateCheckBoxStatus: "checked" as const,
    onShowPrivateCheckBoxPress: vi.fn(),
};

const defaultProps = {
    userId: "p1",
    showFilter: false,
    filterMenuProps,
    list: [],
    onStarPress: vi.fn(),
    onDeletePress: vi.fn(),
    onMenuPress: vi.fn(),
    onRefreshPress: vi.fn(),
    onFilterPress: vi.fn(),
    dimens: mobileDimens,
};

describe("ProfileDesktopScreenTemplate", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(
            <ProfileDesktopScreenTemplate {...defaultProps} locale="en-US" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without list", () => {
        const { toJSON } = renderWithProvider(
            <ProfileDesktopScreenTemplate {...defaultProps} list={undefined} locale="en-US" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
