import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SignupScreen } from "../SignupScreen";

jest.mock("../../../hooks/useSignup", () => ({
    useSignup: () => ({
        loading: false,
        emailHooks: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        passwordHooks: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        passwordConfirmHooks: {
            value: "",
            onChangeText: jest.fn(),
            onEndEditing: jest.fn(),
            error: "",
        },
        checkBoxHooks: { checked: false, onPress: jest.fn() },
        onSignupPress: jest.fn(),
        onCancelPress: jest.fn(),
        onLinkTextPress: jest.fn(),
        generalError: "",
    }),
}));

jest.mock("../../../hooks", () => ({
    useLocale: jest.fn(),
    useConvertibleHeader: jest.fn(),
    useWindowDimensions: () => ({
        width: 375,
        height: 800,
        isDesktop: false,
        isLargeWidth: false,
        isSmallHeight: false,
        isVertical: true,
        isHorizontal: false,
        fontScale: 1,
        scale: 2,
    }),
    useSignup: () => ({
        loading: false,
        emailHooks: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        passwordHooks: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        passwordConfirmHooks: {
            value: "",
            onChangeText: jest.fn(),
            onEndEditing: jest.fn(),
            error: "",
        },
        checkBoxHooks: { checked: false, onPress: jest.fn() },
        onSignupPress: jest.fn(),
        onCancelPress: jest.fn(),
        onLinkTextPress: jest.fn(),
        generalError: "",
    }),
}));


const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SignupScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<SignupScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<SignupScreen />)).not.toThrow();
    });
});
