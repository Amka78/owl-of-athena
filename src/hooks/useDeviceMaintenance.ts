import { useCallback, useEffect, useState } from "react";

import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { Message, MessageKeys } from "../constants";
import { AuroraManagerEventList, AuroraManagerInstance } from "../managers";

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
            LoadingDialog.show({ dialogTitle: Message.get(inProgressKey) });
            try {
                await manager.executeCommand(command);
                ConfirmDialog.show({
                    title: Message.get(MessageKeys.device_operation_complete_title),
                    message: Message.get(successKey),
                    isCancelable: false,
                });
            } catch (e) {
                ConfirmDialog.show({
                    title: Message.get(MessageKeys.device_operation_failed_title),
                    message: Message.get(MessageKeys.device_operation_failed_message, [String(e)]),
                    isCancelable: false,
                });
            } finally {
                LoadingDialog.close();
                setBusy(false);
            }
        },
        [manager],
    );

    const onFormatSdCardPress = useCallback((): void => {
        if (!connected || busy) return;
        ConfirmDialog.show({
            title: Message.get(MessageKeys.device_sd_format_confirm_title),
            message: Message.get(MessageKeys.device_sd_format_confirm_message),
            isCancelable: true,
            onConfirm: () => {
                void runCommand(
                    "sd-format",
                    MessageKeys.device_sd_format_in_progress,
                    MessageKeys.device_sd_format_success,
                );
            },
        });
    }, [busy, connected, runCommand]);

    const onResetDevicePress = useCallback((): void => {
        if (!connected || busy) return;
        ConfirmDialog.show({
            title: Message.get(MessageKeys.device_reset_confirm_title),
            message: Message.get(MessageKeys.device_reset_confirm_message),
            isCancelable: true,
            onConfirm: () => {
                void runCommand(
                    "os-reset",
                    MessageKeys.device_reset_in_progress,
                    MessageKeys.device_reset_success,
                );
            },
        });
    }, [busy, connected, runCommand]);

    return { connected, busy, onFormatSdCardPress, onResetDevicePress };
};
