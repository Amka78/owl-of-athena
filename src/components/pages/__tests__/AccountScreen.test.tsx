import { render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { useAuthStore } from "../../../store/authStore";
import { useMessageStore } from "../../../store/messageStore";
import type { User, UserMessage } from "../../../types";
import { AccountScreen } from "../AccountScreen";

vi.mock("../../../hooks/useAccount", () => ({
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

describe("AccountScreen UnitTest", () => {
    beforeEach(() => {
        useMessageStore.setState({
            messages: [],
            loaded: true,
            loading: false,
            error: undefined,
        });
    });

    afterEach(() => {
        useAuthStore.setState({ user: undefined });
        useMessageStore.setState({
            messages: [],
            loaded: false,
            loading: false,
            error: undefined,
        });
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

    it("shows the unread message count", () => {
        const messages: UserMessage[] = [
            { id: "m1", title: "A", message: "", type: "info" },
            { id: "m2", title: "B", message: "", type: "info" },
            {
                id: "m3",
                title: "C",
                message: "",
                type: "info",
                read_at: "2026-11-04T00:00:00.000Z",
            },
        ];
        useMessageStore.setState({ messages });

        const { getByTestId } = renderWithProvider(<AccountScreen />);

        expect(getByTestId("unread-message-badge-text").props.children).toBe("2");
    });
});
