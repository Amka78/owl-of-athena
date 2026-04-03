import React from "react";
import { render } from "@testing-library/react-native";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { WelcomeScreen } from "../WelcomeScreen";

jest.mock("../../../hooks/useWelcome", () => ({
    useWelcome: () => ({
        onStandalonePress: jest.fn(),
        onLoginPress: jest.fn(),
        onCancelPress: jest.fn(),
        onSignupPress: jest.fn(),
    }),
}));

jest.mock("../../../hooks/useAutoLogin", () => ({
    useAutoLogin: jest.fn(),
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
    useWelcome: () => ({
        onStandalonePress: jest.fn(),
        onLoginPress: jest.fn(),
        onCancelPress: jest.fn(),
        onSignupPress: jest.fn(),
    }),
}));

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
}));

jest.mock("react-redux", () => ({
    useSelector: jest.fn(() => ({})),
    useDispatch: () => jest.fn(),
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
