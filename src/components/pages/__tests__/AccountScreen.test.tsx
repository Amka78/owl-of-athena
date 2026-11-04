import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { useAuthStore } from "../../../store/authStore";
import type { User } from "../../../types";
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
    afterEach(() => {
        useAuthStore.setState({ user: undefined });
    });

    it("renders correctly", () => {
        const { toJSON } = renderWithProvider(<AccountScreen />);
        expect(toJSON()).toMatchSnapshot();
    });

    it("renders without crashing", () => {
        expect(() => renderWithProvider(<AccountScreen />)).not.toThrow();
    });

    it("shows the console entry for admins", () => {
        useAuthStore.setState({
            user: {
                id: "user-1",
                roles: [{ id: "admin", slug: "admin", title: "Admin" }],
            } as User,
        });

        const { getByText } = renderWithProvider(<AccountScreen />);
        expect(getByText("Console")).toBeTruthy();
    });

    it("hides the console entry for non-admins", () => {
        useAuthStore.setState({
            user: {
                id: "user-1",
                roles: [{ id: "user", slug: "user", title: "User" }],
            } as User,
        });

        const { queryByText } = renderWithProvider(<AccountScreen />);
        expect(queryByText("Console")).toBeNull();
    });
});
