import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { FilterByDateValues } from "../../../store/sessionStore";
import { SessionDesktopScreenTemplate } from "../SessionDesktopScreenTemplate";

vi.mock("../../../navigation/SessionTabNavigator", () => {
    const React = require("react");
    const { View, Text } = require("react-native");
    return {
        default: () => (
            <View>
                <Text>SessionTabNavigator</Text>
            </View>
        ),
    };
});

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const filterMenuProps = {
    onPickerValueChange: vi.fn(),
    selectedPickerValue: FilterByDateValues.ANY_TIME,
    anyTimePickerValue: FilterByDateValues.ANY_TIME,
    pastWeekPickerValue: FilterByDateValues.PAST_WEEK,
    pastMonthPickerValue: FilterByDateValues.PAST_MONTH,
    showStarredCheckBoxStatus: "unchecked" as const,
    onShowStarredCheckBoxPress: vi.fn(),
    showNoteCheckBoxStatus: "unchecked" as const,
    onShowNoteCheckBoxPress: vi.fn(),
};

const defaultProps = {
    showFilter: false,
    filterMenuProps,
    sessionList: [],
    onStarPress: vi.fn(),
    onDeletePress: vi.fn(),
    onMenuPress: vi.fn(),
    onRefreshPress: vi.fn(),
    onFilterPress: vi.fn(),
    selected: undefined,
};

describe("SessionDesktopScreenTemplate", () => {
    it("renders correctly with empty session list", () => {
        const { toJSON } = renderWithProvider(
            <SessionDesktopScreenTemplate {...defaultProps} locale="en-US" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders blank screen when no session selected", () => {
        const { toJSON } = renderWithProvider(
            <SessionDesktopScreenTemplate {...defaultProps} selected={undefined} locale="en-US" />,
        );
        expect(toJSON()).toMatchSnapshot();
    });
});
