import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { Provider } from "react-native-paper";

import { ConfirmDialog } from "../../components/molecules/ConfirmDialog";
import { LoadingDialog } from "../../components/molecules/LoadingDialog";
import { Theme } from "../../constants";
import { type DeviceMaintenanceManager, useDeviceMaintenance } from "../useDeviceMaintenance";

const Harness = ({ manager }: { manager: DeviceMaintenanceManager }) => {
    const device = useDeviceMaintenance(manager);
    return (
        <>
            <Text onPress={device.onFormatSdCardPress}>format</Text>
            <Text onPress={device.onResetDevicePress}>reset</Text>
        </>
    );
};

const renderHarness = (manager: DeviceMaintenanceManager) =>
    render(
        <Provider theme={Theme}>
            <ConfirmDialog />
            <LoadingDialog />
            <Harness manager={manager} />
        </Provider>,
    );

const createManager = (
    connected = true,
): DeviceMaintenanceManager & { executeCommand: jest.Mock } => ({
    isConnected: jest.fn(() => connected),
    on: jest.fn(),
    off: jest.fn(),
    executeCommand: jest.fn(() => Promise.resolve()),
});

describe("useDeviceMaintenance", () => {
    it("formats the SD card after confirmation", async () => {
        const manager = createManager();
        const { getByText } = renderHarness(manager);

        fireEvent.press(getByText("format"));
        expect(getByText("Format the SD card?")).toBeTruthy();

        fireEvent.press(getByText("OK"));

        await waitFor(() => expect(manager.executeCommand).toHaveBeenCalledWith("sd-format"));
        expect(getByText("Complete")).toBeTruthy();
    });

    it("resets the device after confirmation", async () => {
        const manager = createManager();
        const { getByText } = renderHarness(manager);

        fireEvent.press(getByText("reset"));
        fireEvent.press(getByText("OK"));

        await waitFor(() => expect(manager.executeCommand).toHaveBeenCalledWith("os-reset"));
    });

    it("does nothing when Aurora is not connected", () => {
        const manager = createManager(false);
        const { getByText, queryByText } = renderHarness(manager);

        fireEvent.press(getByText("format"));
        fireEvent.press(getByText("reset"));

        expect(queryByText("Format the SD card?")).toBeNull();
        expect(manager.executeCommand).not.toHaveBeenCalled();
    });

    it("shows a failure dialog when the command fails", async () => {
        const manager = createManager();
        manager.executeCommand.mockRejectedValue(new Error("disconnected"));
        const { getByText, queryByText } = renderHarness(manager);

        fireEvent.press(getByText("format"));
        fireEvent.press(getByText("OK"));

        await waitFor(() => expect(getByText("Operation failed")).toBeTruthy());
        expect(queryByText("Formatting the SD card...")).toBeNull();
    });
});
