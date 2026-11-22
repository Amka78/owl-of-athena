import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";
import { Theme } from "../../../constants";
import { AccountEditScreen } from "../AccountEditScreen";

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
    useAcount: () => ({
        loading: false,
        firstName: "Jane",
        onFirstNameChangeText: vi.fn(),
        lastName: "Doe",
        onLastNameChangeText: vi.fn(),
        birthDay: new Date("1990-01-15"),
        onBirthDayChange: vi.fn(),
        gender: "female",
        onGenderChange: vi.fn(),
        countryCode: "JP",
        onCountryCodeChangeText: vi.fn(),
        postalCode: "100-0001",
        onPostalCodeChangeText: vi.fn(),
        onSavePress: vi.fn(),
        onLogoutPress: vi.fn(),
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
