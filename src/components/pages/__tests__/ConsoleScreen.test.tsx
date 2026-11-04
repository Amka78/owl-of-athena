import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import { buildLogReport, shareText } from "../../../services/ExportService";
import { ConsoleScreen } from "../ConsoleScreen";

jest.mock("../../../managers", () => ({
    AuroraManagerInstance: {
        isConnected: () => false,
        executeCommand: jest.fn(),
    },
}));

jest.mock("../../../services/ExportService", () => ({
    buildLogReport: jest.fn(() => "log report"),
    shareText: jest.fn(() => Promise.resolve()),
}));

describe("ConsoleScreen UnitTest", () => {
    afterEach(() => {
        jest.clearAllMocks();
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