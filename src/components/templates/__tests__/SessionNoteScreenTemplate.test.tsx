import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { SessionNoteScreenTemplate } from "../SessionNoteScreenTemplate";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SessionNoteScreenTemplate", () => {
    it("renders correctly with empty note", () => {
        const { toJSON } = renderWithProvider(
            <SessionNoteScreenTemplate value="" onChangeText={jest.fn()} onBlur={jest.fn()} />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly with note content", () => {
        const { toJSON } = renderWithProvider(
            <SessionNoteScreenTemplate
                value="Had a vivid dream about flying."
                onChangeText={jest.fn()}
                onBlur={jest.fn()}
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("displays note content", () => {
        const note = "Had a vivid dream about flying.";
        const { getByDisplayValue } = renderWithProvider(
            <SessionNoteScreenTemplate value={note} onChangeText={jest.fn()} onBlur={jest.fn()} />,
        );
        expect(getByDisplayValue(note)).toBeTruthy();
    });

    it("calls onChangeText when text is changed", () => {
        const onChangeText = jest.fn();
        const { getByDisplayValue } = renderWithProvider(
            <SessionNoteScreenTemplate
                value="initial"
                onChangeText={onChangeText}
                onBlur={jest.fn()}
            />,
        );
        fireEvent.changeText(getByDisplayValue("initial"), "new text");
        expect(onChangeText).toHaveBeenCalledWith("new text");
    });
});
