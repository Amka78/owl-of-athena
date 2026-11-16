import { useCallback, useEffect, useState } from "react";

import { MessageKeys } from "../constants";
import { AuroraManagerEventList, AuroraManagerInstance } from "../managers";
import {
    confirmDeviceMaintenance,
    runDeviceMaintenanceCommand,
} from "../services/DeviceMaintenanceService";

export type DeviceMaintenance = {
    connected: boolean;
    busy: boolean;
    onFormatSdCardPress: () => void;
    onResetDevicePress: () => void;
};

export type DeviceMaintenanceManager = {
    isConnected: () => boolean;
    on: (event: string, listener: () => void) => unknown;
    off: (event: string, listener: () => void) => unknown;
    executeCommand: (command: string) => Promise<unknown>;
};

export const useDeviceMaintenance = (
    manager: DeviceMaintenanceManager = AuroraManagerInstance,
): DeviceMaintenance => {
    const [connected, setConnected] = useState(manager.isConnected());
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        const updateConnection = (): void => {
            setConnected(manager.isConnected());
        };

        manager.on(AuroraManagerEventList.onConnectionChange, updateConnection);
        updateConnection();

        return (): void => {
            manager.off(AuroraManagerEventList.onConnectionChange, updateConnection);
        };
    }, [manager]);

    const runCommand = useCallback(
        async (command: string, inProgressKey: string, successKey: string): Promise<void> => {
            setBusy(true);
            await runDeviceMaintenanceCommand(
                () => manager.executeCommand(command),
                inProgressKey,
                successKey,
            );
            setBusy(false);
        },
        [manager],
    );

    const onFormatSdCardPress = useCallback((): void => {
        if (!connected || busy) return;
        confirmDeviceMaintenance(
            MessageKeys.device_sd_format_confirm_title,
            MessageKeys.device_sd_format_confirm_message,
            () => {
                void runCommand(
                    "sd-format",
                    MessageKeys.device_sd_format_in_progress,
                    MessageKeys.device_sd_format_success,
                );
            },
        );
    }, [busy, connected, runCommand]);

    const onResetDevicePress = useCallback((): void => {
        if (!connected || busy) return;
        confirmDeviceMaintenance(
            MessageKeys.device_reset_confirm_title,
            MessageKeys.device_reset_confirm_message,
            () => {
                void runCommand(
                    "os-reset",
                    MessageKeys.device_reset_in_progress,
                    MessageKeys.device_reset_success,
                );
            },
        );
    }, [busy, connected, runCommand]);

    return { connected, busy, onFormatSdCardPress, onResetDevicePress };
};
