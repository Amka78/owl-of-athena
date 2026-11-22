import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { WelcomeScreen } from "../WelcomeScreen";

vi.mock("../../../hooks/useWelcome", () => ({
    useWelcome: () => ({
        onStandalonePress: vi.fn(),
        onLoginPress: vi.fn(),
        onCancelPress: vi.fn(),
        onSignupPress: vi.fn(),
    }),
}));

vi.mock("../../../hooks/useAutoLogin", () => ({
    useAutoLogin: vi.fn(),
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
    useWelcome: () => ({
        onStandalonePress: vi.fn(),
        onLoginPress: vi.fn(),
        onCancelPress: vi.fn(),
        onSignupPress: vi.fn(),
    }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("WelcomeScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<WelcomeScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<WelcomeScreen />)).not.toThrow();
    });
});
