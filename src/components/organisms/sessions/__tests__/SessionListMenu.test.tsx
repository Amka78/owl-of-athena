import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../../constants";
import { FilterByDateValues } from "../../../../store/sessionStore";
import { SessionListMenu } from "../SessionListMenu";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const defaultProps = {
    onPickerValueChange: jest.fn(),
    selectedPickerValue: FilterByDateValues.ANY_TIME,
    anyTimePickerValue: FilterByDateValues.ANY_TIME,
    pastWeekPickerValue: FilterByDateValues.PAST_WEEK,
    pastMonthPickerValue: FilterByDateValues.PAST_MONTH,
    showStarredCheckBoxStatus: "unchecked" as const,
    onShowStarredCheckBoxPress: jest.fn(),
    showNoteCheckBoxStatus: "checked" as const,
    onShowNoteCheckBoxPress: jest.fn(),
};

describe("SessionListMenu", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<SessionListMenu {...defaultProps} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders all checkboxes", () => {
        const { getAllByRole } = renderWithProvider(<SessionListMenu {...defaultProps} />);
        const checkboxes = getAllByRole("checkbox");
        expect(checkboxes.length).toBeGreaterThanOrEqual(2);
    });

    it("calls onShowStarredCheckBoxPress when starred checkbox pressed", () => {
        const onPress = jest.fn();
        const { getAllByRole } = renderWithProvider(
            <SessionListMenu {...defaultProps} onShowStarredCheckBoxPress={onPress} />,
        );
        const checkboxes = getAllByRole("checkbox");
        fireEvent.press(checkboxes[0]);
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});
