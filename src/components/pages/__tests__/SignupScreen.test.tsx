import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SignupScreen } from "../SignupScreen";

vi.mock("../../../hooks/useSignup", () => ({
    useSignup: () => ({
        loading: false,
        emailHooks: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        passwordHooks: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        passwordConfirmHooks: {
            value: "",
            onChangeText: vi.fn(),
            onEndEditing: vi.fn(),
            error: "",
        },
        firstNameHooks: {
            value: "",
            onChangeText: vi.fn(),
            onEndEditing: vi.fn(),
            error: "",
        },
        lastNameHooks: {
            value: "",
            onChangeText: vi.fn(),
            onEndEditing: vi.fn(),
            error: "",
        },
        birthDay: undefined,
        onBirthDayChange: vi.fn(),
        gender: "male",
        onGenderChange: vi.fn(),
        newsletterHooks: { checked: false, onPress: vi.fn() },
        checkBoxHooks: { checked: false, onPress: vi.fn() },
        onSignupPress: vi.fn(),
        onCancelPress: vi.fn(),
        onLinkTextPress: vi.fn(),
        generalError: "",
    }),
}));

vi.mock("../../../hooks", () => ({
    useLocale: vi.fn(),
    useConvertibleHeader: vi.fn(),
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
        emailHooks: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        passwordHooks: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        passwordConfirmHooks: {
            value: "",
            onChangeText: vi.fn(),
            onEndEditing: vi.fn(),
            error: "",
        },
        firstNameHooks: {
            value: "",
            onChangeText: vi.fn(),
            onEndEditing: vi.fn(),
            error: "",
        },
        lastNameHooks: {
            value: "",
            onChangeText: vi.fn(),
            onEndEditing: vi.fn(),
            error: "",
        },
        birthDay: undefined,
        onBirthDayChange: vi.fn(),
        gender: "male",
        onGenderChange: vi.fn(),
        newsletterHooks: { checked: false, onPress: vi.fn() },
        checkBoxHooks: { checked: false, onPress: vi.fn() },
        onSignupPress: vi.fn(),
        onCancelPress: vi.fn(),
        onLinkTextPress: vi.fn(),
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
