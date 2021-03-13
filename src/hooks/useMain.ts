//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { cacheSessionDetails, cacheSessions } from "../actions";
import { SessionRestClientInstance } from "../clients";
import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { Message, MessageKeys } from "../constants";
import { AuroraManagerEventList, AuroraManagerInstance } from "../managers";
import { ConnectionStates } from "../sdk";
import {
    AuroraOSInfo,
    AuroraSession,
    AuroraSessionDetail,
} from "../sdk/models";
import { onConnectionChange } from "../services/MainService";
import { GuestUser } from "../types";
import {
    useSessionDetailListSelector,
    useSessionListSelector,
    useUserSelector,
} from "./";
//#endregion

//#region Hooks
export const useMain = (): {
    connect: ConnectionStates;
    onConnectionStatesPress: () => Promise<string>;
    onHomePress: () => void;
    onProfilesPress: () => void;
    onSessionsPress: () => void;
    onSettingsPress: () => void;
    batteryLevel: number;
    currentFirmwareVersion: string;
    error: string;
} => {
    const dispatch = useDispatch();
    const sessionList = useSessionListSelector();
    const sessionDetailList = useSessionDetailListSelector();
    const userInfo = useUserSelector();
    const [connect, setConnect] = useState<ConnectionStates>(
        ConnectionStates.DISCONNECTED
    );
    const [batteryLevel, setBatteryLevel] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const firmwareVersion = useRef<string>("");
    const { navigate } = useNavigation();
    const onConnectionChangeEventHandler = useRef(
        (connectionState: ConnectionStates): void => {
            console.debug("Called onConnectionChangeHandler");
            onConnectionChange(
                connectionState,
                connect,
                (state: ConnectionStates) => {
                    setConnect(state);
                }
            );
        }
    );
    const onBatteryLevelChangeEventHandler = useRef(
        (batteryLevel: number): void => {
            setBatteryLevel(batteryLevel);
        }
    );

    useEffect(() => {
        let unmounted = false;
        const f = async (): Promise<void> => {
            if (!unmounted && userInfo !== undefined) {
                if (sessionList.length <= 0 && userInfo.id !== GuestUser) {
                    const remoteSessionList = await SessionRestClientInstance.getAll(
                        userInfo.id
                    );
                    dispatch(cacheSessions(remoteSessionList));
                }
            }
        };
        f();

        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup();
    }, [connect, dispatch, sessionList, userInfo]);

    const onConnectionStatesPress = useCallback(async (): Promise<string> => {
        console.debug("Start configuring aurora.");

        let error = "";
        try {
            LoadingDialog.show({
                dialogTitle: Message.get(
                    MessageKeys.home_go_to_sleep_loading_message
                ),
            });

            setError("");
            await executeConfiguring(
                connect === ConnectionStates.CONNECTED
                    ? ConnectionStates.DISCONNECTING
                    : ConnectionStates.CONNECTING,
                userInfo?.id === GuestUser,
                (
                    session: [Array<AuroraSession>, Array<AuroraSessionDetail>]
                ) => {
                    sessionList.unshift(...session[0]);
                    sessionDetailList.unshift(...session[1]);

                    dispatch(cacheSessions(sessionList));
                    dispatch(cacheSessionDetails(sessionDetailList));
                },
                (osInfo: AuroraOSInfo) => {
                    setConnect(ConnectionStates.CONNECTED);
                    console.debug(`AuroraOSInfo:${osInfo}`);
                    firmwareVersion.current = osInfo.version.toString();
                    setBatteryLevel(osInfo.batteryLevel);
                    AuroraManagerInstance.on(
                        AuroraManagerEventList.onConnectionChange,
                        onConnectionChangeEventHandler.current
                    );
                    AuroraManagerInstance.on(
                        AuroraManagerEventList.onBatteryChange,
                        onBatteryLevelChangeEventHandler.current
                    );
                },
                () => {
                    AuroraManagerInstance.off(
                        AuroraManagerEventList.onConnectionChange,
                        onConnectionChangeEventHandler.current
                    );
                    AuroraManagerInstance.off(
                        AuroraManagerEventList.onBatteryChange,
                        onBatteryLevelChangeEventHandler.current
                    );
                    setConnect(ConnectionStates.DISCONNECTED);
                }
            );
        } catch (e) {
            setError(e);
            error = e;
            console.error(e);
        } finally {
            LoadingDialog.close();
        }

        return error;
    }, [connect, dispatch, sessionDetailList, sessionList, userInfo?.id]);

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

    const currentFirmwareVersion = firmwareVersion.current;
    return {
        connect,
        onConnectionStatesPress,
        onHomePress,
        onProfilesPress,
        onSessionsPress,
        onSettingsPress,
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
    pushedSessionCallback: (
        session: [Array<AuroraSession>, Array<AuroraSessionDetail>]
    ) => void,
    connectedCallback: (osInfo: AuroraOSInfo) => void,
    disconnectedCallback: () => void
): Promise<void> {
    let result = undefined;

    try {
        if (connectStatus === ConnectionStates.CONNECTING) {
            result = (await AuroraManagerInstance.connect()) as AuroraOSInfo;
            connectedCallback(result);

            if (result.batteryLevel < 25) {
                ConfirmDialog.show({
                    title: Message.get(
                        MessageKeys.aurora_low_battery_dialog_title
                    ),
                    message: Message.get(
                        MessageKeys.aurora_low_battery_dialog_message,
                        [result.batteryLevel.toLocaleString()]
                    ),
                    isCancelable: false,
                });
            } else {
                console.debug("Sart getUnsycedSessions.");
                const unsyncedSessions = await AuroraManagerInstance.getUnsyncedSessions();
                console.debug(
                    "Completed getUnsyncedSessions:",
                    unsyncedSessions
                );

                if (
                    unsyncedSessions.length > 0 &&
                    AuroraManagerInstance.isConfiguring()
                ) {
                    ConfirmDialog.show({
                        title: Message.get(
                            MessageKeys.aurora_unsynced_sessions_dialog_title
                        ),
                        message: Message.get(
                            MessageKeys.aurora_unsynced_sessions_dialog_message,
                            [unsyncedSessions.length.toString()]
                        ),
                        onConfirm: async (): Promise<void> => {
                            LoadingDialog.show({
                                dialogTitle: Message.get(
                                    MessageKeys.home_go_to_sleep_loading_message
                                ),
                            });
                            try {
                                const result = await AuroraManagerInstance.pushSessions(
                                    unsyncedSessions,
                                    isGuest
                                );

                                pushedSessionCallback(result);
                            } finally {
                                LoadingDialog.close();
                            }
                        },
                        isCancelable: true,
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
