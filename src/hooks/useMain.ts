//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";

import { SessionRestClientInstance } from "../clients";
import { ConfirmDialog, LoadingDialog, SessionTransferDialog } from "../components/molecules";
import { AuroraInfoDialog } from "../components/molecules/AuroraInfoDialog";
import { Message, MessageKeys } from "../constants";
import { AuroraManagerEventList, AuroraManagerInstance } from "../managers";
import { ConnectionStates } from "../sdk";
import type { AuroraOSInfo, AuroraSession, AuroraSessionDetail } from "../sdk/models";
import { versionToString } from "../sdk/util";
import { onConnectionChange } from "../services/MainService";
import { useSessionStore } from "../store/sessionStore";
import { type FirmwareUpdate, type FirmwareUpdatePhase, GuestUser } from "../types";
import { useSessionDetailListSelector, useSessionListSelector, useUserSelector } from "./";
//#endregion

//#region Functions
const firmwareComponentLabel = (component: FirmwareUpdate["component"]): string => {
    switch (component) {
        case "bootloader":
            return Message.get(MessageKeys.firmware_component_bootloader);
        case "ble":
            return Message.get(MessageKeys.firmware_component_ble);
        default:
            return Message.get(MessageKeys.firmware_component_app);
    }
};
//#endregion

