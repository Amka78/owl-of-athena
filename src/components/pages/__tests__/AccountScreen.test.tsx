import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { AccountScreen } from "../AccountScreen";

jest.mock("../../../hooks/useAccount", () => ({
    useAcount: () => ({
        loading: false,
        firstName: "Jane",
        onFirstNameChangeText: jest.fn(),
        lastName: "Doe",
        onLastNameChangeText: jest.fn(),
        birthDay: new Date("1990-01-15"),
        onBirthDayChange: jest.fn(),
        gender: "female",
        onGenderChange: jest.fn(),
        onSavePress: jest.fn(),
        onLogoutPress: jest.fn(),
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
    useAcount: () => ({
        loading: false,
        firstName: "Jane",
        onFirstNameChangeText: jest.fn(),
        lastName: "Doe",
        onLastNameChangeText: jest.fn(),
        birthDay: new Date("1990-01-15"),
        onBirthDayChange: jest.fn(),
        gender: "female",
        onGenderChange: jest.fn(),
        onSavePress: jest.fn(),
        onLogoutPress: jest.fn(),
        generalError: "",
    }),
}));


const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("AccountScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<AccountScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<AccountScreen />)).not.toThrow();
    });
});
