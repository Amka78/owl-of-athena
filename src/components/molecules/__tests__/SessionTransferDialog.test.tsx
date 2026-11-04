import { act, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { useSessionTransferStore } from "../../../store/sessionTransferStore";
import { SessionTransferDialog } from "../SessionTransferDialog";

jest.mock("../../../managers", () => ({
    AuroraManagerInstance: {
        getUnsyncedSessions: jest.fn(() => new Promise(() => {})),
        pushSessions: jest.fn(),
    },
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SessionTransferDialog UnitTest", () => {
    afterEach(() => {
        useSessionTransferStore.getState().resetTransfer();
    });

    it("shows the per-session transfer progress", () => {
        const { getByText } = renderWithProvider(<SessionTransferDialog />);
        act(() => {
            SessionTransferDialog.show({ isAuroraConnected: true });
        });

        act(() => {
            useSessionTransferStore.setState({
                status: "transferring",
                progress: { phase: "uploading", completed: 1, total: 3 },
            });
        });

        expect(getByText("Transferring 1 / 3 sessions...")).toBeTruthy();
    });

    it("shows the reading phase", () => {
        const { getByText } = renderWithProvider(<SessionTransferDialog />);
        act(() => {
            SessionTransferDialog.show({ isAuroraConnected: true });
        });

        act(() => {
            useSessionTransferStore.setState({
                status: "transferring",
                progress: { phase: "reading", completed: 2, total: 3 },
            });
        });

        expect(getByText("Reading 2 / 3 sessions...")).toBeTruthy();
    });
});
