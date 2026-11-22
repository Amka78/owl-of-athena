import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { LoginScreen } from "../LoginScreen";

vi.mock("../../../hooks/useLogin", () => ({
    useLogin: () => ({
        email: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        password: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        onLoginPress: vi.fn(),
        onCancelPress: vi.fn(),
        generalError: "",
        onForgotPasswordPress: vi.fn(),
        onSignupPress: vi.fn(),
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
    useLogin: () => ({
        email: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        password: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        onLoginPress: vi.fn(),
        onCancelPress: vi.fn(),
        generalError: "",
        onForgotPasswordPress: vi.fn(),
        onSignupPress: vi.fn(),
    }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("LoginScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<LoginScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<LoginScreen />)).not.toThrow();
    });
});
