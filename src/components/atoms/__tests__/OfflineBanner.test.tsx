import { render } from "@testing-library/react-native";
import React from "react";

import { useNetworkStatus } from "../../../hooks/useNetworkStatus";
import { OfflineBanner } from "../OfflineBanner";

jest.mock("../../../hooks/useNetworkStatus", () => ({
    useNetworkStatus: jest.fn(),
}));

const mockUseNetworkStatus = useNetworkStatus as jest.Mock;

describe("OfflineBanner UnitTest", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("shows the message when offline", () => {
        mockUseNetworkStatus.mockReturnValue("offline");

        const { getByText, getByTestId } = render(<OfflineBanner />);

        expect(getByTestId("offline-banner")).toBeTruthy();
        expect(getByText("You are offline. Some features are unavailable.")).toBeTruthy();
    });

    it("renders nothing while online", () => {
        mockUseNetworkStatus.mockReturnValue("online");

        const { queryByTestId } = render(<OfflineBanner />);

        expect(queryByTestId("offline-banner")).toBeNull();
    });

    it("renders nothing while the state is unknown", () => {
        mockUseNetworkStatus.mockReturnValue("unknown");

        const { queryByTestId } = render(<OfflineBanner />);

        expect(queryByTestId("offline-banner")).toBeNull();
    });
});
