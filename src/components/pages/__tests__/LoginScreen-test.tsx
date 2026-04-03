import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { LoginScreen } from "../LoginScreen";

jest.mock("../../../hooks/useLogin", () => ({
    useLogin: () => ({
        email: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        password: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        onLoginPress: jest.fn(),
        onCancelPress: jest.fn(),
        generalError: "",
        onForgotPasswordPress: jest.fn(),
        onSignupPress: jest.fn(),
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
    useLogin: () => ({
        email: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        password: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        onLoginPress: jest.fn(),
        onCancelPress: jest.fn(),
        generalError: "",
        onForgotPasswordPress: jest.fn(),
        onSignupPress: jest.fn(),
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
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
