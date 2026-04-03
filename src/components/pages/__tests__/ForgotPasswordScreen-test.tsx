import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ForgotPasswordScreen } from "../ForgotPassswordScreen";

jest.mock("../../../hooks/useForgotPassword", () => ({
    useForgotPassword: () => ({
        email: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        onSendPress: jest.fn(),
        onCancelPress: jest.fn(),
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
    useForgotPassword: () => ({
        email: { value: "", onChangeText: jest.fn(), onEndEditing: jest.fn(), error: "" },
        onSendPress: jest.fn(),
        onCancelPress: jest.fn(),
        generalError: "",
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));


const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("ForgotPasswordScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<ForgotPasswordScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<ForgotPasswordScreen />)).not.toThrow();
    });
});
