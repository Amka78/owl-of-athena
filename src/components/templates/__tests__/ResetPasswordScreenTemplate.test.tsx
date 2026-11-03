import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ResetPasswordScreenTemplate } from "../ResetPasswordScreenTemplate";

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

const defaultProps = {
    state: "ready" as const,
    newPassword: { value: "", onChangeText: jest.fn(), set: jest.fn() },
    confirmPassword: { value: "", onChangeText: jest.fn(), set: jest.fn() },
    errorText: { children: "" },
    saveButton: { onPress: jest.fn() },
    loginButton: { onPress: jest.fn() },
    requestButton: { onPress: jest.fn() },
    dimens: mobileDimens,
    locale: "en-US",
};

describe("ResetPasswordScreenTemplate", () => {
    it("renders the form when the link is valid", () => {
        const { getByText, toJSON } = renderWithProvider(
            <ResetPasswordScreenTemplate {...defaultProps}></ResetPasswordScreenTemplate>,
        );

        expect(getByText("Save New Password")).toBeTruthy();
        expect(toJSON()).toBeTruthy();
    });

    it("shows the invalid link message and requests a new link", () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <ResetPasswordScreenTemplate
                {...defaultProps}
                state={"invalid"}
                requestButton={{ onPress }}
            ></ResetPasswordScreenTemplate>,
        );

        expect(getByText(/invalid or has expired/i)).toBeTruthy();
        fireEvent.press(getByText("Request a New Link"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("shows the success message and goes to login", () => {
        const onPress = jest.fn();
        const { getByText } = renderWithProvider(
            <ResetPasswordScreenTemplate
                {...defaultProps}
                state={"success"}
                loginButton={{ onPress }}
            ></ResetPasswordScreenTemplate>,
        );

        expect(getByText(/password has been updated/i)).toBeTruthy();
        fireEvent.press(getByText("Go to Login"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });
});