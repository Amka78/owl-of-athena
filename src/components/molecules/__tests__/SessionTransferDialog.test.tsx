import { act, fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { SessionTransferDialog } from "../SessionTransferDialog";

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

describe("SessionTransferDialog UnitTest", () => {
    it("does not show the dialog initially", () => {
        const { queryByText } = renderWithProvider(<SessionTransferDialog />);
        expect(queryByText("Sync Sessions")).toBeNull();
    });

    it("shows the unsynced session count when shown", () => {
        const { getByText } = renderWithProvider(<SessionTransferDialog />);
        act(() => {
            SessionTransferDialog.show({ unsyncedCount: 3 });
        });

        expect(getByText("You have 3 unsynced sessions. Sync now?")).toBeTruthy();
    });

    it("calls onConfirm when Sync is pressed", () => {
        const onConfirm = jest.fn();
        const { getByText } = renderWithProvider(<SessionTransferDialog />);
        act(() => {
            SessionTransferDialog.show({ unsyncedCount: 3, onConfirm });
        });

        fireEvent.press(getByText("Sync"));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Cancel is pressed", () => {
        const onClose = jest.fn();
        const { getByText } = renderWithProvider(<SessionTransferDialog />);
        act(() => {
            SessionTransferDialog.show({ unsyncedCount: 3, onClose });
        });

        fireEvent.press(getByText("Cancel"));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
