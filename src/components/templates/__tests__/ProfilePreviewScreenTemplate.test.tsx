import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ProfilePreviewScreenTemplate } from "../ProfilePreviewScreenTemplate";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("ProfilePreviewScreenTemplate", () => {
    it("renders correctly with content", () => {
        const { toJSON } = renderWithProvider(
            <ProfilePreviewScreenTemplate
                content={JSON.stringify({ name: "default.prof" })}
                onExportPress={jest.fn()}
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders correctly with empty content", () => {
        const { toJSON } = renderWithProvider(
            <ProfilePreviewScreenTemplate content="" onExportPress={jest.fn()} />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("displays the content in the text input", () => {
        const content = '{"name":"default.prof"}';
        const { getByDisplayValue } = renderWithProvider(
            <ProfilePreviewScreenTemplate content={content} onExportPress={jest.fn()} />,
        );
        expect(getByDisplayValue(content)).toBeTruthy();
    });

    it("calls onExportPress when the share button is pressed", () => {
        const onExportPress = jest.fn();
        const { getByLabelText } = renderWithProvider(
            <ProfilePreviewScreenTemplate content={"test"} onExportPress={onExportPress} />,
        );

        fireEvent.press(getByLabelText("Export Profile"));
        expect(onExportPress).toHaveBeenCalledTimes(1);
    });
});