//#region Hooks
export const useMain = (): {
    connect: ConnectionStates;
    onConnectionStatesPress: () => Promise<string>;
    onHomePress: () => void;
    onProfilesPress: () => void;
    onSessionsPress: () => void;
    onSettingsPress: () => void;
    onDeviceInfoPress: () => void;
    batteryLevel: number;
    currentFirmwareVersion: string;
    error: string;
} => {
    const { cacheSessions, cacheSessionDetails } = useSessionStore();
    const sessionList = useSessionListSelector();
    const sessionDetailList = useSessionDetailListSelector();
    const userInfo = useUserSelector();
    const [connect, setConnect] = useState<ConnectionStates>(ConnectionStates.DISCONNECTED);
    const [batteryLevel, setBatteryLevel] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const firmwareVersion = useRef<string>("");
    const osInfoRef = useRef<AuroraOSInfo | undefined>(undefined);
    const userId = userInfo?.id;
    const { navigate } = useNavigation<any>();
    const onConnectionChangeEventHandler = useRef((connectionState: ConnectionStates): void => {
        console.debug("Called onConnectionChangeHandler");
        onConnectionChange(connectionState, connect, (state: ConnectionStates) => {
            setConnect(state);
        });
    });
    const onBatteryLevelChangeEventHandler = useRef((batteryLevel: number): void => {
        setBatteryLevel(batteryLevel);
    });

    useEffect(() => {
        let unmounted = false;
        const f = async (): Promise<void> => {
            if (!unmounted && userId !== undefined) {
                if (sessionList.length <= 0 && userId !== GuestUser) {
                    const remoteSessionList = await SessionRestClientInstance.getAll(userId);
                    cacheSessions(remoteSessionList);
                }
            }
        };
        f();

        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [cacheSessions, sessionList.length, userId]);

    const installFirmware = useCallback(async (update: FirmwareUpdate): Promise<void> => {
        const componentLabel = firmwareComponentLabel(update.component);
        const phaseTitle = (phase: FirmwareUpdatePhase): string => {
            const key =
                phase === "uploading"
                    ? MessageKeys.firmware_update_uploading_with_component
                    : phase === "verifying"
                      ? MessageKeys.firmware_update_verifying_with_component
                      : MessageKeys.firmware_update_flashing_with_component;
            return Message.get(key, [componentLabel]);
        };
        LoadingDialog.show({ dialogTitle: phaseTitle("uploading") });

        let resultMessage: string;
        try {
            const info = await AuroraManagerInstance.flashFirmware(update, (phase) => {
                LoadingDialog.show({ dialogTitle: phaseTitle(phase) });
            });
            firmwareVersion.current = info.version.toString();
            osInfoRef.current = info;
            setBatteryLevel(info.batteryLevel);
            resultMessage = Message.get(MessageKeys.firmware_update_success_with_component, [
                componentLabel,
                versionToString(update.version),
            ]);
        } catch (e) {
            console.error("[useMain] firmware update failed:", e);
            resultMessage = Message.get(MessageKeys.firmware_update_failed_with_component, [
                componentLabel,
                String(e),
            ]);
        } finally {
            LoadingDialog.close();
        }

        ConfirmDialog.show({
            title: Message.get(MessageKeys.firmware_update_title),
            message: resultMessage,
            isCancelable: false,
        });
    }, []);

    const promptFirmwareUpdate = useCallback(async (): Promise<void> => {
        let update: FirmwareUpdate | undefined;
        try {
            update = await AuroraManagerInstance.getFirmwareUpdate();
        } catch (e) {
            console.error("[useMain] failed to check the firmware version:", e);
            return;
        }
        if (update === undefined) return;

        // 電池が少ない状態で書き込むと端末が復帰できなくなる可能性がある
        if (AuroraManagerInstance.isBatteryLow()) {
            ConfirmDialog.show({
                title: Message.get(MessageKeys.firmware_update_title),
                message: Message.get(MessageKeys.firmware_update_battery_low),
                isCancelable: true,
            });
            return;
        }

        const componentLabel = firmwareComponentLabel(update.component);
        const baseMessage = Message.get(MessageKeys.firmware_update_message_with_component, [
            componentLabel,
            versionToString(update.version),
        ]);
        const message = update.notes ? `${baseMessage}\n\n${update.notes}` : baseMessage;

        ConfirmDialog.show({
            title: Message.get(MessageKeys.firmware_update_title),
            message,
            isCancelable: true,
            onConfirm: () => {
                void installFirmware(update);
            },
        });
    }, [installFirmware]);

    const onConnectionStatesPress = useCallback(async (): Promise<string> => {
        console.debug("Start configuring aurora.");

        let error = "";
        try {
            LoadingDialog.show({
                dialogTitle: Message.get(MessageKeys.home_go_to_sleep_loading_message),
            });

            setError("");
            await executeConfiguring(
                connect === ConnectionStates.CONNECTED
                    ? ConnectionStates.DISCONNECTING
                    : ConnectionStates.CONNECTING,
                userInfo?.id === GuestUser,
                (session: [Array<AuroraSession>, Array<AuroraSessionDetail>]) => {
                    sessionList.unshift(...session[0]);
                    sessionDetailList.unshift(...session[1]);

                    cacheSessions(sessionList);
                    cacheSessionDetails(sessionDetailList);
                },
                (osInfo: AuroraOSInfo) => {
                    setConnect(ConnectionStates.CONNECTED);
                    console.debug(`AuroraOSInfo:${osInfo}`);
                    firmwareVersion.current = osInfo.version.toString();
                    osInfoRef.current = osInfo;
                    setBatteryLevel(osInfo.batteryLevel);
                    AuroraManagerInstance.on(
                        AuroraManagerEventList.onConnectionChange,
                        onConnectionChangeEventHandler.current,
                    );
                    AuroraManagerInstance.on(
                        AuroraManagerEventList.onBatteryChange,
                        onBatteryLevelChangeEventHandler.current,
                    );
                },
                () => {
                    AuroraManagerInstance.off(
                        AuroraManagerEventList.onConnectionChange,
                        onConnectionChangeEventHandler.current,
                    );
                    AuroraManagerInstance.off(
                        AuroraManagerEventList.onBatteryChange,
                        onBatteryLevelChangeEventHandler.current,
                    );
                    setConnect(ConnectionStates.DISCONNECTED);
                },
            );
        } catch (e) {
            const err = e as Error;
            setError(err.message);
            error = err.message;
            console.error(e);
        } finally {
            LoadingDialog.close();
        }

        // 接続できたときだけファームウェアの更新を確認する
        if (error === "" && connect !== ConnectionStates.CONNECTED) {
            void promptFirmwareUpdate();
        }

        return error;
    }, [
        cacheSessionDetails,
        cacheSessions,
        connect,
        promptFirmwareUpdate,
        sessionDetailList,
        sessionList,
        userInfo?.id,
    ]);

    const onHomePress = useCallback(() => {
        navigate("Home");
    }, [navigate]);

    const onProfilesPress = useCallback(() => {
        navigate("Profiles");
    }, [navigate]);

    const onSessionsPress = useCallback(() => {
        navigate("Sessions");
    }, [navigate]);

    const onSettingsPress = useCallback(() => {
        navigate("Settings");
    }, [navigate]);

    const onDeviceInfoPress = useCallback(() => {
        if (osInfoRef.current) {
            AuroraInfoDialog.show({ osInfo: osInfoRef.current });
        }
    }, []);

    const currentFirmwareVersion = firmwareVersion.current;
    return {
        connect,
        onConnectionStatesPress,
        onHomePress,
        onProfilesPress,
        onSessionsPress,
        onSettingsPress,
        onDeviceInfoPress,
        batteryLevel,
        currentFirmwareVersion,
        error,
    };
};
//#endregion

//#region Function
async function executeConfiguring(
    connectStatus: ConnectionStates,
    isGuest: boolean,
    pushedSessionCallback: (session: [Array<AuroraSession>, Array<AuroraSessionDetail>]) => void,
    connectedCallback: (osInfo: AuroraOSInfo) => void,
    disconnectedCallback: () => void,
): Promise<void> {
    let result;

    try {
        if (connectStatus === ConnectionStates.CONNECTING) {
            result = (await AuroraManagerInstance.connect()) as AuroraOSInfo;
            connectedCallback(result);

            if (result.batteryLevel < 25) {
                ConfirmDialog.show({
                    title: Message.get(MessageKeys.aurora_low_battery_dialog_title),
                    message: Message.get(MessageKeys.aurora_low_battery_dialog_message, [
                        result.batteryLevel.toLocaleString(),
                    ]),
                    isCancelable: false,
                });
            } else {
                console.debug("Sart getUnsycedSessions.");
                const unsyncedSessions = await AuroraManagerInstance.getUnsyncedSessions();
                console.debug("Completed getUnsyncedSessions:", unsyncedSessions);

                if (unsyncedSessions.length > 0 && AuroraManagerInstance.isConfiguring()) {
                    SessionTransferDialog.show({
                        isAuroraConnected: true,
                        onTransferComplete: async () => {
                            LoadingDialog.show({
                                dialogTitle: Message.get(
                                    MessageKeys.home_go_to_sleep_loading_message,
                                ),
                            });
                            try {
                                const result = await AuroraManagerInstance.pushSessions(
                                    unsyncedSessions,
                                    isGuest,
                                );
                                pushedSessionCallback([result.sessions, result.sessionDetails]);
                            } finally {
                                LoadingDialog.close();
                            }
                        },
                    });
                }
            }
        } else {
            result = await AuroraManagerInstance.disconnect();

            disconnectedCallback();
        }
        console.debug("Succeed configuring aurora.", result);
    } catch (e) {
        console.error(e);
        throw e;
    }
}
//#endregion
