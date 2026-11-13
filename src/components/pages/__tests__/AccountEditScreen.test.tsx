import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { AccountEditScreen } from "../AccountEditScreen";

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
        countryCode: "JP",
        onCountryCodeChangeText: jest.fn(),
        postalCode: "100-0001",
        onPostalCodeChangeText: jest.fn(),
        onSavePress: jest.fn(),
        onLogoutPress: jest.fn(),
        generalError: "",
    }),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("AccountEditScreen UnitTest", () => {
    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<AccountEditScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<AccountEditScreen />)).not.toThrow();
    });
});
