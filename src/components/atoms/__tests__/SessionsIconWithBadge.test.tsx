import { render } from "@testing-library/react-native";

import { SessionsIconWithBadge } from "../SessionsIconWithBadge";

describe("SessionsIconWithBadge UnitTest", () => {
    it("renders the icon without a badge when the count is zero", () => {
        const { queryByTestId } = render(<SessionsIconWithBadge badgeCount={0} />);

        expect(queryByTestId("session-badge-text")).toBeNull();
    });

    it("shows the unsynced count", () => {
        const { getByTestId } = render(<SessionsIconWithBadge badgeCount={3} />);

        expect(getByTestId("session-badge-text").props.children).toBe("3");
    });

    it("caps the badge at 99+", () => {
        const { getByTestId } = render(<SessionsIconWithBadge badgeCount={120} />);

        expect(getByTestId("session-badge-text").props.children).toBe("99+");
    });
});
