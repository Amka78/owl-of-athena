import { act, render } from "@testing-library/react-native";
import { Text } from "react-native";

import { AuroraManagerEventList } from "../../managers/AuroraManagerEventList";
import { AuroraOSInfo } from "../../sdk/models";
import { type DeviceInfoManager, useDeviceInfo } from "../useDeviceInfo";

const Harness = ({ manager }: { manager: DeviceInfoManager }) => {
    const osInfo = useDeviceInfo(manager);
    return <Text>{osInfo ? osInfo.version.toString() : "none"}</Text>;
};

const createManager = (
    osInfo?: AuroraOSInfo,
): DeviceInfoManager & {
    on: jest.Mock;
    off: jest.Mock;
    getOSInfo: jest.Mock<() => AuroraOSInfo | undefined>;
} => ({
    getOSInfo: vi.fn(() => osInfo),
    on: vi.fn(),
    off: vi.fn(),
});

describe("useDeviceInfo", () => {
    it("shows the initial OS info", () => {
        const osInfo = new AuroraOSInfo({ version: 10001 });
        const manager = createManager(osInfo);

        const { getByText } = render(<Harness manager={manager} />);

        expect(getByText("10001")).toBeTruthy();
    });

    it("refreshes the OS info on connection change", () => {
        let osInfo: AuroraOSInfo | undefined = new AuroraOSInfo({ version: 10001 });
        const manager = createManager(osInfo);
        const listeners: Record<string, () => void> = {};
        manager.on.mockImplementation((event: string, listener: () => void) => {
            listeners[event] = listener;
        });

        const { getByText } = render(<Harness manager={manager} />);
        expect(getByText("10001")).toBeTruthy();

        osInfo = new AuroraOSInfo({ version: 10002 });
        manager.getOSInfo.mockReturnValue(osInfo);

        act(() => {
            listeners[AuroraManagerEventList.onConnectionChange]?.();
        });

        expect(getByText("10002")).toBeTruthy();
    });

    it("subscribes to connection and battery events and unsubscribes on unmount", () => {
        const manager = createManager(new AuroraOSInfo({ version: 10001 }));

        const { unmount } = render(<Harness manager={manager} />);

        expect(manager.on).toHaveBeenCalledWith(
            AuroraManagerEventList.onConnectionChange,
            expect.any(Function),
        );
        expect(manager.on).toHaveBeenCalledWith(
            AuroraManagerEventList.onBatteryChange,
            expect.any(Function),
        );

        unmount();

        expect(manager.off).toHaveBeenCalledWith(
            AuroraManagerEventList.onConnectionChange,
            expect.any(Function),
        );
        expect(manager.off).toHaveBeenCalledWith(
            AuroraManagerEventList.onBatteryChange,
            expect.any(Function),
        );
    });
});
