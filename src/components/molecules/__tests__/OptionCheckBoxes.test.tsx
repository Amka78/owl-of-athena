import { MaterialCommunityIcons } from "@expo/vector-icons";
import { render } from "@testing-library/react-native";
import type React from "react";
import { View } from "react-native";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { OptionCheckBoxes } from "../OptionCheckBoxes";

const leftIcon = (props: any) => (
    <View style={props.style}>
        <MaterialCommunityIcons name="filter" size={24} color={props.color} />
    </View>
);

const defaultProps = {
    title: "File Streams",
    description: "Select streams",
    left: leftIcon,
    disabled: false,
    value: 0,
    field: { type: "checkboxes" as const, choices: "", labelNone: "None" },
    onValueChange: jest.fn(),
};

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("OptionCheckBoxes", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<OptionCheckBoxes {...defaultProps} />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders title", () => {
        const { getByText } = renderWithProvider(<OptionCheckBoxes {...defaultProps} />);
        expect(getByText("File Streams")).toBeTruthy();
    });
});
