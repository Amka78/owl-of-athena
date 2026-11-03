//#region Import Modules
import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { FieldTime } from "../FieldTime";

//#endregion

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const field = {
    type: "time" as const,
    clearable: true,
    labelCleared: "Alarm Not Set",
    minutesStep: 5,
    defaultTime: 25200000,
};

//#region Tests
describe("FieldTime UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(
            <FieldTime field={field} value="08:00" disabled={false} onValueChange={jest.fn()} />,
        );
        expect(toJSON()).toBeTruthy();
    });

    it("offers the default time when unset", () => {
        const onValueChange = jest.fn();
        const { getByText } = renderWithProvider(
            <FieldTime
                field={field}
                value={undefined}
                disabled={false}
                onValueChange={onValueChange}
            />,
        );

        expect(getByText("Alarm Not Set")).toBeTruthy();
        fireEvent.press(getByText("07:00"));
        expect(onValueChange).toHaveBeenCalledWith(25200000);
    });

    it("renders the picker when a time is set", () => {
        const { queryByText } = renderWithProvider(
            <FieldTime field={field} value={25200000} disabled={false} onValueChange={jest.fn()} />,
        );

        expect(queryByText("Alarm Not Set")).toBeNull();
    });

    it("clears the value", () => {
        const onValueChange = jest.fn();
        const { getByText } = renderWithProvider(
            <FieldTime
                field={field}
                value={25200000}
                disabled={false}
                onValueChange={onValueChange}
            />,
        );

        fireEvent.press(getByText("Clear"));
        expect(onValueChange).toHaveBeenCalledWith(undefined);
    });
});
//#endregion
