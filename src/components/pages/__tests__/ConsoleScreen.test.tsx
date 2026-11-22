import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import { buildLogReport, shareText } from "../../../services/ExportService";
import { ConsoleScreen } from "../ConsoleScreen";

vi.mock("../../../managers", () => ({
    AuroraManagerInstance: {
        isConnected: () => false,
        executeCommand: vi.fn(),
    },
}));

vi.mock("../../../services/ExportService", () => ({
    buildLogReport: vi.fn(() => "log report"),
    shareText: vi.fn(() => Promise.resolve()),
}));

describe("ConsoleScreen UnitTest", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("shares the console logs", async () => {
        const { getByText } = render(<ConsoleScreen />);

        fireEvent.press(getByText("Share logs"));

        await waitFor(() => {
            expect(shareText).toHaveBeenCalledWith("Console Logs", "log report");
        });
        expect(buildLogReport).toHaveBeenCalled();
    });
});
