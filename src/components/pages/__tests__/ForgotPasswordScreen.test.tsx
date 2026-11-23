import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { ForgotPasswordScreen } from "../ForgotPasswordScreen";

vi.mock("../../../hooks/useForgotPassword", () => ({
    useForgotPassword: () => ({
        email: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        onSendPress: vi.fn(),
        onCancelPress: vi.fn(),
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
    useForgotPassword: () => ({
        email: { value: "", onChangeText: vi.fn(), onEndEditing: vi.fn(), error: "" },
        onSendPress: vi.fn(),
        onCancelPress: vi.fn(),
        generalError: "",
    }),
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
