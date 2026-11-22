import { fireEvent, render } from "@testing-library/react-native";
import type React from "react";
import { Provider } from "react-native-paper";

import { Theme } from "../../../constants";
import { useDeviceInfo } from "../../../hooks/useDeviceInfo";
import { useDeviceMaintenance } from "../../../hooks/useDeviceMaintenance";
import { AuroraOSInfo } from "../../../sdk/models";
import { DeviceScreen } from "../DeviceScreen";

vi.mock("../../../hooks/useDeviceInfo", () => ({
    useDeviceInfo: vi.fn(),
}));

vi.mock("../../../hooks/useDeviceMaintenance", () => ({
    useDeviceMaintenance: vi.fn(),
}));

const renderWithProvider = (ui: React.ReactElement) =>
    render(<Provider theme={Theme}>{ui}</Provider>);

const mockUseDeviceInfo = useDeviceInfo as jest.Mock;
const mockUseDeviceMaintenance = useDeviceMaintenance as jest.Mock;

describe("DeviceScreen UnitTest", () => {
    beforeEach(() => {
        mockUseDeviceInfo.mockReturnValue(undefined);
        mockUseDeviceMaintenance.mockReturnValue({
            connected: false,
            busy: false,
            onFormatSdCardPress: vi.fn(),
            onResetDevicePress: vi.fn(),
        });
    });

    it("shows the connect hint when Aurora is not connected", () => {
        const { getByText } = renderWithProvider(<DeviceScreen />);

        expect(getByText("Connect to Aurora to use this.")).toBeTruthy();
        expect(getByText("Format SD card")).toBeTruthy();
        expect(getByText("Reset Aurora")).toBeTruthy();
    });

    it("shows OS info rows when connected", () => {
        const osInfo = new AuroraOSInfo({
            version: 10001,
            bootloaderVersion: 1,
            bleVersion: 2,
            bootstrapVersion: 3,
            batteryLevel: 87,
            buildDate: Date.UTC(2017, 0, 1, 5, 5, 5),
            bytesFree: 5555,
            runningTime: "5.20 h",
        });
        mockUseDeviceInfo.mockReturnValue(osInfo);
        mockUseDeviceMaintenance.mockReturnValue({
            connected: true,
            busy: false,
            onFormatSdCardPress: vi.fn(),
            onResetDevicePress: vi.fn(),
        });

        const { getByText } = renderWithProvider(<DeviceScreen />);

        expect(getByText("Firmware Version")).toBeTruthy();
        expect(getByText("10001")).toBeTruthy();
        expect(getByText("Battery Level")).toBeTruthy();
        expect(getByText("87%")).toBeTruthy();
        expect(getByText("2017-01-01 05:05 UTC")).toBeTruthy();
        expect(getByText("5.4 KB")).toBeTruthy();
    });

    it("calls the maintenance handlers when connected", () => {
        const onFormatSdCardPress = vi.fn();
        const onResetDevicePress = vi.fn();
        mockUseDeviceInfo.mockReturnValue(new AuroraOSInfo({ version: 10001 }));
        mockUseDeviceMaintenance.mockReturnValue({
            connected: true,
            busy: false,
            onFormatSdCardPress,
            onResetDevicePress,
        });

        const { getByText } = renderWithProvider(<DeviceScreen />);

        fireEvent.press(getByText("Format SD card"));
        fireEvent.press(getByText("Reset Aurora"));

        expect(onFormatSdCardPress).toHaveBeenCalledTimes(1);
        expect(onResetDevicePress).toHaveBeenCalledTimes(1);
    });
});
