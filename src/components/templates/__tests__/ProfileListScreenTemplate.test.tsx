import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { ProfileListScreenTemplate } from "../ProfileListScreenTemplate";

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
    onShowOfficialCheckBoxPress: jest.fn(),
    showCommunityCheckBoxStatus: "unchecked" as const,
    onShowCommunityCheckBoxPress: jest.fn(),
    showPrivateCheckBoxStatus: "checked" as const,
    onShowPrivateCheckBoxPress: jest.fn(),
};

const sampleProfiles = [
    {
        id: "p1",
        content: "",
        name: "official.prof",
        title: "Official Profile",
        type: "official" as const,
        description: "Official",
        min_firmware_version: 20206,
        created_at: 1504827468,
        updated_at: 1504827468,
        starred: false,
        options: [],
    },
];

const defaultProps = {
    userId: "p1",
    showFilter: false,
    filterMenuProps,
    list: sampleProfiles,
    onStarPress: jest.fn(),
    onDeletePress: jest.fn(),
    onMenuPress: jest.fn(),
    dimens: mobileDimens,
};

describe("ProfileListScreenTemplate", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(
            <ProfileListScreenTemplate {...defaultProps} locale="en-US" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders with ja-JP locale", () => {
        const { toJSON } = renderWithProvider(
            <ProfileListScreenTemplate {...defaultProps} locale="ja-JP" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders profile title in list", () => {
        const { getByText } = renderWithProvider(
            <ProfileListScreenTemplate {...defaultProps} locale="en-US" />,
        );
        expect(getByText("Official Profile")).toBeTruthy();
    });

    it("shows filter menu when showFilter is true", () => {
        const { toJSON } = renderWithProvider(
            <ProfileListScreenTemplate {...defaultProps} showFilter={true} locale="en-US" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("returns null when list is undefined", () => {
        const { queryByText } = renderWithProvider(
            <ProfileListScreenTemplate {...defaultProps} list={undefined} locale="en-US" />,
        );
        // When list is undefined, the component renders nothing with profile items
        expect(queryByText("Official Profile")).toBeNull();
    });
});
