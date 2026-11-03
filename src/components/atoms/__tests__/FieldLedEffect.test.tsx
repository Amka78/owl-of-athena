//#region Import Modules
import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { LED_EFFECT_DEFAULTS } from "../../../services/ProfileService";
import { FieldLedEffect } from "../FieldLedEffect";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

//#region Tests
describe("FieldLedEffect UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(
            <FieldLedEffect
                value={LED_EFFECT_DEFAULTS.blink}
                disabled={false}
                onPreviewEffectPress={jest.fn()}
                onValueChange={jest.fn()}
            />,
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders the parameters of the selected effect", () => {
        const { getByText } = renderWithProvider(
            <FieldLedEffect
                value={LED_EFFECT_DEFAULTS.blink}
                disabled={false}
                onPreviewEffectPress={jest.fn()}
                onValueChange={jest.fn()}
            />,
        );

        expect(getByText("Times to Blink")).toBeTruthy();
        expect(getByText("Blink Rate (Hz)")).toBeTruthy();
        expect(getByText("Shutoff Delay (s)")).toBeTruthy();
    });

    it("shows the preview button only when an effect is set", () => {
        const withEffect = renderWithProvider(
            <FieldLedEffect
                value={LED_EFFECT_DEFAULTS.set}
                disabled={false}
                onPreviewEffectPress={jest.fn()}
                onValueChange={jest.fn()}
            />,
        );
        expect(withEffect.queryByText("Preview Effect")).toBeTruthy();

        const withoutEffect = renderWithProvider(
            <FieldLedEffect
                value={{}}
                disabled={false}
                onPreviewEffectPress={jest.fn()}
                onValueChange={jest.fn()}
            />,
        );
        expect(withoutEffect.queryByText("Preview Effect")).toBeNull();
    });

    it("previews the current effect value", () => {
        const onPreviewEffectPress = jest.fn();
        const { getByText } = renderWithProvider(
            <FieldLedEffect
                value={LED_EFFECT_DEFAULTS.blink}
                disabled={false}
                onPreviewEffectPress={onPreviewEffectPress}
                onValueChange={jest.fn()}
            />,
        );

        fireEvent.press(getByText("Preview Effect"));
        expect(onPreviewEffectPress).toHaveBeenCalledWith(LED_EFFECT_DEFAULTS.blink);
    });
});
//#endregion
